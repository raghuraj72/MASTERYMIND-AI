from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class ChapterMasterySummary(BaseModel):
    chapter_number: int
    chapter_code: str
    chapter_title: str
    mastery_percentage: float
    concepts_count: int
    mastered_count: int

class ConceptMasterySummary(BaseModel):
    concept_id: str
    code: str
    name: str
    chapter_title: str
    mastery_percentage: float
    uncertainty: float
    status: str

class AccuracyByDifficulty(BaseModel):
    foundational: float
    intermediate: float
    advanced: float

class DailyStudyPlanItem(BaseModel):
    task_type: str  # revision, prerequisite_review, practice, diagnostic
    title: str
    concept_code: str
    concept_name: str
    rationale: str
    estimated_minutes: int

class StudentDashboardResponse(BaseModel):
    student_id: str
    full_name: str
    email: str
    class_grade: str
    target_exam_date: Optional[str] = None
    preferred_language: str
    learning_goals: Optional[str] = None
    
    # Progress vs Mastery distinction
    overall_mastery_percentage: float
    curriculum_coverage_percentage: float
    
    chapter_masteries: List[ChapterMasterySummary]
    strong_concepts: List[ConceptMasterySummary]
    weak_concepts: List[ConceptMasterySummary]
    insufficient_evidence_concepts: List[ConceptMasterySummary]
    
    accuracy_by_difficulty: AccuracyByDifficulty
    daily_study_plan: List[DailyStudyPlanItem]
    
    due_revisions_count: int
    upcoming_revisions_count: int
    total_questions_answered: int
    total_correct_answers: int
    active_misconceptions_count: int

class MasteryEventHistoryOut(BaseModel):
    id: str
    concept_code: str
    concept_name: str
    chapter_title: str
    previous_mastery: float
    new_mastery: float
    delta: float
    confidence_level: Optional[str] = None
    reason_explanation: str
    created_at: datetime

    class Config:
        from_attributes = True

class RevisionScheduleItemOut(BaseModel):
    id: str
    concept_id: str
    concept_code: str
    concept_name: str
    chapter_title: str
    interval_days: int
    ease_factor: float
    repetition_count: int
    next_due_date: datetime
    last_reviewed_at: Optional[datetime] = None
    status: str  # due, upcoming, mastered
    formula: Optional[str] = None
    key_concept_summary: str

    class Config:
        from_attributes = True

class RevisionCompleteRequest(BaseModel):
    quality: int  # 0 to 5
