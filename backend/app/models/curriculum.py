import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    chapter_number = Column(Integer, nullable=False, index=True)
    code = Column(String(50), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    concepts = relationship("Concept", back_populates="chapter", cascade="all, delete-orphan", order_by="Concept.order_index")

class Concept(Base):
    __tablename__ = "concepts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    chapter_id = Column(String(36), ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    order_index = Column(Integer, default=0)
    description = Column(Text, nullable=False)
    learning_objectives = Column(Text, nullable=False)
    foundational_level = Column(Integer, default=1)  # 1: foundational, 2: intermediate, 3: advanced
    formula = Column(String(255), nullable=True)

    chapter = relationship("Chapter", back_populates="concepts")
    questions = relationship("Question", back_populates="concept")
    misconceptions = relationship("Misconception", back_populates="concept")
    
    # Prerequisite relationships
    prerequisites = relationship(
        "ConceptPrerequisite",
        foreign_keys="ConceptPrerequisite.dependent_id",
        back_populates="dependent_concept",
        cascade="all, delete-orphan"
    )
    dependents = relationship(
        "ConceptPrerequisite",
        foreign_keys="ConceptPrerequisite.prerequisite_id",
        back_populates="prerequisite_concept",
        cascade="all, delete-orphan"
    )

class ConceptPrerequisite(Base):
    __tablename__ = "concept_prerequisites"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    prerequisite_id = Column(String(36), ForeignKey("concepts.id", ondelete="CASCADE"), nullable=False)
    dependent_id = Column(String(36), ForeignKey("concepts.id", ondelete="CASCADE"), nullable=False)
    strength = Column(Float, default=1.0)  # Strength of dependency 0.1 to 1.0

    prerequisite_concept = relationship("Concept", foreign_keys=[prerequisite_id], back_populates="dependents")
    dependent_concept = relationship("Concept", foreign_keys=[dependent_id], back_populates="prerequisites")

class Misconception(Base):
    __tablename__ = "misconceptions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    concept_id = Column(String(36), ForeignKey("concepts.id", ondelete="CASCADE"), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    incorrect_belief = Column(Text, nullable=False)
    symptom_patterns = Column(Text, nullable=False)  # JSON string of regex or keyword trigger phrases
    example_student_reasoning = Column(Text, nullable=False)
    correct_explanation = Column(Text, nullable=False)
    remediation_text = Column(Text, nullable=False)
    follow_up_question_id = Column(String(36), nullable=True)

    concept = relationship("Concept", back_populates="misconceptions")
