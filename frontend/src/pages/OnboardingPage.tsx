import React, { useState } from 'react';
import { api } from '../services/api';
import { Compass, CheckCircle2, ArrowRight, BookOpen, Calendar, Globe, Sparkles } from 'lucide-react';

interface OnboardingPageProps {
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [classGrade, setClassGrade] = useState('Class 10');
  const [targetExamDate, setTargetExamDate] = useState('2026-03-02');
  const [language, setLanguage] = useState('en');
  const [learningGoals, setLearningGoals] = useState('Aiming for 95%+ in CBSE Board Science exam. Want to strengthen Electricity numericals and Ray diagrams.');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      await api.updateStudentProfile({
        class_grade: classGrade,
        target_exam_date: targetExamDate,
        preferred_language: language,
        learning_goals: learningGoals,
        onboarding_completed: true,
      });
      onComplete();
    } catch (err) {
      console.error(err);
      onComplete(); // proceed to diagnostic even if profile save fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30 mb-3">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Welcome to MASTERYMIND AI</h2>
          <p className="text-xs text-slate-400 mt-1">
            Let's configure your CBSE Class 10 Physics adaptive profile in 30 seconds.
          </p>
        </div>

        <div className="space-y-5">
          {/* Syllabus & Class */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              <BookOpen className="w-4 h-4 text-violet-400" />
              Class & Curriculum
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-900 border border-violet-500/40 text-violet-300 font-bold px-3 py-2 rounded-xl text-sm">
                CBSE Class 10 Science (Physics)
              </div>
            </div>
          </div>

          {/* Target Exam Date */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Target Board Examination Date
            </div>
            <input
              type="date"
              value={targetExamDate}
              onChange={(e) => setTargetExamDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Language Preference */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              Preferred Language for Question Feedback
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  language === 'en'
                    ? 'bg-violet-600/20 border-violet-500/50 text-violet-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  language === 'hi'
                    ? 'bg-violet-600/20 border-violet-500/50 text-violet-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Hindi / Hinglish (हिंदी)
              </button>
            </div>
          </div>

          {/* Learning Goals */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Target Learning Goals
            </div>
            <textarea
              rows={2}
              value={learningGoals}
              onChange={(e) => setLearningGoals(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all mt-4"
          >
            {loading ? 'Saving Profile...' : 'Begin Diagnostic Assessment'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
