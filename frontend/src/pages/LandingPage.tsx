import React from 'react';
import {
  Brain,
  Zap,
  Target,
  Network,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Users,
  ShieldCheck,
  ChevronRight,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onStart: () => void;
  onExploreDemo: (role: 'student' | 'teacher') => void;
  onWatchIntro?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onExploreDemo, onWatchIntro }) => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white selection:bg-violet-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-slate-800/80">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/20 to-cyan-500/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 mb-8 backdrop-blur shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            CBSE / NCERT Class 10 Science (Physics) Adaptive Platform
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Every answer teaches us how to{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              teach you better.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            MASTERYMIND AI replaces generic practice with a real Bayesian learner model,
            deep reasoning-aware misconception diagnosis, and spaced repetition for Class 10 students.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onExploreDemo('student')}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all group"
            >
              <Zap className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              Launch Student Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onExploreDemo('teacher')}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Users className="w-5 h-5 text-cyan-400" />
              Teacher Analytics Workspace
            </button>
            {onWatchIntro && (
              <button
                onClick={onWatchIntro}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-violet-300 border border-violet-500/30 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                Watch Cinematic Intro
              </button>
            )}
          </div>

          {/* Key metrics / claims */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-800/60">
            <div>
              <div className="text-3xl font-extrabold text-white">28</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Structured Concepts</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-cyan-400">12</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Physics Misconceptions</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-violet-400">48+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Syllabus Questions</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-400">0.12ms</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">BKT Engine Latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiator Section */}
      <section className="py-20 bg-slate-900/50 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
              The Pedagogical Difference
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">
              Traditional apps tell you you're wrong.<br />
              MASTERYMIND diagnoses <span className="text-cyan-400">why</span> and fixes it.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-5 border border-violet-500/30">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Reasoning-Aware Diagnosis</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                We inspect your written reasoning separately from your final answer. If you calculate resistance wrong because you believe resistance increases with current, we pinpoint the Ohm's law misconception directly.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-5 border border-cyan-500/30">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Prerequisite Dependency Graph</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Concepts don't live in isolation. Electric current drives potential difference, which drives Ohm's law, which drives parallel circuits. We detect and remediate root prerequisite gaps before they compound.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/30">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">SM-2 Spaced Repetition</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Never cram before exams again. Our memory scheduler models forgetting curves, bringing weak or previously misunderstood physics concepts back for review at scientifically calculated optimal intervals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CBSE Class 10 Syllabus Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white">Deep CBSE Class 10 Physics Coverage</h2>
            <p className="text-sm text-slate-400 mt-2">
              Full curriculum mapping across all 4 NCERT Class 10 Science physics chapters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Chapter 9</div>
              <h4 className="font-bold text-white mt-1">Light: Reflection & Refraction</h4>
              <p className="text-xs text-slate-400 mt-2">Spherical mirrors, mirror formula, Cartesian signs, refraction, lenses & optical power.</p>
              <div className="mt-4 text-xs font-semibold text-slate-300">8 Concepts • 12 Questions</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Chapter 10</div>
              <h4 className="font-bold text-white mt-1">The Human Eye</h4>
              <p className="text-xs text-slate-400 mt-2">Accommodation, myopia, hypermetropia, prism dispersion, twinkling of stars & scattering.</p>
              <div className="mt-4 text-xs font-semibold text-slate-300">6 Concepts • 12 Questions</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Chapter 11</div>
              <h4 className="font-bold text-white mt-1">Electricity</h4>
              <p className="text-xs text-slate-400 mt-2">Ohm's law, resistivity, series & parallel circuits, Joule heating, electric power & kWh.</p>
              <div className="mt-4 text-xs font-semibold text-slate-300">8 Concepts • 12 Questions</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">Chapter 12</div>
              <h4 className="font-bold text-white mt-1">Magnetic Effects</h4>
              <p className="text-xs text-slate-400 mt-2">Field lines, solenoid, Fleming's Left-Hand Rule, electromagnetic induction & domestic wiring.</p>
              <div className="mt-4 text-xs font-semibold text-slate-300">6 Concepts • 12 Questions</div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onExploreDemo('student')}
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-semibold transition-colors"
            >
              Explore the interactive Concept Graph
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
