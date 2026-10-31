import json
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.models.user import User, Class, ClassEnrollment
from app.models.curriculum import Concept
from app.models.question import Question
from app.schemas.teacher import ClassOverviewOut, HeatmapItemOut, MisconceptionFrequencyOut, InterventionOut
from app.schemas.question import QuestionOut, QuestionOptionOut, QuestionCreateAI
from app.api.deps import get_current_teacher
from app.services.analytics import teacher_analytics
from app.services.ai_provider import ai_provider

router = APIRouter(prefix="/teacher", tags=["Teacher Analytics & Workspace"])

@router.get("/classes")
def get_teacher_classes(
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    # Fetch classes taught by this teacher or all classes if admin/demo teacher
    classes = db.query(Class).filter(Class.teacher_id == teacher.id).all()
    if not classes:
        # Fallback to any available class for smooth demo exploration
        classes = db.query(Class).all()

    return [
        {
            "id": c.id,
            "name": c.name,
            "section": c.section,
            "academic_year": c.academic_year,
            "join_code": c.join_code,
            "student_count": len(c.enrollments)
        }
        for c in classes
    ]

@router.get("/classes/{class_id}/analytics", response_model=ClassOverviewOut)
def get_class_analytics(
    class_id: str,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    overview = teacher_analytics.get_class_overview(db, class_id)
    if not overview:
        raise HTTPException(status_code=404, detail="Class not found.")
    return overview

@router.get("/classes/{class_id}/heatmap", response_model=List[HeatmapItemOut])
def get_class_heatmap(
    class_id: str,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    heatmap = teacher_analytics.get_concept_heatmap(db, class_id)
    return heatmap

@router.get("/classes/{class_id}/misconceptions", response_model=List[MisconceptionFrequencyOut])
def get_class_misconceptions(
    class_id: str,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    misc_freqs = teacher_analytics.get_misconception_frequencies(db, class_id)
    return misc_freqs

@router.get("/classes/{class_id}/interventions", response_model=List[InterventionOut])
def get_class_interventions(
    class_id: str,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    interventions = teacher_analytics.get_recommended_interventions(db, class_id)
    return interventions

@router.get("/classes/{class_id}/export")
def export_class_report(
    class_id: str,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    target_class = db.query(Class).filter(Class.id == class_id).first()
    if not target_class:
        raise HTTPException(status_code=404, detail="Class not found.")

    csv_data = teacher_analytics.generate_csv_report(db, class_id)
    filename = f"masterymind_report_{target_class.name.replace(' ', '_')}.csv"

    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.post("/questions/generate", response_model=QuestionOut)
async def generate_ai_question(
    req: QuestionCreateAI,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    concept = db.query(Concept).filter(Concept.code == req.concept_code).first()
    if not concept:
        raise HTTPException(status_code=404, detail="Concept not found.")

    # Try AI generation if configured
    ai_gen = None
    if ai_provider.is_available:
        ai_gen = await ai_provider.generate_practice_question(
            concept_code=concept.code,
            concept_name=concept.name,
            difficulty=req.difficulty
        )

    if ai_gen:
        # Save to database
        code_id = f"Q_AI_{concept.code}_{hash(ai_gen.text) % 10000}"
        options_dicts = [o.model_dump() for o in ai_gen.options]
        new_q = Question(
            concept_id=concept.id,
            code=code_id,
            text=ai_gen.text,
            question_type=ai_gen.question_type,
            difficulty=ai_gen.difficulty,
            options_json=json.dumps(options_dicts),
            correct_answer=ai_gen.correct_answer,
            step_by_step_explanation=ai_gen.step_by_step_explanation,
            expected_reasoning=ai_gen.expected_reasoning,
            is_ai_generated=True
        )
        db.add(new_q)
        db.commit()
        db.refresh(new_q)

        ch = concept.chapter
        return QuestionOut(
            id=new_q.id,
            concept_id=concept.id,
            concept_code=concept.code,
            concept_name=concept.name,
            chapter_number=ch.chapter_number if ch else 1,
            chapter_title=ch.title if ch else "",
            code=new_q.code,
            text=new_q.text,
            question_type=new_q.question_type,
            difficulty=new_q.difficulty,
            options=[QuestionOptionOut(**o) for o in options_dicts],
            step_by_step_explanation=new_q.step_by_step_explanation,
            expected_reasoning=new_q.expected_reasoning,
            is_ai_generated=True
        )
    else:
        # Fallback to an existing question from verified question bank for this concept
        existing_q = db.query(Question).filter(Question.concept_id == concept.id).first()
        if not existing_q:
            raise HTTPException(status_code=404, detail="No fallback question found in question bank.")

        ch = concept.chapter
        options = None
        if existing_q.options_json:
            opts_raw = json.loads(existing_q.options_json)
            options = [QuestionOptionOut(**o) for o in opts_raw]

        return QuestionOut(
            id=existing_q.id,
            concept_id=concept.id,
            concept_code=concept.code,
            concept_name=concept.name,
            chapter_number=ch.chapter_number if ch else 1,
            chapter_title=ch.title if ch else "",
            code=existing_q.code,
            text=existing_q.text,
            question_type=existing_q.question_type,
            difficulty=existing_q.difficulty,
            options=options,
            step_by_step_explanation=existing_q.step_by_step_explanation,
            expected_reasoning=existing_q.expected_reasoning,
            is_ai_generated=False
        )
