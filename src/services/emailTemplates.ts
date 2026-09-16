/**
 * EduKan Tanzania Professional HTML Email Templates
 * Brand Styling: Emerald Green (#064e3b, #047857, #059669), Tanzania Gold (#f59e0b, #d97706), Slate (#0f172a)
 * Formatted with inline styles for universal email client compatibility (Gmail, Outlook, Yahoo, Apple Mail).
 */

export interface UserRegistrationEmailParams {
  userName: string;
  userHandle: string;
  userEmail: string;
  schoolName: string;
  level: string;
  combination?: string;
  studentRegNo?: string;
  points?: number;
  loginUrl?: string;
  adminContact?: string;
}

export interface AdminRegistrationAlertParams {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  schoolName: string;
  schoolDistrict?: string;
  schoolRegion?: string;
  level: string;
  combination?: string;
  studentRegNo?: string;
  points?: number;
  timestamp: string;
  adminEmail?: string;
}

export interface SystemAnnouncementEmailParams {
  userName: string;
  announcementTitle: string;
  announcementBadge?: string;
  announcementBody: string;
  highlights?: string[];
  actionUrl?: string;
  actionText?: string;
  effectiveDate?: string;
  adminContact?: string;
}

export interface NewMessageAlertParams {
  userName: string;
  senderName: string;
  senderRole?: string;
  senderSchool?: string;
  senderAvatar?: string;
  subject?: string;
  messageSnippet: string;
  chatUrl?: string;
  timestamp?: string;
  adminContact?: string;
}

const COMMON_STYLES = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  primaryColor: '#059669',
  primaryDark: '#064e3b',
  accentGold: '#d97706',
  textColor: '#1e293b',
  mutedText: '#64748b',
  borderColor: '#e2e8f0',
  lightBg: '#f8fafc'
};

/**
 * 1. User Registration Confirmation & Welcome Email
 */
