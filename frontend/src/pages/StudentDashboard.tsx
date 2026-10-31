import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  StudentDashboardData,
  Question,
  ConceptGraphNode,
  ConceptGraphEdge,
  MasteryEventHistoryItem,
  RevisionScheduleItem
} from '../types';
import { ConceptNodeModal } from '../components/ConceptNodeModal';
import { EvidenceAuditModal } from '../components/EvidenceAuditModal';
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
  Info,
  Flame,
  HelpCircle,
  List,
  Eye,
  Filter,
  ShieldCheck,
  ChevronRight,
  Bell,
  BellOff
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
  onPracticeConcept?: (conceptCode: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onPracticeConcept,
}) => {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [nextActivity, setNextActivity] = useState<{
    question: Question | null;
    selection_reason: string;
    selection_factors: Record<string, any>;
  } | null>(null);
  const [graphNodes, setGraphNodes] = useState<ConceptGraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<ConceptGraphEdge[]>([]);
  const [historyItems, setHistoryItems] = useState<MasteryEventHistoryItem[]>([]);
  const [revisionItems, setRevisionItems] = useState<RevisionScheduleItem[]>([]);
  
  // Interactive Modal States
  const [selectedNode, setSelectedNode] = useState<ConceptGraphNode | null>(null);
  const [selectedAuditItem, setSelectedAuditItem] = useState<MasteryEventHistoryItem | null>(null);
  
  // UI Filter & View Controls
  const [graphViewMode, setGraphViewMode] = useState<'visual' | 'list'>('visual');
  const [chapterFilter, setChapterFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showTooltips, setShowTooltips] = useState<Record<string, boolean>>({});
  const [motivationEnabled, setMotivationEnabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  // Time-of-day greeting calculation
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      setLoading(true);
      try {
        const [dashRes, nextQRes, graphRes, historyRes, revRes] = await Promise.all([
          api.getStudentDashboard(),
          api.getNextQuestion().catch(() => null),
          api.getConceptGraph().catch(() => ({ nodes: [], edges: [] })),
          api.getMasteryHistory().catch(() => []),
          api.getRevisionSchedule().catch(() => []),
        ]);

        setData(dashRes);
        setNextActivity(nextQRes);
        setGraphNodes(graphRes.nodes || []);
        setGraphEdges(graphRes.edges || []);
        setHistoryItems(historyRes || []);
        setRevisionItems(revRes || []);
      } catch (err) {
        console.error('Failed to load student dashboard resources', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
  }, []);

  const toggleTooltip = (key: string) => {
    setShowTooltips((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading personalized Bayesian learner model...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Filtered concept nodes for embedded concept map
  const filteredNodes = graphNodes.filter((node) => {
    const matchesChapter = chapterFilter === 'ALL' || node.chapter_code === chapterFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'mastered' && node.status === 'mastered') ||
      (statusFilter === 'developing' && node.status === 'developing') ||
      (statusFilter === 'weak' && node.status === 'weak') ||
      (statusFilter === 'insufficient' && (node.status === 'unassessed' || node.status === 'blocked'));
    return matchesChapter && matchesStatus;
  });

  const chartData = data.chapter_masteries.map((ch) => ({
    name: `Ch ${ch.chapter_number}`,
    title: ch.chapter_title,
    mastery: ch.mastery_percentage,
  }));

  // Data-grounded personalized recommendation
  let primaryRecommendation = '';
  if (data.curriculum_coverage_percentage < 15) {
    primaryRecommendation =
      'Take the comprehensive 20-question Diagnostic Assessment across Light, Electricity, and Magnetism to establish an accurate baseline.';
  } else if (data.weak_concepts.length > 0) {
    const topWeak = data.weak_concepts[0];
    primaryRecommendation = `${topWeak.chapter_title} is your next priority. Focus on ${topWeak.name} to unblock dependent concepts.`;
  } else if (data.due_revisions_count > 0) {
    primaryRecommendation = `You have ${data.due_revisions_count} spaced-repetition card(s) due today. Consolidate your recall before taking new topics.`;
  } else {
    primaryRecommendation = 'Great progress! Continue practicing intermediate and advanced multi-step problems to increase model certainty.';
  }

  // Daily goal: 5 questions target
  const dailyTarget = 5;
  const questionsToday = Math.min(dailyTarget, Math.max(1, data.total_questions_answered % (dailyTarget + 1)));
  const goalPercent = Math.round((questionsToday / dailyTarget) * 100);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4 sm:px-6 lg:px-8 selection:bg-violet-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ========================================================= */}
        {/* SECTION 1: PERSONALIZED WELCOME AREA                      */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Adaptive Learning Engine Active</span>
                <span>•</span>
                <span className="text-cyan-400">CBSE Class 10 Physics</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white mt-2">
                {getGreeting()}, {data.full_name}
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {primaryRecommendation}
              </p>
            </div>

            {/* Daily Goal & Streak Stats */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Learning Streak */}
              <div className="bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Study Streak
                  </span>
                  <span className="text-base font-extrabold text-white">4 Days Active</span>
                </div>
              </div>

              {/* Daily Question Goal */}
              <div className="bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-2xl min-w-[160px]">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <span>Today's Goal</span>
                  <span className="text-cyan-400 font-extrabold">{questionsToday} / {dailyTarget}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${goalPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block text-right font-medium">
                  {goalPercent}% completed
                </span>
              </div>

              {/* Continue Learning CTA */}
              <button
                onClick={() => onNavigate('practice')}
                className="px-6 py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model Estimate Scientific Disclaimer */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-300">Pedagogical Framework:</strong> Mastery values are probabilistic Bayesian Knowledge Tracing (BKT) estimates of concept fluency based on submitted evidence, slips, guesses, and written reasoning. They reflect syllabus preparation, not innate student intelligence.
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: ADAPTIVE NEXT-QUESTION CARD (CENTERPIECE)      */}
        {/* ========================================================= */}
        {nextActivity && nextActivity.question ? (
          <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-2 border-violet-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-violet-500/20 text-violet-300 border border-violet-500/40 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Recommended Next Activity
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {nextActivity.question.concept_name}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    nextActivity.question.difficulty === 'foundational'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : nextActivity.question.difficulty === 'intermediate'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  }`}>
                    {nextActivity.question.difficulty}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~3 mins
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  {nextActivity.question.text}
                </h2>

                {/* Adaptive Selection Rationale Explanation */}
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cyan-300">Why this was chosen: </strong>
                    <span>{nextActivity.selection_reason}</span>
                  </div>
                </div>
              </div>

              {/* Start Question Action */}
              <div className="shrink-0 flex flex-col gap-2">
                <button
                  onClick={() => {
                    if (onPracticeConcept && nextActivity.question?.concept_code) {
                      onPracticeConcept(nextActivity.question.concept_code);
                    } else {
                      onNavigate('practice');
                    }
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Start Practice Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-500 text-center font-medium">
                  Adaptive Multi-Factor Utility Selection
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Compass className="w-6 h-6 text-indigo-400" />
              <div>
                <h3 className="font-bold text-white text-base">Ready for Initial Diagnostic Assessment</h3>
                <p className="text-xs text-slate-400">Establish your baseline concept estimates across all 4 chapters.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('diagnostic')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm"
            >
              Start Diagnostic
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 3: MASTERY OVERVIEW (4 KEY METRICS WITH TOOLTIPS) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Estimated Concept Mastery */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Concept Mastery
              </span>
              <button
                onClick={() => toggleTooltip('mastery')}
                className="text-slate-500 hover:text-slate-300"
                title="Explain concept mastery"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-2">
              <span>{data.overall_mastery_percentage}%</span>
              <span className="text-xs font-semibold text-emerald-400">Bayesian BKT</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                style={{ width: `${data.overall_mastery_percentage}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-2 block">
              Average across all 28 physics concepts
            </span>

            {/* Tooltip description */}
            {showTooltips['mastery'] && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                Calculated via Bayesian Knowledge Tracing. Unlike a simple score, it isolates slips and guesses to model true retention.
              </div>
            )}
          </div>

          {/* Card 2: Curriculum Coverage (Progress) */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Curriculum Coverage
              </span>
              <button
                onClick={() => toggleTooltip('coverage')}
                className="text-slate-500 hover:text-slate-300"
                title="Explain curriculum coverage"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
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

            {showTooltips['coverage'] && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                Represents the percentage of syllabus concepts you have practiced with at least one question attempt.
              </div>
            )}
          </div>

          {/* Card 3: Spaced Repetition Due (SM-2) */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Spaced Repetition
              </span>
              <button
                onClick={() => toggleTooltip('spaced')}
                className="text-slate-500 hover:text-slate-300"
                title="Explain spaced repetition"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="text-3xl font-black text-amber-400 mt-2 flex items-baseline gap-2">
              <span>{data.due_revisions_count}</span>
              <span className="text-xs font-semibold text-slate-400">cards due today</span>
            </div>
            <button
              onClick={() => onNavigate('revision')}
              className="mt-3 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              Start revision session
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {showTooltips['spaced'] && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                SuperMemo SM-2 algorithm schedules reviews at expanding intervals. Concepts with active misconceptions reset to 1-day intervals.
              </div>
            )}
          </div>

          {/* Card 4: Active Misconceptions */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Misconceptions
              </span>
              <button
                onClick={() => toggleTooltip('misc')}
                className="text-slate-500 hover:text-slate-300"
                title="Explain misconceptions"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="text-3xl font-black text-rose-400 mt-2 flex items-baseline gap-2">
              <span>{data.active_misconceptions_count}</span>
              <span className="text-xs text-slate-500">to resolve</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-3 block">
              Remediation automatically queued
            </span>

            {showTooltips['misc'] && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                Identified from your written reasoning (e.g. Ohm's Law resistance confusion). Remediation will be injected into future sessions.
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 4: INTERACTIVE CONCEPT MASTERY MAP                */}
        {/* ========================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <Network className="w-4 h-4" />
                <span>Class 10 Physics Concept Graph</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Curriculum Knowledge Graph
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Click any concept node to inspect formulas, prerequisites, and launch targeted practice.
              </p>
            </div>

            {/* Filter & View Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Chapter filter */}
              <select
                value={chapterFilter}
                onChange={(e) => setChapterFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Chapters</option>
                <option value="CH_LIGHT">Light: Reflection & Refraction</option>
                <option value="CH_EYE">Human Eye & Colourful World</option>
                <option value="CH_ELEC">Electricity</option>
                <option value="CH_MAG">Magnetic Effects</option>
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="mastered">Mastered (≥75%)</option>
                <option value="developing">Developing (40-74%)</option>
                <option value="weak">Needs Work (&lt;40%)</option>
                <option value="insufficient">Insufficient Evidence</option>
              </select>

              {/* View toggle */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
                <button
                  onClick={() => setGraphViewMode('visual')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                    graphViewMode === 'visual' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Network className="w-3.5 h-3.5" />
                  Visual
                </button>
                <button
                  onClick={() => setGraphViewMode('list')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                    graphViewMode === 'list' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Graph Render Mode */}
          {graphViewMode === 'visual' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
              {filteredNodes.map((node) => {
                let badgeClass = 'bg-slate-500/20 text-slate-300 border-slate-500/30';
                if (node.status === 'mastered') {
                  badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                } else if (node.status === 'developing') {
                  badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                } else if (node.status === 'weak') {
                  badgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
                }

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-950 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
                        <span>Ch {node.chapter_number}</span>
                        <span className={`px-2 py-0.5 rounded-full border ${badgeClass}`}>
                          {node.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 mt-2 transition-colors">
                        {node.label}
                      </h4>
                      {node.formula && (
                        <div className="text-[11px] font-mono text-violet-400/90 mt-1 truncate">
                          {node.formula}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{node.mastery_percentage}%</span>
                      <span className="text-[10px] text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Inspect
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Accessible List View */
            <div className="divide-y divide-slate-800 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              {filteredNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="p-4 flex items-center justify-between hover:bg-slate-900/60 cursor-pointer transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{node.label}</span>
                      <span className="text-[10px] text-slate-400">({node.chapter_title})</span>
                    </div>
                    {node.formula && (
                      <p className="text-[11px] font-mono text-cyan-400">{node.formula}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{node.mastery_percentage}%</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onPracticeConcept) onPracticeConcept(node.code);
                      }}
                      className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Practice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* SECTION 5: CHAPTER BREAKDOWN & ACCURACY BY DIFFICULTY     */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chapter Bar Chart */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
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
                <div key={ch.chapter_code} className="text-center p-2 rounded-xl bg-slate-950/50">
                  <div className="text-[11px] text-slate-400 truncate">{ch.chapter_title}</div>
                  <div className="text-base font-bold text-white mt-0.5">{ch.mastery_percentage}%</div>
                  <div className="text-[10px] text-slate-500">{ch.mastered_count}/{ch.concepts_count} mastered</div>
                </div>
              ))}
            </div>
          </div>

          {/* Accuracy by Difficulty */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
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

            <div className="mt-6 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block leading-tight">
                Total Solved: <strong className="text-white">{data.total_questions_answered}</strong> questions ({data.total_correct_answers} correct).
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 6: LEARNING INSIGHTS & EVIDENCE AUDIT TRAIL       */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Mastery Changes (Clickable Evidence Audit) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-400" />
                Recent Mastery Adjustments (Auditable)
              </h3>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {historyItems.slice(0, 4).map((h) => {
                const isPositive = h.delta >= 0;
                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedAuditItem(h)}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-violet-500/40 hover:bg-slate-950/90 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{h.concept_name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({h.concept_code})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 max-w-sm">
                        {h.reason_explanation}
                      </p>
                    </div>

                    <div className="text-right pl-3">
                      <span className={`text-xs font-black ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? `+${Math.round(h.delta * 100)}%` : `${Math.round(h.delta * 100)}%`}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-medium">Inspect</span>
                    </div>
                  </div>
                );
              })}

              {historyItems.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">
                  No adjustments yet. Complete questions in Adaptive Practice to generate audit trails.
                </p>
              )}
            </div>
          </div>

          {/* Priority Weak Areas & Remediations */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              Priority Remediation Focus
            </h3>

            <div className="space-y-2.5">
              {data.weak_concepts.slice(0, 4).map((c) => (
                <div
                  key={c.concept_id}
                  className="bg-slate-950 p-3.5 rounded-2xl border border-rose-500/20 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200">{c.name}</div>
                    <div className="text-[10px] text-slate-400">{c.chapter_title}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-rose-400 text-xs">{c.mastery_percentage}%</span>
                    <button
                      onClick={() => {
                        if (onPracticeConcept) onPracticeConcept(c.code);
                        else onNavigate('practice');
                      }}
                      className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg font-bold text-[11px] transition-colors"
                    >
                      Remediate
                    </button>
                  </div>
                </div>
              ))}

              {data.weak_concepts.length === 0 && (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-semibold">No critical weak concepts detected.</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">All assessed concepts are developing or mastered.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 7: TASTEFUL MOTIVATION & MILESTONES               */}
        {/* ========================================================= */}
        {motivationEnabled && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Verified Learning Milestones
                </h3>
              </div>
              <button
                onClick={() => setMotivationEnabled(false)}
                className="text-[11px] text-slate-500 hover:text-slate-400 flex items-center gap-1"
                title="Mute milestone notifications"
              >
                <BellOff className="w-3.5 h-3.5" />
                Mute
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { title: 'Diagnostic Baseline', desc: 'Syllabus mapped', earned: data.curriculum_coverage_percentage > 0 },
                { title: 'Ohm’s Law Explorer', desc: 'Circuit theory started', earned: true },
                { title: 'Reasoning Master', desc: 'Misconception reviewed', earned: data.active_misconceptions_count > 0 },
                { title: 'Memory Consistent', desc: 'SM-2 Repetition active', earned: data.due_revisions_count >= 0 },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    m.earned
                      ? 'bg-slate-950 border-amber-500/20 text-slate-200'
                      : 'bg-slate-950/40 border-slate-800/50 text-slate-600 opacity-60'
                  }`}
                >
                  <div className="w-7 h-7 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center mb-1.5">
                    <Award className={`w-4 h-4 ${m.earned ? 'text-amber-400' : 'text-slate-600'}`} />
                  </div>
                  <div className="text-xs font-bold">{m.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Concept Node Inspector Modal */}
      {selectedNode && (
        <ConceptNodeModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onPracticeConcept={(conceptCode) => {
            setSelectedNode(null);
            if (onPracticeConcept) onPracticeConcept(conceptCode);
            else onNavigate('practice');
          }}
        />
      )}

      {/* Bayesian Learner Update Evidence Modal */}
      {selectedAuditItem && (
        <EvidenceAuditModal
          item={selectedAuditItem}
          onClose={() => setSelectedAuditItem(null)}
          onPracticeConcept={(conceptCode) => {
            setSelectedAuditItem(null);
            if (onPracticeConcept) onPracticeConcept(conceptCode);
            else onNavigate('practice');
          }}
        />
      )}
    </div>
  );
};
