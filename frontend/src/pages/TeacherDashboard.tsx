import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TeacherClassOverview } from '../types';
import {
  Users,
  BarChart3,
  AlertTriangle,
  Sparkles,
  Download,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<TeacherClassOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const list = await api.getTeacherClasses();
        setClasses(list);
        if (list.length > 0) {
          setSelectedClassId(list[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;
    const fetchOverview = async () => {
      try {
        const ov = await api.getClassAnalytics(selectedClassId);
        setAnalytics(ov);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOverview();
  }, [selectedClassId]);

  const handleExportCSV = async () => {
    if (!selectedClassId) return;
    window.open(`/api/teacher/classes/${selectedClassId}/export`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading classroom learning telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Users className="w-4 h-4" />
              Teacher Analytics Workspace • Class 10 Science
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Classroom Learning Telemetry
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Anonymized classroom intelligence derived from individual learner models and reasoning patterns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('class-analytics')}
              className="px-4 py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              View Concept Heatmap
            </button>
            <button
              onClick={() => onNavigate('misconceptions')}
              className="px-4 py-2.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Teaching Interventions
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {analytics && (
          <>
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Enrolled Students
                </span>
                <div className="text-3xl font-black text-white mt-2">
                  {analytics.total_students}
                </div>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  Class: {analytics.class_name} ({analytics.join_code})
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Class Average Mastery
                </span>
                <div className="text-3xl font-black text-cyan-400 mt-2">
                  {analytics.average_mastery}%
                </div>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  Aggregate across 28 concepts
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Active Misconceptions
                </span>
                <div className="text-3xl font-black text-rose-400 mt-2">
                  {analytics.active_misconceptions_count}
                </div>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  Detected from written reasoning
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Students Needing Support
                </span>
                <div className="text-3xl font-black text-amber-400 mt-2">
                  {analytics.at_risk_count}
                </div>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  Flagged for early intervention
                </span>
              </div>
            </div>

            {/* At-Risk Students Alert Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  Learners Who May Benefit from Additional Support
                </h3>
                <span className="text-xs text-slate-400">
                  {analytics.at_risk_students.length} flagged students
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.at_risk_students.map((student) => (
                  <div
                    key={student.student_id}
                    className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{student.name}</span>
                        <span className="text-xs text-rose-400 font-bold">
                          {student.average_mastery}% Mastery
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{student.email}</div>
                      <div className="mt-3 text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <span className="font-semibold text-amber-300">Action: </span>
                        {student.recommended_action}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{student.active_misconceptions} Active Misconception(s)</span>
                      <span className="text-cyan-400 font-semibold">Priority 1 Review</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
