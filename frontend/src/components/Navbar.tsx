import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Brain,
  Compass,
  Zap,
  Network,
  RotateCcw,
  BarChart3,
  History,
  Settings,
  LogOut,
  UserCheck,
  ChevronDown,
  Sparkles,
  BookOpen,
  Play
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onReopenIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onReopenIntro }) => {
  const { user, logout, quickLogin, isTeacher } = useAuth();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const demoAccounts = [
    { email: 'student@masterymind.ai', name: 'Aarav Gupta (Student)', role: 'student', desc: 'Primary student profile' },
    { email: 'teacher@masterymind.ai', name: 'Dr. Radhika Sharma (Teacher)', role: 'teacher', desc: 'Class 10-A Science educator' },
    { email: 'priya.patel@student.ai', name: 'Priya Patel (Sign Convention)', role: 'student', desc: 'Struggling with Optics (38%)' },
    { email: 'ananya.iyer@student.ai', name: 'Ananya Iyer (Current/Voltage)', role: 'student', desc: 'Active misconception (54%)' },
    { email: 'rohan.verma@student.ai', name: 'Rohan Verma (High Mastery)', role: 'student', desc: 'Benchmark student (88%)' },
  ];

  return (
    <nav className="bg-[#0f172a]/95 backdrop-blur border-b border-slate-800 sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelectTab(isTeacher ? 'teacher-dashboard' : 'student-dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                  MASTERYMIND
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                CBSE Class 10 Physics
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {!isTeacher ? (
              <>
                <button
                  onClick={() => onSelectTab('student-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'student-dashboard'
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => onSelectTab('practice')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'practice'
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Adaptive Practice
                </button>
                <button
                  onClick={() => onSelectTab('concept-graph')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'concept-graph'
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Network className="w-4 h-4 text-cyan-400" />
                  Concept Graph
                </button>
                <button
                  onClick={() => onSelectTab('revision')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'revision'
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <RotateCcw className="w-4 h-4 text-emerald-400" />
                  Revision
                </button>
                <button
                  onClick={() => onSelectTab('diagnostic')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'diagnostic'
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Compass className="w-4 h-4 text-indigo-400" />
                  Diagnostic
                </button>
                <button
                  onClick={() => onSelectTab('history')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'history'
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <History className="w-4 h-4" />
                  Audit History
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onSelectTab('teacher-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'teacher-dashboard'
                      ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Classroom Overview
                </button>
                <button
                  onClick={() => onSelectTab('class-analytics')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'class-analytics'
                      ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Network className="w-4 h-4 text-cyan-400" />
                  Concept Heatmap
                </button>
                <button
                  onClick={() => onSelectTab('misconceptions')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === 'misconceptions'
                      ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Interventions & Questions
                </button>
              </>
            )}
            <button
              onClick={() => onSelectTab('settings')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentTab === 'settings'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* Right actions: Intro + Demo Switcher + Profile */}
          <div className="flex items-center gap-2.5">
            {onReopenIntro && (
              <button
                onClick={onReopenIntro}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold text-violet-300 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 transition-colors shadow-sm"
                title="Watch Cinematic Introduction"
              >
                <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                <span>Intro</span>
              </button>
            )}

            {/* Quick Demo Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-full border border-slate-700 transition-colors shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="max-w-[120px] truncate">{user?.full_name || 'Switch Persona'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1">
                    Quick-Switch Demo Persona
                  </div>
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      onClick={async () => {
                        setShowDemoMenu(false);
                        await quickLogin(acc.email, 'Student@123');
                        if (acc.role === 'teacher') {
                          onSelectTab('teacher-dashboard');
                        } else {
                          onSelectTab('student-dashboard');
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-800/80 transition-colors flex flex-col ${
                        user?.email === acc.email ? 'bg-indigo-950/60 border border-indigo-500/30 text-indigo-300' : 'text-slate-300'
                      }`}
                    >
                      <div className="font-medium flex items-center justify-between">
                        <span>{acc.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          acc.role === 'teacher' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-violet-500/20 text-violet-300'
                        }`}>
                          {acc.role}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5">{acc.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
