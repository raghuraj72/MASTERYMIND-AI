from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.schemas.question import QuestionOut

class DiagnosticStartResponse(BaseModel):
    attempt_id: str
    assessment_title: str
    total_questions: int
    questions: List[QuestionOut]

class DiagnosticItemAnswer(BaseModel):
    question_id: str
    student_answer: str
    confidence_level: str = "somewhat_sure"  # guessing, somewhat_sure, confident
    reasoning_text: Optional[str] = None
    latency_seconds: int = 30

class DiagnosticSubmitRequest(BaseModel):
    answers: List[DiagnosticItemAnswer]

class ConceptMasteryBaseline(BaseModel):
    concept_id: str
    concept_code: str
    concept_name: str
    chapter_title: str
    baseline_mastery: float
    status: str

class DiagnosticSubmitResponse(BaseModel):
    attempt_id: str
    score_percentage: float
    correct_count: int
    total_count: int
    concept_baselines: List[ConceptMasteryBaseline]
    strong_concepts: List[str]
    weak_concepts: List[str]
    recommended_focus_chapter: str
    summary_message: str

class PracticeNextQuestionRequest(BaseModel):
    target_concept_code: Optional[str] = None

class PracticeNextQuestionResponse(BaseModel):
    question: Optional[QuestionOut]
    selection_reason: str
    selection_factors: Dict[str, Any]

class PracticeSubmitRequest(BaseModel):
    question_id: str
    student_answer: str
    confidence_level: str = "somewhat_sure"
    reasoning_text: Optional[str] = None
    latency_seconds: int = 45

class DetectedMisconceptionDetail(BaseModel):
    misconception_code: Optional[str] = None
    misconception_title: Optional[str] = None
    evidence_span: str
    error_type: str
    confidence: float
    recommended_remediation: str
    correct_explanation: str

class PracticeSubmitResponse(BaseModel):
    is_correct: bool
    correct_answer: str
    step_by_step_explanation: str
    feedback: str
    
    # Evidence-backed learner model update
    concept_id: str
    concept_code: str
    concept_name: str
    previous_mastery: float
    new_mastery: float
    delta: float
    model_explanation: str
    
    # Misconception diagnosis
    has_misconception: bool
    misconception: Optional[DetectedMisconceptionDetail] = None

    # Next step recommendation
    next_step_recommendation: str
    next_recommended_concept: str
