import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Sparkles,
  Send,
  Star,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Bug,
  Smile,
  ShieldCheck,
  School
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  currentRole: UserRole;
  onSuccessToast?: (msg: string) => void;
}

export interface UserFeedbackSubmission {
  id: string;
  category: 'feature' | 'bug' | 'ux' | 'content' | 'general';
  rating: number;
  subject: string;
  message: string;
  authorName: string;
  authorRole: UserRole;
  authorSchool: string;
  authorEmail?: string;
  createdAt: string;
  status: 'new' | 'reviewed';
}

const FEEDBACK_CATEGORIES = [
  { id: 'feature', label: 'Feature Request / Idea', icon: Lightbulb, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' },
  { id: 'bug', label: 'Report Bug / Issue', icon: Bug, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800' },
  { id: 'ux', label: 'Mobile UX & Design', icon: Smile, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800' },
  { id: 'content', label: 'Books & Exam Materials', icon: Sparkles, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800' },
  { id: 'general', label: 'General Feedback & Praise', icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' },
] as const;

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentRole,
  onSuccessToast
}) => {
  const [category, setCategory] = useState<'feature' | 'bug' | 'ux' | 'content' | 'general'>('feature');
  const [rating, setRating] = useState<number>(5);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(currentUser.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    const submission: UserFeedbackSubmission = {
      id: `fb-${Date.now()}`,
      category,
      rating,
      subject: subject.trim() || 'User Feedback',
      message: message.trim(),
      authorName: currentUser.name,
      authorRole: currentRole,
      authorSchool: currentUser.schoolName,
      authorEmail: email.trim(),
      createdAt: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'new'
    };

    try {
      const stored = localStorage.getItem('edukan_user_feedbacks');
      const list: UserFeedbackSubmission[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('edukan_user_feedbacks', JSON.stringify([submission, ...list]));
    } catch (err) {
      console.warn('Failed to persist feedback', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccessToast) {
        onSuccessToast('Thank you! Your feedback has been successfully submitted to the EduKan team (+10 pts).');
      }
    }, 600);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setSubject('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="feedback-modal-container"
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-5 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-emerald-300 shadow-xs">
              <MessageSquare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-bold flex items-center gap-2">
                <span>Submit Feedback & Ideas</span>
                <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.5 rounded-full uppercase">
                  +10 Pts
                </span>
              </h2>
              <p className="text-xs text-emerald-200/90">
                Help us improve EduKan for students across Tanzania
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="relative z-10 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative aura */}
          <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 bg-white dark:bg-slate-900">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-slate-100">
                Thank You for Your Feedback!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your feedback has been received by the EduKan administration team. We greatly appreciate your contribution to improving student learning.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleResetAndClose}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  Close This Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Pills */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">
                  Select Feedback Category:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FEEDBACK_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-2xs font-bold'
                            : 'border-gray-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating */}
              <div className="bg-gray-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-gray-200/80 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-800 dark:text-slate-200">How is your experience with EduKan?</div>
                  <div className="text-[11px] text-gray-500 dark:text-slate-400">Rate from 1 to 5 stars</div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-gray-300 hover:text-amber-400 focus:outline-none transition-colors cursor-pointer"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                  Feedback Subject (Brief):
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Add offline download mode for study materials..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Detailed Message */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                  Full Details of Your Feedback:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what you would like improved, an issue you encountered, or how EduKan helps you..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all resize-none text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Author Preview Details */}
              <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <School className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span className="font-semibold truncate max-w-[200px]">{currentUser.name} • {currentUser.schoolName}</span>
                </div>
                <span className="text-[10px] bg-emerald-200/80 dark:bg-emerald-900/80 font-bold px-2 py-0.5 rounded-full text-emerald-950 dark:text-emerald-200">
                  {currentRole === 'admin' ? 'Admin' : 'Student'}
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Feedback Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
