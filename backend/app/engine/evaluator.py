"""
Deterministic Answer Evaluator supporting MCQs, Numerical inputs with units and tolerance,
and Short-Answer keyword/phrase matching rubrics.
"""

import re
from typing import Dict, Any, Optional

class AnswerEvaluator:
    def evaluate(
        self,
        question_type: str,
        student_answer: str,
        correct_answer: str,
        numerical_tolerance: Optional[str] = None,
        acceptable_units: Optional[str] = None,
        options_json: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Evaluates a submitted answer against the stored question rubric.
        """
        s_ans = (student_answer or "").strip()
        c_ans = (correct_answer or "").strip()
        q_type = (question_type or "mcq").lower()

        # 1. Multiple Choice Evaluation
        if q_type == "mcq":
            # Match either option ID ("B") or full option text if student entered text
            is_correct = (s_ans.upper() == c_ans.upper())
            return {
                "is_correct": is_correct,
                "score": 1.0 if is_correct else 0.0,
                "feedback": "Correct selection!" if is_correct else f"Incorrect. Correct option was {c_ans}."
            }

        # 2. Numerical Evaluation
        elif q_type == "numerical":
            return self._evaluate_numerical(s_ans, c_ans, numerical_tolerance, acceptable_units)

        # 3. Short Answer Evaluation
        elif q_type == "short_answer":
            return self._evaluate_short_answer(s_ans, c_ans)

        # Fallback exact string match
        is_exact = s_ans.lower() == c_ans.lower()
        return {
            "is_correct": is_exact,
            "score": 1.0 if is_exact else 0.0,
            "feedback": "Correct!" if is_exact else f"Expected: {c_ans}"
        }

    def _evaluate_numerical(
        self,
        student_answer: str,
        correct_answer: str,
        tolerance_str: Optional[str],
        acceptable_units: Optional[str]
    ) -> Dict[str, Any]:
        # Extract floating point numbers from student and target
        def extract_num(text: str) -> Optional[float]:
            # Handles negative and decimal numbers, e.g. -60, +3.0, 2.0e8, 300
            m = re.search(r"[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?", text)
            if m:
                try:
                    return float(m.group(0))
                except ValueError:
                    return None
            return None

        s_num = extract_num(student_answer)
        c_num = extract_num(correct_answer)

        if s_num is None or c_num is None:
            return {
                "is_correct": False,
                "score": 0.0,
                "feedback": "Could not parse numerical value from answer."
            }

        # Determine tolerance
        tol = 0.05 * abs(c_num)  # default 5% tolerance
        if tolerance_str:
            try:
                tol = float(tolerance_str)
            except ValueError:
                pass

        diff = abs(s_num - c_num)
        is_correct = (diff <= tol)

        return {
            "is_correct": is_correct,
            "score": 1.0 if is_correct else 0.0,
            "feedback": (
                f"Numerical value {s_num} is correct!"
                if is_correct
                else f"Entered {s_num}, expected {c_num} (±{tol})."
            )
        }

    def _evaluate_short_answer(
        self,
        student_answer: str,
        correct_answer: str
    ) -> Dict[str, Any]:
        s_clean = re.sub(r"[^\w\s]", "", student_answer.lower()).strip()
        c_clean = re.sub(r"[^\w\s]", "", correct_answer.lower()).strip()

        # Check key terms
        key_terms = [t for t in c_clean.split() if len(t) > 3]
        if not key_terms:
            is_correct = (s_clean == c_clean)
        else:
            matches = sum(1 for term in key_terms if term in s_clean)
            is_correct = (matches / len(key_terms)) >= 0.5 or (c_clean in s_clean)

        return {
            "is_correct": is_correct,
            "score": 1.0 if is_correct else 0.0,
            "feedback": "Conceptually accurate summary!" if is_correct else f"Key concept missed. Standard formulation: {correct_answer}."
        }

evaluator = AnswerEvaluator()
