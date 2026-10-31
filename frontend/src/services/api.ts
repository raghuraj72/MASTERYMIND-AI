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

const API_BASE = '/api';

class ApiService {
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
  async login(email: string, password: string):Promise<AuthTokenResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  }

  async register(data: {
    email: string;
    password: string;
    full_name: string;
    role?: string;
    class_grade?: string;
    target_exam_date?: string;
    preferred_language?: string;
    learning_goals?: string;
  }): Promise<AuthTokenResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  }

  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  }

  // --- Curriculum & Graph ---
  async getConceptGraph(): Promise<ConceptGraphResponse> {
    const res = await fetch(`${API_BASE}/curriculum/concept-graph`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load concept graph');
    return res.json();
  }

  async getChapters(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/curriculum/chapters`, {
      headers: this.getHeaders(),
    });
    return res.json();
  }

  // --- Diagnostics ---
  async startDiagnostic(): Promise<{
    attempt_id: string;
    assessment_title: string;
    total_questions: number;
    questions: Question[];
  }> {
    const res = await fetch(`${API_BASE}/diagnostics/start`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to start diagnostic');
    return res.json();
  }

  async submitDiagnostic(
    attemptId: string,
    answers: Array<{
      question_id: string;
      student_answer: string;
      confidence_level: string;
      reasoning_text?: string;
      latency_seconds?: number;
    }>
  ): Promise<any> {
    const res = await fetch(`${API_BASE}/diagnostics/${attemptId}/submit`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) throw new Error('Failed to submit diagnostic');
    return res.json();
  }

  // --- Student Experience ---
  async getStudentDashboard(): Promise<StudentDashboardData> {
    const res = await fetch(`${API_BASE}/student/dashboard`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load student dashboard');
    return res.json();
  }

  async updateStudentProfile(data: {
    class_grade?: string;
    target_exam_date?: string;
    preferred_language?: string;
    learning_goals?: string;
    onboarding_completed?: boolean;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/student/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async getMasteryHistory(): Promise<MasteryEventHistoryItem[]> {
    const res = await fetch(`${API_BASE}/student/mastery-history`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load history');
    return res.json();
  }

  async getRevisionSchedule(): Promise<RevisionScheduleItem[]> {
    const res = await fetch(`${API_BASE}/student/revision-schedule`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load revision schedule');
    return res.json();
  }

  async completeRevision(scheduleId: string, quality: number): Promise<RevisionScheduleItem> {
    const res = await fetch(`${API_BASE}/revision/${scheduleId}/complete`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ quality }),
    });
    if (!res.ok) throw new Error('Failed to update revision item');
    return res.json();
  }

  // --- Adaptive Practice ---
  async getNextQuestion(targetConceptCode?: string): Promise<{
    question: Question | null;
    selection_reason: string;
    selection_factors: Record<string, any>;
  }> {
    const res = await fetch(`${API_BASE}/practice/next-question`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ target_concept_code: targetConceptCode || null }),
    });
    if (!res.ok) throw new Error('Failed to fetch next adaptive question');
    return res.json();
  }

  async submitPracticeAnswer(data: {
    question_id: string;
    student_answer: string;
    confidence_level: string;
    reasoning_text?: string;
    latency_seconds?: number;
  }): Promise<PracticeSubmitResponse> {
    const res = await fetch(`${API_BASE}/practice/submit-answer`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit answer');
    return res.json();
  }

  // --- Teacher Analytics ---
  async getTeacherClasses(): Promise<Array<{
    id: string;
    name: string;
    section: string;
    academic_year: string;
    join_code: string;
    student_count: number;
  }>> {
    const res = await fetch(`${API_BASE}/teacher/classes`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load teacher classes');
    return res.json();
  }

  async getClassAnalytics(classId: string): Promise<TeacherClassOverview> {
    const res = await fetch(`${API_BASE}/teacher/classes/${classId}/analytics`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load class analytics');
    return res.json();
  }

  async getClassHeatmap(classId: string): Promise<HeatmapItem[]> {
    const res = await fetch(`${API_BASE}/teacher/classes/${classId}/heatmap`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load class heatmap');
    return res.json();
  }

  async getClassMisconceptions(classId: string): Promise<MisconceptionFrequencyItem[]> {
    const res = await fetch(`${API_BASE}/teacher/classes/${classId}/misconceptions`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load misconceptions');
    return res.json();
  }

  async getClassInterventions(classId: string): Promise<InterventionItem[]> {
    const res = await fetch(`${API_BASE}/teacher/classes/${classId}/interventions`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load interventions');
    return res.json();
  }

  async generateAIQuestion(conceptCode: string, difficulty: string): Promise<Question> {
    const res = await fetch(`${API_BASE}/teacher/questions/generate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ concept_code: conceptCode, difficulty }),
    });
    if (!res.ok) throw new Error('Failed to generate question');
    return res.json();
  }

  // --- Demo & Quick-Login ---
  async getDemoAccounts(): Promise<any> {
    const res = await fetch(`${API_BASE}/demo/accounts`);
    return res.json();
  }

  async resetDemoData(): Promise<any> {
    const res = await fetch(`${API_BASE}/demo/reset`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return res.json();
  }
}

export const api = new ApiService();
