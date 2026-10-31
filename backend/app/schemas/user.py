from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = Field(min_length=2)
    role: str = Field(default="student")  # student or teacher
    class_grade: Optional[str] = "Class 10"
    target_exam_date: Optional[str] = None
    preferred_language: Optional[str] = "en"
    learning_goals: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    full_name: str
    email: str

class StudentProfileUpdate(BaseModel):
    class_grade: Optional[str] = None
    syllabus: Optional[str] = None
    target_exam_date: Optional[str] = None
    preferred_language: Optional[str] = None
    learning_goals: Optional[str] = None
    onboarding_completed: Optional[bool] = None

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
