import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Trash2,
  UserX,
  Eye,
  MessageSquare,
  FileText,
  Clock
} from 'lucide-react';
import { FlaggedReport } from '../../types';
import { INITIAL_FLAGGED_REPORTS } from '../../data/mockData';

interface Props {
  onFeedback: (msg: string) => void;
  onDeleteTarget?: (targetType: string, targetId: string) => void;
}

export const AdminReportsTab: React.FC<Props> = ({ onFeedback, onDeleteTarget }) => {
  const [reports, setReports] = useState<FlaggedReport[]>(INITIAL_FLAGGED_REPORTS);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState<FlaggedReport | null>(null);

  const filteredReports = reports.filter((r) => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch =
      r.targetTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.reporterName.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase()) ||
      r.targetSnippet.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleResolve = (id: string, action: 'delete' | 'warn' | 'dismiss') => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: action === 'dismiss' ? 'dismissed' : 'resolved'
          };
        }
        return r;
      })
    );

    if (action === 'delete') {
      onFeedback('Maudhui yaliyoripotiwa yamefutwa kwenye jukwaa na ripoti imefungwa.');
      if (onDeleteTarget && selectedReport) {
        onDeleteTarget(selectedReport.targetType, selectedReport.targetId);
      }
    } else if (action === 'warn') {
      onFeedback('Onyo rasmi limetumwa kwa mtumiaji aliyetunga maudhui haya.');
    } else {
      onFeedback('Ripoti imepuuzwa (Haikukiuka miongozo ya jamii).');
    }

    setSelectedReport(null);
  };

  const pendingCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6 text-gray-900 dark:text-slate-100">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
              Udhibiti wa Maudhui & Ripoti za Jamii (Content Moderation Queue)
            </h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
            Pitia machapisho, maoni au watumiaji walioripotiwa na wanafunzi na walimu kwa kukiuka maadili ya elimu.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="px-3 py-1 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-full text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{pendingCount} Zinasubiri Hatua</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-gray-900 dark:bg-slate-700 text-white shadow-2xs'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            Ripoti Zote ({reports.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950'
            }`}
          >
            Zinazosubiri ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('resolved')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterStatus === 'resolved'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950'
            }`}
          >
            Zilizotatuliwa
          </button>
          <button
            onClick={() => setFilterStatus('dismissed')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterStatus === 'dismissed'
                ? 'bg-gray-600 dark:bg-slate-600 text-white shadow-2xs'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            Zilizopuuzwa
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Tafuta ripoti au maudhui..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Reports Table / Cards */}
      <div className="space-y-3">
        {filteredReports.map((report) => {
          const isPending = report.status === 'pending';
          const isHigh = report.severity === 'high';

          return (
            <div
              key={report.id}
              className={`p-5 rounded-2xl border transition-all bg-white dark:bg-slate-900 shadow-2xs space-y-3 ${
                isPending && isHigh
                  ? 'border-rose-300 dark:border-rose-800 bg-rose-50/20 dark:bg-rose-950/10'
                  : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      report.severity === 'high'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        : report.severity === 'medium'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                    }`}
                  >
                    Kiwango: {report.severity.toUpperCase()}
                  </span>

                  <span className="text-[10px] font-bold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-0.5 rounded uppercase">
                    Aina: {report.targetType}
                  </span>

                  <span className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{report.reportedAt}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      report.status === 'pending'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        : report.status === 'resolved'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300'
                    }`}
                  >
                    {report.status === 'pending'
                      ? 'Inasubiri Hatua'
                      : report.status === 'resolved'
                      ? 'Imetatuliwa'
                      : 'Imepuuzwa'}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-rose-700 dark:text-rose-400">
                  Sababu ya Kuripotiwa: {report.reason}
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{report.targetTitle}</h4>
                <div className="p-3 bg-gray-50 dark:bg-slate-800/80 rounded-xl border border-gray-100 dark:border-slate-800 text-xs font-mono text-gray-700 dark:text-slate-300 mt-2 leading-relaxed">
                  "{report.targetSnippet}"
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-slate-800 text-xs">
                <span className="text-gray-500 dark:text-slate-400">
                  Imeripotiwa na: <strong className="text-gray-700 dark:text-slate-200">{report.reporterName}</strong>
                </span>

                {isPending ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleResolve(report.id, 'dismiss')}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer transition-colors"
                    >
                      Puuza Ripoti
                    </button>
                    <button
                      onClick={() => handleResolve(report.id, 'warn')}
                      className="px-3 py-1.5 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-300 rounded-xl font-bold cursor-pointer transition-colors"
                    >
                      Tuma Onyo
                    </button>
                    <button
                      onClick={() => handleResolve(report.id, 'delete')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Futa Maudhui</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hatua zilikamilika</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
