import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Calendar,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Flame,
  Check
} from 'lucide-react';
import { StudyReminder, UserProfile } from '../types';
import {
  getStudyReminders,
  addStudyReminder,
  deleteStudyReminder,
  toggleStudyReminderActive,
  saveStudyReminders
} from '../services/studyReminders';

interface Props {
  currentUser: UserProfile;
  onTriggerTestAlert?: (reminder: StudyReminder) => void;
}

const TANZANIA_SUBJECTS = [
  'Mathematics (BAM / Adv)',
  'Physics',
  'Chemistry',
  'Biology',
  'Geography',
  'History',
  'Kiswahili',
  'English Language & Literature',
  'Civics / General Studies',
  'Economics',
  'Commerce & Bookkeeping',
  'Computer Science / ICT'
];

const DAYS_OPTIONS = [
  'Kila Siku',
  'Siku za Shule',
  'Wikiendi',
  'Jumatatu',
  'Jumanne',
  'Jumatano',
  'Alhamisi',
  'Ijumaa',
  'Jumamosi',
  'Jumapili'
];

const COLOR_OPTIONS = [
  { label: 'Kijani (Emerald)', value: '#059669', bgClass: 'bg-emerald-500' },
  { label: 'Bluu (Sky)', value: '#0284c7', bgClass: 'bg-sky-500' },
  { label: 'Zambarau (Purple)', value: '#7c3aed', bgClass: 'bg-purple-500' },
  { label: 'Kahawia/Dhahabu (Amber)', value: '#d97706', bgClass: 'bg-amber-500' },
  { label: 'Nyekundu (Rose)', value: '#e11d48', bgClass: 'bg-rose-500' }
];

