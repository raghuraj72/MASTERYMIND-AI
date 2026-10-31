import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MisconceptionFrequencyItem, InterventionItem, Question } from '../types';
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  PlusCircle,
  CheckCircle2,
  Users,
  Brain,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const MisconceptionsPage: React.FC = () => {
  const [frequencies, setFrequencies] = useState<MisconceptionFrequencyItem[]>([]);
  const [interventions, setInterventions] = useState<InterventionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Question Generation Modal state
  const [showGenModal, setShowGenModal] = useState(false);
  const [genConceptCode, setGenConceptCode] = useState('ELC_OHMS_LAW');
  const [genDifficulty, setGenDifficulty] = useState('intermediate');
  const [generating, setGenerating] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const classes = await api.getTeacherClasses();
        if (classes.length > 0) {
          const cId = classes[0].id;
          const [miscRes, intervRes] = await Promise.all([
            api.getClassMisconceptions(cId),
            api.getClassInterventions(cId),
          ]);
          setFrequencies(miscRes);
          setInterventions(intervRes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGenerateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGeneratedQuestion(null);
    try {
      const q = await api.generateAIQuestion(genConceptCode, genDifficulty);
      setGeneratedQuestion(q);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading misconception analytics and interventions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-4 h-4" />
              Pedagogical Diagnostic Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Misconception Frequencies & Teaching Interventions
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Evidence-grounded action plans derived from observed student reasoning flaws.
            </p>
          </div>

          <button
            onClick={() => setShowGenModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            AI Question Generator
          </button>
        </div>

        {/* Actionable Teaching Interventions Panel */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            Recommended Classroom Interventions ({interventions.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interventions.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.priority} Priority • {item.class_percentage}% of Class
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {item.affected_concept}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white mt-2">
                    {item.title}
                  </h3>
                  <div className="mt-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <strong className="text-rose-300">Observed Evidence: </strong>
                    {item.observed_evidence}
                  </div>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    <strong className="text-violet-300">Teacher Action: </strong>
                    {item.recommended_action}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-cyan-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {item.recommended_activity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranked Misconceptions Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Class-Wide Misconception Frequency Rankings
          </h2>

          <div className="space-y-3">
            {frequencies.map((m) => (
              <div
                key={m.misconception_id}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-indigo-400 font-mono font-bold">{m.code}</span>
                    <span className="text-xs text-slate-400">• {m.concept_name}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{m.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    <strong className="text-slate-300">Incorrect Belief: </strong>
                    {m.incorrect_belief}
                  </p>
                </div>

                <div className="text-right shrink-0 pl-4 border-l border-slate-800/80">
                  <div className="text-2xl font-black text-rose-400">
                    {m.percentage_class}%
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {m.unique_students_affected} student(s) affected
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Question Generation Modal */}
        {showGenModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Targeted AI Question Generator
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Generates syllabus-aligned CBSE questions targeted at specific misconceptions or concepts.
              </p>

              <form onSubmit={handleGenerateQuestion} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Target Physics Concept
                  </label>
                  <select
                    value={genConceptCode}
                    onChange={(e) => setGenConceptCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="ELC_OHMS_LAW">Ohm's Law & Resistance (Electricity)</option>
                    <option value="ELC_PARALLEL_CIRCUIT">Resistors in Parallel (Electricity)</option>
                    <option value="LGT_SIGN_CONVENTION">New Cartesian Sign Convention (Light)</option>
                    <option value="LGT_MIRROR_FORMULA">Mirror Formula (Light)</option>
                    <option value="EYE_DEFECTS_MYOPIA">Myopia & Correction (Human Eye)</option>
                    <option value="MAG_FORCE_FLEMING_LEFT">Fleming's Left-Hand Rule (Magnetism)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={genDifficulty}
                    onChange={(e) => setGenDifficulty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="foundational">Foundational</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGenModal(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={generating}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
                  >
                    {generating ? 'Synthesizing Question...' : 'Generate Question'}
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Generated Question Preview */}
              {generatedQuestion && (
                <div className="mt-5 p-4 bg-slate-950 rounded-2xl border border-violet-500/30 text-xs text-slate-300 space-y-2 animate-in fade-in">
                  <div className="font-bold text-white text-sm">{generatedQuestion.text}</div>
                  <div className="text-[11px] text-slate-400">
                    Correct Answer: <strong className="text-emerald-400">{generatedQuestion.correct_answer}</strong>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    Explanation: {generatedQuestion.step_by_step_explanation}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold pt-1">
                    ✓ Verified and saved to question bank
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
