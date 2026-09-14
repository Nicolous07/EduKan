import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  Trash2,
  Search,
  Filter,
  Lightbulb,
  Bug,
  Smile,
  Sparkles,
  School,
  Mail,
  User,
  Clock,
  Send,
  AlertCircle,
  RefreshCw,
  Eye,
  Check,
  Award
} from 'lucide-react';
import { UserFeedbackSubmission } from '../FeedbackModal';
import { UserProfile } from '../../types';

interface AdminFeedbackTabProps {
  currentUser: UserProfile;
  onSendNoticeReply?: (authorName: string, message: string) => void;
  onTriggerToast: (msg: string) => void;
}

const INITIAL_DEMO_FEEDBACKS: UserFeedbackSubmission[] = [
  {
    id: 'fb-demo-01',
    category: 'feature',
    rating: 5,
    subject: 'Vitabu vya Mtaala Mpya wa O-Level 2026',
    message: 'Mfumo wa kusoma vitabu offline unafanya kazi vizuri sana hata nikiwa kijijini bila bundle! Ningependa kuomba muongeze vitabu na past papers za mtaala mpya wa O-Level 2026 kwenye Maktaba.',
    authorName: 'Juma Selemani Mfinanga',
    authorRole: 'student',
    authorSchool: 'Kibaha Secondary School',
    authorEmail: 'juma.mfinanga@kibaha.edu.tz',
    createdAt: '12 Machi 2026, 10:45 Jioni',
    status: 'new'
  },
  {
    id: 'fb-demo-02',
    category: 'content',
    rating: 5,
    subject: 'Ombi la Video Tutorials fupi za Practical za Sayansi',
    message: 'Napongeza sana ubunifu wa mtandao huu kwa wanafunzi na walimu Tanzania. Tunaomba muweke sehemu ya video fupi za majaribio ya maabara (Chemistry & Physics practicals) ili kuwasaidia wanafunzi wa kidato cha 4 na 6.',
    authorName: 'Mwl. Happiness Msigwa',
    authorRole: 'admin',
    authorSchool: 'Ilala Secondary School',
    authorEmail: 'msigwa.h@ilalasec.tz',
    createdAt: '11 Machi 2026, 03:20 Mchana',
    status: 'new'
  },
  {
    id: 'fb-demo-03',
    category: 'general',
    rating: 5,
    subject: 'Pongezi nyingi kwa Timu ya Nicolous Munisi & EduKan',
    message: 'Programu hii imebadilisha kabisa jinsi tunavyojadili maswali ya PCB. Kitufe cha kuuliza swali na kumpa mtu points kinawapa wanafunzi motisha kubwa ya kusoma kwa bidii.',
    authorName: 'Baraka John Mlay',
    authorRole: 'student',
    authorSchool: 'Tabora Boys High School',
    authorEmail: 'baraka.mlay@taboraboys.tz',
    createdAt: '10 Machi 2026, 08:15 Asubuhi',
    status: 'reviewed'
  },
  {
    id: 'fb-demo-04',
    category: 'ux',
    rating: 4,
    subject: 'Muonekano kwenye simu ndogo (Phone View)',
    message: 'Kwenye simu za mkononi muonekano ulikuwa na scrollbar iliyokuwa inatokea pembeni. Napendekeza skrini ya simu iwe safi kabisa bila kupoteza nafasi. Asanteni kwa maboresho ya hivi punde!',
    authorName: 'Ashura Khamis Ali',
    authorRole: 'student',
    authorSchool: 'Kilakala High School (Mwanafunzi/Mzazi)',
    authorEmail: 'ashura.khamis@gmail.com',
    createdAt: '09 Machi 2026, 01:10 Mchana',
    status: 'reviewed'
  }
];

