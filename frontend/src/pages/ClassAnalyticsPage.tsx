import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { HeatmapItem } from '../types';
import { Network, Download, Search, BookOpen, BarChart3, Filter } from 'lucide-react';

export const ClassAnalyticsPage: React.FC = () => {
  const [heatmap, setHeatmap] = useState<HeatmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [chapterFilter, setChapterFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [classId, setClassId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeatmap = async () => {
      setLoading(true);
      try {
        const classes = await api.getTeacherClasses();
        if (classes.length > 0) {
          setClassId(classes[0].id);
          const hm = await api.getClassHeatmap(classes[0].id);
          setHeatmap(hm);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeatmap();
  }, []);

  const handleExport = () => {
    if (!classId) return;
    window.open(`/api/teacher/classes/${classId}/export`, '_blank');
  };

  const filtered = heatmap.filter((item) => {
    const matchesCh = chapterFilter === 'ALL' || item.chapter_code === chapterFilter;
    const matchesSearch =
      item.concept_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.concept_code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCh && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Aggregating classroom concept mastery heatmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <BarChart3 className="w-4 h-4" />
              Class-Wide Concept Mastery Heatmap
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Class 10-A Science Concept Matrix
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Distribution of student mastery across all 28 CBSE Physics concepts.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Class CSV
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex-1">
            {[
              { id: 'ALL', label: 'All 4 Chapters' },
              { id: 'CH09_LIGHT', label: 'Light' },
              { id: 'CH10_HUMAN_EYE', label: 'Human Eye' },
              { id: 'CH11_ELECTRICITY', label: 'Electricity' },
              { id: 'CH12_MAGNETISM', label: 'Magnetism' },
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

          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Heatmap Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-6">Concept Name</th>
                  <th className="py-4 px-4">Chapter</th>
                  <th className="py-4 px-4">Level</th>
                  <th className="py-4 px-4">Avg Mastery</th>
                  <th className="py-4 px-6 min-w-[220px]">Student Distribution (Mastered / Developing / Weak)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((row) => {
                  const total =
                    row.distribution.mastered +
                    row.distribution.developing +
                    row.distribution.weak +
                    row.distribution.unassessed || 1;
                  const pMastered = (row.distribution.mastered / total) * 100;
                  const pDeveloping = (row.distribution.developing / total) * 100;
                  const pWeak = (row.distribution.weak / total) * 100;

                  return (
                    <tr key={row.concept_id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-white">
                        <div>{row.concept_name}</div>
                        {row.formula && (
                          <code className="text-[10px] text-cyan-300 font-mono mt-0.5 block opacity-80">
                            {row.formula}
                          </code>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {row.chapter_title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                          Lvl {row.foundational_level}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        <span
                          className={`text-sm ${
                            row.average_mastery >= 70
                              ? 'text-emerald-400'
                              : row.average_mastery >= 45
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {row.average_mastery}%
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        {/* Segmented Distribution Bar */}
                        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                          <div
                            style={{ width: `${pMastered}%` }}
                            className="bg-emerald-500 h-full"
                            title={`${row.distribution.mastered} Mastered`}
                          />
                          <div
                            style={{ width: `${pDeveloping}%` }}
                            className="bg-amber-500 h-full"
                            title={`${row.distribution.developing} Developing`}
                          />
                          <div
                            style={{ width: `${pWeak}%` }}
                            className="bg-rose-500 h-full"
                            title={`${row.distribution.weak} Weak`}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                          <span className="text-emerald-400">{row.distribution.mastered} Mastered</span>
                          <span className="text-amber-400">{row.distribution.developing} Dev</span>
                          <span className="text-rose-400">{row.distribution.weak} Weak</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