export function renderUserRegistrationEmail(params: UserRegistrationEmailParams): string {
  const {
    userName,
    userHandle,
    userEmail,
    schoolName,
    level,
    combination = 'Jumla ya Masomo',
    studentRegNo = 'S.2026/EDK-AUTO',
    points = 50,
    loginUrl = typeof window !== 'undefined' ? window.location.origin : 'https://edukan.tz',
    adminContact = 'nicolousmunisi07@gmail.com'
  } = params;

  return `
<!DOCTYPE html>
<html lang="sw">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Karibu EduKan Tanzania - Uthibitisho wa Usajili</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: ${COMMON_STYLES.fontFamily}; color: ${COMMON_STYLES.textColor}; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #064e3b 0%, #047857 60%, #0f766e 100%); padding: 36px 30px; text-align: center; color: #ffffff;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <!-- Brand Crest Badge -->
                    <div style="display: inline-block; background-color: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50px; padding: 6px 18px; margin-bottom: 14px;">
                      <span style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #fef08a;">🇹🇿 MAKTABA NA MTANDAO WA TAIFA</span>
                    </div>
                    <!-- Brand Name -->
                    <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">EduKan Tanzania</h1>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #a7f3d0; font-weight: 500;">Elimu Bora kwa Kila Mtanzania | Baraza la Masomo & Mitihani</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Welcome Celebration Subheader -->
          <tr>
            <td style="padding: 30px 30px 15px 30px; text-align: left;">
              <div style="background-color: #ecfdf5; border-left: 4px solid #059669; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #065f46;">🎉 Hongera na Karibu Kwenye Jumuiya ya Wasomi!</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #047857;">Akaunti yako imethibitishwa na kuunganishwa rasmi na shule yako ya <strong>${schoolName}</strong>.</p>
              </div>

              <h2 style="margin: 0 0 10px 0; font-size: 19px; font-weight: 700; color: #0f172a;">Habari Ndugu ${userName},</h2>
              <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 1.65; color: #334155;">
                Tunafurahi kukukaribisha kwenye mtandao mkuu wa kitaifa wa elimu. Kuanzia sasa una uwezo wa kupakua vitabu vya TIE, mitihani iliyotatuliwa ya NECTA, kuuliza maswali magumu, na kupata fursa za ufadhili (scholarships).
              </p>
            </td>
          </tr>

          <!-- Account Details Box -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 14px; border: 1px solid #e2e8f0; padding: 18px;">
                <tr>
                  <td style="padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Muhtasari wa Wasifu Wako</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size: 13px; color: #64748b; padding: 4px 0; width: 40%;">Jina Kamili:</td>
                        <td style="font-size: 13px; font-weight: 700; color: #0f172a; padding: 4px 0;">${userName}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #64748b; padding: 4px 0;">Jina la Utambulisho:</td>
                        <td style="font-size: 13px; font-weight: 700; color: #059669; padding: 4px 0;">@${userHandle}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #64748b; padding: 4px 0;">Barua Pepe:</td>
                        <td style="font-size: 13px; font-weight: 600; color: #0f172a; padding: 4px 0;">${userEmail}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #64748b; padding: 4px 0;">Shule / Kituo:</td>
                        <td style="font-size: 13px; font-weight: 700; color: #0f172a; padding: 4px 0;">${schoolName}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #64748b; padding: 4px 0;">Ngazi & Mchepuo:</td>
                        <td style="font-size: 13px; font-weight: 600; color: #0f172a; padding: 4px 0;">${level} (${combination})</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #64748b; padding: 4px 0;">Namba ya Usajili (Reg No):</td>
                        <td style="font-size: 13px; font-family: monospace; font-weight: 700; color: #0f172a; padding: 4px 0;">${studentRegNo}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #64748b; padding: 4px 0;">Pointi za Mwanzo:</td>
                        <td style="font-size: 13px; font-weight: 800; color: #d97706; padding: 4px 0;">⭐ +${points} pts (Knowledge Points)</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Quick Action Buttons -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 34px; border-radius: 12px; box-shadow: 0 4px 12px rgba(5,150,105,0.35);">
                Fungua Akaunti Yako & Anza Kusoma &rarr;
              </a>
              <p style="margin: 12px 0 0 0; font-size: 12px; color: #94a3b8;">
                Kiungo cha moja kwa moja: <a href="${loginUrl}" style="color: #059669; text-decoration: underline;">${loginUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Feature Highlights 3-Column Table -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
                <tr>
                  <td style="text-align: left; vertical-align: top; padding: 8px 10px 8px 0; width: 33%;">
                    <div style="font-size: 18px; margin-bottom: 4px;">📚</div>
                    <strong style="font-size: 12px; color: #0f172a; display: block;">Maktaba ya Taifa</strong>
                    <span style="font-size: 11px; color: #64748b; line-height: 1.4; display: block; margin-top: 2px;">NECTA past papers na vitabu vya kiada vya TIE.</span>
                  </td>
                  <td style="text-align: left; vertical-align: top; padding: 8px 10px; width: 33%;">
                    <div style="font-size: 18px; margin-bottom: 4px;">💡</div>
                    <strong style="font-size: 12px; color: #0f172a; display: block;">Maswali & Majibu</strong>
                    <span style="font-size: 11px; color: #64748b; line-height: 1.4; display: block; margin-top: 2px;">Uliza maswali na pata majibu ya kiwango cha juu.</span>
                  </td>
                  <td style="text-align: left; vertical-align: top; padding: 8px 0 8px 10px; width: 33%;">
                    <div style="font-size: 18px; margin-bottom: 4px;">🎓</div>
                    <strong style="font-size: 12px; color: #0f172a; display: block;">Scholarships</strong>
                    <span style="font-size: 11px; color: #64748b; line-height: 1.4; display: block; margin-top: 2px;">Fursa za udhamini wa vyuo na mafunzo kwa vitendo.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 26px 30px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: #f1f5f9; font-size: 12px;">EduKan Tanzania Education Platform</p>
              <p style="margin: 0 0 10px 0;">Barua pepe ya Utawala & Msaada: <a href="mailto:${adminContact}" style="color: #34d399; text-decoration: none;">${adminContact}</a></p>
              <p style="margin: 0; color: #64748b;">
                Ujumbe huu umetumwa kwa sababu anwani ya ${userEmail} imesajiliwa kwenye EduKan. 
                Unaweza kubadilisha mapendekezo ya arifa wakati wowote kupitia Wasifu &gt; Mipangilio ya Barua Pepe.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 2. Admin Alert Email for New User Registrations
 * Sent directly to nicolousmunisi07@gmail.com
 */
export function renderAdminRegistrationAlertEmail(params: AdminRegistrationAlertParams): string {
  const {
    userId,
    name,
    email,
    phone = 'Haijawekwa',
    role,
    schoolName,
    schoolDistrict = 'Kishapu',
    schoolRegion = 'Shinyanga',
    level,
    combination = 'Jumla',
    studentRegNo = 'S.2026/EDK-AUTO',
    points = 50,
    timestamp,
    adminEmail = 'nicolousmunisi07@gmail.com'
  } = params;

  return `
<!DOCTYPE html>
<html lang="sw">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Admin Alert] Usajili Mpya wa EduKan</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: ${COMMON_STYLES.fontFamily}; color: #334155; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 25px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #334155;">
          
          <!-- Admin Red/Amber Alert Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e293b 0%, #064e3b 100%); padding: 26px 24px; text-align: left; border-bottom: 3px solid #10b981;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; letter-spacing: 1px;">
                      ⚡ TAARIFA YA PAPO HAPO YA MTAWALA (ADMIN ALERT)
                    </span>
                    <h2 style="margin: 10px 0 2px 0; font-size: 20px; font-weight: 800; color: #ffffff;">Usajili Mpya: ${name}</h2>
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">EduKan Tanzania Registration Engine • Msimamizi Mkuu: ${adminEmail}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dossier Body -->
          <tr>
            <td style="padding: 24px 24px 15px 24px;">
              <p style="margin: 0 0 16px 0; font-size: 13px; line-height: 1.5; color: #475569;">
                Habari Msimamizi Mkuu <strong>Nicolous Munisi</strong>,<br>
                Mtumiaji mpya amekamilisha hatua za usajili kwenye jukwaa la EduKan Tanzania. Zifuatazo ni taarifa zake kamili zilizorekodiwa kwenye kanzidata:
              </p>

              <!-- Detailed Key Value Table -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 14px 18px; margin-bottom: 20px;">
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding: 5px 0; width: 42%;">Kitambulisho (User ID):</td>
                  <td style="font-size: 12px; font-family: monospace; font-weight: 700; color: #0f172a; padding: 5px 0;">${userId}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding: 5px 0;">Jina Kamili:</td>
                  <td style="font-size: 13px; font-weight: 700; color: #064e3b; padding: 5px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding: 5px 0;">Barua Pepe ya Mtumiaji:</td>
                  <td style="font-size: 12px; font-weight: 700; color: #0284c7; padding: 5px 0;">
                    <a href="mailto:${email}" style="color: #0284c7; text-decoration: underline;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding: 5px 0;">Namba ya Simu:</td>
                  <td style="font-size: 12px; font-weight: 600; color: #0f172a; padding: 5px 0;">${phone}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding: 5px 0;">Aina ya Akaunti (Role):</td>
                  <td style="font-size: 12px; font-weight: 700; color: #059669; padding: 5px 0; text-transform: uppercase;">${role}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding: 5px 0;">Shule / Taasisi:</td>
                  <td style="font-size: 12px; font-weight: 700; color: #0f172a; padding: 5px 0;">${schoolName}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding: 5px 0;">Mkoa & Wilaya:</td>
                  <td style="font-size: 12px; color: #334155; padding: 5px 0;">${schoolRegion} - ${schoolDistrict}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding: 5px 0;">Ngazi & Mchepuo:</td>
                  <td style="font-size: 12px; font-weight: 600; color: #334155; padding: 5px 0;">${level} (${combination})</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding: 5px 0;">Namba ya Usajili (Reg No):</td>
                  <td style="font-size: 12px; font-family: monospace; font-weight: 700; color: #0f172a; padding: 5px 0;">${studentRegNo}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding: 5px 0;">Pointi Zilizotolewa:</td>
                  <td style="font-size: 12px; font-weight: 800; color: #d97706; padding: 5px 0;">⭐ ${points} pts</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding: 5px 0;">Muda wa Tukio:</td>
                  <td style="font-size: 12px; font-family: monospace; color: #64748b; padding: 5px 0;">${timestamp}</td>
                </tr>
              </table>

              <!-- Quick action links for admin -->
              <div style="text-align: center; margin-bottom: 10px;">
                <a href="mailto:${email}?subject=Ukaribisho%20kutoka%20kwa%20Msimamizi%20wa%20EduKan" style="display: inline-block; background-color: #064e3b; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; padding: 10px 22px; border-radius: 8px; margin-right: 8px;">
                  Mtumie Barua Pepe Mtumiaji &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Admin Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; color: #64748b; font-size: 11px; border-top: 1px solid #e2e8f0;">
              EduKan Automated Security & Registration Webhook • Dispatch Target: <strong>${adminEmail}</strong>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 3. System Announcement & Platform Updates Email
 */
