import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Network,
  X,
  Play,
  Layers,
  ChevronRight,
  ShieldCheck,
  Eye
} from 'lucide-react';

interface CinematicIntroProps {
  onStart: () => void;
  onExploreHowItWorks?: () => void;
  onClose?: () => void;
}

interface ConceptNode {
  id: string;
  name: string;
  formula: string;
  x: number;
  y: number;
  chapter: string;
  connections: string[];
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onStart,
  onExploreHowItWorks,
  onClose,
}) => {
  const [stage, setStage] = useState<'reveal' | 'promise' | 'preview' | 'cta'>('reveal');
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const [selectedPreview, setSelectedPreview] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Concept nodes in the neural graph representing CBSE Class 10 Physics
  const nodes: ConceptNode[] = [
    { id: 'ohm', name: "Ohm's Law", formula: 'V = IR', x: 28, y: 32, chapter: 'Electricity', connections: ['res_p', 'joule'] },
    { id: 'res_p', name: 'Parallel Resistance', formula: '1/R_p = 1/R_1 + 1/R_2', x: 22, y: 55, chapter: 'Electricity', connections: ['ohm'] },
    { id: 'joule', name: 'Joule Heating', formula: 'H = I²Rt', x: 38, y: 45, chapter: 'Electricity', connections: ['ohm', 'mag_sol'] },
    { id: 'snell', name: "Snell's Law", formula: 'n₁ sin i = n₂ sin r', x: 72, y: 30, chapter: 'Light', connections: ['lens_f', 'power'] },
    { id: 'lens_f', name: 'Lens Formula', formula: '1/f = 1/v - 1/u', x: 78, y: 52, chapter: 'Light', connections: ['snell', 'power'] },
    { id: 'power', name: 'Power of a Lens', formula: 'P = 1/f (m)', x: 62, y: 44, chapter: 'Light', connections: ['snell', 'eye_disp'] },
    { id: 'mag_sol', name: 'Solenoid Field', formula: 'B ∝ n·I', x: 42, y: 68, chapter: 'Magnetism', connections: ['joule', 'flem'] },
    { id: 'flem', name: "Fleming's Left-Hand", formula: 'F = B·I·L', x: 55, y: 72, chapter: 'Magnetism', connections: ['mag_sol'] },
    { id: 'eye_disp', name: 'Prism Dispersion', formula: 'White Light → Spectrum', x: 65, y: 65, chapter: 'Human Eye', connections: ['power', 'flem'] },
  ];

  // Progressive stage transitions
  useEffect(() => {
    const t1 = setTimeout(() => setStage('promise'), 1800);
    const t2 = setTimeout(() => setStage('preview'), 4500);
    const t3 = setTimeout(() => setStage('cta'), 7500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Parallax mouse effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleFinish = (action: 'start' | 'how-it-works') => {
    // Save persistence preferences
    sessionStorage.setItem('masterymind_intro_seen', 'true');
    if (dontShowAgain) {
      localStorage.setItem('masterymind_intro_dismissed', 'true');
    }

    // Trigger smooth fade & scale unmount
    setIsTransitioning(true);
    setTimeout(() => {
      if (action === 'start') {
        onStart();
      } else if (onExploreHowItWorks) {
        onExploreHowItWorks();
      } else {
        onStart();
      }
    }, 600);
  };

  // Keyboard navigation: Escape skips
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish('start');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dontShowAgain]);

  const previewCards = [
    {
      id: 0,
      title: 'Bayesian Concept Mastery',
      tag: 'Learner Model',
      icon: <Brain className="w-5 h-5 text-violet-400" />,
      color: 'from-violet-600/20 to-indigo-600/10 border-violet-500/30 text-violet-300',
      description:
        'Continuous probabilistic estimation using extended Bayesian Knowledge Tracing (BKT) that discounts guessing and accounts for careless slips.',
      detail:
        'Instead of crude quiz scores, MASTERYMIND models p(mastery) for all 28 syllabus concepts with explicit slips (S=0.10) and guesses (G=0.20), updating continuously after every single answer.',
      metric: '98% Upper Asymptote',
    },
    {
      id: 1,
      title: 'Reasoning Misconception Insights',
      tag: 'Diagnostic Intelligence',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-600/20 to-orange-600/10 border-amber-500/30 text-amber-300',
      description:
        'Analyzes written explanations to detect underlying conceptual fallacies like confusing current with voltage or sign convention errors.',
      detail:
        'Distinguishes conceptual errors from simple arithmetic slips. If a student states "resistance increases when current increases," the engine flags Ohm\'s law proportionality and dampens lucky guesses.',
      metric: '88% Precision F1',
    },
    {
      id: 2,
      title: 'Adaptive Question Sequencing',
      tag: 'Dynamic Practice',
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      color: 'from-cyan-600/20 to-blue-600/10 border-cyan-500/30 text-cyan-300',
      description:
        'Multi-factor utility engine balances prerequisite blocking, mastery deficits, uncertainty reduction, and spaced repetition.',
      detail:
        'Every chosen problem comes with a transparent pedagogical explanation detailing why it was selected for your exact current learning stage.',
      metric: '0.25 ms Selection Latency',
    },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-50 bg-[#070b14] text-white flex flex-col justify-between overflow-x-hidden overflow-y-auto selection:bg-violet-500 selection:text-white transition-all duration-700 ${
        isTransitioning ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to MASTERYMIND AI"
    >
      {/* Background Subtle Ambient Network Grids & Radial Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Ambient radial orbs */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-violet-600/15 via-indigo-600/10 to-cyan-500/15 rounded-full blur-[140px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(calc(-50% + ${mousePos.x * 1.5}px), calc(-50% + ${mousePos.y * 1.5}px))`,
          }}
        />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-10 left-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-violet-500/20">
            <div className="w-full h-full bg-[#0b0f19] rounded-[15px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                MASTERYMIND
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              CBSE Class 10 Physics • Adaptive Learning Platform
            </p>
          </div>
        </div>

        {/* Skip & Close Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleFinish('start')}
            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 backdrop-blur transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
            title="Skip introduction (Esc)"
          >
            <span>Skip intro</span>
            <span className="text-[10px] text-slate-500 bg-slate-800 px-1 rounded">Esc</span>
          </button>
          {onClose && (
            <button
              onClick={() => handleFinish('start')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Close intro"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Cinematic Content */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 py-6 text-center space-y-8">
        {/* Stage A: Brand & Network Central Visual */}
        <div className="relative w-full max-w-2xl h-48 sm:h-64 my-2 flex items-center justify-center">
          {/* Central Interactive Concept Node Graph SVG */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible transition-transform duration-700"
            style={{
              transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
            }}
          >
            {/* Draw connection edges between concepts */}
            {nodes.map((node) =>
              node.connections.map((targetId) => {
                const target = nodes.find((n) => n.id === targetId);
                if (!target) return null;
                return (
                  <line
                    key={`${node.id}-${target.id}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke="url(#lineGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="opacity-40 animate-pulse"
                  />
                );
              })
            )}

            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Draw concept nodes */}
            {nodes.map((node, i) => (
              <g
                key={node.id}
                className="cursor-pointer group transition-all duration-300"
                style={{
                  transform: `translate(${node.x}%, ${node.y}%)`,
                }}
              >
                <circle
                  r="7"
                  className="fill-slate-900 stroke-cyan-400 group-hover:stroke-violet-400 stroke-2 transition-all filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                />
                <circle
                  r="3"
                  className="fill-cyan-300 group-hover:fill-violet-300 animate-ping opacity-75"
                />
                <text
                  y="-12"
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-300 group-hover:fill-white select-none pointer-events-none transition-colors"
                >
                  {node.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Central Neural Pulse Core */}
          <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600/40 via-indigo-600/30 to-cyan-500/40 border border-violet-500/50 backdrop-blur-md flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.35)] animate-pulse">
            <Brain className="w-10 h-10 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
          </div>
        </div>

        {/* Stage B: Headlines and Learning Promise */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-violet-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Beyond generic quiz apps • Continuous Bayesian modeling</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight sm:leading-none">
            Your next breakthrough <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              starts here.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            An AI learning companion that understands what you know, discovers what you need, and adapts every next step to help you master it.
          </p>

          {/* 3 Sequential Statements */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2">
            {[
              { num: '1', text: 'Discover what you know.' },
              { num: '2', text: 'Understand where you struggle.' },
              { num: '3', text: 'Master what comes next.' },
            ].map((st, idx) => (
              <div
                key={st.num}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs sm:text-sm font-semibold text-slate-300 shadow-sm"
              >
                <span className="w-5 h-5 rounded-full bg-violet-600/30 border border-violet-500/50 text-violet-300 flex items-center justify-center text-[11px] font-bold">
                  {st.num}
                </span>
                <span>{st.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stage C: 3 Interactive Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-2">
          {previewCards.map((card) => {
            const isSelected = selectedPreview === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setSelectedPreview(isSelected ? null : card.id)}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/60 ring-1 ring-cyan-500/40 shadow-xl shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60">
                    {card.metric}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {card.description}
                </p>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl">
                    <p>{card.detail}</p>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
                  <span>{isSelected ? 'Collapse details' : 'Explore architecture'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Stage D: Call-to-Action & Trust Line */}
        <div className="space-y-4 pt-4 w-full max-w-md">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <button
              onClick={() => handleFinish('start')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <span>Start My Learning Journey</span>
              <ArrowRight className="w-5 h-5 text-cyan-200" />
            </button>

            {onExploreHowItWorks && (
              <button
                onClick={() => handleFinish('how-it-works')}
                className="w-full sm:w-auto px-6 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <span>Explore How It Works</span>
              </button>
            )}
          </div>

          {/* Small Trust Line */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Personalized practice. Reasoning-aware feedback. Smarter revision.</span>
          </div>

          {/* Don't show again toggle */}
          <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-violet-600 focus:ring-violet-500 focus:ring-offset-0"
              />
              <span>Don't show this intro on next visit</span>
            </label>
          </div>
        </div>
      </main>

      {/* Footer info line */}
      <footer className="relative z-20 py-4 px-6 text-center text-[11px] text-slate-600 border-t border-slate-900">
        <span>MASTERYMIND AI • Grounded on CBSE Class 10 Physics Syllabus • Bayesian Knowledge Tracing Engine</span>
      </footer>
    </div>
  );
};
