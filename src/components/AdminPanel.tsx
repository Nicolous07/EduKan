import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Building,
  AlertTriangle,
  CheckCircle2,
  Send,
  Download,
  Filter,
  School,
  BookOpen,
  Sparkles,
  Pin,
  Trash2,
  Award,
  Plus,
  Search,
  Eye,
  RefreshCw,
  X,
  ShieldAlert,
  FileText,
  Check,
  MessageSquare,
  Flame,
  BarChart3,
  Radio,
  UserCheck,
  UserX,
  AlertCircle,
  Library,
  Settings,
  ChevronRight,
  CreditCard,
  Edit3,
  HelpCircle,
  Lock,
  EyeOff,
  Mail,
  Image as ImageIcon,
  Camera
} from 'lucide-react';
import {
  SchoolCommunity,
  Post,
  StudyResource,
  UserProfile,
  UserRole,
  AdminAuditLog,
  BroadcastItem,
  ManagedStudent,
  LibraryItem,
  OpportunityItem,
  QuestionItem,
  PostComment,
  PostCategory
} from '../types';
import {
  INITIAL_MANAGED_STUDENTS,
  INITIAL_BROADCASTS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';
import { AdminLibraryTab } from './admin/AdminLibraryTab';
import { AdminOpportunitiesTab } from './admin/AdminOpportunitiesTab';
import { AdminSettingsTab } from './admin/AdminSettingsTab';
import { AdminReportsTab } from './admin/AdminReportsTab';
import { AdminTeacherVerificationTab } from './admin/AdminTeacherVerificationTab';
import { AdminFinanceTab } from './admin/AdminFinanceTab';
import { AdminAnalyticsTab } from './admin/AdminAnalyticsTab';
import { AdminFeedbackTab } from './admin/AdminFeedbackTab';
import { FeedbackModal } from './FeedbackModal';

interface Props {
  schools: SchoolCommunity[];
  posts: Post[];
  questions?: QuestionItem[];
  resources?: StudyResource[];
  libraryBooks?: LibraryItem[];
  opportunities?: OpportunityItem[];
  managedStudents?: ManagedStudent[];
  currentUser: UserProfile;
  onNavigateTab?: (tab: string) => void;
  onBroadcastAnnouncement: (title: string, message: string, priority?: 'normal' | 'urgent' | 'exam', audience?: string) => void;
  onVerifySchool: (schoolId: string) => void;
  onAddSchool?: (school: Partial<SchoolCommunity>) => void;
  onEditSchool?: (schoolId: string, updated: Partial<SchoolCommunity>) => void;
  onDeleteSchool?: (schoolId: string) => void;
  onDeletePost?: (postId: string) => void;
  onEditPost?: (postId: string, updatedContent: string, updatedCategory?: PostCategory, updatedSubject?: string) => void;
  onPinPost?: (postId: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onEditComment?: (postId: string, commentId: string, updatedText: string) => void;
  onDeleteQuestion?: (questionId: string) => void;
  onEditQuestion?: (questionId: string, title: string, subject: string, body: string) => void;
  onDeleteAnswer?: (questionId: string, answerId: string) => void;
  onVerifyResource?: (resourceId: string) => void;
  onDeleteResource?: (resourceId: string) => void;
  onVerifyLibraryBook?: (bookId: string) => void;
  onDeleteLibraryBook?: (bookId: string) => void;
  onAddLibraryBook?: (book: Partial<LibraryItem>) => void;
  onEditLibraryBook?: (bookId: string, updated: Partial<LibraryItem>) => void;
  onAddOpportunity?: (opp: OpportunityItem) => void;
  onDeleteOpportunity?: (oppId: string) => void;
  onEditOpportunity?: (oppId: string, updated: Partial<OpportunityItem>) => void;
  onUpdateUserPoints?: (userId: string, pointsDelta: number) => void;
  onUpdateUserRole?: (userId: string, newRole: UserRole) => void;
  onBanUser?: (userId: string, isBanned: boolean) => void;
  onUpdateManagedStudents?: (students: ManagedStudent[]) => void;
  onOpenFeedback?: () => void;
}

export const AdminPanel: React.FC<Props> = ({
  schools,
  posts,
  questions = [],
  resources = [],
  libraryBooks = [],
  opportunities = [],
  managedStudents,
  currentUser,
  onNavigateTab,
  onBroadcastAnnouncement,
  onVerifySchool,
  onAddSchool,
  onEditSchool,
  onDeleteSchool,
  onDeletePost,
  onEditPost,
  onPinPost,
  onDeleteComment,
  onEditComment,
  onDeleteQuestion,
  onEditQuestion,
  onDeleteAnswer,
  onVerifyResource,
  onDeleteResource,
  onVerifyLibraryBook,
  onDeleteLibraryBook,
  onAddLibraryBook,
  onEditLibraryBook,
  onAddOpportunity,
  onDeleteOpportunity,
  onEditOpportunity,
  onUpdateUserPoints,
  onUpdateUserRole,
  onBanUser,
  onUpdateManagedStudents,
  onOpenFeedback
}) => {
  // Navigation Tabs
  const [adminTab, setAdminTab] = useState<
    'overview' | 'content' | 'studyrooms' | 'feedback' | 'reports' | 'teachers' | 'finance' | 'analytics' | 'library' | 'schools' | 'students' | 'opportunities' | 'broadcasts' | 'resources' | 'settings' | 'audit'
  >('overview');
  const [isLocalFeedbackOpen, setIsLocalFeedbackOpen] = useState(false);

  // Nicolous Munisi Admin Security Verification Gate State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (currentUser.role === 'admin') return true;
    const isDirectNicolous = currentUser.role === 'admin' && (
      currentUser.email?.toLowerCase().trim() === 'nicolousmunisi07@gmail.com' ||
      currentUser.email?.toLowerCase().trim() === 'nicolousmunisi@gmail.com' ||
      currentUser.handle === 'nicolous_admin'
    );
    if (isDirectNicolous) return true;
    try {
      return sessionStorage.getItem('edukan_admin_auth_verified') === 'true' ||
             localStorage.getItem('edukan_admin_auth_verified') === 'true';
    } catch {
      return false;
    }
  });
  const [adminAuthEmail, setAdminAuthEmail] = useState('nicolousmunisi07@gmail.com');
  const [adminAuthPassword, setAdminAuthPassword] = useState('');
  const [showAdminAuthPassword, setShowAdminAuthPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  // Broadcast state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [announcementPriority, setAnnouncementPriority] = useState<'normal' | 'urgent' | 'exam'>('normal');
  const [announcementAudience, setAnnouncementAudience] = useState('Wanafunzi Wote Tanzania');
  const [broadcastList, setBroadcastList] = useState<BroadcastItem[]>(INITIAL_BROADCASTS);
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Content moderation filter & search
  const [contentFilter, setContentFilter] = useState<'all' | 'flagged' | 'pinned' | 'masomo' | 'ushauri' | 'burudani'>('all');
  const [contentSearch, setContentSearch] = useState('');

  // Post & Comment Edit States
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostCategory, setEditPostCategory] = useState<PostCategory>('masomo');
  const [editPostSubject, setEditPostSubject] = useState('');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<{ postId: string; commentId: string; text: string } | null>(null);

  // Study Rooms & Questions Moderation States
  const [studyQuestionSearch, setStudyQuestionSearch] = useState('');
  const [studyQuestionSubjectFilter, setStudyQuestionSubjectFilter] = useState('Zote');
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  const [editQuestionTitle, setEditQuestionTitle] = useState('');
  const [editQuestionSubject, setEditQuestionSubject] = useState('');
  const [editQuestionTopic, setEditQuestionTopic] = useState('');
  const [editQuestionContent, setEditQuestionContent] = useState('');
  const [expandedAnswersQuestionId, setExpandedAnswersQuestionId] = useState<string | null>(null);

  // School management state
  const [schoolSearch, setSchoolSearch] = useState('');
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolRegion, setNewSchoolRegion] = useState('Dar es Salaam');
  const [newSchoolDistrict, setNewSchoolDistrict] = useState('');
  const [newSchoolCategory, setNewSchoolCategory] = useState<'High School' | 'Secondary School' | 'University' | 'College'>('High School');
  const [newSchoolPrincipal, setNewSchoolPrincipal] = useState('');
  const [newSchoolStudents, setNewSchoolStudents] = useState('1200');
  const [newSchoolLogo, setNewSchoolLogo] = useState('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80');
  const [newSchoolCover, setNewSchoolCover] = useState('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80');

  // School Editing state
  const [isEditSchoolModalOpen, setIsEditSchoolModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolCommunity | null>(null);
  const [editSchoolName, setEditSchoolName] = useState('');
  const [editSchoolRegion, setEditSchoolRegion] = useState('Dar es Salaam');
  const [editSchoolDistrict, setEditSchoolDistrict] = useState('');
  const [editSchoolCategory, setEditSchoolCategory] = useState<'High School' | 'Secondary School' | 'University' | 'College'>('High School');
  const [editSchoolPrincipal, setEditSchoolPrincipal] = useState('');
  const [editSchoolStudents, setEditSchoolStudents] = useState('1200');
  const [editSchoolAnnualFee, setEditSchoolAnnualFee] = useState('500000');
  const [editSchoolAbout, setEditSchoolAbout] = useState('');
  const [editSchoolLogo, setEditSchoolLogo] = useState('');
  const [editSchoolCover, setEditSchoolCover] = useState('');

  // Quick preset choices for School Logo & Cover Photo
  const SCHOOL_LOGO_PRESETS = [
    { label: 'Secondary Crest', url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80' },
    { label: 'University Shield', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&auto=format&fit=crop&q=80' },
    { label: 'Science & Tech', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&auto=format&fit=crop&q=80' },
    { label: 'Education Institute', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop&q=80' }
  ];

  const SCHOOL_COVER_PRESETS = [
    { label: 'School Grounds', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Modern Campus', url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1000&auto=format&fit=crop&q=80' },
    { label: 'University Quad', url: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Labs & Classrooms', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1000&auto=format&fit=crop&q=80' }
  ];

  // Nicolous Munisi Verification Handlers
  const handleVerifyAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError(null);

    const emailTrimmed = adminAuthEmail.trim().toLowerCase();
    const passTrimmed = adminAuthPassword.trim();

    const isAuthorizedEmail =
      emailTrimmed === 'nicolousmunisi07@gmail.com' ||
      emailTrimmed === 'nicolousmunisi@gmail.com' ||
      emailTrimmed === 'nicolous munisi' ||
      emailTrimmed === 'admin@edukan.tz';

    const isAuthorizedPassword =
      passTrimmed === '@EduKan#26admin' ||
      passTrimmed === 'admin123';

    if (isAuthorizedEmail && isAuthorizedPassword) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('edukan_admin_auth_verified', 'true');
        localStorage.setItem('edukan_admin_auth_verified', 'true');
      } catch (err) {
        console.warn('Storage error', err);
      }
      triggerFeedback('Uthibitisho Umekamilika! Karibu Msimamizi Mkuu Nicolous Munisi. 🛡️');
    } else {
      setAdminAuthError(
        'Taarifa za kiutawala si sahihi. Paneli hii inaruhusiwa kwa Nicolous Munisi (nicolousmunisi07@gmail.com) mwenye nenosiri la utawala @EduKan#26admin.'
      );
    }
  };

  const handleLockAdminSession = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('edukan_admin_auth_verified');
      localStorage.removeItem('edukan_admin_auth_verified');
    } catch {}
    triggerFeedback('Kipindi cha utawala kimefungwa kwa usalama.');
  };

  // Student management state
  const [students, setStudents] = useState<ManagedStudent[]>(managedStudents || INITIAL_MANAGED_STUDENTS);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState<'all' | 'active' | 'banned' | 'admin'>('all');
  const [selectedStudentForPoints, setSelectedStudentForPoints] = useState<ManagedStudent | null>(null);
  const [pointsInput, setPointsInput] = useState('50');

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Success toast feedback
  const [adminFeedback, setAdminFeedback] = useState<string | null>(null);
  const triggerFeedback = (msg: string) => {
    setAdminFeedback(msg);
    setTimeout(() => setAdminFeedback(null), 3500);
  };

  // Broadcast Handler
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;

    onBroadcastAnnouncement(
      announcementTitle.trim(),
      announcementMsg.trim(),
      announcementPriority,
      announcementAudience
    );

    const newBroadcast: BroadcastItem = {
      id: `bc-${Date.now()}`,
      title: announcementTitle.trim(),
      message: announcementMsg.trim(),
      priority: announcementPriority,
      audience: announcementAudience,
      sentAt: 'Sasa hivi',
      recipientsCount: 12483
    };

    setBroadcastList([newBroadcast, ...broadcastList]);

    // Add to audit log
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      action: 'Imetuma Tangazo la Kitaifa',
      target: announcementTitle.trim(),
      adminName: currentUser.name,
      timestamp: 'Sasa hivi',
      type: 'broadcast'
    };
    setAuditLogs([newLog, ...auditLogs]);

    setAnnouncementTitle('');
    setAnnouncementMsg('');
    setBroadcastSent(true);
    triggerFeedback('Tangazo la Utawala limetangazwa kwa mafanikio kitaifa! 📢');
    setTimeout(() => setBroadcastSent(false), 3500);
  };

  // Add School Handler
  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim() || !newSchoolDistrict.trim()) return;

    const newSchool: Partial<SchoolCommunity> = {
      name: newSchoolName.trim(),
      region: newSchoolRegion,
      district: newSchoolDistrict.trim(),
      category: newSchoolCategory,
      principal: newSchoolPrincipal.trim() || 'Mkuu wa Shule',
      studentCount: parseInt(newSchoolStudents) || 850,
      logo: newSchoolLogo.trim() || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80',
      coverImage: newSchoolCover.trim() || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80',
      verified: true,
      established: '2005',
      about: `Jumuiya rasmi ya wanafunzi na walimu ya ${newSchoolName.trim()} kwenye mtandao wa elimu EduKan.`,
      annualFee: 500000,
      feeAccountControlPrefix: '998100'
    };

    if (onAddSchool) {
      onAddSchool(newSchool);
    }

    // Add audit log
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      action: 'Imesajili Shule Mpya yenye Picha & Cover',
      target: newSchoolName.trim(),
      adminName: currentUser.name,
      timestamp: 'Sasa hivi',
      type: 'school'
    };
    setAuditLogs([newLog, ...auditLogs]);

    setNewSchoolName('');
    setNewSchoolDistrict('');
    setNewSchoolPrincipal('');
    setIsAddSchoolModalOpen(false);
    triggerFeedback(`Shule ya "${newSchoolName}" imesajiliwa ikiwa na picha ya nembo na jalada! 🏫`);
  };

  // Edit School Handlers
  const handleStartEditSchool = (sch: SchoolCommunity) => {
    setEditingSchool(sch);
    setEditSchoolName(sch.name);
    setEditSchoolRegion(sch.region);
    setEditSchoolDistrict(sch.district);
    setEditSchoolCategory(sch.category);
    setEditSchoolPrincipal(sch.principal);
    setEditSchoolStudents(String(sch.studentCount));
    setEditSchoolAnnualFee(String(sch.annualFee || 500000));
    setEditSchoolAbout(sch.about || '');
    setEditSchoolLogo(sch.logo || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80');
    setEditSchoolCover(sch.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80');
    setIsEditSchoolModalOpen(true);
  };

  const handleSaveEditedSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchool) return;

    const updated: Partial<SchoolCommunity> = {
      name: editSchoolName.trim() || editingSchool.name,
      region: editSchoolRegion || editingSchool.region,
      district: editSchoolDistrict.trim() || editingSchool.district,
      category: editSchoolCategory || editingSchool.category,
      principal: editSchoolPrincipal.trim() || editingSchool.principal,
      studentCount: parseInt(editSchoolStudents) || editingSchool.studentCount,
      annualFee: parseInt(editSchoolAnnualFee) || editingSchool.annualFee,
      about: editSchoolAbout.trim() || editingSchool.about,
      logo: editSchoolLogo.trim() || editingSchool.logo,
      coverImage: editSchoolCover.trim() || editingSchool.coverImage
    };

    if (onEditSchool) {
      onEditSchool(editingSchool.id, updated);
    }

    // Add audit log
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      action: 'Imehariri Taarifa, Nembo na Jalada la Shule',
      target: editSchoolName.trim() || editingSchool.name,
      adminName: currentUser.name,
      timestamp: 'Sasa hivi',
      type: 'school'
    };
    setAuditLogs([newLog, ...auditLogs]);

    triggerFeedback(`Picha za shule na taarifa za ${editSchoolName.trim() || editingSchool.name} zimesasishwa! 📸`);
    setIsEditSchoolModalOpen(false);
    setEditingSchool(null);
  };

  // Student Management Handlers
  const handleAwardPoints = () => {
    if (!selectedStudentForPoints) return;
    const delta = parseInt(pointsInput) || 0;
    if (delta === 0) return;

    setStudents(students.map(s => s.id === selectedStudentForPoints.id ? { ...s, points: s.points + delta } : s));

    if (onUpdateUserPoints) {
      onUpdateUserPoints(selectedStudentForPoints.id, delta);
    }

    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      action: delta > 0 ? `Imezawadia +${delta} EduPoints` : `Imepunguza ${delta} EduPoints`,
      target: selectedStudentForPoints.name,
      adminName: currentUser.name,
      timestamp: 'Sasa hivi',
      type: 'user'
    };
    setAuditLogs([newLog, ...auditLogs]);

    triggerFeedback(`${delta > 0 ? 'Pointi zimeongezwa' : 'Pointi zimepunguzwa'} kwa ${selectedStudentForPoints.name}!`);
    setSelectedStudentForPoints(null);
  };

  // Post & Comment Edit Handlers
  const handleSaveEditPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editPostContent.trim()) return;
    if (onEditPost) {
      onEditPost(editingPost.id, editPostContent.trim(), editPostCategory, editPostSubject.trim());
    }
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      action: 'Imehariri Chapisho la Mwanafunzi',
      target: editingPost.author.name,
      adminName: currentUser.name,
      timestamp: 'Sasa hivi',
      type: 'content'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    triggerFeedback('Chapisho limesasishwa kwa mafanikio!');
    setEditingPost(null);
  };

  const handleSaveEditComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment || !editingComment.text.trim()) return;
    if (onEditComment) {
      onEditComment(editingComment.postId, editingComment.commentId, editingComment.text.trim());
    }
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      action: 'Imehariri Maoni ya Mwanafunzi',
      target: 'Maoni kwenye chapisho',
      adminName: currentUser.name,
      timestamp: 'Sasa hivi',
      type: 'content'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    triggerFeedback('Maoni yamesasishwa!');
    setEditingComment(null);
  };

  // Study Rooms Question Edit Handler
  const handleSaveEditQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !editQuestionTitle.trim()) return;
    if (onEditQuestion) {
      onEditQuestion(editingQuestion.id, editQuestionTitle.trim(), editQuestionSubject, editQuestionContent.trim());
    }
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      action: 'Imehariri Swali la Chumba cha Masomo',
      target: editQuestionTitle.trim(),
      adminName: currentUser.name,
      timestamp: 'Sasa hivi',
      type: 'content'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    triggerFeedback('Swali limesasishwa kwa mafanikio!');
    setEditingQuestion(null);
  };

  const handleToggleStudentBan = (studentId: string) => {
    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;
    const isBanning = targetStudent.status !== 'banned';
    const newStatus = isBanning ? 'banned' : 'active';

    const updated = students.map(s => s.id === studentId ? { ...s, status: newStatus as 'active' | 'banned' } : s);
    setStudents(updated);
    if (onUpdateManagedStudents) onUpdateManagedStudents(updated);
    if (onBanUser) onBanUser(studentId, isBanning);

    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      action: isBanning ? 'Amempiga Marufuku (Ban/Block) Mtumiaji' : 'Amemfungulia (Unban) Mtumiaji',
      target: targetStudent.name,
      adminName: currentUser.name,
      timestamp: 'Sasa hivi',
      type: 'user'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    triggerFeedback(
      isBanning
        ? `🛑 Akaunti ya ${targetStudent.name} imepigwa marufuku (Banned)!`
        : `✅ Akaunti ya ${targetStudent.name} imefunguliwa (Unbanned)!`
    );
  };

  const handleToggleStudentStatus = (studentId: string) => {
    const updated = students.map(s => {
      if (s.id === studentId) {
        const newStatus = s.status === 'active' ? 'suspended' : 'active';
        triggerFeedback(`Akaunti ya ${s.name} sasa ni: ${newStatus === 'active' ? 'Imerejeshwa (Hai)' : 'Imesimamishwa'}!`);
        return { ...s, status: newStatus as 'active' | 'suspended' };
      }
      return s;
    });
    setStudents(updated);
    if (onUpdateManagedStudents) onUpdateManagedStudents(updated);
  };

  const handleToggleStudentRole = (studentId: string) => {
    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;
    const nextRole: UserRole = targetStudent.role === 'admin' ? 'student' : 'admin';

    const updated = students.map(s => s.id === studentId ? { ...s, role: nextRole } : s);
    setStudents(updated);
    if (onUpdateManagedStudents) onUpdateManagedStudents(updated);
    if (onUpdateUserRole) onUpdateUserRole(studentId, nextRole);

    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      action: `Amebadilisha Wadhifa kuwa ${nextRole === 'admin' ? 'Admin' : 'Mwanafunzi'}`,
      target: targetStudent.name,
      adminName: currentUser.name,
      timestamp: 'Sasa hivi',
      type: 'user'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    triggerFeedback(`Wadhifa wa ${targetStudent.name} umebadilishwa kuwa ${nextRole === 'admin' ? 'Msimamizi (Admin)' : 'Mwanafunzi'}!`);
  };

  const handleToggleStudentVerified = (studentId: string) => {
    const updated = students.map(s => {
      if (s.id === studentId) {
        const nextVerified = !s.verified;
        triggerFeedback(`Tiki ya uthibitisho ya ${s.name} ${nextVerified ? 'imewashwa' : 'imeondolewa'}!`);
        return { ...s, verified: nextVerified };
      }
      return s;
    });
    setStudents(updated);
    if (onUpdateManagedStudents) onUpdateManagedStudents(updated);
  };

  // Filtered Content Posts
  const filteredPosts = posts.filter(p => {
    if (contentFilter === 'flagged') return p.isFlagged;
    if (contentFilter === 'pinned') return p.isPinned;
    if (contentFilter === 'masomo') return p.category === 'masomo';
    if (contentFilter === 'ushauri') return p.category === 'ushauri';
    if (contentFilter === 'burudani') return p.category === 'burudani';
    if (contentSearch.trim()) {
      const q = contentSearch.toLowerCase();
      return p.content.toLowerCase().includes(q) || p.author.name.toLowerCase().includes(q) || (p.subject && p.subject.toLowerCase().includes(q));
    }
    return true;
  });

  // Filtered Study Room Questions
  const filteredStudyQuestions = questions.filter(q => {
    if (studyQuestionSubjectFilter !== 'Zote' && q.subject.toLowerCase() !== studyQuestionSubjectFilter.toLowerCase()) {
      return false;
    }
    if (studyQuestionSearch.trim()) {
      const term = studyQuestionSearch.toLowerCase();
      return q.title.toLowerCase().includes(term) || q.content.toLowerCase().includes(term) || q.subject.toLowerCase().includes(term) || q.author.name.toLowerCase().includes(term);
    }
    return true;
  });

  // Filtered Schools
  const filteredSchools = schools.filter(s => {
    if (!schoolSearch.trim()) return true;
    const q = schoolSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.region.toLowerCase().includes(q) || s.district.toLowerCase().includes(q);
  });

  // Filtered Students
  const filteredStudents = students.filter(s => {
    if (studentFilter === 'active' && s.status !== 'active') return false;
    if (studentFilter === 'banned' && s.status !== 'banned') return false;
    if (studentFilter === 'admin' && s.role !== 'admin') return false;
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.schoolName.toLowerCase().includes(q) || s.handle.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });

  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-8 sm:py-16 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-100 dark:border-slate-800 shadow-xl relative overflow-hidden text-gray-900 dark:text-slate-100">
          {/* Top Accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500" />
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4 ring-8 ring-emerald-50/60 dark:ring-emerald-950/40 shadow-xs">
              <Lock className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MASTER ADMIN VERIFICATION</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black font-heading text-gray-900 dark:text-white tracking-tight">
              EduKan Admin Control Panel
            </h2>
            
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-2 max-w-md leading-relaxed">
              This administrative control panel is strictly restricted to <span className="font-bold text-gray-900 dark:text-white">Master Admin Access Only</span> upon verifying authorized credentials for <span className="font-bold text-emerald-800 dark:text-emerald-400">Nicolous Munisi</span>.
            </p>
          </div>

          <form onSubmit={handleVerifyAdminAuth} className="mt-6 space-y-4 text-xs">
            {adminAuthError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                <span>{adminAuthError}</span>
              </div>
            )}

            <div>
              <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">
                Master Admin Email:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={adminAuthEmail}
                  onChange={(e) => setAdminAuthEmail(e.target.value)}
                  placeholder="nicolousmunisi07@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs text-gray-900 dark:text-white font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">
                Admin Security Password:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showAdminAuthPassword ? 'text' : 'password'}
                  value={adminAuthPassword}
                  onChange={(e) => setAdminAuthPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full pl-9 pr-10 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs text-gray-900 dark:text-white font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowAdminAuthPassword(!showAdminAuthPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                  title={showAdminAuthPassword ? "Hide password" : "Show password"}
                >
                  {showAdminAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                <span>🔐 Master Admin Key:</span>
                <code className="font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-slate-700 font-semibold select-all">
                  @EduKan#26admin
                </code>
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Unlock Admin Panel</span>
              </button>

              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('feed')}
                  className="w-full py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 font-semibold rounded-xl transition-all cursor-pointer text-xs"
                >
                  Return to Student Feed
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32 sm:pb-20">
      {/* Toast Feedback */}
      {adminFeedback && (
        <div className="fixed top-18 right-5 z-50 bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-2 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{adminFeedback}</span>
        </div>
      )}

      {/* Admin Central Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 border border-emerald-800/80 shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 backdrop-blur-xs text-emerald-200 text-xs px-3 py-1 rounded-full font-mono border border-emerald-700/60">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>EDUKAN TANZANIA • CENTRAL SYSTEM CONTROL</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Mfumo Unafanya Kazi (Uptime 99.9%)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
                Admin Management Hub
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/80 mt-1.5 max-w-2xl leading-relaxed">
                Oversee student accounts, registered schools, academic content, nationwide broadcasts, and community feedback.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2 flex-wrap">
              <button
                id="admin-view-feedback-btn"
                type="button"
                onClick={() => setAdminTab('feedback')}
                className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                title="View user feedback and suggestions"
              >
                <MessageSquare className="w-4 h-4 text-amber-950 stroke-[2.2]" />
                <span>User Feedback</span>
              </button>

              <button
                id="admin-lock-session-btn"
                type="button"
                onClick={handleLockAdminSession}
                className="bg-emerald-800/80 hover:bg-emerald-800 active:scale-95 text-emerald-100 border border-emerald-700/80 px-3 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Lock admin session to ensure security"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Session</span>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative ambient background circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-700/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Mobile Navigation Scroll Hint */}
      <div className="flex items-center justify-between px-1 text-[11px] text-emerald-800 dark:text-emerald-300 md:hidden bg-emerald-50/70 dark:bg-slate-800 p-2 rounded-xl border border-emerald-100 dark:border-slate-700">
        <span>👉 Scroll horizontally to explore all admin sections</span>
        <ChevronRight className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 animate-pulse" />
      </div>

      {/* Navigation Pills Bar */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-2xs overflow-x-auto custom-scrollbar flex items-center gap-1.5 text-xs font-semibold">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Overview & Stats</span>
        </button>

        <button
          onClick={() => setAdminTab('content')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'content'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Content & Posts ({posts.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('studyrooms')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'studyrooms'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
          <span>Study Rooms ({questions.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('feedback')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'feedback'
              ? 'bg-amber-600 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
          <span>User Feedback</span>
          <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            New
          </span>
        </button>

        <button
          onClick={() => setAdminTab('reports')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'reports'
              ? 'bg-rose-600 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          <span>Reports & Moderation</span>
        </button>

        <button
          onClick={() => setAdminTab('teachers')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'teachers'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Teacher Verification (TSC)</span>
        </button>

        <button
          onClick={() => setAdminTab('finance')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'finance'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Tuition & Control Numbers</span>
        </button>

        <button
          onClick={() => setAdminTab('analytics')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'analytics'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Curriculum Analytics</span>
        </button>

        <button
          onClick={() => setAdminTab('library')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'library'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Library className="w-3.5 h-3.5" />
          <span>Library & Exams ({libraryBooks.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('schools')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'schools'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <School className="w-3.5 h-3.5" />
          <span>Schools & Colleges ({schools.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('students')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'students'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Students & Accounts ({students.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('opportunities')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'opportunities'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Opportunities & Grants ({opportunities.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('broadcasts')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'broadcasts'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>National Broadcasts</span>
        </button>

        <button
          onClick={() => setAdminTab('resources')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'resources'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Notes & Past Papers</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'settings'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings & Logs</span>
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'audit'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. OVERVIEW & ANALYTICS TAB */}
      {/* ========================================================= */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-emerald-100 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-slate-400 font-semibold block">Wanafunzi Waliosajiliwa</span>
              <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1">12,483</div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +187 wapya leo (Kiwango cha juu)
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-emerald-100 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-slate-400 font-semibold block">Shule na Vyuo Mtandaoni</span>
              <div className="text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-400 mt-1">{schools.length}</div>
              <div className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">Zote zimeidhinishwa rasmi</div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-emerald-100 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-slate-400 font-semibold block">Machapisho & Mijadala</span>
              <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1">{posts.length + 1420}</div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 font-semibold">96% ni maudhui ya kimasomo</div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-emerald-100 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-slate-400 font-semibold block">Ulinzi wa Maudhui</span>
              <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1">100% Salama</div>
              <div className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">0 machapisho yaliyopigwa marufuku</div>
            </div>
          </div>

          {/* Graphical Analytics & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Weekly Student Activity */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white font-heading">Shughuli za Wanafunzi kwa Siku 7 Zilizopita</h3>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Mwingiliano wa usomaji, uulizaji maswali na maoni</p>
                </div>
                <span className="text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                  Kilele: Alhamisi (2,840)
                </span>
              </div>

              {/* Responsive SVG Bar Visual */}
              <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4 px-2 border-b border-gray-100 dark:border-slate-800">
                {[
                  { day: 'Jtatu', value: 65, count: '1.9k' },
                  { day: 'Jnne', value: 75, count: '2.2k' },
                  { day: 'Ttano', value: 85, count: '2.5k' },
                  { day: 'Alh', value: 100, count: '2.8k' },
                  { day: 'Iju', value: 90, count: '2.6k' },
                  { day: 'Jmosi', value: 70, count: '2.0k' },
                  { day: 'Jpili', value: 80, count: '2.3k' }
                ].map((col) => (
                  <div key={col.day} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono text-gray-400 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {col.count}
                    </span>
                    <div
                      className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t-lg transition-all"
                      style={{ height: `${col.value}%` }}
                    />
                    <span className="text-[10px] font-semibold text-gray-600 dark:text-slate-400 mt-1">{col.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown & Regional Ranks */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white font-heading">Mgawanyo wa Maudhui & Mikoa</h3>
              
              {/* Category bars */}
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span className="text-emerald-800 dark:text-emerald-300">Masomo & NECTA (55%)</span>
                    <span className="text-gray-500 dark:text-slate-400">1,120 posts</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '55%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span className="text-teal-800 dark:text-teal-300">Ushauri wa Elimu & TCU (25%)</span>
                    <span className="text-gray-500 dark:text-slate-400">510 posts</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span className="text-amber-800 dark:text-amber-300">Burudani & Michezo (20%)</span>
                    <span className="text-gray-500 dark:text-slate-400">410 posts</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400 tracking-wider block mb-2">Mikoa Inayoongoza kwa Ushiriki:</span>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="bg-emerald-50 dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 px-2 py-0.5 rounded-md font-medium border border-emerald-100 dark:border-slate-700">1. Dar es Salaam (34%)</span>
                  <span className="bg-emerald-50 dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 px-2 py-0.5 rounded-md font-medium border border-emerald-100 dark:border-slate-700">2. Mwanza (18%)</span>
                  <span className="bg-emerald-50 dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 px-2 py-0.5 rounded-md font-medium border border-emerald-100 dark:border-slate-700">3. Arusha (15%)</span>
                  <span className="bg-emerald-50 dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 px-2 py-0.5 rounded-md font-medium border border-emerald-100 dark:border-slate-700">4. Kilimanjaro (12%)</span>
                  <span className="bg-emerald-50 dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 px-2 py-0.5 rounded-md font-medium border border-emerald-100 dark:border-slate-700">5. Dodoma (9%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Command Center Quick Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-emerald-100 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white font-heading flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Vifaa vya Haraka vya Msimamizi (Admin Quick Actions)</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Fikia mara moja zana muhimu zaidi za usimamizi wa jukwaa la elimu la EduKan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
              <button
                onClick={() => setAdminTab('broadcasts')}
                className="p-3 bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700/80 border border-emerald-200 dark:border-slate-700 rounded-xl flex flex-col items-center text-center gap-1.5 transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Radio className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-slate-200">Tangaza Kitaifa</span>
                <span className="text-[10px] text-gray-500 dark:text-slate-400">Wanafunzi wote</span>
              </button>

              <button
                onClick={() => setAdminTab('library')}
                className="p-3 bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700/80 border border-teal-200 dark:border-slate-700 rounded-xl flex flex-col items-center text-center gap-1.5 transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Library className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-slate-200">Maktaba & Mitihani</span>
                <span className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold">{libraryBooks.length} vitabu</span>
              </button>

              <button
                onClick={() => setIsAddSchoolModalOpen(true)}
                className="p-3 bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700/80 border border-blue-200 dark:border-slate-700 rounded-xl flex flex-col items-center text-center gap-1.5 transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <School className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-slate-200">Sajili Shule</span>
                <span className="text-[10px] text-gray-500 dark:text-slate-400">Chuo au sekondari</span>
              </button>

              <button
                onClick={() => setAdminTab('opportunities')}
                className="p-3 bg-amber-50 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700/80 border border-amber-200 dark:border-slate-700 rounded-xl flex flex-col items-center text-center gap-1.5 transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-slate-200">Fursa & Udhamini</span>
                <span className="text-[10px] text-amber-800 dark:text-amber-400 font-semibold">{opportunities.length} zilizopo</span>
              </button>

              <button
                onClick={() => setAdminTab('students')}
                className="p-3 bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700/80 border border-indigo-200 dark:border-slate-700 rounded-xl flex flex-col items-center text-center gap-1.5 transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-700 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-slate-200">Wanafunzi & Akaunti</span>
                <span className="text-[10px] text-gray-500 dark:text-slate-400">{students.length} zinasimamiwa</span>
              </button>

              <button
                onClick={() => setAdminTab('settings')}
                className="p-3 bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700/80 border border-purple-200 dark:border-slate-700 rounded-xl flex flex-col items-center text-center gap-1.5 transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-slate-200">Mipangilio & Backup</span>
                <span className="text-[10px] text-purple-700 dark:text-purple-400 font-semibold">Usalama & Pakua</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CONTENT & POST MODERATION TAB */}
      {/* ========================================================= */}
      {adminTab === 'content' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base">
                Usimamizi na Ukaguzi wa Maudhui ({filteredPosts.length})
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Kagua machapisho ya wanafunzi, bandika matangazo muhimu ya kimasomo, au futa maudhui yasiyofaa.
              </p>
            </div>

            {/* Content Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Tafuta kwa mada au mwandishi..."
                value={contentSearch}
                onChange={(e) => setContentSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Moderation Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {(['all', 'flagged', 'pinned', 'masomo', 'ushauri', 'burudani'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setContentFilter(cat)}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  contentFilter === cat
                    ? 'bg-emerald-800 dark:bg-emerald-700 text-white shadow-2xs font-semibold'
                    : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                }`}
              >
                {cat === 'all' && 'Maudhui Yote'}
                {cat === 'flagged' && 'Yenye Ripoti ⚠️'}
                {cat === 'pinned' && 'Yaliobandikwa 📌'}
                {cat === 'masomo' && 'Masomo 📚'}
                {cat === 'ushauri' && 'Ushauri 💡'}
                {cat === 'burudani' && 'Burudani ⚽'}
              </button>
            ))}
          </div>

          {/* Post Table/Card List */}
          <div className="space-y-3 pt-2">
            {filteredPosts.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 dark:bg-slate-800/60 rounded-2xl text-gray-500 dark:text-slate-400 text-xs">
                Hakuna machapisho yanayolingana na kichujio hiki.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    post.isPinned
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 ring-1 ring-amber-200 dark:ring-amber-900/40'
                      : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-gray-200 dark:ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-gray-900 dark:text-white">{post.author.name}</span>
                          <span className="text-[11px] text-gray-500 dark:text-slate-400">@{post.author.handle}</span>
                          <span className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium">
                            {post.author.school}
                          </span>
                          {post.isPinned && (
                            <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Pin className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                              Limebandikwa Juu
                            </span>
                          )}
                          {post.category && (
                            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md uppercase">
                              {post.category}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-700 dark:text-slate-300 mt-2 leading-relaxed">
                          {post.content}
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400 dark:text-slate-400">
                          <span>❤️ {post.likes} likes</span>
                          <span>💬 {post.commentsCount || (post.comments ? post.comments.length : 0)} maoni</span>
                          <span>🔄 {post.sharesCount} shares</span>
                          <span>🕒 {post.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setEditPostContent(post.content);
                          setEditPostCategory(post.category || 'masomo');
                          setEditPostSubject(post.subject || '');
                        }}
                        title="Hariri Chapisho Hili"
                        className="p-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (onPinPost) onPinPost(post.id);
                          triggerFeedback(post.isPinned ? 'Chapisho limeondolewa juu' : 'Chapisho limebandikwa juu ya Feed!');
                        }}
                        title={post.isPinned ? 'Ondoa Bandiko' : 'Bandika Juu ya Feed'}
                        className={`p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          post.isPinned
                            ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 hover:bg-amber-300'
                            : 'bg-gray-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-gray-600 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (onDeletePost) onDeletePost(post.id);
                          triggerFeedback('Chapisho limefutwa na msimamizi.');
                        }}
                        title="Futa Chapisho Hili"
                        className="p-2 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Comments Section for Admin Moderation */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setExpandedCommentsPostId(expandedCommentsPostId === post.id ? null : post.id)}
                      className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Kagua Maoni ({post.comments?.length || post.commentsCount || 0})</span>
                      <ChevronRight className={`w-3 h-3 transition-transform ${expandedCommentsPostId === post.id ? 'rotate-90' : ''}`} />
                    </button>

                    {expandedCommentsPostId === post.id && (
                      <div className="mt-2.5 space-y-2 pl-3 border-l-2 border-emerald-100 dark:border-emerald-900/60 bg-gray-50/50 dark:bg-slate-800/50 p-3 rounded-xl">
                        {(!post.comments || post.comments.length === 0) ? (
                          <p className="text-[11px] text-gray-500 dark:text-slate-400 italic">Hakuna maoni kwenye chapisho hili bado.</p>
                        ) : (
                          post.comments.map((comment) => (
                            <div key={comment.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <img src={comment.author.avatar} alt={comment.author.name} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-[11px] text-gray-900 dark:text-white">{comment.author.name}</span>
                                    <span className="text-[10px] text-gray-400 dark:text-slate-400">{comment.author.school}</span>
                                    <span className="text-[10px] text-gray-400 dark:text-slate-400">• {comment.createdAt}</span>
                                  </div>
                                  <p className="text-xs text-gray-700 dark:text-slate-300 mt-1 leading-snug">{comment.content}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => setEditingComment({ postId: post.id, commentId: comment.id, text: comment.content })}
                                  className="p-1 rounded-lg text-gray-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors cursor-pointer"
                                  title="Hariri Maoni Haya"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                {onDeleteComment && (
                                  <button
                                    onClick={() => {
                                      onDeleteComment(post.id, comment.id);
                                      const newLog: AdminAuditLog = {
                                        id: `log-${Date.now()}`,
                                        action: 'Imefuta Maoni ya Mtumiaji',
                                        target: `Maoni ya ${comment.author.name}`,
                                        adminName: currentUser.name,
                                        timestamp: 'Sasa hivi',
                                        type: 'content'
                                      };
                                      setAuditLogs(prev => [newLog, ...prev]);
                                      triggerFeedback('Maoni yamefutwa na Msimamizi.');
                                    }}
                                    className="p-1 rounded-lg text-gray-500 dark:text-slate-400 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer"
                                    title="Futa Maoni Haya"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2b. STUDY ROOMS & QUESTIONS TAB */}
      {/* ========================================================= */}
      {adminTab === 'studyrooms' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Usimamizi wa Vyumba vya Masomo & Maswali ({questions.length})</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Kagua maswali yaliyoulizwa na wanafunzi, rekebisha mada, kagua majibu na futa yasiyofaa.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Tafuta swali au somo..."
                value={studyQuestionSearch}
                onChange={(e) => setStudyQuestionSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white w-full sm:w-64"
              />
            </div>
          </div>

          {/* Subject filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs custom-scrollbar">
            {['Zote', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Kiswahili', 'English'].map(subj => (
              <button
                key={subj}
                onClick={() => setStudyQuestionSubjectFilter(subj)}
                className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                  studyQuestionSubjectFilter === subj
                    ? 'bg-emerald-800 dark:bg-emerald-700 text-white shadow-2xs font-semibold'
                    : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          {/* Questions List */}
          <div className="space-y-3 pt-2">
            {filteredStudyQuestions.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 dark:bg-slate-800/60 rounded-2xl text-gray-500 dark:text-slate-400 text-xs">
                Hakuna maswali yaliyopatikana kwa kigezo hiki.
              </div>
            ) : (
              filteredStudyQuestions.map(q => (
                <div key={q.id} className="p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img src={q.author.avatar} alt={q.author.name} className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-gray-200 dark:ring-slate-700" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-gray-900 dark:text-white">{q.author.name}</span>
                          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-bold uppercase">{q.subject}</span>
                          <span className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded-md">{q.topic}</span>
                          <span className="text-[10px] text-gray-400 dark:text-slate-400">{q.author.school} • {q.author.form}</span>
                        </div>

                        <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-1.5">{q.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 leading-relaxed">{q.content}</p>

                        <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400 dark:text-slate-400">
                          <span>👁️ {q.viewsCount || 1} wametazama</span>
                          <span>💬 {q.answers?.length || 0} majibu</span>
                          <span>🕒 {q.createdAt}</span>
                          {q.hasBestAnswer && <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓ Jibu Bora Lipo</span>}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setEditingQuestion(q);
                          setEditQuestionTitle(q.title);
                          setEditQuestionSubject(q.subject);
                          setEditQuestionTopic(q.topic || '');
                          setEditQuestionContent(q.content);
                        }}
                        title="Hariri Swali Hili"
                        className="p-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {onDeleteQuestion && (
                        <button
                          onClick={() => {
                            onDeleteQuestion(q.id);
                            const newLog: AdminAuditLog = {
                              id: `log-${Date.now()}`,
                              action: 'Imefuta Swali la Kimasomo',
                              target: q.title,
                              adminName: currentUser.name,
                              timestamp: 'Sasa hivi',
                              type: 'content'
                            };
                            setAuditLogs(prev => [newLog, ...prev]);
                            triggerFeedback(`Swali "${q.title}" limefutwa.`);
                          }}
                          title="Futa Swali Hili"
                          className="p-2 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Answers Collapsible List */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setExpandedAnswersQuestionId(expandedAnswersQuestionId === q.id ? null : q.id)}
                      className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Kagua Majibu ya Wanafunzi ({q.answers?.length || 0})</span>
                      <ChevronRight className={`w-3 h-3 transition-transform ${expandedAnswersQuestionId === q.id ? 'rotate-90' : ''}`} />
                    </button>

                    {expandedAnswersQuestionId === q.id && (
                      <div className="mt-2.5 space-y-2 pl-3 border-l-2 border-emerald-100 dark:border-emerald-900/60 bg-gray-50/50 dark:bg-slate-800/50 p-3 rounded-xl">
                        {(!q.answers || q.answers.length === 0) ? (
                          <p className="text-[11px] text-gray-500 dark:text-slate-400 italic">Hakuna majibu yaliyowasilishwa bado kwenye swali hili.</p>
                        ) : (
                          q.answers.map(ans => (
                            <div key={ans.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <img src={ans.author.avatar} alt={ans.author.name} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-[11px] text-gray-900 dark:text-white">{ans.author.name}</span>
                                    <span className="text-[10px] text-gray-400 dark:text-slate-400">{ans.author.school}</span>
                                    {ans.isBestAnswer && <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold">Jibu Bora ★</span>}
                                  </div>
                                  <p className="text-xs text-gray-700 dark:text-slate-300 mt-1 leading-snug">{ans.content}</p>
                                </div>
                              </div>

                              {onDeleteAnswer && (
                                <button
                                  onClick={() => {
                                    onDeleteAnswer(q.id, ans.id);
                                    const newLog: AdminAuditLog = {
                                      id: `log-${Date.now()}`,
                                      action: 'Imefuta Jibu lisilofaa',
                                      target: `Jibu la ${ans.author.name}`,
                                      adminName: currentUser.name,
                                      timestamp: 'Sasa hivi',
                                      type: 'content'
                                    };
                                    setAuditLogs(prev => [newLog, ...prev]);
                                    triggerFeedback('Jibu limefutwa na Msimamizi.');
                                  }}
                                  className="p-1 rounded-lg text-gray-500 dark:text-slate-400 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer"
                                  title="Futa Jibu Hili"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SCHOOLS & CAMPUSES MANAGEMENT TAB */}
      {/* ========================================================= */}
      {adminTab === 'schools' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base">
                Usimamizi wa Shule na Vyuo ({schools.length})
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Sajili shule mpya, thibitisha vyeti vya usajili, na dhibiti jumuiya za shule.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400 dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Tafuta shule..."
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>

              <button
                onClick={() => setIsAddSchoolModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ongeza Shule Mpya</span>
              </button>
            </div>
          </div>

          {/* Schools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredSchools.map((sch) => (
              <div
                key={sch.id}
                className="rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs hover:shadow-xs flex flex-col justify-between transition-all"
              >
                {/* School Cover Image Banner */}
                <div className="relative h-24 sm:h-28 w-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={sch.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80'}
                    alt={`Jalada la ${sch.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  
                  {/* Badge */}
                  <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    {sch.category}
                  </span>

                  {/* Quick Edit Photo Button on Cover */}
                  <button
                    type="button"
                    onClick={() => handleStartEditSchool(sch)}
                    className="absolute top-2.5 right-2.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 text-gray-800 dark:text-slate-200 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                    title="Badilisha picha ya nembo au jalada la shule hii"
                  >
                    <Camera className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                    <span>Picha & Taarifa</span>
                  </button>
                </div>

                <div className="p-4 pt-0 -mt-6 relative z-10 flex-1 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <img
                      src={sch.logo || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80'}
                      alt={sch.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-800 shadow-md bg-white dark:bg-slate-800 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="flex-1 min-w-0 pt-6">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate font-heading">{sch.name}</h4>
                        {sch.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                        {sch.district}, {sch.region}
                      </div>
                      <div className="text-[11px] text-gray-600 dark:text-slate-300 mt-1">
                        Mkuu wa Shule: <span className="font-semibold text-gray-800 dark:text-white">{sch.principal}</span>
                      </div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                        Wanafunzi: {sch.studentCount.toLocaleString()} • Ada: TZS {(sch.annualFee || 500000).toLocaleString()}/mwaka
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 dark:border-slate-800 text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onVerifySchool(sch.id);
                          triggerFeedback(`Hadhi ya uthibitisho ya ${sch.name} imesasishwa!`);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                          sch.verified
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{sch.verified ? 'Imethibitishwa' : 'Thibitisha'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartEditSchool(sch)}
                        className="px-3 py-1.5 rounded-xl font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Hariri picha ya shule, cover na maelezo yake"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Hariri Shule</span>
                      </button>
                    </div>

                    {onDeleteSchool && (
                      <button
                        onClick={() => {
                          onDeleteSchool(sch.id);
                          triggerFeedback(`Shule ya ${sch.name} imeondolewa.`);
                        }}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs font-semibold px-2 py-1 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                      >
                        Ondoa
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. STUDENT & USER MANAGEMENT TAB */}
      {/* ========================================================= */}
      {adminTab === 'students' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base">
                Usimamizi wa Wanafunzi na Akaunti ({students.length})
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Wanafunzi waliosajiliwa, zawadi za EduPoints, kubadilisha wadhifa, na uthibitisho au kupiga marufuku (ban) akaunti.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Tafuta mwanafunzi au shule..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Student Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setStudentFilter('all')}
              className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                studentFilter === 'all'
                  ? 'bg-emerald-800 dark:bg-emerald-700 text-white shadow-2xs font-semibold'
                  : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
              }`}
            >
              Wote ({students.length})
            </button>
            <button
              onClick={() => setStudentFilter('active')}
              className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                studentFilter === 'active'
                  ? 'bg-emerald-800 dark:bg-emerald-700 text-white shadow-2xs font-semibold'
                  : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
              }`}
            >
              Akaunti Hai ({students.filter(s => s.status === 'active').length})
            </button>
            <button
              onClick={() => setStudentFilter('banned')}
              className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                studentFilter === 'banned'
                  ? 'bg-red-700 dark:bg-red-800 text-white shadow-2xs font-semibold'
                  : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
              }`}
            >
              Waliopigwa Marufuku (Banned) ({students.filter(s => s.status === 'banned').length})
            </button>
            <button
              onClick={() => setStudentFilter('admin')}
              className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                studentFilter === 'admin'
                  ? 'bg-purple-800 dark:bg-purple-700 text-white shadow-2xs font-semibold'
                  : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
              }`}
            >
              Wasimamizi (Admins) ({students.filter(s => s.role === 'admin').length})
            </button>
          </div>

          {/* Student Management Cards */}
          <div className="space-y-3 pt-2">
            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 dark:bg-slate-800/60 rounded-2xl text-gray-500 dark:text-slate-400 text-xs">
                Hakuna wanafunzi waliopatikana kwa kichujio hiki.
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    student.status === 'banned'
                      ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
                      : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/20 dark:ring-emerald-500/30"
                      />
                      {student.verified && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center text-white text-[9px] ring-2 ring-white dark:ring-slate-900">
                          ✓
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white font-heading">{student.name}</h4>
                        <span className="text-xs text-gray-400 dark:text-slate-400">@{student.handle}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          student.role === 'admin'
                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300'
                        }`}>
                          {student.role === 'admin' ? 'Msimamizi Mkuu' : 'Mwanafunzi'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          student.status === 'banned'
                            ? 'bg-red-600 text-white font-bold'
                            : student.status === 'suspended'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        }`}>
                          {student.status === 'banned'
                            ? '🛑 Imepigwa Marufuku (Banned)'
                            : student.status === 'suspended'
                            ? '⚠️ Imesimamishwa'
                            : '✅ Akaunti Hai'}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                        {student.schoolName} • {student.level} {student.combination ? `(${student.combination})` : ''}
                      </div>

                      <div className="flex items-center gap-3 text-xs mt-1">
                        <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">
                          {student.points.toLocaleString()} EduPoints
                        </span>
                        <span className="text-gray-400 dark:text-slate-400 text-[11px]">• Alijiunga: {student.joinDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Action Buttons for Student */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedStudentForPoints(student)}
                      className="bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Pointi (+/-)</span>
                    </button>

                    <button
                      onClick={() => handleToggleStudentRole(student.id)}
                      className="bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Wadhifa: {student.role === 'admin' ? 'Admin' : 'Mwanafunzi'}
                    </button>

                    <button
                      onClick={() => handleToggleStudentVerified(student.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        student.verified
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700'
                      }`}
                    >
                      {student.verified ? 'Imethibitishwa ✓' : 'Thibitisha'}
                    </button>

                    <button
                      onClick={() => handleToggleStudentBan(student.id)}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                        student.status === 'banned'
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                          : 'bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/60'
                      }`}
                      title={student.status === 'banned' ? 'Fungulia Mtumiaji Huyu' : 'Piga Marufuku Mtumiaji Huyu'}
                    >
                      {student.status === 'banned' ? 'Fungulia (Unban)' : 'Piga Marufuku (Ban)'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. NATIONAL BROADCASTS TAB */}
      {/* ========================================================= */}
      {adminTab === 'broadcasts' && (
        <div className="space-y-6">
          {/* Create Broadcast Announcement Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-2xs">
            <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base mb-1 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Tuma Tangazo Rasmi la Utawala kwa Wanafunzi Wote
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
              Tangazo hili litaonekana juu ya feed ya kila mwanafunzi na litatuma arifa ya simu/kifaa moja kwa moja.
            </p>

            {broadcastSent && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2 font-medium border border-emerald-200 dark:border-emerald-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Tangazo limetumwa kwa wanafunzi wote 12,483 Tanzania nzima!
              </div>
            )}

            <form onSubmit={handleBroadcast} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Aina ya Tangazo:</label>
                  <select
                    value={announcementPriority}
                    onChange={(e) => setAnnouncementPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-xs text-gray-900 dark:text-white"
                  >
                    <option value="normal">📢 Tangazo la Kawaida la Elimu</option>
                    <option value="exam">📚 Mwongozo wa NECTA & Mitihani</option>
                    <option value="urgent">🚨 Tangazo la Dharura & Scholarships</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Walengwa (Target Audience):</label>
                  <select
                    value={announcementAudience}
                    onChange={(e) => setAnnouncementAudience(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-xs text-gray-900 dark:text-white"
                  >
                    <option value="Wanafunzi Wote Tanzania">Wanafunzi Wote Tanzania</option>
                    <option value="Kidato cha Sita (Form VI)">Kidato cha Sita (Form VI)</option>
                    <option value="Kidato cha Nne (Form IV)">Kidato cha Nne (Form IV)</option>
                    <option value="Wanafunzi wa Vyuo Vikuu">Wanafunzi wa Vyuo Vikuu</option>
                    <option value="Wanafunzi wa Michepuo ya Sayansi (PCB/PCM)">Wanafunzi wa Sayansi (PCB/PCM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Kichwa cha Tangazo:</label>
                <input
                  type="text"
                  placeholder="Mfano: Ratiba ya Kitaifa ya Majaribio ya Mock na NECTA 2026..."
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Maelezo Kamili ya Tangazo:</label>
                <textarea
                  rows={3}
                  placeholder="Weka maelezo ya kina kwa wanafunzi..."
                  value={announcementMsg}
                  onChange={(e) => setAnnouncementMsg(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Tuma Tangazo Kitaifa</span>
              </button>
            </form>
          </div>

          {/* Broadcast History */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h4 className="font-heading font-bold text-gray-900 dark:text-white text-sm">Historia ya Matangazo Yaliyotumwa</h4>
            <div className="space-y-2.5 text-xs">
              {broadcastList.map((item) => (
                <div key={item.id} className="p-3.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-800 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">{item.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        item.priority === 'urgent'
                          ? 'bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-300'
                          : item.priority === 'exam'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-slate-300 text-xs mt-1">{item.message}</p>
                    <div className="text-[11px] text-gray-400 dark:text-slate-400 mt-1">
                      Walengwa: {item.audience} • Ilitumwa: {item.sentAt} • Waliofikiwa: {item.recipientsCount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. STUDY RESOURCES & PAST PAPERS VERIFICATION TAB */}
      {/* ========================================================= */}
      {adminTab === 'resources' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div>
            <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base">
              Uhakiki wa Notisi na Past Papers za NECTA ({resources.length})
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Hakiki usahihi wa notisi na mitihani ya NECTA kabla au baada ya wanafunzi kupakua kwenye Study Rooms.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-800 flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs uppercase border border-emerald-200 dark:border-emerald-800/60">
                    {res.fileFormat}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white">{res.title}</h4>
                      {res.verified && (
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          NECTA Verified
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                      Somo: {res.subject} • Topic: {res.topic} • Imetolewa na: {res.schoolOrOrg}
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-slate-400 mt-0.5">
                      {res.fileSize} • {res.downloadsCount.toLocaleString()} vipakuliwa
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (onVerifyResource) onVerifyResource(res.id);
                      triggerFeedback(`Nyenzo ya "${res.title}" imethibitishwa rasmi kuwa NECTA Verified!`);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      res.verified
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {res.verified ? 'Imethibitishwa ✓' : 'Thibitisha'}
                  </button>

                  {onDeleteResource && (
                    <button
                      onClick={() => {
                        onDeleteResource(res.id);
                        triggerFeedback(`Nyenzo ya "${res.title}" imeondolewa.`);
                      }}
                      className="p-1.5 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg cursor-pointer"
                      title="Ondoa Nyenzo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. AUDIT LOGS TAB */}
      {/* ========================================================= */}
      {adminTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div>
            <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base">
              Daftari la Ukaguzi wa Mfumo (Audit Logs & Security Trail)
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Kumbukumbu ya kila kitendo kilichofanywa na wasimamizi wa EduKan kwa uwazi na usalama.
            </p>
          </div>

          <div className="space-y-2 text-xs pt-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{log.action}</div>
                    <div className="text-[11px] text-gray-600 dark:text-slate-300">
                      Lengo: <span className="font-semibold text-gray-800 dark:text-white">{log.target}</span> • Msimamizi: {log.adminName}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 dark:text-slate-400 font-mono block">{log.timestamp}</span>
                  <span className="text-[10px] bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 px-2 py-0.2 rounded font-bold uppercase">
                    {log.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. LIBRARY & EXAMS MANAGEMENT TAB */}
      {/* ========================================================= */}
      {adminTab === 'library' && (
        <AdminLibraryTab
          books={libraryBooks}
          currentUser={currentUser}
          onVerifyBook={onVerifyLibraryBook}
          onDeleteBook={onDeleteLibraryBook}
          onAddBook={onAddLibraryBook}
          onEditBook={onEditLibraryBook}
          onTriggerFeedback={triggerFeedback}
          onAddAuditLog={(action, target, type) => {
            const newLog: AdminAuditLog = {
              id: `log-${Date.now()}`,
              action,
              target,
              adminName: currentUser.name,
              timestamp: 'Sasa hivi',
              type
            };
            setAuditLogs(prev => [newLog, ...prev]);
          }}
        />
      )}

      {/* ========================================================= */}
      {/* 9. OPPORTUNITIES & SCHOLARSHIPS TAB */}
      {/* ========================================================= */}
      {adminTab === 'opportunities' && (
        <AdminOpportunitiesTab
          opportunities={opportunities}
          currentUser={currentUser}
          onAddOpportunity={onAddOpportunity}
          onEditOpportunity={onEditOpportunity}
          onDeleteOpportunity={onDeleteOpportunity}
          onTriggerFeedback={triggerFeedback}
          onAddAuditLog={(action, target, type) => {
            const newLog: AdminAuditLog = {
              id: `log-${Date.now()}`,
              action,
              target,
              adminName: currentUser.name,
              timestamp: 'Sasa hivi',
              type
            };
            setAuditLogs(prev => [newLog, ...prev]);
          }}
        />
      )}

      {/* ========================================================= */}
      {/* 10. SYSTEM SETTINGS & BACKUP TAB */}
      {/* ========================================================= */}
      {adminTab === 'settings' && (
        <AdminSettingsTab
          currentUser={currentUser}
          studentsCount={students.length}
          schoolsCount={schools.length}
          postsCount={posts.length}
          booksCount={libraryBooks.length}
          onTriggerFeedback={triggerFeedback}
          onAddAuditLog={(action, target, type) => {
            const newLog: AdminAuditLog = {
              id: `log-${Date.now()}`,
              action,
              target,
              adminName: currentUser.name,
              timestamp: 'Sasa hivi',
              type
            };
            setAuditLogs(prev => [newLog, ...prev]);
          }}
        />
      )}

      {/* ========================================================= */}
      {/* USER FEEDBACK & SUGGESTIONS TAB */}
      {/* ========================================================= */}
      {adminTab === 'feedback' && (
        <AdminFeedbackTab
          currentUser={currentUser}
          onSendNoticeReply={(author, msg) => {
            onBroadcastAnnouncement(`Jibu la Msimamizi kwa ${author}`, msg, 'normal', 'Wanafunzi Wote Tanzania');
          }}
          onTriggerToast={triggerFeedback}
        />
      )}

      {/* ========================================================= */}
      {/* 11. REPORTS & CONTENT MODERATION TAB */}
      {/* ========================================================= */}
      {adminTab === 'reports' && (
        <AdminReportsTab
          onFeedback={triggerFeedback}
          onDeleteTarget={(targetType, targetId) => {
            if (targetType === 'post' && onDeletePost) {
              onDeletePost(targetId);
            }
          }}
        />
      )}

      {/* ========================================================= */}
      {/* 12. TEACHER VERIFICATION (TSC) TAB */}
      {/* ========================================================= */}
      {adminTab === 'teachers' && (
        <AdminTeacherVerificationTab onFeedback={triggerFeedback} />
      )}

      {/* ========================================================= */}
      {/* 13. SCHOOL FEES & GEPG FINANCE TAB */}
      {/* ========================================================= */}
      {adminTab === 'finance' && (
        <AdminFinanceTab onFeedback={triggerFeedback} />
      )}

      {/* ========================================================= */}
      {/* 14. CURRICULUM & REGIONAL ANALYTICS TAB */}
      {/* ========================================================= */}
      {adminTab === 'analytics' && (
        <AdminAnalyticsTab />
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD SCHOOL */}
      {/* ========================================================= */}
      {isAddSchoolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden my-6" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50 dark:bg-slate-800/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <School className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm font-heading">Register New School or College</h3>
              </div>
              <button
                onClick={() => setIsAddSchoolModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="p-6 space-y-3.5 text-xs text-gray-800 dark:text-slate-200">
              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Full Institution Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Kibaha Secondary School"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Region:</label>
                  <select
                    value={newSchoolRegion}
                    onChange={(e) => setNewSchoolRegion(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                  >
                    {['Dar es Salaam', 'Arusha', 'Mwanza', 'Kilimanjaro', 'Dodoma', 'Morogoro', 'Shinyanga', 'Mbeya', 'Tanga', 'Zanzibar'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">District:</label>
                  <input
                    type="text"
                    placeholder="e.g. Kibaha Urban"
                    value={newSchoolDistrict}
                    onChange={(e) => setNewSchoolDistrict(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Institution Category:</label>
                  <select
                    value={newSchoolCategory}
                    onChange={(e) => setNewSchoolCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                  >
                    <option value="High School">High School (Form 5 & 6)</option>
                    <option value="Secondary School">Secondary School (Form 1 - 4)</option>
                    <option value="University">University</option>
                    <option value="College">College / Tertiary</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Student Count:</label>
                  <input
                    type="number"
                    value={newSchoolStudents}
                    onChange={(e) => setNewSchoolStudents(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Principal / Headmaster / VC:</label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Joseph Kessy"
                  value={newSchoolPrincipal}
                  onChange={(e) => setNewSchoolPrincipal(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>

              {/* Photo & Cover Section in Add School */}
              <div className="p-3 bg-emerald-50/60 dark:bg-slate-800/80 rounded-2xl border border-emerald-100 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>Logo & Cover Photo Settings</span>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1 text-[11px]">
                    School Logo Image URL:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://... logo image url"
                      value={newSchoolLogo}
                      onChange={(e) => setNewSchoolLogo(e.target.value)}
                      className="flex-1 p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white text-xs text-gray-900 dark:text-white font-mono"
                    />
                    <img
                      src={newSchoolLogo}
                      alt="Logo Preview"
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-emerald-300 shrink-0 bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-gray-500 dark:text-slate-400">Quick Presets:</span>
                    {SCHOOL_LOGO_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewSchoolLogo(p.url)}
                        className="text-[10px] bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 hover:text-emerald-800 px-2 py-0.5 rounded-md border border-gray-200 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1 text-[11px]">
                    Cover Photo URL:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://... school campus cover url"
                      value={newSchoolCover}
                      onChange={(e) => setNewSchoolCover(e.target.value)}
                      className="flex-1 p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white text-xs text-gray-900 dark:text-white font-mono"
                    />
                    <img
                      src={newSchoolCover}
                      alt="Cover Preview"
                      className="w-12 h-7 rounded-lg object-cover ring-1 ring-emerald-300 shrink-0 bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-gray-500 dark:text-slate-400">Quick Presets:</span>
                    {SCHOOL_COVER_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewSchoolCover(p.url)}
                        className="text-[10px] bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 hover:text-emerald-800 px-2 py-0.5 rounded-md border border-gray-200 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSchoolModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Register School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT SCHOOL (INCLUDING LOGO AND COVER PHOTO) */}
      {/* ========================================================= */}
      {isEditSchoolModalOpen && editingSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden my-6" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-emerald-700 text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-emerald-200 flex items-center justify-center shadow-xs">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-heading">Edit School & Media</h3>
                  <p className="text-[11px] text-emerald-100">Update logo, cover photo, and details for {editingSchool.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditSchoolModalOpen(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedSchool} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto custom-scrollbar text-gray-800 dark:text-slate-200">
              {/* Cover & Logo Preview Canvas */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 shadow-inner">
                <div className="h-32 w-full relative">
                  <img
                    src={editSchoolCover}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 right-2 text-[11px] bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded font-mono">
                    Cover Preview
                  </span>
                </div>

                <div className="p-4 pt-0 -mt-8 relative z-10 flex items-end gap-3">
                  <img
                    src={editSchoolLogo}
                    alt="Logo preview"
                    className="w-16 h-16 rounded-2xl object-cover ring-3 ring-white dark:ring-slate-900 shadow-md bg-white shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="text-white pb-1 drop-shadow-sm">
                    <p className="font-bold text-sm leading-tight text-white">{editSchoolName || 'School Name'}</p>
                    <p className="text-[11px] text-emerald-200">{editSchoolCategory} • {editSchoolRegion}</p>
                  </div>
                </div>
              </div>

              {/* Edit Logo & Cover Inputs */}
              <div className="p-3.5 bg-emerald-50/70 dark:bg-slate-800/80 rounded-2xl border border-emerald-100 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-emerald-950 dark:text-emerald-300 text-xs">
                  <Camera className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Update School Logo & Campus Cover Photo</span>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">
                    School Logo Image URL:
                  </label>
                  <input
                    type="url"
                    value={editSchoolLogo}
                    onChange={(e) => setEditSchoolLogo(e.target.value)}
                    placeholder="Enter school logo URL..."
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white text-xs font-mono text-gray-900 dark:text-white"
                  />
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-gray-500 dark:text-slate-400">Choose Preset:</span>
                    {SCHOOL_LOGO_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditSchoolLogo(p.url)}
                        className="text-[10px] bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 hover:text-emerald-800 px-2 py-0.5 rounded-md border border-gray-200 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">
                    Cover Photo URL:
                  </label>
                  <input
                    type="url"
                    value={editSchoolCover}
                    onChange={(e) => setEditSchoolCover(e.target.value)}
                    placeholder="Enter campus cover URL..."
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white text-xs font-mono text-gray-900 dark:text-white"
                  />
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-gray-500 dark:text-slate-400">Choose Preset:</span>
                    {SCHOOL_COVER_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditSchoolCover(p.url)}
                        className="text-[10px] bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 hover:text-emerald-800 px-2 py-0.5 rounded-md border border-gray-200 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* General School Details */}
              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Full School Name:</label>
                <input
                  type="text"
                  value={editSchoolName}
                  onChange={(e) => setEditSchoolName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Region:</label>
                  <select
                    value={editSchoolRegion}
                    onChange={(e) => setEditSchoolRegion(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                  >
                    {['Dar es Salaam', 'Arusha', 'Mwanza', 'Kilimanjaro', 'Dodoma', 'Morogoro', 'Shinyanga', 'Mbeya', 'Tanga', 'Zanzibar', 'Iringa', 'Kagera', 'Kigoma', 'Mtwara', 'Ruvuma', 'Singida', 'Tabora'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">District:</label>
                  <input
                    type="text"
                    value={editSchoolDistrict}
                    onChange={(e) => setEditSchoolDistrict(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Institution Category:</label>
                  <select
                    value={editSchoolCategory}
                    onChange={(e) => setEditSchoolCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                  >
                    <option value="High School">High School (Form 5 & 6)</option>
                    <option value="Secondary School">Secondary School (Form 1 - 4)</option>
                    <option value="University">University</option>
                    <option value="College">College / Tertiary</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Student Count:</label>
                  <input
                    type="number"
                    value={editSchoolStudents}
                    onChange={(e) => setEditSchoolStudents(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Principal / Head / VC:</label>
                  <input
                    type="text"
                    value={editSchoolPrincipal}
                    onChange={(e) => setEditSchoolPrincipal(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Annual Fee (TZS):</label>
                  <input
                    type="number"
                    value={editSchoolAnnualFee}
                    onChange={(e) => setEditSchoolAnnualFee(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">About School / Community:</label>
                <textarea
                  rows={2}
                  value={editSchoolAbout}
                  onChange={(e) => setEditSchoolAbout(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                  placeholder="Describe school background or academic mission..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditSchoolModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes & Media</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AWARD/DEDUCT EDUPOINTS */}
      {/* ========================================================= */}
      {selectedStudentForPoints && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-amber-50 dark:bg-amber-950/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm font-heading">Rekebisha EduPoints</h3>
              </div>
              <button
                onClick={() => setSelectedStudentForPoints(null)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-gray-800 dark:text-slate-200">
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800/60 p-3 rounded-xl border border-gray-100 dark:border-slate-700">
                <img
                  src={selectedStudentForPoints.avatar}
                  alt={selectedStudentForPoints.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-300"
                />
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{selectedStudentForPoints.name}</div>
                  <div className="text-[11px] text-gray-500 dark:text-slate-400">{selectedStudentForPoints.schoolName}</div>
                  <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">
                    Kiasi cha sasa: {selectedStudentForPoints.points} pts
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">
                  Kiasi cha Pointi (Weka namba hasi kupunguza, k.m. -20):
                </label>
                <input
                  type="number"
                  value={pointsInput}
                  onChange={(e) => setPointsInput(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white text-sm font-mono font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForPoints(null)}
                  className="px-3.5 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="button"
                  onClick={handleAwardPoints}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Hifadhi Pointi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT POST (ADMIN MODERATION) */}
      {/* ========================================================= */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-blue-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm font-heading">Hariri Chapisho (Admin Moderation)</h3>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Mwandishi: {editingPost.author.name} (@{editingPost.author.handle})</p>
                </div>
              </div>
              <button
                onClick={() => setEditingPost(null)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPost} className="p-5 space-y-4 text-xs text-gray-800 dark:text-slate-200">
              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Maudhui ya Chapisho:</label>
                <textarea
                  rows={4}
                  value={editPostContent}
                  onChange={(e) => setEditPostContent(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-emerald-600 text-xs text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Kipengele (Category):</label>
                  <select
                    value={editPostCategory}
                    onChange={(e) => setEditPostCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-xs text-gray-900 dark:text-white"
                  >
                    <option value="masomo">Masomo 📚</option>
                    <option value="ushauri">Ushauri 💡</option>
                    <option value="burudani">Burudani ⚽</option>
                    <option value="shule">Habari za Shule 🏫</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Somo (Hiari):</label>
                  <input
                    type="text"
                    value={editPostSubject}
                    onChange={(e) => setEditPostSubject(e.target.value)}
                    placeholder="k.m. Mathematics, Physics"
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-xs text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Hifadhi Mabadiliko
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT COMMENT (ADMIN MODERATION) */}
      {/* ========================================================= */}
      {editingComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-blue-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm font-heading">Hariri Maoni (Admin Moderation)</h3>
              </div>
              <button
                onClick={() => setEditingComment(null)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditComment} className="p-5 space-y-4 text-xs text-gray-800 dark:text-slate-200">
              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Maandishi ya Maoni:</label>
                <textarea
                  rows={3}
                  value={editingComment.text}
                  onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-emerald-600 text-xs text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingComment(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Hifadhi Maoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT STUDY ROOM QUESTION */}
      {/* ========================================================= */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-blue-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm font-heading">Hariri Swali la Kimasomo</h3>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Mwandishi: {editingQuestion.author.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingQuestion(null)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditQuestion} className="p-5 space-y-3.5 text-xs text-gray-800 dark:text-slate-200">
              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Kichwa cha Swali (Title):</label>
                <input
                  type="text"
                  value={editQuestionTitle}
                  onChange={(e) => setEditQuestionTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-xs text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Somo (Subject):</label>
                  <select
                    value={editQuestionSubject}
                    onChange={(e) => setEditQuestionSubject(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-xs text-gray-900 dark:text-white"
                  >
                    {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Kiswahili', 'English'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Mada (Topic):</label>
                  <input
                    type="text"
                    value={editQuestionTopic}
                    onChange={(e) => setEditQuestionTopic(e.target.value)}
                    placeholder="k.m. Thermodynamics"
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-xs text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Maelezo ya Swali (Content):</label>
                <textarea
                  rows={4}
                  value={editQuestionContent}
                  onChange={(e) => setEditQuestionContent(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-emerald-600 text-xs text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Hifadhi Swali
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal in Admin Panel */}
      <FeedbackModal
        isOpen={isLocalFeedbackOpen}
        onClose={() => setIsLocalFeedbackOpen(false)}
        currentUser={currentUser}
        currentRole="admin"
        onSuccessToast={triggerFeedback}
      />
    </div>
  );
};
