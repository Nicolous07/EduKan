import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  BarChart2,
  Award,
  HelpCircle,
  School,
  Flame,
  ArrowUpRight,
  Plus,
  BookOpen,
  Compass,
  Smile,
  Globe,
  Trophy,
  TrendingUp,
  Target,
  Zap,
  ChevronRight,
  MessageSquare,
  WifiOff,
  RefreshCw,
  Clock,
  X,
  FileText,
  Copy,
  Check,
  Share,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Download,
  Paperclip
} from 'lucide-react';
import { Post, UserProfile, SchoolCommunity, PostCategory } from '../types';
import { getEduPointsInfo } from '../lib/edupoints';
import { FeedSkeleton } from './common/FeedSkeleton';
import { ImageViewerModal } from './common/ImageViewerModal';
import { isPostRecommendedForUser } from '../lib/recommendations';

interface Props {
  posts: Post[];
  currentUser: UserProfile;
  schools: SchoolCommunity[];
  onAddPost: (post: Partial<Post>) => void;
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onSharePost?: (postId: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenQuickAction?: (mode?: 'post' | 'question') => void;
  onOpenLeaderboard?: () => void;
  isOnline?: boolean;
}

export const HomeFeed: React.FC<Props> = ({
  posts,
  currentUser,
  schools,
  onAddPost,
  onLikePost,
  onSavePost,
  onSharePost,
  onVotePoll,
  onAddComment,
  onLikeComment,
  onDeleteComment,
  onNavigateTab,
  onOpenQuickAction,
  onOpenLeaderboard,
  isOnline = true
}) => {
  // Category filter as requested: 'All', 'Masomo', 'Ushauri', 'Burudani'
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'masomo' | 'ushauri' | 'burudani'>('all');
  const [subFilter, setSubFilter] = useState<'all' | 'school' | 'questions' | 'saved'>('all');
  const [recommendationMode, setRecommendationMode] = useState<'recommended' | 'all'>('recommended');
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(false);

  // File Upload State for Post Publisher
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedMedia, setAttachedMedia] = useState<string | null>(null);
  const [attachedMediaType, setAttachedMediaType] = useState<'image' | 'document' | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  // Share and Reactions State
  const [shareModalPost, setShareModalPost] = useState<Post | null>(null);
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [reactionToast, setReactionToast] = useState<string | null>(null);

