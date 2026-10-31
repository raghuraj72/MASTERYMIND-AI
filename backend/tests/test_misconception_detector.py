import pytest
from app.engine.misconception_detector import misconception_detector

def test_detects_ohm_resistance_current_confusion():
    res = misconception_detector.analyze_deterministic(
        concept_code="ELC_OHMS_LAW",
        student_answer="A",
        reasoning_text="Since V=IR, resistance increases when current increases to keep the circuit balanced.",
        is_correct=False
    )
    assert res["detected"] is True
    assert res["misconception_code"] == "MISC_OHM_R_I_CONFUSION"
    assert "resistance increases when current increases" in res["evidence_span"].lower()
    assert res["confidence"] >= 0.80

def test_detects_sign_convention_inversion():
    res = misconception_detector.analyze_deterministic(
        concept_code="LGT_SIGN_CONVENTION",
        student_answer="A",
        reasoning_text="Object is placed 20 cm in front of mirror, so u is positive (+20 cm).",
        is_correct=False
    )
    assert res["detected"] is True
    assert res["misconception_code"] == "MISC_SIGN_CONVENTION_MIRROR"
    assert "u is positive" in res["evidence_span"].lower()

def test_distractor_option_detection():
    res = misconception_detector.analyze_deterministic(
        concept_code="ELC_PARALLEL_CIRCUIT",
        student_answer="B",
        reasoning_text="",
        selected_option_distractor_code="MISC_PARALLEL_RESISTANCE_SUM",
        is_correct=False
    )
    assert res["detected"] is True
    assert res["misconception_code"] == "MISC_PARALLEL_RESISTANCE_SUM"
    assert "distractor" in res["evidence_span"].lower()

def test_incorrect_without_pattern_returns_insufficient_evidence():
    res = misconception_detector.analyze_deterministic(
        concept_code="ELC_OHMS_LAW",
        student_answer="C",
        reasoning_text="I'm not sure, just picked option C randomly.",
        is_correct=False
    )
    assert res["detected"] is False
    assert res["error_type"] == "insufficient_evidence"
    assert res["confidence"] <= 0.50

def test_unit_conversion_slip_categorization():
    res = misconception_detector.analyze_deterministic(
        concept_code="ELC_CHARGE_CURRENT",
        student_answer="5",
        reasoning_text="Multiplied 0.5 by 10 minutes because I used minutes instead of seconds.",
        is_correct=False
    )
    assert res["detected"] is True
    assert res["error_type"] == "unit_error"

def test_sound_reasoning_returns_no_misconception():
    res = misconception_detector.analyze_deterministic(
        concept_code="ELC_OHMS_LAW",
        student_answer="B",
        reasoning_text="Slope of V-I graph equals ΔV/ΔI which is the constant resistance R.",
        is_correct=True
    )
    assert res["detected"] is False
    assert res["error_type"] == "sound_reasoning"
