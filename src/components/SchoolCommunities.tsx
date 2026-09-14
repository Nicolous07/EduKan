import React, { useState } from 'react';
import {
  School,
  MapPin,
  Users,
  CheckCircle2,
  ExternalLink,
  Search,
  MessageSquare,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { SchoolCommunity, UserProfile } from '../types';
import { SchoolChatView } from './SchoolChatView';

interface Props {
  schools: SchoolCommunity[];
  currentUser?: UserProfile;
  onToggleJoin: (schoolId: string) => void;
  onExploreSchool?: (schoolId: string) => void;
}

export const SchoolCommunities: React.FC<Props> = ({
  schools,
  currentUser,
  onToggleJoin,
  onExploreSchool
}) => {
  // Main view tab: 'directory' (School cards) | 'chat' (School & Level Chats) | 'private' (1-on-1 Direct Chats)
  const [activeView, setActiveView] = useState<'directory' | 'chat'>('directory');
  const [selectedSchoolChatId, setSelectedSchoolChatId] = useState<string | undefined>(undefined);
  const [selectedChannelId, setSelectedChannelId] = useState<string | undefined>(undefined);

  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const regions = ['All', 'Shinyanga', 'Arusha', 'Dar es Salaam', 'Tabora', 'Morogoro'];
  const categories = ['All', 'High School', 'Secondary School', 'University'];

  // Default fallback user if not passed
  const user: UserProfile = currentUser || {
    id: 'usr-nicolous',
    name: 'Nicolous Amini Munisi',
    handle: 'municryptrix',
    email: 'nicolousmunisi07@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Malampaka Secondary School',
    schoolRegion: 'Shinyanga',
    schoolDistrict: 'Kishapu',
    level: 'Form VI',
    combination: 'PCB (Physics, Chemistry, Biology)',
    bio: 'Mwanafunzi wa kidato cha sita',
    points: 1420,
    followersCount: 245,
    followingCount: 182,
    achievements: []
  };

  const filteredSchools = schools.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.district.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || s.region === selectedRegion;
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesRegion && matchesCat;
  });

  const handleOpenSchoolChat = (schoolId: string) => {
    setSelectedSchoolChatId(schoolId);
    setSelectedChannelId(undefined);
    setActiveView('chat');
  };

  return (
    <div className="space-y-5 pb-28 sm:pb-16">
      {/* Top Main Navigation Header with Sub-Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <School className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span>Jumuiya za Shule & Soga (School Network & Chats)</span>
            </h1>
            <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
              Ungana na wanafunzi shuleni kwako na kote nchini. Shiriki kwenye makundi ya madarasa (Level groups) na soga za faragha za kitaaluma.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Mijadala ya Shule Inaendelea</span>
            </span>
          </div>
        </div>

        {/* Primary Sub-View Switcher: Directory vs Soga & Vikundi */}
        <div className="flex items-center gap-2 border-t border-gray-100 dark:border-slate-800 pt-3">
          <button
            onClick={() => {
              setActiveView('directory');
              setSelectedSchoolChatId(undefined);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeView === 'directory'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Orodha ya Shule & Vyuo ({schools.length})</span>
          </button>

          <button
            onClick={() => setActiveView('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
              activeView === 'chat'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-300" />
            <span>Soga & Vikundi vya Masomo (School Chats)</span>
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
              Live
            </span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Full Chat Experience (School Community, Level Groups & Private 1-on-1) */}
      {activeView === 'chat' ? (
        <SchoolChatView
          currentUser={user}
          initialSchoolId={selectedSchoolChatId}
          initialChannelId={selectedChannelId}
          onBackToDirectory={() => setActiveView('directory')}
          onOpenSchoolProfile={(schoolId) => {
            if (onExploreSchool) onExploreSchool(schoolId);
          }}
        />
      ) : (
        /* VIEW 2: School Directory Grid */
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tafuta shule, chuo au wilaya..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-xs text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="text-xs text-gray-500 dark:text-slate-400 self-end sm:self-auto font-medium">
                Zimepatikana: <strong className="text-gray-800 dark:text-slate-200">{filteredSchools.length}</strong>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                <span className="text-gray-500 dark:text-slate-400 font-semibold mr-1">Mikoa:</span>
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`px-3 py-1 rounded-full font-medium transition-all ${
                      selectedRegion === r
                        ? 'bg-emerald-700 text-white shadow-2xs font-semibold'
                        : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {r === 'All' ? 'Yote' : r}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-gray-500 dark:text-slate-400 font-semibold mr-1">Aina:</span>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3 py-1 rounded-full font-medium transition-all ${
                      selectedCategory === c
                        ? 'bg-emerald-700 text-white shadow-2xs font-semibold'
                        : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {c === 'All' ? 'Zote' : c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Schools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <div
                key={school.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xs transition-shadow"
              >
                <div>
                  {/* Cover Banner */}
                  <div className="h-28 relative overflow-hidden bg-emerald-900">
                    <img
                      src={school.coverImage}
                      alt={school.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {school.category}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 relative pt-0">
                    <div className="flex items-end justify-between -mt-7 mb-2">
                      <img
                        src={school.logo}
                        alt={school.name}
                        className="w-14 h-14 rounded-xl object-cover ring-2 ring-white dark:ring-slate-800 shadow-2xs bg-white dark:bg-slate-800"
                      />
                      <button
                        onClick={() => onToggleJoin(school.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                          school.joined
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                        }`}
                      >
                        {school.joined ? 'Umejiunga ✓' : '+ Jiunge'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <h3 className="font-heading font-bold text-gray-900 dark:text-slate-100 text-sm truncate">{school.name}</h3>
                      {school.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-slate-400 mt-1">
                      <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>{school.district}, {school.region}</span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                      {school.about}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 text-[11px]">
                      <div className="bg-gray-50 dark:bg-slate-800/80 p-2 rounded-lg">
                        <span className="text-gray-400 dark:text-slate-400 block text-[10px]">Wanafunzi:</span>
                        <strong className="text-gray-800 dark:text-slate-200">{school.studentCount.toLocaleString()}</strong>
                      </div>
                      <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-2 rounded-lg">
                        <span className="text-emerald-700 dark:text-emerald-300 block text-[10px]">Mijadala (Chat):</span>
                        <strong className="text-emerald-900 dark:text-emerald-200 font-medium">Inaendelea</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Footer with Prominent Chat Button */}
                <div className="p-3 bg-gray-50/70 dark:bg-slate-800/60 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2 text-xs">
                  {/* Chat ya Shule Button */}
                  <button
                    onClick={() => handleOpenSchoolChat(school.id)}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    title={`Fungua Soga na Makundi ya Level ya ${school.name}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Chat ya Shule</span>
                  </button>

                  {/* Explore Button */}
                  {onExploreSchool && (
                    <button
                      onClick={() => onExploreSchool(school.id)}
                      className="px-3 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 font-semibold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Tazama</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
