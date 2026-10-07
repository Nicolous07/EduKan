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
  ShieldCheck,
  Settings,
  MessageSquare,
  FileText,
  AlertTriangle,
  SlidersHorizontal,
  Volume2,
  Send
} from 'lucide-react';
import { AppNotification } from '../types';
import { getAuthHeaders, getAuthToken } from '../lib/authService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onNotificationClick: (notif: AppNotification) => void;
  onNavigateTab?: (tab: string) => void;
}

export const NotificationsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onNotificationClick,
  onNavigateTab
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'preferences'>('all');
  const [preferences, setPreferences] = useState({
    newPosts: true,
    announcements: true,
    newMessages: true,
    studyMaterials: true,
    pushEnabled: false
  });
  const [pushStatus, setPushStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [prefSaveMsg, setPrefSaveMsg] = useState<string | null>(null);

  // Check browser push notification support & current permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    } else {
      setPushStatus('unsupported');
    }
  }, [isOpen]);

  // Load preferences from server
  useEffect(() => {
    if (isOpen && getAuthToken()) {
      fetch('/api/notifications/preferences', { headers: getAuthHeaders() })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.preferences) {
            setPreferences(data.preferences);
          }
        })
        .catch(err => console.warn('Could not load notification preferences:', err));
    }
  }, [isOpen]);

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

  const handleRequestPushPermission = async () => {
    if (!('Notification' in window)) {
      alert('Kivinjari hiki hakitumii arifa za kivinjari (Push Notifications).');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission);
      if (permission === 'granted') {
        new Notification('Edu-Kan Tanzania', {
          body: 'Arifa za kivinjari zimewezeshwa kikamilifu! Utapokea taarifa za mitihani, machapisho na soga.',
          icon: '/favicon.ico'
        });
        setPreferences(p => ({ ...p, pushEnabled: true }));
        handleSavePreferences({ ...preferences, pushEnabled: true });
      }
    } catch (err) {
      console.warn('Notification permission request error:', err);
    }
  };

  const handleSavePreferences = async (newPrefs = preferences) => {
    try {
      const res = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newPrefs)
      });
      if (res.ok) {
        setPrefSaveMsg('Mipangilio imehifadhiwa kikamilifu!');
        setTimeout(() => setPrefSaveMsg(null), 3000);
      }
    } catch (err) {
      console.warn('Failed to save notification preferences:', err);
    }
  };

  const getNotificationIcon = (notif: AppNotification) => {
    const t = ((notif.title || '') + ' ' + (notif.message || '') + ' ' + (notif.category || '')).toLowerCase();
    if (t.includes('message') || t.includes('ujumbe') || t.includes('soga')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
          <MessageSquare className="w-4 h-4 stroke-[2.5]" />
        </div>
      );
    }
    if (t.includes('announcement') || t.includes('tangazo') || t.includes('admin')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
          <Volume2 className="w-4 h-4 stroke-[2.5]" />
        </div>
      );
    }
    if (t.includes('material') || t.includes('kitabu') || t.includes('past paper') || t.includes('library')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 stroke-[2.5]" />
        </div>
      );
    }
    if (t.includes('post') || t.includes('chapisho')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
          <Send className="w-4 h-4 stroke-[2.5]" />
        </div>
      );
    }
    if (t.includes('point') || t.includes('zawadi')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
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
                  Notification Center
                </h3>
                <p className="text-[10px] text-gray-500 dark:text-slate-400">
                  {unreadCount > 0 ? `${unreadCount} unread • Real-time DB sync` : 'All caught up • 0 unread'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && filter !== 'preferences' && (
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
                onClick={() => setFilter(filter === 'preferences' ? 'all' : 'preferences')}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  filter === 'preferences'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                    : 'text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
                title="Notification Preferences & Push"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
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
            <button
              onClick={() => setFilter('preferences')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                filter === 'preferences'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Preferences</span>
            </button>
          </div>
        </div>

        {/* Preferences Tab (Req 30 & 31) */}
        {filter === 'preferences' ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {prefSaveMsg && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{prefSaveMsg}</span>
              </div>
            )}

            {/* Browser Push Notifications (Req 30) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 border border-emerald-100 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    🔔
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Browser Push Notifications</h4>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400">
                      Status: <span className="font-semibold text-emerald-700 dark:text-emerald-400">{pushStatus}</span>
                    </p>
                  </div>
                </div>
                {pushStatus !== 'granted' ? (
                  <button
                    onClick={handleRequestPushPermission}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] transition-all cursor-pointer shadow-xs"
                  >
                    Enable Push
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-600 dark:text-slate-300 leading-relaxed">
                Receive instant alerts on your device for incoming private messages, official national announcements, and study material uploads.
              </p>
            </div>

            {/* Category Preferences (Req 31) */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
                Notification Categories
              </h4>

              <div className="space-y-2">
                {[
                  { key: 'newMessages', label: 'New Direct Messages', desc: 'Alerts when classmates or teachers message you' },
                  { key: 'announcements', label: 'Admin Announcements', desc: 'System updates and official notices from Edu-Kan' },
                  { key: 'newPosts', label: 'New Community Posts', desc: 'Important questions and discussions in the feed' },
                  { key: 'studyMaterials', label: 'New Study Materials', desc: 'Newly uploaded NECTA past papers and TIE textbooks' }
                ].map(item => (
                  <div key={item.key} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{item.label}</div>
                      <div className="text-[11px] text-gray-500 dark:text-slate-400">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(preferences as any)[item.key]}
                        onChange={e => {
                          const updated = { ...preferences, [item.key]: e.target.checked };
                          setPreferences(updated);
                          handleSavePreferences(updated);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Notifications List */
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
                  Notifications will appear here when new posts, messages, announcements, or study materials are added.
                </p>
              </div>
            ) : (
              displayedNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    // Mark as read on server
                    if (!notif.read && getAuthToken()) {
                      fetch(`/api/notifications/${notif.id}/read`, {
                        method: 'POST',
                        headers: getAuthHeaders()
                      }).catch(() => {});
                    }

                    // Contextual navigation
                    const t = ((notif.title || '') + ' ' + (notif.message || '')).toLowerCase();
                    if (t.includes('message') || t.includes('ujumbe') || t.includes('soga')) {
                      if (onNavigateTab) onNavigateTab('schools');
                    } else if (t.includes('material') || t.includes('kitabu') || t.includes('paper') || t.includes('library')) {
                      if (onNavigateTab) onNavigateTab('library');
                    } else if (t.includes('announcement') || t.includes('tangazo')) {
                      if (onNavigateTab) onNavigateTab('feed');
                    } else if (t.includes('post') || t.includes('chapisho')) {
                      if (onNavigateTab) onNavigateTab('feed');
                    }

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
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold group-hover:underline flex items-center gap-0.5 ml-auto">
                        Fungua <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-2.5 bg-gray-50/90 dark:bg-slate-800/90 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400">
          <span className="text-emerald-800 dark:text-emerald-400 font-semibold">Edu-Kan Tanzania Database Sync</span>
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
