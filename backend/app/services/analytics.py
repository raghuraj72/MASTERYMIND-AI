"""
Teacher Analytics Service: computes classroom aggregation, concept heatmaps,
misconception frequency distributions, at-risk student detection, actionable teaching interventions,
and CSV exports.
"""

from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user import User, Class, ClassEnrollment, StudentProfile
from app.models.curriculum import Chapter, Concept, Misconception
from app.models.question import Question
from app.models.assessment import AssessmentAttempt, AnswerSubmission, DetectedMisconception
from app.models.learner import ConceptMastery, RevisionSchedule

class TeacherAnalyticsService:
    def get_class_overview(self, db: Session, class_id: str) -> Dict[str, Any]:
        target_class = db.query(Class).filter(Class.id == class_id).first()
        if not target_class:
            return {}

        enrollments = db.query(ClassEnrollment).filter(ClassEnrollment.class_id == class_id).all()
        student_ids = [e.student_id for e in enrollments]
        total_students = len(student_ids)

        if total_students == 0:
            return {
                "class_id": class_id,
                "class_name": target_class.name,
                "section": target_class.section,
                "total_students": 0,
                "average_mastery": 0.0,
                "diagnostic_completion_rate": 0.0,
                "at_risk_count": 0,
                "active_misconceptions_count": 0
            }

        # Average mastery across all students in class
        mastery_records = db.query(ConceptMastery).filter(ConceptMastery.student_id.in_(student_ids)).all()
        avg_mastery = (
            sum(m.mastery_score for m in mastery_records) / len(mastery_records)
            if mastery_records else 0.20
        )

        # Diagnostic attempts
        completed_attempts = db.query(AssessmentAttempt).filter(
            AssessmentAttempt.student_id.in_(student_ids),
            AssessmentAttempt.completed_at.isnot(None)
        ).count()

        # Active misconceptions
        active_misc_count = db.query(DetectedMisconception).filter(
            DetectedMisconception.student_id.in_(student_ids),
            DetectedMisconception.status == "active"
        ).count()

        # At-risk students (overall student mastery < 0.40 or > 2 active misconceptions)
        student_mastery_totals: Dict[str, List[float]] = {}
        for m in mastery_records:
            student_mastery_totals.setdefault(m.student_id, []).append(m.mastery_score)

        at_risk_students = []
        for s_id in student_ids:
            scores = student_mastery_totals.get(s_id, [])
            avg_s = (sum(scores) / len(scores)) if scores else 0.20
            s_misc_count = db.query(DetectedMisconception).filter(
                DetectedMisconception.student_id == s_id,
                DetectedMisconception.status == "active"
            ).count()

            if avg_s < 0.40 or s_misc_count >= 2:
                student_user = db.query(User).filter(User.id == s_id).first()
                at_risk_students.append({
                    "student_id": s_id,
                    "name": student_user.full_name if student_user else "Learner",
                    "email": student_user.email if student_user else "",
                    "average_mastery": round(avg_s * 100, 1),
                    "active_misconceptions": s_misc_count,
                    "recommended_action": "Schedule 1-on-1 foundational remediation on electrical & optical prerequisites."
                })

        return {
            "class_id": class_id,
            "class_name": target_class.name,
            "section": target_class.section,
            "academic_year": target_class.academic_year,
            "join_code": target_class.join_code,
            "total_students": total_students,
            "average_mastery": round(avg_mastery * 100, 1),
            "completed_assessments": completed_attempts,
            "active_misconceptions_count": active_misc_count,
            "at_risk_count": len(at_risk_students),
            "at_risk_students": at_risk_students
        }

    def get_concept_heatmap(self, db: Session, class_id: str) -> List[Dict[str, Any]]:
        enrollments = db.query(ClassEnrollment).filter(ClassEnrollment.class_id == class_id).all()
        student_ids = [e.student_id for e in enrollments]
        if not student_ids:
            return []

        chapters = db.query(Chapter).order_by(Chapter.chapter_number).all()
        heatmap_data = []

        for ch in chapters:
            concepts = db.query(Concept).filter(Concept.chapter_id == ch.id).order_by(Concept.order_index).all()
            for c in concepts:
                masteries = db.query(ConceptMastery).filter(
                    ConceptMastery.concept_id == c.id,
                    ConceptMastery.student_id.in_(student_ids)
                ).all()

                scores = [m.mastery_score for m in masteries]
                avg_m = (sum(scores) / len(scores)) if scores else 0.20

                # Count distribution
                mastered_count = sum(1 for s in scores if s >= 0.75)
                developing_count = sum(1 for s in scores if 0.40 <= s < 0.75)
                weak_count = sum(1 for s in scores if s < 0.40)
                unassessed_count = len(student_ids) - len(scores)

                heatmap_data.append({
                    "chapter_number": ch.chapter_number,
                    "chapter_code": ch.code,
                    "chapter_title": ch.title,
                    "concept_id": c.id,
                    "concept_code": c.code,
                    "concept_name": c.name,
                    "foundational_level": c.foundational_level,
                    "formula": c.formula,
                    "average_mastery": round(avg_m * 100, 1),
                    "distribution": {
                        "mastered": mastered_count,
                        "developing": developing_count,
                        "weak": weak_count,
                        "unassessed": max(0, unassessed_count)
                    }
                })

        return heatmap_data

    def get_misconception_frequencies(self, db: Session, class_id: str) -> List[Dict[str, Any]]:
        enrollments = db.query(ClassEnrollment).filter(ClassEnrollment.class_id == class_id).all()
        student_ids = [e.student_id for e in enrollments]
        if not student_ids:
            return []

        # Group detected misconceptions by misconception_id
        detected = db.query(
            DetectedMisconception.misconception_id,
            func.count(DetectedMisconception.id).label("total_occurrences"),
            func.count(func.distinct(DetectedMisconception.student_id)).label("unique_students")
        ).filter(
            DetectedMisconception.student_id.in_(student_ids)
        ).group_by(DetectedMisconception.misconception_id).all()

        results = []
        for d in detected:
            misc = db.query(Misconception).filter(Misconception.id == d.misconception_id).first()
            if misc:
                concept = db.query(Concept).filter(Concept.id == misc.concept_id).first()
                results.append({
                    "misconception_id": misc.id,
                    "code": misc.code,
                    "title": misc.title,
                    "concept_name": concept.name if concept else "",
                    "total_occurrences": d.total_occurrences,
                    "unique_students_affected": d.unique_students,
                    "percentage_class": round((d.unique_students / len(student_ids)) * 100, 1),
                    "remediation_guide": misc.remediation_text,
                    "incorrect_belief": misc.incorrect_belief
                })

        results.sort(key=lambda x: x["unique_students_affected"], reverse=True)
        return results

    def get_recommended_interventions(self, db: Session, class_id: str) -> List[Dict[str, Any]]:
        """
        Synthesizes aggregate learning evidence into concrete teaching interventions.
        """
        misc_freqs = self.get_misconception_frequencies(db, class_id)
        interventions = []

        for m in misc_freqs[:4]:  # Top 4 most prevalent misconceptions
            if m["unique_students_affected"] >= 2:
                interventions.append({
                    "priority": "HIGH" if m["percentage_class"] >= 40 else "MEDIUM",
                    "title": f"Targeted Intervention: {m['title']}",
                    "affected_concept": m["concept_name"],
                    "students_affected_count": m["unique_students_affected"],
                    "class_percentage": m["percentage_class"],
                    "observed_evidence": f"{m['unique_students_affected']} students exhibited '{m['incorrect_belief']}' across recent attempts.",
                    "recommended_action": m["remediation_guide"],
                    "recommended_activity": "Conduct a 15-minute hands-on lab demonstration or concept-mapping exercise before assigning additional numerical practice."
                })

        return interventions

    def generate_csv_report(self, db: Session, class_id: str) -> str:
        """
        Generates CSV format string of student mastery and assessment data for export.
        """
        enrollments = db.query(ClassEnrollment).filter(ClassEnrollment.class_id == class_id).all()
        student_ids = [e.student_id for e in enrollments]

        lines = ["Student Name,Email,Average Mastery (%),Completed Assessments,Active Misconceptions,Status"]
        for s_id in student_ids:
            user = db.query(User).filter(User.id == s_id).first()
            if not user:
                continue

            masteries = db.query(ConceptMastery).filter(ConceptMastery.student_id == s_id).all()
            avg_m = (sum(m.mastery_score for m in masteries) / len(masteries) * 100) if masteries else 20.0
            attempts = db.query(AssessmentAttempt).filter(AssessmentAttempt.student_id == s_id).count()
            active_misc = db.query(DetectedMisconception).filter(
                DetectedMisconception.student_id == s_id,
                DetectedMisconception.status == "active"
            ).count()

            status = "At-Risk" if avg_m < 40 or active_misc >= 2 else ("Proficient" if avg_m >= 75 else "Developing")
            lines.append(f'"{user.full_name}","{user.email}",{avg_m:.1f},{attempts},{active_misc},"{status}"')

        return "\n".join(lines)

teacher_analytics = TeacherAnalyticsService()
