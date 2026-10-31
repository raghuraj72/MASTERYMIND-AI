import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.data.demo_seed import seed_curriculum, seed_demo_users_and_classroom

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    db = SessionLocal()
    seed_curriculum(db)
    seed_demo_users_and_classroom(db)
    db.close()

def test_login_student_success():
    res = client.post("/api/auth/login", json={
        "email": "student@masterymind.ai",
        "password": "Student@123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "student"

def test_login_teacher_success():
    res = client.post("/api/auth/login", json={
        "email": "teacher@masterymind.ai",
        "password": "Teacher@123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "teacher"

def test_login_invalid_password():
    res = client.post("/api/auth/login", json={
        "email": "student@masterymind.ai",
        "password": "WrongPassword999"
    })
    assert res.status_code == 401

def test_student_forbidden_from_teacher_workspace():
    # Login as student
    s_login = client.post("/api/auth/login", json={
        "email": "student@masterymind.ai",
        "password": "Student@123"
    }).json()
    s_token = s_login["access_token"]

    # Student attempts to access teacher classes endpoint
    res = client.get(
        "/api/teacher/classes",
        headers={"Authorization": f"Bearer {s_token}"}
    )
    assert res.status_code == 403
    assert "restricted to authorized educators" in res.json()["detail"].lower()

def test_teacher_allowed_in_teacher_workspace():
    # Login as teacher
    t_login = client.post("/api/auth/login", json={
        "email": "teacher@masterymind.ai",
        "password": "Teacher@123"
    }).json()
    t_token = t_login["access_token"]

    res = client.get(
        "/api/teacher/classes",
        headers={"Authorization": f"Bearer {t_token}"}
    )
    assert res.status_code == 200
    classes = res.json()
    assert len(classes) > 0