export const StudyRemindersSection: React.FC<Props> = ({
  currentUser,
  onTriggerTestAlert
}) => {
  const [reminders, setReminders] = useState<StudyReminder[]>(() => getStudyReminders(currentUser.id));
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [subject, setSubject] = useState(TANZANIA_SUBJECTS[0]);
  const [customSubject, setCustomSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Kila Siku');
  const [time, setTime] = useState('19:30');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const activeCount = reminders.filter(r => r.isActive).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const chosenSubject = subject === 'Nyingine...' ? customSubject.trim() : subject;
    if (!chosenSubject) {
      setFormError('Tafadhali chagua au andika jina la somo.');
      return;
    }

    if (!topic.trim()) {
      setFormError('Tafadhali weka mada unayotaka kujisomea (k.m. Calculus au Organic Chemistry).');
      return;
    }

    if (!time) {
      setFormError('Tafadhali chagua muda wa kikumbusho (saa na dakika).');
      return;
    }

    const created = addStudyReminder({
      userId: currentUser.id,
      subject: chosenSubject,
      topic: topic.trim(),
      dayOfWeek,
      time,
      durationMinutes: Number(durationMinutes),
      color,
      isActive: true,
      notes: notes.trim() || undefined
    });

    setReminders(prev => [created, ...prev]);
    setIsAdding(false);
    setTopic('');
    setNotes('');
    setSuccessToast(`Kikumbusho cha masomo (${chosenSubject}) kimewekwa kikamilifu!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleToggle = (id: string) => {
    const updated = toggleStudyReminderActive(id);
    setReminders(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deleteStudyReminder(id);
    setReminders(updated);
    setSuccessToast('Kikumbusho kimefutwa.');
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handlePresetApply = (presetSubject: string, presetTopic: string, presetTime: string) => {
    const created = addStudyReminder({
      userId: currentUser.id,
      subject: presetSubject,
      topic: presetTopic,
      dayOfWeek: 'Kila Siku',
      time: presetTime,
      durationMinutes: 60,
      color: '#059669',
      isActive: true,
      notes: 'Ratiba ya maandalizi ya kitaaluma ya EduKan.'
    });
    setReminders(prev => [created, ...prev]);
    setSuccessToast(`Ratiba ya haraka ya "${presetSubject}" imeongezwa!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div id="study-reminders-section" className="space-y-5">
      {/* Header card with summary */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-2xl p-5 sm:p-6 text-white shadow-sm border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 border border-white/10">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                Kikumbusho cha Masomo (Study Reminders)
              </h3>
            </div>
            <p className="text-xs text-emerald-200/90 max-w-xl">
              Panga ratiba yako binafsi ya kujisomea. Mfumo utakutumia arifa ya ndani ya programu papo hapo pindi muda wa somo unapofika.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <span className="block text-lg font-black text-emerald-300 font-mono">{activeCount}</span>
              <span className="text-[10px] text-emerald-200 uppercase font-semibold">Zinazofanya Kazi</span>
            </div>

            <button
              id="btn-add-study-reminder"
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{isAdding ? 'Funga Fomu' : 'Weka Kikumbusho Kipya'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast Banner */}
      {successToast && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Add Reminder Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-5 shadow-xs space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
            <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Sajili Ratiba Mpya ya Masomo
            </h4>
            <span className="text-[11px] text-gray-400 dark:text-slate-400">
              * Sehemu zote zina umuhimu
            </span>
          </div>

          {formError && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-3 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Subject */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 dark:text-slate-300 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                Somo Linalohusika
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-emerald-600"
              >
                {TANZANIA_SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value="Nyingine...">Somo Lingine...</option>
              </select>

              {subject === 'Nyingine...' && (
                <input
                  type="text"
                  placeholder="Andika jina la somo hapa..."
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full mt-2 px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white text-xs"
                />
              )}
            </div>

            {/* Topic / Goal */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 dark:text-slate-300">
                Mada / Lengo la Kujisomea (Topic)
              </label>
              <input
                type="text"
                placeholder="k.m. Kufanya NECTA 2024 Past Paper au Kujifunza Matrices"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Day of Week */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 dark:text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Siku ya Kujisomea
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-emerald-600"
              >
                {DAYS_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Time Picker */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 dark:text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Muda wa Kuanza (Saa & Dakika)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 dark:text-slate-300">
                Muda wa Kikao (Dakika)
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-emerald-600"
              >
                <option value={30}>Dakika 30 (Kikao kifupi)</option>
                <option value={45}>Dakika 45 (Kawaida)</option>
                <option value={60}>Saa 1 (Dakika 60 - Inashauriwa)</option>
                <option value={90}>Saa 1 na Nusu (Dakika 90)</option>
                <option value={120}>Masaa 2 (Dakika 120 - Kina)</option>
              </select>
            </div>

            {/* Color Tag */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 dark:text-slate-300">
                Rangi ya Lebo
              </label>
              <div className="flex items-center gap-2 pt-1">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-7 h-7 rounded-full ${c.bgClass} flex items-center justify-center text-white transition-all cursor-pointer ${
                      color === c.value ? 'ring-3 ring-offset-2 ring-emerald-600 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {color === c.value && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1 text-xs">
            <label className="font-semibold text-gray-700 dark:text-slate-300">
              Maelezo ya Ziada au Dokezo (Hiari)
            </label>
            <input
              type="text"
              placeholder="k.m. Kuangalia mfano ukurasa wa 140 kabla ya maswali ya NECTA"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Ghairi
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Hifadhi Kikumbusho
            </button>
          </div>
        </form>
      )}

      {/* Preset Recommendations */}
      <div className="bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-slate-200">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Mapendekezo ya Haraka (Quick Study Presets)</span>
          </div>
          <span className="text-[11px] text-gray-500 dark:text-slate-400">
            Bofya kuongeza ratiba kwa sekunde 1
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <button
            onClick={() => handlePresetApply('Mathematics (BAM / Adv)', 'NECTA Calculus & BAM Drills', '20:00')}
            className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-emerald-500 text-left transition-all group cursor-pointer"
          >
            <div className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 flex items-center justify-between">
              <span>BAM & Adv Maths</span>
              <span className="text-[10px] text-emerald-600 font-mono">20:00</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">
              Mapitio ya maswali magumu ya NECTA (Saa 1 kila siku)
            </p>
          </button>

          <button
            onClick={() => handlePresetApply('Physics', 'Wave Mechanics & Electronics', '19:00')}
            className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-emerald-500 text-left transition-all group cursor-pointer"
          >
            <div className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 flex items-center justify-between">
              <span>Sayansi ya Fizikia</span>
              <span className="text-[10px] text-emerald-600 font-mono">19:00</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">
              Practicals na maswali ya hesabu za fizikia
            </p>
          </button>

          <button
            onClick={() => handlePresetApply('Kiswahili', 'Ushairi, Fasihi Simulizi na Sarufi', '17:00')}
            className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-emerald-500 text-left transition-all group cursor-pointer"
          >
            <div className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 flex items-center justify-between">
              <span>Lugha & Fasihi</span>
              <span className="text-[10px] text-emerald-600 font-mono">17:00</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">
              Uchambuzi wa diwani na tamthiliya za NECTA
            </p>
          </button>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
            Ratiba Zako za Masomo ({reminders.length})
          </h4>
          <span className="text-xs text-gray-400 dark:text-slate-400">
            Arifa hulia kiotomatiki kifaa kikiwa wazi
          </span>
        </div>

        {reminders.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 text-xs space-y-2">
            <Clock className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto" />
            <p className="font-semibold text-sm text-gray-700 dark:text-slate-300">
              Bado hujaweka ratiba ya masomo
            </p>
            <p className="max-w-sm mx-auto">
              Weka kikumbusho sasa ili usikose muda wa kufanya mazoezi ya past papers na kujiandaa na mitihani yako.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reminders.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  item.isActive
                    ? 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 shadow-2xs'
                    : 'bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 opacity-60'
                }`}
                style={{ borderLeftColor: item.color, borderLeftWidth: '5px' }}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
                          {item.subject}
                        </h5>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-900">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-700 dark:text-slate-300 mt-1">
                        {item.topic}
                      </p>
                    </div>

                    {/* Toggle Active Switch */}
                    <button
                      onClick={() => handleToggle(item.id)}
                      title={item.isActive ? 'Zima kikumbusho' : 'Washa kikumbusho'}
                      className="cursor-pointer text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      {item.isActive ? (
                        <ToggleRight className="w-7 h-7" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-slate-400 mt-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-600" />
                      {item.dayOfWeek}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      Dakika {item.durationMinutes}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-2 bg-gray-50 dark:bg-slate-800/60 p-2 rounded-lg italic">
                      Dokezo: {item.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-800/60 text-xs">
                  {onTriggerTestAlert ? (
                    <button
                      onClick={() => onTriggerTestAlert(item)}
                      className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                    >
                      Jaribu Arifa Sasa (Test Alert)
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      {item.isActive ? '● Kikumbusho Kiko Hai' : '○ Kimezimwa'}
                    </span>
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Futa ratiba hii"
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
