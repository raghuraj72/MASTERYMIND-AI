import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Cpu, Target, Network, HelpCircle } from 'lucide-react';

interface AdaptiveReasonPillProps {
  reason: string;
  factors?: Record<string, any>;
}

export const AdaptiveReasonPill: React.FC<AdaptiveReasonPillProps> = ({ reason, factors }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-indigo-500/20 text-indigo-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-200">
            Why this question was selected:
          </span>
          <span className="text-slate-400 hidden sm:inline max-w-md truncate">
            {reason}
          </span>
        </div>
        <button className="text-slate-400 hover:text-white p-0.5">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 animate-in fade-in">
          <p className="text-slate-300 leading-relaxed font-sans">
            {reason}
          </p>
          {factors && Object.keys(factors).length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <Target className="w-3 h-3 text-rose-400" />
                  Mastery Deficit
                </span>
                <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                  {factors.mastery_deficit !== undefined ? factors.mastery_deficit : '—'}
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <Network className="w-3 h-3 text-amber-400" />
                  Prereq Block
                </span>
                <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                  {factors.prereq_blocking !== undefined ? factors.prereq_blocking : '—'}
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-cyan-400" />
                  Model Uncertainty
                </span>
                <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                  {factors.uncertainty !== undefined ? factors.uncertainty : '—'}
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  Difficulty Fit
                </span>
                <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                  {factors.difficulty_match !== undefined ? factors.difficulty_match : '—'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
