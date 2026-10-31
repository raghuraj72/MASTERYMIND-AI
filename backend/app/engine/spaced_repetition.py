"""
Spaced Repetition Scheduler based on SuperMemo SM-2 algorithm with pedagogical adjustments
for active misconceptions and concept mastery.
"""

from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from app.core.config import settings

class SpacedRepetitionScheduler:
    def __init__(
        self,
        initial_ease: float = settings.SM2_INITIAL_EASE,
        min_ease: float = settings.SM2_MIN_EASE,
    ):
        self.initial_ease = initial_ease
        self.min_ease = min_ease

    def calculate_next_review(
        self,
        repetition_count: int,
        previous_interval_days: int,
        ease_factor: float,
        quality: int,  # 0 to 5: 0=total blackout, 3=pass with effort, 5=perfect recall
        has_active_misconception: bool = False,
        now: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """
        Calculates the updated interval, ease factor, repetition count, and next due date.
        """
        if now is None:
            now = datetime.now(timezone.utc)

        # Ease Factor update formula:
        # EF' = EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        new_ef = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        new_ef = max(self.min_ease, round(new_ef, 3))

        # If quality < 3 or active misconception present: review is deemed failed
        if quality < 3 or has_active_misconception:
            new_repetitions = 0
            new_interval = 1  # review again tomorrow or within 1 day
            status = "due"
        else:
            new_repetitions = repetition_count + 1
            if new_repetitions == 1:
                new_interval = 1
            elif new_repetitions == 2:
                new_interval = 3
            elif new_repetitions == 3:
                new_interval = 7
            else:
                new_interval = int(round(previous_interval_days * new_ef))

            # Cap maximum interval at 60 days for active exam prep
            new_interval = min(60, max(1, new_interval))
            status = "upcoming" if new_interval > 1 else "due"

        next_due = now + timedelta(days=new_interval)

        return {
            "repetition_count": new_repetitions,
            "interval_days": new_interval,
            "ease_factor": new_ef,
            "next_due_date": next_due,
            "last_reviewed_at": now,
            "status": status
        }

sr_scheduler = SpacedRepetitionScheduler()
