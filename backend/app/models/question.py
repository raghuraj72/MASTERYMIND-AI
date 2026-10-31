import uuid
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Question(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    concept_id = Column(String(36), ForeignKey("concepts.id", ondelete="CASCADE"), nullable=False, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    text = Column(Text, nullable=False)
    question_type = Column(String(50), default="mcq", nullable=False)  # mcq, numerical, short_answer
    difficulty = Column(String(50), default="intermediate", nullable=False)  # foundational, intermediate, advanced
    
    # Options list JSON for MCQ, e.g. [{"id": "A", "text": "...", "is_correct": true, "distractor_misconception_code": "..."}]
    options_json = Column(Text, nullable=True)
    
    # Correct answer representation
    correct_answer = Column(String(255), nullable=False)
    numerical_tolerance = Column(String(50), nullable=True)  # e.g., "0.05" or "±5%"
    acceptable_units = Column(String(100), nullable=True)  # e.g., "Ω,ohm,ohms"
    
    step_by_step_explanation = Column(Text, nullable=False)
    expected_reasoning = Column(Text, nullable=False)
    distractor_misconceptions_json = Column(Text, nullable=True)  # Mapping from option to misconception code
    estimated_time_seconds = Column(Integer, default=90)
    is_ai_generated = Column(Boolean, default=False)

    concept = relationship("Concept", back_populates="questions")
