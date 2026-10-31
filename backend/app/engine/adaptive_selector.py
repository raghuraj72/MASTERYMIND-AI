"""
Adaptive Question Selection Engine with multi-factor scoring:
- Mastery deficit
- Prerequisite blockage
- Epistemic uncertainty
- Spaced repetition urgency
- Target difficulty calibration (Zone of Proximal Development)
- Anti-repetition penalty
- Transparent logged selection explanations
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import random

class AdaptiveQuestionSelector:
    def __init__(
        self,
        weight_mastery_deficit: float = 0.35,
        weight_prereq_blocking: float = 0.25,
        weight_uncertainty: float = 0.15,
        weight_spaced_repetition: float = 0.15,
        weight_difficulty_match: float = 0.10,
    ):
        self.w_mastery = weight_mastery_deficit
        self.w_prereq = weight_prereq_blocking
        self.w_uncertainty = weight_uncertainty
        self.w_sr = weight_spaced_repetition
        self.w_diff = weight_difficulty_match

    def select_next_question(
        self,
        candidate_questions: List[Dict[str, Any]],
        student_mastery_map: Dict[str, float],      # concept_code -> mastery_score (0.0 to 1.0)
        student_uncertainty_map: Dict[str, float],  # concept_code -> uncertainty (0.0 to 1.0)
        prerequisite_graph: Dict[str, List[str]],    # concept_code -> list of dependent concept codes
        spaced_repetition_due: List[str],           # list of concept_codes currently due
        recently_answered_ids: List[str],           # list of question IDs answered recently
        target_concept_code: Optional[str] = None   # optional focus concept
    ) -> Dict[str, Any]:
        """
        Scores all available candidate questions and selects the most pedagogically valuable.
        Returns the chosen question along with a transparent, human-readable selection rationale.
        """
        if not candidate_questions:
            return {"question": None, "selection_reason": "No questions available."}

        scored_candidates = []

        for q in candidate_questions:
            q_id = q["id"]
            c_code = q["concept_code"]
            diff = q.get("difficulty", "intermediate").lower()

            # Skip if specific target concept requested and doesn't match
            if target_concept_code and c_code != target_concept_code:
                continue

            # 1. Anti-repetition penalty
            if q_id in recently_answered_ids:
                # Strong decay for recently answered questions to guarantee variety
                recency_index = recently_answered_ids.index(q_id)
                penalty = 1.0 / (recency_index + 1)
            else:
                penalty = 0.0

            # 2. Mastery Deficit: higher score if concept is weak
            c_mastery = student_mastery_map.get(c_code, 0.20)
            mastery_deficit = 1.0 - c_mastery

            # 3. Prerequisite Blocking: how many concepts depend on this one if this one is weak?
            dependents = prerequisite_graph.get(c_code, [])
            num_dependents = len(dependents)
            # High blocking factor only if this concept itself is not mastered (< 0.65)
            if c_mastery < 0.65 and num_dependents > 0:
                prereq_blocking_score = min(1.0, 0.3 + 0.2 * num_dependents)
            else:
                prereq_blocking_score = 0.0

            # 4. Uncertainty: prioritize concepts with few observations
            c_uncertainty = student_uncertainty_map.get(c_code, 0.80)

            # 5. Spaced Repetition Due: boost if scheduled for review
            is_sr_due = 1.0 if c_code in spaced_repetition_due else 0.0

            # 6. Difficulty Alignment (Zone of Proximal Development)
            # - Mastery < 0.40 -> foundational preferred
            # - Mastery 0.40 - 0.70 -> intermediate preferred
            # - Mastery > 0.70 -> advanced preferred
            if c_mastery < 0.40:
                diff_match = 1.0 if diff == "foundational" else (0.4 if diff == "intermediate" else 0.1)
            elif c_mastery < 0.72:
                diff_match = 1.0 if diff == "intermediate" else (0.5 if diff == "foundational" else 0.5)
            else:
                diff_match = 1.0 if diff == "advanced" else (0.5 if diff == "intermediate" else 0.2)

            # Composite weighted score
            total_score = (
                self.w_mastery * mastery_deficit
                + self.w_prereq * prereq_blocking_score
                + self.w_uncertainty * c_uncertainty
                + self.w_sr * is_sr_due
                + self.w_diff * diff_match
                - (0.85 * penalty)
            )

            # Small jitter for ties
            total_score += random.uniform(-0.02, 0.02)

            # Build readable explanation parts
            reasons = []
            if mastery_deficit > 0.5:
                reasons.append(f"low mastery ({int(c_mastery * 100)}%)")
            if prereq_blocking_score > 0:
                reasons.append(f"blocks {num_dependents} dependent concept(s)")
            if c_uncertainty > 0.6:
                reasons.append("high model uncertainty / needs baseline assessment")
            if is_sr_due > 0:
                reasons.append("due for spaced repetition revision")
            reasons.append(f"matched to {diff} difficulty for current skill level")

            explanation = (
                f"Selected for '{q.get('concept_name', c_code)}' based on: "
                + ", ".join(reasons)
                + "."
            )

            scored_candidates.append({
                "question": q,
                "score": total_score,
                "selection_reason": explanation,
                "factors": {
                    "mastery_deficit": round(mastery_deficit, 2),
                    "prereq_blocking": round(prereq_blocking_score, 2),
                    "uncertainty": round(c_uncertainty, 2),
                    "spaced_repetition": is_sr_due,
                    "difficulty_match": diff_match,
                    "recency_penalty": penalty
                }
            })

        # Sort descending by composite score
        scored_candidates.sort(key=lambda x: x["score"], reverse=True)
        best = scored_candidates[0]

        return {
            "question": best["question"],
            "score": round(best["score"], 3),
            "selection_reason": best["selection_reason"],
            "factors": best["factors"]
        }

adaptive_selector = AdaptiveQuestionSelector()
