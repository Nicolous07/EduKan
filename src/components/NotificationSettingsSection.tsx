import React, { useState } from 'react';
import {
  Bell,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Send,
  Eye,
  Info,
  Clock,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { UserProfile, NotificationSettings } from '../types';
import { sendTestNotificationEmail, getEmailOutbox, EmailLogEntry } from '../services/emailService';
import { EmailTemplatePreviewModal } from './EmailTemplatePreviewModal';

interface Props {
  user: UserProfile;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
}

export const NotificationSettingsSection: React.FC<Props> = ({ user, onUpdateProfile }) => {
  // Initialize notification settings from user or localStorage with safe defaults
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    if (user.notificationSettings) {
      return user.notificationSettings;
    }
    try {
      const stored = localStorage.getItem(`edukan_notification_settings_${user.id}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      emailRegistrationConfirmations: true,
      emailSystemAnnouncements: true,
      emailNewMessages: true,
      emailAcademicAlerts: true,
      updatedAt: new Date().toISOString()
    };
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [testType, setTestType] = useState<'registration' | 'announcement' | 'message'>('registration');
  const [outboxList, setOutboxList] = useState<EmailLogEntry[]>(() => getEmailOutbox());

  const handleToggle = (key: keyof NotificationSettings) => {
    const updated: NotificationSettings = {
      ...settings,
      [key]: !settings[key],
      updatedAt: new Date().toISOString()
    };

    setSettings(updated);

    try {
      localStorage.setItem(`edukan_notification_settings_${user.id}`, JSON.stringify(updated));
    } catch {}

    if (onUpdateProfile) {
      onUpdateProfile({ notificationSettings: updated });
    }

    setToastMessage('Mipangilio ya barua pepe imehifadhiwa kikamilifu!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    setToastMessage(null);
    try {
      const result = await sendTestNotificationEmail({
        user,
        type: testType
      });
      setToastMessage(result.message);
      setOutboxList(getEmailOutbox());
    } catch (err: any) {
      setToastMessage('Imeshindwa kutuma jaribio la barua pepe. Jaribu tena.');
    } finally {
      setIsSendingTest(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  return (
    <div id="notification-settings-section" className="space-y-6">
      {/* Toast alert banner */}
      {toastMessage && (
        <div className="bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-lg border border-emerald-500 flex items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs text-emerald-200 hover:text-white underline cursor-pointer"
          >
            Funga
          </button>
        </div>
      )}

      {/* Main Notification Settings Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                <span>Mipangilio ya Barua Pepe & Arifa (Notification Settings)</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Chagua aina za barua pepe unazotaka kupokea kwenye anwani yako ya <strong>{user.email || 'Haijawekwa'}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Tazama Miundo ya Barua Pepe (HTML Templates)</span>
            </button>
          </div>
        </div>

        {/* Email Recipient Info Box */}
        <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-emerald-50/40 dark:from-slate-800/80 dark:via-emerald-950/30 dark:to-slate-800/80 rounded-xl p-4 border border-emerald-200/80 dark:border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 dark:text-slate-100">Anwani ya Barua Pepe:</span>
                <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {user.email || 'Haijawekwa'}
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                  Hai (Active)
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                Taarifa za usajili pia hutumwa kiotomatiki kwa Msimamizi Mkuu (<strong className="text-gray-700 dark:text-slate-300">nicolousmunisi07@gmail.com</strong>).
              </p>
            </div>
          </div>
          <div className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>Ilihaririwa: {new Date(settings.updatedAt || Date.now()).toLocaleDateString('sw-TZ')}</span>
          </div>
        </div>

        {/* The 4 Email Toggles */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Aina za Arifa za Barua Pepe
          </h4>

          {/* 1. Registration Confirmation */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-colors bg-gray-50/50 dark:bg-slate-800/40">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base">🎓</span>
                <label
                  htmlFor="toggle-registration"
                  className="text-xs sm:text-sm font-bold text-gray-900 dark:text-slate-100 cursor-pointer"
                >
                  Uthibitisho wa Usajili & Usalama wa Akaunti (Registration Confirmations)
                </label>
                {settings.emailRegistrationConfirmations && (
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                    Inapokelewa
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed max-w-2xl pl-6">
                Pokea barua pepe yenye uthibitisho wa akaunti yako ya EduKan, namba yako ya usajili wa mwanafunzi (Reg No), shule yako, na pointi za mwanzo pindi unapojiandikisha au kuboresha wasifu.
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              id="toggle-registration"
              type="button"
              role="switch"
              aria-checked={settings.emailRegistrationConfirmations}
              onClick={() => handleToggle('emailRegistrationConfirmations')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
                settings.emailRegistrationConfirmations ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.emailRegistrationConfirmations ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2. System Announcements */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-colors bg-gray-50/50 dark:bg-slate-800/40">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base">📢</span>
                <label
                  htmlFor="toggle-announcements"
                  className="text-xs sm:text-sm font-bold text-gray-900 dark:text-slate-100 cursor-pointer"
                >
                  Matangazo & Maboresho Rasmi ya Mfumo (System Announcements & Updates)
                </label>
                {settings.emailSystemAnnouncements && (
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                    Inapokelewa
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed max-w-2xl pl-6">
                Pokea taarifa rasmi za kitaifa, kuongezwa kwa mitihani mipya ya NECTA na vitabu vya kiada vya TIE kwenye Maktaba, pamoja na maboresho ya vipengele vya kujisomea.
              </p>
            </div>

            <button
              id="toggle-announcements"
              type="button"
              role="switch"
              aria-checked={settings.emailSystemAnnouncements}
              onClick={() => handleToggle('emailSystemAnnouncements')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
                settings.emailSystemAnnouncements ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.emailSystemAnnouncements ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 3. New Messages */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-colors bg-gray-50/50 dark:bg-slate-800/40">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base">💬</span>
                <label
                  htmlFor="toggle-messages"
                  className="text-xs sm:text-sm font-bold text-gray-900 dark:text-slate-100 cursor-pointer"
                >
                  Tahadhari ya Ujumbe Mpya & Maswali ya Masomo (New Message Alerts)
                </label>
                {settings.emailNewMessages && (
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                    Inapokelewa
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed max-w-2xl pl-6">
                Pokea barua pepe ya haraka pindi mwalimu, mshauri wa masomo au mwanafunzi anapokutumia ujumbe wa faragha au kujibu swali lako kwenye vyumba vya masomo.
              </p>
            </div>

            <button
              id="toggle-messages"
              type="button"
              role="switch"
              aria-checked={settings.emailNewMessages}
              onClick={() => handleToggle('emailNewMessages')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
                settings.emailNewMessages ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.emailNewMessages ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. Academic & Scholarships Alerts */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-colors bg-gray-50/50 dark:bg-slate-800/40">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base">⭐</span>
                <label
                  htmlFor="toggle-academic"
                  className="text-xs sm:text-sm font-bold text-gray-900 dark:text-slate-100 cursor-pointer"
                >
                  Fursa za Ufadhili wa Masomo & Vyuo (Scholarships & Career Opportunities)
                </label>
                {settings.emailAcademicAlerts && (
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                    Inapokelewa
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed max-w-2xl pl-6">
                Pata taarifa za mapema za nafasi za udhamini wa serikali na mashirika (Samia Scholarship, HESLB, MasterCard Foundation) na mafunzo kwa vitendo.
              </p>
            </div>

            <button
              id="toggle-academic"
              type="button"
              role="switch"
              aria-checked={settings.emailAcademicAlerts}
              onClick={() => handleToggle('emailAcademicAlerts')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
                settings.emailAcademicAlerts ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.emailAcademicAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Live Test Trigger Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/60 dark:from-slate-800 dark:to-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Jaribu Utoaji wa Barua Pepe (Live Test Dispatch)</span>
              </h4>
              <p className="text-xs text-gray-600 dark:text-slate-300 mt-0.5">
                Tuma barua pepe ya majaribio kwenye anwani ya <strong className="text-emerald-800 dark:text-emerald-300">{user.email || 'nicolousmunisi07@gmail.com'}</strong> ili kuthibitisha muundo na upokeaji.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                aria-label="Aina ya Barua Pepe ya Jaribio"
                value={testType}
                onChange={(e) => setTestType(e.target.value as any)}
                className="bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-xs font-semibold rounded-xl px-2.5 py-1.5 text-gray-800 dark:text-slate-200 shadow-2xs focus:ring-1 focus:ring-emerald-500"
              >
                <option value="registration">Usajili (Registration)</option>
                <option value="announcement">Tangazo (Announcement)</option>
                <option value="message">Ujumbe (Chat Alert)</option>
              </select>

              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSendingTest}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shrink-0"
              >
                {isSendingTest ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Inatuma...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Tuma Jaribio</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Email Outbox & Audit History */}
        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Kumbukumbu ya Barua Pepe Zilizotumwa (Outbox History - {outboxList.length})</span>
            </h4>
            <span className="text-[11px] text-gray-400 dark:text-slate-500">
              Imesasishwa hivi punde
            </span>
          </div>

          {outboxList.length === 0 ? (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-center text-xs text-gray-500 dark:text-slate-400">
              Hakuna barua pepe iliyotumwa bado. Jaribu kubofya &ldquo;Tuma Jaribio&rdquo; hapo juu.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {outboxList.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-slate-100 truncate">
                        {log.subject}
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded shrink-0">
                        {log.status === 'delivered' ? 'Imefika' : log.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                      Kuelekea: <strong className="text-gray-700 dark:text-slate-300">{log.recipient}</strong> • {log.contentSnippet}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono shrink-0">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* HTML Email Templates Preview Modal */}
      <EmailTemplatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        currentUser={user}
      />
    </div>
  );
};
