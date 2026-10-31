from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User, StudentProfile, TeacherProfile, Class, ClassEnrollment
from app.schemas.user import UserRegister, UserLogin, Token, UserOut
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user = User(
        email=user_in.email.lower(),
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role if user_in.role in ["student", "teacher"] else "student"
    )
    db.add(user)
    db.flush()

    if user.role == "student":
        student_prof = StudentProfile(
            user_id=user.id,
            class_grade=user_in.class_grade or "Class 10",
            syllabus="CBSE / NCERT",
            target_exam_date=user_in.target_exam_date,
            preferred_language=user_in.preferred_language or "en",
            learning_goals=user_in.learning_goals,
            onboarding_completed=False
        )
        db.add(student_prof)

        # Automatically enroll in default demo classroom if available
        demo_class = db.query(Class).filter(Class.join_code == "CBSE10A").first()
        if demo_class:
            enrollment = ClassEnrollment(class_id=demo_class.id, student_id=user.id)
            db.add(enrollment)
    else:
        teacher_prof = TeacherProfile(
            user_id=user.id,
            subject="Science / Physics",
            school_name="Delhi Public School"
        )
        db.add(teacher_prof)

    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": user.id, "role": user.role, "email": user.email})
    return Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email
    )

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email.lower()).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token(data={"sub": user.id, "role": user.role, "email": user.email})
    return Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email
    )

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
