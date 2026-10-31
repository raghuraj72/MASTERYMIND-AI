from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db, Base, engine
from app.data.demo_seed import seed_curriculum, seed_demo_users_and_classroom

router = APIRouter(prefix="/demo", tags=["Demo Management"])

@router.get("/accounts")
def get_demo_accounts():
    """
    Returns quick-login credentials for demonstration accounts.
    Explicitly labeled as synthetic demonstration data.
    """
    return {
        "disclaimer": "All learner profiles and classroom records are synthetic demo data created for demonstration and evaluation purposes.",
        "teacher_accounts": [
            {
                "email": "teacher@masterymind.ai",
                "password": "Teacher@123",
                "name": "Dr. Radhika Sharma",
                "role": "teacher",
                "description": "Physics Educator managing Class 10-A Science with 8 diverse learners, class heatmaps, and pedagogical intervention alerts."
            }
        ],
        "student_accounts": [
            {
                "email": "student@masterymind.ai",
                "password": "Student@123",
                "name": "Aarav Gupta",
                "role": "student",
                "description": "Primary interactive learner account ready to take diagnostic assessment or adaptive practice sessions."
            },
            {
                "email": "priya.patel@student.ai",
                "password": "Student@123",
                "name": "Priya Patel",
                "role": "student",
                "description": "Learner with low mastery on Light (38%) and active Cartesian Sign Convention misconception."
            },
            {
                "email": "ananya.iyer@student.ai",
                "password": "Student@123",
                "name": "Ananya Iyer",
                "role": "student",
                "description": "Intermediate learner (54%) with active Current vs Voltage confusion in Electricity."
            },
            {
                "email": "rohan.verma@student.ai",
                "password": "Student@123",
                "name": "Rohan Verma",
                "role": "student",
                "description": "High mastery benchmark student (88%) with well-developed prerequisite chains."
            }
        ]
    }

@router.post("/reset")
def reset_demo_data(db: Session = Depends(get_db)):
    """
    Safely re-creates tables and re-populates verified curriculum and synthetic demo classroom.
    """
    # Drop and re-create all tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # Re-seed
    seed_curriculum(db)
    seed_demo_users_and_classroom(db)

    return {
        "status": "success",
        "message": "Demo database successfully reset and seeded with 28 concepts, 12 misconceptions, 48 questions, and 8 synthetic learners."
    }
