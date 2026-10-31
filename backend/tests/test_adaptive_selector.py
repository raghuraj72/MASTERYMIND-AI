import pytest
from app.engine.adaptive_selector import adaptive_selector

@pytest.fixture
def sample_candidates():
    return [
        {
            "id": "Q1",
            "concept_code": "ELC_OHMS_LAW",
            "concept_name": "Ohm's Law",
            "difficulty": "foundational"
        },
        {
            "id": "Q2",
            "concept_code": "ELC_POWER_ENERGY",
            "concept_name": "Electric Power",
            "difficulty": "advanced"
        },
        {
            "id": "Q3",
            "concept_code": "LGT_REFL_LAWS",
            "concept_name": "Laws of Reflection",
            "difficulty": "intermediate"
        }
    ]

def test_prerequisite_blocking_and_low_mastery_prioritizes_foundation(sample_candidates):
    mastery_map = {
        "ELC_OHMS_LAW": 0.25,        # Low mastery, blocks dependents
        "ELC_POWER_ENERGY": 0.20,
        "LGT_REFL_LAWS": 0.85         # High mastery
    }
    uncertainty_map = {
        "ELC_OHMS_LAW": 0.70,
        "ELC_POWER_ENERGY": 0.80,
        "LGT_REFL_LAWS": 0.20
    }
    prereq_graph = {
        "ELC_OHMS_LAW": ["ELC_SERIES_CIRCUIT", "ELC_PARALLEL_CIRCUIT", "ELC_POWER_ENERGY"]
    }
    
    selection = adaptive_selector.select_next_question(
        candidate_questions=sample_candidates,
        student_mastery_map=mastery_map,
        student_uncertainty_map=uncertainty_map,
        prerequisite_graph=prereq_graph,
        spaced_repetition_due=[],
        recently_answered_ids=[]
    )
    
    chosen = selection["question"]
    assert chosen["concept_code"] == "ELC_OHMS_LAW"
    assert "blocks 3 dependent concept" in selection["selection_reason"].lower()

def test_anti_repetition_penalty(sample_candidates):
    mastery_map = {"ELC_OHMS_LAW": 0.25, "ELC_POWER_ENERGY": 0.25, "LGT_REFL_LAWS": 0.85}
    uncertainty_map = {"ELC_OHMS_LAW": 0.70, "ELC_POWER_ENERGY": 0.70, "LGT_REFL_LAWS": 0.20}
    prereq_graph = {}

    # Q1 was answered very recently
    selection = adaptive_selector.select_next_question(
        candidate_questions=sample_candidates,
        student_mastery_map=mastery_map,
        student_uncertainty_map=uncertainty_map,
        prerequisite_graph=prereq_graph,
        spaced_repetition_due=[],
        recently_answered_ids=["Q1"]
    )
    # Since Q1 has heavy recency penalty, Q2 should be selected instead
    chosen = selection["question"]
    assert chosen["id"] != "Q1"

def test_spaced_repetition_boost(sample_candidates):
    mastery_map = {"ELC_OHMS_LAW": 0.50, "ELC_POWER_ENERGY": 0.50, "LGT_REFL_LAWS": 0.50}
    uncertainty_map = {"ELC_OHMS_LAW": 0.50, "ELC_POWER_ENERGY": 0.50, "LGT_REFL_LAWS": 0.50}
    prereq_graph = {}

    selection = adaptive_selector.select_next_question(
        candidate_questions=sample_candidates,
        student_mastery_map=mastery_map,
        student_uncertainty_map=uncertainty_map,
        prerequisite_graph=prereq_graph,
        spaced_repetition_due=["LGT_REFL_LAWS"],
        recently_answered_ids=[]
    )
    chosen = selection["question"]
    assert chosen["concept_code"] == "LGT_REFL_LAWS"
    assert "spaced repetition" in selection["selection_reason"].lower()
