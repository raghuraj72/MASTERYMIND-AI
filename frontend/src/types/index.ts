export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'teacher' | 'admin';
  is_active: boolean;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  role: string;
  user_id: string;
  full_name: string;
  email: string;
}

export interface ConceptGraphNode {
  id: string;
  code: string;
  label: string;
  chapter_code: string;
  chapter_number: number;
  chapter_title: string;
  level: number;
  formula?: string;
  description: string;
  learning_objectives: string;
  mastery_percentage: number;
  uncertainty: number;
  status: 'mastered' | 'developing' | 'weak' | 'blocked' | 'unassessed';
  prerequisite_gap: boolean;
}

export interface ConceptGraphEdge {
  id: string;
  source: string;
  target: string;
  strength: number;
}

export interface ConceptGraphResponse {
  nodes: ConceptGraphNode[];
  edges: ConceptGraphEdge[];
  total_concepts: number;
  mastered_count: number;
  developing_count: number;
  weak_count: number;
  unassessed_count: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  is_correct?: boolean;
  distractor_misconception_code?: string;
}

export interface Question {
  id: string;
  concept_id: string;
  concept_code?: string;
  concept_name?: string;
  chapter_number?: number;
  chapter_title?: string;
  code: string;
  text: string;
  question_type: 'mcq' | 'numerical' | 'short_answer';
  difficulty: 'foundational' | 'intermediate' | 'advanced';
  options?: QuestionOption[];
  correct_answer?: string;
  step_by_step_explanation?: string;
  expected_reasoning?: string;
  is_ai_generated: boolean;
}

export interface ChapterMasterySummary {
  chapter_number: number;
  chapter_code: string;
  chapter_title: string;
  mastery_percentage: number;
  concepts_count: number;
  mastered_count: number;
}

export interface ConceptMasterySummary {
  concept_id: string;
  code: string;
  name: string;
  chapter_title: string;
  mastery_percentage: number;
  uncertainty: number;
  status: string;
}

export interface DailyStudyPlanItem {
  task_type: 'revision' | 'practice' | 'diagnostic' | 'prerequisite_review';
  title: string;
  concept_code: string;
  concept_name: string;
  rationale: string;
  estimated_minutes: number;
}

export interface StudentDashboardData {
  student_id: string;
  full_name: string;
  email: string;
  class_grade: string;
  target_exam_date?: string;
  preferred_language: string;
  learning_goals?: string;
  overall_mastery_percentage: number;
  curriculum_coverage_percentage: number;
  chapter_masteries: ChapterMasterySummary[];
  strong_concepts: ConceptMasterySummary[];
  weak_concepts: ConceptMasterySummary[];
  insufficient_evidence_concepts: ConceptMasterySummary[];
  accuracy_by_difficulty: {
    foundational: number;
    intermediate: number;
    advanced: number;
  };
  daily_study_plan: DailyStudyPlanItem[];
  due_revisions_count: number;
  upcoming_revisions_count: number;
  total_questions_answered: number;
  total_correct_answers: number;
  active_misconceptions_count: number;
}

export interface DetectedMisconceptionDetail {
  misconception_code?: string;
  misconception_title?: string;
  evidence_span: string;
  error_type: string;
  confidence: number;
  recommended_remediation: string;
  correct_explanation: string;
}

export interface PracticeSubmitResponse {
  is_correct: boolean;
  correct_answer: string;
  step_by_step_explanation: string;
  feedback: string;
  concept_id: string;
  concept_code: string;
  concept_name: string;
  previous_mastery: number;
  new_mastery: number;
  delta: number;
  model_explanation: string;
  has_misconception: boolean;
  misconception?: DetectedMisconceptionDetail;
  next_step_recommendation: string;
  next_recommended_concept: string;
}

export interface MasteryEventHistoryItem {
  id: string;
  concept_code: string;
  concept_name: string;
  chapter_title: string;
  previous_mastery: number;
  new_mastery: number;
  delta: number;
  confidence_level?: string;
  reason_explanation: string;
  created_at: string;
}

export interface RevisionScheduleItem {
  id: string;
  concept_id: string;
  concept_code: string;
  concept_name: string;
  chapter_title: string;
  interval_days: number;
  ease_factor: number;
  repetition_count: number;
  next_due_date: string;
  last_reviewed_at?: string;
  status: 'due' | 'upcoming' | 'mastered';
  formula?: string;
  key_concept_summary: string;
}

export interface TeacherClassOverview {
  class_id: string;
  class_name: string;
  section: string;
  academic_year: string;
  join_code: string;
  total_students: number;
  average_mastery: number;
  completed_assessments: number;
  active_misconceptions_count: number;
  at_risk_count: number;
  at_risk_students: Array<{
    student_id: string;
    name: string;
    email: string;
    average_mastery: number;
    active_misconceptions: number;
    recommended_action: string;
  }>;
}

export interface HeatmapItem {
  chapter_number: number;
  chapter_code: string;
  chapter_title: string;
  concept_id: string;
  concept_code: string;
  concept_name: string;
  foundational_level: number;
  formula?: string;
  average_mastery: number;
  distribution: {
    mastered: number;
    developing: number;
    weak: number;
    unassessed: number;
  };
}

export interface MisconceptionFrequencyItem {
  misconception_id: string;
  code: string;
  title: string;
  concept_name: string;
  total_occurrences: number;
  unique_students_affected: number;
  percentage_class: number;
  remediation_guide: string;
  incorrect_belief: string;
}

export interface InterventionItem {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  affected_concept: string;
  students_affected_count: number;
  class_percentage: number;
  observed_evidence: string;
  recommended_action: string;
  recommended_activity: string;
}
