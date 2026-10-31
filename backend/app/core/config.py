from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "MASTERYMIND AI"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "masterymind-super-secret-development-key-2026-cbse")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # SQLite by default for simple zero-friction run, or PostgreSQL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./masterymind.db")
    
    # Optional Gemini API Key
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ]
    
    # BKT Default Hyperparameters
    BKT_DEFAULT_PRIOR: float = 0.20
    BKT_DEFAULT_TRANSIT: float = 0.14
    BKT_DEFAULT_GUESS: float = 0.20
    BKT_DEFAULT_SLIP: float = 0.10
    
    # Spaced Repetition Defaults (SM-2)
    SM2_INITIAL_EASE: float = 2.5
    SM2_MIN_EASE: float = 1.3

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
