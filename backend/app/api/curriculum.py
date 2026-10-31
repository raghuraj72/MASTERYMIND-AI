from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.user import User
from app.models.curriculum import Chapter, Concept, ConceptPrerequisite, Misconception
from app.models.learner import ConceptMastery
from app.schemas.curriculum import (
    ChapterOut, ConceptOut, MisconceptionOut,
    ConceptGraphResponse, ConceptGraphNode, ConceptGraphEdge
)
from app.api.deps import security
from app.core.security import decode_access_token

router = APIRouter(prefix="/curriculum", tags=["Curriculum"])

@router.get("/chapters", response_model=List[ChapterOut])
def get_chapters(db: Session = Depends(get_db)):
    chapters = db.query(Chapter).order_by(Chapter.chapter_number).all()
    return chapters

@router.get("/misconceptions", response_model=List[MisconceptionOut])
def get_misconceptions(db: Session = Depends(get_db)):
    miscs = db.query(Misconception).all()
    return miscs

@router.get("/concept-graph", response_model=ConceptGraphResponse)
def get_concept_graph(
    credentials = Depends(security),
    db: Session = Depends(get_db)
):
    # Determine student ID if authenticated
    student_id = None
    if credentials:
        payload = decode_access_token(credentials.credentials)
        if payload:
            student_id = payload.get("sub")

    # If no student authenticated, try the primary demo student as default
    if not student_id:
        demo_student = db.query(User).filter(User.email == "student@masterymind.ai").first()
        if demo_student:
            student_id = demo_student.id

    concepts = db.query(Concept).all()
    prereqs = db.query(ConceptPrerequisite).all()

    # Load student masteries
    mastery_map = {}
    practice_count_map = {}
    uncertainty_map = {}
    if student_id:
        masteries = db.query(ConceptMastery).filter(ConceptMastery.student_id == student_id).all()
        for m in masteries:
            mastery_map[m.concept_id] = m.mastery_score
            practice_count_map[m.concept_id] = m.practice_count
            uncertainty_map[m.concept_id] = m.uncertainty

    # Build prerequisite lookup: dependent_id -> list of prerequisite_ids
    prereq_lookup = {}
    for p in prereqs:
        prereq_lookup.setdefault(p.dependent_id, []).append(p.prerequisite_id)

    nodes = []
    mastered_count = 0
    developing_count = 0
    weak_count = 0
    unassessed_count = 0

    for c in concepts:
        m_score = mastery_map.get(c.id, 0.20)
        p_count = practice_count_map.get(c.id, 0)
        uncert = uncertainty_map.get(c.id, 0.80)

        # Check prerequisite gaps
        has_prereq_gap = False
        required_prereqs = prereq_lookup.get(c.id, [])
        for pid in required_prereqs:
            p_score = mastery_map.get(pid, 0.20)
            if p_score < 0.40:
                has_prereq_gap = True
                break

        # Status categorization
        if p_count == 0:
            status = "unassessed"
            unassessed_count += 1
        elif has_prereq_gap and m_score < 0.60:
            status = "blocked"
            weak_count += 1
        elif m_score >= 0.75:
            status = "mastered"
            mastered_count += 1
        elif m_score >= 0.40:
            status = "developing"
            developing_count += 1
        else:
            status = "weak"
            weak_count += 1

        ch = c.chapter
        nodes.append(ConceptGraphNode(
            id=c.id,
            code=c.code,
            label=c.name,
            chapter_code=ch.code if ch else "",
            chapter_number=ch.chapter_number if ch else 1,
            chapter_title=ch.title if ch else "",
            level=c.foundational_level,
            formula=c.formula,
            description=c.description,
            learning_objectives=c.learning_objectives,
            mastery_percentage=round(m_score * 100, 1),
            uncertainty=round(uncert, 2),
            status=status,
            prerequisite_gap=has_prereq_gap
        ))

    edges = [
        ConceptGraphEdge(
            id=f"{p.prerequisite_id}_{p.dependent_id}",
            source=p.prerequisite_id,
            target=p.dependent_id,
            strength=p.strength
        )
        for p in prereqs
    ]

    return ConceptGraphResponse(
        nodes=nodes,
        edges=edges,
        total_concepts=len(nodes),
        mastered_count=mastered_count,
        developing_count=developing_count,
        weak_count=weak_count,
        unassessed_count=unassessed_count
    )
