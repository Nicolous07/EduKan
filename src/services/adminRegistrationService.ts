import { ManagedStudent, Post, UserProfile, AdminRegistrationAlert } from '../types';

const ADMIN_REGISTRATION_ALERTS_KEY = 'edukan_admin_registration_alerts';
const ADMIN_INBOX_MESSAGES_KEY = 'edukan_admin_inbox_messages';
const MANAGED_STUDENTS_KEY = 'edukan_managed_students';
const REGISTERED_ACCOUNTS_KEY = 'edukan_registered_accounts';

export interface AdminInboxMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  schoolName: string;
  level: string;
  subject: string;
  content: string;
  receivedAt: string;
  isRead: boolean;
  type: 'registration_alert' | 'student_inquiry' | 'feedback' | 'verification_request';
  metadata?: Record<string, any>;
}

export function getAdminRegistrationAlerts(): AdminRegistrationAlert[] {
  try {
    const raw = localStorage.getItem(ADMIN_REGISTRATION_ALERTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Could not load admin registration alerts:', err);
    return [];
  }
}

export function saveAdminRegistrationAlert(alert: AdminRegistrationAlert): void {
  try {
    const current = getAdminRegistrationAlerts();
    const updated = [alert, ...current.filter(a => a.id !== alert.id)];
    localStorage.setItem(ADMIN_REGISTRATION_ALERTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save admin registration alert:', err);
  }
}

export function getAdminInboxMessages(): AdminInboxMessage[] {
  try {
    const raw = localStorage.getItem(ADMIN_INBOX_MESSAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Could not load admin inbox messages:', err);
    return [];
  }
}

export function saveAdminInboxMessage(msg: AdminInboxMessage): void {
  try {
    const current = getAdminInboxMessages();
    const updated = [msg, ...current.filter(m => m.id !== msg.id)];
    localStorage.setItem(ADMIN_INBOX_MESSAGES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save admin inbox message:', err);
  }
}

export function markAdminInboxMessageAsRead(id: string): void {
  try {
    const current = getAdminInboxMessages();
    const updated = current.map(m => m.id === id ? { ...m, isRead: true } : m);
    localStorage.setItem(ADMIN_INBOX_MESSAGES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not mark message as read:', err);
  }
}

/**
 * Ensures newly registered user is recorded in:
 * 1. edukan_managed_students (so AdminPanel students table displays them)
 * 2. edukan_admin_registration_alerts (so AdminPanel registration alerts shows them)
 * 3. edukan_admin_inbox_messages (so AdminPanel inbox has an incoming message)
 * 4. edukan_notifications (creates system notification for Admin)
 */
export function registerUserInAdminStore(user: UserProfile, rawPassword?: string): void {
  const timestamp = new Date().toLocaleString('sw-TZ', { dateStyle: 'full', timeStyle: 'short' });
  const adminEmail = 'nicolousmunisi07@gmail.com';

  // 1. Add to Managed Students list
  try {
    const rawStudents = localStorage.getItem(MANAGED_STUDENTS_KEY);
    const students: ManagedStudent[] = rawStudents ? JSON.parse(rawStudents) : [];
    
    const exists = students.some(s => s.id === user.id || (user.email && s.email.toLowerCase() === user.email.toLowerCase()));
    if (!exists) {
      const newManagedStudent: ManagedStudent = {
        id: user.id,
        name: user.name,
        handle: user.handle,
        email: user.email,
        avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        schoolName: user.schoolName,
        level: user.level,
        combination: user.combination,
        points: user.points || 50,
        role: user.role,
        status: 'active',
        verified: user.role === 'admin',
        joinDate: new Date().toISOString().slice(0, 10)
      };
      const updatedStudents = [newManagedStudent, ...students];
      localStorage.setItem(MANAGED_STUDENTS_KEY, JSON.stringify(updatedStudents));
    }
  } catch (err) {
    console.warn('Could not add to managed students:', err);
  }

  // 2. Create Registration Alert for Admin
  const alert: AdminRegistrationAlert = {
    id: `alert-reg-${user.id}-${Date.now()}`,
    userId: user.id,
    studentName: user.name,
    studentEmail: user.email,
    studentPhone: user.phone,
    schoolName: user.schoolName,
    schoolRegion: user.schoolRegion,
    level: user.level,
    combination: user.combination,
    studentRegNo: user.studentRegNo,
    registeredAt: timestamp,
    role: user.role,
    status: 'pending_review',
    emailDeliveredToAdmin: true,
    emailDeliveredToStudent: !!user.email,
    adminEmailRecipient: adminEmail,
    messageSnippet: `Mtumiaji mpya amejisajili: ${user.name} (${user.role.toUpperCase()}) kutoka ${user.schoolName}. RegNo: ${user.studentRegNo || 'N/A'}.`
  };
  saveAdminRegistrationAlert(alert);

  // 3. Create Admin Inbox Message
  const inboxMsg: AdminInboxMessage = {
    id: `msg-inbox-reg-${user.id}-${Date.now()}`,
    senderId: user.id,
    senderName: user.name,
    senderEmail: user.email,
    senderPhone: user.phone,
    schoolName: user.schoolName,
    level: user.level,
    subject: `Usajili Mpya: ${user.name} (${user.role.toUpperCase()})`,
    content: `Habari Admin (Nicolous Munisi),\n\nMwanafunzi mpya amefanikiwa kujiunga na EduKan Tanzania:\n\n- Jina: ${user.name} (@${user.handle})\n- Barua Pepe: ${user.email}\n- Namba ya Simu: ${user.phone || 'Haijawekwa'}\n- Shule: ${user.schoolName} (${user.schoolRegion || 'Tanzania'})\n- Ngazi ya Masomo: ${user.level} ${user.combination ? `(${user.combination})` : ''}\n- Namba ya Usajili (Reg No): ${user.studentRegNo || 'Imezalishwa kiotomatiki'}\n- Aina ya Akaunti: ${user.role}\n- Pointi za Mwanzo: ${user.points} pts\n- Muda: ${timestamp}\n\nUjumbe wa barua pepe wa uthibitisho umetumwa kwake na kwa barua pepe yako rasmi: ${adminEmail}.`,
    receivedAt: timestamp,
    isRead: false,
    type: 'registration_alert',
    metadata: {
      userId: user.id,
      studentRegNo: user.studentRegNo,
      role: user.role
    }
  };
  saveAdminInboxMessage(inboxMsg);

  // 4. Create in-app notification in edukan_notifications for Admin
  try {
    const rawNotifs = localStorage.getItem('edukan_notifications');
    const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
    const adminNotif = {
      id: `notif-admin-reg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: `🔔 Usajili Mpya: ${user.name} (${user.schoolName})`,
      message: `Mtumiaji mpya ${user.name} amejiunga rasmi. Barua pepe: ${user.email}, Simu: ${user.phone || 'N/A'}, Ngazi: ${user.level}. Taarifa zimetumwa kwa ${adminEmail}.`,
      category: 'announcement',
      timestamp: 'Sasa hivi',
      read: false,
      actionTab: 'admin'
    };
    const updatedNotifs = [adminNotif, ...notifs];
    localStorage.setItem('edukan_notifications', JSON.stringify(updatedNotifs));
  } catch (err) {
    console.warn('Could not save admin notification:', err);
  }
}

/**
 * Converts array of items into downloadable CSV file with UTF-8 BOM encoding
 */
export function downloadCSV(filename: string, headers: string[], rows: string[][]): void {
  const escapeCSV = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\r\n');

  // \uFEFF ensures Excel properly reads UTF-8 characters (Kiswahili, accents)
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports registered students list as CSV
 */
export function exportStudentsToCSV(students: ManagedStudent[]): void {
  const headers = [
    'Namba ya Usajili',
    'Jina Kamili',
    'Jina la Utambulisho (Handle)',
    'Barua Pepe (Email)',
    'Shule / Kituo',
    'Ngazi ya Masomo',
    'Mchepuo (Combination)',
    'EduPoints',
    'Wadhifa (Role)',
    'Hali ya Akaunti (Status)',
    'Imethibitishwa (Verified)',
    'Tarehe ya Kujiunga'
  ];

  const rows = students.map(s => [
    s.id,
    s.name,
    `@${s.handle}`,
    s.email,
    s.schoolName,
    s.level,
    s.combination || 'Jumla',
    s.points.toString(),
    s.role,
    s.status,
    s.verified ? 'Ndiyo' : 'Hapana',
    s.joinDate
  ]);

  const dateStr = new Date().toISOString().slice(0, 10);
  downloadCSV(`EduKan_Wanafunzi_Waliosajiliwa_${dateStr}.csv`, headers, rows);
}

/**
 * Exports all posts as CSV
 */
export function exportPostsToCSV(posts: Post[]): void {
  const headers = [
    'Kitambulisho (Post ID)',
    'Mwandishi (Author)',
    'Barua Pepe/Handle',
    'Wadhifa (Role)',
    'Shule',
    'Aina ya Chapisho (Type)',
    'Jamii (Category)',
    'Somo (Subject)',
    'Maudhui ya Chapisho (Content)',
    'Idadi ya Likes',
    'Idadi ya Maoni (Comments)',
    'Kura za Kura ya Maoni (Poll Votes)'
  ];

  const rows = posts.map(p => {
    const totalVotes = p.pollOptions?.reduce((acc, o) => acc + o.votes, 0) || 0;
    return [
      p.id,
      p.author.name,
      `@${p.author.handle}`,
      p.author.role,
      p.author.school,
      p.type,
      p.category || 'masomo',
      p.subject || 'Jumla',
      p.content,
      (p.likes || 0).toString(),
      (p.commentsCount || 0).toString(),
      totalVotes.toString()
    ];
  });

  const dateStr = new Date().toISOString().slice(0, 10);
  downloadCSV(`EduKan_Machapisho_Yote_${dateStr}.csv`, headers, rows);
}
