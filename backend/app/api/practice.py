import json
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.curriculum import Chapter, Concept, ConceptPrerequisite, Misconception
from app.models.question import Question
from app.models.assessment import Assessment, AssessmentAttempt, AnswerSubmission, DetectedMisconception
from app.models.learner import ConceptMastery, MasteryEventHistory, RevisionSchedule
from app.schemas.assessment import (
    PracticeNextQuestionRequest, PracticeNextQuestionResponse,
    PracticeSubmitRequest, PracticeSubmitResponse, DetectedMisconceptionDetail
)
from app.schemas.question import QuestionOut, QuestionOptionOut
from app.api.deps import get_current_student
from app.engine.evaluator import evaluator
from app.engine.learner_model import bkt_engine
from app.engine.misconception_detector import misconception_detector
from app.engine.adaptive_selector import adaptive_selector
from app.engine.spaced_repetition import sr_scheduler
from app.services.ai_provider import ai_provider

router = APIRouter(prefix="/practice", tags=["Adaptive Practice"])

@router.post("/next-question", response_model=PracticeNextQuestionResponse)
def get_next_practice_question(
    req: PracticeNextQuestionRequest,
    student: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    # 1. Fetch student's current mastery and uncertainty maps
    mastery_records = db.query(ConceptMastery).filter(ConceptMastery.student_id == student.id).all()
    mastery_map = {m.concept.code: m.mastery_score for m in mastery_records if m.concept}
    uncertainty_map = {m.concept.code: m.uncertainty for m in mastery_records if m.concept}

    # 2. Build prerequisite graph (prerequisite_code -> list of dependent_codes)
    prereqs = db.query(ConceptPrerequisite).all()
    prereq_graph = {}
    for p in prereqs:
        p_code = p.prerequisite_concept.code if p.prerequisite_concept else None
        d_code = p.dependent_concept.code if p.dependent_concept else None
        if p_code and d_code:
            prereq_graph.setdefault(p_code, []).append(d_code)

    # 3. Spaced repetition due concepts
    now = datetime.now(timezone.utc)
    due_revs = db.query(RevisionSchedule).filter(
        RevisionSchedule.student_id == student.id,
        RevisionSchedule.next_due_date <= now
    ).all()
    due_concept_codes = [r.concept.code for r in due_revs if r.concept]

    # 4. Recently answered question IDs
    recent_subs = db.query(AnswerSubmission).filter(
        AnswerSubmission.student_id == student.id
    ).order_by(AnswerSubmission.created_at.desc()).limit(10).all()
    recently_answered = [s.question_id for s in recent_subs]

    # 5. Fetch candidate questions
    all_questions = db.query(Question).all()
    candidate_questions = []
    for q in all_questions:
        c = q.concept
        ch = c.chapter if c else None
        candidate_questions.append({
            "id": q.id,
            "concept_id": q.concept_id,
            "concept_code": c.code if c else "",
            "concept_name": c.name if c else "",
            "chapter_number": ch.chapter_number if ch else 1,
            "chapter_title": ch.title if ch else "",
            "code": q.code,
            "text": q.text,
            "difficulty": q.difficulty,
            "question_type": q.question_type,
            "options_json": q.options_json,
            "correct_answer": q.correct_answer,
            "numerical_tolerance": q.numerical_tolerance,
            "acceptable_units": q.acceptable_units,
            "step_by_step_explanation": q.step_by_step_explanation,
            "expected_reasoning": q.expected_reasoning,
            "is_ai_generated": q.is_ai_generated
        })

    # 6. Run Adaptive Selection Algorithm
    selection = adaptive_selector.select_next_question(
        candidate_questions=candidate_questions,
        student_mastery_map=mastery_map,
        student_uncertainty_map=uncertainty_map,
        prerequisite_graph=prereq_graph,
        spaced_repetition_due=due_concept_codes,
        recently_answered_ids=recently_answered,
        target_concept_code=req.target_concept_code
    )

    chosen_q_data = selection["question"]
    if not chosen_q_data:
        return PracticeNextQuestionResponse(
            question=None,
            selection_reason="All concepts mastered or no suitable question available.",
            selection_factors={}
        )

    # Format output (strip is_correct)
    options = None
    if chosen_q_data.get("options_json"):
        raw_opts = json.loads(chosen_q_data["options_json"])
        options = [
            QuestionOptionOut(id=o["id"], text=o["text"], distractor_misconception_code=o.get("distractor_misconception_code"))
            for o in raw_opts
        ]

    q_out = QuestionOut(
        id=chosen_q_data["id"],
        concept_id=chosen_q_data["concept_id"],
        concept_code=chosen_q_data["concept_code"],
        concept_name=chosen_q_data["concept_name"],
        chapter_number=chosen_q_data["chapter_number"],
        chapter_title=chosen_q_data["chapter_title"],
        code=chosen_q_data["code"],
        text=chosen_q_data["text"],
        question_type=chosen_q_data["question_type"],
        difficulty=chosen_q_data["difficulty"],
        options=options,
        step_by_step_explanation=None,
        expected_reasoning=None,
        is_ai_generated=chosen_q_data["is_ai_generated"]
    )

    return PracticeNextQuestionResponse(
        question=q_out,
        selection_reason=selection["selection_reason"],
        selection_factors=selection.get("factors", {})
    )

@router.post("/submit-answer", response_model=PracticeSubmitResponse)
async def submit_practice_answer(
    req: PracticeSubmitRequest,
    student: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    q = db.query(Question).filter(Question.id == req.question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found.")

    concept = q.concept
    c_code = concept.code if concept else ""
    c_name = concept.name if concept else ""

    # 1. Deterministic Evaluation of Final Answer
    eval_result = evaluator.evaluate(
        question_type=q.question_type,
        student_answer=req.student_answer,
        correct_answer=q.correct_answer,
        numerical_tolerance=q.numerical_tolerance,
        acceptable_units=q.acceptable_units,
        options_json=q.options_json
    )
    is_corr = eval_result["is_correct"]

    # 2. Check if selected distractor maps to a known misconception
    distractor_code = None
    if q.options_json and req.student_answer:
        try:
            opts = json.loads(q.options_json)
            for o in opts:
                if o["id"].upper() == req.student_answer.strip().upper():
                    distractor_code = o.get("distractor_misconception_code")
                    break
        except Exception:
            pass

    # 3. Detect Misconception (Deterministic Pattern Matcher first)
    misc_diag = misconception_detector.analyze_deterministic(
        concept_code=c_code,
        student_answer=req.student_answer,
        reasoning_text=req.reasoning_text,
        selected_option_distractor_code=distractor_code,
        is_correct=is_corr
    )

    # 4. Optional AI Analysis if AI is enabled and student wrote detailed reasoning
    if ai_provider.is_available and req.reasoning_text and len(req.reasoning_text.split()) > 4:
        known_miscs = [
            {"code": m.code, "title": m.title, "incorrect_belief": m.incorrect_belief}
            for m in concept.misconceptions
        ] if concept else []
        ai_res = await ai_provider.analyze_student_reasoning(
            concept_name=c_name,
            question_text=q.text,
            student_answer=req.student_answer,
            is_correct=is_corr,
            reasoning_text=req.reasoning_text,
            known_misconceptions=known_miscs
        )
        if ai_res and ai_res.confidence >= 0.70 and ai_res.reasoning_error_type != "insufficient_evidence":
            # Enhance diagnosis with AI findings
            misc_diag["detected"] = True
            misc_diag["evidence_span"] = "; ".join(ai_res.evidence_spans) or misc_diag["evidence_span"]
            misc_diag["confidence"] = round(ai_res.confidence, 2)
            misc_diag["error_type"] = ai_res.reasoning_error_type
            if ai_res.recommended_remediation:
                misc_diag["recommended_remediation"] = ai_res.recommended_remediation

    # 5. Persist Answer Submission
    # Find or create active practice attempt
    practice_assessment = db.query(Assessment).filter(Assessment.assessment_type == "practice").first()
    if not practice_assessment:
        practice_assessment = Assessment(title="Adaptive Practice Workspace", assessment_type="practice")
        db.add(practice_assessment)
        db.flush()

    active_attempt = db.query(AssessmentAttempt).filter(
        AssessmentAttempt.student_id == student.id,
        AssessmentAttempt.assessment_id == practice_assessment.id,
        AssessmentAttempt.completed_at.is_(None)
    ).first()
    if not active_attempt:
        active_attempt = AssessmentAttempt(
            assessment_id=practice_assessment.id,
            student_id=student.id,
            started_at=datetime.now(timezone.utc)
        )
        db.add(active_attempt)
        db.flush()

    now = datetime.now(timezone.utc)
    ans_submission = AnswerSubmission(
        attempt_id=active_attempt.id,
        question_id=q.id,
        student_id=student.id,
        student_answer=req.student_answer,
        is_correct=is_corr,
        confidence_level=req.confidence_level,
        reasoning_text=req.reasoning_text,
        latency_seconds=req.latency_seconds,
        created_at=now
    )
    db.add(ans_submission)
    db.flush()

    # 6. Record Detected Misconception if applicable
    misconception_detail = None
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
            misconception_detail = DetectedMisconceptionDetail(
                misconception_code=misc_obj.code,
                misconception_title=misc_obj.title,
                evidence_span=misc_diag["evidence_span"],
                error_type=misc_diag["error_type"],
                confidence=misc_diag["confidence"],
                recommended_remediation=misc_diag["recommended_remediation"],
                correct_explanation=misc_diag.get("correct_explanation", misc_obj.correct_explanation)
            )

    # 7. Update BKT Learner Model
    cm = db.query(ConceptMastery).filter(
        ConceptMastery.student_id == student.id,
        ConceptMastery.concept_id == q.concept_id
    ).first()

    current_m = cm.mastery_score if cm else 0.20
    current_u = cm.uncertainty if cm else 0.80

    bkt_res = bkt_engine.update_mastery(
        current_mastery=current_m,
        current_uncertainty=current_u,
        is_correct=is_corr,
        confidence_level=req.confidence_level,
        difficulty=q.difficulty,
        has_misconception=misc_diag["detected"],
        reasoning_error_type=misc_diag.get("error_type"),
        reasoning_text=req.reasoning_text
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

    # 8. Record Mastery Event in History
    mastery_event = MasteryEventHistory(
        student_id=student.id,
        concept_id=q.concept_id,
        answer_id=ans_submission.id,
        previous_mastery=bkt_res["previous_mastery"],
        new_mastery=bkt_res["new_mastery"],
        delta=bkt_res["delta"],
        confidence_level=req.confidence_level,
        slip_used=bkt_res["slip_used"],
        guess_used=bkt_res["guess_used"],
        reason_explanation=bkt_res["explanation"],
        created_at=now
    )
    db.add(mastery_event)

    # 9. Update Spaced Repetition Schedule
    rev = db.query(RevisionSchedule).filter(
        RevisionSchedule.student_id == student.id,
        RevisionSchedule.concept_id == q.concept_id
    ).first()
    quality_score = 5 if is_corr and req.confidence_level == "confident" else (3 if is_corr else 1)
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

    db.commit()

    # 10. Recommend next step
    if misc_diag["detected"]:
        next_step = f"Review targeted remediation on {c_name} to resolve identified misconception before proceeding."
    elif not is_corr:
        next_step = f"Attempt a similar foundational problem on {c_name} to reinforce core steps."
    elif bkt_res["new_mastery"] >= 0.75:
        next_step = f"Concept mastered ({int(bkt_res['new_mastery'] * 100)}%)! Advance to dependent intermediate concepts."
    else:
        next_step = f"Keep practicing {c_name} to increase certainty."

    return PracticeSubmitResponse(
        is_correct=is_corr,
        correct_answer=q.correct_answer,
        step_by_step_explanation=q.step_by_step_explanation,
        feedback=eval_result["feedback"],
        concept_id=q.concept_id,
        concept_code=c_code,
        concept_name=c_name,
        previous_mastery=round(bkt_res["previous_mastery"] * 100, 1),
        new_mastery=round(bkt_res["new_mastery"] * 100, 1),
        delta=round(bkt_res["delta"] * 100, 1),
        model_explanation=bkt_res["explanation"],
        has_misconception=misc_diag["detected"],
        misconception=misconception_detail,
        next_step_recommendation=next_step,
        next_recommended_concept=c_code
    )
