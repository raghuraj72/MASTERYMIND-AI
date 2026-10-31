import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class ConceptMastery(Base):
    __tablename__ = "concept_masteries"
    __table_args__ = (UniqueConstraint("student_id", "concept_id", name="uq_student_concept_mastery"),)

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    concept_id = Column(String(36), ForeignKey("concepts.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Mastery score is continuous from 0.0 to 1.0 (displayed as 0% to 100%)
    mastery_score = Column(Float, default=0.20, nullable=False)
    # Uncertainty represents variance/lack of observations (1.0 = completely unassessed, 0.1 = highly certain)
    uncertainty = Column(Float, default=0.80, nullable=False)
    practice_count = Column(Integer, default=0, nullable=False)
    correct_count = Column(Integer, default=0, nullable=False)
    last_practiced_at = Column(DateTime, nullable=True)

    student = relationship("User")
    concept = relationship("Concept")

class MasteryEventHistory(Base):
    __tablename__ = "mastery_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    concept_id = Column(String(36), ForeignKey("concepts.id", ondelete="CASCADE"), nullable=False, index=True)
    answer_id = Column(String(36), ForeignKey("answer_submissions.id", ondelete="SET NULL"), nullable=True)
    
    previous_mastery = Column(Float, nullable=False)
    new_mastery = Column(Float, nullable=False)
    delta = Column(Float, nullable=False)
    confidence_level = Column(String(50), nullable=True)
    slip_used = Column(Float, nullable=True)
    guess_used = Column(Float, nullable=True)
    reason_explanation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    concept = relationship("Concept")
    student = relationship("User")

class RevisionSchedule(Base):
    __tablename__ = "revision_schedules"
    __table_args__ = (UniqueConstraint("student_id", "concept_id", name="uq_student_concept_revision"),)

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    concept_id = Column(String(36), ForeignKey("concepts.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # SM-2 inspired scheduling parameters
    interval_days = Column(Integer, default=1, nullable=False)
    ease_factor = Column(Float, default=2.5, nullable=False)
    repetition_count = Column(Integer, default=0, nullable=False)
    next_due_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    last_reviewed_at = Column(DateTime, nullable=True)
    status = Column(String(50), default="due", nullable=False)  # due, upcoming, mastered

    concept = relationship("Concept")
    student = relationship("User")
