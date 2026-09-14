import React, { useState } from 'react';
import {
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  BookOpen,
  Building,
  Award,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { TeacherVerificationRequest } from '../../types';
import { INITIAL_TEACHER_VERIFICATIONS } from '../../data/mockData';

interface Props {
  onFeedback: (msg: string) => void;
}

export const AdminTeacherVerificationTab: React.FC<Props> = ({ onFeedback }) => {
  const [requests, setRequests] = useState<TeacherVerificationRequest[]>(INITIAL_TEACHER_VERIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');

  const handleUpdateStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, status: newStatus };
        }
        return r;
      })
    );

    if (newStatus === 'approved') {
      onFeedback('Mwalimu amethibitishwa rasmi na kupewa beji ya Verified Teacher! 🎖️');
    } else {
      onFeedback('Maombi ya mwalimu yamekataliwa kwa uhakiki zaidi.');
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch =
      r.teacherName.toLowerCase().includes(search.toLowerCase()) ||
      r.schoolName.toLowerCase().includes(search.toLowerCase()) ||
      r.tscNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6 text-gray-900 dark:text-slate-100">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
              Uhakiki wa Walimu & Namba za TSC (Teacher Verification Queue)
            </h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
            Thibitisha walimu halisi wa sekondari na vyuo vikuu nchini Tanzania kupitia namba zao za TSC na uzoefu wa kufundisha.
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-full text-xs font-bold self-start md:self-auto">
          {pendingCount} Maombi Mapya Yanasubiri
        </span>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-gray-900 dark:bg-slate-700 text-white shadow-2xs'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            Maombi Yote ({requests.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filter === 'pending'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950'
            }`}
          >
            Yanasubiri ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filter === 'approved'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950'
            }`}
          >
            Yaliyoidhinishwa
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filter === 'rejected'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950'
            }`}
          >
            Yaliyokataliwa
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Tafuta jina, shule au namba ya TSC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Verification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRequests.map((req) => {
          const isPending = req.status === 'pending';
          const isApproved = req.status === 'approved';

          return (
            <div
              key={req.id}
              className={`p-5 rounded-2xl border transition-all bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between space-y-4 ${
                isPending 
                  ? 'border-amber-300 dark:border-amber-800 hover:border-amber-400' 
                  : 'border-gray-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white">{req.teacherName}</h3>
                    <div className="text-xs text-gray-500 dark:text-slate-400">{req.email}</div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      isApproved
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : req.status === 'rejected'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {isApproved ? 'Verified Teacher' : req.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                  </span>
                </div>

                <div className="space-y-1 text-xs bg-gray-50 dark:bg-slate-800/70 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span><strong>Shule:</strong> {req.schoolName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span><strong>Namba ya TSC:</strong> <span className="font-mono font-bold text-gray-800 dark:text-slate-200">{req.tscNumber}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span><strong>Uzoefu:</strong> Miaka {req.experienceYears} ya kufundisha</span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-gray-600 dark:text-slate-400 mb-1">Masomo Anayofundisha:</div>
                  <div className="flex flex-wrap gap-1">
                    {req.subjects.map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold px-2 py-0.5 rounded"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400 dark:text-slate-400">Imetuma: {req.submittedAt}</span>

                {isPending ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'rejected')}
                      className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold rounded-xl cursor-pointer transition-colors border border-rose-200 dark:border-rose-900"
                    >
                      Kataa
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'approved')}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Thibitisha Mwalimu</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">Hatua Imekamilika</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
