export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: UserRole;
  avatar: string;
  coverPhoto?: string;
  schoolId?: string;
  schoolName: string;
  schoolRegion: string;
  schoolDistrict: string;
  level: string; // e.g. Form VI, University Year 2, Form IV
  combination?: string; // e.g. PCB, PCM, EGM, BCom
  title?: string; // Wadhifu / Cheo / Nafasi (e.g. Kiranja wa Masomo, Kiongozi wa Wanafunzi, n.k.)
  bio: string;
  points: number;
  followersCount: number;
  followingCount: number;
  achievements: Achievement[];
  studentRegNo?: string;
  status?: 'active' | 'suspended' | 'banned';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export type PostType = 'normal' | 'question' | 'achievement' | 'poll' | 'resource';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PostComment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    school: string;
    role: UserRole;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export type PostCategory = 'masomo' | 'ushauri' | 'burudani';

export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    school: string;
    role: UserRole;
    verified?: boolean;
  };
  type: PostType;
  category?: PostCategory;
  content: string;
  subject?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'document' | 'video';
  pollOptions?: PollOption[];
  userVotedOptionId?: string;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  sharesCount: number;
  isSaved?: boolean;
  comments?: PostComment[];
  isPinned?: boolean;
  isFlagged?: boolean;
  flagReason?: string;
  schoolId?: string;
  schoolName?: string;
  createdAt: string;
}

export interface QuestionAnswer {
  id: string;
  questionId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    school: string;
    role: UserRole;
    points: number;
  };
  content: string;
  isBestAnswer: boolean;
  votes: number;
  userVoted?: 'up' | 'down';
  createdAt: string;
}

export interface QuestionItem {
  id: string;
  author: {
    id?: string;
    name: string;
    avatar: string;
    school: string;
    form: string;
  };
  subject: string;
  topic: string;
  title: string;
  content: string;
  imageUrl?: string;
  answers: QuestionAnswer[];
  viewsCount: number;
  hasBestAnswer: boolean;
  createdAt: string;
  isSaved?: boolean;
}

export interface StudyResource {
  id: string;
  title: string;
  subject: string;
  topic: string;
  category: 'Notes' | 'Past Paper' | 'Study Guide' | 'Summary' | 'Video Lesson';
  author: string;
  schoolOrOrg: string;
  fileSize: string;
  fileFormat: 'PDF' | 'DOCX' | 'MP4';
  downloadsCount: number;
  rating: number;
  url: string;
  isSaved?: boolean;
  verified?: boolean;
  createdAt: string;
}

export type LibraryLevel = 'O-Level' | 'A-Level' | 'Chuo Kikuu' | 'Msingi' | 'Ualimu';
export type LibraryCategory = 'Vitabu vya Masomo' | 'Mitihani ya NECTA' | 'Notisi za Masomo' | 'Majaribio ya Mock' | 'Miongozo ya Walimu';

export interface LibraryItem {
  id: string;
  title: string;
  category: LibraryCategory;
  level: LibraryLevel;
  classGrade: string;
  subject: string;
  year?: string | number;
  authorOrPublisher: string;
  fileFormat: 'PDF' | 'DOCX' | 'EPUB';
  fileSize: string;
  coverImage?: string;
  downloadsCount: number;
  description?: string;
  uploaderName: string;
  uploaderRole: UserRole;
  uploaderSchool?: string;
  isSaved?: boolean;
  verified?: boolean;
  pages?: number;
  createdAt: string;
  downloadUrl?: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  target: string;
  adminName: string;
  timestamp: string;
  type: 'content' | 'school' | 'user' | 'broadcast' | 'resource' | 'system';
}

export interface BroadcastItem {
  id: string;
  title: string;
  message: string;
  priority: 'normal' | 'urgent' | 'exam';
  audience: string;
  sentAt: string;
  recipientsCount: number;
}

export interface ManagedStudent {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  schoolName: string;
  level: string;
  combination?: string;
  points: number;
  role: UserRole;
  status: 'active' | 'suspended' | 'banned';
  verified: boolean;
  joinDate: string;
}

export interface SchoolCommunity {
  id: string;
  name: string;
  category: 'High School' | 'Secondary School' | 'University' | 'College';
  region: string;
  district: string;
  studentCount: number;
  logo: string;
  coverImage: string;
  verified: boolean;
  principal: string;
  established: string;
  about: string;
  annualFee: number;
  feeAccountControlPrefix: string;
  joined?: boolean;
  activeDiscussions: number;
}

