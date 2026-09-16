import { StudyReminder } from '../types';

const STUDY_REMINDERS_KEY = 'edukan_study_reminders';

export const INITIAL_STUDY_REMINDERS: StudyReminder[] = [
  {
    id: 'reminder-necta-1',
    userId: 'default',
    subject: 'Mathematics (BAM / Adv)',
    topic: 'Kufanya NECTA Past Papers (Calculus & Vectors)',
    dayOfWeek: 'Kila Siku',
    time: '19:30',
    durationMinutes: 60,
    color: '#059669', // Emerald
    isActive: true,
    notes: 'Kumbuka kuwa na kitabu cha maswali na calculator ya kisayansi.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'reminder-phys-2',
    userId: 'default',
    subject: 'Physics',
    topic: 'Mapitio ya Mechanics & Wave Motion',
    dayOfWeek: 'Siku za Shule',
    time: '21:00',
    durationMinutes: 45,
    color: '#0284c7', // Sky
    isActive: true,
    notes: 'Kusoma mifano ya practicals na formula sheet.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'reminder-chem-3',
    userId: 'default',
    subject: 'Chemistry',
    topic: 'Organic Chemistry & Periodic Trends',
    dayOfWeek: 'Wikiendi',
    time: '16:00',
    durationMinutes: 90,
    color: '#7c3aed', // Purple
    isActive: true,
    notes: 'Kuchora reaction schemes na maswali ya NECTA 2020-2024.',
    createdAt: new Date().toISOString()
  }
];

export function getStudyReminders(userId?: string): StudyReminder[] {
  try {
    const raw = localStorage.getItem(STUDY_REMINDERS_KEY);
    if (!raw) {
      saveStudyReminders(INITIAL_STUDY_REMINDERS);
      return INITIAL_STUDY_REMINDERS;
    }
    const all: StudyReminder[] = JSON.parse(raw);
    if (userId) {
      return all.filter(r => r.userId === userId || r.userId === 'default');
    }
    return all;
  } catch (err) {
    console.warn('Could not read study reminders:', err);
    return INITIAL_STUDY_REMINDERS;
  }
}

export function saveStudyReminders(reminders: StudyReminder[]): void {
  try {
    localStorage.setItem(STUDY_REMINDERS_KEY, JSON.stringify(reminders));
  } catch (err) {
    console.warn('Could not save study reminders:', err);
  }
}

export function addStudyReminder(data: Omit<StudyReminder, 'id' | 'createdAt'>): StudyReminder {
  const newReminder: StudyReminder = {
    ...data,
    id: `rem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString()
  };
  const current = getStudyReminders();
  const updated = [newReminder, ...current];
  saveStudyReminders(updated);
  return newReminder;
}

export function updateStudyReminder(updated: StudyReminder): StudyReminder[] {
  const current = getStudyReminders();
  const list = current.map(r => r.id === updated.id ? updated : r);
  saveStudyReminders(list);
  return list;
}

export function deleteStudyReminder(id: string): StudyReminder[] {
  const current = getStudyReminders();
  const list = current.filter(r => r.id !== id);
  saveStudyReminders(list);
  return list;
}

export function toggleStudyReminderActive(id: string): StudyReminder[] {
  const current = getStudyReminders();
  const list = current.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r);
  saveStudyReminders(list);
  return list;
}

/**
 * Checks if any active study reminder matches current time (within current minute)
 * and has not fired in the current minute of today.
 */
export function checkDueReminders(): StudyReminder[] {
  const reminders = getStudyReminders();
  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, '0');
  const currentMin = now.getMinutes().toString().padStart(2, '0');
  const currentTimeStr = `${currentHour}:${currentMin}`;
  const todayKey = now.toISOString().slice(0, 10);

  const daysSwahili = ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'];
  const todayName = daysSwahili[now.getDay()];
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  const isWeekday = !isWeekend;

  const dueList: StudyReminder[] = [];
  let updatedAny = false;

  const updatedReminders = reminders.map(r => {
    if (!r.isActive) return r;
    if (r.time !== currentTimeStr) return r;

    // Check day condition
    let matchesDay = false;
    if (r.dayOfWeek === 'Kila Siku') matchesDay = true;
    else if (r.dayOfWeek === todayName) matchesDay = true;
    else if (r.dayOfWeek === 'Siku za Shule' && isWeekday) matchesDay = true;
    else if (r.dayOfWeek === 'Wikiendi' && isWeekend) matchesDay = true;

    if (!matchesDay) return r;

    // Check if already fired today at this exact time
    const fireSignature = `${todayKey}_${currentTimeStr}`;
    if (r.lastTriggeredDate === fireSignature) {
      return r;
    }

    dueList.push(r);
    updatedAny = true;
    return { ...r, lastTriggeredDate: fireSignature };
  });

  if (updatedAny) {
    saveStudyReminders(updatedReminders);
  }

  return dueList;
}
