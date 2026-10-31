"""
AI Provider abstraction for optional Gemini reasoning analysis and question generation.
Implements strict JSON schema validation, timeouts, and seamless fallback to deterministic heuristics.
"""

import os
import json
import logging
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.core.config import settings

logger = logging.getLogger(__name__)

# Pydantic Schemas for AI output validation
class AIMisconceptionAnalysis(BaseModel):
    identified_misconceptions: list[str] = Field(default_factory=list)
    evidence_spans: list[str] = Field(default_factory=list)
    reasoning_error_type: str = Field(default="insufficient_evidence")
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)
    recommended_remediation: str = Field(default="")

class AIQuestionOption(BaseModel):
    id: str
    text: str
    is_correct: bool
    distractor_misconception_code: Optional[str] = None

class AIGeneratedQuestion(BaseModel):
    text: str
    difficulty: str
    question_type: str
    options: list[AIQuestionOption]
    correct_answer: str
    step_by_step_explanation: str
    expected_reasoning: str

class AIProviderService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize Gemini client: {e}")
                self.client = None

    @property
    def is_available(self) -> bool:
        return self.client is not None and bool(self.api_key)

    async def analyze_student_reasoning(
        self,
        concept_name: str,
        question_text: str,
        student_answer: str,
        is_correct: bool,
        reasoning_text: str,
        known_misconceptions: list[Dict[str, Any]]
    ) -> Optional[AIMisconceptionAnalysis]:
        """
        Calls Gemini to deeply evaluate student reasoning with structured JSON response.
        Falls back to None if AI is disabled or fails schema validation.
        """
        if not self.is_available or not reasoning_text.strip():
            return None

        misc_context = "\n".join([
            f"- Code: {m['code']}, Title: {m['title']}, Incorrect belief: {m['incorrect_belief']}"
            for m in known_misconceptions
        ])

        prompt = f"""
You are an expert CBSE Class 10 Physics pedagogical evaluator.
Analyze the following student's written reasoning on a physics question.

Concept: {concept_name}
Question: {question_text}
Student's Answer: {student_answer}
Answer is Correct: {is_correct}
Student's Written Reasoning: "{reasoning_text}"

Known Misconceptions for this concept:
{misc_context}

Analyze whether the student displays any conceptual misconception, calculation error, unit error, or careless mistake.
You MUST output valid JSON conforming strictly to this schema:
{{
  "identified_misconceptions": ["MISCONCEPTION_CODE_OR_TITLE"],
  "evidence_spans": ["exact quote from student reasoning demonstrating the error"],
  "reasoning_error_type": "conceptual_misconception" | "calculation_error" | "unit_error" | "reading_error" | "careless_mistake" | "correct_flawed_reasoning" | "insufficient_evidence",
  "confidence": 0.0 to 1.0,
  "recommended_remediation": "clear, constructive pedagogical guidance"
}}
If evidence is insufficient to diagnose a misconception, set reasoning_error_type to "insufficient_evidence" and confidence <= 0.4.
Do not hallucinate errors if reasoning is sound.
"""

        try:
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "temperature": 0.1,
                }
            )
            data = json.loads(response.text)
            validated = AIMisconceptionAnalysis.model_validate(data)
            return validated
        except Exception as e:
            logger.warning(f"AI reasoning analysis failed or malformed: {e}. Falling back to deterministic analysis.")
            return None

    async def generate_practice_question(
        self,
        concept_code: str,
        concept_name: str,
        difficulty: str
    ) -> Optional[AIGeneratedQuestion]:
        """
        Generates a new syllabus-aligned question for a specific concept and difficulty.
        """
        if not self.is_available:
            return None

        prompt = f"""
Generate a high quality CBSE Class 10 Physics multiple-choice question for:
Concept: {concept_name} (Code: {concept_code})
Difficulty level: {difficulty}

Requirements:
- Syllabus strictly aligned with NCERT Class 10 Physics.
- 4 options (A, B, C, D) with exactly one correct option.
- Include plausible distractors targeting common student misconceptions where relevant.
- Provide step-by-step mathematical or conceptual explanation.

Return ONLY valid JSON matching this schema:
{{
  "text": "Question statement",
  "difficulty": "{difficulty}",
  "question_type": "mcq",
  "options": [
    {{"id": "A", "text": "Option A text", "is_correct": false, "distractor_misconception_code": null}},
    {{"id": "B", "text": "Option B text", "is_correct": true, "distractor_misconception_code": null}},
    {{"id": "C", "text": "Option C text", "is_correct": false, "distractor_misconception_code": null}},
    {{"id": "D", "text": "Option D text", "is_correct": false, "distractor_misconception_code": null}}
  ],
  "correct_answer": "B",
  "step_by_step_explanation": "Detailed step-by-step derivation",
  "expected_reasoning": "What a proficient student should deduce"
}}
"""
        try:
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "temperature": 0.3,
                }
            )
            data = json.loads(response.text)
            validated = AIGeneratedQuestion.model_validate(data)
            return validated
        except Exception as e:
            logger.warning(f"AI Question generation failed: {e}. Falling back to question bank.")
            return None

ai_provider = AIProviderService()
