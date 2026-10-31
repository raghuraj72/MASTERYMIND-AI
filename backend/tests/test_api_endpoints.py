import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def student_auth_header():
    res = client.post("/api/auth/login", json={
        "email": "student@masterymind.ai",
        "password": "Student@123"
    })
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def teacher_auth_header():
    res = client.post("/api/auth/login", json={
        "email": "teacher@masterymind.ai",
        "password": "Teacher@123"
    })
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_concept_graph_endpoint(student_auth_header):
    res = client.get("/api/curriculum/concept-graph", headers=student_auth_header)
    assert res.status_code == 200
    data = res.json()
    assert data["total_concepts"] >= 25
    assert len(data["nodes"]) >= 25
    assert len(data["edges"]) >= 20
    # Every node has valid status and mastery percentage
    first_node = data["nodes"][0]
    assert "status" in first_node
    assert "mastery_percentage" in first_node
    assert "level" in first_node

def test_diagnostic_flow(student_auth_header):
    # 1. Start diagnostic
    start_res = client.post("/api/diagnostics/start", headers=student_auth_header)
    assert start_res.status_code == 200
    diag_data = start_res.json()
    attempt_id = diag_data["attempt_id"]
    questions = diag_data["questions"]
    assert len(questions) >= 10

    # 2. Submit diagnostic answers
    answers_payload = [
        {
            "question_id": q["id"],
            "student_answer": "B",
            "confidence_level": "somewhat_sure",
            "reasoning_text": "Applied standard physics formula for this chapter.",
            "latency_seconds": 35
        }
        for q in questions
    ]
    submit_res = client.post(
        f"/api/diagnostics/{attempt_id}/submit",
        json={"answers": answers_payload},
        headers=student_auth_header
    )
    assert submit_res.status_code == 200
    summary = submit_res.json()
    assert "score_percentage" in summary
    assert len(summary["concept_baselines"]) > 0

def test_adaptive_practice_and_misconception_evidence(student_auth_header):
    # 1. Request next question
    next_res = client.post(
        "/api/practice/next-question",
        json={"target_concept_code": "ELC_OHMS_LAW"},
        headers=student_auth_header
    )
    assert next_res.status_code == 200
    q_data = next_res.json()
    assert q_data["question"] is not None
    assert "selection_reason" in q_data
    q_id = q_data["question"]["id"]

    # 2. Submit an answer with a known misconception in reasoning
    sub_res = client.post(
        "/api/practice/submit-answer",
        json={
            "question_id": q_id,
            "student_answer": "A",
            "confidence_level": "confident",
            "reasoning_text": "Since current increases, the resistance must increase according to Ohm's law.",
            "latency_seconds": 40
        },
        headers=student_auth_header
    )
    assert sub_res.status_code == 200
    eval_data = sub_res.json()
    assert eval_data["has_misconception"] is True
    assert eval_data["misconception"] is not None
    assert eval_data["misconception"]["misconception_code"] == "MISC_OHM_R_I_CONFUSION"
    assert "evidence_span" in eval_data["misconception"]
    assert "new_mastery" in eval_data
    assert "model_explanation" in eval_data

def test_student_dashboard_endpoint(student_auth_header):
    res = client.get("/api/student/dashboard", headers=student_auth_header)
    assert res.status_code == 200
    data = res.json()
    assert "overall_mastery_percentage" in data
    assert "curriculum_coverage_percentage" in data
    assert len(data["chapter_masteries"]) == 4
    assert "accuracy_by_difficulty" in data
    assert "daily_study_plan" in data

def test_teacher_analytics_and_export(teacher_auth_header):
    # Get teacher's classes
    classes_res = client.get("/api/teacher/classes", headers=teacher_auth_header)
    assert classes_res.status_code == 200
    classes = classes_res.json()
    assert len(classes) > 0
    class_id = classes[0]["id"]

    # Analytics overview
    analytics_res = client.get(f"/api/teacher/classes/{class_id}/analytics", headers=teacher_auth_header)
    assert analytics_res.status_code == 200
    overview = analytics_res.json()
    assert "total_students" in overview
    assert overview["total_students"] > 0
    assert "average_mastery" in overview

    # Concept heatmap
    heatmap_res = client.get(f"/api/teacher/classes/{class_id}/heatmap", headers=teacher_auth_header)
    assert heatmap_res.status_code == 200
    heatmap = heatmap_res.json()
    assert len(heatmap) >= 25

    # Misconception frequencies
    misc_res = client.get(f"/api/teacher/classes/{class_id}/misconceptions", headers=teacher_auth_header)
    assert misc_res.status_code == 200

    # Interventions
    interv_res = client.get(f"/api/teacher/classes/{class_id}/interventions", headers=teacher_auth_header)
    assert interv_res.status_code == 200

    # CSV Export
    export_res = client.get(f"/api/teacher/classes/{class_id}/export", headers=teacher_auth_header)
    assert export_res.status_code == 200
    assert "Student Name,Email" in export_res.text
