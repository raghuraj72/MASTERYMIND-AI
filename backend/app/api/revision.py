from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.learner import RevisionSchedule, ConceptMastery, MasteryEventHistory
from app.models.assessment import DetectedMisconception
from app.schemas.learner import RevisionCompleteRequest, RevisionScheduleItemOut
from app.api.deps import get_current_student
from app.engine.spaced_repetition import sr_scheduler
from app.engine.learner_model import bkt_engine

router = APIRouter(prefix="/revision", tags=["Spaced Repetition"])

@router.post("/{schedule_id}/complete", response_model=RevisionScheduleItemOut)
def complete_revision_session(
    schedule_id: str,
    req: RevisionCompleteRequest,
    student: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    rev = db.query(RevisionSchedule).filter(
        RevisionSchedule.id == schedule_id,
        RevisionSchedule.student_id == student.id
    ).first()
    if not rev:
        raise HTTPException(status_code=404, detail="Revision item not found.")

    now = datetime.now(timezone.utc)
    concept = rev.concept

    # Check active misconceptions for this concept
    active_misc = db.query(DetectedMisconception).filter(
        DetectedMisconception.student_id == student.id,
        DetectedMisconception.misconception.has(concept_id=rev.concept_id),
        DetectedMisconception.status == "active"
    ).first()

    has_active_misc = active_misc is not None and req.quality < 4

    # Calculate next SM-2 interval
    sr_res = sr_scheduler.calculate_next_review(
        repetition_count=rev.repetition_count,
        previous_interval_days=rev.interval_days,
        ease_factor=rev.ease_factor,
        quality=req.quality,
        has_active_misconception=has_active_misc,
        now=now
    )

    rev.repetition_count = sr_res["repetition_count"]
    rev.interval_days = sr_res["interval_days"]
    rev.ease_factor = sr_res["ease_factor"]
    rev.next_due_date = sr_res["next_due_date"]
    rev.last_reviewed_at = now
    rev.status = sr_res["status"]

    # Also reinforce ConceptMastery slightly on successful recall (quality >= 3)
    if req.quality >= 3:
        cm = db.query(ConceptMastery).filter(
            ConceptMastery.student_id == student.id,
            ConceptMastery.concept_id == rev.concept_id
        ).first()
        if cm:
            old_m = cm.mastery_score
            gain = (1.0 - old_m) * 0.08 * (req.quality / 5.0)
            new_m = round(min(0.98, old_m + gain), 4)
            cm.mastery_score = new_m
            cm.uncertainty = max(0.05, round(cm.uncertainty * 0.85, 2))
            cm.last_practiced_at = now

            event = MasteryEventHistory(
                student_id=student.id,
                concept_id=rev.concept_id,
                answer_id=None,
                previous_mastery=old_m,
                new_mastery=new_m,
                delta=round(new_m - old_m, 4),
                confidence_level="spaced_repetition_recall",
                slip_used=0.0,
                guess_used=0.0,
                reason_explanation=f"Spaced repetition recall completed (quality rating: {req.quality}/5). Memory consolidated.",
                created_at=now
            )
            db.add(event)

    db.commit()
    db.refresh(rev)

    ch = concept.chapter if concept else None
    return RevisionScheduleItemOut(
        id=rev.id,
        concept_id=concept.id if concept else "",
        concept_code=concept.code if concept else "",
        concept_name=concept.name if concept else "",
        chapter_title=ch.title if ch else "",
        interval_days=rev.interval_days,
        ease_factor=round(rev.ease_factor, 2),
        repetition_count=rev.repetition_count,
        next_due_date=rev.next_due_date,
        last_reviewed_at=rev.last_reviewed_at,
        status=rev.status,
        formula=concept.formula if concept else None,
        key_concept_summary=concept.description if concept else ""
    )
