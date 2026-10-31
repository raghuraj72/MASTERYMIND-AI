import {
  AuthTokenResponse,
  User,
  ConceptGraphResponse,
  StudentDashboardData,
  Question,
  PracticeSubmitResponse,
  MasteryEventHistoryItem,
  RevisionScheduleItem,
  TeacherClassOverview,
  HeatmapItem,
  MisconceptionFrequencyItem,
  InterventionItem
} from '../types';
import {
  MOCK_USERS,
  MOCK_CHAPTERS,
  MOCK_CONCEPT_GRAPH,
  MOCK_QUESTIONS,
  MOCK_STUDENT_DASHBOARD,
  MOCK_HISTORY,
  MOCK_REVISIONS,
  MOCK_TEACHER_CLASSES,
  MOCK_CLASS_OVERVIEW,
  MOCK_CLASS_HEATMAP,
  MOCK_MISCONCEPTIONS,
  MOCK_INTERVENTIONS
} from './mockData';

const API_BASE = '/api';

class ApiService {
  private isStaticHost(): boolean {
    return (
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('github.io') || window.location.protocol === 'file:')
    );
  }

  private getToken(): string | null {
    return localStorage.getItem('masterymind_token');
  }

  private getHeaders(contentType: boolean = true): HeadersInit {
    const headers: Record<string, string> = {};
    if (contentType) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // --- Auth ---
  async login(email: string, password: string): Promise<AuthTokenResponse> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fall back to offline client provider
      }
    }

    // Client-side fallback authentication
    const isTeacher = email.includes('teacher');
    const user: User = {
      id: isTeacher ? MOCK_USERS.teacher.id : MOCK_USERS.student.id,
      email: isTeacher ? MOCK_USERS.teacher.email : email,
      full_name: isTeacher ? MOCK_USERS.teacher.full_name : MOCK_USERS.student.full_name,
      role: isTeacher ? 'teacher' : 'student',
      is_active: true
    };
    const token = `mock-jwt-token-${email}-${Date.now()}`;
    localStorage.setItem('masterymind_token', token);
    localStorage.setItem('masterymind_user', JSON.stringify(user));
    return {
      access_token: token,
      token_type: 'bearer',
      role: user.role,
      user_id: user.id,
      full_name: user.full_name,
      email: user.email
    };
  }

  async register(data: any): Promise<AuthTokenResponse> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }

    const user: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      full_name: data.full_name,
      role: data.role === 'teacher' ? 'teacher' : 'student',
      is_active: true
    };
    const token = `mock-jwt-token-${data.email}-${Date.now()}`;
    localStorage.setItem('masterymind_token', token);
    localStorage.setItem('masterymind_user', JSON.stringify(user));
    return {
      access_token: token,
      token_type: 'bearer',
      role: user.role,
      user_id: user.id,
      full_name: user.full_name,
      email: user.email
    };
  }

  async getCurrentUser(): Promise<User> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: this.getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }

    const saved = localStorage.getItem('masterymind_user');
    if (saved) return JSON.parse(saved);
    return MOCK_USERS.student as User;
  }

  // --- Curriculum & Graph ---
  async getConceptGraph(): Promise<ConceptGraphResponse> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/curriculum/concept-graph`, {
          headers: this.getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_CONCEPT_GRAPH;
  }

  async getChapters(): Promise<any[]> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/curriculum/chapters`, {
          headers: this.getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_CHAPTERS;
  }

  // --- Diagnostic Assessment ---
  async startDiagnostic(): Promise<any> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/diagnostics/start`, {
          method: 'POST',
          headers: this.getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    return {
      attempt_id: 'diag-attempt-1',
      assessment_title: 'CBSE Class 10 Physics Diagnostic Assessment',
      total_questions: MOCK_QUESTIONS.length,
      questions: MOCK_QUESTIONS
    };
  }

  async submitDiagnostic(attemptId: string, answers: any[]): Promise<any> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/diagnostics/${attemptId}/submit`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ answers }),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    return {
      attempt_id: attemptId,
      score_percentage: 75.0,
      correct_count: 3,
      total_count: 4,
      concept_baselines: [],
      strong_concepts: ['Laws of Reflection', 'Electric Charge'],
      weak_concepts: ['Ohm\'s Law & Resistance'],
      recommended_focus_chapter: 'Electricity',
      summary_message: 'Diagnostic complete! Baseline established.'
    };
  }

  // --- Student Experience ---
  async getStudentDashboard(): Promise<StudentDashboardData> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/student/dashboard`, {
          headers: this.getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_STUDENT_DASHBOARD;
  }

  async updateStudentProfile(data: any): Promise<any> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/student/profile`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    return { status: 'success', data };
  }

  async getMasteryHistory(): Promise<MasteryEventHistoryItem[]> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/student/mastery-history`, {
          headers: this.getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    const saved = localStorage.getItem('masterymind_history');
    if (saved) return JSON.parse(saved);
    return MOCK_HISTORY;
  }

  async getRevisionSchedule(): Promise<RevisionScheduleItem[]> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/student/revision-schedule`, {
          headers: this.getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_REVISIONS;
  }

  async completeRevision(scheduleId: string, quality: number): Promise<RevisionScheduleItem> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/revision/${scheduleId}/complete`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ quality }),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    const target = MOCK_REVISIONS.find((r) => r.id === scheduleId) || MOCK_REVISIONS[0];
    const newInterval = quality >= 3 ? target.interval_days * 2 : 1;
    return {
      ...target,
      interval_days: newInterval,
      ease_factor: 2.2,
      last_reviewed_at: new Date().toISOString()
    };
  }

  // --- Adaptive Practice ---
  async getNextQuestion(targetConceptCode?: string): Promise<{
    question: Question | null;
    selection_reason: string;
    selection_factors: Record<string, any>;
  }> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/practice/next-question`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ target_concept_code: targetConceptCode || null }),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }

    let q = MOCK_QUESTIONS[0];
    if (targetConceptCode) {
      const match = MOCK_QUESTIONS.find((item) => item.concept_code === targetConceptCode);
      if (match) q = match;
    }

    return {
      question: q,
      selection_reason: `Selected for '${q.concept_name}' based on: low mastery (32%), blocks 4 dependent concept(s), matched to ${q.difficulty} difficulty for current skill level.`,
      selection_factors: {
        mastery_deficit_weight: 0.35,
        prerequisite_blocking_weight: 0.25,
        uncertainty_weight: 0.15
      }
    };
  }

  async submitPracticeAnswer(data: {
    question_id: string;
    student_answer: string;
    confidence_level: string;
    reasoning_text?: string;
    latency_seconds?: number;
  }): Promise<PracticeSubmitResponse> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/practice/submit-answer`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }

    const question = MOCK_QUESTIONS.find((q) => q.id === data.question_id) || MOCK_QUESTIONS[0];
    const isCorrect = data.student_answer.trim().toUpperCase() === (question.correct_answer || 'B').toUpperCase();
    const reasoningLower = (data.reasoning_text || '').toLowerCase();

    // Check for misconception in reasoning
    const hasOhmMisconception =
      reasoningLower.includes('current increase') &&
      reasoningLower.includes('resistance');

    let delta = isCorrect ? 15 : -5;
    let modelExplanation = isCorrect
      ? 'Correct answer demonstrated concept mastery. Parameter slip probability discounted.'
      : 'Incorrect answer submitted. Bayesian knowledge tracing adjusted downward.';

    if (hasOhmMisconception) {
      delta = 8; // dampened
      modelExplanation =
        'Answer was evaluated, but written reasoning revealed a misconception: believing resistance increases with current in an ohmic conductor. Mastery increase was dampened by 50%.';
    }

    const prevMastery = 32;
    const newMastery = Math.min(98, Math.max(5, prevMastery + delta));

    // Persist to local history
    const historyItem: MasteryEventHistoryItem = {
      id: `h-${Date.now()}`,
      concept_code: question.concept_code || 'ELC_OHMS_LAW',
      concept_name: question.concept_name || 'Ohm\'s Law & Resistance',
      chapter_title: question.chapter_title || 'Electricity',
      previous_mastery: prevMastery / 100,
      new_mastery: newMastery / 100,
      delta: delta / 100,
      confidence_level: data.confidence_level,
      reason_explanation: modelExplanation,
      created_at: new Date().toISOString()
    };
    const saved = localStorage.getItem('masterymind_history');
    const existingHistory = saved ? JSON.parse(saved) : MOCK_HISTORY;
    localStorage.setItem('masterymind_history', JSON.stringify([historyItem, ...existingHistory]));

    return {
      is_correct: isCorrect,
      correct_answer: question.correct_answer || 'B',
      step_by_step_explanation: question.step_by_step_explanation || 'According to Ohm\'s law (V = IR), resistance is constant at constant temperature.',
      feedback: isCorrect ? 'Great job! Your answer matches the physics principles.' : 'Incorrect option selected.',
      concept_id: question.concept_id,
      concept_code: question.concept_code || 'ELC_OHMS_LAW',
      concept_name: question.concept_name || 'Ohm\'s Law & Resistance',
      previous_mastery: prevMastery,
      new_mastery: newMastery,
      delta,
      model_explanation: modelExplanation,
      has_misconception: hasOhmMisconception,
      misconception: hasOhmMisconception
        ? {
            misconception_code: 'MISC_OHM_R_I_CONFUSION',
            misconception_title: 'Belief that Resistance Changes with Current in an Ohmic Conductor',
            evidence_span: 'Reasoning quote: "current increases, resistance increases"',
            error_type: 'conceptual_misconception',
            confidence: 0.92,
            recommended_remediation: 'Remember: In Ohm\'s law (V = IR), resistance R is a constant property of the conductor (like the diameter of a pipe). It only changes if length, area, or temperature changes.',
            correct_explanation: 'Resistance of an ohmic resistor is independent of applied voltage or flowing current.'
          }
        : undefined,
      next_step_recommendation: hasOhmMisconception
        ? 'Review targeted remediation on Ohm\'s law before advancing to circuit calculations.'
        : 'Continue practicing intermediate problems on current and voltage.',
      next_recommended_concept: 'ELC_OHMS_LAW'
    };
  }

  // --- Teacher Analytics ---
  async getTeacherClasses(): Promise<any[]> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/teacher/classes`, {
          headers: this.getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_TEACHER_CLASSES;
  }

  async getClassOverview(classId: string): Promise<TeacherClassOverview> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/teacher/classes/${classId}/analytics`, {
          headers: this.getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_CLASS_OVERVIEW;
  }

  async getClassAnalytics(classId: string): Promise<TeacherClassOverview> {
    return this.getClassOverview(classId);
  }

  async getClassHeatmap(classId: string): Promise<HeatmapItem[]> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/teacher/classes/${classId}/heatmap`, {
          headers: this.getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_CLASS_HEATMAP;
  }

  async getClassMisconceptions(classId: string): Promise<MisconceptionFrequencyItem[]> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/teacher/classes/${classId}/misconceptions`, {
          headers: this.getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_MISCONCEPTIONS;
  }

  async getClassInterventions(classId: string): Promise<InterventionItem[]> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/teacher/classes/${classId}/interventions`, {
          headers: this.getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_INTERVENTIONS;
  }

  async generateAIQuestion(conceptCode: string, difficulty: string): Promise<Question> {
    return MOCK_QUESTIONS[0];
  }

  // --- Demo Quick Login ---
  async getDemoAccounts(): Promise<any> {
    if (!this.isStaticHost()) {
      try {
        const res = await fetch(`${API_BASE}/demo/accounts`);
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
    }
    return {
      teacher_accounts: [MOCK_USERS.teacher],
      student_accounts: [
        MOCK_USERS.student,
        { email: 'priya.patel@student.ai', name: 'Priya Patel', role: 'student', desc: 'Optics (38%)' },
        { email: 'ananya.iyer@student.ai', name: 'Ananya Iyer', role: 'student', desc: 'Current vs Voltage (54%)' },
        { email: 'rohan.verma@student.ai', name: 'Rohan Verma', role: 'student', desc: 'Benchmark student (88%)' }
      ]
    };
  }

  async resetDemoData(): Promise<any> {
    localStorage.removeItem('masterymind_history');
    return { status: 'success', message: 'Demo data reset successfully.' };
  }
}

export const api = new ApiService();
export default api;