export function renderSystemAnnouncementEmail(params: SystemAnnouncementEmailParams): string {
  const {
    userName,
    announcementTitle,
    announcementBadge = 'MABORESHO YA MFUMO',
    announcementBody,
    highlights = [],
    actionUrl = 'https://edukan.tz',
    actionText = 'Fungua EduKan & Tazama Taarifa Kamili',
    effectiveDate = new Date().toLocaleDateString('sw-TZ', { dateStyle: 'long' }),
    adminContact = 'nicolousmunisi07@gmail.com'
  } = params;

  const highlightsHtml = highlights.length > 0
    ? `
      <div style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 16px; margin: 18px 0;">
        <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #065f46;">Mambo Muhimu Yaliyojumuishwa:</p>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6; color: #334155;">
          ${highlights.map(h => `<li style="margin-bottom: 6px;">${h}</li>`).join('')}
        </ul>
      </div>
    `
    : '';

  return `
<!DOCTYPE html>
<html lang="sw">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${announcementTitle} - EduKan Tanzania</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: ${COMMON_STYLES.fontFamily}; color: ${COMMON_STYLES.textColor}; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #064e3b 100%); padding: 32px 28px; text-align: left; color: #ffffff;">
              <span style="display: inline-block; background-color: #d97706; color: #ffffff; font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 50px; letter-spacing: 1px; margin-bottom: 10px;">
                📢 ${announcementBadge}
              </span>
              <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3;">
                ${announcementTitle}
              </h1>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">Tarehe ya Kutolewa: ${effectiveDate} • EduKan Tanzania</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 28px 28px 16px 28px;">
              <p style="margin: 0 0 14px 0; font-size: 14px; font-weight: 600; color: #0f172a;">
                Habari Ndugu ${userName},
              </p>
              <div style="font-size: 14px; line-height: 1.7; color: #334155; white-space: pre-line;">
                ${announcementBody}
              </div>

              ${highlightsHtml}
            </td>
          </tr>

          <!-- Action Button -->
          <tr>
            <td style="padding: 0 28px 30px 28px; text-align: center;">
              <a href="${actionUrl}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 13px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);">
                ${actionText} &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 22px 28px; text-align: center; color: #64748b; font-size: 11px; border-top: 1px solid #e2e8f0; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 700; color: #1e293b;">EduKan Tanzania • Idara ya Mawasiliano ya Umma</p>
              <p style="margin: 0 0 8px 0;">Mawasiliano: <a href="mailto:${adminContact}" style="color: #059669;">${adminContact}</a></p>
              <p style="margin: 0; color: #94a3b8;">
                Umepokea barua pepe hii kwa sababu umechagua kupokea matangazo ya mfumo. Unaweza kurekebisha mipangilio hii kwenye wasifu wako.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 4. New Message & Academic Alert Email
 */
export function renderNewMessageAlertEmail(params: NewMessageAlertParams): string {
  const {
    userName,
    senderName,
    senderRole = 'Mwanafunzi',
    senderSchool = 'EduKan Network',
    senderAvatar,
    subject = 'Ujumbe Mpya wa Kitaaluma',
    messageSnippet,
    chatUrl = 'https://edukan.tz',
    timestamp = new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' }),
    adminContact = 'nicolousmunisi07@gmail.com'
  } = params;

  return `
<!DOCTYPE html>
<html lang="sw">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ujumbe Mpya Kutoka kwa ${senderName} - EduKan</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: ${COMMON_STYLES.fontFamily}; color: ${COMMON_STYLES.textColor}; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #065f46 0%, #0d9488 100%); padding: 26px 28px; text-align: left; color: #ffffff;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: rgba(255,255,255,0.2); color: #ffffff; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 8px;">
                      💬 TAHADHARI YA MAONGEZI
                    </span>
                    <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff;">${subject}</h2>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #ccfbf1;">EduKan Tanzania Academic Chat Engine</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Card Body -->
          <tr>
            <td style="padding: 28px 28px 16px 28px;">
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569;">
                Habari <strong>${userName}</strong>, umepokea ujumbe mpya kutoka kwa mwanajumuiya wa EduKan:
              </p>

              <!-- Sender Profile Box & Snippet -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 14px; border: 1px solid #e2e8f0; padding: 18px; margin-bottom: 22px;">
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 46px; vertical-align: top;">
                          ${
                            senderAvatar
                              ? `<img src="${senderAvatar}" alt="${senderName}" width="42" height="42" style="border-radius: 50%; object-fit: cover; display: block; border: 2px solid #059669;">`
                              : `<div style="width: 42px; height: 42px; border-radius: 50%; background-color: #059669; color: #ffffff; font-weight: 700; text-align: center; line-height: 42px; font-size: 16px;">${senderName.charAt(0)}</div>`
                          }
                        </td>
                        <td style="padding-left: 12px; vertical-align: top;">
                          <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a;">${senderName}</h4>
                          <span style="font-size: 11px; color: #64748b;">${senderRole} • ${senderSchool}</span>
                        </td>
                        <td align="right" style="vertical-align: top;">
                          <span style="font-size: 11px; color: #94a3b8; font-family: monospace;">${timestamp}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Message Snippet -->
                <tr>
                  <td style="padding-top: 14px;">
                    <div style="background-color: #ffffff; border-radius: 10px; border-left: 3px solid #0d9488; padding: 14px 16px; font-size: 13px; line-height: 1.6; color: #1e293b; font-style: italic;">
                      "${messageSnippet}"
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action Button -->
          <tr>
            <td style="padding: 0 28px 28px 28px; text-align: center;">
              <a href="${chatUrl}" style="display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #065f46 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 13px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(13,148,136,0.3);">
                Fungua Chumba cha Soga & Jibu Sasa &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px 28px; text-align: center; color: #64748b; font-size: 11px; border-top: 1px solid #e2e8f0;">
              EduKan Tanzania • Msaada: <a href="mailto:${adminContact}" style="color: #0d9488;">${adminContact}</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generates sample previews for any template type
 */
export function getEmailTemplateSample(type: 'registration_user' | 'registration_admin' | 'system_announcement' | 'new_message'): {
  title: string;
  subject: string;
  recipient: string;
  html: string;
} {
  switch (type) {
    case 'registration_user':
      return {
        title: 'Uthibitisho wa Usajili wa Mwanafunzi (User Welcome & Confirmation)',
        subject: 'Hongera na Karibu EduKan Tanzania, Baraka Juma! Usajili Wako Umekamilika 🎉',
        recipient: 'baraka.juma@student.edukan.tz',
        html: renderUserRegistrationEmail({
          userName: 'Baraka Juma Mrema',
          userHandle: 'barakajuma',
          userEmail: 'baraka.juma@student.edukan.tz',
          schoolName: 'Ilboru Secondary School',
          level: 'Kidato cha V (Form 5)',
          combination: 'PCB (Physics, Chemistry, Biology)',
          studentRegNo: 'S.0108/0045/2026',
          points: 50
        })
      };

    case 'registration_admin':
      return {
        title: 'Taarifa ya Papo Hapo kwa Msimamizi Mkuu (Admin Registration Alert)',
        subject: '[EduKan Admin Alert] Usajili Mpya: Baraka Juma Mrema (STUDENT) - Ilboru Secondary School',
        recipient: 'nicolousmunisi07@gmail.com',
        html: renderAdminRegistrationAlertEmail({
          userId: 'usr-student-98214',
          name: 'Baraka Juma Mrema',
          email: 'baraka.juma@student.edukan.tz',
          phone: '+255 754 123 456',
          role: 'student',
          schoolName: 'Ilboru Secondary School',
          schoolDistrict: 'Arusha Mjini',
          schoolRegion: 'Arusha',
          level: 'Kidato cha V (Form 5)',
          combination: 'PCB',
          studentRegNo: 'S.0108/0045/2026',
          points: 50,
          timestamp: new Date().toLocaleString('sw-TZ', { dateStyle: 'full', timeStyle: 'short' }),
          adminEmail: 'nicolousmunisi07@gmail.com'
        })
      };

    case 'system_announcement':
      return {
        title: 'Matangazo & Maboresho Rasmi ya Mfumo (System Update / Announcement)',
        subject: 'Maboresho Makubwa ya EduKan: Mitihani ya NECTA 2015-2025 na Maswali Mapya ya Sayansi',
        recipient: 'mwanafunzi@edukan.tz',
        html: renderSystemAnnouncementEmail({
          userName: 'Mwanafunzi wa EduKan',
          announcementTitle: 'Maboresho Makubwa ya Maktaba ya Taifa ya Mitihani na Vitabu vya Kiada',
          announcementBadge: 'MABORESHO YA MFUMO WA MAKTABA',
          announcementBody: `Wanafunzi na walimu wote wa EduKan Tanzania,\n\nTunayo furaha kutangaza nyongeza ya zaidi ya mitihani 1,200 ya NECTA iliyotatuliwa na miongozo ya walimu kuanzia Kidato cha I hadi Chuo Kikuu. Vilevile mfumo mpya wa usomaji wa Quick View sasa umewashwa kwa watumiaji wote.`,
          highlights: [
            'Mitihani ya Form 4 & 6 ya NECTA kuanzia mwaka 2015 hadi 2025 yenye majibu kamili ya walimu wabobezi.',
            'Vitabu vipya vya kiada vilivyoidhinishwa na Taasisi ya Elimu Tanzania (TIE).',
            'Sehemu mpya ya kurekodi kurasa ulizosoma (Reading Progress Tracker) kwenye kila kitabu.',
            'Uwezo wa kuhifadhi vitabu kwenye alamisho (Saved Bookmark) kwa ajili ya kusoma nje ya mtandao.'
          ],
          actionText: 'Gundua Maktaba ya Vitabu Sasa'
        })
      };

    case 'new_message':
      return {
        title: 'Tahadhari ya Ujumbe Mpya & Maswali ya Masomo (New Message / Chat Alert)',
        subject: 'Ujumbe Mpya kutoka kwa Mwalimu Joseph Mwita: "Ufafanuzi wa Swali la Physics"',
        recipient: 'mwanafunzi@edukan.tz',
        html: renderNewMessageAlertEmail({
          userName: 'Baraka Juma Mrema',
          senderName: 'Mwl. Joseph Mwita',
          senderRole: 'Mwalimu Mwandamizi wa Fizikia',
          senderSchool: 'Kibaha Secondary School',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          subject: 'Ufafanuzi wa Swali la Thermodynamics & Newton\'s Laws',
          messageSnippet: 'Habari Baraka! Nimepitia jibu lako kwenye swali la Physics NECTA Paper 1. Ufafanuzi wako wa sheria ya pili ya Newton ni mzuri sana, ila hakikisha unajumuisha fomula ya msukumo (impulse) mwishoni ili upate alama zote 10.',
          timestamp: '14:30 EAT'
        })
      };
  }
}
