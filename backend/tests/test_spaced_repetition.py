import pytest
from datetime import datetime, timezone, timedelta
from app.engine.spaced_repetition import sr_scheduler

def test_initial_review_increases_interval():
    now = datetime(2026, 11, 1, 12, 0, tzinfo=timezone.utc)
    res = sr_scheduler.calculate_next_review(
        repetition_count=0,
        previous_interval_days=1,
        ease_factor=2.5,
        quality=4,
        has_active_misconception=False,
        now=now
    )
    assert res["repetition_count"] == 1
    assert res["interval_days"] == 1
    assert res["ease_factor"] >= 2.5
    assert res["next_due_date"] == now + timedelta(days=1)

def test_subsequent_successful_reviews_grow_interval():
    now = datetime(2026, 11, 1, 12, 0, tzinfo=timezone.utc)
    res1 = sr_scheduler.calculate_next_review(
        repetition_count=1,
        previous_interval_days=1,
        ease_factor=2.5,
        quality=5,
        has_active_misconception=False,
        now=now
    )
    assert res1["repetition_count"] == 2
    assert res1["interval_days"] == 3

    res2 = sr_scheduler.calculate_next_review(
        repetition_count=2,
        previous_interval_days=3,
        ease_factor=res1["ease_factor"],
        quality=5,
        has_active_misconception=False,
        now=now
    )
    assert res2["repetition_count"] == 3
    assert res2["interval_days"] == 7

def test_active_misconception_resets_interval():
    now = datetime(2026, 11, 1, 12, 0, tzinfo=timezone.utc)
    res = sr_scheduler.calculate_next_review(
        repetition_count=3,
        previous_interval_days=7,
        ease_factor=2.6,
        quality=4,
        has_active_misconception=True,  # Active misconception resets schedule!
        now=now
    )
    assert res["repetition_count"] == 0
    assert res["interval_days"] == 1
    assert res["status"] == "due"