  // Comment Attachment Upload State
  const commentFileInputRef = useRef<HTMLInputElement>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentAttachments, setCommentAttachments] = useState<Record<string, { url: string; name: string; type: 'image' | 'file' }>>({});

  const handleCommentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeCommentPostId) return;

    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCommentAttachments(prev => ({
        ...prev,
        [activeCommentPostId]: {
          url: result,
          name: file.name,
          type: isImg ? 'image' : 'file'
        }
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Full Image Lightbox Modal State
  const [fullImageModal, setFullImageModal] = useState<{
    url: string;
    authorName?: string;
    caption?: string;
  } | null>(null);
  const [isFullImageZoomed, setIsFullImageZoomed] = useState<boolean>(false);

  // Close full image lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullImageModal) {
        setFullImageModal(null);
        setIsFullImageZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullImageModal]);

  const handleSelectCategory = (cat: 'all' | 'masomo' | 'ushauri' | 'burudani') => {
    if (categoryFilter === cat) return;
    setIsLoadingFeed(true);
    setCategoryFilter(cat);
    setTimeout(() => {
      setIsLoadingFeed(false);
    }, 400);
  };

  const handleSelectSubFilter = (sub: 'all' | 'school' | 'questions' | 'saved') => {
    if (subFilter === sub) return;
    setIsLoadingFeed(true);
    setSubFilter(sub);
    setTimeout(() => {
      setIsLoadingFeed(false);
    }, 350);
  };

  const handleRefreshFeed = () => {
    setIsLoadingFeed(true);
    setTimeout(() => {
      setIsLoadingFeed(false);
    }, 500);
  };

  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<PostCategory>('masomo');
  const [postType, setPostType] = useState<'normal' | 'question' | 'achievement' | 'poll'>('normal');
  const [pollOpts, setPollOpts] = useState(['', '']);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  const edupointsInfo = getEduPointsInfo(currentUser.points);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFileName(file.name);
    if (file.type.startsWith('image/')) {
      setAttachedMediaType('image');
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setAttachedMedia(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setAttachedMediaType('document');
      setAttachedMedia(`https://edukan.tz/docs/${encodeURIComponent(file.name)}`);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const newPost: Partial<Post> = {
      type: postType,
      category: postCategory,
      content: postContent.trim(),
      mediaUrl: attachedMedia || undefined,
      mediaType: attachedMediaType || undefined,
      subject: postType === 'question' ? 'Akademia' : (postCategory === 'ushauri' ? 'Ushauri' : postCategory === 'burudani' ? 'Burudani' : 'Masomo'),
      pollOptions: postType === 'poll' ? pollOpts.filter(o => o.trim()).map((t, i) => ({ id: `opt-${i}`, text: t, votes: 0 })) : undefined
    };

    onAddPost(newPost);
    setPostContent('');
    setPostType('normal');
    setPollOpts(['', '']);
    setAttachedMedia(null);
    setAttachedMediaType(null);
    setAttachedFileName(null);
  };

  // Calculate counts for categories
  const categoryCounts = {
    all: posts.length,
    masomo: posts.filter(p => p.category === 'masomo' || p.type === 'question' || (!p.category && !p.subject?.toLowerCase().includes('ushauri') && !p.subject?.toLowerCase().includes('michezo'))).length,
    ushauri: posts.filter(p => p.category === 'ushauri' || p.subject?.toLowerCase().includes('ushauri') || p.subject?.toLowerCase().includes('tips')).length,
    burudani: posts.filter(p => p.category === 'burudani' || p.subject?.toLowerCase().includes('michezo') || p.type === 'achievement').length,
    saved: posts.filter(p => p.isSaved).length
  };

  const filteredPosts = posts.filter(p => {
    // 0. Academic Level & Role Recommendation Filter
    if (recommendationMode === 'recommended') {
      if (!isPostRecommendedForUser(p, currentUser)) return false;
    }

    // 1. Primary Category Filter
    if (categoryFilter === 'masomo') {
      const isMasomo = p.category === 'masomo' || p.type === 'question' || (!p.category && !p.subject?.toLowerCase().includes('ushauri') && !p.subject?.toLowerCase().includes('michezo'));
      if (!isMasomo) return false;
    } else if (categoryFilter === 'ushauri') {
      const isUshauri = p.category === 'ushauri' || p.subject?.toLowerCase().includes('ushauri') || p.subject?.toLowerCase().includes('tips');
      if (!isUshauri) return false;
    } else if (categoryFilter === 'burudani') {
      const isBurudani = p.category === 'burudani' || p.subject?.toLowerCase().includes('michezo') || p.type === 'achievement';
      if (!isBurudani) return false;
    }

    // 2. Secondary Subfilter
    if (subFilter === 'school') return p.schoolId === currentUser.schoolId || p.schoolName?.includes('Malampaka');
    if (subFilter === 'questions') return p.type === 'question';
    if (subFilter === 'saved') return Boolean(p.isSaved);
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 lg:h-full lg:overflow-hidden relative">
      {/* Main Feed Column with Dedicated Scroll */}
      <div className="lg:col-span-8 space-y-4 lg:h-full lg:overflow-y-auto lg:pr-3 lg:custom-scrollbar pb-6 lg:pb-16">
        {/* Geometric Balance Welcome Hero Banner */}
        <div className="bg-emerald-600 dark:bg-emerald-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 font-heading">
              Welcome, {currentUser.name.split(' ')[0]}!
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-md leading-relaxed">
              Stay up to date with academic news, scholarships, competitions, and connect with students across Tanzania.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <button
                onClick={() => onNavigateTab('opportunities')}
                className="bg-white text-emerald-700 px-4 py-2 rounded-full text-xs font-bold hover:shadow-md transition-shadow shadow-xs cursor-pointer"
              >
                Explore Opportunities
              </button>
              <button
                onClick={() => onNavigateTab('study')}
                className="bg-emerald-700/80 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs font-semibold transition-colors border border-emerald-500/50 cursor-pointer"
              >
                Study Rooms
              </button>
              {onOpenQuickAction && (
                <button
                  onClick={() => onOpenQuickAction('question')}
                  className="bg-emerald-500/80 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ask a Question</span>
                </button>
              )}
            </div>
          </div>
          <div className="absolute -right-5 -bottom-5 opacity-10 pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="50" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Academic Level & Role Recommendation Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-3.5 border border-emerald-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-gray-900 dark:text-slate-100">Recommended for Your Level:</span>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md truncate">
                  {currentUser.level || 'Form V - VI'}
                </span>
                {currentUser.title && (
                  <span className="bg-purple-50 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-semibold px-2 py-0.5 rounded-md hidden sm:inline truncate">
                    {currentUser.title}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 truncate">
                {recommendationMode === 'recommended'
                  ? `Showing personalized questions and study feeds matching your academic level.`
                  : `Showing all community posts across schools without filtering by student level.`}
              </p>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start sm:self-auto text-xs font-bold">
            <button
              onClick={() => setRecommendationMode('recommended')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                recommendationMode === 'recommended'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>My Level</span>
            </button>
            <button
              onClick={() => setRecommendationMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                recommendationMode === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>All Tanzania</span>
            </button>
          </div>
        </div>

        {/* Primary Filtering Bar: 'All', 'Masomo', 'Ushauri', 'Burudani' */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-2.5 sm:p-3 border border-emerald-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-slate-200 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Filter Feed:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                Showing {filteredPosts.length} of {posts.length}
              </span>
              <button
                type="button"
                onClick={handleRefreshFeed}
                title="Refresh Feed"
                disabled={isLoadingFeed}
                className="p-1 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-all focus:outline-none disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFeed ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* All */}
            <button
              id="filter-all"
              onClick={() => handleSelectCategory('all')}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-gray-50 dark:bg-slate-800 hover:bg-emerald-50/70 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-100 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Globe className={`w-3.5 h-3.5 ${categoryFilter === 'all' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <span>All Posts</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                categoryFilter === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200'
              }`}>
                {categoryCounts.all}
              </span>
            </button>

            {/* Masomo */}
            <button
              id="filter-masomo"
              onClick={() => handleSelectCategory('masomo')}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === 'masomo'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-gray-50 dark:bg-slate-800 hover:bg-emerald-50/70 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-100 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <BookOpen className={`w-3.5 h-3.5 ${categoryFilter === 'masomo' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <span>Academics</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                categoryFilter === 'masomo' ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
              }`}>
                {categoryCounts.masomo}
              </span>
            </button>

            {/* Ushauri */}
            <button
              id="filter-ushauri"
              onClick={() => handleSelectCategory('ushauri')}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === 'ushauri'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-gray-50 dark:bg-slate-800 hover:bg-emerald-50/70 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-100 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Compass className={`w-3.5 h-3.5 ${categoryFilter === 'ushauri' ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`} />
                <span>Guidance</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                categoryFilter === 'ushauri' ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
              }`}>
                {categoryCounts.ushauri}
              </span>
            </button>

            {/* Burudani */}
            <button
              id="filter-burudani"
              onClick={() => handleSelectCategory('burudani')}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === 'burudani'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-gray-50 dark:bg-slate-800 hover:bg-emerald-50/70 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-100 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Smile className={`w-3.5 h-3.5 ${categoryFilter === 'burudani' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                <span>Campus Life</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                categoryFilter === 'burudani' ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
              }`}>
                {categoryCounts.burudani}
              </span>
            </button>
          </div>

          {/* Secondary Sub-filter Chips */}
          <div className="flex items-center gap-2 pt-2.5 mt-2.5 border-t border-gray-100 dark:border-slate-800 overflow-x-auto text-[11px]">
            <span className="text-gray-400 dark:text-slate-400 font-medium whitespace-nowrap pl-1">View:</span>
            <button
              onClick={() => handleSelectSubFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                subFilter === 'all'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-semibold'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              🔥 All Content
            </button>
            <button
              onClick={() => handleSelectSubFilter('school')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                subFilter === 'school'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-semibold'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              🏫 My School ({currentUser.schoolName.split(' ')[0]})
            </button>
            <button
              onClick={() => handleSelectSubFilter('questions')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                subFilter === 'questions'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-semibold'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              ❓ Academic Questions
            </button>
            <button
              onClick={() => handleSelectSubFilter('saved')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                subFilter === 'saved'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-semibold ring-1 ring-emerald-400'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
              <span>Bookmarks ({categoryCounts.saved})</span>
            </button>
          </div>
        </div>

        {/* Offline Cache Status Banner if not connected */}
        {!isOnline && (
          <div
            id="feed-offline-notice-banner"
            className="p-3.5 bg-amber-50/95 dark:bg-amber-950/80 border border-amber-300/80 dark:border-amber-700/80 rounded-xl text-xs text-amber-950 dark:text-amber-100 flex items-center justify-between gap-3 shadow-2xs animate-in fade-in"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-200/80 dark:bg-amber-900/60 flex items-center justify-center shrink-0">
                <WifiOff className="w-4 h-4 text-amber-800 dark:text-amber-300" />
              </div>
              <div>
                <strong className="font-bold text-amber-900 dark:text-amber-200">Hali ya Nje ya Mtandao (Offline Feed):</strong>
                <p className="text-[11px] text-amber-800 dark:text-amber-300/90 mt-0.5">
                  Machapisho yaliyohifadhiwa kwenye kumbukumbu ya kifaa (localStorage) yanaonyeshwa. Unaweza kusoma maudhui bila mtandao.
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-mono font-bold px-2 py-1 rounded-lg shrink-0">
              {posts.length} machapisho
            </span>
          </div>
        )}

        {/* Create Post Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-emerald-100 dark:border-slate-800 shadow-xs">
          <div className="flex gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-emerald-500/40"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Category:</span>
                <div className="inline-flex rounded-lg p-0.5 bg-gray-100 dark:bg-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPostCategory('masomo')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                      postCategory === 'masomo' ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold' : 'text-gray-600 dark:text-slate-400'
                    }`}
                  >
                    Academics
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostCategory('ushauri')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                      postCategory === 'ushauri' ? 'bg-white dark:bg-slate-700 text-amber-800 dark:text-amber-300 shadow-2xs font-semibold' : 'text-gray-600 dark:text-slate-400'
                    }`}
                  >
                    Guidance
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostCategory('burudani')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                      postCategory === 'burudani' ? 'bg-white dark:bg-slate-700 text-blue-800 dark:text-blue-300 shadow-2xs font-semibold' : 'text-gray-600 dark:text-slate-400'
                    }`}
                  >
                    Campus Life
                  </button>
                </div>
              </div>

              <textarea
                placeholder={`Share study notes, ask questions, or update fellow students, ${currentUser.name.split(' ')[0]}...`}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={2}
                className="w-full text-xs sm:text-sm p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
              />

              {/* Attached Image Preview */}
              {attachedMedia && attachedMediaType === 'image' && (
                <div className="relative my-2.5 inline-block rounded-xl overflow-hidden border border-emerald-200 dark:border-emerald-800 bg-gray-50 dark:bg-slate-800 shadow-xs group cursor-pointer">
                  <img
                    src={attachedMedia}
                    alt="Preview"
                    className="h-32 w-auto object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setIsFullImageZoomed(false);
                      setFullImageModal({
                        url: attachedMedia,
                        authorName: currentUser.name,
                        caption: postContent || 'Attached photo preview'
                      });
                    }}
                    title="Tap to view full image"
                  />
                  <div
                    onClick={() => {
                      setIsFullImageZoomed(false);
                      setFullImageModal({
                        url: attachedMedia,
                        authorName: currentUser.name,
                        caption: postContent || 'Attached photo preview'
                      });
                    }}
                    className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>View Full</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAttachedMedia(null);
                      setAttachedMediaType(null);
                      setAttachedFileName(null);
                    }}
                    className="absolute top-1.5 right-1.5 p-1 bg-gray-950/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer z-10"
                    title="Remove photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Attached Document Preview */}
              {attachedFileName && attachedMediaType === 'document' && (
                <div className="flex items-center justify-between my-2 p-2.5 bg-emerald-50/90 dark:bg-slate-800 rounded-xl border border-emerald-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span className="font-semibold text-emerald-950 dark:text-emerald-200 truncate">{attachedFileName}</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded font-mono">PDF/Doc</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedMedia(null);
                      setAttachedMediaType(null);
                      setAttachedFileName(null);
                    }}
                    className="p-1 text-gray-500 dark:text-slate-400 hover:text-red-600 rounded-full cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* If Poll Type selected */}
              {postType === 'poll' && (
                <div className="space-y-2 my-2 p-3 bg-emerald-50/50 dark:bg-slate-800/60 rounded-xl border border-emerald-100 dark:border-slate-700">
                  <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">Poll Options:</div>
                  {pollOpts.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Option ${idx + 1}...`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...pollOpts];
                        copy[idx] = e.target.value;
                        setPollOpts(copy);
                      }}
                      className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100"
                    />
                  ))}
                  {pollOpts.length < 4 && (
                    <button
                      type="button"
                      onClick={() => setPollOpts([...pollOpts, ''])}
                      className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                    >
                      + Add Option
                    </button>
                  )}
                </div>
              )}

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-slate-800 mt-2">
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setPostType('normal')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                      postType === 'normal' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-semibold' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Standard Post
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostType('question')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      postType === 'question' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-semibold' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Question
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostType('poll')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      postType === 'poll' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-semibold' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    Poll
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostType('achievement')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      postType === 'achievement' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-semibold' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    Achievement
                  </button>

                  {/* Explicit Uploading button (+) requested by user */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-xs rounded-lg font-bold flex items-center gap-1.5 transition-all bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-slate-700 hover:bg-emerald-100 dark:hover:bg-slate-700 cursor-pointer shadow-2xs"
                    title="Upload image, pdf or academic file (+)"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3] text-emerald-700 dark:text-emerald-400" />
                    <span>Upload File (+)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCreatePost}
                  disabled={!postContent.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Publish</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {isLoadingFeed ? (
            <FeedSkeleton count={3} />
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-gray-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm">No posts found in this category yet</h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
                Be the first to share in {categoryFilter.toUpperCase()} or switch categories.
              </p>
              <button
                onClick={() => setCategoryFilter('all')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
              >
                Show All Posts
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-slate-800 shadow-2xs hover:border-emerald-200 dark:hover:border-slate-700 transition-all overflow-hidden break-words">
                {/* Author & Header - Ultra-Modern Mobile & Desktop Layout */}
                <div className="flex items-start justify-between mb-3.5 gap-2.5 sm:gap-3.5">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    {/* Modern Profile Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-11 h-11 sm:w-12 sm:h-12 aspect-square rounded-full object-cover ring-2 ring-emerald-500/30 dark:ring-emerald-400/40 shadow-xs bg-emerald-50 dark:bg-slate-800"
                        onError={(e) => {
                          // Fallback to high-quality generated avatar if link fails
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(post.author.name)}&backgroundColor=047857&textColor=ffffff`;
                        }}
                      />
                      {post.author.verified && (
                        <span 
                          className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full p-0.5 ring-2 ring-white dark:ring-slate-900 shadow-xs" 
                          title="Akaunti Iliyothibitishwa"
                        >
                          <CheckCircle2 className="w-3 h-3 fill-emerald-600 dark:fill-emerald-500 text-white" />
                        </span>
                      )}
                    </div>

                    {/* Author Meta Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white leading-tight tracking-tight hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors truncate max-w-[150px] xs:max-w-[210px] sm:max-w-none">
                          {post.author.name}
                        </span>
                        <span className="text-[10px] sm:text-[11px] bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-md border border-emerald-200/70 dark:border-emerald-800/60 capitalize shrink-0">
                          {post.author.role === 'admin' ? 'Msimamizi' : post.author.role === 'teacher' ? 'Mwalimu' : 'Mwanafunzi'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 dark:text-slate-400 mt-1 flex-wrap leading-tight">
                        <span className="inline-flex items-center gap-1 font-medium text-gray-700 dark:text-slate-300 truncate max-w-[160px] sm:max-w-none">
                          <School className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{post.author.school}</span>
                        </span>
                        <span className="text-gray-300 dark:text-slate-600 font-bold">•</span>
                        <div className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-emerald-700 dark:text-emerald-400 shrink-0">
                          <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{post.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Header Category & Subject Badges */}
                  <div className="flex flex-col items-end gap-1 shrink-0 pt-0.5">
                    {post.category && (
                      <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize shrink-0 tracking-wide border shadow-2xs ${
                        post.category === 'ushauri'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-300/80 dark:border-amber-700/60'
                          : post.category === 'burudani'
                          ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 border-blue-300/80 dark:border-blue-700/60'
                          : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-700/60'
                      }`}>
                        {post.category === 'masomo' ? 'Academics' : post.category === 'ushauri' ? 'Guidance' : post.category === 'burudani' ? 'Campus' : post.category}
                      </span>
                    )}
                    {post.subject && (
                      <span className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-medium px-2 py-0.5 rounded-md border border-gray-200/80 dark:border-slate-700/80 shrink-0">
                        {post.subject}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-gray-800 dark:text-slate-200 leading-relaxed whitespace-pre-line mb-3">
                  {post.content}
                </p>

                {/* Optional Post Media (Image / Document) */}
                {post.mediaUrl && (
                  post.mediaType === 'document' ? (
                    <div className="flex items-center justify-between p-3 mb-3 bg-emerald-50/70 dark:bg-slate-800/80 rounded-xl border border-emerald-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-emerald-950 dark:text-emerald-200">Attached Academic Document</div>
                          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">Format: PDF / Docx</div>
                        </div>
                      </div>
                      <a
                        href={post.mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Download / Open</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <div
                      id={`post-image-${post.id}`}
                      onClick={() => {
                        setIsFullImageZoomed(false);
                        setFullImageModal({
                          url: post.mediaUrl!,
                          authorName: post.author.name,
                          caption: post.content
                        });
                      }}
                      className="group relative rounded-xl overflow-hidden mb-3 border border-gray-100 dark:border-slate-800 max-h-96 cursor-pointer bg-black/5 hover:border-emerald-300 transition-all select-none"
                      title="Tap to view full image"
                    >
                      <img
                        src={post.mediaUrl}
                        alt="Post attachment"
                        className="w-full h-auto object-cover max-h-80 group-hover:scale-[1.01] transition-transform duration-200"
                        loading="lazy"
                      />
                      {/* Interactive pill indicating full image can be opened */}
                      <div className="absolute bottom-2.5 right-2.5 bg-black/75 hover:bg-black/90 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md transition-all">
                        <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View Full</span>
                      </div>
                    </div>
                  )
                )}

                {/* Fully Functional Poll Rendering */}
                {post.type === 'poll' && post.pollOptions && (
                  <div className="space-y-2 mb-3 bg-gray-50/80 dark:bg-slate-800/60 p-3.5 rounded-xl border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <BarChart2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Community Poll ({post.pollOptions.reduce((a, b) => a + b.votes, 0)} votes)</span>
                      </span>
                      {post.userVotedOptionId && (
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                          ✓ Voted
                        </span>
                      )}
                    </div>
                    {post.pollOptions.map((opt) => {
                      const totalVotes = post.pollOptions!.reduce((a, b) => a + b.votes, 0) || 1;
                      const pct = Math.round((opt.votes / totalVotes) * 100);
                      const isVoted = post.userVotedOptionId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onVotePoll(post.id, opt.id)}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all relative overflow-hidden cursor-pointer ${
                            isVoted
                              ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/40 ring-1 ring-emerald-500/40 font-semibold'
                              : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-400 hover:bg-gray-50/50 dark:hover:bg-slate-700 shadow-2xs'
                          }`}
                        >
                          <div
                            className={`absolute left-0 top-0 bottom-0 transition-all duration-300 ${
                              isVoted ? 'bg-emerald-200/60 dark:bg-emerald-800/40' : 'bg-emerald-100/50 dark:bg-slate-700/50'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                          <div className="relative flex justify-between items-center text-xs text-gray-900 dark:text-slate-100">
                            <span className="flex items-center gap-1.5">
                              {isVoted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950 shrink-0" />}
                              <span>{opt.text}</span>
                            </span>
                            <span className="font-mono text-emerald-900 dark:text-emerald-300 font-bold bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded border border-gray-200/60 dark:border-slate-700 text-[11px]">
                              {pct}% ({opt.votes})
                            </span>
                          </div>
                        </button>
                      );
                    })}
                    <div className="text-[10px] text-gray-500 dark:text-slate-400 text-right pt-0.5">
                      Click any option to cast or update your vote
                    </div>
                  </div>
                )}

                {/* Actions Footer: Reactions (Likes), Comments, Share, Save */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-400">
                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Reaction: Like Button */}
                    <button
                      type="button"
                      onClick={() => {
                        onLikePost(post.id);
                        setReactionToast(post.isLiked ? 'Unliked post' : 'Liked this post! ❤️');
                        setTimeout(() => setReactionToast(null), 2000);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                        post.isLiked
                          ? 'text-red-600 bg-red-50 dark:bg-red-950/50 font-bold border border-red-200 dark:border-red-900'
                          : 'hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-slate-800'
                      }`}
                      title={post.isLiked ? 'Unlike' : 'Like this post'}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    {/* Comments Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                        showComments[post.id]
                          ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 font-bold border border-emerald-200 dark:border-emerald-800'
                          : 'hover:text-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-slate-800'
                      }`}
                      title="Toggle comments"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount || (post.comments?.length || 0)} Comments</span>
                    </button>

                    {/* Share Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setShareModalPost(post);
                        onSharePost?.(post.id);
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                      title="Share this post"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{post.sharesCount || 0} Share</span>
                    </button>
                  </div>

                  {/* Save (Bookmark) Button */}
                  <button
                    type="button"
                    onClick={() => {
                      onSavePost(post.id);
                      setReactionToast(post.isSaved ? 'Removed from Bookmarks' : 'Saved to Bookmarks! 🔖');
                      setTimeout(() => setReactionToast(null), 2500);
                    }}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      post.isSaved
                        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 font-bold border border-emerald-200 dark:border-emerald-800'
                        : 'text-gray-500 dark:text-slate-400 hover:text-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-slate-800'
                    }`}
                    title={post.isSaved ? 'Remove Bookmark' : 'Save to Bookmarks'}
                    aria-label="Save"
                  >
                    <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-emerald-700 text-emerald-700 dark:fill-emerald-400 dark:text-emerald-400' : ''}`} />
                  </button>
                </div>

                {/* Inline Comments Section with Full Functionality */}
                {showComments[post.id] && (
                  <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-slate-800 space-y-3">
                    {/* List of Existing Comments */}
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="p-3 bg-gray-50/80 dark:bg-slate-800/70 rounded-xl border border-gray-200/80 dark:border-slate-700 text-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <img
                                  src={comment.author.avatar}
                                  alt={comment.author.name}
                                  className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-300/60"
                                />
                                <span className="font-bold text-gray-900 dark:text-slate-100">{comment.author.name}</span>
                                <span className="text-[10px] text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                  {comment.author.school}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                                <Clock className="w-3 h-3" />
                                <span>{comment.createdAt}</span>
                              </div>
                            </div>
                            <p className="text-gray-800 dark:text-slate-200 pl-8 leading-relaxed mb-1.5">{comment.content}</p>
                            <div className="flex items-center justify-between pl-8 text-[11px] text-gray-500 dark:text-slate-400 pt-1 border-t border-gray-100 dark:border-slate-700">
                              <button
                                type="button"
                                onClick={() => onLikeComment?.(post.id, comment.id)}
                                className={`flex items-center gap-1 cursor-pointer transition-colors ${
                                  comment.isLiked ? 'text-red-500 font-bold' : 'hover:text-red-500'
                                }`}
                              >
                                <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-red-500' : ''}`} />
                                <span>{comment.likes || 0} Like</span>
                              </button>
                              {(comment.author.id === currentUser.id || currentUser.role === 'admin') && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteComment?.(post.id, comment.id)}
                                  className="text-gray-400 hover:text-red-600 text-[10px] cursor-pointer"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 dark:text-slate-500 italic py-1 pl-1">
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    )}

                    {/* New Comment Input Box with File/Image Attachment Upload */}
                    <div className="space-y-1.5 pt-1">
                      {/* Hidden Comment Attachment File Input */}
                      <input
                        type="file"
                        ref={commentFileInputRef}
                        onChange={handleCommentFileUpload}
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                      />

                      {commentAttachments[post.id] && (
                        <div className="flex items-center gap-2 p-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs">
                          {commentAttachments[post.id].type === 'image' ? (
                            <img
                              src={commentAttachments[post.id].url}
                              alt="Attached"
                              className="w-8 h-8 rounded-lg object-cover ring-1 ring-emerald-300 dark:ring-emerald-700 shrink-0"
                            />
                          ) : (
                            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />
                          )}
                          <span className="flex-1 truncate text-[11px] font-medium text-emerald-900 dark:text-emerald-200">
                            {commentAttachments[post.id].name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const copy = { ...commentAttachments };
                              delete copy[post.id];
                              setCommentAttachments(copy);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-lg cursor-pointer"
                            title="Ondoa faili hili"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-emerald-500/40"
                        />
                        <input
                          type="text"
                          placeholder="Andika maoni au jibu lako..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const text = commentInputs[post.id]?.trim() || '';
                              const att = commentAttachments[post.id];
                              if (text || att) {
                                const finalContent = att ? (text ? `${text} 📎 [${att.name}]` : `📎 [${att.name}]`) : text;
                                onAddComment(post.id, finalContent);
                                setCommentInputs({ ...commentInputs, [post.id]: '' });
                                if (att) {
                                  const copy = { ...commentAttachments };
                                  delete copy[post.id];
                                  setCommentAttachments(copy);
                                }
                              }
                            }
                          }}
                          className="flex-1 text-xs p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                        />

                        {/* File Upload Button for Comments */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCommentPostId(post.id);
                            commentFileInputRef.current?.click();
                          }}
                          title="Ambatisha picha au nyaraka kwenye jibu hili"
                          className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl transition-colors shrink-0 cursor-pointer border border-gray-200 dark:border-slate-700"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const text = commentInputs[post.id]?.trim() || '';
                            const att = commentAttachments[post.id];
                            if (text || att) {
                              const finalContent = att ? (text ? `${text} 📎 [${att.name}]` : `📎 [${att.name}]`) : text;
                              onAddComment(post.id, finalContent);
                              setCommentInputs({ ...commentInputs, [post.id]: '' });
                              if (att) {
                                const copy = { ...commentAttachments };
                                delete copy[post.id];
                                setCommentAttachments(copy);
                              }
                            }
                          }}
                          disabled={!commentInputs[post.id]?.trim() && !commentAttachments[post.id]}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs px-3.5 py-2.5 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar Column with Dedicated Scroll */}
      <div className="lg:col-span-4 space-y-4 lg:h-full lg:overflow-y-auto lg:pr-2 lg:custom-scrollbar pb-10 lg:pb-16">
        {/* 1. Enhanced Profile & EduPoints Level Badge & Progress Bar Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200/90 dark:border-slate-800 shadow-xs overflow-hidden ring-1 ring-emerald-100 dark:ring-slate-800">
          {/* Header Cover Bar - Clear and separated, no overlap */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 flex items-center justify-between text-white border-b border-emerald-600/30">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-300/30 flex items-center justify-center shrink-0">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <span className="text-xs font-bold tracking-wide uppercase">
                Your Profile & Rank
              </span>
            </div>
            <span className="text-[11px] bg-white/15 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-semibold border border-white/20">
              {currentUser.role === 'admin' ? 'Administrator' : 'Student'}
            </span>
          </div>

          <div className="p-5 space-y-3.5">
            {/* User Identity Row - Clear, spacious, and non-overlapping */}
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-600/20 dark:ring-emerald-500/30 shadow-xs"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-2xs"></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-slate-100 truncate font-heading">{currentUser.name}</h3>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950 shrink-0" />
                </div>
                <div className="text-xs text-gray-500 dark:text-slate-400 truncate">@{currentUser.handle}</div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium truncate mt-0.5">
                  {currentUser.schoolName}
                </div>
              </div>
            </div>

            {/* School Level & Combination Info Box */}
            <div className="text-xs bg-gray-50/80 dark:bg-slate-800/80 p-3 rounded-xl border border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 dark:text-slate-400 font-semibold uppercase tracking-wider block">Education Level</span>
                <div className="font-semibold text-gray-800 dark:text-slate-200 mt-0.5">
                  {currentUser.level} • {currentUser.combination || 'Science Combination'}
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md">
                Active 🟢
              </span>
            </div>

            {/* Visual EduPoints Level & Progress Bar */}
            <div className="bg-emerald-50/60 dark:bg-slate-800/60 rounded-xl p-3.5 border border-emerald-100/80 dark:border-slate-700 mb-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{edupointsInfo.tier.badge}</span>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-950 dark:text-emerald-300 uppercase tracking-wide">
                      {edupointsInfo.tier.title}
                    </span>
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                      {edupointsInfo.tier.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300 font-mono">
                    {currentUser.points.toLocaleString()}
                  </span>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">EduPoints</div>
                </div>
              </div>

              {/* Visual Progress Track */}
              <div className="w-full bg-emerald-200/60 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden p-0.5 relative mb-1.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700 shadow-2xs"
                  style={{ width: `${edupointsInfo.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                <span>Progress: {edupointsInfo.progressPercent}%</span>
                {edupointsInfo.nextTier ? (
                  <span>{edupointsInfo.pointsToNext} pts to Lvl {edupointsInfo.nextTier.level}</span>
                ) : (
                  <span className="font-bold text-amber-700 dark:text-amber-400">Max Level 👑</span>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-gray-100 dark:border-slate-800 mb-3 text-xs">
              <div>
                <div className="font-bold text-gray-900 dark:text-slate-100">{currentUser.points}</div>
                <div className="text-[10px] text-gray-500 dark:text-slate-400">EduPoints</div>
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-slate-100">{currentUser.followersCount}</div>
                <div className="text-[10px] text-gray-500 dark:text-slate-400">Followers</div>
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-slate-100">{currentUser.followingCount}</div>
                <div className="text-[10px] text-gray-500 dark:text-slate-400">Following</div>
              </div>
            </div>

            {onOpenLeaderboard && (
              <button
                type="button"
                id="homefeed-open-leaderboard-btn"
                onClick={onOpenLeaderboard}
                className="w-full mb-2 bg-gradient-to-r from-amber-50 to-amber-100/90 dark:from-amber-950/40 dark:to-amber-900/40 hover:from-amber-100 hover:to-amber-200/90 text-amber-950 dark:text-amber-200 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-between border border-amber-300 dark:border-amber-700 shadow-2xs cursor-pointer group"
                title="View top students on national leaderboard"
              >
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>National Leaderboard</span>
                </div>
                <span className="text-[10px] bg-amber-600 text-white font-mono font-bold px-1.5 py-0.5 rounded">
                  Top 10
                </span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('profile')}
              className="w-full bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-emerald-200/60 dark:border-emerald-800 cursor-pointer"
            >
              <span>View Full Profile & Certificates</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Today's Buzz 🔥 (Trending Topics & Popular Student Discussions) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-emerald-100 dark:border-slate-800 shadow-xs ring-1 ring-emerald-50 dark:ring-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 font-heading">
                  Today's Buzz 🔥
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-gray-500 dark:text-slate-400">Trending student discussions</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              Tanzania Live
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              {
                id: 'trend-1',
                title: '#NECTA2026: Electromagnetism Controversy (Paper 1)',
                subject: 'Physics',
                discussions: '342 students',
                badge: 'Hot 🔥',
                category: 'masomo' as const
              },
              {
                id: 'trend-2',
                title: '#TCU2026: University Selection Guide & HESLB Loans',
                subject: 'Guidance',
                discussions: '284 students',
                badge: 'Crucial 📌',
                category: 'ushauri' as const
              },
              {
                id: 'trend-3',
                title: '#OrganicChemistry: Reaction Mechanisms of Benzene & Alkyl Halides',
                subject: 'Chemistry',
                discussions: '198 students',
                badge: 'Study 🧪',
                category: 'masomo' as const
              },
              {
                id: 'trend-4',
                title: '#UMISSETA2026: Secondary Schools Sports & Arts Bonanza',
                subject: 'Sports & Arts',
                discussions: '165 students',
                badge: 'Life ⚽',
                category: 'burudani' as const
              },
              {
                id: 'trend-5',
                title: '#SamiaScholarship: Science Studies Funding Applications 2026',
                subject: 'Scholarships',
                discussions: '132 students',
                badge: 'Grants 🎓',
                category: 'ushauri' as const
              }
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setCategoryFilter(item.category);
                }}
                className="p-3 bg-gray-50/70 dark:bg-slate-800/70 hover:bg-emerald-50/80 dark:hover:bg-slate-700/80 rounded-xl cursor-pointer transition-all border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-slate-600 group"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                    {item.subject}
                  </span>
                  <span className="text-[10px] font-semibold text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                </div>
                <div className="font-semibold text-gray-900 dark:text-slate-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors text-xs leading-snug">
                  {item.title}
                </div>
                <div className="flex items-center justify-between mt-1.5 text-[11px] text-gray-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                    <MessageSquare className="w-3 h-3" />
                    {item.discussions}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center font-bold">
                    View &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>

          {onOpenQuickAction && (
            <button
              onClick={() => onOpenQuickAction('post')}
              className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Contribute to Today's Buzz</span>
            </button>
          )}
        </div>

        {/* 3. Quick Study Rooms Shortcut Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-emerald-200 dark:border-slate-800 shadow-md ring-2 ring-emerald-50 dark:ring-slate-800">
          <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Study Rooms & Discussions
          </h3>
          <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
            Connect with PCB, PCM, CBG, HGL and university students across Tanzania to discuss tough questions and share study materials.
          </p>
          <button
            onClick={() => onNavigateTab('study')}
            className="mt-3.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Join Study Rooms</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. Featured Schools */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-emerald-100 dark:border-slate-800 shadow-xs">
          <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <School className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Featured Schools on EduKan
          </h3>
          <div className="space-y-3 text-xs">
            {schools.slice(0, 3).map((sch) => (
              <div key={sch.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={sch.logo} alt={sch.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-slate-100 truncate max-w-[140px]">{sch.name}</div>
                    <div className="text-[10px] text-gray-500 dark:text-slate-400">{sch.region} • {sch.studentCount} students</div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('schools')}
                  className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-[11px] font-semibold px-2.5 py-1 rounded-lg cursor-pointer"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Reaction / Bookmark Notification Toast */}
      {reactionToast && (
        <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 dark:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{reactionToast}</span>
        </div>
      )}

      {/* Share Post Modal */}
      {shareModalPost && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Share Academic Post</h3>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Share with classmates or across networks</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShareModalPost(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Post Preview Snippet */}
            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700 text-xs">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-gray-900 dark:text-slate-100">
                <img
                  src={shareModalPost.author.avatar}
                  alt={shareModalPost.author.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{shareModalPost.author.name}</span>
                <span className="text-[10px] text-gray-400 font-normal">({shareModalPost.author.school})</span>
              </div>
              <p className="text-gray-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                "{shareModalPost.content}"
              </p>
            </div>

            {/* Share Destination Options */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  const shareText = `EduKan Tanzania: "${shareModalPost.content.slice(0, 100)}..." by ${shareModalPost.author.name} (${shareModalPost.author.school}). Check it out on EduKan!`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + window.location.href)}`, '_blank');
                  onSharePost?.(shareModalPost.id);
                  setShareModalPost(null);
                  setReactionToast('Opened WhatsApp!');
                  setTimeout(() => setReactionToast(null), 2500);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 font-semibold text-xs transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">💬</span>
                  <span>Share via WhatsApp (Class or Friend)</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const shareText = `EduKan: "${shareModalPost.content.slice(0, 100)}..." by ${shareModalPost.author.name}`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                  onSharePost?.(shareModalPost.id);
                  setShareModalPost(null);
                  setReactionToast('Opened X (Twitter)!');
                  setTimeout(() => setReactionToast(null), 2500);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-950 dark:text-sky-200 font-semibold text-xs transition-colors cursor-pointer border border-sky-200 dark:border-sky-800"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🐦</span>
                  <span>Share to X (Twitter)</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-sky-700 dark:text-sky-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  onSharePost?.(shareModalPost.id);
                  setShareModalPost(null);
                  setReactionToast('Post link copied to clipboard! 📋');
                  setTimeout(() => setReactionToast(null), 2500);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer border border-gray-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                  <span>Copy Link</span>
                </div>
                <span className="text-[10px] text-gray-400">Click to copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Lightbox Modal with Pan and Zoom to every corner */}
      <ImageViewerModal
        isOpen={Boolean(fullImageModal)}
        onClose={() => setFullImageModal(null)}
        imageData={fullImageModal}
      />
    </div>
  );
};

