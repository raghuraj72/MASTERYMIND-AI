import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Brain, Lock, Mail, User as UserIcon, ArrowRight, Sparkles, UserCheck, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  initialRole?: 'student' | 'teacher';
  onSuccess: (role: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialRole = 'student', onSuccess }) => {
  const { login, register, quickLogin } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegistering) {
        await register({
          email,
          password,
          full_name: fullName,
          role,
          class_grade: 'Class 10',
          preferred_language: 'en'
        });
        onSuccess(role);
      } else {
        await login(email, password);
        onSuccess(role);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoRole: string) => {
    setError(null);
    setLoading(true);
    try {
      await quickLogin(demoEmail, 'Student@123');
      onSuccess(demoRole);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-violet-600/15 via-indigo-600/15 to-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30 mb-3">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            MASTERYMIND <span className="text-violet-400">AI</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRegistering ? 'Create your adaptive learner account' : 'Sign in to resume personalized learning'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800/80">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'student'
                ? 'bg-violet-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'teacher'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Educator / Teacher
          </button>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-4 bg-rose-950/40 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Gupta"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'teacher' ? 'teacher@school.edu' : 'student@school.edu'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all mt-2 ${
              role === 'teacher'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-900/30'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-indigo-900/30'
            }`}
          >
            {loading ? 'Authenticating...' : isRegistering ? 'Create Account' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isRegistering
              ? 'Already have an account? Sign In'
              : "Don't have an account? Create one"}
          </button>
        </div>

        {/* Quick Demo Sign In Box */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Instant Demo Sign-In (Competition Ready)
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student@masterymind.ai', 'student')}
              className="w-full text-left px-3.5 py-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-300 transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-semibold text-white group-hover:text-violet-300">
                  Aarav Gupta (Student)
                </div>
                <div className="text-[11px] text-slate-400">Fresh learner profile ready for practice</div>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Student
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('teacher@masterymind.ai', 'teacher')}
              className="w-full text-left px-3.5 py-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-300 transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-semibold text-white group-hover:text-cyan-300">
                  Dr. Radhika Sharma (Teacher)
                </div>
                <div className="text-[11px] text-slate-400">Class 10-A Science with full aggregate heatmaps</div>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Teacher
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
