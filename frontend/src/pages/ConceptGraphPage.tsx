import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ConceptGraphResponse, ConceptGraphNode } from '../types';
import { ConceptNodeModal } from '../components/ConceptNodeModal';
import {
  Network,
  Filter,
  Search,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Zap,
  Info
} from 'lucide-react';

interface ConceptGraphPageProps {
  onPracticeConcept: (conceptCode: string) => void;
}

export const ConceptGraphPage: React.FC<ConceptGraphPageProps> = ({ onPracticeConcept }) => {
  const [graphData, setGraphData] = useState<ConceptGraphResponse | null>(null);
  const [selectedNode, setSelectedNode] = useState<ConceptGraphNode | null>(null);
  const [chapterFilter, setChapterFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGraph = async () => {
      setLoading(true);
      try {
        const data = await api.getConceptGraph();
        setGraphData(data);
      } catch (err) {
        console.error('Failed to load concept graph', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Rendering 28-concept prerequisite graph...</p>
        </div>
      </div>
    );
  }

  if (!graphData) return null;

  // Filter nodes
  const filteredNodes = graphData.nodes.filter((node) => {
    const matchesChapter = chapterFilter === 'ALL' || node.chapter_code === chapterFilter;
    const matchesSearch =
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChapter && matchesSearch;
  });

  const nodeMap = new Map(graphData.nodes.map((n) => [n.id, n]));

  // Node status colors
  const statusColors = {
    mastered: 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-emerald-900/20',
    developing: 'border-amber-500 bg-amber-950/40 text-amber-300 shadow-amber-900/20',
    weak: 'border-rose-500 bg-rose-950/40 text-rose-300 shadow-rose-900/20',
    blocked: 'border-purple-500 bg-purple-950/40 text-purple-300 shadow-purple-900/20',
    unassessed: 'border-slate-700 bg-slate-900 text-slate-300 shadow-slate-900/20',
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Network className="w-4 h-4" />
              Syllabus Dependency Map
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Class 10 Physics Concept Dependency Graph
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore prerequisite chains, identify blocked downstream concepts, and target learning gaps.
            </p>
          </div>

          {/* Graph Legend */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-emerald-500/40 bg-emerald-500/20 text-emerald-300">
              Mastered (≥75%)
            </span>
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-amber-500/40 bg-amber-500/20 text-amber-300">
              Developing (40-74%)
            </span>
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-rose-500/40 bg-rose-500/20 text-rose-300">
              Weak (&lt;40%)
            </span>
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-purple-500/40 bg-purple-500/20 text-purple-300">
              Prerequisite Gap
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Chapter filter pills */}
          <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex-1">
            {[
              { id: 'ALL', label: 'All Chapters (28)' },
              { id: 'CH09_LIGHT', label: 'Ch 9: Light (8)' },
              { id: 'CH10_HUMAN_EYE', label: 'Ch 10: Human Eye (6)' },
              { id: 'CH11_ELECTRICITY', label: 'Ch 11: Electricity (8)' },
              { id: 'CH12_MAGNETISM', label: 'Ch 12: Magnetism (6)' },
            ].map((ch) => (
              <button
                key={ch.id}
                onClick={() => setChapterFilter(ch.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  chapterFilter === ch.id
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, formulas..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Concept Network Grid / Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNodes.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`border rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between ${statusColors[node.status]}`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                  <span className="text-slate-400">{node.chapter_code.replace('_', ' ')}</span>
                  <span>Lvl {node.level}</span>
                </div>
                <h3 className="font-bold text-sm text-white leading-snug">
                  {node.label}
                </h3>
                {node.formula && (
                  <code className="text-[11px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 mt-2 inline-block">
                    {node.formula}
                  </code>
                )}
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {node.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-white">
                    {node.mastery_percentage}%
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    Mastery
                  </span>
                </div>
                {node.prerequisite_gap && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold border border-purple-500/30 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Prereq Gap
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Concept Modal */}
        <ConceptNodeModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onPracticeConcept={onPracticeConcept}
        />
      </div>
    </div>
  );
};
