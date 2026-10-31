"""
Synthetic Demo Classroom and Curriculum Seeder for MASTERYMIND AI.
Populates verified CBSE Class 10 Physics curriculum, question bank, misconception library,
and a realistic synthetic classroom with 8 diverse learners, history, and active revisions.
"""

import json
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.user import User, StudentProfile, TeacherProfile, Class, ClassEnrollment
from app.models.curriculum import Chapter, Concept, ConceptPrerequisite, Misconception
from app.models.question import Question
from app.models.assessment import Assessment, AssessmentAttempt, AnswerSubmission, DetectedMisconception
from app.models.learner import ConceptMastery, MasteryEventHistory, RevisionSchedule
from app.data.curriculum_seed import CHAPTERS_DATA, CONCEPTS_DATA, PREREQUISITES_DATA
from app.data.misconceptions_seed import MISCONCEPTIONS_DATA
from app.data.questions_seed import QUESTIONS_DATA

def seed_curriculum(db: Session):
    """Seeds Chapters, Concepts, Prerequisites, Misconceptions, and Questions."""
    print("Seeding curriculum chapters and concepts...")
    
    # 1. Chapters
    chapter_map = {}
    for ch_data in CHAPTERS_DATA:
        ch = db.query(Chapter).filter(Chapter.code == ch_data["code"]).first()
        if not ch:
            ch = Chapter(
                chapter_number=ch_data["chapter_number"],
                code=ch_data["code"],
                title=ch_data["title"],
                description=ch_data["description"]
            )
            db.add(ch)
            db.flush()
        chapter_map[ch_data["code"]] = ch

    # 2. Concepts
    concept_map = {}
    for c_data in CONCEPTS_DATA:
        c = db.query(Concept).filter(Concept.code == c_data["code"]).first()
        ch = chapter_map[c_data["chapter_code"]]
        if not c:
            c = Concept(
                chapter_id=ch.id,
                code=c_data["code"],
                name=c_data["name"],
                order_index=c_data["order_index"],
                description=c_data["description"],
                learning_objectives=c_data["learning_objectives"],
                foundational_level=c_data["foundational_level"],
                formula=c_data["formula"]
            )
            db.add(c)
            db.flush()
        concept_map[c_data["code"]] = c

    # 3. Prerequisites
    for prereq_code, dep_code, strength in PREREQUISITES_DATA:
        prereq = concept_map.get(prereq_code)
        dep = concept_map.get(dep_code)
        if prereq and dep:
            existing = db.query(ConceptPrerequisite).filter(
                ConceptPrerequisite.prerequisite_id == prereq.id,
                ConceptPrerequisite.dependent_id == dep.id
            ).first()
            if not existing:
                cp = ConceptPrerequisite(
                    prerequisite_id=prereq.id,
                    dependent_id=dep.id,
                    strength=strength
                )
                db.add(cp)

    # 4. Misconceptions
    misconception_map = {}
    for m_data in MISCONCEPTIONS_DATA:
        m = db.query(Misconception).filter(Misconception.code == m_data["code"]).first()
        concept = concept_map.get(m_data["concept_code"])
        if not m and concept:
            m = Misconception(
                concept_id=concept.id,
                code=m_data["code"],
                title=m_data["title"],
                incorrect_belief=m_data["incorrect_belief"],
                symptom_patterns=json.dumps(m_data["symptom_patterns"]),
                example_student_reasoning=m_data["example_student_reasoning"],
                correct_explanation=m_data["correct_explanation"],
                remediation_text=m_data["remediation_text"]
            )
            db.add(m)
            db.flush()
        misconception_map[m_data["code"]] = m

    # 5. Questions
    for q_data in QUESTIONS_DATA:
        q = db.query(Question).filter(Question.code == q_data["code"]).first()
        concept = concept_map.get(q_data["concept_code"])
        if not q and concept:
            q = Question(
                concept_id=concept.id,
                code=q_data["code"],
                text=q_data["text"],
                question_type=q_data.get("question_type", "mcq"),
                difficulty=q_data.get("difficulty", "intermediate"),
                options_json=json.dumps(q_data["options"]) if q_data.get("options") else None,
                correct_answer=q_data["correct_answer"],
                numerical_tolerance=q_data.get("numerical_tolerance"),
                acceptable_units=q_data.get("acceptable_units"),
                step_by_step_explanation=q_data["step_by_step_explanation"],
                expected_reasoning=q_data["expected_reasoning"],
                is_ai_generated=False
            )
            db.add(q)

    # 6. Default Diagnostic Assessment
    diag = db.query(Assessment).filter(Assessment.title == "CBSE Class 10 Physics Diagnostic Assessment").first()
    if not diag:
        diag = Assessment(
            title="CBSE Class 10 Physics Diagnostic Assessment",
            assessment_type="diagnostic",
            chapter_id=None
        )
        db.add(diag)

    db.commit()
    print("Curriculum seeded successfully.")

