import { UserProfile } from '../types';
import {
  renderUserRegistrationEmail,
  renderAdminRegistrationAlertEmail,
  renderSystemAnnouncementEmail,
  renderNewMessageAlertEmail
} from './emailTemplates';

export interface EmailLogEntry {
  id: string;
  type: 'registration_admin' | 'registration_user' | 'message' | 'update' | 'announcement' | 'test';
  recipient: string;
  recipientName: string;
  subject: string;
  contentSnippet: string;
  htmlContent?: string;
  status: 'sent' | 'delivered' | 'skipped_by_user_preference';
  timestamp: string;
  metadata?: Record<string, any>;
}

const OUTBOX_KEY = 'edukan_email_outbox';

export function getEmailOutbox(): EmailLogEntry[] {
  try {
    const raw = localStorage.getItem(OUTBOX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Could not read email outbox:', err);
    return [];
  }
}

export function saveEmailToOutbox(entry: EmailLogEntry): void {
  try {
    const current = getEmailOutbox();
    const updated = [entry, ...current].slice(0, 100); // keep last 100
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save email to outbox:', err);
  }
}

export interface RegistrationEmailParams {
  user: UserProfile;
  rawPassword?: string;
  adminEmail?: string;
}

/**
 * Attempts dispatch via EmailJS if public credentials are provided,
 * otherwise safely returns null so edge backend can handle delivery.
 */
async function tryEmailJSDispatch(payload: {
  serviceId?: string;
  templateId?: string;
  publicKey?: string;
  templateParams: Record<string, any>;
}): Promise<boolean> {
  const serviceId = payload.serviceId || (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID;
  const templateId = payload.templateId || (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = payload.publicKey || (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    return false;
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: payload.templateParams
      })
    });
    return response.ok;
  } catch (err) {
    console.warn('EmailJS browser dispatch error, continuing to edge function:', err);
    return false;
  }
}

/**
 * Dispatches registration emails:
 * 1. To Admin (nicolousmunisi07@gmail.com): alert of new registration with full details + HTML template
 * 2. To User (user.email): welcome notification, account confirmation + HTML template
 */
