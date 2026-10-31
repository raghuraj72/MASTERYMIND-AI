from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AtRiskStudentOut(BaseModel):
    student_id: str
    name: str
    email: str
    average_mastery: float
    active_misconceptions: int
    recommended_action: str

class ClassOverviewOut(BaseModel):
    class_id: str
    class_name: str
    section: str
    academic_year: str
    join_code: str
    total_students: int
    average_mastery: float
    completed_assessments: int
    active_misconceptions_count: int
    at_risk_count: int
    at_risk_students: List[AtRiskStudentOut] = []

class HeatmapDistribution(BaseModel):
    mastered: int
    developing: int
    weak: int
    unassessed: int

class HeatmapItemOut(BaseModel):
    chapter_number: int
    chapter_code: str
    chapter_title: str
    concept_id: str
    concept_code: str
    concept_name: str
    foundational_level: int
    formula: Optional[str] = None
    average_mastery: float
    distribution: HeatmapDistribution

class MisconceptionFrequencyOut(BaseModel):
    misconception_id: str
    code: str
    title: str
    concept_name: str
    total_occurrences: int
    unique_students_affected: int
    percentage_class: float
    remediation_guide: str
    incorrect_belief: str

class InterventionOut(BaseModel):
    priority: str  # HIGH, MEDIUM, LOW
    title: str
    affected_concept: str
    students_affected_count: int
    class_percentage: float
    observed_evidence: str
    recommended_action: str
    recommended_activity: str
