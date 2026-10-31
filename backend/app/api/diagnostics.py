import json
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.curriculum import Chapter, Concept
from app.models.question import Question
from app.models.assessment import Assessment, AssessmentAttempt, AnswerSubmission, DetectedMisconception
from app.models.learner import ConceptMastery, MasteryEventHistory, RevisionSchedule
from app.schemas.assessment import (
    DiagnosticStartResponse, DiagnosticSubmitRequest, DiagnosticSubmitResponse,
    ConceptMasteryBaseline
)
from app.schemas.question import QuestionOut, QuestionOptionOut
from app.api.deps import get_current_student
from app.engine.evaluator import evaluator
from app.engine.learner_model import bkt_engine
from app.engine.misconception_detector import misconception_detector
from app.engine.spaced_repetition import sr_scheduler

router = APIRouter(prefix="/diagnostics", tags=["Diagnostic Assessment"])

@router.post("/start", response_model=DiagnosticStartResponse)
def start_diagnostic(
    student: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    # Ensure diagnostic assessment exists
    diag_assessment = db.query(Assessment).filter(Assessment.assessment_type == "diagnostic").first()
    if not diag_assessment:
        diag_assessment = Assessment(
            title="CBSE Class 10 Physics Diagnostic Assessment",
            assessment_type="diagnostic"
        )
        db.add(diag_assessment)
        db.flush()

    # Create new attempt
    attempt = AssessmentAttempt(
        assessment_id=diag_assessment.id,
        student_id=student.id,
        started_at=datetime.now(timezone.utc)
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    # Select balanced 12 questions: 3 questions from each of the 4 chapters
    chapters = db.query(Chapter).order_by(Chapter.chapter_number).all()
    selected_questions = []

    for ch in chapters:
        ch_concept_ids = [c.id for c in ch.concepts]
        ch_questions = db.query(Question).filter(Question.concept_id.in_(ch_concept_ids)).all()
        # Sort or partition by difficulty
        foundational = [q for q in ch_questions if q.difficulty == "foundational"]
        intermediate = [q for q in ch_questions if q.difficulty == "intermediate"]
        advanced = [q for q in ch_questions if q.difficulty == "advanced"]

        if foundational:
            selected_questions.append(foundational[0])
        if intermediate:
            selected_questions.append(intermediate[0])
        if advanced:
            selected_questions.append(advanced[0])
        elif len(intermediate) > 1:
            selected_questions.append(intermediate[1])

    # Convert to QuestionOut
    q_out_list = []
    for q in selected_questions:
        options = None
        if q.options_json:
            raw_opts = json.loads(q.options_json)
            # Hide is_correct during exam!
            options = [
                QuestionOptionOut(id=o["id"], text=o["text"], distractor_misconception_code=o.get("distractor_misconception_code"))
                for o in raw_opts
            ]

        c = q.concept
        ch = c.chapter if c else None
        q_out_list.append(QuestionOut(
            id=q.id,
            concept_id=q.concept_id,
            concept_code=c.code if c else "",
            concept_name=c.name if c else "",
            chapter_number=ch.chapter_number if ch else 1,
            chapter_title=ch.title if ch else "",
            code=q.code,
            text=q.text,
            question_type=q.question_type,
            difficulty=q.difficulty,
            options=options,
            step_by_step_explanation=None,  # hidden until submitted
            expected_reasoning=None,
            is_ai_generated=q.is_ai_generated
        ))

    return DiagnosticStartResponse(
        attempt_id=attempt.id,
        assessment_title=diag_assessment.title,
        total_questions=len(q_out_list),
        questions=q_out_list
    )

@router.post("/{attempt_id}/submit", response_model=DiagnosticSubmitResponse)
def submit_diagnostic(
    attempt_id: str,
    submit_req: DiagnosticSubmitRequest,
    student: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    attempt = db.query(AssessmentAttempt).filter(
        AssessmentAttempt.id == attempt_id,
        AssessmentAttempt.student_id == student.id
    ).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Diagnostic attempt not found.")

    correct_count = 0
    total_count = len(submit_req.answers)
    concept_updates: dict = {}
    now = datetime.now(timezone.utc)

    for ans in submit_req.answers:
        q = db.query(Question).filter(Question.id == ans.question_id).first()
        if not q:
            continue

        # Evaluate Answer
        eval_result = evaluator.evaluate(
            question_type=q.question_type,
            student_answer=ans.student_answer,
            correct_answer=q.correct_answer,
            numerical_tolerance=q.numerical_tolerance,
            acceptable_units=q.acceptable_units,
            options_json=q.options_json
        )
        is_corr = eval_result["is_correct"]
        if is_corr:
            correct_count += 1

        # Check distractor misconception code
        distractor_code = None
        if q.options_json and ans.student_answer:
            try:
                opts = json.loads(q.options_json)
                for o in opts:
                    if o["id"].upper() == ans.student_answer.strip().upper():
                        distractor_code = o.get("distractor_misconception_code")
                        break
            except Exception:
                pass

        # Detect Misconception
        concept = q.concept
        c_code = concept.code if concept else ""
        misc_diag = misconception_detector.analyze_deterministic(
            concept_code=c_code,
            student_answer=ans.student_answer,
            reasoning_text=ans.reasoning_text,
            selected_option_distractor_code=distractor_code,
            is_correct=is_corr
        )

        # Record Answer Submission
        ans_submission = AnswerSubmission(
            attempt_id=attempt.id,
            question_id=q.id,
            student_id=student.id,
            student_answer=ans.student_answer,
            is_correct=is_corr,
            confidence_level=ans.confidence_level,
            reasoning_text=ans.reasoning_text,
            latency_seconds=ans.latency_seconds,
            created_at=now
        )
        db.add(ans_submission)
        db.flush()

        # If misconception detected, record it
        if misc_diag["detected"] and misc_diag["misconception_code"]:
            misc_obj = db.query(Misconception).filter(Misconception.code == misc_diag["misconception_code"]).first()
            if misc_obj:
                dm = DetectedMisconception(
                    answer_id=ans_submission.id,
                    student_id=student.id,
                    misconception_id=misc_obj.id,
                    confidence=misc_diag["confidence"],
                    evidence_span=misc_diag["evidence_span"],
                    error_type=misc_diag["error_type"],
                    recommended_remediation=misc_diag["recommended_remediation"],
                    status="active",
                    created_at=now
                )
                db.add(dm)

        # Get or initialize concept mastery
        cm = db.query(ConceptMastery).filter(
            ConceptMastery.student_id == student.id,
            ConceptMastery.concept_id == q.concept_id
        ).first()

        current_m = cm.mastery_score if cm else 0.20
        current_u = cm.uncertainty if cm else 0.85

        # BKT Update
        bkt_res = bkt_engine.update_mastery(
            current_mastery=current_m,
            current_uncertainty=current_u,
            is_correct=is_corr,
            confidence_level=ans.confidence_level,
            difficulty=q.difficulty,
            has_misconception=misc_diag["detected"],
            reasoning_error_type=misc_diag.get("error_type"),
            reasoning_text=ans.reasoning_text
        )

        if not cm:
            cm = ConceptMastery(
                student_id=student.id,
                concept_id=q.concept_id,
                mastery_score=bkt_res["new_mastery"],
                uncertainty=bkt_res["new_uncertainty"],
                practice_count=1,
                correct_count=1 if is_corr else 0,
                last_practiced_at=now
            )
            db.add(cm)
        else:
            cm.mastery_score = bkt_res["new_mastery"]
            cm.uncertainty = bkt_res["new_uncertainty"]
            cm.practice_count += 1
            if is_corr:
                cm.correct_count += 1
            cm.last_practiced_at = now

        # Record Mastery Event History
        event = MasteryEventHistory(
            student_id=student.id,
            concept_id=q.concept_id,
            answer_id=ans_submission.id,
            previous_mastery=bkt_res["previous_mastery"],
            new_mastery=bkt_res["new_mastery"],
            delta=bkt_res["delta"],
            confidence_level=ans.confidence_level,
            slip_used=bkt_res["slip_used"],
            guess_used=bkt_res["guess_used"],
            reason_explanation=bkt_res["explanation"],
            created_at=now
        )
        db.add(event)

        # Schedule Spaced Repetition item
        rev = db.query(RevisionSchedule).filter(
            RevisionSchedule.student_id == student.id,
            RevisionSchedule.concept_id == q.concept_id
        ).first()
        quality_score = 4 if is_corr else 1
        sr_res = sr_scheduler.calculate_next_review(
            repetition_count=rev.repetition_count if rev else 0,
            previous_interval_days=rev.interval_days if rev else 1,
            ease_factor=rev.ease_factor if rev else 2.5,
            quality=quality_score,
            has_active_misconception=misc_diag["detected"],
            now=now
        )
        if not rev:
            rev = RevisionSchedule(
                student_id=student.id,
                concept_id=q.concept_id,
                interval_days=sr_res["interval_days"],
                ease_factor=sr_res["ease_factor"],
                repetition_count=sr_res["repetition_count"],
                next_due_date=sr_res["next_due_date"],
                last_reviewed_at=now,
                status=sr_res["status"]
            )
            db.add(rev)
        else:
            rev.interval_days = sr_res["interval_days"]
            rev.ease_factor = sr_res["ease_factor"]
            rev.repetition_count = sr_res["repetition_count"]
            rev.next_due_date = sr_res["next_due_date"]
            rev.last_reviewed_at = now
            rev.status = sr_res["status"]

        concept_updates[q.concept_id] = {
            "concept_code": c_code,
            "concept_name": concept.name if concept else "",
            "chapter_title": concept.chapter.title if concept and concept.chapter else "",
            "baseline_mastery": bkt_res["new_mastery"]
        }

    # Finalize Attempt
    score_pct = round((correct_count / total_count * 100), 1) if total_count > 0 else 0.0
    attempt.completed_at = now
    attempt.score = score_pct
    attempt.total_questions = total_count
    attempt.correct_answers = correct_count
    attempt.summary_json = json.dumps({"score_percentage": score_pct, "assessed_concepts": len(concept_updates)})

    db.commit()

    # Build baselines list
    baselines = []
    strong = []
    weak = []
    for cid, cinfo in concept_updates.items():
        m = cinfo["baseline_mastery"]
        status_str = "Proficient" if m >= 0.70 else ("Developing" if m >= 0.40 else "Needs Foundation")
        baselines.append(ConceptMasteryBaseline(
            concept_id=cid,
            concept_code=cinfo["concept_code"],
            concept_name=cinfo["concept_name"],
            chapter_title=cinfo["chapter_title"],
            baseline_mastery=round(m * 100, 1),
            status=status_str
        ))
        if m >= 0.65:
            strong.append(cinfo["concept_name"])
        elif m < 0.45:
            weak.append(cinfo["concept_name"])

    summary_msg = (
        f"Diagnostic complete! Your personalized baseline is established across {len(concept_updates)} concepts. "
        f"Score: {correct_count}/{total_count} ({score_pct}%). "
        f"Your adaptive practice engine will now focus on your weakest prerequisite chains."
    )

    return DiagnosticSubmitResponse(
        attempt_id=attempt.id,
        score_percentage=score_pct,
        correct_count=correct_count,
        total_count=total_count,
        concept_baselines=baselines,
        strong_concepts=strong,
        weak_concepts=weak,
        recommended_focus_chapter="Electricity" if any("ELC" in b.concept_code for b in baselines if b.baseline_mastery < 50) else "Light: Reflection and Refraction",
        summary_message=summary_msg
    )