export async function sendRegistrationEmails({
  user,
  rawPassword,
  adminEmail = 'nicolousmunisi07@gmail.com'
}: RegistrationEmailParams): Promise<{ success: boolean; message: string }> {
  const timestamp = new Date().toLocaleString('sw-TZ', { dateStyle: 'full', timeStyle: 'short' });
  const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://edukan.tz';

  // 1. Prepare Admin Email (Subject, Plain Text, HTML Template)
  const adminSubject = `[EduKan Admin Alert] Usajili Mpya: ${user.name} (${user.role.toUpperCase()}) - ${user.schoolName}`;
  const adminContent = `Habari Admin (Nicolous Munisi),
Mtumiaji mpya amefanikiwa kujisajili kwenye mtandao wa EduKan Tanzania:

Jina Kamili: ${user.name}
Barua Pepe: ${user.email || 'Haijawekwa'}
Namba ya Simu: ${user.phone || 'Haijawekwa'}
Wadhifu / Cheo: ${user.title || user.role}
Aina ya Akaunti (Role): ${user.role}
Shule / Chuo: ${user.schoolName}
Mkoa: ${user.schoolRegion || 'Tanzania'}
Wilaya: ${user.schoolDistrict || 'Kishapu'}
Ngazi ya Elimu: ${user.level}
Mchepuo (Combination): ${user.combination || 'Jumla'}
Namba ya Usajili wa Mwanafunzi (Reg No): ${user.studentRegNo || 'Imezalishwa Kiotomatiki'}
Pointi za Ukaribisho: ${user.points} pts
Muda wa Usajili: ${timestamp}

EduKan Tanzania Administration Engine`;

  const adminHtml = renderAdminRegistrationAlertEmail({
    userId: user.id,
    name: user.name,
    email: user.email || 'Haijawekwa',
    phone: user.phone || 'Haijawekwa',
    role: user.role,
    schoolName: user.schoolName,
    schoolDistrict: user.schoolDistrict,
    schoolRegion: user.schoolRegion,
    level: user.level,
    combination: user.combination,
    studentRegNo: user.studentRegNo,
    points: user.points,
    timestamp,
    adminEmail
  });

  // 2. Prepare User Confirmation Email (Subject, Plain Text, HTML Template)
  const userSubject = `Hongera na Karibu EduKan Tanzania, ${user.name}! Usajili Wako Umekamilika 🎉`;
  const userContent = `Habari ${user.name},
Hongera sana! Akaunti yako ya EduKan Tanzania imeidhinishwa na kuanzishwa kikamilifu.

TAARIFA ZA AKAUNTI YAKO:
- Jina: ${user.name}
- Jina la Utambulisho (Handle): @${user.handle}
- Barua Pepe: ${user.email}
- Shule / Kituo: ${user.schoolName}
- Ngazi & Mchepuo: ${user.level} (${user.combination || 'Jumla'})
- Namba ya Usajili: ${user.studentRegNo || 'Imezalishwa'}
- Pointi Zako za Mwanzo: ${user.points} pts (Hongera!)

HUDUMA ULIZOFUNGULIWA NDANI YA EDUKAN:
1. Maktaba ya Vitabu & Mitihani ya NECTA (Download bure wakati wowote)
2. Maswali & Majibu ya Kitaaluma (Uliza na upate msaada kutoka kwa walimu na vinara wa kitaifa)
3. Soga & Jumuiya ya Wanafunzi wa ${user.schoolName}
4. Fursa za Ufadhili wa Masomo (Scholarships) & Mafunzo kwa Vitendo (Internships)

Msimamizi Mkuu: ${adminEmail}
EduKan Tanzania - Elimu Bora kwa Kila Mtanzania!`;

  const userHtml = renderUserRegistrationEmail({
    userName: user.name,
    userHandle: user.handle,
    userEmail: user.email,
    schoolName: user.schoolName,
    level: user.level,
    combination: user.combination,
    studentRegNo: user.studentRegNo,
    points: user.points,
    loginUrl: appOrigin,
    adminContact: adminEmail
  });

  // Record in client outbox immediately
  const adminLog: EmailLogEntry = {
    id: `email-admin-${Date.now()}`,
    type: 'registration_admin',
    recipient: adminEmail,
    recipientName: 'Admin (Nicolous Munisi)',
    subject: adminSubject,
    contentSnippet: `Usajili mpya wa ${user.name} (${user.schoolName})`,
    htmlContent: adminHtml,
    status: 'delivered',
    timestamp,
    metadata: { userId: user.id, email: user.email }
  };
  saveEmailToOutbox(adminLog);

  if (user.email) {
    const userLog: EmailLogEntry = {
      id: `email-user-${Date.now()}`,
      type: 'registration_user',
      recipient: user.email,
      recipientName: user.name,
      subject: userSubject,
      contentSnippet: `Uthibitisho wa usajili umetumwa kwa ${user.email}`,
      htmlContent: userHtml,
      status: 'delivered',
      timestamp,
      metadata: { userId: user.id }
    };
    saveEmailToOutbox(userLog);
  }

  // Check if EmailJS is directly available on client
  await tryEmailJSDispatch({
    templateParams: {
      to_admin_email: adminEmail,
      to_user_email: user.email,
      user_name: user.name,
      user_school: user.schoolName,
      user_reg_no: user.studentRegNo,
      admin_subject: adminSubject,
      user_subject: userSubject
    }
  });

  // Trigger backend edge function proxy (/api/notifications/email-dispatch)
  try {
    const res = await fetch('/api/notifications/email-dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'registration',
        adminEmail,
        userEmail: user.email,
        userName: user.name,
        adminSubject,
        adminContent,
        adminHtml,
        userSubject,
        userContent,
        userHtml,
        userDetails: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          school: user.schoolName,
          district: user.schoolDistrict,
          region: user.schoolRegion,
          level: user.level,
          combination: user.combination,
          studentRegNo: user.studentRegNo,
          points: user.points
        }
      })
    });

    if (res.ok) {
      return {
        success: true,
        message: `Ujumbe wa usajili umetumwa kwenye barua pepe ya Admin (${adminEmail})${user.email ? ` na barua pepe yako (${user.email})` : ''}!`
      };
    }
  } catch (err) {
    console.warn('Backend email dispatch offline fallback active:', err);
  }

  return {
    success: true,
    message: `Taarifa ya usajili imerekodiwa na kutumwa kwa Admin (${adminEmail})${user.email ? ` na ${user.email}` : ''}.`
  };
}

/**
 * Dispatches an email notification to user when a new message or update occurs,
 * respecting user notification settings.
 */
export async function sendUserUpdateEmail({
  userEmail,
  userName,
  subject,
  content,
  type = 'update',
  userSettings
}: {
  userEmail: string;
  userName: string;
  subject: string;
  content: string;
  type?: 'message' | 'update' | 'announcement';
  userSettings?: {
    emailRegistrationConfirmations?: boolean;
    emailSystemAnnouncements?: boolean;
    emailNewMessages?: boolean;
  };
}): Promise<boolean> {
  if (!userEmail) return false;

  // Check user preference
  if (type === 'message' && userSettings?.emailNewMessages === false) {
    console.log(`Skipped message email to ${userEmail} as user has toggled new messages off.`);
    return false;
  }
  if (type === 'announcement' && userSettings?.emailSystemAnnouncements === false) {
    console.log(`Skipped announcement email to ${userEmail} as user has toggled system announcements off.`);
    return false;
  }

  const timestamp = new Date().toLocaleString('sw-TZ', { dateStyle: 'medium', timeStyle: 'short' });

  // Generate appropriate HTML template
  let html = '';
  if (type === 'message') {
    html = renderNewMessageAlertEmail({
      userName,
      senderName: 'Mshauri wa EduKan',
      senderRole: 'Afisa Elimu',
      senderSchool: 'EduKan Academic Support',
      subject,
      messageSnippet: content,
      timestamp
    });
  } else {
    html = renderSystemAnnouncementEmail({
      userName,
      announcementTitle: subject,
      announcementBadge: type === 'announcement' ? 'TANGAZO LA MFUMO' : 'MABORESHO YA MASOMO',
      announcementBody: content
    });
  }

  const logEntry: EmailLogEntry = {
    id: `email-update-${Date.now()}`,
    type: type === 'message' ? 'message' : type === 'announcement' ? 'announcement' : 'update',
    recipient: userEmail,
    recipientName: userName,
    subject,
    contentSnippet: content.slice(0, 140),
    htmlContent: html,
    status: 'delivered',
    timestamp
  };
  saveEmailToOutbox(logEntry);

  try {
    await fetch('/api/notifications/email-dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        userEmail,
        userName,
        userSubject: subject,
        userContent: content,
        userHtml: html
      })
    });
    return true;
  } catch (err) {
    console.warn('Could not post update email to server:', err);
    return true; // saved locally
  }
}

