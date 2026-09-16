import React, { useState, useEffect } from 'react';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
  Search,
  MessageSquare,
  ShieldCheck,
  Phone,
  School,
  GraduationCap,
  Calendar,
  Send,
  UserCheck,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { AdminRegistrationAlert, ManagedStudent, UserProfile } from '../../types';
import {
  getAdminRegistrationAlerts,
  getAdminInboxMessages,
  markAdminInboxMessageAsRead,
  exportStudentsToCSV,
  AdminInboxMessage
} from '../../services/adminRegistrationService';
import { sendRegistrationEmails } from '../../services/emailService';

interface Props {
  students: ManagedStudent[];
  currentUser: UserProfile;
  onNavigateTab?: (tab: string) => void;
  onTriggerFeedback: (msg: string) => void;
}

export const AdminRegistrationsTab: React.FC<Props> = ({
  students,
  currentUser,
  onNavigateTab,
  onTriggerFeedback
}) => {
  const [alerts, setAlerts] = useState<AdminRegistrationAlert[]>([]);
  const [messages, setMessages] = useState<AdminInboxMessage[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'alerts' | 'inbox'>('alerts');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<AdminInboxMessage | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [resendingAlertId, setResendingAlertId] = useState<string | null>(null);

  const adminEmail = 'nicolousmunisi07@gmail.com';

  const loadData = () => {
    setAlerts(getAdminRegistrationAlerts());
    setMessages(getAdminInboxMessages());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    try {
      const res = await fetch('/api/notifications/email-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: adminEmail,
          subject: '🔔 Jaribio la Mfumo wa Barua Pepe - EduKan Tanzania',
          htmlBody: `
            <div style="font-family: sans-serif; padding: 20px; color: #1e293b; background: #f8fafc; border-radius: 12px;">
              <h2 style="color: #065f46;">Jaribio la Uunganishaji wa Barua Pepe (EduKan Tanzania)</h2>
              <p>Habari Msimamizi Mkuu Nicolous Munisi,</p>
              <p>Ujumbe huu ni uthibitisho kuwa mfumo wa utumaji barua pepe unafanya kazi kikamilifu kuelekea anwani yako rasmi ya <strong>${adminEmail}</strong>.</p>
              <p>Kila mwanafunzi anapojisajili, taarifa zake kamili zitatumwa hapa kiotomatiki.</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="font-size: 12px; color: #64748b;">Muda: ${new Date().toLocaleString('sw-TZ')}</p>
            </div>
          `,
          eventType: 'system_test',
          metadata: { admin: 'Nicolous Munisi', timestamp: new Date().toISOString() }
        })
      });

      const data = await res.json();
      if (data.success) {
        onTriggerFeedback(`✅ Ujumbe wa jaribio umetumwa kikamilifu kwa ${adminEmail}!`);
      } else {
        onTriggerFeedback(`Taarifa ya kutuma: ${data.message || 'Imehifadhiwa kwenye kumbukumbu ya mfumo.'}`);
      }
    } catch (err: any) {
      onTriggerFeedback('Ujumbe wa jaribio umehifadhiwa kwenye rekodi za kiutawala.');
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleResendRegistrationEmail = async (alert: AdminRegistrationAlert) => {
    setResendingAlertId(alert.id);
    try {
      await fetch('/api/notifications/email-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: adminEmail,
          subject: `🔔 [KURUDIA] Usajili Mpya: ${alert.studentName} (${alert.schoolName})`,
          htmlBody: `
            <div style="font-family: sans-serif; padding: 24px; color: #0f172a; background: #f0fdf4; border-radius: 16px; border: 1px solid #bbf7d0;">
              <h2 style="color: #166534; margin-top: 0;">Arifa ya Usajili wa Mwanafunzi Mpya</h2>
              <p>Habari Msimamizi Nicolous Munisi,</p>
              <p>Huu ni ujumbe wa uthibitisho wa usajili wa mwanafunzi:</p>
              <ul>
                <li><strong>Jina:</strong> ${alert.studentName}</li>
                <li><strong>Barua Pepe:</strong> ${alert.studentEmail}</li>
                <li><strong>Namba ya Simu:</strong> ${alert.studentPhone || 'Haijawekwa'}</li>
                <li><strong>Shule/Chuo:</strong> ${alert.schoolName} (${alert.schoolRegion || 'Tanzania'})</li>
                <li><strong>Ngazi ya Masomo:</strong> ${alert.level} ${alert.combination ? `(${alert.combination})` : ''}</li>
                <li><strong>Namba ya Usajili (Reg No):</strong> ${alert.studentRegNo || 'Imezalishwa'}</li>
                <li><strong>Muda wa Usajili:</strong> ${alert.registeredAt}</li>
              </ul>
              <p>Unaweza kumtumia mwanafunzi huyu ujumbe moja kwa moja kupitia jukwaa la EduKan.</p>
            </div>
          `,
          eventType: 'registration_admin_alert',
          metadata: { studentId: alert.userId, studentEmail: alert.studentEmail }
        })
      });

      // Also resend to student
      if (alert.studentEmail) {
        await fetch('/api/notifications/email-dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientEmail: alert.studentEmail,
            subject: '🎉 Karibu EduKan Tanzania - Uthibitisho wa Usajili Wako',
            htmlBody: `
                <div style="font-family: sans-serif; padding: 24px; color: #0f172a; background: #f8fafc; border-radius: 16px;">
                  <h2 style="color: #065f46;">Karibu Rasmi EduKan Tanzania!</h2>
                  <p>Habari ${alert.studentName},</p>
                  <p>Akaunti yako imethibitishwa na Msimamizi Mkuu (Nicolous Munisi). Sasa unaweza kusoma vitabu, past papers za NECTA, na kujiunga na vyumba vya masomo.</p>
                </div>
              `,
            eventType: 'registration_student_welcome',
            metadata: { studentId: alert.userId }
          })
        });
      }

      onTriggerFeedback(`Barua pepe ya usajili ya ${alert.studentName} imetumwa tena kwa ${adminEmail} na ${alert.studentEmail}!`);
    } catch (err) {
      onTriggerFeedback('Hitilafu katika kutuma barua pepe tena.');
    } finally {
      setResendingAlertId(null);
    }
  };

  const filteredAlerts = alerts.filter(a =>
    a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messages.filter(m =>
    m.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner: Admin Email Status & Dispatch Status */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>KITUO CHA MAWASILIANO YA UTAWALA (ADMIN EMAIL DISPATCH)</span>
            </div>
            <h3 className="text-xl font-bold font-heading">
              Arifa za Usajili & Barua Pepe za Admin
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Kila mwanafunzi anapojisajili kwenye EduKan Tanzania, mfumo hutuma taarifa kamili ya usajili moja kwa moja kwenye barua pepe ya msimamizi:{' '}
              <strong className="text-white underline font-mono">{adminEmail}</strong> na pia kumtumia mwanafunzi barua pepe ya ukaribisho.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleSendTestEmail}
              disabled={isSendingTest}
              className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
            >
              {isSendingTest ? (
                <div className="w-3.5 h-3.5 border-2 border-emerald-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 text-emerald-700" />
              )}
              <span>Tuma Jaribio la Email</span>
            </button>

            <button
              onClick={() => {
                exportStudentsToCSV(students);
                onTriggerFeedback('Faili la CSV la wanafunzi waliosajiliwa linapakuliwa!');
              }}
              className="px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs border border-emerald-500/40 shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-emerald-200" />
              <span>Pakua Orodha (CSV)</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">Arifa za Usajili</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-2">
            {alerts.length}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Zote zimetumwa kwa Admin
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">Wanafunzi Waliosajiliwa</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-2">
            {students.length}
          </div>
          <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">
            Kwenye kumbukumbu ya EduKan
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">Ujumbe wa Inbox ya Admin</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-2">
            {messages.length}
          </div>
          <div className="text-[11px] text-purple-700 dark:text-purple-400 font-medium mt-1">
            {messages.filter(m => !m.isRead).length} haijasomwa bado
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">Anwani ya Admin</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xs font-bold font-mono text-gray-900 dark:text-white mt-2 truncate" title={adminEmail}>
            {adminEmail}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
            Hali: Imethibitishwa (Active)
          </div>
        </div>
      </div>

      {/* Filter and Sub-Tab Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('alerts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'alerts'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Arifa za Usajili ({alerts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('inbox')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'inbox'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ujumbe wa Barua Pepe ({messages.length})</span>
            {messages.filter(m => !m.isRead).length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {messages.filter(m => !m.isRead).length}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tafuta jina, barua pepe, au shule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* SubTab 1: Registration Alerts Feed */}
      {activeSubTab === 'alerts' && (
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Hakuna arifa za usajili zinazolingana na utafutaji wako
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
                Pindi mwanafunzi anapojiandikisha kwenye mfumo, taarifa zake za usajili na namba ya utambulisho zitaonekana hapa papo hapo.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-2xs transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0 ring-2 ring-emerald-500/20">
                      {alert.studentName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white font-heading">
                          {alert.studentName}
                        </h4>
                        <span className="text-[11px] bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium">
                          {alert.role.toUpperCase()}
                        </span>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Imetumwa kwa {alert.adminEmailRecipient}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <strong className="text-gray-800 dark:text-slate-200">{alert.studentEmail}</strong>
                        </span>
                        {alert.studentPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {alert.studentPhone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <School className="w-3 h-3 text-gray-400" />
                          {alert.schoolName} ({alert.level})
                        </span>
                        {alert.combination && (
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-gray-400" />
                            {alert.combination}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {alert.registeredAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleResendRegistrationEmail(alert)}
                      disabled={resendingAlertId === alert.id}
                      className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      title="Tuma barua pepe tena kwa admin na mwanafunzi"
                    >
                      {resendingAlertId === alert.id ? (
                        <div className="w-3 h-3 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3 text-emerald-700" />
                      )}
                      <span>Tuma Email Tena</span>
                    </button>

                    {onNavigateTab && (
                      <button
                        onClick={() => onNavigateTab('communities')}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Fungua mazungumzo na mwanafunzi huyu"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Soga ya Moja kwa Moja</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Message snippet */}
                <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl text-xs text-gray-700 dark:text-slate-300 leading-relaxed border border-gray-100 dark:border-slate-800/80">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-400">Muhtasari: </span>
                  {alert.messageSnippet}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SubTab 2: Admin Inbox Messages */}
      {activeSubTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-2 max-h-[600px] overflow-y-auto">
            <h4 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider px-1">
              Ujumbe Uliopokelewa ({filteredMessages.length})
            </h4>

            {filteredMessages.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-slate-500 py-6 text-center italic">
                Hakuna ujumbe kwenye sanduku la barua pepe.
              </p>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    markAdminInboxMessageAsRead(msg.id);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all space-y-1 ${
                    selectedMessage?.id === msg.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-200 dark:ring-emerald-800'
                      : !msg.isRead
                      ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-700/60 font-semibold'
                      : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold truncate text-gray-900 dark:text-white">{msg.senderName}</span>
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] truncate text-emerald-800 dark:text-emerald-400 font-medium">
                    {msg.subject}
                  </div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500">
                    {msg.receivedAt}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Detail View */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between min-h-[400px]">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="border-b border-gray-100 dark:border-slate-800 pb-4 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white font-heading">
                      {selectedMessage.subject}
                    </h3>
                    <span className="text-[11px] text-gray-400 dark:text-slate-500">
                      {selectedMessage.receivedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-slate-300 flex-wrap">
                    <span>
                      Kutoka: <strong className="text-gray-900 dark:text-white">{selectedMessage.senderName}</strong> ({selectedMessage.senderEmail})
                    </span>
                    <span>• Shule: {selectedMessage.schoolName}</span>
                    <span>• Ngazi: {selectedMessage.level}</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl text-xs sm:text-sm text-gray-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans border border-gray-200/80 dark:border-slate-700">
                  {selectedMessage.content}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-slate-800">
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold">
                    ✓ Arifa rasmi imehifadhiwa kwa Msimamizi Nicolous Munisi
                  </span>

                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('communities')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Jibu Moja kwa Moja Kwenye Soga</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="my-auto text-center py-12 space-y-2">
                <Mail className="w-10 h-10 text-gray-300 dark:text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-gray-700 dark:text-slate-300">
                  Chagua ujumbe upande wa kushoto kusoma
                </h4>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  Arifa zote za usajili na maombi ya wanafunzi huonekana hapa.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
