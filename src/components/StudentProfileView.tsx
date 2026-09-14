import React, { useState } from 'react';
import {
  User,
  MapPin,
  School,
  GraduationCap,
  Award,
  Bookmark,
  FileText,
  HelpCircle,
  Share2,
  Calendar,
  CheckCircle2,
  Sparkles,
  Trophy,
  ShieldCheck,
  Camera,
  Check,
  LogIn
} from 'lucide-react';
import { UserProfile, Post, QuestionItem } from '../types';
import { EditProfileModal } from './EditProfileModal';

interface Props {
  user: UserProfile;
  posts: Post[];
  questions: QuestionItem[];
  onOpenLeaderboard?: () => void;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
  onOpenLogin?: () => void;
}

export const StudentProfileView: React.FC<Props> = ({
  user,
  posts,
  questions,
  onOpenLeaderboard,
  onUpdateProfile,
  onOpenLogin
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'achievements' | 'questions'>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSaveProfile = (updated: Partial<UserProfile>) => {
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user.name} - Wasifu wa EduKan`,
        text: `Mfahamu ${user.name}, ${user.title || 'Mwanafunzi'} kutoka ${user.schoolName} kwenye mtandao wa elimu EduKan Tanzania.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Kiungo cha wasifu kimenakiliwa (Copied)!');
    }
  };

  const myPosts = posts.filter(p => p.author.id === user.id);
  const myQuestions = questions.filter(q => q.author.id === user.id || q.answers.some(a => a.author.id === user.id));

  return (
    <div className="space-y-6 pb-28 sm:pb-16">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-500 flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>Wasifu wako umesasishwa na kuhifadhiwa kikamilifu!</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 relative bg-emerald-900 group">
          <img
            src={user.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Quick Edit Cover Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Badilisha Jalada</span>
          </button>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 gap-4 mb-4">
            <div className="relative shrink-0 group">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-md bg-white dark:bg-slate-800 shrink-0"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-800" />
              
              {/* Quick Avatar Edit Badge */}
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                title="Badilisha picha ya wasifu"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Badili Picha</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-2 sm:pt-0">
              {onOpenLeaderboard && (
                <button
                  id="profile-open-leaderboard-btn"
                  onClick={onOpenLeaderboard}
                  className="bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900 active:bg-amber-200 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Vinara (Leaderboard)</span>
                </button>
              )}
              <button
                id="profile-edit-profile-btn"
                onClick={() => setIsEditModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Hariri Wasifu</span>
              </button>
              <button
                type="button"
                onClick={handleShareProfile}
                className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Shiriki</span>
              </button>
              {onOpenLogin && (
                <button
                  type="button"
                  id="profile-switch-account-btn"
                  onClick={onOpenLogin}
                  className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 active:bg-gray-300 text-gray-700 dark:text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Badili akaunti au ingia kwenye EduKan"
                >
                  <LogIn className="w-3.5 h-3.5 text-gray-600 dark:text-slate-400" />
                  <span>Ingia / Badili</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 dark:text-slate-100">{user.name}</h1>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />

              {/* Wadhifu / Title Badge Prominently Displayed */}
              {user.title ? (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-950/80 dark:to-amber-900/40 text-amber-950 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-bold border border-amber-300 dark:border-amber-700 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>{user.title}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Mwanafunzi</span>
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
              <span>@{user.handle}</span>
              {user.studentRegNo && (
                <>
                  <span className="text-gray-300 dark:text-slate-600">•</span>
                  <span className="text-gray-500 dark:text-slate-400 font-sans">{user.studentRegNo}</span>
                </>
              )}
            </div>

            {/* Academic Tags */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-600 dark:text-slate-300 mt-2.5">
              <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 px-2.5 py-1 rounded-lg font-semibold">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {user.level} • {user.combination}
              </span>
              <span className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2.5 py-1 rounded-lg font-medium">
                <School className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {user.schoolName}
              </span>
              <span className="flex items-center gap-1 text-gray-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {user.schoolDistrict}, {user.schoolRegion}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 mt-3 max-w-3xl leading-relaxed">
              {user.bio}
            </p>

            {/* Followers & Points */}
            <div className="flex items-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 text-xs flex-wrap">
              <div>
                <strong className="text-gray-900 dark:text-slate-100 font-bold">{user.followersCount}</strong>{' '}
                <span className="text-gray-500 dark:text-slate-400">Wanaomfuata</span>
              </div>
              <div>
                <strong className="text-gray-900 dark:text-slate-100 font-bold">{user.followingCount}</strong>{' '}
                <span className="text-gray-500 dark:text-slate-400">Wanaofuatwa</span>
              </div>
              <button
                type="button"
                onClick={onOpenLeaderboard}
                className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl text-left transition-all flex items-center gap-1.5 group cursor-pointer shadow-2xs"
                title="Bofya kufungua orodha ya vinara kitaifa"
              >
                <strong className="text-emerald-800 dark:text-emerald-300 font-mono font-bold">⭐ {user.points}</strong>{' '}
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Knowledge Points</span>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded ml-1 group-hover:scale-105 transition-transform flex items-center gap-0.5 border border-amber-200 dark:border-amber-700">
                  <Trophy className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  #3 Kitaifa
                </span>
              </button>
            </div>

            {/* EduKan Rank & Points Progress Bar */}
            {(() => {
              const ranks = [
                { id: 'tier1', name: 'Mwanzo wa Safari (Novice Scholar)', min: 0, max: 249, badge: '🌱', level: 'Lv. 1' },
                { id: 'tier2', name: 'Mwanafunzi Shupavu (Active Scholar)', min: 250, max: 499, badge: '📘', level: 'Lv. 2' },
                { id: 'tier3', name: 'Msomi Hodari (Master Scholar)', min: 500, max: 999, badge: '🥉', level: 'Lv. 3' },
                { id: 'tier4', name: 'Gwiji wa Masomo (Academic Champion)', min: 1000, max: 1999, badge: '🥈', level: 'Lv. 4' },
                { id: 'tier5', name: 'Mwanazuoni Mkuu (Grand Scholar Kitaifa)', min: 2000, max: 5000, badge: '🥇', level: 'Lv. 5' },
              ];

              const currentTierIndex = ranks.findIndex(r => user.points >= r.min && user.points <= r.max);
              const currentTier = currentTierIndex !== -1 ? ranks[currentTierIndex] : ranks[ranks.length - 1];
              const nextTier = currentTierIndex !== -1 && currentTierIndex < ranks.length - 1 ? ranks[currentTierIndex + 1] : null;

              const pointsNeeded = nextTier ? Math.max(0, nextTier.min - user.points) : 0;
              const rangeSpan = nextTier ? nextTier.min - currentTier.min : 1;
              const currentProgress = nextTier
                ? Math.min(100, Math.max(0, Math.round(((user.points - currentTier.min) / rangeSpan) * 100)))
                : 100;

              return (
                <div id="edukan-rank-progress-card" className="mt-4 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/60 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 rounded-2xl border border-emerald-200/90 dark:border-emerald-800/80 shadow-2xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl" role="img" aria-label="Badge">{currentTier.badge}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-900 dark:text-slate-100">Cheo cha EduKan:</span>
                          <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-300/80 dark:border-emerald-700">
                            {currentTier.name} ({currentTier.level})
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 dark:text-slate-400 mt-0.5">
                          {nextTier ? (
                            <span>
                              Zimebaki <strong className="text-emerald-800 dark:text-emerald-300 font-bold font-mono">{pointsNeeded}</strong> pointi kufikia cheo cha <strong className="text-gray-900 dark:text-slate-200">{nextTier.name}</strong>
                            </span>
                          ) : (
                            <span className="text-amber-800 dark:text-amber-300 font-bold">
                              🏆 Uko kwenye cheo cha juu kabisa cha kitaifa! Hongera sana!
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-700 shadow-2xs shrink-0 self-start sm:self-auto">
                      <span>{user.points} pts</span>
                      {nextTier && <span className="text-gray-400 dark:text-slate-500">/ {nextTier.min} pts</span>}
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200/80 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-emerald-200/60 dark:border-emerald-900">
                      <div
                        className="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                        style={{ width: `${Math.max(5, currentProgress)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-slate-400 font-medium px-0.5">
                      <span>{currentTier.level} ({currentTier.min} pts)</span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">{currentProgress}% Imekamilika</span>
                      <span>{nextTier ? `${nextTier.level} (${nextTier.min} pts)` : 'Max'}</span>
                    </div>
                  </div>

                  {/* Micro points earning hint */}
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[10px] text-emerald-900/80 dark:text-emerald-300/80 border-t border-emerald-200/50 dark:border-emerald-800/60">
                    <span className="flex items-center gap-1">
                      💡 <span>Pata pointi: Jibu maswali (+10 pts), Pakia mitihani (+25 pts), Shiriki mijadala (+5 pts)</span>
                    </span>
                    {onOpenLeaderboard && (
                      <button
                        type="button"
                        onClick={onOpenLeaderboard}
                        className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        Tazama Vinara Wote &rarr;
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex items-center border-t border-gray-200 dark:border-slate-800 px-6 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'posts', label: `Machapisho (${myPosts.length})` },
            { id: 'achievements', label: `Mataji & Beji (${user.achievements.length})` },
            { id: 'questions', label: `Maswali ya Masomo (${myQuestions.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {myPosts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-800 text-center text-xs text-gray-500 dark:text-slate-400">
              Bado hujaweka chapisho lolote. Shiriki dokezo la masomo leo!
            </div>
          ) : (
            myPosts.map((p) => (
              <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs">
                <div className="text-xs text-gray-400 dark:text-slate-500 mb-1">{p.createdAt}</div>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-slate-200 leading-relaxed">{p.content}</p>
                {p.mediaUrl && (
                  <img src={p.mediaUrl} alt="Post" className="mt-3 rounded-xl max-h-72 object-cover" />
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user.achievements.map((ach) => (
            <div key={ach.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-2xs flex items-start gap-3">
              <span className="text-3xl p-2 bg-emerald-50 dark:bg-slate-800 rounded-xl">{ach.icon}</span>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-slate-100">{ach.title}</h4>
                <p className="text-xs text-gray-600 dark:text-slate-300 mt-0.5">{ach.description}</p>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 block">Ilipatikana: {ach.unlockedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="space-y-3">
          {myQuestions.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-800 text-center text-xs text-gray-500 dark:text-slate-400">
              Bado hujashiriki kwenye maswali ya chumba cha masomo.
            </div>
          ) : (
            myQuestions.map((q) => (
              <div key={q.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    {q.subject}
                  </span>
                  <span className="text-[11px] text-gray-400 dark:text-slate-500">{q.createdAt}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-slate-100 mb-1">{q.title}</h4>
                <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{q.content}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};
