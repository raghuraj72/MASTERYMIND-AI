import pytest
from app.engine.learner_model import bkt_engine

def test_correct_answer_increases_mastery():
    prior = 0.30
    res = bkt_engine.update_mastery(
        current_mastery=prior,
        current_uncertainty=0.70,
        is_correct=True,
        confidence_level="somewhat_sure",
        difficulty="intermediate"
    )
    assert res["new_mastery"] > prior
    assert res["delta"] > 0
    assert res["new_uncertainty"] < 0.70
    assert "reinforced" in res["explanation"].lower() or "mastery" in res["explanation"].lower()

def test_incorrect_answer_decreases_mastery():
    prior = 0.60
    res = bkt_engine.update_mastery(
        current_mastery=prior,
        current_uncertainty=0.50,
        is_correct=False,
        confidence_level="somewhat_sure",
        difficulty="intermediate"
    )
    assert res["new_mastery"] < prior
    assert res["delta"] < 0

def test_guessing_correct_answer_dampens_mastery_gain():
    prior = 0.30
    # Confident correct answer
    res_confident = bkt_engine.update_mastery(
        current_mastery=prior,
        current_uncertainty=0.70,
        is_correct=True,
        confidence_level="confident",
        difficulty="intermediate"
    )
    # Guessing correct answer
    res_guessing = bkt_engine.update_mastery(
        current_mastery=prior,
        current_uncertainty=0.70,
        is_correct=True,
        confidence_level="guessing",
        difficulty="intermediate"
    )
    # Guessing gain should be substantially lower than confident gain
    assert res_confident["delta"] > res_guessing["delta"]
    assert "guess" in res_guessing["explanation"].lower()

def test_correct_answer_with_flawed_reasoning_is_discounted():
    prior = 0.40
    # Sound reasoning correct
    res_sound = bkt_engine.update_mastery(
        current_mastery=prior,
        current_uncertainty=0.60,
        is_correct=True,
        confidence_level="somewhat_sure",
        has_misconception=False
    )
    # Flawed reasoning correct
    res_flawed = bkt_engine.update_mastery(
        current_mastery=prior,
        current_uncertainty=0.60,
        is_correct=True,
        confidence_level="somewhat_sure",
        has_misconception=True,
        reasoning_error_type="correct_flawed_reasoning"
    )
    assert res_sound["delta"] > res_flawed["delta"]
    assert "dampened" in res_flawed["explanation"].lower() or "misconception" in res_flawed["explanation"].lower()

def test_careless_mistake_preserves_conceptual_mastery():
    prior = 0.70
    # Conceptual misconception incorrect
    res_concept_err = bkt_engine.update_mastery(
        current_mastery=prior,
        current_uncertainty=0.30,
        is_correct=False,
        has_misconception=True,
        reasoning_error_type="conceptual_misconception"
    )
    # Careless calculation error
    res_careless = bkt_engine.update_mastery(
        current_mastery=prior,
        current_uncertainty=0.30,
        is_correct=False,
        has_misconception=False,
        reasoning_error_type="careless_mistake"
    )
    # Careless drop should be milder than a fundamental misconception drop
    assert res_careless["new_mastery"] > res_concept_err["new_mastery"]
