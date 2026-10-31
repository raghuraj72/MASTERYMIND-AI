import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Question } from '../types';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Send,
  HelpCircle,
  Sparkles,
  BarChart3,
  Award,
  BookOpen
} from 'lucide-react';

interface DiagnosticPageProps {
  onComplete: () => void;
}

export const DiagnosticPage: React.FC<DiagnosticPageProps> = ({ onComplete }) => {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, {
    student_answer: string;
    confidence_level: string;
    reasoning_text: string;
  }>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    const fetchDiagnostic = async () => {
      setLoading(true);
      try {
        const data = await api.startDiagnostic();
        setAttemptId(data.attempt_id);
        setQuestions(data.questions);
      } catch (err) {
        console.error('Failed to load diagnostic', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnostic();
  }, []);

  const currentQ = questions[currentIndex];

  const currentAnswer = currentQ ? answers[currentQ.id] || {
    student_answer: '',
    confidence_level: 'somewhat_sure',
    reasoning_text: '',
  } : null;

  const handleAnswerChange = (val: string) => {
    if (!currentQ) return;
    setAnswers({
      ...answers,
      [currentQ.id]: {
        ...(answers[currentQ.id] || { confidence_level: 'somewhat_sure', reasoning_text: '' }),
        student_answer: val,
      },
    });
  };

  const handleConfidenceChange = (conf: string) => {
    if (!currentQ) return;
    setAnswers({
      ...answers,
      [currentQ.id]: {
        ...(answers[currentQ.id] || { student_answer: '', reasoning_text: '' }),
        confidence_level: conf,
      },
    });
  };

  const handleReasoningChange = (text: string) => {
    if (!currentQ) return;
    setAnswers({
      ...answers,
      [currentQ.id]: {
        ...(answers[currentQ.id] || { student_answer: '', confidence_level: 'somewhat_sure' }),
        reasoning_text: text,
      },
    });
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    setSubmitting(true);
    try {
      const payload = questions.map((q) => {
        const a = answers[q.id] || {
          student_answer: 'A',
          confidence_level: 'somewhat_sure',
          reasoning_text: '',
        };
        return {
          question_id: q.id,
          student_answer: a.student_answer || 'A',
          confidence_level: a.confidence_level || 'somewhat_sure',
          reasoning_text: a.reasoning_text || '',
          latency_seconds: 35,
        };
      });

      const res = await api.submitDiagnostic(attemptId, payload);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Assembling balanced Class 10 Physics diagnostic assessment...</p>
        </div>
      </div>
    );
  }

  // Render Diagnostic Summary Report
  if (result) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 mb-3">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">Baseline Assessment Complete</h2>
            <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
              {result.summary_message}
            </p>
          </div>

          {/* Score & Calibration Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-8 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div className="text-center border-r border-slate-800/80 pr-2">
              <span className="text-xs text-slate-400 uppercase font-semibold block">Total Score</span>
              <span className="text-3xl font-black text-white mt-1 block">
                {result.score_percentage}%
              </span>
              <span className="text-xs text-slate-500">
                {result.correct_count} of {result.total_count} correct
              </span>
            </div>
            <div className="text-center border-r border-slate-800/80 pr-2">
              <span className="text-xs text-slate-400 uppercase font-semibold block">Assessed Concepts</span>
              <span className="text-3xl font-black text-cyan-400 mt-1 block">
                {result.concept_baselines.length}
              </span>
              <span className="text-xs text-slate-500">Across 4 chapters</span>
            </div>
            <div className="text-center">
              <span className="text-xs text-slate-400 uppercase font-semibold block">Focus Chapter</span>
              <span className="text-sm font-bold text-violet-300 mt-2 block truncate">
                {result.recommended_focus_chapter}
              </span>
              <span className="text-xs text-slate-500">Priority gap</span>
            </div>
          </div>

          {/* Concept Baseline Calibration Breakdown */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase text-slate-300 tracking-wider mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" />
              Per-Concept Bayesian Knowledge Tracing Baselines
            </h3>
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-2">
              {result.concept_baselines.map((c: any) => (
                <div
                  key={c.concept_id}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex-1 pr-4">
                    <div className="font-semibold text-slate-200">{c.concept_name}</div>
                    <div className="text-[11px] text-slate-400">{c.chapter_title}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">
                      {c.baseline_mastery}%
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] border ${
                        c.baseline_mastery >= 70
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : c.baseline_mastery >= 40
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all text-base"
          >
            Enter Student Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Top Progress Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              CBSE Class 10 Diagnostic • Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete
          </span>
        </div>

        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
            <span>{currentQ.chapter_title}</span>
            <span>•</span>
            <span className="text-cyan-400">{currentQ.concept_name}</span>
            <span>•</span>
            <span className="capitalize">{currentQ.difficulty}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed mt-2">
            {currentQ.text}
          </h3>

          {/* Options for MCQ */}
          {currentQ.question_type === 'mcq' && currentQ.options && (
            <div className="space-y-3 mt-6">
              {currentQ.options.map((opt) => {
                const isSelected = currentAnswer?.student_answer === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswerChange(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-950/40 ring-1 ring-violet-500'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="leading-snug">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Numerical / Short Answer Input */}
          {(currentQ.question_type === 'numerical' || currentQ.question_type === 'short_answer') && (
            <div className="mt-6">
              <label className="text-xs font-semibold text-slate-400 block mb-2">
                Enter your final calculated value or summary:
              </label>
              <input
                type="text"
                value={currentAnswer?.student_answer || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder={currentQ.question_type === 'numerical' ? 'e.g. -60 or 20' : 'Your brief answer...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          )}

          {/* Written Reasoning Input */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Explain Your Reasoning (Powers Misconception Diagnosis)
            </div>
            <textarea
              rows={2}
              value={currentAnswer?.reasoning_text || ''}
              onChange={(e) => handleReasoningChange(e.target.value)}
              placeholder="e.g. Applied mirror formula 1/f = 1/v + 1/u, focal length of concave is negative..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 leading-relaxed"
            />
          </div>

          {/* Confidence Rating Pills */}
          <div className="mt-5">
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              How confident are you in this answer?
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'guessing', label: 'Guessing', color: 'hover:border-slate-700' },
                { id: 'somewhat_sure', label: 'Somewhat Sure', color: 'hover:border-slate-700' },
                { id: 'confident', label: 'Confident', color: 'hover:border-slate-700' },
              ].map((c) => {
                const active = currentAnswer?.confidence_level === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleConfidenceChange(c.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      active
                        ? 'bg-violet-600/30 border-violet-500 text-violet-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white disabled:opacity-40 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-violet-900/30"
              >
                Next Question
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                {submitting ? 'Calibrating Model...' : 'Submit Diagnostic'}
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