def seed_demo_users_and_classroom(db: Session):
    """Seeds synthetic demo teacher, class 10-A, and diverse student cohort."""
    print("Seeding demo users, classroom, and synthetic learning histories...")

    # Teacher Account
    teacher = db.query(User).filter(User.email == "teacher@masterymind.ai").first()
    if not teacher:
        teacher = User(
            email="teacher@masterymind.ai",
            hashed_password=get_password_hash("Teacher@123"),
            full_name="Dr. Radhika Sharma",
            role="teacher"
        )
        db.add(teacher)
        db.flush()

        t_prof = TeacherProfile(
            user_id=teacher.id,
            subject="Science / Physics",
            school_name="Delhi Public School RK Puram"
        )
        db.add(t_prof)

    # Class 10-A
    cls = db.query(Class).filter(Class.join_code == "CBSE10A").first()
    if not cls:
        cls = Class(
            name="Class 10-A Physics",
            section="A",
            teacher_id=teacher.id,
            academic_year="2025-2026",
            join_code="CBSE10A"
        )
        db.add(cls)
        db.flush()

    # Primary Interactive Student Demo Account
    demo_student = db.query(User).filter(User.email == "student@masterymind.ai").first()
    if not demo_student:
        demo_student = User(
            email="student@masterymind.ai",
            hashed_password=get_password_hash("Student@123"),
            full_name="Aarav Gupta",
            role="student"
        )
        db.add(demo_student)
        db.flush()

        s_prof = StudentProfile(
            user_id=demo_student.id,
            class_grade="Class 10",
            syllabus="CBSE / NCERT",
            target_exam_date="2026-03-02",
            preferred_language="en",
            learning_goals="Targeting 95%+ in CBSE Board Science exam. Focus on Electricity numericals and Ray diagrams.",
            onboarding_completed=True
        )
        db.add(s_prof)

        enrollment = ClassEnrollment(class_id=cls.id, student_id=demo_student.id)
        db.add(enrollment)

    # Synthetic Cohort of 8 Diverse Learners
    synthetic_students_data = [
        ("priya.patel@student.ai", "Priya Patel", 0.38, "MISC_SIGN_CONVENTION_MIRROR"),
        ("rohan.verma@student.ai", "Rohan Verma", 0.88, None),
        ("ananya.iyer@student.ai", "Ananya Iyer", 0.54, "MISC_CURRENT_VOLTAGE_CONFUSION"),
        ("amit.kumar@student.ai", "Amit Kumar", 0.48, "MISC_SERIES_CURRENT_CONSUMPTION"),
        ("sneha.reddy@student.ai", "Sneha Reddy", 0.42, "MISC_LENS_POWER_UNITS"),
        ("kabir.singh@student.ai", "Kabir Singh", 0.68, None),
        ("meera.joshi@student.ai", "Meera Joshi", 0.72, None),
        ("arjun.nair@student.ai", "Arjun Nair", 0.35, "MISC_OHM_R_I_CONFUSION"),
    ]

    concepts = db.query(Concept).all()
    questions = db.query(Question).all()
    diag_assessment = db.query(Assessment).filter(Assessment.assessment_type == "diagnostic").first()
    now = datetime.now(timezone.utc)

    for email, name, base_mastery, focal_misc_code in synthetic_students_data:
        s_user = db.query(User).filter(User.email == email).first()
        if not s_user:
            s_user = User(
                email=email,
                hashed_password=get_password_hash("Student@123"),
                full_name=name,
                role="student"
            )
            db.add(s_user)
            db.flush()

            sp = StudentProfile(
                user_id=s_user.id,
                class_grade="Class 10",
                syllabus="CBSE / NCERT",
                target_exam_date="2026-03-02",
                preferred_language="en",
                onboarding_completed=True
            )
            db.add(sp)

            enr = ClassEnrollment(class_id=cls.id, student_id=s_user.id)
            db.add(enr)
            db.flush()

            # Seed Concept Mastery across all 28 concepts
            for c in concepts:
                # Add minor variation around base mastery
                offset = (hash(c.code + email) % 25 - 12) / 100.0
                c_score = max(0.15, min(0.95, round(base_mastery + offset, 2)))
                cm = ConceptMastery(
                    student_id=s_user.id,
                    concept_id=c.id,
                    mastery_score=c_score,
                    uncertainty=round(0.15 + (1.0 - c_score) * 0.4, 2),
                    practice_count=4,
                    correct_count=int(4 * c_score),
                    last_practiced_at=now - timedelta(days=random_int(1, 10))
                )
                db.add(cm)

            # Seed an assessment attempt
            if diag_assessment:
                attempt = AssessmentAttempt(
                    assessment_id=diag_assessment.id,
                    student_id=s_user.id,
                    started_at=now - timedelta(days=3),
                    completed_at=now - timedelta(days=3) + timedelta(minutes=25),
                    score=round(base_mastery * 100, 1),
                    total_questions=12,
                    correct_answers=int(12 * base_mastery),
                    summary_json=json.dumps({"diagnostic_completed": True, "baseline_mastery": base_mastery})
                )
                db.add(attempt)
                db.flush()

                # Seed sample answers
                sample_qs = questions[:4]
                for q in sample_qs:
                    ans_sub = AnswerSubmission(
                        attempt_id=attempt.id,
                        question_id=q.id,
                        student_id=s_user.id,
                        student_answer=q.correct_answer if base_mastery > 0.6 else "A",
                        is_correct=(base_mastery > 0.6),
                        confidence_level="confident" if base_mastery > 0.7 else "somewhat_sure",
                        reasoning_text="Used the standard formula for this chapter." if base_mastery > 0.6 else "Current increases so resistance increases.",
                        latency_seconds=45,
                        created_at=now - timedelta(days=3)
                    )
                    db.add(ans_sub)
                    db.flush()

                    # Seed detected misconception if this student has an active focal misconception
                    if focal_misc_code:
                        misc_obj = db.query(Misconception).filter(Misconception.code == focal_misc_code).first()
                        if misc_obj:
                            dm = DetectedMisconception(
                                answer_id=ans_sub.id,
                                student_id=s_user.id,
                                misconception_id=misc_obj.id,
                                confidence=0.89,
                                evidence_span=misc_obj.example_student_reasoning,
                                error_type="conceptual_misconception",
                                recommended_remediation=misc_obj.remediation_text,
                                status="active",
                                created_at=now - timedelta(days=2)
                            )
                            db.add(dm)

            # Seed Spaced Repetition items
            for i, c in enumerate(concepts[:6]):
                # Some due today, some upcoming
                is_due = (i % 2 == 0)
                interval = 1 if is_due else (3 + i * 2)
                due_date = now - timedelta(hours=2) if is_due else now + timedelta(days=interval)
                rs = RevisionSchedule(
                    student_id=s_user.id,
                    concept_id=c.id,
                    interval_days=interval,
                    ease_factor=2.5,
                    repetition_count=2,
                    next_due_date=due_date,
                    last_reviewed_at=now - timedelta(days=3),
                    status="due" if is_due else "upcoming"
                )
                db.add(rs)

    db.commit()
    print("Synthetic demo classroom seeded successfully.")

def random_int(a: int, b: int) -> int:
    import random
    return random.randint(a, b)
