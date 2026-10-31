"""
MASTERYMIND AI — Reproducible Scientific Evaluation Harness.
Evaluates:
1. Misconception Detection Precision, Recall, F1, and Unsupported Diagnosis Rate.
2. Bayesian Knowledge Tracing Convergence and Asymptotic Monotonicity.
3. Adaptive Question Selection Relevance & Prerequisite Unblocking.
4. Evaluation Latency & Throughput.
"""

import json
import time
import os
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from app.engine.misconception_detector import misconception_detector
from app.engine.learner_model import bkt_engine
from app.engine.adaptive_selector import adaptive_selector

def run_evaluation_suite():
    print("=" * 70)
    print("  MASTERYMIND AI — SCIENTIFIC EVALUATION & BENCHMARK HARNESS")
    print("=" * 70)

    # 1. Load Gold-Standard Benchmark Dataset
    benchmark_file = Path(__file__).parent / "benchmark_dataset.json"
    with open(benchmark_file, "r", encoding="utf-8") as f:
        bench_cases = json.load(f)

    print(f"Loaded {len(bench_cases)} annotated benchmark evaluation cases.")

    # 2. Evaluate Misconception Detection Precision, Recall & F1
    true_positives = 0
    false_positives = 0
    false_negatives = 0
    true_negatives = 0
    unsupported_diagnoses = 0
    latencies = []

    for item in bench_cases:
        t0 = time.perf_counter()
        res = misconception_detector.analyze_deterministic(
            concept_code=item["concept_code"],
            student_answer=item["student_answer"],
            reasoning_text=item.get("reasoning_text"),
            is_correct=item["is_correct"]
        )
        latency = (time.perf_counter() - t0) * 1000.0
        latencies.append(latency)

        expected_misc = item.get("expected_misconception")
        detected_misc = res.get("misconception_code") if res.get("detected") else None

        if expected_misc is not None:
            if detected_misc == expected_misc:
                true_positives += 1
            else:
                false_negatives += 1
        else:
            if detected_misc is not None:
                false_positives += 1
                # If student had no misconception pattern, this was an unsupported diagnosis
                if item.get("expected_error_type") == "insufficient_evidence":
                    unsupported_diagnoses += 1
            else:
                true_negatives += 1

    precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0.0
    recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0.0
    f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    unsupported_rate = unsupported_diagnoses / sum(1 for i in bench_cases if i.get("expected_error_type") == "insufficient_evidence")

    # 3. Evaluate BKT Calibration and Asymptotic Monotonicity
    # Sequence of 5 consecutive correct answers
    p_curr = 0.20
    u_curr = 0.80
    bkt_correct_seq = []
    for _ in range(5):
        upd = bkt_engine.update_mastery(p_curr, u_curr, is_correct=True, confidence_level="confident")
        p_curr = upd["new_mastery"]
        u_curr = upd["new_uncertainty"]
        bkt_correct_seq.append(p_curr)

    # Monotonicity test: each step must increase or remain saturated at upper bound
    bkt_monotonic_correct = all(bkt_correct_seq[i] <= bkt_correct_seq[i+1] for i in range(len(bkt_correct_seq)-1)) and bkt_correct_seq[-1] > bkt_correct_seq[0]
    bkt_converges_high = bkt_correct_seq[-1] >= 0.85

    # Sequence of 5 consecutive incorrect answers with misconception
    p_curr = 0.80
    u_curr = 0.20
    bkt_incorrect_seq = []
    for _ in range(5):
        upd = bkt_engine.update_mastery(p_curr, u_curr, is_correct=False, confidence_level="confident", has_misconception=True)
        p_curr = upd["new_mastery"]
        u_curr = upd["new_uncertainty"]
        bkt_incorrect_seq.append(p_curr)

    bkt_monotonic_decay = all(bkt_incorrect_seq[i] >= bkt_incorrect_seq[i+1] for i in range(len(bkt_incorrect_seq)-1)) and bkt_incorrect_seq[-1] < bkt_incorrect_seq[0]
    bkt_converges_low = bkt_incorrect_seq[-1] <= 0.15

    # 4. Evaluate Question Selection Prerequisite Unblocking
    candidate_questions = [
        {"id": "QA", "concept_code": "ELC_OHMS_LAW", "difficulty": "foundational"},
        {"id": "QB", "concept_code": "ELC_PARALLEL_CIRCUIT", "difficulty": "advanced"},
    ]
    mastery_map = {"ELC_OHMS_LAW": 0.25, "ELC_PARALLEL_CIRCUIT": 0.30}
    uncertainty_map = {"ELC_OHMS_LAW": 0.70, "ELC_PARALLEL_CIRCUIT": 0.70}
    prereq_graph = {"ELC_OHMS_LAW": ["ELC_SERIES_CIRCUIT", "ELC_PARALLEL_CIRCUIT", "ELC_POWER_ENERGY"]}

    sel = adaptive_selector.select_next_question(
        candidate_questions=candidate_questions,
        student_mastery_map=mastery_map,
        student_uncertainty_map=uncertainty_map,
        prerequisite_graph=prereq_graph,
        spaced_repetition_due=[],
        recently_answered_ids=[]
    )
    prereq_unblocked_correctly = (sel["question"]["concept_code"] == "ELC_OHMS_LAW")

    avg_latency = sum(latencies) / len(latencies)

    # 5. Print Results Report
    print("\n" + "-" * 70)
    print("  EVALUATION RESULTS REPORT")
    print("-" * 70)
    print(f"  Benchmark Cases Analyzed:             {len(bench_cases)}")
    print(f"  Misconception Detection Precision:    {precision * 100:.2f}%")
    print(f"  Misconception Detection Recall:       {recall * 100:.2f}%")
    print(f"  Misconception Detection F1 Score:     {f1 * 100:.2f}%")
    print(f"  Unsupported Diagnosis False-Pos Rate: {unsupported_rate * 100:.2f}%")
    print(f"  BKT Mastery Monotonicity (Growth):    {'PASSED' if bkt_monotonic_correct else 'FAILED'} (final: {bkt_correct_seq[-1]:.3f})")
    print(f"  BKT Mastery Monotonicity (Decay):     {'PASSED' if bkt_monotonic_decay else 'FAILED'} (final: {bkt_incorrect_seq[-1]:.3f})")
    print(f"  Adaptive Prereq Unblocking Priority:  {'PASSED' if prereq_unblocked_correctly else 'FAILED'}")
    print(f"  Average Detection Engine Latency:     {avg_latency:.3f} ms")
    print("-" * 70)

    report_data = {
        "benchmark_dataset_size": len(bench_cases),
        "misconception_precision": round(precision, 4),
        "misconception_recall": round(recall, 4),
        "misconception_f1": round(f1, 4),
        "unsupported_diagnosis_rate": round(unsupported_rate, 4),
        "bkt_growth_monotonic": bkt_monotonic_correct,
        "bkt_growth_trajectory": [round(x, 3) for x in bkt_correct_seq],
        "bkt_decay_monotonic": bkt_monotonic_decay,
        "bkt_decay_trajectory": [round(x, 3) for x in bkt_incorrect_seq],
        "prerequisite_unblocking_pass": prereq_unblocked_correctly,
        "average_latency_ms": round(avg_latency, 3),
        "test_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

    report_path = Path(__file__).parent / "evaluation_report.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)

    print(f"Evaluation report successfully saved to {report_path}")
    return report_data

if __name__ == "__main__":
    run_evaluation_suite()
