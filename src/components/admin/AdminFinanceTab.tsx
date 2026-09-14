import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  Filter,
  DollarSign,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { SchoolFeeTransaction } from '../../types';
import { INITIAL_FEE_TRANSACTIONS } from '../../data/mockData';

interface Props {
  onFeedback: (msg: string) => void;
}

export const AdminFinanceTab: React.FC<Props> = ({ onFeedback }) => {
  const [transactions, setTransactions] = useState<SchoolFeeTransaction[]>(INITIAL_FEE_TRANSACTIONS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [search, setSearch] = useState('');
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  // New Control Number Form
  const [newStudent, setNewStudent] = useState('');
  const [newSchool, setNewSchool] = useState('Ilboru High School');
  const [newGrade, setNewGrade] = useState('Form V');
  const [newAmount, setNewAmount] = useState('150000');
  const [newChannel, setNewChannel] = useState<'M-Pesa' | 'Airtel Money' | 'CRDB' | 'NMB'>('M-Pesa');

  const handleGenerateControl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.trim() || !newAmount) return;

    // Generate Tanzanian 12-digit GePG control number format: 99XXXXXXXXXX
    const randomControl = `99${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const created: SchoolFeeTransaction = {
      id: `fee-${Date.now()}`,
      controlNumber: randomControl,
      studentName: newStudent.trim(),
      schoolName: newSchool,
      gradeLevel: newGrade,
      amount: Number(newAmount),
      status: 'pending',
      paymentChannel: newChannel,
      date: 'Sasa hivi'
    };

    setTransactions([created, ...transactions]);
    setIsGenerateOpen(false);
    setNewStudent('');
    setNewAmount('150000');
    onFeedback(`Namba ya Malipo (Control Number ${randomControl}) imetengenezwa kwa mafanikio! 💳`);
  };

  const handleMarkPaid = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'paid' } : t))
    );
    onFeedback('Muamala umethibitishwa na risiti imetumwa kwa mzazi na shule.');
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch =
      t.studentName.toLowerCase().includes(search.toLowerCase()) ||
      t.schoolName.toLowerCase().includes(search.toLowerCase()) ||
      t.controlNumber.includes(search);
    return matchesStatus && matchesSearch;
  });

  const totalCollected = transactions
    .filter((t) => t.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPending = transactions
    .filter((t) => t.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOverdue = transactions
    .filter((t) => t.status === 'overdue')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 text-gray-900 dark:text-slate-100">
      {/* Top Banner with Stats Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
                Usimamizi wa Ada za Shule & Namba za Malipo (GePG / Control Numbers)
              </h2>
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
              Fuatilia ukusanyaji wa ada za shule za serikali na binafsi, utoaji wa namba za malipo na malipo kupitia M-Pesa, Airtel Money, NMB na CRDB.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGenerateOpen(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tengeneza Namba ya Malipo</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
            <div className="text-gray-500 dark:text-slate-400 font-medium">Jumla Iliyokusanywa (Paid):</div>
            <div className="text-lg font-bold font-heading text-emerald-900 dark:text-emerald-300 mt-1">
              TZS {totalCollected.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">Imeingizwa kwenye akaunti za shule</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
            <div className="text-gray-500 dark:text-slate-400 font-medium">Inayosubiri Kulipwa (Pending):</div>
            <div className="text-lg font-bold font-heading text-amber-900 dark:text-amber-300 mt-1">
              TZS {totalPending.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">Namba za malipo zimetumwa kwa wazazi</div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs">
            <div className="text-gray-500 dark:text-slate-400 font-medium">Iliyochelewa (Overdue):</div>
            <div className="text-lg font-bold font-heading text-rose-900 dark:text-rose-300 mt-1">
              TZS {totalOverdue.toLocaleString()}
            </div>
            <div className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5">Muhula umekwisha bila kulipwa</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-gray-900 dark:bg-slate-700 text-white shadow-2xs'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            Miamala Yote ({transactions.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              statusFilter === 'paid'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950'
            }`}
          >
            Imelipwa
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950'
            }`}
          >
            Inasubiri
          </button>
          <button
            onClick={() => setStatusFilter('overdue')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              statusFilter === 'overdue'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950'
            }`}
          >
            Iliyochelewa
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Tafuta mwanafunzi au namba ya malipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-slate-800/80 text-gray-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Namba ya Malipo (Control No.)</th>
                <th className="p-3.5">Mwanafunzi</th>
                <th className="p-3.5">Shule & Darasa</th>
                <th className="p-3.5">Kiasi (TZS)</th>
                <th className="p-3.5">Njia ya Malipo</th>
                <th className="p-3.5">Hali (Status)</th>
                <th className="p-3.5 text-right">Kitendo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-gray-900 dark:text-white">{tx.controlNumber}</td>
                  <td className="p-3.5 font-semibold text-gray-800 dark:text-slate-200">{tx.studentName}</td>
                  <td className="p-3.5 text-gray-600 dark:text-slate-400">
                    <div className="text-gray-900 dark:text-slate-200 font-medium">{tx.schoolName}</div>
                    <div className="text-[10px] text-gray-400 dark:text-slate-500">{tx.gradeLevel}</div>
                  </td>
                  <td className="p-3.5 font-bold text-gray-900 dark:text-white">
                    TZS {tx.amount.toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <span className="text-[11px] bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 px-2 py-0.5 rounded font-medium">
                      {tx.paymentChannel}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        tx.status === 'paid'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : tx.status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {tx.status === 'paid' ? 'Paid' : tx.status === 'pending' ? 'Pending' : 'Overdue'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {tx.status !== 'paid' ? (
                      <button
                        onClick={() => handleMarkPaid(tx.id)}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      >
                        Thibitisha Malipo
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Imekamilika</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Generate Control Number */}
      {isGenerateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100 dark:border-slate-800 text-xs text-gray-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white">
                Tengeneza Namba Mpya ya Malipo (GePG)
              </h3>
              <button
                onClick={() => setIsGenerateOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateControl} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Jina la Mwanafunzi</label>
                <input
                  type="text"
                  required
                  placeholder="Mf: Amani Juma"
                  value={newStudent}
                  onChange={(e) => setNewStudent(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Shule</label>
                <input
                  type="text"
                  required
                  value={newSchool}
                  onChange={(e) => setNewSchool(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Darasa</label>
                  <input
                    type="text"
                    required
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Kiasi cha Ada (TZS)</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Njia Inayopendekezwa</label>
                <select
                  value={newChannel}
                  onChange={(e: any) => setNewChannel(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                >
                  <option value="M-Pesa">M-Pesa (Vodacom Lipa Namba)</option>
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="CRDB">CRDB Bank Wakala</option>
                  <option value="NMB">NMB Bank Wakala</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer"
                >
                  Tengeneza Control Number
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