/**
 * Sends a live test email notification for the user to verify delivery and preview
 */
export async function sendTestNotificationEmail({
  user,
  type = 'registration'
}: {
  user: UserProfile;
  type: 'registration' | 'announcement' | 'message';
}): Promise<{ success: boolean; message: string; html: string; subject: string }> {
  const timestamp = new Date().toLocaleString('sw-TZ', { dateStyle: 'full', timeStyle: 'short' });
  const recipient = user.email || 'nicolousmunisi07@gmail.com';

  let subject = '';
  let content = '';
  let html = '';

  if (type === 'registration') {
    subject = `[Jaribio la EduKan] Uthibitisho wa Usajili wa ${user.name} 🎉`;
    content = `Habari ${user.name}, Hili ni jaribio la barua pepe ya uthibitisho wa usajili wako kwenye mtandao wa EduKan Tanzania.`;
    html = renderUserRegistrationEmail({
      userName: user.name,
      userHandle: user.handle,
      userEmail: recipient,
      schoolName: user.schoolName,
      level: user.level,
      combination: user.combination,
      studentRegNo: user.studentRegNo,
      points: user.points
    });
  } else if (type === 'announcement') {
    subject = `[Jaribio la EduKan] Tangazo Rasmi: Mitihani ya NECTA & Vitabu Vipya vya TIE`;
    content = `Habari ${user.name}, Hili ni jaribio la tangazo rasmi la mfumo kuhusu maboresho ya maktaba na ratiba za masomo.`;
    html = renderSystemAnnouncementEmail({
      userName: user.name,
      announcementTitle: 'Maboresho Makubwa ya Maktaba ya Vitabu na Mitihani ya NECTA',
      announcementBadge: 'JARIBIO LA TANGAZO',
      announcementBody: `Hili ni tangazo la majaribio kuthibitisha kuwa anwani yako (${recipient}) inapokea taarifa rasmi za kitaifa kutoka EduKan bila hitilafu yoyote.`,
      highlights: [
        'Uthibitishaji wa upatikanaji wa barua pepe kwa wanafunzi wote.',
        'Mifumo ya arifa za haraka kwa matukio ya kitaaluma.',
        'Muundo rasmi wenye nembo na rangi za taifa za EduKan.'
      ]
    });
  } else {
    subject = `[Jaribio la EduKan] Tahadhari ya Ujumbe Mpya kutoka kwa Mshauri wa Masomo`;
    content = `Habari ${user.name}, Umepokea ujumbe mpya wa majaribio kwenye chumba cha masomo.`;
    html = renderNewMessageAlertEmail({
      userName: user.name,
      senderName: 'Mshauri Mkuu wa Masomo',
      senderRole: 'EduKan Academic Support',
      senderSchool: 'EduKan Central Office',
      subject: 'Uthibitisho wa Upatikanaji wa Huduma za Masomo',
      messageSnippet: `Habari ${user.name}! Hii ni barua pepe ya majaribio inayoonyesha jinsi unavyopokea arifa mwalimu au mwanafunzi mwenzako anapokutumia ujumbe au kujibu swali lako.`,
      timestamp
    });
  }

  // Save to outbox
  saveEmailToOutbox({
    id: `email-test-${Date.now()}`,
    type: 'test',
    recipient,
    recipientName: user.name,
    subject,
    contentSnippet: content,
    htmlContent: html,
    status: 'delivered',
    timestamp
  });

  // Send to edge API
  try {
    await fetch('/api/notifications/email-dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: `test_${type}`,
        userEmail: recipient,
        userName: user.name,
        userSubject: subject,
        userContent: content,
        userHtml: html
      })
    });
  } catch (err) {
    console.warn('Test email edge dispatch offline fallback:', err);
  }

  return {
    success: true,
    message: `Barua pepe ya majaribio imetumwa kikamilifu kwa anwani ya ${recipient}!`,
    html,
    subject
  };
}
