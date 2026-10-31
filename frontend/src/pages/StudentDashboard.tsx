import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StudentDashboardData } from '../types';
import {
  Brain,
  Zap,
  Target,
  Network,
  RotateCcw,
  Compass,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  Info
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
  onPracticeConcept?: (conceptCode: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onPracticeConcept,
}) => {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await api.getStudentDashboard();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading personalized learning model...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const chartData = data.chapter_masteries.map((ch) => ({
    name: `Ch ${ch.chapter_number}`,
    title: ch.chapter_title,
    mastery: ch.mastery_percentage,
  }));

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
                <Sparkles className="w-4 h-4" />
                Adaptive Learning Model Active
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Hello, {data.full_name}
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Class 10 Physics • Target Board Exam: {data.target_exam_date || 'March 2026'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('practice')}
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                Adaptive Practice
              </button>
              <button
                onClick={() => onNavigate('concept-graph')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all"
              >
                <Network className="w-4 h-4 text-cyan-400" />
                Concept Graph
              </button>
            </div>
          </div>

          {/* Model Estimate Clarification Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-300">Pedagogical Note:</strong> The mastery percentages displayed below are Bayesian statistical estimates of your current concept retention based on question evidence, slips, guesses, and written reasoning. They reflect mastery of syllabus concepts, not innate intelligence.
            </span>
          </div>
        </div>

        {/* Primary Metrics: Progress vs Mastery Distinction */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Estimated Concept Mastery
            </span>
            <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-2">
              <span>{data.overall_mastery_percentage}%</span>
              <span className="text-xs font-semibold text-emerald-400">Bayesian BKT</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-violet-500 rounded-full"
                style={{ width: `${data.overall_mastery_percentage}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-2 block">
              Across all 28 physics concepts
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Curriculum Coverage (Progress)
            </span>
            <div className="text-3xl font-black text-cyan-400 mt-2">
              {data.curriculum_coverage_percentage}%
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-cyan-500 rounded-full"
                style={{ width: `${data.curriculum_coverage_percentage}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-2 block">
              {data.total_questions_answered} questions answered in total
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Spaced Repetition Due
            </span>
            <div className="text-3xl font-black text-amber-400 mt-2 flex items-baseline gap-2">
              <span>{data.due_revisions_count}</span>
              <span className="text-xs font-semibold text-slate-400">cards due today</span>
            </div>
            <button
              onClick={() => onNavigate('revision')}
              className="mt-3 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Start revision review
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Active Misconceptions
            </span>
            <div className="text-3xl font-black text-rose-400 mt-2 flex items-baseline gap-2">
              <span>{data.active_misconceptions_count}</span>
              <span className="text-xs text-slate-500">to resolve</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-3 block">
              Targeted remediation scheduled
            </span>
          </div>
        </div>

        {/* Chapter Mastery Breakdown & Accuracy by Difficulty */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chapter Bar Chart */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-400" />
                Chapter-Level Mastery Distribution
              </h3>
              <span className="text-xs text-slate-400">Class 10 Physics</span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#c084fc' }}
                  />
                  <Bar dataKey="mastery" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
              {data.chapter_masteries.map((ch) => (
                <div key={ch.chapter_code} className="text-center">
                  <div className="text-[11px] text-slate-400 truncate">{ch.chapter_title}</div>
                  <div className="text-base font-bold text-white mt-0.5">{ch.mastery_percentage}%</div>
                  <div className="text-[10px] text-slate-500">{ch.mastered_count}/{ch.concepts_count} mastered</div>
                </div>
              ))}
            </div>
          </div>

          {/* Accuracy by Difficulty */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-amber-400" />
                Accuracy by Difficulty
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">Foundational</span>
                    <span className="text-white font-bold">{data.accuracy_by_difficulty.foundational}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${data.accuracy_by_difficulty.foundational}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">Intermediate</span>
                    <span className="text-white font-bold">{data.accuracy_by_difficulty.intermediate}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${data.accuracy_by_difficulty.intermediate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">Advanced</span>
                    <span className="text-white font-bold">{data.accuracy_by_difficulty.advanced}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${data.accuracy_by_difficulty.advanced}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block leading-tight">
                Total Solved: <strong className="text-white">{data.total_questions_answered}</strong> questions ({data.total_correct_answers} correct).
              </span>
            </div>
          </div>
        </div>

        {/* Daily Study Plan & Strong / Weak Concepts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personalized Daily Study Plan */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-cyan-400" />
              Personalized Daily Study Plan
            </h3>

            <div className="space-y-3">
              {data.daily_study_plan.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {item.task_type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">{item.estimated_minutes} mins</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1.5">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.rationale}</p>
                  </div>
                  <button
                    onClick={() => onNavigate('practice')}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg shrink-0 mt-1 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Strong & Weak Areas */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            {/* Weak Concepts */}
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Priority Weak Concepts (Prerequisite Focus)
              </h3>
              <div className="space-y-2">
                {data.weak_concepts.length > 0 ? (
                  data.weak_concepts.map((c) => (
                    <div
                      key={c.concept_id}
                      className="bg-slate-950 p-3 rounded-xl border border-rose-500/20 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">{c.name}</div>
                        <div className="text-[10px] text-slate-500">{c.chapter_title}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-rose-400">{c.mastery_percentage}%</span>
                        <button
                          onClick={() => onNavigate('practice')}
                          className="px-2 py-1 bg-rose-500/20 text-rose-300 rounded font-semibold text-[10px]"
                        >
                          Remediate
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No critically weak concepts detected.</p>
                )}
              </div>
            </div>

            {/* Strong Concepts */}
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Mastered Concepts (≥75%)
              </h3>
              <div className="space-y-2">
                {data.strong_concepts.map((c) => (
                  <div
                    key={c.concept_id}
                    className="bg-slate-950 p-3 rounded-xl border border-emerald-500/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{c.name}</div>
                      <div className="text-[10px] text-slate-500">{c.chapter_title}</div>
                    </div>
                    <span className="font-bold text-emerald-400">{c.mastery_percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
