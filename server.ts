import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const AUTH_SECRET = process.env.AUTH_SECRET || 'edukan_server_secret_jwt_key_2026_super_secure';
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'nicolousmunisi07@gmail.com';

const USERS_FILE_PATH = path.join(process.cwd(), 'users_store.json');
const POSTS_FILE_PATH = path.join(process.cwd(), 'posts_store.json');
const AUDIT_FILE_PATH = path.join(process.cwd(), 'admin_actions_store.json');
const NOTIFICATIONS_FILE_PATH = path.join(process.cwd(), 'notifications_store.json');
const ANNOUNCEMENTS_FILE_PATH = path.join(process.cwd(), 'announcements_store.json');
const MESSAGES_FILE_PATH = path.join(process.cwd(), 'messages_store.json');
const MATERIALS_FILE_PATH = path.join(process.cwd(), 'materials_store.json');

// -------------------------------------------------------------
// Database Types
// -------------------------------------------------------------
export interface NotificationPreferences {
  newPosts: boolean;
  announcements: boolean;
  newMessages: boolean;
  studyMaterials: boolean;
  pushEnabled?: boolean;
}

export interface StoredUser {
  id: string;
  name: string;
  handle: string;
  email: string;
  phone?: string;
  passwordHash: string;
  salt: string;
  role: 'student' | 'admin';
  avatar: string;
  coverPhoto?: string;
  schoolId?: string;
  schoolName: string;
  schoolRegion: string;
  schoolDistrict: string;
  level: string;
  combination?: string;
  title?: string;
  bio: string;
  points: number;
  followersCount: number;
  followingCount: number;
  studentRegNo?: string;
  status: 'active' | 'suspended' | 'deactivated';
  notificationPreferences?: NotificationPreferences;
  createdAt: string;
  lastLoginAt?: string;
}

export interface SanitizedUser extends Omit<StoredUser, 'passwordHash' | 'salt'> {}

export interface StoredNotification {
  id: string;
  recipientId: string; // 'all' or specific userId
  type: 'post' | 'message' | 'announcement' | 'material' | 'system' | 'like' | 'comment';
  title: string;
  message: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  relatedPostId?: string;
  relatedMessageId?: string;
  relatedAnnouncementId?: string;
  relatedMaterialId?: string;
  createdAt: string;
  readBy: string[]; // List of user IDs who have read this
}

export interface StoredAnnouncement {
  id: string;
  title: string;
  message: string;
  priority: 'normal' | 'urgent' | 'exam';
  audience: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface StoredMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  recipientName: string;
  channelId?: string;
  content: string;
  attachment?: any;
  createdAt: string;
  readBy: string[];
}

export interface StoredMaterial {
  id: string;
  title: string;
  authorOrPublisher: string;
  level: string;
  category: string;
  classGrade: string;
  subject: string;
  coverImage?: string;
  downloadUrl: string;
  fileSize: string;
  fileFormat: string;
  year?: number;
  downloadsCount: number;
  description: string;
  uploaderId?: string;
  uploaderName: string;
  uploaderRole: string;
  uploaderSchool: string;
  createdAt: string;
  verified?: boolean;
}

export interface StoredAuditAction {
  id: string;
  action: string;
  target: string;
  adminId: string;
  adminName: string;
  timestamp: string;
  details?: any;
}

// -------------------------------------------------------------
// Cryptographic Helpers (Salted Hashes & Signed Bearer Tokens)
// -------------------------------------------------------------
function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password: string, salt: string, hash: string): boolean {
  try {
    const hashedAttempt = crypto.scryptSync(password, salt, 64).toString('hex');
    const hashBuf = Buffer.from(hash, 'hex');
    const attemptBuf = Buffer.from(hashedAttempt, 'hex');
    if (hashBuf.length !== attemptBuf.length) return false;
    return crypto.timingSafeEqual(hashBuf, attemptBuf);
  } catch (err) {
    console.error('Password verify error:', err);
    return false;
  }
}

function generateToken(payload: { userId: string; role: string; email: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // 30 days
    })
  ).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): { userId: string; role: string; email: string } | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

function sanitizeUser(user: StoredUser): SanitizedUser {
  const { passwordHash, salt, ...clean } = user;
  return clean;
}

