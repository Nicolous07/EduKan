import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Trophy,
  Medal,
  Award,
  Sparkles,
  Flame,
  Search,
  School,
  GraduationCap,
  MapPin,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  ArrowUpRight,
  Gift,
  Star,
  Users,
  Calendar,
  Layers,
  BookOpen
} from 'lucide-react';
import { LeaderboardStudent, UserProfile, SchoolCommunity } from '../types';
import { INITIAL_LEADERBOARD, INITIAL_SCHOOLS } from '../data/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  students?: LeaderboardStudent[];
  schools?: SchoolCommunity[];
  currentUser: UserProfile;
  onNavigateTab?: (tab: string) => void;
}

export const LeaderboardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  students = INITIAL_LEADERBOARD,
  schools = INITIAL_SCHOOLS,
  currentUser,
  onNavigateTab
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'students' | 'schools' | 'rewards'>('students');
  const [timeFilter, setTimeFilter] = useState<'season' | 'month' | 'week'>('season');
  const [filterCategory, setFilterCategory] = useState<'all' | 'science' | 'arts' | 'business'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Safe students list, ensuring currentUser is included with live points
  const allStudents = useMemo(() => {
    const list = Array.isArray(students) && students.length > 0 ? [...students] : [...INITIAL_LEADERBOARD];
    
    // Check if current user is present; if so, update their points, if not, add them
    const userIndex = list.findIndex(s => s.id === currentUser.id || s.isCurrentUser);
    if (userIndex >= 0) {
      list[userIndex] = {
        ...list[userIndex],
        points: Math.max(list[userIndex].points, currentUser.points),
        name: currentUser.name,
        avatar: currentUser.avatar,
        schoolName: currentUser.schoolName,
        combination: currentUser.combination || list[userIndex].combination
      };
    } else {
      list.push({
        id: currentUser.id,
        rank: list.length + 1,
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        schoolName: currentUser.schoolName,
        region: currentUser.schoolRegion,
        level: currentUser.level,
        combination: currentUser.combination || 'PCB',
        points: currentUser.points,
        streakDays: 14,
        answersGiven: 42,
        badge: 'Top Scholar 💡',
        isCurrentUser: true
      });
    }

    // Sort descending by points
    list.sort((a, b) => b.points - a.points);

    // Re-assign ranks
    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
  }, [students, currentUser]);

  // Filter students based on category and search query
  const filteredStudents = useMemo(() => {
    return allStudents.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.combination && s.combination.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterCategory === 'science') {
        return (
          s.combination?.includes('PCB') ||
          s.combination?.includes('PCM') ||
          s.combination?.includes('PGM') ||
          s.combination?.includes('CBG')
        );
      }
      if (filterCategory === 'arts') {
        return (
          s.combination?.includes('HGL') ||
          s.combination?.includes('HKL') ||
          s.combination?.includes('HGK')
        );
      }
      if (filterCategory === 'business') {
        return (
          s.combination?.includes('EGM') ||
          s.combination?.includes('ECA') ||
          s.combination?.includes('Commerce')
        );
      }
      return true;
    });
  }, [allStudents, searchQuery, filterCategory]);

  // Top 3 students for podium
  const top3 = useMemo(() => allStudents.slice(0, 3), [allStudents]);
  
  // Current user's ranking entry
  const currentUserEntry = useMemo(
    () => allStudents.find((s) => s.id === currentUser.id || s.isCurrentUser),
    [allStudents, currentUser]
  );

  // Ranked schools list with computed EduPoints
  const rankedSchools = useMemo(() => {
    const rawSchools = Array.isArray(schools) && schools.length > 0 ? schools : INITIAL_SCHOOLS;
    
    // Seed points based on student count and activities
    const schoolList = rawSchools.map((school, index) => {
      // Calculate realistic dynamic points for schools
      const basePoints = 8500 - (index * 480);
      return {
        ...school,
        points: Math.max(1200, basePoints),
        rank: index + 1
      };
    });

    if (!searchQuery.trim()) return schoolList;
    return schoolList.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.district.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [schools, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-gray-950/70 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-emerald-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-md font-black">
              <Trophy className="w-5 h-5 text-amber-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg font-heading tracking-tight">
                  National Leaderboard
                </h3>
                <span className="text-[10px] bg-amber-400 text-amber-950 font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                  Season 2026
                </span>
              </div>
              <p className="text-xs text-emerald-100/90">
                Top students and schools by EduPoints and academic contributions across Tanzania
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Highlight Banner */}
        {currentUserEntry && (
          <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-300 shadow bg-white"
                />
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-amber-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  #{currentUserEntry.rank}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5 truncate">
                  <span>You: {currentUser.name}</span>
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-full font-semibold border border-emerald-400/30">
                    {currentUserEntry.badge || 'Top Scholar'}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-100 flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="font-semibold text-amber-300">Rank #{currentUserEntry.rank} Nationally</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-white">⭐ {currentUserEntry.points.toLocaleString()} EduPoints</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-amber-200 font-medium">
                    <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {currentUserEntry.streakDays}d streak
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              {currentUserEntry.rank > 1 && (
                <span className="text-[11px] text-emerald-100 hidden md:inline">
                  {allStudents[currentUserEntry.rank - 2] ? allStudents[currentUserEntry.rank - 2].points - currentUserEntry.points + 1 : 50} pts to rank #{currentUserEntry.rank - 1}
                </span>
              )}
              {onNavigateTab && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('study');
                  }}
                  className="bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Earn More Points</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Tabs Navigation: Students, Schools, Rewards */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-gray-50/90 dark:bg-slate-800/90 px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold py-1">
            <button
              onClick={() => setActiveMainTab('students')}
              className={`py-2.5 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeMainTab === 'students'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Top Students ({allStudents.length})</span>
            </button>

            <button
              onClick={() => setActiveMainTab('schools')}
              className={`py-2.5 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeMainTab === 'schools'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <School className="w-4 h-4" />
              <span>Top Schools</span>
            </button>

            <button
              onClick={() => setActiveMainTab('rewards')}
              className={`py-2.5 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeMainTab === 'rewards'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Awards & Season Rules</span>
            </button>
          </div>
        </div>

        {/* Filter Bar (Search + Period/Streams) */}
        {activeMainTab !== 'rewards' && (
          <div className="px-4 sm:px-6 py-3 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row gap-2.5 md:items-center justify-between">
            {/* Left: Stream / Category chips */}
            {activeMainTab === 'students' ? (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    filterCategory === 'all'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  All ({allStudents.length})
                </button>
                <button
                  onClick={() => setFilterCategory('science')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    filterCategory === 'science'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Science (PCM/PCB)
                </button>
                <button
                  onClick={() => setFilterCategory('arts')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    filterCategory === 'arts'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Arts (HGL/HKL)
                </button>
                <button
                  onClick={() => setFilterCategory('business')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    filterCategory === 'business'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Business (EGM)
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 font-medium">
                <School className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Secondary Schools Ranked by Academic Contributions</span>
              </div>
            )}

            {/* Right: Search Input */}
            <div className="relative min-w-[200px] sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeMainTab === 'students' ? 'Search student, school, region...' : 'Search school or region...'}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>
        )}

        {/* Tab Content 1: Top Students */}
        {activeMainTab === 'students' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4 bg-white dark:bg-slate-900">
            {/* Top 3 Podium (shown when not filtering by search query) */}
            {!searchQuery && filterCategory === 'all' && (
              <div className="pt-2 pb-4 border-b border-gray-100 dark:border-slate-800">
                <div className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3 text-center flex items-center justify-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>National Top 3 Podium</span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-lg mx-auto">
                  {/* 2nd Place */}
                  {top3[1] && (
                    <div className="flex flex-col items-center text-center p-3 bg-white dark:bg-slate-800/90 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-shadow">
                      <div className="relative mb-2">
                        <img
                          src={top3[1].avatar}
                          alt={top3[1].name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-gray-300 dark:ring-slate-600"
                        />
                        <span className="absolute -top-2 -right-2 bg-gray-300 dark:bg-slate-600 text-gray-800 dark:text-slate-100 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-xs">
                          🥈 2
                        </span>
                      </div>
                      <div className="font-bold text-xs text-gray-900 dark:text-slate-100 truncate w-full">{top3[1].name}</div>
                      <div className="text-[10px] text-gray-500 dark:text-slate-400 truncate w-full">{top3[1].schoolName}</div>
                      <div className="mt-1 font-mono font-bold text-xs text-gray-800 dark:text-slate-200">
                        ⭐ {top3[1].points.toLocaleString()}
                      </div>
                      <div className="text-[9px] text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-700/80 px-1.5 py-0.5 rounded mt-1 truncate max-w-full font-medium">
                        {top3[1].combination}
                      </div>
                    </div>
                  )}

                  {/* 1st Place - Champion */}
                  {top3[0] && (
                    <div className="flex flex-col items-center text-center p-3.5 sm:p-4 bg-gradient-to-b from-amber-50 via-white to-amber-50/40 dark:from-amber-950/40 dark:via-slate-850 dark:to-amber-950/20 rounded-2xl border-2 border-amber-400 shadow-md transform sm:-translate-y-2">
                      <div className="relative mb-2">
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-amber-500">
                          <Trophy className="w-5 h-5 fill-amber-400" />
                        </div>
                        <img
                          src={top3[0].avatar}
                          alt={top3[0].name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-4 ring-amber-400 mt-1"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                          🥇 1
                        </span>
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-gray-900 dark:text-slate-100 truncate w-full">{top3[0].name}</div>
                      <div className="text-[10px] text-amber-900 dark:text-amber-300 font-semibold truncate w-full">{top3[0].schoolName}</div>
                      <div className="mt-1 font-mono font-black text-xs sm:text-sm text-amber-700 dark:text-amber-400">
                        ⭐ {top3[0].points.toLocaleString()} pts
                      </div>
                      <span className="text-[9px] bg-amber-100 dark:bg-amber-900/80 text-amber-950 dark:text-amber-200 font-extrabold px-2 py-0.5 rounded-full mt-1 border border-amber-300 dark:border-amber-700 shadow-2xs">
                        National Champion 👑
                      </span>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {top3[2] && (
                    <div className="flex flex-col items-center text-center p-3 bg-white dark:bg-slate-800/90 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-shadow">
                      <div className="relative mb-2">
                        <img
                          src={top3[2].avatar}
                          alt={top3[2].name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-amber-700/40"
                        />
                        <span className="absolute -top-2 -right-2 bg-amber-700 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                          🥉 3
                        </span>
                      </div>
                      <div className="font-bold text-xs text-gray-900 dark:text-slate-100 truncate w-full">{top3[2].name}</div>
                      <div className="text-[10px] text-gray-500 dark:text-slate-400 truncate w-full">{top3[2].schoolName}</div>
                      <div className="mt-1 font-mono font-bold text-xs text-amber-800 dark:text-amber-400">
                        ⭐ {top3[2].points.toLocaleString()}
                      </div>
                      <div className="text-[9px] text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-700/80 px-1.5 py-0.5 rounded mt-1 truncate max-w-full font-medium">
                        {top3[2].combination}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Students List */}
            <div className="space-y-2">
              {filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                  No students match your search criteria.
                </div>
              ) : (
                filteredStudents.map((student) => {
                  const isUser = student.id === currentUser.id || student.isCurrentUser;
                  const isTop1 = student.rank === 1;
                  const isTop2 = student.rank === 2;
                  const isTop3 = student.rank === 3;

                  return (
                    <div
                      key={student.id}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isUser
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-200/80 dark:ring-emerald-800/80 shadow-xs'
                          : 'bg-white dark:bg-slate-800/90 hover:bg-gray-50/80 dark:hover:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-2xs'
                      }`}
                    >
                      {/* Left: Rank, Avatar & Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Rank Badge */}
                        <div className="w-8 flex items-center justify-center shrink-0">
                          {isTop1 ? (
                            <div className="w-7 h-7 rounded-xl bg-amber-400 text-white font-black text-xs flex items-center justify-center shadow-xs">
                              1
                            </div>
                          ) : isTop2 ? (
                            <div className="w-7 h-7 rounded-xl bg-gray-300 dark:bg-slate-600 text-gray-800 dark:text-slate-100 font-black text-xs flex items-center justify-center shadow-xs">
                              2
                            </div>
                          ) : isTop3 ? (
                            <div className="w-7 h-7 rounded-xl bg-amber-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                              3
                            </div>
                          ) : (
                            <span className="font-mono font-bold text-xs text-gray-500 dark:text-slate-400">
                              #{student.rank}
                            </span>
                          )}
                        </div>

                        {/* Avatar */}
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-slate-700 shrink-0 bg-white"
                        />

                        {/* Details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-slate-100 truncate">
                              {student.name}
                            </span>
                            {isUser && (
                              <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                                You
                              </span>
                            )}
                            {student.badge && (
                              <span className="text-[10px] bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-600 font-medium">
                                {student.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 truncate">
                            <span className="flex items-center gap-1 truncate">
                              <School className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span className="truncate">{student.schoolName}</span>
                            </span>
                            <span>•</span>
                            <span className="truncate">{student.region}</span>
                            {student.combination && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{student.combination}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Points and Streak */}
                      <div className="text-right shrink-0">
                        <div className="font-mono font-black text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
                          ⭐ {student.points.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                          <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{student.streakDays}d streak</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab Content 2: Top Schools */}
        {activeMainTab === 'schools' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-3 bg-white dark:bg-slate-900">
            <div className="text-xs text-gray-600 dark:text-slate-400 mb-2">
              Schools are ranked by total EduPoints earned by students and participating teachers:
            </div>
            {rankedSchools.map((sch, idx) => (
              <div
                key={sch.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 flex items-center justify-center shrink-0">
                    {idx === 0 ? (
                      <span className="text-base">🥇</span>
                    ) : idx === 1 ? (
                      <span className="text-base">🥈</span>
                    ) : idx === 2 ? (
                      <span className="text-base">🥉</span>
                    ) : (
                      <span className="font-mono font-bold text-xs text-gray-500 dark:text-slate-400">#{idx + 1}</span>
                    )}
                  </div>

                  <img
                    src={sch.logo}
                    alt={sch.name}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-slate-700 shrink-0 bg-white"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-slate-100 truncate">
                        {sch.name}
                      </span>
                      {sch.verified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{sch.district}, {sch.region}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span>{sch.studentCount} Students</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-black text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
                    ⭐ {sch.points.toLocaleString()} pts
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    {sch.activeDiscussions || 24} active discussions
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content 3: Awards & Point System */}
        {activeMainTab === 'rewards' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-6 bg-white dark:bg-slate-900">
            {/* Season 2026 Awards */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center">
                  <Gift className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100">National Season 2026 Awards</h4>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Awarded to top students and leading schools</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-800 border border-amber-300 dark:border-amber-700/60 shadow-xs">
                  <div className="text-2xl mb-1">🥇</div>
                  <div className="font-bold text-xs text-amber-950 dark:text-amber-300 uppercase">1st Place Nationally</div>
                  <div className="font-extrabold text-sm text-gray-900 dark:text-slate-100 mt-1">Modern Laptop + Term Tuition</div>
                  <p className="text-[11px] text-gray-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    Brand new academic laptop, school tuition sponsorship for one term, and Ministry of Education Certificate of Honor.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-800/80 border border-gray-300 dark:border-slate-700 shadow-xs">
                  <div className="text-2xl mb-1">🥈</div>
                  <div className="font-bold text-xs text-gray-700 dark:text-slate-300 uppercase">2nd Place Nationally</div>
                  <div className="font-extrabold text-sm text-gray-900 dark:text-slate-100 mt-1">Educational Tablet + Books</div>
                  <p className="text-[11px] text-gray-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    Modern educational tablet loaded with complete curriculum textbooks and revision examinations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-800 border border-amber-200 dark:border-amber-800/50 shadow-xs">
                  <div className="text-2xl mb-1">🥉</div>
                  <div className="font-bold text-xs text-amber-900 dark:text-amber-400 uppercase">3rd Place Nationally</div>
                  <div className="font-extrabold text-sm text-gray-900 dark:text-slate-100 mt-1">Book Bundle + Tech Voucher</div>
                  <p className="text-[11px] text-gray-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    Free vouchers for ICT/programming training courses and school study supplies for the full academic year.
                  </p>
                </div>
              </div>
            </div>

            {/* How EduPoints Are Earned Matrix */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100">How to Earn EduPoints</h4>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Point guidelines and contributions that raise your ranking</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-gray-50 dark:bg-slate-800/70 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-slate-100">Verified Best Answer</div>
                    <div className="text-[11px] text-gray-500 dark:text-slate-400">Providing an accurate and detailed solution</div>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-1 rounded-lg">
                    +50 pts
                  </span>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-800/70 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-slate-100">Quiz / Past Paper Attempt</div>
                    <div className="text-[11px] text-gray-500 dark:text-slate-400">Completing questions with high accuracy</div>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-1 rounded-lg">
                    +30 pts
                  </span>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-800/70 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-slate-100">Asking Meaningful Study Questions</div>
                    <div className="text-[11px] text-gray-500 dark:text-slate-400">Sharing academic challenges with the community</div>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-1 rounded-lg">
                    +10 pts
                  </span>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-800/70 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-slate-100">Daily Study Streak</div>
                    <div className="text-[11px] text-gray-500 dark:text-slate-400">Logging in and studying consecutive days</div>
                  </div>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-1 rounded-lg">
                    +5 pts/day
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Bar */}
        <div className="p-3.5 sm:p-4 bg-gray-50 dark:bg-slate-800/90 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              This leaderboard updates in real time for every academic answer, question, and quiz.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
