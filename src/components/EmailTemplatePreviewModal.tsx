import React, { useState } from 'react';
import { X, Mail, ShieldCheck, CheckCircle2, Laptop, Smartphone, Send, Sparkles } from 'lucide-react';
import { getEmailTemplateSample } from '../services/emailTemplates';
import { sendTestNotificationEmail } from '../services/emailService';
import { UserProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const EmailTemplatePreviewModal: React.FC<Props> = ({ isOpen, onClose, currentUser }) => {
  const [activeTemplate, setActiveTemplate] = useState<
    'registration_user' | 'registration_admin' | 'system_announcement' | 'new_message'
  >('registration_user');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentMsg, setTestSentMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const sample = getEmailTemplateSample(activeTemplate);

  const handleSendTest = async () => {
    setIsSendingTest(true);
    setTestSentMsg(null);
    try {
      const type =
        activeTemplate === 'registration_user' || activeTemplate === 'registration_admin'
          ? 'registration'
          : activeTemplate === 'system_announcement'
          ? 'announcement'
          : 'message';

      const res = await sendTestNotificationEmail({
        user: currentUser,
        type
      });
      setTestSentMsg(res.message);
      setTimeout(() => setTestSentMsg(null), 5000);
    } catch (err: any) {
      setTestSentMsg('Hitilafu wakati wa kutuma jaribio la barua pepe.');
      setTimeout(() => setTestSentMsg(null), 5000);
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div
      id="email-template-preview-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="email-template-preview-modal-card"
        className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-900 to-teal-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-emerald-200 shadow-inner">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>Muundo Rasmi wa Barua Pepe za EduKan</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30">
                  HTML Templates
                </span>
              </h2>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Mfumo wa kisasa wa utoaji arifa kwa Msimamizi Mkuu na Wanafunzi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800/80 transition-colors cursor-pointer"
              title="Funga dirisha"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Template Selector Tabs & Controls Bar */}
        <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            {[
              { id: 'registration_user', label: '1. Usajili wa Mwanafunzi (Welcome)', icon: '🎓' },
              { id: 'registration_admin', label: '2. Alert ya Msimamizi (Admin Alert)', icon: '⚡' },
              { id: 'system_announcement', label: '3. Tangazo la Mfumo (Announcement)', icon: '📢' },
              { id: 'new_message', label: '4. Ujumbe Mpya (Chat Alert)', icon: '💬' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTemplate(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs ${
                  activeTemplate === tab.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Viewport switch and Send test button */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="bg-gray-200 dark:bg-slate-800 p-0.5 rounded-xl flex items-center text-xs">
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  viewport === 'desktop'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 font-bold shadow-2xs'
                    : 'text-gray-500 dark:text-slate-400'
                }`}
                title="Desktop View"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  viewport === 'mobile'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 font-bold shadow-2xs'
                    : 'text-gray-500 dark:text-slate-400'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSendTest}
              disabled={isSendingTest}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
            >
              {isSendingTest ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Inatuma...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Tuma Jaribio Sasa</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metadata info strip */}
        <div className="px-5 py-2.5 bg-emerald-50/60 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/60 flex flex-wrap items-center justify-between text-xs gap-2 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-gray-700 dark:text-slate-300">Kichwa (Subject):</span>
            <span className="font-semibold text-emerald-800 dark:text-emerald-300 truncate">
              {sample.subject}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-gray-500 dark:text-slate-400">Mpokeaji (Recipient):</span>
            <span className="font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-gray-200 dark:border-slate-700 font-medium text-gray-800 dark:text-slate-200">
              {activeTemplate === 'registration_admin'
                ? 'nicolousmunisi07@gmail.com'
                : currentUser.email || sample.recipient}
            </span>
          </div>
        </div>

        {/* Toast confirmation for test email */}
        {testSentMsg && (
          <div className="bg-emerald-700 text-white text-xs font-semibold px-5 py-2 flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{testSentMsg}</span>
          </div>
        )}

        {/* HTML Render Preview Area */}
        <div className="flex-1 bg-gray-100 dark:bg-slate-950 p-4 sm:p-6 overflow-y-auto flex items-start justify-center">
          <div
            className={`transition-all duration-300 w-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden ${
              viewport === 'mobile' ? 'max-w-[390px]' : 'max-w-[640px]'
            }`}
          >
            <div className="bg-gray-100 dark:bg-slate-800/80 px-4 py-2 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                <span className="ml-2">EduKan Email Engine Renderer</span>
              </span>
              <span>{viewport === 'mobile' ? 'Mobile 375px' : 'Desktop 600px'}</span>
            </div>

            {/* Rendered HTML */}
            <div
              className="p-1 sm:p-2 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: sample.html }}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              Inatuma kiotomatiki kwa Admin (<strong className="text-gray-700 dark:text-slate-300">nicolousmunisi07@gmail.com</strong>) na anwani ya mwanafunzi.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-xl font-bold cursor-pointer transition-colors"
          >
            Funga
          </button>
        </div>
      </div>
    </div>
  );
};
