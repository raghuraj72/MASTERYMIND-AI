import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    assessment_type = Column(String(50), default="practice", nullable=False)  # diagnostic, practice, revision
    chapter_id = Column(String(36), ForeignKey("chapters.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    attempts = relationship("AssessmentAttempt", back_populates="assessment", cascade="all, delete-orphan")

class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    assessment_id = Column(String(36), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)
    score = Column(Float, default=0.0)
    total_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    summary_json = Column(Text, nullable=True)

    assessment = relationship("Assessment", back_populates="attempts")
    answers = relationship("AnswerSubmission", back_populates="attempt", cascade="all, delete-orphan")

class AnswerSubmission(Base):
    __tablename__ = "answer_submissions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    attempt_id = Column(String(36), ForeignKey("assessment_attempts.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    student_answer = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    confidence_level = Column(String(50), default="somewhat_sure", nullable=False)  # guessing, somewhat_sure, confident
    reasoning_text = Column(Text, nullable=True)
    latency_seconds = Column(Integer, default=30)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    attempt = relationship("AssessmentAttempt", back_populates="answers")
    question = relationship("Question")
    detected_misconceptions = relationship("DetectedMisconception", back_populates="answer", cascade="all, delete-orphan")

class DetectedMisconception(Base):
    __tablename__ = "detected_misconceptions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    answer_id = Column(String(36), ForeignKey("answer_submissions.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    misconception_id = Column(String(36), ForeignKey("misconceptions.id", ondelete="CASCADE"), nullable=False, index=True)
    
    confidence = Column(Float, default=0.85)  # 0.0 to 1.0
    evidence_span = Column(Text, nullable=False)  # Exact quote or reasoning span
    error_type = Column(String(100), default="conceptual_misconception", nullable=False)
    # conceptual_misconception, calculation_error, unit_error, reading_error, careless_mistake, correct_flawed_reasoning, insufficient_evidence
    recommended_remediation = Column(Text, nullable=False)
    status = Column(String(50), default="active")  # active, remediated, dismissed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    answer = relationship("AnswerSubmission", back_populates="detected_misconceptions")
    misconception = relationship("Misconception")
