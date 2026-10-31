"""
Bayesian Knowledge Tracing (BKT) Learner Model with Pedagogical Extensions.
Includes confidence modulation, reasoning validity checks, question difficulty calibration,
uncertainty propagation, and full transparent audit explanation generation.
"""

from typing import Dict, Any, Tuple, Optional
from app.core.config import settings

class BKTLearnerModel:
    def __init__(
        self,
        default_prior: float = settings.BKT_DEFAULT_PRIOR,
        default_transit: float = settings.BKT_DEFAULT_TRANSIT,
        default_guess: float = settings.BKT_DEFAULT_GUESS,
        default_slip: float = settings.BKT_DEFAULT_SLIP,
    ):
        self.default_prior = default_prior
        self.default_transit = default_transit
        self.default_guess = default_guess
        self.default_slip = default_slip

    def compute_effective_parameters(
        self,
        confidence_level: str,
        difficulty: str,
        has_misconception: bool = False,
        reasoning_error_type: Optional[str] = None
    ) -> Tuple[float, float, float]:
        """
        Dynamically modulates Guess (G), Slip (S), and Transit (T) parameters based on
        learner confidence, question difficulty, and observed reasoning errors.
        """
        g = self.default_guess
        s = self.default_slip
        t = self.default_transit

        # 1. Confidence Modulation
        conf = (confidence_level or "somewhat_sure").lower()
        if conf == "guessing":
            # If the student admits guessing, correct answer is much more likely a guess
            g = min(0.65, g + 0.40)
            s = max(0.04, s - 0.05)
        elif conf == "confident":
            # If student was confident, a correct answer is genuine, but an incorrect answer is a strong misconception
            g = max(0.06, g - 0.12)
            s = min(0.25, s + 0.10)
        # "somewhat_sure" uses standard values

        # 2. Difficulty Modulation
        diff = (difficulty or "intermediate").lower()
        if diff == "foundational":
            g = min(0.40, g + 0.08)
            s = max(0.05, s - 0.03)
        elif diff == "advanced":
            g = max(0.05, g - 0.08)
            s = min(0.30, s + 0.06)

        # 3. Reasoning Error Type Adjustments
        if reasoning_error_type == "careless_mistake":
            # Minor calculation slip with sound conceptual reasoning: increase slip to preserve concept mastery
            s = min(0.45, s + 0.25)
        elif reasoning_error_type == "conceptual_misconception":
            # Definite mental model breakdown: decrease slip, ensuring mastery decreases appropriately
            s = max(0.04, s - 0.05)

        return g, s, t

    def update_mastery(
        self,
        current_mastery: float,
        current_uncertainty: float,
        is_correct: bool,
        confidence_level: str = "somewhat_sure",
        difficulty: str = "intermediate",
        has_misconception: bool = False,
        reasoning_error_type: Optional[str] = None,
        reasoning_text: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Executes an extended BKT posterior update and returns new mastery, uncertainty,
        and human-readable diagnostic explanations.
        """
        p = max(0.01, min(0.99, current_mastery))
        g, s, t = self.compute_effective_parameters(
            confidence_level, difficulty, has_misconception, reasoning_error_type
        )

        # Calculate BKT posterior probability p(L_t | Action)
        if is_correct:
            numerator = p * (1.0 - s)
            denominator = numerator + (1.0 - p) * g
            p_posterior = numerator / denominator if denominator > 0 else p

            # If answer was correct, but student exhibited a serious misconception in reasoning
            if has_misconception or reasoning_error_type == "correct_flawed_reasoning":
                # Discount the mastery gain by 50%
                p_posterior = p + (p_posterior - p) * 0.40
                explanation = (
                    f"Answer was correct, but written reasoning revealed a misconception ({reasoning_error_type}). "
                    f"Mastery increase was dampened."
                )
            elif confidence_level.lower() == "guessing":
                explanation = (
                    f"Correct answer recorded as a likely guess (Guess prob = {g:.2f}). "
                    f"Modest mastery increment awarded."
                )
            else:
                explanation = (
                    f"Correct answer demonstrated mastery (Slip prob = {s:.2f}, Guess prob = {g:.2f}). "
                    f"Mastery reinforced."
                )
        else:
            numerator = p * s
            denominator = numerator + (1.0 - p) * (1.0 - g)
            p_posterior = numerator / denominator if denominator > 0 else p

            if reasoning_error_type == "careless_mistake":
                explanation = (
                    f"Incorrect final answer identified as a careless arithmetic/sign slip. "
                    f"Conceptual mastery protected."
                )
            elif has_misconception:
                explanation = (
                    f"Incorrect answer with confirmed misconception ({reasoning_error_type}). "
                    f"Mastery estimate adjusted downward."
                )
            else:
                explanation = (
                    f"Incorrect answer submitted (confidence: {confidence_level}). "
                    f"Mastery adjusted downward."
                )

        # Knowledge transition step: p(L_{t+1}) = p_posterior + (1 - p_posterior) * T
        # Only transition towards learning if student didn't just display a severe active misconception
        effective_transit = t if not has_misconception else (t * 0.3)
        p_next = p_posterior + (1.0 - p_posterior) * effective_transit

        # Bound mastery between 0.02 and 0.98
        new_mastery = max(0.02, min(0.98, round(p_next, 4)))
        delta = round(new_mastery - current_mastery, 4)

        # Update uncertainty: variance decreases with observations
        new_uncertainty = max(0.05, round(current_uncertainty * 0.78, 4))

        return {
            "previous_mastery": current_mastery,
            "new_mastery": new_mastery,
            "delta": delta,
            "previous_uncertainty": current_uncertainty,
            "new_uncertainty": new_uncertainty,
            "slip_used": round(s, 3),
            "guess_used": round(g, 3),
            "transit_used": round(effective_transit, 3),
            "explanation": explanation
        }

bkt_engine = BKTLearnerModel()
