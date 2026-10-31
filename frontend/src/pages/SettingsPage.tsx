import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Settings, ShieldCheck, RefreshCw, CheckCircle2, User, Lock, Database, Sparkles, Play } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const handleResetDemo = async () => {
    if (!window.confirm('Reset synthetic demo data back to default? All attempts and test records will be refreshed.')) {
      return;
    }
    setResetting(true);
    try {
      const res = await api.resetDemoData();
      setResetSuccess(res.message);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      alert(err.message || 'Reset failed');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Settings className="w-4 h-4" />
            Preferences & Security
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Platform Settings</h1>
        </div>

        {/* Profile Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-violet-400" />
            Active Account Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Full Name</span>
              <span className="text-sm font-bold text-white mt-1 block">{user?.full_name}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Email</span>
              <span className="text-sm font-bold text-white mt-1 block">{user?.email}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Role</span>
              <span className="text-sm font-bold text-violet-300 uppercase mt-1 block">{user?.role}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Target Curriculum</span>
              <span className="text-sm font-bold text-cyan-300 mt-1 block">CBSE Class 10 Science (Physics)</span>
            </div>
          </div>
        </div>

        {/* Cinematic Intro Preferences */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Cinematic Opening Experience
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Replay the full-screen cinematic introduction, neural concept network, and interactive preview cards.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  localStorage.removeItem('masterymind_intro_dismissed');
                  sessionStorage.removeItem('masterymind_intro_seen');
                  window.location.reload();
                }}
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-violet-600/30"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Replay Intro Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Educational Safety Notice */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Data Privacy & Model Safety Standards
          </h2>
          <div className="text-xs text-slate-300 space-y-2 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <p>
              • <strong>Password Protection:</strong> Passwords are cryptographic hashes (bcrypt) and never stored in plain text.
            </p>
            <p>
              • <strong>Role-Based Access:</strong> Student learning data is private. Educators can only view aggregated and anonymized telemetry for classes they explicitly manage.
            </p>
            <p>
              • <strong>Local First Architecture:</strong> The application runs fully offline without requiring third-party cloud AI for deterministic grading, Bayesian updates, or spaced repetition.
            </p>
            <p>
              • <strong>Diagnostic Humility:</strong> Model outputs are statistical estimates of knowledge state, never psychological or innate intelligence evaluations.
            </p>
          </div>
        </div>

        {/* Reset Demo Data Admin Action */}
        <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-rose-300 flex items-center gap-2">
                <Database className="w-5 h-5 text-rose-400" />
                Reset Synthetic Demo Database
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Restores the verified curriculum, 28 concepts, 12 misconceptions, 48 questions, and 8 synthetic demo students.
              </p>
            </div>

            <button
              onClick={handleResetDemo}
              disabled={resetting}
              className="px-5 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
              {resetting ? 'Resetting...' : 'Reset Demo Data'}
            </button>
          </div>

          {resetSuccess && (
            <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{resetSuccess}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
