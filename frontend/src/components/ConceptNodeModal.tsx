import React from 'react';
import { X, BookOpen, AlertCircle, ArrowRight, Zap, Target } from 'lucide-react';
import { ConceptGraphNode } from '../types';

interface ConceptNodeModalProps {
  node: ConceptGraphNode | null;
  onClose: () => void;
  onPracticeConcept: (conceptCode: string) => void;
}

export const ConceptNodeModal: React.FC<ConceptNodeModalProps> = ({
  node,
  onClose,
  onPracticeConcept,
}) => {
  if (!node) return null;

  const statusColors = {
    mastered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    developing: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    weak: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    blocked: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    unassessed: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400 tracking-wider">
          <span>{node.chapter_title} (Ch {node.chapter_number})</span>
          <span>•</span>
          <span>Level {node.level}</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">
          {node.label}
        </h2>
        <div className="text-xs text-indigo-400 font-mono mt-0.5">
          {node.code}
        </div>

        {/* Mastery Gauge & Status */}
        <div className="mt-5 grid grid-cols-2 gap-3 bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Estimated Mastery
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">
                {node.mastery_percentage}%
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${statusColors[node.status]}`}>
                {node.status}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  node.mastery_percentage >= 75
                    ? 'bg-emerald-500'
                    : node.mastery_percentage >= 40
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${node.mastery_percentage}%` }}
              />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Model Uncertainty
            </span>
            <div className="text-lg font-bold text-slate-300 mt-1">
              ±{Math.round(node.uncertainty * 100)}%
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block leading-tight">
              {node.uncertainty > 0.6
                ? 'High uncertainty (few observations)'
                : 'Well calibrated estimate'}
            </span>
          </div>
        </div>

        {/* Prerequisite Alert if Blocked */}
        {node.prerequisite_gap && (
          <div className="mt-4 bg-purple-950/30 border border-purple-500/40 rounded-xl p-3 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs text-purple-200">
              <span className="font-bold text-purple-300">Prerequisite Warning: </span>
              A foundational prerequisite for this concept is currently below mastery threshold (40%). Master foundational prerequisites first for optimal retention!
            </div>
          </div>
        )}

        {/* Formula */}
        {node.formula && (
          <div className="mt-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Key Formula / Principle
            </span>
            <code className="text-sm font-mono text-cyan-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 inline-block">
              {node.formula}
            </code>
          </div>
        )}

        {/* Description & Objectives */}
        <div className="mt-4 space-y-2">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Conceptual Overview
            </span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {node.description}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              NCERT Learning Objectives
            </span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {node.learning_objectives}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onPracticeConcept(node.code);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-900/30 flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Practice This Concept
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
