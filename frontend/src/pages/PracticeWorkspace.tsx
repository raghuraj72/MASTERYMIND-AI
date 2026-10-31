import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Question, PracticeSubmitResponse, MasteryEventHistoryItem } from '../types';
import { MisconceptionAlert } from '../components/MisconceptionAlert';
import { AdaptiveReasonPill } from '../components/AdaptiveReasonPill';
import {
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Send,
  Loader2,
  Clock,
  ShieldCheck,
  Brain
} from 'lucide-react';

interface PracticeWorkspaceProps {
  initialConceptCode?: string;
  onNavigateToGraph?: () => void;
}

export const PracticeWorkspace: React.FC<PracticeWorkspaceProps> = ({
  initialConceptCode,
  onNavigateToGraph,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectionReason, setSelectionReason] = useState<string>('');
  const [selectionFactors, setSelectionFactors] = useState<Record<string, any>>({});
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [confidenceLevel, setConfidenceLevel] = useState<string>('somewhat_sure');
  const [reasoningText, setReasoningText] = useState<string>('');
  const [loadingQuestion, setLoadingQuestion] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<PracticeSubmitResponse | null>(null);
  const [activeMisconception, setActiveMisconception] = useState<any | null>(null);
  const [conceptHistory, setConceptHistory] = useState<MasteryEventHistoryItem[]>([]);

  const fetchNextAdaptiveQuestion = async (targetConcept?: string) => {
    setLoadingQuestion(true);
    setSubmissionResult(null);
    setActiveMisconception(null);
    setConceptHistory([]);
    setStudentAnswer('');
    setReasoningText('');
    setConfidenceLevel('somewhat_sure');

    try {
      const res = await api.getNextQuestion(targetConcept);
      setCurrentQuestion(res.question);
      setSelectionReason(res.selection_reason);
      setSelectionFactors(res.selection_factors);
    } catch (err) {
      console.error('Failed to fetch next question', err);
    } finally {
      setLoadingQuestion(false);
    }
  };

  useEffect(() => {
    fetchNextAdaptiveQuestion(initialConceptCode);
  }, [initialConceptCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || !studentAnswer.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.submitPracticeAnswer({
        question_id: currentQuestion.id,
        student_answer: studentAnswer,
        confidence_level: confidenceLevel,
        reasoning_text: reasoningText,
        latency_seconds: 40,
      });

      setSubmissionResult(res);
      if (res.has_misconception && res.misconception) {
        setActiveMisconception(res.misconception);
      }

      // Fetch updated history for this concept
      try {
        const history = await api.getMasteryHistory();
        const forConcept = history.filter((h) => h.concept_code === res.concept_code);
        setConceptHistory(forConcept.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch concept history', err);
      }
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingQuestion) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          <p className="text-sm text-slate-400">Selecting optimal question based on learner model...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold">All Questions Completed!</h2>
          <p className="text-xs text-slate-400 mt-2">
            You have practiced every available question in the current scope.
          </p>
          <button
            onClick={() => fetchNextAdaptiveQuestion()}
            className="mt-6 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold"
          >
            Restart Adaptive Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4 sm:px-6 lg:px-8 selection:bg-violet-500 selection:text-white">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Adaptive Rationale Pill */}
        <AdaptiveReasonPill reason={selectionReason} factors={selectionFactors} />

        {/* Question Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          {/* Metadata banner */}
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-400 tracking-wider mb-4 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-violet-400 font-bold">{currentQuestion.chapter_title}</span>
              <span>•</span>
              <span className="text-cyan-400">{currentQuestion.concept_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                currentQuestion.difficulty === 'foundational'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : currentQuestion.difficulty === 'intermediate'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
              }`}>
                {currentQuestion.difficulty}
              </span>
              {currentQuestion.is_ai_generated && (
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-500/30">
                  AI Generated
                </span>
              )}
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQuestion.text}
          </h2>

          {/* Options / Input Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {currentQuestion.question_type === 'mcq' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = studentAnswer === opt.id;
                  const isSubmitted = submissionResult !== null;
                  const isCorrectOption = submissionResult && submissionResult.correct_answer === opt.id;

                  let borderClass = 'border-slate-800 bg-slate-950/70 hover:border-slate-700';
                  if (isSelected) {
                    borderClass = 'border-violet-500 bg-violet-600/20 text-white ring-1 ring-violet-500';
                  }
                  if (isSubmitted) {
                    if (isCorrectOption) {
                      borderClass = 'border-emerald-500 bg-emerald-950/50 text-emerald-200 ring-1 ring-emerald-500';
                    } else if (isSelected && !submissionResult.is_correct) {
                      borderClass = 'border-rose-500 bg-rose-950/50 text-rose-200 ring-1 ring-rose-500';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => setStudentAnswer(opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border text-sm flex items-center gap-3 transition-all ${borderClass}`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'
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

            {(currentQuestion.question_type === 'numerical' || currentQuestion.question_type === 'short_answer') && (
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">
                  Enter your numerical answer:
                </label>
                <input
                  type="text"
                  disabled={submissionResult !== null}
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder={currentQuestion.question_type === 'numerical' ? 'e.g. -60 or 20' : 'Type brief explanation...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            )}

            {/* Confidence Rating Picker */}
            {!submissionResult && (
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  Confidence Rating (Modulates Bayesian Guess & Slip Parameters):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'guessing', label: 'Guessing (P_guess ↑)' },
                    { id: 'somewhat_sure', label: 'Somewhat Sure' },
                    { id: 'confident', label: 'Confident (P_slip ↑)' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setConfidenceLevel(c.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        confidenceLevel === c.id
                          ? 'bg-violet-600/30 border-violet-500 text-violet-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Written Reasoning Area */}
            {!submissionResult && (
              <div className="pt-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Your Reasoning (Key for Misconception Detection)
                </div>
                <textarea
                  rows={2}
                  value={reasoningText}
                  onChange={(e) => setReasoningText(e.target.value)}
                  placeholder="Explain why you picked this answer (e.g., 'Since voltage is constant, increasing current increases resistance according to Ohm law...')"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 leading-relaxed"
                />
              </div>
            )}

            {/* Submit Button */}
            {!submissionResult && (
              <button
                type="submit"
                disabled={submitting || !studentAnswer.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
              >
                {submitting ? 'Evaluating Reasoning...' : 'Submit & Diagnose'}
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Submission Feedback & Learner Model Audit Breakdown */}
          {submissionResult && (
            <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-5 animate-in fade-in">
              {/* Outcome Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  submissionResult.is_correct
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}
              >
                {submissionResult.is_correct ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-base text-white">
                    {submissionResult.is_correct ? 'Correct Solution!' : 'Incorrect Solution'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">{submissionResult.feedback}</p>
                </div>
              </div>

              {/* Step-by-Step Explanation */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
                  Step-by-Step Derivation & Solution
                </span>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                  {submissionResult.step_by_step_explanation}
                </p>
              </div>

              {/* Misconception Alert if Present */}
              {activeMisconception ? (
                <MisconceptionAlert
                  misconception={activeMisconception}
                  onDismiss={() => setActiveMisconception(null)}
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    <strong>Reasoning Analysis:</strong> No structured misconception patterns detected in your written explanation. Evaluated cleanly against known CBSE Class 10 physics misconceptions without speculative labeling.
                  </span>
                </div>
              )}

              {/* BKT Mastery Update Card */}
              <div className="bg-gradient-to-r from-slate-950 to-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase text-indigo-400 tracking-wider block">
                    BKT Mastery Update • {submissionResult.concept_name}
                  </span>
                  <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                    {submissionResult.model_explanation}
                  </p>
                </div>
                <div className="text-right pl-4">
                  <div className="text-2xl font-black text-white">
                    {submissionResult.new_mastery}%
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      submissionResult.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {submissionResult.delta >= 0 ? `+${submissionResult.delta}%` : `${submissionResult.delta}%`}
                  </span>
                </div>
              </div>

              {/* Mini Concept Mastery Timeline */}
              {conceptHistory.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-3">
                    Concept Mastery Evolution Timeline ({submissionResult.concept_name})
                  </span>
                  <div className="space-y-2">
                    {conceptHistory.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="text-xs flex items-center justify-between text-slate-400 border-b border-slate-800/60 pb-1.5 last:border-b-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                          <span className="truncate max-w-xs">{item.reason_explanation}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-bold text-white">{Math.round(item.new_mastery * 100)}%</span>
                          <span className={item.delta >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            ({item.delta >= 0 ? `+${Math.round(item.delta * 100)}%` : `${Math.round(item.delta * 100)}%`})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Step Recommendation */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-300">
                  <strong className="text-cyan-400">Adaptive Next Step: </strong>
                  {submissionResult.next_step_recommendation}
                </div>
                <button
                  onClick={() => fetchNextAdaptiveQuestion()}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0 ml-4"
                >
                  Next Adaptive Question
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
