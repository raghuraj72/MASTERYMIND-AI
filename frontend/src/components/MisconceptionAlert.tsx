import React from 'react';
import { AlertTriangle, Lightbulb, CheckCircle2, Quote, ArrowRight } from 'lucide-react';
import { DetectedMisconceptionDetail } from '../types';

interface MisconceptionAlertProps {
  misconception: DetectedMisconceptionDetail;
  onDismiss: () => void;
}

export const MisconceptionAlert: React.FC<MisconceptionAlertProps> = ({ misconception, onDismiss }) => {
  return (
    <div className="bg-gradient-to-b from-rose-950/40 to-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-3 my-6">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Misconception Detected ({misconception.error_type.replace('_', ' ')})
            </span>
            <span className="text-xs text-slate-400">
              Confidence: {Math.round(misconception.confidence * 100)}%
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            {misconception.misconception_title || 'Conceptual Gap Identified'}
          </h3>
        </div>
      </div>

      {/* Evidence Quote Span */}
      {misconception.evidence_span && (
        <div className="mt-4 bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
          <Quote className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
              Diagnosed from your written reasoning
            </div>
            <p className="text-sm text-rose-200/90 font-mono italic mt-0.5">
              "{misconception.evidence_span}"
            </p>
          </div>
        </div>
      )}

      {/* Targeted Remediation Activity */}
      <div className="mt-4 bg-violet-950/30 border border-violet-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 text-violet-300 font-semibold text-sm">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Targeted Remediation & Physical Intuition
        </div>
        <p className="text-sm text-slate-200 mt-2 leading-relaxed">
          {misconception.recommended_remediation}
        </p>
      </div>

      {/* Correct Physical Explanation */}
      {misconception.correct_explanation && (
        <div className="mt-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-200 leading-relaxed">
            <span className="font-semibold text-emerald-300">Scientific Foundation: </span>
            {misconception.correct_explanation}
          </div>
        </div>
      )}

      {/* Action button */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={onDismiss}
          className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-500 hover:to-violet-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-900/30 flex items-center gap-2 transition-all"
        >
          I Understand This Concept Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
