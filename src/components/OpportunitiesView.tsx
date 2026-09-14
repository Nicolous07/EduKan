import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  ExternalLink,
  Bookmark,
  Search,
  Gift,
  GraduationCap,
  Trophy,
  Code,
  Briefcase,
  Building2,
  Grid,
  ChevronRight
} from 'lucide-react';
import { OpportunityItem, UserProfile } from '../types';
import { ScholarshipHub } from './opportunities/ScholarshipHub';
import { CompetitionsHub } from './opportunities/CompetitionsHub';
import { HackathonsHub } from './opportunities/HackathonsHub';
import { InternshipsHub } from './opportunities/InternshipsHub';
import { UniversityHub } from './opportunities/UniversityHub';

interface Props {
  opportunities: OpportunityItem[];
  currentUser?: UserProfile;
  onToggleSave: (id: string) => void;
  onAwardPoints?: (points: number, reason: string) => void;
}

export const OpportunitiesView: React.FC<Props> = ({
  opportunities,
  currentUser,
  onToggleSave,
  onAwardPoints
}) => {
  const [activeMainTab, setActiveMainTab] = useState<
    'all' | 'scholarships' | 'competitions' | 'hackathons' | 'internships' | 'university'
  >('all');

  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Scholarship', 'Competition', 'Fellowship', 'Bootcamp', 'Hackathon'];

  const filtered = opportunities.filter((op) => {
    const matchesCat = selectedCat === 'All' || op.category === selectedCat;
    const matchesSearch =
      op.title.toLowerCase().includes(search.toLowerCase()) ||
      op.organizer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-28 sm:pb-16">
      {/* Navigation Header Tabs for the 5 Pillars */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span>Fursa za Masomo & Ukuaji wa Kitaaluma</span>
            </h1>
            <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
              Mfumo shirikishi unaokuwezesha kuandika barua za ufadhili, kufanya mazoezi ya mashindano kwa timer, kutafuta wajumbe wa hackathon, kufuatilia ramani za kazi na kukokotoa gharama za vyuo vikuu.
            </p>
          </div>

          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full self-start lg:self-auto">
            🌟 Fursa 5 Zilizothibitishwa
          </span>
        </div>

        {/* The 5 Pillars + Catalog Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 text-xs border-t border-gray-100 dark:border-slate-800 pt-3">
          <button
            onClick={() => setActiveMainTab('all')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMainTab === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Katalogi Kuu ({opportunities.length})</span>
          </button>

          <button
            onClick={() => setActiveMainTab('scholarships')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMainTab === 'scholarships'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>1. Ufadhili & AI Essay</span>
          </button>

          <button
            onClick={() => setActiveMainTab('competitions')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMainTab === 'competitions'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>2. Mashindano & Timer</span>
          </button>

          <button
            onClick={() => setActiveMainTab('hackathons')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMainTab === 'hackathons'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>3. Hackathons & Teams</span>
          </button>

          <button
            onClick={() => setActiveMainTab('internships')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMainTab === 'internships'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>4. Internships & Ramani</span>
          </button>

          <button
            onClick={() => setActiveMainTab('university')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMainTab === 'university'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>5. Vyuo Vikuu & Hesabu</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE PILLAR OR MAIN CATALOG */}
      {activeMainTab === 'scholarships' && (
        <ScholarshipHub currentUser={currentUser} onAwardPoints={onAwardPoints} />
      )}

      {activeMainTab === 'competitions' && (
        <CompetitionsHub currentUser={currentUser} onAwardPoints={onAwardPoints} />
      )}

      {activeMainTab === 'hackathons' && (
        <HackathonsHub currentUser={currentUser} onAwardPoints={onAwardPoints} />
      )}

      {activeMainTab === 'internships' && (
        <InternshipsHub currentUser={currentUser} onAwardPoints={onAwardPoints} />
      )}

      {activeMainTab === 'university' && (
        <UniversityHub currentUser={currentUser} onAwardPoints={onAwardPoints} />
      )}

      {activeMainTab === 'all' && (
        <div className="space-y-6">
          {/* Search and Categories Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCat(c)}
                  className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCat === c
                      ? 'bg-emerald-700 text-white font-semibold shadow-2xs'
                      : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {c === 'All' ? 'Fursa Zote' : c}
                </button>
              ))}
            </div>

            <div className="relative text-xs min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Tafuta fursa au shirika..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-xs text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Opportunities Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((op) => (
              <div
                key={op.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-600 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                      {op.category}
                    </span>
                    <button
                      onClick={() => onToggleSave(op.id)}
                      className="text-gray-400 dark:text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                      aria-label="Hifadhi"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${op.isSaved ? 'fill-emerald-700 dark:fill-emerald-400 text-emerald-700 dark:text-emerald-400' : ''}`}
                      />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-base text-gray-900 dark:text-slate-100 leading-snug">
                      {op.title}
                    </h3>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">{op.organizer}</div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">{op.description}</p>

                  <div className="space-y-1.5 text-xs bg-gray-50 dark:bg-slate-800/80 p-3 rounded-xl border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                      <Gift className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        <strong>Zawadi/Ufadhili:</strong> {op.rewardOrStipend}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        <strong>Mwisho wa Maombi:</strong> {op.deadline}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        <strong>Mahali:</strong> {op.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {op.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 mt-4 text-xs">
                  <span className="text-[11px] text-gray-400 dark:text-slate-500">{op.applicationsCount} wameomba</span>
                  <a
                    href={op.link}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>Omba Sasa</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
