import React from 'react';
import { X, Brain, TrendingUp, TrendingDown, Clock, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { MasteryEventHistoryItem } from '../types';

interface EvidenceAuditModalProps {
  item: MasteryEventHistoryItem | null;
  onClose: () => void;
  onPracticeConcept?: (conceptCode: string) => void;
}

export const EvidenceAuditModal: React.FC<EvidenceAuditModalProps> = ({
  item,
  onClose,
  onPracticeConcept,
}) => {
  if (!item) return null;

  const isPositive = item.delta >= 0;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isPositive ? 'bg-emerald-500/10' : 'bg-rose-500/10'
        }`} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
          <Brain className="w-4 h-4" />
          <span>Bayesian Knowledge Tracing Audit Trail</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
          {item.concept_name}
        </h2>
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
          <span>{item.chapter_title}</span>
          <span>•</span>
          <span className="font-mono text-cyan-400">{item.concept_code}</span>
        </div>

        {/* Mastery Delta Card */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Estimated Mastery Transition
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-slate-400 line-through text-lg font-bold">
                {Math.round(item.previous_mastery * 100)}%
              </span>
              <span className="text-white text-2xl font-black">
                {Math.round(item.new_mastery * 100)}%
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Delta
            </span>
            <div className={`text-xl font-black flex items-center gap-1 justify-end mt-1 ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span>{isPositive ? `+${Math.round(item.delta * 100)}%` : `${Math.round(item.delta * 100)}%`}</span>
            </div>
          </div>
        </div>

        {/* Mathematical Model Explanation */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-indigo-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Learner Model Evaluation Evidence</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {item.reason_explanation}
          </p>

          {item.confidence_level && (
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Reported Student Confidence:</span>
              <span className="font-bold text-slate-200 uppercase bg-slate-800 px-2 py-0.5 rounded">
                {item.confidence_level}
              </span>
            </div>
          )}
        </div>

        {/* Timestamp & Provenance */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(item.created_at).toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-emerald-400/80 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Audited & Persisted
          </span>
        </div>

        {/* Action Button */}
        {onPracticeConcept && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                onClose();
                onPracticeConcept(item.concept_code);
              }}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Practice This Concept Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
