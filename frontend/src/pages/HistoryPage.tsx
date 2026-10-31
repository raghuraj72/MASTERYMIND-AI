import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MasteryEventHistoryItem } from '../types';
import { History, TrendingUp, TrendingDown, Clock, ShieldCheck, Info } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [events, setEvents] = useState<MasteryEventHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await api.getMasteryHistory();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading audit history logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
            <History className="w-4 h-4" />
            Auditable Learner Model Log
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Mastery Event History & Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Every mastery change is stored with parameter weights, slips, guesses, and pedagogical rationales.
          </p>
        </div>

        {/* Audit Log Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          {events.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No mastery updates recorded yet. Complete diagnostic or practice sessions to see your audit log!
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((e) => {
                const isPositive = e.delta >= 0;
                return (
                  <div
                    key={e.id}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{e.concept_name}</span>
                        <span className="text-[10px] text-slate-400">• {e.chapter_title}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {e.reason_explanation}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span>Confidence: {e.confidence_level || 'N/A'}</span>
                        <span>•</span>
                        <span>{new Date(e.created_at).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 pl-4 border-l border-slate-800/80">
                      <div className="flex items-center gap-1.5 font-bold text-sm">
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-rose-400" />
                        )}
                        <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                          {isPositive ? `+${e.delta}%` : `${e.delta}%`}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {e.previous_mastery}% → <strong className="text-white">{e.new_mastery}%</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
