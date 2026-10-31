from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User, StudentProfile
from app.models.curriculum import Chapter, Concept
from app.models.assessment import AnswerSubmission, DetectedMisconception
from app.models.learner import ConceptMastery, MasteryEventHistory, RevisionSchedule
from app.models.question import Question
from app.schemas.learner import (
    StudentDashboardResponse, ChapterMasterySummary, ConceptMasterySummary,
    AccuracyByDifficulty, DailyStudyPlanItem, MasteryEventHistoryOut,
    RevisionScheduleItemOut
)
from app.schemas.user import StudentProfileUpdate
from app.api.deps import get_current_student

router = APIRouter(prefix="/student", tags=["Student Experience"])

@router.get("/dashboard", response_model=StudentDashboardResponse)
def get_student_dashboard(
    student: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = student.student_profile
    concepts = db.query(Concept).all()
    total_concepts_count = len(concepts)

    # Concept masteries
    mastery_records = db.query(ConceptMastery).filter(ConceptMastery.student_id == student.id).all()
    mastery_by_concept_id = {m.concept_id: m for m in mastery_records}

    # Chapter breakdown
    chapters = db.query(Chapter).order_by(Chapter.chapter_number).all()
    chapter_summaries = []
    all_scores = []

    for ch in chapters:
        ch_concepts = [c for c in concepts if c.chapter_id == ch.id]
        ch_scores = []
        mastered_in_ch = 0
        for c in ch_concepts:
            m = mastery_by_concept_id.get(c.id)
            score = m.mastery_score if m else 0.20
            ch_scores.append(score)
            all_scores.append(score)
            if score >= 0.75:
                mastered_in_ch += 1

        avg_ch_score = (sum(ch_scores) / len(ch_scores)) if ch_scores else 0.20
        chapter_summaries.append(ChapterMasterySummary(
            chapter_number=ch.chapter_number,
            chapter_code=ch.code,
            chapter_title=ch.title,
            mastery_percentage=round(avg_ch_score * 100, 1),
            concepts_count=len(ch_concepts),
            mastered_count=mastered_in_ch
        ))

    overall_mastery = (sum(all_scores) / len(all_scores)) if all_scores else 0.20

    # Categorize Strong, Weak, Insufficient Evidence
    strong = []
    weak = []
    insufficient = []

    for c in concepts:
        m = mastery_by_concept_id.get(c.id)
        if not m or m.practice_count == 0 or m.uncertainty >= 0.65:
            insufficient.append(ConceptMasterySummary(
                concept_id=c.id,
                code=c.code,
                name=c.name,
                chapter_title=c.chapter.title if c.chapter else "",
                mastery_percentage=round((m.mastery_score if m else 0.20) * 100, 1),
                uncertainty=round(m.uncertainty if m else 0.85, 2),
                status="Insufficient Evidence"
            ))
        elif m.mastery_score >= 0.75:
            strong.append(ConceptMasterySummary(
                concept_id=c.id,
                code=c.code,
                name=c.name,
                chapter_title=c.chapter.title if c.chapter else "",
                mastery_percentage=round(m.mastery_score * 100, 1),
                uncertainty=round(m.uncertainty, 2),
                status="Mastered"
            ))
        elif m.mastery_score < 0.45:
            weak.append(ConceptMasterySummary(
                concept_id=c.id,
                code=c.code,
                name=c.name,
                chapter_title=c.chapter.title if c.chapter else "",
                mastery_percentage=round(m.mastery_score * 100, 1),
                uncertainty=round(m.uncertainty, 2),
                status="Needs Work"
            ))

    # Answers & Accuracy by difficulty
    answers = db.query(AnswerSubmission).filter(AnswerSubmission.student_id == student.id).all()
    total_answers = len(answers)
    total_correct = sum(1 for a in answers if a.is_correct)

    # Group by question difficulty
    diff_totals = {"foundational": [0, 0], "intermediate": [0, 0], "advanced": [0, 0]}
    for a in answers:
        q = a.question
        if q:
            d = q.difficulty.lower()
            if d in diff_totals:
                diff_totals[d][1] += 1
                if a.is_correct:
                    diff_totals[d][0] += 1

    accuracy_diff = AccuracyByDifficulty(
        foundational=round((diff_totals["foundational"][0] / diff_totals["foundational"][1] * 100), 1) if diff_totals["foundational"][1] > 0 else 0.0,
        intermediate=round((diff_totals["intermediate"][0] / diff_totals["intermediate"][1] * 100), 1) if diff_totals["intermediate"][1] > 0 else 0.0,
        advanced=round((diff_totals["advanced"][0] / diff_totals["advanced"][1] * 100), 1) if diff_totals["advanced"][1] > 0 else 0.0,
    )

    # Curriculum coverage (concepts practiced at least once)
    practiced_concepts_count = sum(1 for m in mastery_records if m.practice_count > 0)
    curriculum_coverage = round((practiced_concepts_count / total_concepts_count * 100), 1) if total_concepts_count > 0 else 0.0

    # Spaced repetition items due today
    now = datetime.now(timezone.utc)
    due_revs = db.query(RevisionSchedule).filter(
        RevisionSchedule.student_id == student.id,
        RevisionSchedule.next_due_date <= now
    ).count()

    upcoming_revs = db.query(RevisionSchedule).filter(
        RevisionSchedule.student_id == student.id,
        RevisionSchedule.next_due_date > now
    ).count()

    # Active misconceptions count
    active_misc_count = db.query(DetectedMisconception).filter(
        DetectedMisconception.student_id == student.id,
        DetectedMisconception.status == "active"
    ).count()

    # Daily study plan items
    plan_items = []
    if due_revs > 0:
        first_due = db.query(RevisionSchedule).filter(
            RevisionSchedule.student_id == student.id,
            RevisionSchedule.next_due_date <= now
        ).first()
        if first_due and first_due.concept:
            plan_items.append(DailyStudyPlanItem(
                task_type="revision",
                title=f"Spaced Repetition: {first_due.concept.name}",
                concept_code=first_due.concept.code,
                concept_name=first_due.concept.name,
                rationale="Scheduled for memory consolidation based on SM-2 interval.",
                estimated_minutes=10
            ))

    if weak:
        weak_c = weak[0]
        plan_items.append(DailyStudyPlanItem(
            task_type="practice",
            title=f"Remediate Weak Area: {weak_c.name}",
            concept_code=weak_c.code,
            concept_name=weak_c.name,
            rationale=f"Current mastery is {weak_c.mastery_percentage}%. Resolving this unblocks dependent topics.",
            estimated_minutes=15
        ))

    if insufficient and len(insufficient) > 0:
        ins_c = insufficient[0]
        plan_items.append(DailyStudyPlanItem(
            task_type="diagnostic",
            title=f"Explore Unassessed Concept: {ins_c.name}",
            concept_code=ins_c.code,
            concept_name=ins_c.name,
            rationale="High model uncertainty. Practice to establish verified mastery baseline.",
            estimated_minutes=12
        ))

    return StudentDashboardResponse(
        student_id=student.id,
        full_name=student.full_name,
        email=student.email,
        class_grade=profile.class_grade if profile else "Class 10",
        target_exam_date=profile.target_exam_date if profile else None,
        preferred_language=profile.preferred_language if profile else "en",
        learning_goals=profile.learning_goals if profile else "",
        overall_mastery_percentage=round(overall_mastery * 100, 1),
        curriculum_coverage_percentage=curriculum_coverage,
        chapter_masteries=chapter_summaries,
        strong_concepts=strong[:5],
        weak_concepts=weak[:5],
        insufficient_evidence_concepts=insufficient[:5],
        accuracy_by_difficulty=accuracy_diff,
        daily_study_plan=plan_items,
        due_revisions_count=due_revs,
        upcoming_revisions_count=upcoming_revs,
        total_questions_answered=total_answers,
        total_correct_answers=total_correct,
        active_misconceptions_count=active_misc_count
    )

@router.put("/profile")
def update_student_profile(
    req: StudentProfileUpdate,
    student: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    prof = student.student_profile
    if not prof:
        prof = StudentProfile(user_id=student.id)
        db.add(prof)

    if req.class_grade is not None:
        prof.class_grade = req.class_grade
    if req.syllabus is not None:
        prof.syllabus = req.syllabus
    if req.target_exam_date is not None:
        prof.target_exam_date = req.target_exam_date
    if req.preferred_language is not None:
        prof.preferred_language = req.preferred_language
    if req.learning_goals is not None:
        prof.learning_goals = req.learning_goals
    if req.onboarding_completed is not None:
        prof.onboarding_completed = req.onboarding_completed

    db.commit()
    return {"status": "success", "message": "Learner profile updated successfully."}

@router.get("/mastery-history", response_model=List[MasteryEventHistoryOut])
def get_mastery_history(
    student: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    events = db.query(MasteryEventHistory).filter(
        MasteryEventHistory.student_id == student.id
    ).order_by(MasteryEventHistory.created_at.desc()).limit(50).all()

    output = []
    for e in events:
        c = e.concept
        ch = c.chapter if c else None
        output.append(MasteryEventHistoryOut(
            id=e.id,
            concept_code=c.code if c else "",
            concept_name=c.name if c else "",
            chapter_title=ch.title if ch else "",
            previous_mastery=round(e.previous_mastery * 100, 1),
            new_mastery=round(e.new_mastery * 100, 1),
            delta=round(e.delta * 100, 1),
            confidence_level=e.confidence_level,
            reason_explanation=e.reason_explanation,
            created_at=e.created_at
        ))
    return output

@router.get("/revision-schedule", response_model=List[RevisionScheduleItemOut])
def get_revision_schedule(
    student: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    schedules = db.query(RevisionSchedule).filter(
        RevisionSchedule.student_id == student.id
    ).order_by(RevisionSchedule.next_due_date.asc()).all()

    output = []
    now = datetime.now(timezone.utc)
    for s in schedules:
        c = s.concept
        if not c:
            continue
        ch = c.chapter
        status_label = "due" if s.next_due_date <= now else "upcoming"
        output.append(RevisionScheduleItemOut(
            id=s.id,
            concept_id=c.id,
            concept_code=c.code,
            concept_name=c.name,
            chapter_title=ch.title if ch else "",
            interval_days=s.interval_days,
            ease_factor=round(s.ease_factor, 2),
            repetition_count=s.repetition_count,
            next_due_date=s.next_due_date,
            last_reviewed_at=s.last_reviewed_at,
            status=status_label,
            formula=c.formula,
            key_concept_summary=c.description
        ))
    return output
