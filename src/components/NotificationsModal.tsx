import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  Sparkles,
  X,
  BookOpen,
  School,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AppNotification } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onNotificationClick: (notif: AppNotification) => void;
}

export const NotificationsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onNotificationClick
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const getNotificationIcon = (notif: AppNotification) => {
    const t = (notif.title + ' ' + notif.message).toLowerCase();
    if (t.includes('edupoint') || t.includes('pointi') || t.includes('zawadi')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
        </div>
      );
    }
    if (t.includes('jibu') || t.includes('swali') || t.includes('physics') || t.includes('hisabati')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
          <BookOpen className="w-4 h-4 stroke-[2.5]" />
        </div>
      );
    }
    if (t.includes('shule') || t.includes('mwalimu') || t.includes('mkuu')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <School className="w-4 h-4 stroke-[2.5]" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
        <Bell className="w-4 h-4 stroke-[2.5]" />
      </div>
    );
  };

  return (
    <div
      id="instant-notifications-overlay"
      className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-start justify-center sm:justify-end pt-6 sm:pt-16 px-3 sm:px-8 pointer-events-auto"
      onClick={onClose}
    >
      <div
        id="instant-notifications-panel"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-3 duration-150 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-emerald-50/50 via-white to-teal-50/40 dark:from-slate-850 dark:via-slate-900 dark:to-slate-850">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shadow-2xs">
                <Bell className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-slate-100 text-sm leading-tight">
                  Your Notifications
                </h3>
                <p className="text-[10px] text-gray-500 dark:text-slate-400">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up, none unread'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-50 dark:hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Mark all notifications as read"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Read</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close notifications"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mt-3 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                filter === 'unread'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  filter === 'unread' ? 'bg-white text-emerald-700' : 'bg-red-500 text-white'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800 p-2 space-y-1">
          {displayedNotifications.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-800 dark:text-slate-200">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications right now'}
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 max-w-xs mx-auto">
                Notifications will appear here when someone answers your question or when new opportunities are posted.
              </p>
            </div>
          ) : (
            displayedNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onNotificationClick(notif);
                  onClose();
                }}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 relative group ${
                  !notif.read
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/30 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                {getNotificationIcon(notif)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-slate-100 leading-snug group-hover:text-emerald-800 dark:group-hover:text-emerald-400 truncate">
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{notif.timestamp}</span>
                    {notif.actionTab && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold group-hover:underline flex items-center gap-0.5">
                          View <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-gray-50/90 dark:bg-slate-800/90 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400">
          <span className="text-emerald-800 dark:text-emerald-400 font-semibold">EduKan TZ</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 font-medium cursor-pointer"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};