// -------------------------------------------------------------
// Database Persistence Helpers
// -------------------------------------------------------------
function loadServerUsers(): StoredUser[] {
  try {
    if (fs.existsSync(USERS_FILE_PATH)) {
      const raw = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Could not read users_store.json:', err);
  }
  return [];
}

function saveServerUsers(users: StoredUser[]) {
  try {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write users_store.json:', err);
  }
}

function loadServerPosts(): any[] {
  try {
    if (fs.existsSync(POSTS_FILE_PATH)) {
      const raw = fs.readFileSync(POSTS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Could not read posts_store.json:', err);
  }
  return [];
}

function saveServerPosts(posts: any[]) {
  try {
    fs.writeFileSync(POSTS_FILE_PATH, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write posts_store.json:', err);
  }
}

function loadAuditLogs(): StoredAuditAction[] {
  try {
    if (fs.existsSync(AUDIT_FILE_PATH)) {
      const raw = fs.readFileSync(AUDIT_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Could not read admin_actions_store.json:', err);
  }
  return [];
}

function logAdminAction(adminId: string, adminName: string, action: string, target: string, details?: any) {
  try {
    const logs = loadAuditLogs();
    const entry: StoredAuditAction = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      action,
      target,
      adminId,
      adminName,
      timestamp: new Date().toISOString(),
      details
    };
    logs.unshift(entry);
    fs.writeFileSync(AUDIT_FILE_PATH, JSON.stringify(logs.slice(0, 300), null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not log admin action:', err);
  }
}

function loadServerNotifications(): StoredNotification[] {
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE_PATH)) {
      const raw = fs.readFileSync(NOTIFICATIONS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Could not read notifications_store.json:', err);
  }
  return [];
}

function saveServerNotifications(notifs: StoredNotification[]) {
  try {
    fs.writeFileSync(NOTIFICATIONS_FILE_PATH, JSON.stringify(notifs, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write notifications_store.json:', err);
  }
}

function broadcastNotification(params: {
  recipientId?: string; // 'all' or specific user ID
  type: 'post' | 'message' | 'announcement' | 'material' | 'system' | 'like' | 'comment';
  title: string;
  message: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  relatedPostId?: string;
  relatedMessageId?: string;
  relatedAnnouncementId?: string;
  relatedMaterialId?: string;
}): StoredNotification {
  const notifs = loadServerNotifications();
  const newNotif: StoredNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    recipientId: params.recipientId || 'all',
    type: params.type,
    title: params.title,
    message: params.message,
    senderId: params.senderId,
    senderName: params.senderName,
    senderAvatar: params.senderAvatar,
    relatedPostId: params.relatedPostId,
    relatedMessageId: params.relatedMessageId,
    relatedAnnouncementId: params.relatedAnnouncementId,
    relatedMaterialId: params.relatedMaterialId,
    createdAt: new Date().toISOString(),
    readBy: []
  };

  notifs.unshift(newNotif);
  saveServerNotifications(notifs.slice(0, 500));
  console.log(`🔔 [NOTIFICATION DISPATCHED] [${params.type.toUpperCase()}] "${params.title}" -> ${params.recipientId || 'all'}`);
  return newNotif;
}

function loadServerAnnouncements(): StoredAnnouncement[] {
  try {
    if (fs.existsSync(ANNOUNCEMENTS_FILE_PATH)) {
      const raw = fs.readFileSync(ANNOUNCEMENTS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Could not read announcements_store.json:', err);
  }
  return [];
}

function saveServerAnnouncements(announcements: StoredAnnouncement[]) {
  try {
    fs.writeFileSync(ANNOUNCEMENTS_FILE_PATH, JSON.stringify(announcements, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write announcements_store.json:', err);
  }
}

function loadServerMessages(): StoredMessage[] {
  try {
    if (fs.existsSync(MESSAGES_FILE_PATH)) {
      const raw = fs.readFileSync(MESSAGES_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Could not read messages_store.json:', err);
  }
  return [];
}

function saveServerMessages(messages: StoredMessage[]) {
  try {
    fs.writeFileSync(MESSAGES_FILE_PATH, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write messages_store.json:', err);
  }
}

function loadServerMaterials(): StoredMaterial[] {
  try {
    if (fs.existsSync(MATERIALS_FILE_PATH)) {
      const raw = fs.readFileSync(MATERIALS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Could not read materials_store.json:', err);
  }
  return [];
}

function saveServerMaterials(materials: StoredMaterial[]) {
  try {
    fs.writeFileSync(MATERIALS_FILE_PATH, JSON.stringify(materials, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write materials_store.json:', err);
  }
}

// Initial Data Seeders
function seedInitialServerData() {
  // 1. Seed initial announcements if empty
  const announcements = loadServerAnnouncements();
  if (announcements.length === 0) {
    const initialAnnouncement: StoredAnnouncement = {
      id: 'ann-init-001',
      title: 'Karibu Edu-Kan Tanzania - Jukwaa Rasmi la Kitaifa',
      message: 'Karibu kwenye mtandao wa Edu-Kan Tanzania. Hapa utapata vitabu vya kiada vya TIE, mitihani ya NECTA, majadiliano ya kitaaluma, na fursa za ufadhili wa masomo.',
      priority: 'normal',
      audience: 'Wanafunzi Wote Tanzania',
      authorId: 'usr-admin-master',
      authorName: 'Nicolous Munisi',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    };
    announcements.push(initialAnnouncement);
    saveServerAnnouncements(announcements);
  }

  // 2. Seed initial notifications if empty
  const notifs = loadServerNotifications();
  if (notifs.length === 0) {
    notifs.push(
      {
        id: 'notif-welcome-system',
        recipientId: 'all',
        type: 'announcement',
        title: 'New Edu-Kan announcement',
        message: 'Mfumo wa Edu-Kan sasa umefunguliwa kwa wanafunzi wote wa shule za msingi, sekondari na vyuo vikuu nchini Tanzania.',
        senderId: 'usr-admin-master',
        senderName: 'Nicolous Munisi',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        readBy: []
      },
      {
        id: 'notif-material-welcome',
        recipientId: 'all',
        type: 'material',
        title: 'New study material has been added',
        message: 'NECTA Biology Form 6 Past Papers & Mark Schemes 2025 sasa inapatikana kwenye Maktaba ya Kidijitali.',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        readBy: []
      }
    );
    saveServerNotifications(notifs);
  }

  // 3. Seed initial materials if empty
  const materials = loadServerMaterials();
  if (materials.length === 0) {
    const seedMaterials: StoredMaterial[] = [
      {
        id: 'mat-necta-bio-2025',
        title: 'NECTA Biology Paper 1 & 2 (Form VI) - 2025 Solved Exam',
        authorOrPublisher: 'Baraza la Mitihani la Taifa (NECTA)',
        level: 'A-Level',
        category: 'Mitihani ya NECTA',
        classGrade: 'Kidato cha 6',
        subject: 'Biology',
        coverImage: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=400&auto=format&fit=crop&q=80',
        downloadUrl: '/downloads/necta_biology_2025_form6_solved.pdf',
        fileSize: '4.8 MB',
        fileFormat: 'PDF',
        year: 2025,
        downloadsCount: 142,
        description: 'Mtihani kamili wa taifa wa Kidato cha Sita (NECTA 2025) ukiwa na maswali yote na mwongozo wa masahihisho (Marking Scheme).',
        uploaderName: 'NECTA Official Repository',
        uploaderRole: 'admin',
        uploaderSchool: 'Edu-Kan Tanzania Central Administration',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        verified: true
      },
      {
        id: 'mat-tie-math-adv',
        title: 'TIE Advanced Mathematics Textbook - Form 5 & 6',
        authorOrPublisher: 'Taasisi ya Elimu Tanzania (TIE)',
        level: 'A-Level',
        category: 'Vitabu vya Masomo',
        classGrade: 'Kidato cha 5 & 6',
        subject: 'Mathematics',
        coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&auto=format&fit=crop&q=80',
        downloadUrl: '/downloads/tie_advanced_mathematics_form5_6.pdf',
        fileSize: '12.4 MB',
        fileFormat: 'PDF',
        year: 2024,
        downloadsCount: 389,
        description: 'Kitabu rasmi cha kiada cha Taasisi ya Elimu Tanzania (TIE) kinachofunika Calculus, Coordinate Geometry, Trigonometry na Algebra.',
        uploaderName: 'TIE Tanzania',
        uploaderRole: 'admin',
        uploaderSchool: 'Tanzania Institute of Education',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        verified: true
      },
      {
        id: 'mat-chem-organic-notes',
        title: 'Organic Chemistry & Reaction Mechanisms Comprehensive Notes',
        authorOrPublisher: 'Tanzania Science Teachers Association',
        level: 'A-Level',
        category: 'Notisi za Masomo',
        classGrade: 'Kidato cha 5 & 6',
        subject: 'Chemistry',
        coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80',
        downloadUrl: '/downloads/organic_chemistry_notes_2025.pdf',
        fileSize: '3.1 MB',
        fileFormat: 'PDF',
        year: 2025,
        downloadsCount: 215,
        description: 'Notisi fupi na zenye michoro ya kina inayoelezea mechanisms za SN1, SN2, Electrophilic Addition, na Spectroscopy.',
        uploaderName: 'Mwl. Daudi Mussa',
        uploaderRole: 'student',
        uploaderSchool: 'Ilaborabora High School',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        verified: true
      },
      {
        id: 'mat-gs-philosophy-guide',
        title: 'General Studies Form VI - Philosophy, National Ethics & Development',
        authorOrPublisher: 'Edu-Kan Academic Panel',
        level: 'A-Level',
        category: 'Notisi za Masomo',
        classGrade: 'Kidato cha 6',
        subject: 'General Studies',
        coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&auto=format&fit=crop&q=80',
        downloadUrl: '/downloads/general_studies_philosophy_notes.pdf',
        fileSize: '2.5 MB',
        fileFormat: 'PDF',
        year: 2025,
        downloadsCount: 98,
        description: 'Miongozo ya kujibu maswali ya insha katika somo la General Studies (GS) Form 6 kuhusu Falsafa, Maadili ya Kitaifa na Sayansi na Teknolojia.',
        uploaderName: 'Edu-Kan Academic Panel',
        uploaderRole: 'admin',
        uploaderSchool: 'Edu-Kan Central Network',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        verified: true
      }
    ];
    saveServerMaterials(seedMaterials);
  }

  // 4. Seed initial posts if empty so feed is rich for visitors & users
  const posts = loadServerPosts();
  if (posts.length === 0) {
    const seedPosts = [
      {
        id: 'post-seed-001',
        author: {
          id: 'usr-admin-master',
          name: 'Nicolous Munisi',
          handle: 'nicolous_admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          school: 'EduKan Tanzania Central Administration',
          role: 'admin',
          verified: true
        },
        type: 'normal',
        category: 'masomo',
        content: 'Karibuni wanafunzi wote wa Tanzania kwenye mfumo mpya wa Edu-Kan! Maktaba yetu ina vitabu vya bure vya TIE na mitihani yote ya NECTA iliyotatuliwa. Jisajili au ingia ili uweze kuchapisha maswali na kupakua nyaraka zote za masomo.',
        subject: 'Masomo ya Jumla',
        mediaUrl: null,
        mediaType: null,
        pollOptions: null,
        likes: 18,
        likedBy: [],
        commentsCount: 3,
        sharesCount: 5,
        isSaved: false,
        isPinned: true,
        comments: [
          {
            id: 'comm-init-1',
            postId: 'post-seed-001',
            author: {
              id: 'usr-grace-mrema',
              name: 'Dr. Grace Mrema',
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
              school: 'Ilala Secondary School',
              role: 'student'
            },
            content: 'Hongera sana kwa uboreshaji huu. Huu ni msaada mkubwa kwa wanafunzi wanaojiandaa na mitihani ya NECTA!',
            createdAt: 'Masaa 2 yaliyopita',
            likes: 4,
            isLiked: false
          }
        ],
        schoolName: 'EduKan Tanzania Central Administration',
        createdAt: 'Masaa machache yaliyopita'
      },
      {
        id: 'post-seed-002',
        author: {
          id: 'usr-grace-mrema',
          name: 'Dr. Grace Mrema',
          handle: 'grace_biology',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
          school: 'Ilala Secondary School',
          role: 'student',
          verified: true
        },
        type: 'question',
        category: 'masomo',
        content: 'Katika somo la Biology Form VI (Genetics & Mendelian Inheritance): Ni mambo gani muhimu ya kuzingatia wakati wa kuelezea Dihybrid Cross na Epistasis katika mtihani wa NECTA? Wanafunzi wengi wanakosa alama kwenye Punnett square layout.',
        subject: 'Biology',
        mediaUrl: null,
        mediaType: null,
        pollOptions: null,
        likes: 12,
        likedBy: [],
        commentsCount: 1,
        sharesCount: 2,
        isSaved: false,
        comments: [],
        schoolName: 'Ilala Secondary School',
        createdAt: 'Masaa 4 yaliyopita'
      },
      {
        id: 'post-seed-003',
        author: {
          id: 'usr-samwel-math',
          name: 'Mwl. Samwel Mshana',
          handle: 'samwel_bam',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          school: 'Kibaha Secondary School',
          role: 'student',
          verified: true
        },
        type: 'normal',
        category: 'masomo',
        content: 'NECTA Advanced Mathematics Tips: Hakikisha unajua derivatives za trigonometric functions (sin, cos, tan, sec) na integration by parts. Maswali ya Form 6 Paper 1 yanajirudia kila mwaka!',
        subject: 'Mathematics',
        mediaUrl: null,
        mediaType: null,
        pollOptions: null,
        likes: 24,
        likedBy: [],
        commentsCount: 0,
        sharesCount: 6,
        isSaved: false,
        comments: [],
        schoolName: 'Kibaha Secondary School',
        createdAt: 'Jana'
      }
    ];
    saveServerPosts(seedPosts);
  }
}

// -------------------------------------------------------------
// Master Administrator Bootstrap
// Automatically provisions verified master administrator
// -------------------------------------------------------------
function bootstrapAdminUser(): StoredUser {
  const users = loadServerUsers();
  const existingAdmin = users.find(u => u.role === 'admin' || u.email.toLowerCase() === ADMIN_NOTIFICATION_EMAIL.toLowerCase());

  if (existingAdmin) {
    if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      saveServerUsers(users);
    }
    return existingAdmin;
  }

  const defaultAdminPass = process.env.ADMIN_PASSWORD || '@EduKan#26admin';
  const { salt, hash } = hashPassword(defaultAdminPass);

  const masterAdmin: StoredUser = {
    id: 'usr-admin-master',
    name: 'Nicolous Munisi',
    handle: 'nicolous_admin',
    email: ADMIN_NOTIFICATION_EMAIL,
    phone: '+255 700 000 000',
    passwordHash: hash,
    salt,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    title: 'Msimamizi Mkuu wa Mfumo (Lead Administrator)',
    schoolName: 'EduKan Tanzania Central Administration',
    schoolRegion: 'Dar es Salaam',
    schoolDistrict: 'Ilala',
    level: 'System Administrator',
    combination: 'Full Administrative Privileges',
    bio: 'Msimamizi Mkuu wa Mfumo wa EduKan Tanzania. Mwenye mamlaka ya kusimamia watumiaji, machapisho na huduma za kielektroniki.',
    points: 5000,
    followersCount: 0,
    followingCount: 0,
    studentRegNo: 'ADMIN-TZ-001',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  users.unshift(masterAdmin);
  saveServerUsers(users);
  console.log(`🛡️ [ADMIN BOOTSTRAP] Master Administrator initialized (${ADMIN_NOTIFICATION_EMAIL})`);
  return masterAdmin;
}

// -------------------------------------------------------------
// Transactional Email Dispatch Helper
// Automatically dispatches notification to Administrator on new registration
// -------------------------------------------------------------
async function dispatchAdminRegistrationAlert(newUser: SanitizedUser) {
  const now = new Date().toISOString();
  const subject = `[EduKan Alert] New User Registration: ${newUser.name}`;
  const textContent = `New Edu-Kan Registration

A new user has registered on Edu-Kan:

* Full Name: ${newUser.name}
* Handle: @${newUser.handle}
* Email: ${newUser.email}
* Role: ${newUser.role}
* School: ${newUser.schoolName}
* Level / Class: ${newUser.level} ${newUser.combination ? `(${newUser.combination})` : ''}
* Registration Date: ${newUser.createdAt}
* Account Status: ${newUser.status}

This is an automated notification from the Edu-Kan platform.`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="background: #047857; color: white; padding: 16px 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 20px;">🎓 Edu-Kan Admin Notification</h2>
        <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">New Student Registration Alert</p>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 15px; color: #1e293b; margin-top: 0;">A new user has successfully registered on <strong>Edu-Kan</strong>:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569; width: 140px;">Full Name:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${newUser.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Email Address:</td>
            <td style="padding: 10px 0; color: #0f172a;"><a href="mailto:${newUser.email}">${newUser.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">School / Institution:</td>
            <td style="padding: 10px 0; color: #0f172a;">${newUser.schoolName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Academic Level:</td>
            <td style="padding: 10px 0; color: #0f172a;">${newUser.level} ${newUser.combination ? `(${newUser.combination})` : ''}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Assigned Role:</td>
            <td style="padding: 10px 0; color: #047857; font-weight: bold;">${newUser.role.toUpperCase()}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Registration Time:</td>
            <td style="padding: 10px 0; color: #0f172a;">${newUser.createdAt}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Account Status:</td>
            <td style="padding: 10px 0; color: #059669; font-weight: bold;">${newUser.status.toUpperCase()}</td>
          </tr>
        </table>
        <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">You can review and manage this student's profile directly from the Edu-Kan Admin Console.</p>
      </div>
    </div>
  `;

  // 1. Resend API
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'EduKan Tanzania <notifications@edukan.tz>',
          to: [ADMIN_NOTIFICATION_EMAIL],
          subject,
          text: textContent,
          html: htmlContent
        })
      });
      console.log(`📧 [ADMIN EMAIL ALERT] Successfully sent via Resend to ${ADMIN_NOTIFICATION_EMAIL}`);
      return;
    } catch (err) {
      console.warn('Resend notification dispatch note:', err);
    }
  }

  // 2. EmailJS relay
  const emailjsServiceId = process.env.EMAILJS_SERVICE_ID;
  const emailjsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
  const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY;
  const emailjsPrivateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (emailjsServiceId && emailjsTemplateId && (emailjsPublicKey || emailjsPrivateKey)) {
    try {
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailjsServiceId,
          template_id: emailjsTemplateId,
          user_id: emailjsPublicKey,
          accessToken: emailjsPrivateKey,
          template_params: {
            to_email: ADMIN_NOTIFICATION_EMAIL,
            to_name: 'EduKan Administrator',
            subject,
            message_html: htmlContent,
            user_name: newUser.name,
            user_school: newUser.schoolName
          }
        })
      });
      console.log(`📧 [ADMIN EMAIL ALERT] Successfully sent via EmailJS to ${ADMIN_NOTIFICATION_EMAIL}`);
      return;
    } catch (err) {
      console.warn('EmailJS notification dispatch note:', err);
    }
  }

  // 3. FormSubmit webhook relay (guarantees direct delivery to Admin's Gmail without requiring API keys)
  try {
    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(ADMIN_NOTIFICATION_EMAIL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        Event: 'New Edu-Kan User Registration',
        Student_Name: newUser.name,
        Student_Email: newUser.email,
        School: newUser.schoolName,
        Academic_Level: `${newUser.level} ${newUser.combination || ''}`,
        Account_Status: newUser.status,
        Registered_At: now
      })
    });
    console.log(`📧 [ADMIN EMAIL ALERT] Dispatched to ${ADMIN_NOTIFICATION_EMAIL} via FormSubmit relay`);
  } catch (err) {
    console.warn('Admin email webhook relay note:', err);
  }
}

// -------------------------------------------------------------
// Express Authentication Middlewares
// -------------------------------------------------------------
export interface AuthRequest extends Request {
  user?: SanitizedUser;
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Uthibitisho unahitajika. Tafadhali ingia kwenye akaunti.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Kipindi chako kimemalizika au si sahihi. Tafadhali ingia tena.' });
  }

  const users = loadServerUsers();
  const user = users.find(u => u.id === decoded.userId);

  if (!user) {
    return res.status(401).json({ error: 'Akaunti haipatikani kwenye mfumo.' });
  }

  if (user.status === 'deactivated' || user.status === 'suspended') {
    return res.status(403).json({ error: 'Akaunti yako imezimwa au kusimamishwa na Msimamizi.' });
  }

  req.user = sanitizeUser(user);
  next();
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  authenticateToken(req, res, () => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Mamlaka ya kiutawala (Admin Access) yanahitajika kutekeleza kitendo hiki.' });
    }
    next();
  });
}

function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    req.user = undefined;
    return next();
  }
  const decoded = verifyToken(token);
  if (decoded) {
    const users = loadServerUsers();
    const user = users.find(u => u.id === decoded.userId);
    if (user && user.status === 'active') {
      req.user = sanitizeUser(user);
    }
  }
  next();
}

// -------------------------------------------------------------
// Lazy Gemini AI Client Initialization
// -------------------------------------------------------------
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// -------------------------------------------------------------
// Server Bootstrap
// -------------------------------------------------------------
async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // Initialize master admin
  bootstrapAdminUser();
  seedInitialServerData();

  // -------------------------------------------------------------
  // Health check endpoint
  // -------------------------------------------------------------
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'EduKan Tanzania Full-Stack Backend',
      adminEmail: ADMIN_NOTIFICATION_EMAIL,
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString()
    });
  });

  // =============================================================
  // AUTHENTICATION API - Real Database User Registration & Login
  // =============================================================

  // POST /api/auth/register - Register new student or admin
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        password,
        phone,
        schoolName,
        schoolRegion,
        schoolDistrict,
        level,
        combination,
        title,
        bio,
        role: requestedRole,
        adminCode
      } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'Tafadhali andika jina lako kamili.' });
      }

      if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({ error: 'Tafadhali weka barua pepe sahihi.' });
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Nenosiri linapaswa kuwa na angalau herufi sita (6).' });
      }

      const users = loadServerUsers();
      const normalizedEmail = email.trim().toLowerCase();

      // Check if user already exists
      const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (existing) {
        return res.status(400).json({ error: 'Barua pepe hii tayari imesajiliwa. Tafadhali ingia kwenye akaunti yako.' });
      }

      // Security check: Only allow admin role if email matches ADMIN_NOTIFICATION_EMAIL or valid master adminCode
      let resolvedRole: 'student' | 'admin' = 'student';
      if (requestedRole === 'admin' || normalizedEmail === ADMIN_NOTIFICATION_EMAIL.toLowerCase()) {
        const expectedCode = process.env.ADMIN_SECRET_CODE || '@EduKan#26admin';
        if (adminCode === expectedCode || normalizedEmail === ADMIN_NOTIFICATION_EMAIL.toLowerCase()) {
          resolvedRole = 'admin';
        }
      }

      const { salt, hash } = hashPassword(password);
      const userId = `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const cleanHandle = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 18) || `student_${Date.now().toString().slice(-4)}`;

      // Generate consistent Dicebear avatar based on real user name
      const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=047857&textColor=ffffff`;

      const newUser: StoredUser = {
        id: userId,
        name: name.trim(),
        handle: cleanHandle,
        email: normalizedEmail,
        phone: phone ? String(phone).trim() : undefined,
        passwordHash: hash,
        salt,
        role: resolvedRole,
        avatar: avatarUrl,
        schoolName: schoolName ? String(schoolName).trim() : 'EduKan Network School',
        schoolRegion: schoolRegion ? String(schoolRegion).trim() : 'Tanzania',
        schoolDistrict: schoolDistrict ? String(schoolDistrict).trim() : '',
        level: level ? String(level).trim() : 'Kidato cha V - VI (A-Level)',
        combination: combination ? String(combination).trim() : 'Sayansi',
        title: title ? String(title).trim() : (resolvedRole === 'admin' ? 'Msimamizi Mkuu' : 'Mwanafunzi'),
        bio: bio ? String(bio).trim() : 'Mwanafunzi mwenye bidii katika mtandao wa EduKan Tanzania.',
        points: 100, // Welcome EduPoints
        followersCount: 0,
        followingCount: 0,
        studentRegNo: `S.${Math.floor(1000 + Math.random() * 9000)}/${Math.floor(100 + Math.random() * 900)}/${new Date().getFullYear()}`,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      users.unshift(newUser);
      saveServerUsers(users);

      const sanitized = sanitizeUser(newUser);
      const token = generateToken({ userId: newUser.id, role: newUser.role, email: newUser.email });

      console.log(`👤 [NEW REAL USER REGISTERED] ${newUser.name} (${newUser.email}) - Role: ${newUser.role}`);

      // Fire and forget email notification to administrator
      dispatchAdminRegistrationAlert(sanitized).catch(e => console.warn('Email dispatch failed:', e));

      return res.status(201).json({
        success: true,
        message: 'Akaunti imesajiliwa kikamilifu!',
        token,
        user: sanitized
      });
    } catch (err: any) {
      console.error('Registration server error:', err);
      return res.status(500).json({ error: 'Hitilafu ya seva wakati wa usajili. Tafadhali jaribu tena.', details: err?.message });
    }
  });

  // POST /api/auth/login - Authenticate with real database credentials
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res.status(400).json({ error: 'Tafadhali jaza barua pepe au jina la mtumiaji na nenosiri.' });
      }

      const users = loadServerUsers();
      const idClean = identifier.trim().toLowerCase();

      // Find user by email or handle
      const user = users.find(u => u.email.toLowerCase() === idClean || u.handle.toLowerCase() === idClean);

      if (!user) {
        return res.status(401).json({ error: 'Barua pepe au jina la mtumiaji halijapatikana. Tafadhali jisajili kwanza.' });
      }

      // Check account status
      if (user.status === 'deactivated' || user.status === 'suspended') {
        return res.status(403).json({ error: 'Akaunti yako imezimwa au kusimamishwa na Msimamizi. Wasiliana nasi kwa msaada.' });
      }

      // Verify salted password hash
      const isValid = verifyPassword(password, user.salt, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: 'Nenosiri si sahihi. Tafadhali jaribu tena.' });
      }

      // Update last login timestamp
      user.lastLoginAt = new Date().toISOString();
      saveServerUsers(users);

      const token = generateToken({ userId: user.id, role: user.role, email: user.email });
      const sanitized = sanitizeUser(user);

      console.log(`🔐 [LOGIN SUCCESS] ${user.name} (${user.email})`);

      return res.json({
        success: true,
        message: 'Umeingia kikamilifu!',
        token,
        user: sanitized
      });
    } catch (err: any) {
      console.error('Login server error:', err);
      return res.status(500).json({ error: 'Hitilafu ya seva wakati wa kuingia.', details: err?.message });
    }
  });

  // GET /api/auth/me - Validate token and retrieve authenticated user profile
  app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
    return res.json({
      success: true,
      user: req.user
    });
  });

  // PUT /api/auth/profile - Update real profile for authenticated user
  app.put('/api/auth/profile', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const users = loadServerUsers();
      const userIndex = users.findIndex(u => u.id === req.user!.id);
      if (userIndex === -1) {
        return res.status(404).json({ error: 'Mtumiaji hajapatikana.' });
      }

      const { name, bio, schoolName, level, combination, title, avatar, phone } = req.body;
      const target = users[userIndex];

      if (name && typeof name === 'string' && name.trim()) target.name = name.trim();
      if (bio !== undefined) target.bio = String(bio).trim();
      if (schoolName) target.schoolName = String(schoolName).trim();
      if (level) target.level = String(level).trim();
      if (combination) target.combination = String(combination).trim();
      if (title) target.title = String(title).trim();
      if (avatar) target.avatar = String(avatar).trim();
      if (phone !== undefined) target.phone = String(phone).trim();

      saveServerUsers(users);
      return res.json({
        success: true,
        message: 'Wasifu umesasishwa kikamilifu!',
        user: sanitizeUser(target)
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Hitilafu wakati wa kusasisha wasifu.', details: err?.message });
    }
  });

  // POST /api/auth/logout - Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    return res.json({ success: true, message: 'Umetoka kwenye akaunti kwa usalama.' });
  });

  // =============================================================
  // POSTS API - Shared Persistent Global Posts
  // Real posts saved to posts_store.json with real author resolution
  // =============================================================

  // GET /api/posts - Global feed visible to all authenticated users & guests
  app.get('/api/posts', optionalAuth, (req: AuthRequest, res: Response) => {
    const rawPosts = loadServerPosts();
    const users = loadServerUsers();

    // Dynamically resolve real author details if the author exists in users_store
    const synchronizedPosts = rawPosts.map(p => {
      if (p.author && p.author.id) {
        const matchingUser = users.find(u => u.id === p.author.id);
        if (matchingUser) {
          return {
            ...p,
            author: {
              ...p.author,
              name: matchingUser.name,
              handle: matchingUser.handle,
              avatar: matchingUser.avatar,
              role: matchingUser.role,
              verified: matchingUser.role === 'admin' ? true : p.author.verified
            }
          };
        }
      }
      return p;
    });

    return res.json({
      success: true,
      posts: synchronizedPosts,
      total: synchronizedPosts.length
    });
  });

  // POST /api/posts - Create post from real authenticated account
  app.post('/api/posts', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const p = req.body;
      const currentUser = req.user!;

      if (!p || (!p.content && !p.mediaUrl && !p.pollOptions)) {
        return res.status(400).json({ error: 'Maudhui ya chapisho yanahitajika kabla ya kuchapisha.' });
      }

      const now = new Date();
      const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const currentPosts = loadServerPosts();

      const newPost = {
        id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          handle: currentUser.handle,
          avatar: currentUser.avatar,
          school: currentUser.schoolName,
          role: currentUser.role,
          verified: currentUser.role === 'admin'
        },
        type: p.type || 'normal',
        category: p.category || 'masomo',
        content: p.content || (p.mediaUrl ? 'Kiambatisho cha faili/picha ya masomo' : ''),
        subject: p.subject || (p.type === 'question' ? 'Akademia' : 'Masomo ya Jumla'),
        mediaUrl: p.mediaUrl || null,
        mediaType: p.mediaType || null,
        pollOptions: Array.isArray(p.pollOptions) ? p.pollOptions : null,
        likes: 0,
        isLiked: false,
        likedBy: [],
        commentsCount: 0,
        sharesCount: 0,
        isSaved: false,
        comments: [],
        schoolId: currentUser.schoolId || null,
        schoolName: currentUser.schoolName,
        createdAt: `Sasa hivi (${timeFormatted})`,
        serverCreatedAt: now.toISOString()
      };

      currentPosts.unshift(newPost);
      saveServerPosts(currentPosts);

      // Award +5 EduPoints to the posting user
      const users = loadServerUsers();
      const authorUser = users.find(u => u.id === currentUser.id);
      if (authorUser) {
        authorUser.points = (authorUser.points || 0) + 5;
        saveServerUsers(users);
      }

      // Trigger notification for all other Edu-Kan users
      broadcastNotification({
        recipientId: 'all',
        type: 'post',
        title: 'New post available',
        message: `${currentUser.name} (${currentUser.schoolName}): "${(newPost.content || '').slice(0, 60)}"`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        relatedPostId: newPost.id
      });

      console.log(`📝 [NEW POST PUBLISHED] "${newPost.content.slice(0, 45)}..." by ${currentUser.name} (${newPost.id})`);

      return res.status(201).json({
        success: true,
        post: newPost,
        total: currentPosts.length,
        message: 'Chapisho limepandishwa kikamilifu na linaonekana kwa kila mtu!'
      });
    } catch (err: any) {
      console.error('Error creating post on server:', err);
      return res.status(500).json({ error: 'Hitilafu wakati wa kupakia chapisho', details: err?.message });
    }
  });

  // POST /api/posts/:id/like - Like or unlike a post
  app.post('/api/posts/:id/like', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const posts = loadServerPosts();
      const target = posts.find(p => p.id === id);

      if (!target) {
        return res.status(404).json({ error: 'Chapisho halijapatikana.' });
      }

      if (!Array.isArray(target.likedBy)) {
        target.likedBy = [];
      }

      const alreadyLiked = target.likedBy.includes(userId);
      if (alreadyLiked) {
        target.likedBy = target.likedBy.filter((uid: string) => uid !== userId);
        target.likes = Math.max(0, (target.likes || 1) - 1);
      } else {
        target.likedBy.push(userId);
        target.likes = (target.likes || 0) + 1;
      }

      saveServerPosts(posts);
      return res.json({ success: true, likes: target.likes, isLiked: !alreadyLiked });
    } catch (err) {
      return res.status(500).json({ error: 'Hitilafu ya Like' });
    }
  });

  // POST /api/posts/:id/comments - Add comment to post
  app.post('/api/posts/:id/comments', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const currentUser = req.user!;

      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Maudhui ya maoni yanahitajika.' });
      }

      const posts = loadServerPosts();
      const target = posts.find(p => p.id === id);

      if (!target) {
        return res.status(404).json({ error: 'Chapisho halijapatikana.' });
      }

      if (!Array.isArray(target.comments)) target.comments = [];

      const newComment = {
        id: `comm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        postId: id,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          school: currentUser.schoolName,
          role: currentUser.role
        },
        content: content.trim(),
        createdAt: 'Sasa hivi',
        likes: 0,
        isLiked: false
      };

      target.comments.push(newComment);
      target.commentsCount = target.comments.length;
      saveServerPosts(posts);

      // Trigger notification for the author if different user
      if (target.author && target.author.id && target.author.id !== currentUser.id) {
        broadcastNotification({
          recipientId: target.author.id,
          type: 'comment',
          title: `Maoni mapya kutoka kwa ${currentUser.name}`,
          message: `"${content.trim().slice(0, 60)}" kwenye chapisho lako`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          relatedPostId: target.id
        });
      }

      return res.json({ success: true, comment: newComment, post: target });
    } catch (err) {
      return res.status(500).json({ error: 'Hitilafu ya maoni' });
    }
  });

  // POST /api/posts/:id/poll - Vote in poll
  app.post('/api/posts/:id/poll', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { optionId } = req.body;
      const posts = loadServerPosts();
      const target = posts.find(p => p.id === id);

      if (target && target.pollOptions) {
        target.pollOptions = target.pollOptions.map((opt: any) =>
          opt.id === optionId ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
        );
        saveServerPosts(posts);
        return res.json({ success: true, post: target });
      }
      return res.status(404).json({ error: 'Kura au chapisho halikupatikana' });
    } catch (err) {
      return res.status(500).json({ error: 'Hitilafu ya kura' });
    }
  });

  // DELETE /api/posts/:id - Delete post (only author or admin)
  app.delete('/api/posts/:id', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const posts = loadServerPosts();
      const target = posts.find(p => p.id === id);

      if (!target) {
        return res.status(404).json({ error: 'Chapisho halijapatikana.' });
      }

      // Authorization: Only the author or an administrator can delete
      if (target.author?.id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Huna ruhusa ya kufuta chapisho hili.' });
      }

      const filtered = posts.filter(p => p.id !== id);
      saveServerPosts(filtered);

      return res.json({ success: true, message: 'Chapisho limefutwa kikamilifu.' });
    } catch (err) {
      return res.status(500).json({ error: 'Hitilafu wakati wa kufuta chapisho' });
    }
  });

  // =============================================================
  // STUDY MATERIALS & DOWNLOAD GATE API (Req 22)
  // Guests can view material details, but downloads strictly require authentication.
  // =============================================================

  // GET /api/materials - List available study materials (open for browsing)
  app.get('/api/materials', (req: Request, res: Response) => {
    const materials = loadServerMaterials();
    const { category, subject, level } = req.query;

    let filtered = materials;
    if (category && typeof category === 'string' && category !== 'all') {
      filtered = filtered.filter(m => m.category === category);
    }
    if (subject && typeof subject === 'string' && subject !== 'all') {
      filtered = filtered.filter(m => m.subject.toLowerCase() === subject.toLowerCase());
    }
    if (level && typeof level === 'string' && level !== 'all') {
      filtered = filtered.filter(m => m.level === level);
    }

    return res.json({
      success: true,
      materials: filtered,
      total: filtered.length
    });
  });

  // POST /api/materials - Upload/contribute study material (requires login)
  app.post('/api/materials', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const {
        title,
        authorOrPublisher,
        level,
        category,
        classGrade,
        subject,
        fileFormat = 'PDF',
        fileSize = '3.5 MB',
        downloadUrl,
        description,
        year
      } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Jina la kitabu au mtihani linahitajika.' });
      }

      const currentUser = req.user!;
      const materials = loadServerMaterials();

      const newMaterial: StoredMaterial = {
        id: `mat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: title.trim(),
        authorOrPublisher: authorOrPublisher?.trim() || currentUser.schoolName,
        level: level || 'A-Level',
        category: category || 'Vitabu vya Masomo',
        classGrade: classGrade || 'Kidato cha 5 & 6',
        subject: subject || 'Masomo',
        fileFormat: fileFormat || 'PDF',
        fileSize: fileSize || '4.0 MB',
        downloadUrl: downloadUrl || `/downloads/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '_'))}.pdf`,
        year: year ? parseInt(year, 10) : new Date().getFullYear(),
        downloadsCount: 0,
        description: description?.trim() || `Nyenzo ya masomo iliyopakiwa na ${currentUser.name}.`,
        uploaderId: currentUser.id,
        uploaderName: currentUser.name,
        uploaderRole: currentUser.role,
        uploaderSchool: currentUser.schoolName,
        createdAt: new Date().toISOString(),
        verified: currentUser.role === 'admin'
      };

      materials.unshift(newMaterial);
      saveServerMaterials(materials);

      // Trigger notification for all users
      broadcastNotification({
        recipientId: 'all',
        type: 'material',
        title: 'New study material has been added',
        message: `"${newMaterial.title}" (${newMaterial.subject}) ipo tayari kwenye Maktaba.`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        relatedMaterialId: newMaterial.id
      });

      return res.status(201).json({
        success: true,
        material: newMaterial,
        message: 'Nyenzo ya masomo imepakiwa kikamilifu!'
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Hitilafu ya kupakia nyenzo ya masomo.' });
    }
  });

  // GET /api/materials/:id/download - Secure download gate (STRICTLY requires authenticated token)
  app.get('/api/materials/:id/download', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const materials = loadServerMaterials();
      const target = materials.find(m => m.id === id);

      if (!target) {
        return res.status(404).json({ error: 'Faili la masomo halijapatikana.' });
      }

      // Increment download counter
      target.downloadsCount = (target.downloadsCount || 0) + 1;
      saveServerMaterials(materials);

      console.log(`📥 [MATERIAL DOWNLOAD AUTHORIZED] User "${req.user!.name}" downloaded "${target.title}"`);

      return res.json({
        success: true,
        downloadUrl: target.downloadUrl,
        title: target.title,
        fileFormat: target.fileFormat,
        downloadsCount: target.downloadsCount,
        message: `Upakuaji wa "${target.title}" umethibitishwa.`
      });
    } catch (err) {
      return res.status(500).json({ error: 'Hitilafu wakati wa kupakua nyenzo.' });
    }
  });

  // =============================================================
  // NOTIFICATIONS API (Req 24, 25, 26, 29, 31, 32)
  // Real database-backed notifications with user-level read state and preferences
  // =============================================================

  // GET /api/notifications - Real-time notifications for authenticated user
  app.get('/api/notifications', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const currentUserId = req.user!.id;
      const allNotifs = loadServerNotifications();

      // Filter notifications: broadcast to 'all' or private to currentUserId
      const userNotifs = allNotifs.filter(
        n => n.recipientId === 'all' || n.recipientId === currentUserId
      );

      // Map read state specific to currentUserId
      const mapped = userNotifs.map(n => ({
        ...n,
        isRead: Array.isArray(n.readBy) && n.readBy.includes(currentUserId)
      }));

      const unreadCount = mapped.filter(n => !n.isRead).length;

      return res.json({
        success: true,
        notifications: mapped,
        unreadCount
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Hitilafu ya kupata arifa.' });
    }
  });

  // GET /api/notifications/unread-count - Lightweight polling endpoint
  app.get('/api/notifications/unread-count', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const currentUserId = req.user!.id;
      const allNotifs = loadServerNotifications();
      const count = allNotifs.filter(
        n => (n.recipientId === 'all' || n.recipientId === currentUserId) &&
             (!Array.isArray(n.readBy) || !n.readBy.includes(currentUserId))
      ).length;

      return res.json({ success: true, unreadCount: count });
    } catch (err) {
      return res.status(500).json({ unreadCount: 0 });
    }
  });

  // POST /api/notifications/:id/read - Mark single notification as read
  app.post('/api/notifications/:id/read', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const currentUserId = req.user!.id;
      const notifs = loadServerNotifications();
      const target = notifs.find(n => n.id === id);

      if (target) {
        if (!Array.isArray(target.readBy)) target.readBy = [];
        if (!target.readBy.includes(currentUserId)) {
          target.readBy.push(currentUserId);
          saveServerNotifications(notifs);
        }
      }

      return res.json({ success: true, message: 'Arifa imesomwa.' });
    } catch (err) {
      return res.status(500).json({ error: 'Hitilafu ya kusasisha arifa.' });
    }
  });

  // POST /api/notifications/read-all - Mark all notifications as read for current user
  app.post('/api/notifications/read-all', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const currentUserId = req.user!.id;
      const notifs = loadServerNotifications();

      let modified = false;
      notifs.forEach(n => {
        if (n.recipientId === 'all' || n.recipientId === currentUserId) {
          if (!Array.isArray(n.readBy)) n.readBy = [];
          if (!n.readBy.includes(currentUserId)) {
            n.readBy.push(currentUserId);
            modified = true;
          }
        }
      });

      if (modified) {
        saveServerNotifications(notifs);
      }

      return res.json({ success: true, message: 'Arifa zote zimewekwa kama zimesomwa.' });
    } catch (err) {
      return res.status(500).json({ error: 'Hitilafu ya kusasisha arifa.' });
    }
  });

  // GET /api/notifications/preferences - Retrieve notification preferences (Req 31)
  app.get('/api/notifications/preferences', authenticateToken, (req: AuthRequest, res: Response) => {
    const users = loadServerUsers();
    const user = users.find(u => u.id === req.user!.id);
    const defaultPreferences: NotificationPreferences = {
      newPosts: true,
      announcements: true,
      newMessages: true,
      studyMaterials: true,
      pushEnabled: false
    };

    return res.json({
      success: true,
      preferences: user?.notificationPreferences || defaultPreferences
    });
  });

  // PUT /api/notifications/preferences - Update notification preferences (Req 31)
  app.put('/api/notifications/preferences', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const { newPosts, announcements, newMessages, studyMaterials, pushEnabled } = req.body;
      const users = loadServerUsers();
      const user = users.find(u => u.id === req.user!.id);

      if (!user) {
        return res.status(404).json({ error: 'Mtumiaji hajapatikana.' });
      }

      user.notificationPreferences = {
        newPosts: newPosts ?? true,
        announcements: announcements ?? true,
        newMessages: newMessages ?? true,
        studyMaterials: studyMaterials ?? true,
        pushEnabled: pushEnabled ?? false
      };

      saveServerUsers(users);

      return res.json({
        success: true,
        preferences: user.notificationPreferences,
        message: 'Mipangilio ya arifa imesasishwa kikamilifu!'
      });
    } catch (err) {
      return res.status(500).json({ error: 'Hitilafu ya kusasisha mipangilio ya arifa.' });
    }
  });

  // =============================================================
  // ADMIN ANNOUNCEMENTS API (Req 27)
  // Only verified administrator can create official announcements
  // =============================================================

  // GET /api/announcements - Public announcements visible to all visitors & students
  app.get('/api/announcements', (req: Request, res: Response) => {
    const announcements = loadServerAnnouncements();
    return res.json({
      success: true,
      announcements,
      total: announcements.length
    });
  });

  // POST /api/admin/announcements - Publish official announcement (requireAdmin)
  app.post('/api/admin/announcements', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const { title, message, priority = 'normal', audience = 'Wanafunzi Wote Tanzania' } = req.body;

      if (!title || !message) {
        return res.status(400).json({ error: 'Kichwa cha habari na maelezo ya tangazo vinahitajika.' });
      }

      const announcements = loadServerAnnouncements();
      const newAnnouncement: StoredAnnouncement = {
        id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: title.trim(),
        message: message.trim(),
        priority,
        audience,
        authorId: req.user!.id,
        authorName: req.user!.name,
        createdAt: new Date().toISOString()
      };

      announcements.unshift(newAnnouncement);
      saveServerAnnouncements(announcements);

      logAdminAction(
        req.user!.id,
        req.user!.name,
        'Kutangaza Tangazo Rasmi la Kitaifa',
        newAnnouncement.title
      );

      // Broadcast notification across Edu-Kan network
      broadcastNotification({
        recipientId: 'all',
        type: 'announcement',
        title: 'New Edu-Kan announcement',
        message: `${newAnnouncement.title}: ${newAnnouncement.message}`,
        senderId: req.user!.id,
        senderName: req.user!.name,
        senderAvatar: req.user!.avatar,
        relatedAnnouncementId: newAnnouncement.id
      });

      console.log(`📢 [ADMIN ANNOUNCEMENT BROADCAST] "${newAnnouncement.title}" by ${req.user!.name}`);

      return res.status(201).json({
        success: true,
        announcement: newAnnouncement,
        message: 'Tangazo limechapishwa na kusambazwa kwa wanafunzi wote!'
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Hitilafu ya kuchapisha tangazo.' });
    }
  });

  // DELETE /api/admin/announcements/:id - Delete announcement (requireAdmin)
  app.delete('/api/admin/announcements/:id', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const announcements = loadServerAnnouncements();
      const filtered = announcements.filter(a => a.id !== id);
      saveServerAnnouncements(filtered);

      return res.json({ success: true, message: 'Tangazo limefutwa.' });
    } catch (err) {
      return res.status(500).json({ error: 'Hitilafu ya kufuta tangazo.' });
    }
  });

  // =============================================================
  // MESSAGES API - Real Persistent User-to-User Messages (Req 28 & 32)
  // Strictly authenticated; guests cannot send messages; private data isolated
  // =============================================================

  // GET /api/messages/conversations - List active conversation threads for current user
  app.get('/api/messages/conversations', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const currentUserId = req.user!.id;
      const messages = loadServerMessages();
      const users = loadServerUsers();

      // Find all messages involving current user
      const userMessages = messages.filter(
        m => m.senderId === currentUserId || m.recipientId === currentUserId
      );

      // Group by conversation partner
      const conversationMap: Record<string, {
        partnerId: string;
        partnerName: string;
        partnerAvatar: string;
        partnerSchool: string;
        lastMessage: StoredMessage;
        unreadCount: number;
      }> = {};

      userMessages.forEach(m => {
        const partnerId = m.senderId === currentUserId ? m.recipientId : m.senderId;
        const partnerUser = users.find(u => u.id === partnerId);
        const partnerName = partnerUser ? partnerUser.name : (m.senderId === currentUserId ? m.recipientName : m.senderName);
        const partnerAvatar = partnerUser ? partnerUser.avatar : (m.senderId === currentUserId ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' : m.senderAvatar);
        const partnerSchool = partnerUser ? partnerUser.schoolName : 'Edu-Kan Network';

        const isUnread = m.recipientId === currentUserId && (!Array.isArray(m.readBy) || !m.readBy.includes(currentUserId));

        if (!conversationMap[partnerId]) {
          conversationMap[partnerId] = {
            partnerId,
            partnerName,
            partnerAvatar,
            partnerSchool,
            lastMessage: m,
            unreadCount: isUnread ? 1 : 0
          };
        } else {
          // If message is newer, update lastMessage
          if (new Date(m.createdAt) > new Date(conversationMap[partnerId].lastMessage.createdAt)) {
            conversationMap[partnerId].lastMessage = m;
          }
          if (isUnread) {
            conversationMap[partnerId].unreadCount += 1;
          }
        }
      });

      const conversations = Object.values(conversationMap).sort(
        (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
      );

      return res.json({ success: true, conversations });
    } catch (err: any) {
      return res.status(500).json({ error: 'Hitilafu ya kupata orodha ya soga.' });
    }
  });

  // GET /api/messages/thread/:otherUserId - Get messages between current user and other user
  app.get('/api/messages/thread/:otherUserId', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const currentUserId = req.user!.id;
      const { otherUserId } = req.params;
      const messages = loadServerMessages();

      // Security check: Only fetch messages where current user is sender OR recipient
      const thread = messages.filter(
        m => (m.senderId === currentUserId && m.recipientId === otherUserId) ||
             (m.senderId === otherUserId && m.recipientId === currentUserId)
      );

      // Sort chronologically
      thread.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      // Mark incoming messages as read
      let modified = false;
      thread.forEach(m => {
        if (m.recipientId === currentUserId) {
          if (!Array.isArray(m.readBy)) m.readBy = [];
          if (!m.readBy.includes(currentUserId)) {
            m.readBy.push(currentUserId);
            modified = true;
          }
        }
      });
      if (modified) {
        saveServerMessages(messages);
      }

      return res.json({ success: true, messages: thread });
    } catch (err) {
      return res.status(500).json({ error: 'Hitilafu ya kupata ujumbe wa soga.' });
    }
  });

  // POST /api/messages/send - Send real message between authenticated users
  app.post('/api/messages/send', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const { recipientId, content, attachment, channelId } = req.body;
      const currentUser = req.user!;

      if (!recipientId || (!content && !attachment)) {
        return res.status(400).json({ error: 'Mpokeaji na maudhui ya ujumbe vinahitajika.' });
      }

      const users = loadServerUsers();
      const recipient = users.find(u => u.id === recipientId);

      // If sending to a specific registered user, verify recipient
      let resolvedRecipientName = recipient ? recipient.name : 'Mwanajumuiya wa Edu-Kan';

      const messages = loadServerMessages();
      const newMessage: StoredMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        recipientId,
        recipientName: resolvedRecipientName,
        channelId: channelId || null,
        content: content ? content.trim() : (attachment?.title || 'Kiambatisho cha faili'),
        attachment: attachment || null,
        createdAt: new Date().toISOString(),
        readBy: [currentUser.id]
      };

      messages.push(newMessage);
      saveServerMessages(messages);

      // Generate notification for recipient
      broadcastNotification({
        recipientId,
        type: 'message',
        title: `New message from ${currentUser.name}`,
        message: newMessage.content.slice(0, 80),
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        relatedMessageId: newMessage.id
      });

      console.log(`💬 [DIRECT MESSAGE] From ${currentUser.name} to ${resolvedRecipientName} (${newMessage.id})`);

      return res.status(201).json({
        success: true,
        message: newMessage
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Hitilafu ya kutuma ujumbe.' });
    }
  });

  // =============================================================
  // SECURE ADMIN MANAGEMENT API
  // Only accessible by verified Administrator accounts (requireAdmin)
  // =============================================================

  // GET /api/admin/users - Paginated real registered users list with search & filter
  app.get('/api/admin/users', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const allUsers = loadServerUsers();
      const { q, role, status, page = '1', limit = '10' } = req.query;

      let filtered = allUsers.map(sanitizeUser);

      // Search query (name, email, school, handle)
      if (q && typeof q === 'string' && q.trim()) {
        const query = q.trim().toLowerCase();
        filtered = filtered.filter(
          u =>
            u.name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.schoolName.toLowerCase().includes(query) ||
            u.handle.toLowerCase().includes(query)
        );
      }

      // Role filter
      if (role && typeof role === 'string' && role !== 'all') {
        filtered = filtered.filter(u => u.role === role);
      }

      // Status filter
      if (status && typeof status === 'string' && status !== 'all') {
        filtered = filtered.filter(u => u.status === status);
      }

      // Global real stats
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const stats = {
        totalUsers: allUsers.length,
        activeUsers: allUsers.filter(u => u.status === 'active').length,
        suspendedUsers: allUsers.filter(u => u.status === 'suspended' || u.status === 'deactivated').length,
        newRegistrationsToday: allUsers.filter(u => new Date(u.createdAt) > oneDayAgo).length,
        adminCount: allUsers.filter(u => u.role === 'admin').length,
        studentCount: allUsers.filter(u => u.role === 'student').length
      };

      // Pagination
      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.max(1, Math.min(50, parseInt(limit as string, 10) || 10));
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedUsers = filtered.slice(startIndex, startIndex + limitNum);

      return res.json({
        success: true,
        users: paginatedUsers,
        total: filtered.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filtered.length / limitNum) || 1,
        stats
      });
    } catch (err: any) {
      console.error('Error fetching admin users:', err);
      return res.status(500).json({ error: 'Hitilafu ya kupata watumiaji.' });
    }
  });

  // POST /api/admin/users/:id/status - Toggle activate/suspend/deactivate user
  app.post('/api/admin/users/:id/status', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['active', 'suspended', 'deactivated'].includes(status)) {
        return res.status(400).json({ error: 'Hali ya akaunti si sahihi (active, suspended, deactivated).' });
      }

      const users = loadServerUsers();
      const target = users.find(u => u.id === id);

      if (!target) {
        return res.status(404).json({ error: 'Mtumiaji hajapatikana.' });
      }

      // Prevent deactivating master administrator
      if (target.email.toLowerCase() === ADMIN_NOTIFICATION_EMAIL.toLowerCase() && status !== 'active') {
        return res.status(400).json({ error: 'Huwezi kusimamisha akaunti ya Msimamizi Mkuu.' });
      }

      target.status = status;
      saveServerUsers(users);

      logAdminAction(
        req.user!.id,
        req.user!.name,
        `Kubadilisha Hali ya Akaunti: ${status}`,
        `${target.name} (${target.email})`
      );

      return res.json({
        success: true,
        message: `Hali ya akaunti ya ${target.name} imebadilishwa kuwa ${status}.`,
        user: sanitizeUser(target)
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Hitilafu ya kusasisha hali ya mtumiaji.' });
    }
  });

  // DELETE /api/admin/users/:id - Delete a user safely
  app.delete('/api/admin/users/:id', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const users = loadServerUsers();
      const target = users.find(u => u.id === id);

      if (!target) {
        return res.status(404).json({ error: 'Mtumiaji hajapatikana.' });
      }

      if (target.email.toLowerCase() === ADMIN_NOTIFICATION_EMAIL.toLowerCase()) {
        return res.status(400).json({ error: 'Huwezi kufuta akaunti ya Msimamizi Mkuu wa mfumo.' });
      }

      const updated = users.filter(u => u.id !== id);
      saveServerUsers(updated);

      logAdminAction(
        req.user!.id,
        req.user!.name,
        'Kufuta Mtumiaji',
        `${target.name} (${target.email})`
      );

      return res.json({
        success: true,
        message: `Mtumiaji ${target.name} amefutwa kwenye mfumo.`
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Hitilafu ya kufuta mtumiaji.' });
    }
  });

  // GET /api/admin/stats - Overview metrics from real database
  app.get('/api/admin/stats', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const users = loadServerUsers();
      const posts = loadServerPosts();
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const totalComments = posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0);
      const totalLikes = posts.reduce((acc, p) => acc + (p.likes || 0), 0);

      return res.json({
        success: true,
        stats: {
          totalUsers: users.length,
          activeUsers: users.filter(u => u.status === 'active').length,
          newRegistrationsToday: users.filter(u => new Date(u.createdAt) > oneDayAgo).length,
          totalPosts: posts.length,
          totalComments,
          totalLikes,
          databaseType: 'EduKan Persistent JSON Store',
          adminEmail: ADMIN_NOTIFICATION_EMAIL
        }
      });
    } catch (err) {
      return res.status(500).json({ error: 'Hitilafu ya takwimu.' });
    }
  });

  // GET /api/admin/audit-logs - Real system audit logs
  app.get('/api/admin/audit-logs', requireAdmin, (req: AuthRequest, res: Response) => {
    const logs = loadAuditLogs();
    return res.json({ success: true, logs });
  });

  // =============================================================
  // AI ACADEMIC SERVICES (Preserved & Enhanced)
  // =============================================================

  // POST /api/ai/essay - Generate scholarship Statement of Purpose
  app.post('/api/ai/essay', async (req: Request, res: Response) => {
    try {
      const {
        scholarshipName,
        scholarshipProvider,
        applicantLevel,
        fieldOfStudy,
        careerAspiration,
        keyAchievements,
        financialNeedStory,
        tone = 'passionate',
        studentName = 'Mwanafunzi wa EduKan',
        studentSchool = 'Shule ya Sekondari Tanzania'
      } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        const toneDesc =
          tone === 'passionate'
            ? 'Nia yangu thabiti inasukumwa na maono makubwa ya kuleta mabadiliko chanya ya kiuchumi na kijamii nchini Tanzania.'
            : tone === 'academic'
            ? 'Kupitia misingi imara ya nadharia na uwezo wa utafiti wa kisayansi niliouonyesha katika masomo yangu...'
            : 'Kwa unyenyekevu mkubwa na kutambua fursa ya pekee inayotolewa, ninaomba nafasi hii ya kuwa sehemu ya mabalozi wa elimu...';

        const fallbackEssay = `BARUA YA NIA NA MAOMBI YA UFADHILI WA MASOMO (STATEMENT OF PURPOSE)
KWA: KAMATI YA UFADHILI WA MASOMO YA ${(scholarshipName || 'UFADHILI WA ELIMU YA JUU').toUpperCase()}
KUTOKA KWA: ${(studentName || 'MWANAFUNZI WA TANZANIA').toUpperCase()}
TAASISI: ${(studentSchool || 'SHULE YA SEKONDARI TANZANIA').toUpperCase()}
FANI YA MASOMO: ${(fieldOfStudy || 'SAYANSI NA TEKNOLOJIA').toUpperCase()}

Heshima kwenu Waheshimiwa Wajumbe wa Kamati ya Ufadhili,

Ninaandika barua hii kwa heshima kubwa kuwasilisha maombi yangu rasmi ya ufadhili wa masomo chini ya mpango wa ${scholarshipName || 'Ufadhili wa Masomo'}. Safari yangu ya kitaaluma katika ngazi ya ${applicantLevel || 'Kidato cha Sita'} imekuwa kielelezo cha bidii, nidhamu, na shauku isiyotikisika kuelekea taaluma ya ${fieldOfStudy}. ${toneDesc}

Katika kipindi changu chote cha masomo, nimejitahidi kudumisha viwango vya juu vya ufaulu wa kitaaluma pamoja na uwajibikaji kwa jamii. ${keyAchievements || 'Nimekuwa nikifanya bidii darasani na kushiriki katika shughuli za klabu za kitaaluma.'}

Hata hivyo, safari yangu inakabiliwa na kikwazo kikuu cha kifedha. ${financialNeedStory || 'Kutokana na hali ya kiuchumi ya familia yangu, ufadhili huu ni daraja muhimu litakalonisaidia kuendelea na masomo bila kukatishiwa ndoto zangu.'} Ufadhili huu wa ${scholarshipProvider || 'Wafadhili'} utanipa utulivu wa kisaikolojia na kuniwezesha kuelekeza nguvu zangu zote katika kutafiti na kufanya vizuri zaidi.

Wenu mwaminifu katika ujenzi wa taifa,
${studentName}
Taasisi: ${studentSchool}
EduKan Verified Profile`;

        return res.json({
          essay: fallbackEssay,
          source: 'template_fallback',
          message: 'Generated using EduKan academic template (configure GEMINI_API_KEY for live deep reasoning)'
        });
      }

      const prompt = `Wewe ni Mshauri Mwandamizi wa Kitaaluma wa EduKan Tanzania (Senior Academic & Scholarship Advisor).
Andika barua kamili na ya kiwango cha juu sana ya maombi ya ufadhili wa masomo (Statement of Purpose / Motivation Letter) kwa Kiswahili fasaha chenye lugha ya staha, ufasaha, na ushawishi mkubwa.

MAELEZO YA MAOMBI:
- Mfadhili / Programu: ${scholarshipName} (${scholarshipProvider})
- Ngazi ya Mwombaji: ${applicantLevel}
- Fani ya Masomo: ${fieldOfStudy}
- Jina la Mwombaji: ${studentName}
- Shule / Taasisi: ${studentSchool}
- Malengo ya Kazi na Maono ya Baadaye: ${careerAspiration}
- Mafanikio Makuu ya Kitaaluma na Uongozi: ${keyAchievements}
- Hali ya Uhitaji wa Kifedha: ${financialNeedStory}
- Mtindo wa Uandishi (Tone): ${tone}

MIONGOZO YA UANDISHI:
1. Iwe na anwani rasmi na kichwa cha habari kinachoeleweka vizuri.
2. Ionyeshe shauku ya kweli, ufaulu, na uzalendo kwa Tanzania.
3. Ifafanue jinsi ufadhili utakavyovunja vikwazo vya kifedha na kumwezesha mwombaji kufanya uvumbuzi.
4. Hitimisho liwe la heshima na shukrani, likiwa na jina na saini ya mwombaji.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are EduKan AI, premier academic counseling assistant tailored for Tanzanian students.'
        }
      });

      return res.json({
        essay: response.text || '',
        source: 'gemini_api'
      });
    } catch (err: any) {
      console.error('Error generating scholarship essay:', err);
      return res.status(500).json({ error: 'Hitilafu ya AI', details: err?.message });
    }
  });

  // POST /api/ai/chat - AI Academic Tutor
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    try {
      const { message, history = [] } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          reply: `Habari! Mimi ni Msaidizi wa Masomo wa EduKan Tanzania. Niko hapa kukusaidia katika masomo ya O-Level, A-Level, NECTA past papers, na miongozo ya kozi za elimu ya juu. Una swali gani?`,
          source: 'offline_fallback'
        });
      }

      const systemPrompt = `Wewe ni EduKan AI Mwalimu Mkuu (Tanzania Premier Academic AI Tutor & Counselor).
Wasaidie wanafunzi wa Tanzania katika masomo ya sayansi, hisabati, lugha, biashara na sanaa kulingana na mtaala wa NECTA na TIE. Jibu kwa lugha safi ya Kiswahili fasaha.`;

      const prompt = `Historia ya Mazungumzo:
${Array.isArray(history) ? history.map((h: any) => `${h.sender === 'user' ? 'Mwanafunzi' : 'Mwalimu'}: ${h.text}`).join('\n') : ''}

Mwanafunzi anasema: ${message}

Jibu la Mwalimu wa EduKan:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { systemInstruction: systemPrompt }
      });

      return res.json({
        reply: response.text || 'Samahani, jaribu kuuliza tena swali lako.',
        source: 'gemini_api'
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Hitilafu ya soga ya AI' });
    }
  });

  // POST /api/ai/explain-question - Homework & Exam Questions Solver
  app.post('/api/ai/explain-question', async (req: Request, res: Response) => {
    try {
      const { title, content, subject, topic } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          explanation: `Ufafanuzi wa Swali (${subject} - ${topic}):\n\nIli kujibu swali hili kwa ufasaha kulingana na muongozo wa NECTA:\n1. Bainisha kanuni kuu inayohusika.\n2. Fuata hatua kwa hatua kufikia jibu sahihi.\n3. Andika hitimisho lililo wazi.`,
          source: 'offline_fallback'
        });
      }

      const prompt = `Mwanafunzi wa EduKan Tanzania ameuliza swali lifuatalo:
Somo: ${subject || 'Masomo ya Jumla'}
Mada: ${topic || 'Mada ya Masomo'}
Kichwa: ${title}
Swali: ${content}

Tafadhali toa jibu kamili lenye hatua kwa hatua kulingana na viwango vya NECTA.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { systemInstruction: 'You are EduKan NECTA and University Exam Solver.' }
      });

      return res.json({ explanation: response.text || '', source: 'gemini_api' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Hitilafu ya kutatua swali' });
    }
  });

  // =============================================================
  // Vite Integration for Dev / Static Serving for Production
  // =============================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 EduKan Tanzania Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
