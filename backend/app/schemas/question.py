from pydantic import BaseModel
from typing import List, Optional, Any

class QuestionOptionOut(BaseModel):
    id: str
    text: str
    is_correct: Optional[bool] = None  # None when sent to student before answering
    distractor_misconception_code: Optional[str] = None

class QuestionOut(BaseModel):
    id: str
    concept_id: str
    concept_code: Optional[str] = None
    concept_name: Optional[str] = None
    chapter_number: Optional[int] = None
    chapter_title: Optional[str] = None
    code: str
    text: str
    question_type: str
    difficulty: str
    options: Optional[List[QuestionOptionOut]] = None
    step_by_step_explanation: Optional[str] = None
    expected_reasoning: Optional[str] = None
    is_ai_generated: bool = False

    class Config:
        from_attributes = True

class QuestionCreateAI(BaseModel):
    concept_code: str
    difficulty: str = "intermediate"