export interface OpportunityItem {
  id: string;
  title: string;
  category: 'Scholarship' | 'Competition' | 'Hackathon' | 'Internship' | 'Bootcamp' | 'Fellowship';
  organizer: string;
  organizerLogo?: string;
  deadline: string;
  eligibility: string;
  location: string;
  rewardOrStipend: string;
  description: string;
  link: string;
  attachmentUrl?: string;
  attachmentName?: string;
  bannerUrl?: string;
  isSaved?: boolean;
  applicationsCount: number;
  tags: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: 'community' | 'question' | 'opportunity' | 'announcement' | 'points';
  timestamp: string;
  read: boolean;
  actionTab?: string;
  actionData?: any;
}

export interface LeaderboardStudent {
  id: string;
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  schoolName: string;
  region: string;
  level: string;
  combination?: string;
  points: number;
  streakDays: number;
  answersGiven: number;
  badge: string;
  isCurrentUser?: boolean;
}

// ============================================
// ADMIN COMPREHENSIVE MODULE TYPES
// ============================================
export interface FlaggedReport {
  id: string;
  targetType: 'post' | 'comment' | 'user' | 'resource';
  targetId: string;
  targetTitle: string;
  targetSnippet: string;
  reporterName: string;
  reason: 'Spam' | 'Lugha Chafu' | 'Udanganyifu wa Mtihani' | 'Taarifa za Uongo' | 'Maudhui Yasiyofaa';
  status: 'pending' | 'resolved' | 'dismissed';
  reportedAt: string;
  severity: 'low' | 'medium' | 'high';
}

export interface TeacherVerificationRequest {
  id: string;
  teacherName: string;
  email: string;
  schoolName: string;
  subjects: string[];
  tscNumber: string;
  experienceYears: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface SchoolFeeTransaction {
  id: string;
  controlNumber: string;
  studentName: string;
  schoolName: string;
  gradeLevel: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentChannel: 'M-Pesa' | 'Airtel Money' | 'CRDB' | 'NMB' | 'Tigo Pesa';
  date: string;
}

// ============================================
// OPPORTUNITIES 5 CORE PILLARS TYPES
// ============================================
export interface CompetitionQuestion {
  id: string;
  competition: string;
  year: number;
  topic: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface HackathonTeam {
  id: string;
  name: string;
  hackathonName: string;
  ideaSummary: string;
  membersCount: number;
  maxMembers: number;
  lookingForRoles: string[];
  members: { name: string; role: string; avatar: string }[];
  contactHandle: string;
}

export interface HackathonProject {
  id: string;
  title: string;
  teamName: string;
  hackathon: string;
  summary: string;
  demoUrl: string;
  githubUrl: string;
  techStack: string[];
  votesCount: number;
  hasVoted?: boolean;
  previewImage: string;
}

export interface SkillMilestone {
  id: string;
  title: string;
  desc: string;
  skills: string[];
  isCompleted: boolean;
}

export interface SkillRoadmap {
  id: string;
  careerTitle: string;
  description: string;
  duration: string;
  demandLevel: 'High' | 'Very High' | 'Critical';
  milestones: SkillMilestone[];
}

export interface UniversityProfileCost {
  id: string;
  name: string;
  shortName: string;
  location: string;
  tuitionMin: number;
  tuitionMax: number;
  hostelFeePerYear: number;
  offCampusRentPerMonth: number;
  recommendedDailyAllowance: number;
  popularColleges: string[];
}

export interface StudentAmbassador {
  id: string;
  name: string;
  university: string;
  faculty: string;
  yearOfStudy: string;
  avatar: string;
  badge: string;
  bio: string;
  frequentAnswers: { question: string; answer: string }[];
}

export type ChatChannelType = 'school_general' | 'level_group' | 'private_direct';

export interface ChatAttachment {
  type: 'resource' | 'question' | 'image' | 'link' | 'audio_note';
  title: string;
  url?: string;
  fileSize?: string;
  subject?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: UserRole;
  senderLevel?: string;
  schoolName?: string;
  content: string;
  createdAt: string;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
  attachment?: ChatAttachment;
  reactions?: Record<string, number>;
  userReactions?: string[];
  status?: 'sent' | 'delivered' | 'read';
}

export interface SchoolChatChannel {
  id: string;
  type: ChatChannelType;
  schoolId?: string;
  schoolName: string;
  name: string;
  description?: string;
  level?: string; // e.g. 'Form VI', 'Form V', 'Form IV', 'O-Level (Form 1 - 4)', 'University Year 1', 'Sayansi (PCB/PCM)'
  category?: string; // e.g. 'High School', 'University'
  memberCount: number;
  unreadCount: number;
  pinned?: boolean;
  lastMessage?: {
    content: string;
    senderName: string;
    timestamp: string;
  };
  participant?: {
    id: string;
    name: string;
    handle?: string;
    avatar: string;
    schoolName: string;
    level: string;
    status: 'online' | 'offline';
    lastSeen?: string;
  };
}

