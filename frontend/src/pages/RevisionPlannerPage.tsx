import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RevisionScheduleItem } from '../types';
import {
  RotateCcw,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const RevisionPlannerPage: React.FC = () => {
  const [schedules, setSchedules] = useState<RevisionScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<RevisionScheduleItem | null>(null);
  const [showFormula, setShowFormula] = useState(false);
  const [completedSuccessMsg, setCompletedSuccessMsg] = useState<string | null>(null);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const data = await api.getRevisionSchedule();
      setSchedules(data);
      const dueFirst = data.find((s) => s.status === 'due') || data[0] || null;
      setActiveItem(dueFirst);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleRate = async (quality: number) => {
    if (!activeItem) return;
    try {
      const updated = await api.completeRevision(activeItem.id, quality);
      setCompletedSuccessMsg(
        `Review recorded! Next review scheduled in ${updated.interval_days} day(s) (Ease Factor: ${updated.ease_factor}).`
      );
      setTimeout(() => setCompletedSuccessMsg(null), 4000);
      setShowFormula(false);
      await fetchSchedule();
    } catch (err) {
      console.error('Failed to complete revision', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading spaced repetition schedule...</p>
        </div>
      </div>
    );
  }

  const dueItems = schedules.filter((s) => s.status === 'due');
  const upcomingItems = schedules.filter((s) => s.status !== 'due');

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <RotateCcw className="w-4 h-4" />
              SM-2 Spaced Repetition Memory Engine
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Physics Revision Planner
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Reinforces long-term memory using optimal spaced intervals before the CBSE Board Exam.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Due Today</span>
              <span className="text-xl font-black text-amber-400">{dueItems.length}</span>
            </div>
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Upcoming</span>
              <span className="text-xl font-black text-slate-300">{upcomingItems.length}</span>
            </div>
          </div>
        </div>

        {/* Feedback message */}
        {completedSuccessMsg && (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{completedSuccessMsg}</span>
          </div>
        )}

        {/* Active Revision Flashcard */}
        {activeItem ? (
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs uppercase font-semibold text-slate-400 tracking-wider mb-4 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">{activeItem.chapter_title}</span>
                <span>•</span>
                <span>Review #{activeItem.repetition_count + 1}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                activeItem.status === 'due'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {activeItem.status}
              </span>
            </div>

            <div className="text-center py-6">
              <span className="text-xs text-indigo-400 font-mono">{activeItem.concept_code}</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {activeItem.concept_name}
              </h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto mt-3 leading-relaxed">
                {activeItem.key_concept_summary}
              </p>

              {/* Reveal formula / derivation button */}
              {activeItem.formula && (
                <div className="mt-6">
                  {!showFormula ? (
                    <button
                      onClick={() => setShowFormula(true)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Show Formula & Key Principle
                    </button>
                  ) : (
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl inline-block animate-in fade-in">
                      <code className="text-sm font-mono text-cyan-300">
                        {activeItem.formula}
                      </code>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Self-Rating Feedback Buttons (SM-2 Quality 1 to 5) */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="text-center text-xs font-semibold text-slate-400 mb-4">
                Rate your recall quality for this concept:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                <button
                  onClick={() => handleRate(1)}
                  className="p-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 rounded-2xl text-center transition-all group"
                >
                  <div className="font-bold text-rose-300 text-sm">Again (1)</div>
                  <div className="text-[10px] text-slate-400 mt-1">Blackout (Resets to 1d)</div>
                </button>
                <button
                  onClick={() => handleRate(2)}
                  className="p-3 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 rounded-2xl text-center transition-all group"
                >
                  <div className="font-bold text-amber-300 text-sm">Hard (2)</div>
                  <div className="text-[10px] text-slate-400 mt-1">Struggled (1-2 days)</div>
                </button>
                <button
                  onClick={() => handleRate(4)}
                  className="p-3 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-2xl text-center transition-all group"
                >
                  <div className="font-bold text-cyan-300 text-sm">Good (4)</div>
                  <div className="text-[10px] text-slate-400 mt-1">Successful Recall</div>
                </button>
                <button
                  onClick={() => handleRate(5)}
                  className="p-3 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-2xl text-center transition-all group"
                >
                  <div className="font-bold text-emerald-300 text-sm">Easy (5)</div>
                  <div className="text-[10px] text-slate-400 mt-1">Perfect Recall (Max Jump)</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white">All Revisions Up to Date!</h3>
            <p className="text-xs text-slate-400 mt-1">
              You have completed all scheduled spaced repetition reviews for today.
            </p>
          </div>
        )}

        {/* Schedule Queue List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold uppercase text-slate-300 tracking-wider mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Full Spaced Repetition Queue ({schedules.length} Concepts)
          </h3>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-2">
            {schedules.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  setActiveItem(s);
                  setShowFormula(false);
                }}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                  activeItem?.id === s.id
                    ? 'bg-slate-800 border-indigo-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-200">{s.concept_name}</div>
                  <div className="text-[11px] text-slate-400">{s.chapter_title}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">
                    Interval: {s.interval_days}d
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] border ${
                      s.status === 'due'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
