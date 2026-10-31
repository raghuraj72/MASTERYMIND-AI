"""
Misconception Detection Engine combining deterministic pattern matching,
distractor analysis, and hybrid AI reasoning verification.
"""

import re
import json
from typing import Dict, Any, List, Optional
from app.data.misconceptions_seed import MISCONCEPTIONS_DATA

class MisconceptionDetector:
    def __init__(self):
        # Index misconceptions by code and concept_code
        self.by_code: Dict[str, Dict[str, Any]] = {
            m["code"]: m for m in MISCONCEPTIONS_DATA
        }
        self.by_concept: Dict[str, List[Dict[str, Any]]] = {}
        for m in MISCONCEPTIONS_DATA:
            self.by_concept.setdefault(m["concept_code"], []).append(m)

    def analyze_deterministic(
        self,
        concept_code: str,
        student_answer: str,
        reasoning_text: Optional[str],
        selected_option_distractor_code: Optional[str] = None,
        is_correct: bool = False,
    ) -> Dict[str, Any]:
        """
        Deterministic evaluation: scans student's written reasoning and selected MCQ distractors
        against symptom patterns and known misconceptions for the relevant concept.
        """
        reasoning = (reasoning_text or "").strip()
        candidate_misconceptions = self.by_concept.get(concept_code, [])

        # 1. Distractor-based trigger
        if selected_option_distractor_code and selected_option_distractor_code in self.by_code:
            target_misc = self.by_code[selected_option_distractor_code]
            
            # Check if student also wrote reasoning supporting this distractor
            evidence_span = f"Selected distractor indicating: '{target_misc['title']}'"
            if reasoning:
                for pat in target_misc.get("symptom_patterns", []):
                    match = re.search(pat, reasoning, re.IGNORECASE)
                    if match:
                        evidence_span = f"Reasoning quote: \"{match.group(0)}\""
                        break

            return {
                "detected": True,
                "misconception_code": target_misc["code"],
                "misconception_title": target_misc["title"],
                "evidence_span": evidence_span,
                "confidence": 0.90 if reasoning else 0.78,
                "error_type": "conceptual_misconception" if not is_correct else "correct_flawed_reasoning",
                "recommended_remediation": target_misc["remediation_text"],
                "correct_explanation": target_misc["correct_explanation"]
            }

        # 2. Reasoning pattern matching across all concept-relevant misconceptions
        if reasoning:
            for misc in candidate_misconceptions:
                for pattern in misc.get("symptom_patterns", []):
                    match = re.search(pattern, reasoning, re.IGNORECASE)
                    if match:
                        matched_span = match.group(0)
                        error_type = "correct_flawed_reasoning" if is_correct else "conceptual_misconception"
                        return {
                            "detected": True,
                            "misconception_code": misc["code"],
                            "misconception_title": misc["title"],
                            "evidence_span": f"Reasoning quote: \"{matched_span}\"",
                            "confidence": 0.88,
                            "error_type": error_type,
                            "recommended_remediation": misc["remediation_text"],
                            "correct_explanation": misc["correct_explanation"]
                        }

            # 3. Arithmetic or unit mismatch heuristics
            unit_slip_pattern = r"(forgot to convert|in cm not m|units wrong|didn't multiply by 60|used minutes)"
            calc_slip_pattern = r"(calculation mistake|math error|arithmetic slip|multiplied instead of divide)"
            
            unit_match = re.search(unit_slip_pattern, reasoning, re.IGNORECASE)
            if unit_match:
                return {
                    "detected": True,
                    "misconception_code": "SLIP_UNIT_CONVERSION",
                    "misconception_title": "Unit Conversion / Dimensional Slip",
                    "evidence_span": f"Reasoning quote: \"{unit_match.group(0)}\"",
                    "confidence": 0.85,
                    "error_type": "unit_error",
                    "recommended_remediation": "Double check all units! Remember: Time must be in seconds, distance in metres, and power requires Joules per second.",
                    "correct_explanation": "Standard SI units require dimensional consistency before applying formulas."
                }

            calc_match = re.search(calc_slip_pattern, reasoning, re.IGNORECASE)
            if calc_match:
                return {
                    "detected": True,
                    "misconception_code": "SLIP_CALCULATION",
                    "misconception_title": "Careless Arithmetic Slip",
                    "evidence_span": f"Reasoning quote: \"{calc_match.group(0)}\"",
                    "confidence": 0.80,
                    "error_type": "careless_mistake",
                    "recommended_remediation": "Your conceptual setup was correct! Re-verify each arithmetic step carefully.",
                    "correct_explanation": "Conceptual approach was sound."
                }

        # 4. If answer is incorrect without explicit misconception match
        if not is_correct:
            return {
                "detected": False,
                "misconception_code": None,
                "misconception_title": None,
                "evidence_span": "No specific misconception symptom pattern matched.",
                "confidence": 0.40,
                "error_type": "insufficient_evidence",
                "recommended_remediation": "Review the step-by-step concept derivation for this problem.",
                "correct_explanation": ""
            }

        # 5. Answer is correct and sound
        return {
            "detected": False,
            "misconception_code": None,
            "misconception_title": None,
            "evidence_span": "Reasoning is conceptually sound.",
            "confidence": 0.95,
            "error_type": "sound_reasoning",
            "recommended_remediation": "",
            "correct_explanation": ""
        }

misconception_detector = MisconceptionDetector()
