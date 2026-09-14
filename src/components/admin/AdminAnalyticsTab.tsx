import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface RegionalStat {
  region: string;
  schoolsCount: number;
  studentsCount: number;
  curriculumCoverage: number; // percentage
  mockPassRate: number; // percentage
  topSubject: string;
}

const REGIONAL_STATS: RegionalStat[] = [
  {
    region: 'Dar es Salaam',
    schoolsCount: 142,
    studentsCount: 38400,
    curriculumCoverage: 92,
    mockPassRate: 88,
    topSubject: 'Mathematics & ICT'
  },
  {
    region: 'Arusha',
    schoolsCount: 88,
    studentsCount: 24100,
    curriculumCoverage: 94,
    mockPassRate: 91,
    topSubject: 'Physics & Chemistry'
  },
  {
    region: 'Kilimanjaro',
    schoolsCount: 95,
    studentsCount: 26800,
    curriculumCoverage: 95,
    mockPassRate: 93,
    topSubject: 'Biology & Geography'
  },
  {
    region: 'Mwanza',
    schoolsCount: 110,
    studentsCount: 31200,
    curriculumCoverage: 87,
    mockPassRate: 82,
    topSubject: 'Basic Mathematics'
  },
  {
    region: 'Dodoma',
    schoolsCount: 76,
    studentsCount: 19800,
    curriculumCoverage: 89,
    mockPassRate: 84,
    topSubject: 'History & Kiswahili'
  },
  {
    region: 'Shinyanga',
    schoolsCount: 54,
    studentsCount: 14200,
    curriculumCoverage: 85,
    mockPassRate: 79,
    topSubject: 'Chemistry'
  },
  {
    region: 'Mbeya',
    schoolsCount: 68,
    studentsCount: 18500,
    curriculumCoverage: 90,
    mockPassRate: 86,
    topSubject: 'Agriculture & Biology'
  }
];

const SUBJECT_PERFORMANCE = [
  { subject: 'Basic Mathematics', avgScore: 78, questionsAnswered: 142000, trend: '+5.4%' },
  { subject: 'Physics', avgScore: 82, questionsAnswered: 98000, trend: '+8.1%' },
  { subject: 'Chemistry', avgScore: 85, questionsAnswered: 112000, trend: '+6.2%' },
  { subject: 'Biology', avgScore: 89, questionsAnswered: 138000, trend: '+4.0%' },
  { subject: 'Geography', avgScore: 86, questionsAnswered: 84000, trend: '+3.7%' },
  { subject: 'History & Civics', avgScore: 91, questionsAnswered: 76000, trend: '+2.9%' }
];

export const AdminAnalyticsTab: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const filteredRegions =
    selectedRegion === 'All'
      ? REGIONAL_STATS
      : REGIONAL_STATS.filter((r) => r.region === selectedRegion);

  return (
    <div className="space-y-6 text-gray-900 dark:text-slate-100">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
              Takwimu za Kitaifa za Elimu & Mitaala (Curriculum & Learning Analytics)
            </h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
            Tathmini ya maendeleo ya ufundishaji, ufaulu wa mitihani ya majaribio (Mock & NECTA), na umaliziaji wa mitaala ya TIE mikoani.
          </p>
        </div>

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="p-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-slate-900 self-start md:self-auto cursor-pointer"
        >
          <option value="All">Mikoa Yote ya Tanzania</option>
          {REGIONAL_STATS.map((r) => (
            <option key={r.region} value={r.region}>
              {r.region}
            </option>
          ))}
        </select>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xs text-xs space-y-1">
          <div className="text-gray-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>Wanafunzi Wanaotumia Mfumo:</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-heading text-gray-900 dark:text-white">173,000+</div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% mwezi huu</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xs text-xs space-y-1">
          <div className="text-gray-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>Umaliziaji wa Mtaala (TIE):</span>
            <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-heading text-gray-900 dark:text-white">90.4%</div>
          <div className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">Wastani wa Mikoa yote 31</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xs text-xs space-y-1">
          <div className="text-gray-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>Wastani wa Ufaulu wa Mock:</span>
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-heading text-gray-900 dark:text-white">86.8%</div>
          <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">Daraja la I hadi la III</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xs text-xs space-y-1">
          <div className="text-gray-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>Maswali Yaliyojibiwa:</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-heading text-gray-900 dark:text-white">650,000+</div>
          <div className="text-[11px] text-purple-700 dark:text-purple-400 font-semibold">Mazoezi ya Timer & Olympiad</div>
        </div>
      </div>

      {/* Regional Performance Comparison */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Ulinganifu wa Mikoa ya Tanzania</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRegions.map((r) => (
            <div
              key={r.region}
              className="p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 space-y-3 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white">{r.region}</h4>
                  <div className="text-[11px] text-gray-500 dark:text-slate-400">
                    {r.schoolsCount} Shule • {r.studentsCount.toLocaleString()} Wanafunzi
                  </div>
                </div>
                <span className="text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Ufaulu: {r.mockPassRate}%
                </span>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-gray-600 dark:text-slate-400 mb-1">
                  <span>Mtaala Uliokamilika:</span>
                  <strong className="text-gray-900 dark:text-slate-200">{r.curriculumCoverage}%</strong>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${r.curriculumCoverage}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200/60 dark:border-slate-700/60 text-[11px] text-gray-600 dark:text-slate-400 flex justify-between">
                <span>Somo Linaloongoza:</span>
                <strong className="text-emerald-800 dark:text-emerald-400">{r.topSubject}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Performance Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Ufaulu kwa Kila Somo Kitaifa</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBJECT_PERFORMANCE.map((sub) => (
            <div
              key={sub.subject}
              className="p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 dark:text-white">{sub.subject}</h4>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  {sub.trend}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-heading text-gray-900 dark:text-white">{sub.avgScore}%</span>
                <span className="text-gray-400 dark:text-slate-500 text-[11px]">Wastani wa Alama</span>
              </div>

              <div className="text-[11px] text-gray-500 dark:text-slate-400">
                Maswali {sub.questionsAnswered.toLocaleString()} yaliyojibiwa
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