export const AdminFeedbackTab: React.FC<AdminFeedbackTabProps> = ({
  currentUser,
  onSendNoticeReply,
  onTriggerToast
}) => {
  const [feedbacks, setFeedbacks] = useState<UserFeedbackSubmission[]>(() => {
    try {
      const stored = localStorage.getItem('edukan_user_feedbacks');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with demo if needed or return parsed
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading stored feedbacks', e);
    }
    return INITIAL_DEMO_FEEDBACKS;
  });

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'feature' | 'bug' | 'ux' | 'content' | 'general'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'reviewed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingFeedback, setReplyingFeedback] = useState<UserFeedbackSubmission | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Persist to localStorage whenever feedbacks state changes
  const saveFeedbacksToStorage = (updatedList: UserFeedbackSubmission[]) => {
    setFeedbacks(updatedList);
    try {
      localStorage.setItem('edukan_user_feedbacks', JSON.stringify(updatedList));
    } catch (err) {
      console.warn('Failed to save feedbacks', err);
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = feedbacks.map(f => {
      if (f.id === id) {
        const newStatus: 'new' | 'reviewed' = f.status === 'new' ? 'reviewed' : 'new';
        return { ...f, status: newStatus };
      }
      return f;
    });
    saveFeedbacksToStorage(updated);
    onTriggerToast('Feedback status updated!');
  };

  const handleDelete = (id: string, author: string) => {
    if (window.confirm(`Are you sure you want to delete feedback from ${author}?`)) {
      const filtered = feedbacks.filter(f => f.id !== id);
      saveFeedbacksToStorage(filtered);
      onTriggerToast(`Feedback from ${author} has been deleted.`);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingFeedback || !replyMessage.trim()) return;

    if (onSendNoticeReply) {
      onSendNoticeReply(replyingFeedback.authorName, replyMessage.trim());
    }

    // Mark as reviewed
    const updated = feedbacks.map(f =>
      f.id === replyingFeedback.id ? { ...f, status: 'reviewed' as const } : f
    );
    saveFeedbacksToStorage(updated);

    onTriggerToast(`Response sent to ${replyingFeedback.authorName}! ✉️`);
    setReplyingFeedback(null);
    setReplyMessage('');
  };

  // Filtered List
  const filteredFeedbacks = feedbacks.filter(f => {
    if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchSubject = f.subject.toLowerCase().includes(q);
      const matchMessage = f.message.toLowerCase().includes(q);
      const matchAuthor = f.authorName.toLowerCase().includes(q);
      const matchSchool = (f.authorSchool || '').toLowerCase().includes(q);
      if (!matchSubject && !matchMessage && !matchAuthor && !matchSchool) return false;
    }
    return true;
  });

  // Analytics
  const totalCount = feedbacks.length;
  const newCount = feedbacks.filter(f => f.status === 'new').length;
  const reviewedCount = feedbacks.filter(f => f.status === 'reviewed').length;
  const featureCount = feedbacks.filter(f => f.category === 'feature').length;
  const avgRating = totalCount > 0
    ? (feedbacks.reduce((acc, curr) => acc + (curr.rating || 5), 0) / totalCount).toFixed(1)
    : '5.0';

  const categoryBadges: Record<string, { label: string; color: string; icon: any }> = {
    feature: { label: 'Feature Request', color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800', icon: Lightbulb },
    bug: { label: 'Bug Report', color: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800', icon: Bug },
    ux: { label: 'UI / UX', color: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800', icon: Smile },
    content: { label: 'Content & Material', color: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800', icon: Sparkles },
    general: { label: 'General Feedback', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800', icon: MessageSquare }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-gray-900 dark:text-white text-lg tracking-tight">
                User Feedback & Community Suggestions
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Manage suggestions, complaints, compliments, and feature requests from students, teachers, and parents nationwide.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const stored = localStorage.getItem('edukan_user_feedbacks');
              if (stored) setFeedbacks(JSON.parse(stored));
              onTriggerToast('Feedback data refreshed from local storage!');
            }}
            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Refresh Feedback Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-slate-400">Total Feedback</span>
            <MessageSquare className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-heading text-gray-900 dark:text-white">{totalCount}</span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">submitted</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/50 dark:from-amber-950/20 to-white dark:to-slate-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-900 dark:text-amber-400">Unread Feedback</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-heading text-amber-800 dark:text-amber-300">{newCount}</span>
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">awaiting review</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-slate-400">Average Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-heading text-gray-900 dark:text-white">{avgRating}</span>
            <span className="text-[11px] text-gray-500 dark:text-slate-400">/ 5.0</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-slate-400">Feature Requests</span>
            <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-heading text-emerald-700 dark:text-emerald-400">{featureCount}</span>
            <span className="text-[11px] text-gray-500 dark:text-slate-400">ideas</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by subject, content or school..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-gray-900 dark:text-white"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
          {(['all', 'feature', 'bug', 'ux', 'content', 'general'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300'
              }`}
            >
              {cat === 'all' && 'All Categories'}
              {cat === 'feature' && '💡 Features'}
              {cat === 'bug' && '🐛 Bugs'}
              {cat === 'ux' && '📱 UI / UX'}
              {cat === 'content' && '📚 Content'}
              {cat === 'general' && '💬 General'}
            </button>
          ))}
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'all' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-2xs' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All ({feedbacks.length})
          </button>
          <button
            onClick={() => setStatusFilter('new')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'new' ? 'bg-amber-600 text-white shadow-2xs' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            New ({newCount})
          </button>
          <button
            onClick={() => setStatusFilter('reviewed')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'reviewed' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Reviewed ({reviewedCount})
          </button>
        </div>
      </div>

      {/* Feedback Submissions List */}
      <div className="space-y-3.5">
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-slate-800 shadow-2xs">
            <MessageSquare className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3 animate-pulse" />
            <h3 className="font-heading font-bold text-gray-800 dark:text-slate-200 text-base">No Feedback Found</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              There is no feedback matching your filter criteria at this time. Try adjusting your search query or filters.
            </p>
          </div>
        ) : (
          filteredFeedbacks.map((fb) => {
            const badge = categoryBadges[fb.category] || categoryBadges.general;
            const CategoryIcon = badge.icon;

            return (
              <div
                key={fb.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all shadow-2xs ${
                  fb.status === 'new'
                    ? 'border-amber-300 dark:border-amber-700/60 ring-2 ring-amber-400/20 bg-gradient-to-r from-amber-50/20 dark:from-amber-950/20 to-white dark:to-slate-900'
                    : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Feedback Top Meta Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Category Pill */}
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                      <CategoryIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>

                    {/* Status Pill */}
                    {fb.status === 'new' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        New
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        Reviewed
                      </span>
                    )}

                    {/* Rating Stars */}
                    <div className="flex items-center gap-0.5 ml-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= fb.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-200 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Submission Time */}
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{fb.createdAt}</span>
                  </div>
                </div>

                {/* Feedback Content */}
                <div className="pt-3">
                  <h4 className="font-heading font-bold text-gray-900 dark:text-white text-sm sm:text-base leading-snug">
                    {fb.subject}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 mt-1.5 leading-relaxed whitespace-pre-line bg-gray-50/60 dark:bg-slate-800/60 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800">
                    "{fb.message}"
                  </p>
                </div>

                {/* Author Info & Actions */}
                <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                      {fb.authorName.charAt(0)}
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span>{fb.authorName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 font-normal">
                          {fb.authorRole === 'student' ? 'Student' : fb.authorRole === 'teacher' ? 'Teacher' : fb.authorRole === 'parent' ? 'Parent' : 'User'}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        {fb.authorSchool && (
                          <span className="flex items-center gap-1">
                            <School className="w-3 h-3 text-gray-400" />
                            {fb.authorSchool}
                          </span>
                        )}
                        {fb.authorEmail && (
                          <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                            <Mail className="w-3 h-3" />
                            {fb.authorEmail}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleToggleStatus(fb.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        fb.status === 'new'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{fb.status === 'new' ? 'Mark Reviewed' : 'Mark as New'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setReplyingFeedback(fb);
                        setReplyMessage(`Dear ${fb.authorName},\n\nThank you for reaching out with your feedback regarding "${fb.subject}". The EduKan administration team has received your suggestion and we are actively evaluating it for upcoming platform enhancements.\n\nWarm regards,\nNicolous Munisi\nLead Administrator, EduKan Tanzania`);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Send className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>Reply</span>
                    </button>

                    <button
                      onClick={() => handleDelete(fb.id, fb.authorName)}
                      className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                      title="Delete this feedback"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply Notice Modal */}
      {replyingFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-amber-50 dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm font-heading">
                    Reply to Feedback from {replyingFeedback.authorName}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Subject: {replyingFeedback.subject}</p>
                </div>
              </div>
              <button
                onClick={() => setReplyingFeedback(null)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendReply} className="p-6 space-y-4 text-xs text-gray-800 dark:text-slate-200">
              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">
                  Response Message (Admin Notice / Official Dispatch):
                </label>
                <textarea
                  rows={6}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs leading-relaxed text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setReplyingFeedback(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Official Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
