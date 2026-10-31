import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.models.curriculum import Chapter
from app.data.demo_seed import seed_curriculum, seed_demo_users_and_classroom
from app.api import auth, student, curriculum, diagnostics, practice, revision, teacher, demo

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema is created
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    # Check if curriculum is already seeded
    db = SessionLocal()
    try:
        ch_count = db.query(Chapter).count()
        if ch_count == 0:
            logger.info("Database is empty. Automatically seeding CBSE Physics curriculum and demo classroom...")
            seed_curriculum(db)
            seed_demo_users_and_classroom(db)
            logger.info("Automatic seed complete!")
        else:
            logger.info(f"Database already populated ({ch_count} chapters loaded).")
    except Exception as e:
        logger.error(f"Error during startup database seed: {e}")
    finally:
        db.close()

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Adaptive AI Education Platform for CBSE Class 10 Physics with Bayesian Knowledge Tracing and Misconception Detection.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
from fastapi.staticfiles import StaticFiles

# Register API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(student.router, prefix=settings.API_V1_STR)
app.include_router(curriculum.router, prefix=settings.API_V1_STR)
app.include_router(diagnostics.router, prefix=settings.API_V1_STR)
app.include_router(practice.router, prefix=settings.API_V1_STR)
app.include_router(revision.router, prefix=settings.API_V1_STR)
app.include_router(teacher.router, prefix=settings.API_V1_STR)
app.include_router(demo.router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "masterymind-backend"}

# Mount frontend production dist if built
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
else:
    @app.get("/")
    def root():
        return {
            "product": "MASTERYMIND AI",
            "tagline": "Every answer teaches us how to teach you better.",
            "status": "operational",
            "api_documentation": "/docs",
            "version": "1.0.0"
        }

