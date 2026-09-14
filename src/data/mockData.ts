import {
  UserProfile,
  Post,
  SchoolCommunity,
  OpportunityItem,
  QuestionItem,
  StudyResource,
  LibraryItem,
  AppNotification,
  LeaderboardStudent,
  AdminAuditLog,
  BroadcastItem,
  ManagedStudent,
  FlaggedReport,
  TeacherVerificationRequest,
  SchoolFeeTransaction,
  CompetitionQuestion,
  HackathonTeam,
  HackathonProject,
  SkillRoadmap,
  UniversityProfileCost,
  StudentAmbassador
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-nicolous',
  name: 'Nicolous Amini Munisi',
  handle: 'municryptrix',
  email: 'nicolousmunisi07@gmail.com',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  coverPhoto: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200&auto=format&fit=crop&q=80',
  schoolId: 'sch-malampaka',
  schoolName: 'Malampaka Secondary School',
  schoolRegion: 'Shinyanga',
  schoolDistrict: 'Kishapu',
  level: 'Form VI',
  combination: 'PCB (Physics, Chemistry, Biology)',
  title: 'Mwanafunzi & Kiranja wa Masomo (Sayansi)',
  bio: 'Future AI & Biomedical Engineer 🚀 | Mwanafunzi wa kidato cha sita mwenye shauku ya sayansi, teknolojia na utatuzi wa changamoto za jamii kupitia elimu.',
  points: 1420,
  followersCount: 245,
  followingCount: 182,
  studentRegNo: 'S.0345/0023/2026',
  achievements: [
    {
      id: 'ach-1',
      title: 'Best Answer Contributor',
      description: 'Majibu 10 yalipigiwa kura kuwa jibu bora zaidi (Best Answer) kwenye Physics na Chemistry',
      icon: '🏆',
      unlockedAt: '2026-02-14'
    },
    {
      id: 'ach-2',
      title: 'Top Peer Mentor',
      description: 'Amesaidia zaidi ya wanafunzi 150 kuelewa mada za Umeme na Thermodynamics',
      icon: '💡',
      unlockedAt: '2026-03-01'
    },
    {
      id: 'ach-3',
      title: 'Hackathon Finalist',
      description: 'Mshiriki wa nusu fainali ya Tanzania Youth Innovation Challenge 2026',
      icon: '💻',
      unlockedAt: '2026-01-20'
    },
    {
      id: 'ach-4',
      title: 'Active Discussion Leader',
      description: 'Ameongoza mijadala 15 ya kitaaluma yenye tija kwenye vyumba vya masomo',
      icon: '🌟',
      unlockedAt: '2026-01-10'
    }
  ]
};

export const INITIAL_SCHOOLS: SchoolCommunity[] = [
  {
    id: 'sch-malampaka',
    name: 'Malampaka Secondary School',
    category: 'High School',
    region: 'Shinyanga',
    district: 'Kishapu',
    studentCount: 1482,
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    verified: true,
    principal: 'Mwl. Peter Masanja',
    established: '1984',
    about: 'Shule ya Sekondari ya Malampaka inatoa mafunzo kuanzia Kidato cha 1 hadi cha 6 kwa michepuo ya Sayansi na Sanaa. Lengo letu ni kukuza vipaji na nidhamu ya kimasomo.',
    annualFee: 450000,
    feeAccountControlPrefix: '991200',
    joined: true,
    activeDiscussions: 48
  },
  {
    id: 'sch-ilboru',
    name: 'Ilboru High School',
    category: 'High School',
    region: 'Arusha',
    district: 'Arusha Mjini',
    studentCount: 1650,
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
    verified: true,
    principal: 'Mwl. Dennis Lyimo',
    established: '1946',
    about: 'Moja ya shule maalum za sayansi zenye historia ndefu na ufaulu wa juu Tanzania.',
    annualFee: 600000,
    feeAccountControlPrefix: '994500',
    joined: false,
    activeDiscussions: 62
  },
  {
    id: 'sch-udsm',
    name: 'University of Dar es Salaam (UDSM)',
    category: 'University',
    region: 'Dar es Salaam',
    district: 'Ubungo',
    studentCount: 28400,
    logo: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    verified: true,
    principal: 'Prof. William Anangisye (VC)',
    established: '1961',
    about: 'Chuo kikuu kikongwe zaidi Tanzania kinachotoa elimu ya shahada na uzamili katika fani zote.',
    annualFee: 1500000,
    feeAccountControlPrefix: '998800',
    joined: true,
    activeDiscussions: 135
  },
  {
    id: 'sch-tabora-boys',
    name: 'Tabora Boys Secondary School',
    category: 'High School',
    region: 'Tabora',
    district: 'Tabora Mjini',
    studentCount: 1320,
    logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    verified: true,
    principal: 'Mwl. Ramadhani Kingu',
    established: '1922',
    about: 'Shule ya kihistoria iliyotoa viongozi wakuu wa kitaifa na wasomi nguli wa sayansi.',
    annualFee: 500000,
    feeAccountControlPrefix: '993300',
    joined: false,
    activeDiscussions: 34
  },
  {
    id: 'sch-jangwani',
    name: 'Jangwani Secondary School',
    category: 'Secondary School',
    region: 'Dar es Salaam',
    district: 'Ilala',
    studentCount: 1890,
    logo: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&auto=format&fit=crop&q=80',
    verified: true,
    principal: 'Mwl. Fatma Zahran',
    established: '1928',
    about: 'Kituo kikuu cha maendeleo ya wasichana kielimu na uongozi jijini Dar es Salaam.',
    annualFee: 350000,
    feeAccountControlPrefix: '997700',
    joined: false,
    activeDiscussions: 29
  },
  {
    id: 'sch-mzumbe',
    name: 'Mzumbe University',
    category: 'University',
    region: 'Morogoro',
    district: 'Mvomero',
    studentCount: 14200,
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    verified: true,
    principal: 'Prof. Lughano Kusiluka (VC)',
    established: '1953',
    about: 'Chuo kinachoongoza katika fani za Utawala, Sheria, Fedha na Sayansi za Kompyuta.',
    annualFee: 1300000,
    feeAccountControlPrefix: '995500',
    joined: false,
    activeDiscussions: 52
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    author: {
      id: 'usr-nicolous',
      name: 'Nicolous Amini Munisi',
      handle: 'municryptrix',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      school: 'Malampaka Secondary School',
      role: 'student',
      verified: true
    },
    type: 'normal',
    category: 'masomo',
    content: 'Leo nimefanikiwa kumaliza kusoma na kufanya maswali yote ya NECTA kwenye Chapter 4 ya Advanced Physics: "Electromagnetism & Faraday\'s Laws" 🔥. Uelewa wa Lenz\'s law umekuwa rahisi sana baada ya kufanya practical ya solenoid! Kila la heri kwa wenzangu wanaojiandaa na Mock na Mtihani Mkuu!',
    subject: 'Physics',
    mediaUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likes: 42,
    isLiked: false,
    commentsCount: 2,
    sharesCount: 7,
    isSaved: false,
    comments: [
      {
        id: 'comm-1-1',
        postId: 'post-1',
        author: {
          id: 'usr-sarah-ilboru',
          name: 'Sarah Mmbaga',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
          school: 'Ilboru High School',
          role: 'student'
        },
        content: 'Hongera sana Nicolous! Je, umegusia pia maswali ya Eddy Currents na Self-Inductance kwenye NECTA 2022 Paper 1?',
        createdAt: 'Dakika 20 zilizopita',
        likes: 5,
        isLiked: false
      },
      {
        id: 'comm-1-2',
        postId: 'post-1',
        author: {
          id: 'usr-kelvin-udsm',
          name: 'Kelvin Komba',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          school: 'University of Dar es Salaam (UDSM)',
          role: 'student'
        },
        content: 'Faraday\'s Law ni topic pendwa sana NECTA. Kumbuka kanuni ya minus sign kwenye emf = -N(dΦ/dt) inavyoelezea Lenz\'s Law!',
        createdAt: 'Dakika 12 zilizopita',
        likes: 8,
        isLiked: true
      }
    ],
    schoolId: 'sch-malampaka',
    schoolName: 'Malampaka Secondary School',
    createdAt: 'Dakika 35 zilizopita'
  },
  {
    id: 'post-2',
    author: {
      id: 'usr-baraka-leader',
      name: 'Baraka Mwita',
      handle: 'baraka_leader',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      school: 'Malampaka Secondary School',
      role: 'student',
      verified: true
    },
    type: 'resource',
    category: 'ushauri',
    content: 'Habari za jioni wanafunzi wa Form VI. Nimeweka hapa muhtasari wa "NECTA Mock Examination Tips 2026" pamoja na ratiba ya vipindi vya kujisomea kwa makundi ya sayansi (PCB & PCM). Unaweza kupakua notes za bure na majaribio ya miaka 5 iliyopita kwenye chumba chetu cha masomo. Kila la heri katika maandalizi!',
    subject: 'Akademia & Vidokezo vya Mitihani',
    likes: 89,
    isLiked: true,
    commentsCount: 2,
    sharesCount: 19,
    isSaved: true,
    comments: [
      {
        id: 'comm-2-1',
        postId: 'post-2',
        author: {
          id: 'usr-amina-mentor',
          name: 'Dkt. Joyce Mwambungu',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
          school: 'MUHAS',
          role: 'student'
        },
        content: 'Ushauri mzuri sana Baraka! Kusoma kwa makundi ya watu 3-4 kutaongeza uelewa wa haraka wa topics ngumu.',
        createdAt: 'Saa 1 iliyopita',
        likes: 12,
        isLiked: true
      },
      {
        id: 'comm-2-2',
        postId: 'post-2',
        author: {
          id: 'usr-subira',
          name: 'Subira Hassan',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
          school: 'Lumumba Secondary School',
          role: 'student'
        },
        content: 'Nimepakua tayari notes za NECTA tips! Asante sana kwa kutujali wanafunzi wote.',
        createdAt: 'Dakika 45 zilizopita',
        likes: 4,
        isLiked: false
      }
    ],
    schoolId: 'sch-malampaka',
    schoolName: 'Malampaka Secondary School',
    createdAt: 'Saa 2 zilizopita'
  },
  {
    id: 'post-3',
    author: {
      id: 'usr-sarah-ilboru',
      name: 'Sarah Mmbaga',
      handle: 'sarah_m',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      school: 'Ilboru High School',
      role: 'student',
      verified: false
    },
    type: 'poll',
    category: 'masomo',
    content: 'Wanafunzi wa PCB na PCM Tanzania nzima: Ni mada gani kwenye Advanced Chemistry inakuchukua muda mrefu zaidi kuelewa vizuri wakati wa maandalizi ya NECTA?',
    subject: 'Chemistry',
    pollOptions: [
      { id: 'opt-1', text: 'Organic Chemistry (Reaction Mechanisms)', votes: 84 },
      { id: 'opt-2', text: 'Physical Chemistry (Chemical Equilibrium)', votes: 41 },
      { id: 'opt-3', text: 'Transition Elements & Coordination', votes: 29 },
      { id: 'opt-4', text: 'Electrochemistry & Nernst Equation', votes: 22 }
    ],
    likes: 67,
    isLiked: false,
    commentsCount: 1,
    sharesCount: 12,
    isSaved: false,
    comments: [
      {
        id: 'comm-3-1',
        postId: 'post-3',
        author: {
          id: 'usr-joseph-sports',
          name: 'Josephat Massawe',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
          school: 'Ilboru High School',
          role: 'student'
        },
        content: 'Mimi reaction mechanisms za Benzene na Diazonium salts ndizo zilinitesa sana mpaka nilipochora flow chart ya rangi!',
        createdAt: 'Saa 3 zilizopita',
        likes: 9,
        isLiked: false
      }
    ],
    schoolId: 'sch-ilboru',
    schoolName: 'Ilboru High School',
    createdAt: 'Saa 5 zilizopita'
  },
  {
    id: 'post-4',
    author: {
      id: 'usr-kelvin-udsm',
      name: 'Kelvin Komba',
      handle: 'kelvin_tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      school: 'University of Dar es Salaam (UDSM)',
      role: 'student',
      verified: true
    },
    type: 'achievement',
    category: 'burudani',
    content: 'Nimepata furaha kubwa kutunukiwa cheti changu cha Python for Data Science & AI na kuteuliwa kushiriki Google Student Developers Summit 2026! 🎉🇹🇿 Shukrani kwa wanafunzi wenzangu wa EduKan Study Room kwa majadiliano yaliyosaidia sana.',
    subject: 'Computer Science & AI',
    mediaUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likes: 124,
    isLiked: false,
    commentsCount: 45,
    sharesCount: 18,
    isSaved: false,
    schoolId: 'sch-udsm',
    schoolName: 'University of Dar es Salaam (UDSM)',
    createdAt: 'Jana'
  },
  {
    id: 'post-5',
    author: {
      id: 'usr-amina-mentor',
      name: 'Dkt. Joyce Mwambungu',
      handle: 'joyce_mentorship',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      school: 'Muhimbili University of Health and Allied Sciences (MUHAS)',
      role: 'student',
      verified: true
    },
    type: 'normal',
    category: 'ushauri',
    content: '💡 Ushauri kwa wanafunzi wanaopanga kusoma Udaktari (MD) au Ufamasia: Usiwe na hofu na wingi wa maudhui ya Biology na Chemistry kidato cha sita. Jenga ratiba ya "Active Recall" na kusoma maswali ya miaka 10 iliyopita. Pia hakikisha afya yako ya akili na usingizi vinapata kipaumbele.',
    subject: 'Ushauri wa Kitaaluma & Afya ya Akili',
    likes: 156,
    isLiked: false,
    commentsCount: 38,
    sharesCount: 32,
    isSaved: false,
    schoolId: 'sch-muhas',
    schoolName: 'MUHAS',
    createdAt: 'Saa 6 zilizopita'
  },
  {
    id: 'post-6',
    author: {
      id: 'usr-joseph-sports',
      name: 'Josephat Massawe',
      handle: 'joseph_sports',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      school: 'Ilboru High School',
      role: 'student',
      verified: true
    },
    type: 'normal',
    category: 'burudani',
    content: '⚽ Pongezi kubwa kwa timu yetu ya mpira wa miguu ya Ilboru kwa kuibuka kidedea 2-1 dhidi ya Tabora Boys kwenye bonanza la michezo la kirafiki! Michezo inaburudisha na kusaidia kuongeza umakini darasani. Tuko tayari kwa UMISSETA!',
    subject: 'Michezo & Vipaji Shuleni',
    mediaUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likes: 95,
    isLiked: false,
    commentsCount: 22,
    sharesCount: 9,
    isSaved: false,
    schoolId: 'sch-ilboru',
    schoolName: 'Ilboru High School',
    createdAt: 'Masaa 8 yaliyopita'
  },
  {
    id: 'post-uni-1',
    author: {
      id: 'usr-kelvin-udsm',
      name: 'Kelvin Komba',
      handle: 'kelvin_tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      school: 'University of Dar es Salaam (UDSM)',
      role: 'student',
      verified: true
    },
    type: 'resource',
    category: 'masomo',
    content: '📚 Muhtasari wa Lecture: "Distributed Systems & Cloud Computing Architecture" kwa wanafunzi wa Shahada ya Computer Science (Year 2 & 3). Nimeambatanisha slide za maabara na miongozo ya kuelewa CAP Theorem, Microservices na Consensus Algorithms (Raft). Karibuni kwenye mjadala wa chuo kikuu!',
    subject: 'Computer Science & Higher Ed',
    mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likes: 142,
    isLiked: false,
    commentsCount: 18,
    sharesCount: 24,
    isSaved: true,
    schoolId: 'sch-udsm',
    schoolName: 'University of Dar es Salaam (UDSM)',
    createdAt: 'Masaa 4 yaliyopita'
  },
  {
    id: 'post-uni-2',
    author: {
      id: 'usr-amina-mentor',
      name: 'Dkt. Joyce Mwambungu',
      handle: 'joyce_mentorship',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      school: 'MUHAS',
      role: 'student',
      verified: true
    },
    type: 'question',
    category: 'masomo',
    content: '🩺 Swali la Kliniki (Chuo Kikuu - Pathology & Internal Medicine): Mgonjwa mwenye umri wa miaka 45 anafika na dalili za Diabetic Ketoacidosis (DKA). Ni hatua zipi sahihi za kurekebisha serum Potassium (K+) kabla na wakati wa kuanzisha intravenous insulin infusion?',
    subject: 'Clinical Medicine (University)',
    likes: 98,
    isLiked: false,
    commentsCount: 14,
    sharesCount: 11,
    isSaved: false,
    schoolId: 'sch-muhas',
    schoolName: 'MUHAS',
    createdAt: 'Saa 1 iliyopita'
  },
  {
    id: 'post-olevel-1',
    author: {
      id: 'usr-zainab-olevel',
      name: 'Zainab Ramadhani',
      handle: 'zainab_csee',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      school: 'Jangwani Secondary School',
      role: 'student',
      verified: false
    },
    type: 'question',
    category: 'masomo',
    content: '🔬 Swali la NECTA CSEE Form IV Biology: Eleza muundo na kazi za chembechembe nyekundu za damu (Red Blood Cells), na namna zilivyojirekebisha (adaptations) kusafirisha hewa ya oksijeni kwa ufanisi mwilini.',
    subject: 'Biology (Kidato cha IV)',
    likes: 64,
    isLiked: false,
    commentsCount: 9,
    sharesCount: 5,
    isSaved: false,
    schoolId: 'sch-jangwani',
    schoolName: 'Jangwani Secondary School',
    createdAt: 'Masaa 3 yaliyopita'
  }
];

export const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-1',
    author: {
      name: 'Amina Selemani',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      school: 'Jangwani Secondary School',
      form: 'Form VI • PCB'
    },
    subject: 'Physics',
    topic: 'Alternating Current & Resonance',
    title: 'Jinsi ya kupata Resonant Frequency kwenye RLC Series Circuit?',
    content: 'Swali la NECTA 2023: Katika mzunguko wa RLC mfululizo, thamani ya Inductance ni L = 0.5 H na Capacitance ni C = 20 μF. Upinzani ni R = 100 Ω. Je, ni resonance frequency ipi inayofanya current kufikia peak, na Q-factor inahesabiwaje?',
    viewsCount: 382,
    hasBestAnswer: true,
    isSaved: true,
    createdAt: 'Saa 3 zilizopita',
    answers: [
      {
        id: 'ans-1',
        questionId: 'q-1',
        author: {
          id: 'usr-nicolous',
          name: 'Nicolous Amini Munisi',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          school: 'Malampaka Secondary School',
          role: 'student',
          points: 1420
        },
        content: `Hatua kwa hatua:
1. Resonant angular frequency inatokea pale inductive reactance inapolingana na capacitive reactance (XL = Xc):
   ω₀ = 1 / √(L × C)
   ω₀ = 1 / √(0.5 × 20×10⁻⁶) = 1 / √(10⁻⁵) = 316.23 rad/s
2. Resonant frequency (f₀):
   f₀ = ω₀ / (2π) = 316.23 / 6.2832 ≈ 50.33 Hz.
3. Quality Factor (Q):
   Q = (ω₀ × L) / R = (316.23 × 0.5) / 100 = 1.58.
Hii ina maana mzunguko una resonance mkali kiasi lakini upinzani unapunguza ncha kidogo.`,
        isBestAnswer: true,
        votes: 18,
        userVoted: 'up',
        createdAt: 'Saa 2 zilizopita'
      },
      {
        id: 'ans-2',
        questionId: 'q-1',
        author: {
          id: 'usr-john',
          name: 'John Magembe',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
          school: 'Tabora Boys',
          role: 'student',
          points: 890
        },
        content: 'Jibu la Nicolous ni sahihi kabisa. Kumbuka pia kwamba kwenye resonance, impedance ya mzunguko inakuwa sawa na R pekee (Z = R = 100 Ω), hivyo current iko in-phase na voltage ya chanzo (power factor = 1).',
        isBestAnswer: false,
        votes: 7,
        createdAt: 'Saa 1 iliyopita'
      }
    ]
  },
  {
    id: 'q-2',
    author: {
      name: 'Emmanuel Mwamba',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      school: 'Ilboru High School',
      form: 'Form VI • PCM'
    },
    subject: 'Mathematics',
    topic: 'Differential Calculus & Optimization',
    title: 'Kutafuta Maximum Volume ya Silinda ndani ya Tufe (Sphere)',
    content: 'Tufe lenye rediasi R limeshikilia silinda ndani yake. Ni uwiano gani wa kimo cha silinda (h) na rediasi yake (r) unaotoa ujazo mkubwa zaidi unaowezekana? Tusaidiane derivations.',
    viewsCount: 241,
    hasBestAnswer: false,
    isSaved: false,
    createdAt: 'Jana',
    answers: [
      {
        id: 'ans-3',
        questionId: 'q-2',
        author: {
          id: 'usr-grace-student',
          name: 'Grace Mwakyusa (Peer Tutor)',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
          school: 'Malampaka Secondary School',
          role: 'student',
          points: 3200
        },
        content: 'Kwa kutumia Pythagoras: r² + (h/2)² = R² => r² = R² - h²/4. Ujazo V = π r² h = π (R²h - h³/4). Tafuta dV/dh = π (R² - 3h²/4) = 0 => h = 2R / √3. Kisha weka kwenye r kupata jibu kamili.',
        isBestAnswer: false,
        votes: 12,
        createdAt: 'Masaa 18 yaliyopita'
      }
    ]
  },
  {
    id: 'q-3',
    author: {
      name: 'Mariam Said',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      school: 'Jangwani Secondary School',
      form: 'Form VI • PCB'
    },
    subject: 'Biology',
    topic: 'Genetics & Dihybrid Cross',
    title: 'Epistasis vs Incomplete Dominance kwenye matokeo ya F2 Generation',
    content: 'Nani ana mifano ya wazi ya NECTA inayotofautisha kati ya Recessive Epistasis (ratio 9:3:4) na Duplicate Dominant Epistasis (15:1)?',
    viewsCount: 198,
    hasBestAnswer: false,
    isSaved: false,
    createdAt: 'Masaa 12 yaliyopita',
    answers: []
  },
  {
    id: 'q-uni-1',
    author: {
      name: 'Kelvin Komba',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      school: 'University of Dar es Salaam (UDSM)',
      form: 'Chuo Kikuu • BSc Computer Science'
    },
    subject: 'Computer Science',
    topic: 'Algorithms & Distributed Systems',
    title: 'Kuthibitisha NP-Completeness ya Vertex Cover Problem kwa kutumia 3-SAT Reduction',
    content: 'Kwa wanafunzi wa Shahada ya Computer Science au Uhandisi: Ni zipi hatua sahihi za polynomial-time reduction kutoka 3-CNF SAT kwenda Vertex Cover bila kuacha ukinzani kwenye gadjeti za kimahesabu?',
    viewsCount: 312,
    hasBestAnswer: true,
    isSaved: true,
    createdAt: 'Masaa 6 yaliyopita',
    answers: [
      {
        id: 'ans-uni-1',
        questionId: 'q-uni-1',
        author: {
          id: 'usr-kelvin-udsm',
          name: 'Kelvin Komba',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          school: 'University of Dar es Salaam (UDSM)',
          role: 'student',
          points: 2150
        },
        content: `Ufafanuzi wa kiakademia:
1. Ujenzi wa Graph G = (V, E): Kwa kila variable x_i, tengeneza vipeo viwili (x_i na ¬x_i) vilivyounganishwa na makali (edge).
2. Kwa kila clause C_j yenye literals 3, tengeneza pembe tatu (triangle gadget ya vipeo 3).
3. Unganisha kila literal kwenye triangle gadget kwenda kwenye variable gadget inayolingana.
4. Weka ukubwa wa jalada (cover size) k = n + 2m, ambapo n ni idadi ya variables na m ni idadi ya clauses.
Kwa njia hii, 3-SAT inaridhika ikiwa tu na pale ambapo G ina vertex cover ya ukubwa k!`,
        isBestAnswer: true,
        votes: 15,
        createdAt: 'Masaa 4 yaliyopita'
      }
    ]
  },
  {
    id: 'q-olevel-1',
    author: {
      name: 'Bakari Juma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      school: 'Kibaha Secondary School',
      form: 'Kidato cha IV • O-Level'
    },
    subject: 'Mathematics',
    topic: 'Quadratic Equations & Algebra',
    title: 'Hatua za kutatua 2x² + 7x + 3 = 0 kwa njia ya Completing the Square',
    content: 'Swali la NECTA CSEE Form 4: Naomba mwongozo wa hatua kwa hatua wa kutatua mlinganyo huu bila kutumia Quadratic Formula (kanuni ya jumla) ili nipate alama zote za NECTA.',
    viewsCount: 165,
    hasBestAnswer: true,
    isSaved: false,
    createdAt: 'Masaa 8 yaliyopita',
    answers: [
      {
        id: 'ans-olevel-1',
        questionId: 'q-olevel-1',
        author: {
          id: 'usr-nicolous',
          name: 'Nicolous Amini Munisi',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          school: 'Malampaka Secondary School',
          role: 'student',
          points: 1420
        },
        content: `Hatua zote za NECTA CSEE:
1. Gawanya mlinganyo wote kwa 2: x² + (7/2)x + 3/2 = 0
2. Hamisha namba isiyo na herufi upande wa kulia: x² + (7/2)x = -3/2
3. Ongeza nusu ya mgawo wa x ikiwa mraba pande zote mbili: [1/2 × (7/2)]² = (7/4)² = 49/16:
   x² + (7/2)x + 49/16 = -3/2 + 49/16
4. Funga upande wa kushoto kama mraba kamili: (x + 7/4)² = (-24 + 49)/16 = 25/16
5. Chukua kipeuo pande zote: x + 7/4 = ± 5/4
   x₁ = -7/4 + 5/4 = -2/4 = -1/2
   x₂ = -7/4 - 5/4 = -12/4 = -3.
Hivyo: x = -1/2 au x = -3!`,
        isBestAnswer: true,
        votes: 11,
        createdAt: 'Masaa 7 yaliyopita'
      }
    ]
  }
];

export const INITIAL_RESOURCES: StudyResource[] = [
  {
    id: 'res-1',
    title: 'NECTA Physics Form VI Solved Past Papers (2018 - 2025)',
    subject: 'Physics',
    topic: 'Mtihani Mkuu & Miongozo ya Kusahihisha',
    category: 'Past Paper',
    author: 'EduKan Science Panel',
    schoolOrOrg: 'Baraza la Elimu ya Sayansi',
    fileSize: '4.8 MB',
    fileFormat: 'PDF',
    downloadsCount: 1420,
    rating: 4.9,
    url: '#',
    isSaved: true,
    createdAt: '2026-02-10'
  },
  {
    id: 'res-2',
    title: 'Complete Organic Chemistry Reaction Mechanisms & Mindmaps',
    subject: 'Chemistry',
    topic: 'Hydrocarbons, Carbonyls & Polymers',
    category: 'Notes',
    author: 'Mwl. Dennis Lyimo',
    schoolOrOrg: 'Ilboru High School',
    fileSize: '3.2 MB',
    fileFormat: 'PDF',
    downloadsCount: 980,
    rating: 4.8,
    url: '#',
    isSaved: false,
    createdAt: '2026-02-18'
  },
  {
    id: 'res-3',
    title: 'NECTA Biology Form V & VI Diagrams, Terminology & Practical Manual',
    subject: 'Biology',
    topic: 'Physiology, Ecology & Biochemistry',
    category: 'Study Guide',
    author: 'Idara ya Biolojia Malampaka',
    schoolOrOrg: 'Malampaka Secondary School',
    fileSize: '6.1 MB',
    fileFormat: 'PDF',
    downloadsCount: 840,
    rating: 4.7,
    url: '#',
    isSaved: false,
    createdAt: '2026-01-25'
  },
  {
    id: 'res-4',
    title: 'Advanced Mathematics Formulas & Standard Integral Tables',
    subject: 'Mathematics',
    topic: 'Calculus, Trigonometry & Vectors',
    category: 'Summary',
    author: 'Tabora Academic Union',
    schoolOrOrg: 'Tabora Boys',
    fileSize: '1.9 MB',
    fileFormat: 'PDF',
    downloadsCount: 1120,
    rating: 4.9,
    url: '#',
    isSaved: true,
    createdAt: '2026-02-05'
  }
];

export const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp-1',
    title: 'Tanzania National Science & Innovation Challenge 2026',
    category: 'Competition',
    organizer: 'COSTECH & Wizara ya Elimu (MoEST)',
    deadline: 'Tarehe 30 Aprili, 2026',
    eligibility: 'Wanafunzi wote wa Sekondari na Vyuo Tanzania Bara na Visiwani',
    location: 'Dar es Salaam & Mtandaoni',
    rewardOrStipend: 'Zawadi ya TZS 15,000,000 + Ufadhili wa Chuo',
    description: 'Shindano la kitaifa la kubuni mifumo ya kiteknolojia, nishati safi, na kilimo chenye tija kwa maendeleo endelevu ya Tanzania.',
    link: 'https://costech.or.tz',
    isSaved: true,
    applicationsCount: 428,
    tags: ['Innovation', 'Science', 'Youth', 'Tanzania']
  },
  {
    id: 'opp-2',
    title: 'Google Student AI & Software Engineering Fellowship',
    category: 'Fellowship',
    organizer: 'Google Research Africa',
    deadline: 'Tarehe 15 Mei, 2026',
    eligibility: 'Wanafunzi wanaotarajia kujiunga au waliopo Chuo Kikuu (Computer Science, Data)',
    location: 'Nairobi / Remote',
    rewardOrStipend: '$1,200 kwa mwezi + Laptop & Mentorship',
    description: 'Mafunzo ya vitendo ya miezi 6 kwa vijana wanaopenda Artificial Intelligence, Machine Learning, na uundaji wa mifumo mikubwa.',
    link: 'https://buildyourfuture.withgoogle.com',
    isSaved: false,
    applicationsCount: 890,
    tags: ['Google', 'AI', 'Software', 'Mentorship']
  },
  {
    id: 'opp-3',
    title: 'Ufadhili wa Masomo wa Samia Scholarship (Sayansi & Teknolojia)',
    category: 'Scholarship',
    organizer: 'Serikali ya Jamhuri ya Muungano wa Tanzania',
    deadline: 'Tarehe 31 Julai, 2026',
    eligibility: 'Wanafunzi waliofanya vizuri zaidi masomo ya Sayansi Kidato cha Sita (PCB, PCM, PGM, CBG)',
    location: 'Vyuo Vikuu vya Umma Tanzania',
    rewardOrStipend: 'Gharama zote za Ada (100%), Malazi, Vitabu na Laptop',
    description: 'Mpango maalum wa serikali kugharamia masomo ya juu kwa vijana wenye ufaulu wa daraja la kwanza kwenye masomo ya Sayansi na Teknolojia.',
    link: 'https://moe.go.tz',
    isSaved: true,
    applicationsCount: 1650,
    tags: ['Government', 'Scholarship', 'Sayansi', 'Form VI']
  },
  {
    id: 'opp-4',
    title: 'Vodacom Digital Accelerator Bootcamp & Seed Grant',
    category: 'Bootcamp',
    organizer: 'Vodacom Tanzania & Smart Lab',
    deadline: 'Tarehe 20 Juni, 2026',
    eligibility: 'Vijana wenye umri wa miaka 16-25 wenye mawazo ya biashara au apps',
    location: 'Dar es Salaam (In-person & Virtual)',
    rewardOrStipend: 'TZS 10,000,000 Seed Grant + Kadi za Simu na Data ya Mwaka Mzima',
    description: 'Kambi ya wiki 8 ya kujifunza ujasiriamali wa kidijitali, uundaji wa tovuti, na matumizi ya M-Pesa API katika biashara.',
    link: 'https://vodacom.co.tz',
    isSaved: false,
    applicationsCount: 312,
    tags: ['Fintech', 'Bootcamp', 'Vodacom', 'Startups']
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Mjadala Mpya: Advanced Physics Electromagnetism',
    message: 'Mjadala mpya wa maandalizi ya NECTA umeanza kwenye chumba cha masomo cha Sayansi.',
    category: 'community',
    timestamp: 'Dakika 10 zilizopita',
    read: false,
    actionTab: 'study'
  },
  {
    id: 'notif-2',
    title: 'Jibu Lako Limechaguliwa kama "Best Answer" 🏆',
    message: 'Amina Selemani amechagua jibu lako la mada ya "Alternating Current RLC" kuwa jibu bora zaidi. Umepata +1 Knowledge Point!',
    category: 'question',
    timestamp: 'Saa 2 zilizopita',
    read: false,
    actionTab: 'study'
  },
  {
    id: 'notif-3',
    title: 'Fursa Mpya: Samia Scholarship 2026',
    message: 'Ufadhili wa 100% kwa wanafunzi wa sayansi wanaojiandaa kujiunga na Chuo Kikuu umetangazwa rasmi.',
    category: 'opportunity',
    timestamp: 'Jana',
    read: true,
    actionTab: 'opportunities'
  },
  {
    id: 'notif-4',
    title: 'Karibu kwenye Chumba cha Hesabu & Sayansi',
    message: 'Wanafunzi 40+ wanajadili maswali magumu ya Calculus na Thermodynamics leo.',
    category: 'community',
    timestamp: 'Juzi',
    read: true,
    actionTab: 'study'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardStudent[] = [
  {
    id: 'usr-baraka',
    rank: 1,
    name: 'Baraka Joel',
    handle: 'baraka_pcm',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Tabora Boys High School',
    region: 'Tabora',
    level: 'Form VI',
    combination: 'PCM (Physics, Chem, Math)',
    points: 1890,
    streakDays: 28,
    answersGiven: 84,
    badge: 'Kinara wa Taifa 🏆'
  },
  {
    id: 'usr-aisha',
    rank: 2,
    name: 'Aisha Mwinyi',
    handle: 'aisha_pcb',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Feza Girls High School',
    region: 'Dar es Salaam',
    level: 'Form VI',
    combination: 'PCB (Physics, Chem, Bio)',
    points: 1750,
    streakDays: 24,
    answersGiven: 72,
    badge: 'Genius wa Biology 🧬'
  },
  {
    id: 'usr-nicolous',
    rank: 3,
    name: 'Nicolous Amini Munisi',
    handle: 'municryptrix',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Malampaka Secondary School',
    region: 'Shinyanga',
    level: 'Form VI',
    combination: 'PCB (Physics, Chem, Bio)',
    points: 1420,
    streakDays: 19,
    answersGiven: 56,
    badge: 'Top Peer Mentor 💡',
    isCurrentUser: true
  },
  {
    id: 'usr-juma',
    rank: 4,
    name: 'Juma Rashidi',
    handle: 'juma_ilboro',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Ilboro High School',
    region: 'Arusha',
    level: 'Form VI',
    combination: 'PCM (Physics, Chem, Math)',
    points: 1310,
    streakDays: 16,
    answersGiven: 48,
    badge: 'Hesabu Master 📐'
  },
  {
    id: 'usr-doreen',
    rank: 5,
    name: 'Doreen Tarimo',
    handle: 'doreen_marian',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Marian Girls High School',
    region: 'Pwani',
    level: 'Form VI',
    combination: 'HGL (History, Geo, Lang)',
    points: 1180,
    streakDays: 14,
    answersGiven: 41,
    badge: 'Historia & Geo Star 🌍'
  },
  {
    id: 'usr-kelvin',
    rank: 6,
    name: 'Kelvin Mushi',
    handle: 'kelvin_kibaha',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Kibaha Boys Secondary',
    region: 'Pwani',
    level: 'Form VI',
    combination: 'PGM (Physics, Geo, Math)',
    points: 1120,
    streakDays: 12,
    answersGiven: 38,
    badge: 'ICT Innovator 💻'
  },
  {
    id: 'usr-neema',
    rank: 7,
    name: 'Neema Mwambipile',
    handle: 'neema_stfrancis',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    schoolName: 'St. Francis Girls Secondary',
    region: 'Mbeya',
    level: 'Form VI',
    combination: 'CBG (Chem, Bio, Geo)',
    points: 1050,
    streakDays: 11,
    answersGiven: 34,
    badge: 'Chemistry Star 🧪'
  },
  {
    id: 'usr-emmanuel',
    rank: 8,
    name: 'Emmanuel Kisena',
    handle: 'emmanuel_mzumbe',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Mzumbe Secondary School',
    region: 'Morogoro',
    level: 'Form VI',
    combination: 'EGM (Econ, Geo, Math)',
    points: 980,
    streakDays: 9,
    answersGiven: 29,
    badge: 'Economics Guru 📈'
  },
  {
    id: 'usr-subira',
    rank: 9,
    name: 'Subira Hassan',
    handle: 'subira_znz',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Lumumba Secondary School',
    region: 'Zanzibar Mjini',
    level: 'Form VI',
    combination: 'HKL (History, Kiswahili, Lang)',
    points: 920,
    streakDays: 8,
    answersGiven: 25,
    badge: 'Lugha & Fasihi 📖'
  },
  {
    id: 'usr-victor',
    rank: 10,
    name: 'Victor Lyimo',
    handle: 'victor_loyola',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Loyola High School',
    region: 'Dar es Salaam',
    level: 'Form VI',
    combination: 'PCB (Physics, Chem, Bio)',
    points: 860,
    streakDays: 7,
    answersGiven: 22,
    badge: 'Physics Champion ⚡'
  }
];

export const INITIAL_MANAGED_STUDENTS: ManagedStudent[] = [
  {
    id: 'usr-nicolous',
    name: 'Nicolous Amini Munisi',
    handle: 'municryptrix',
    email: 'nicolousmunisi07@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Malampaka Secondary School',
    level: 'Form VI',
    combination: 'PCB (Physics, Chem, Bio)',
    points: 850,
    role: 'student',
    status: 'active',
    verified: true,
    joinDate: '12 Jan 2026'
  },
  {
    id: 'usr-baraka-leader',
    name: 'Baraka Mwita',
    handle: 'baraka_leader',
    email: 'baraka.mwita@malampaka.ac.tz',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Malampaka Secondary School',
    level: 'Form VI',
    combination: 'PCM (Physics, Chem, Math)',
    points: 1250,
    role: 'student',
    status: 'active',
    verified: true,
    joinDate: '05 Jan 2026'
  },
  {
    id: 'usr-sarah-ilboru',
    name: 'Sarah Mmbaga',
    handle: 'sarah_m',
    email: 'sarah.m@ilboru.ac.tz',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Ilboru High School',
    level: 'Form VI',
    combination: 'PCB (Physics, Chem, Bio)',
    points: 1420,
    role: 'student',
    status: 'active',
    verified: true,
    joinDate: '02 Jan 2026'
  },
  {
    id: 'usr-kelvin-udsm',
    name: 'Kelvin Komba',
    handle: 'kelvin_tech',
    email: 'kelvin.komba@udsm.ac.tz',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    schoolName: 'University of Dar es Salaam (UDSM)',
    level: 'University Year 2',
    combination: 'BSc. Computer Science',
    points: 2100,
    role: 'student',
    status: 'active',
    verified: true,
    joinDate: '20 Dec 2025'
  },
  {
    id: 'usr-amina-mentor',
    name: 'Dkt. Joyce Mwambungu',
    handle: 'joyce_mentorship',
    email: 'j.mwambungu@muhas.ac.tz',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    schoolName: 'MUHAS',
    level: 'Graduate / Medical Intern',
    combination: 'Medicine (MD)',
    points: 3450,
    role: 'admin',
    status: 'active',
    verified: true,
    joinDate: '15 Nov 2025'
  },
  {
    id: 'usr-joseph-sports',
    name: 'Josephat Massawe',
    handle: 'joseph_sports',
    email: 'josephat.m@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Ilboru High School',
    level: 'Form V',
    combination: 'CBG (Chem, Bio, Geo)',
    points: 620,
    role: 'student',
    status: 'active',
    verified: false,
    joinDate: '01 Feb 2026'
  }
];

export const INITIAL_BROADCASTS: BroadcastItem[] = [
  {
    id: 'bc-1',
    title: 'Ratiba ya Kitaifa ya Majaribio ya Mock na NECTA 2026',
    message: 'Mitihani ya majaribio ya Mock kitaifa kwa Kidato cha Sita itaanza rasmi tarehe 15 Machi. Miongozo ya mitihani na Past Papers zimeshawekwa kwenye Vyumba vya Masomo.',
    priority: 'exam',
    audience: 'Kidato cha Sita (Form VI)',
    sentAt: 'Leo, 10:30 Asubuhi',
    recipientsCount: 4200
  },
  {
    id: 'bc-2',
    title: 'Ufunguzi wa Maombi ya Samia Scholarship 2026',
    message: 'Wanafunzi wote wa sayansi wenye ufaulu wa juu wanakumbushwa kutuma maombi ya ufadhili wa masomo ya juu ya Sayansi na Teknolojia.',
    priority: 'urgent',
    audience: 'Wanafunzi Wote wa Sayansi',
    sentAt: 'Jana, 14:15 Mchana',
    recipientsCount: 12483
  }
];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-1',
    action: 'Imethibitisha Shule (Verified School)',
    target: 'Malampaka Secondary School',
    adminName: 'Msimamizi Mkuu',
    timestamp: 'Dakika 15 zilizopita',
    type: 'school'
  },
  {
    id: 'log-2',
    action: 'Imetuma Tangazo Rasmi (Broadcast Sent)',
    target: 'Ratiba ya Mock 2026',
    adminName: 'Msimamizi Mkuu',
    timestamp: 'Saa 2 zilizopita',
    type: 'broadcast'
  },
  {
    id: 'log-3',
    action: 'Imethibitisha Nyenzo ya Kimasomo (NECTA Verified)',
    target: 'Physics Paper 1 Past Paper 2024 Marking Scheme',
    adminName: 'Msimamizi Mkuu',
    timestamp: 'Saa 4 zilizopita',
    type: 'resource'
  },
  {
    id: 'log-4',
    action: 'Imetoa Tuzo ya Pointi (+50 EduPoints)',
    target: 'Sarah Mmbaga (Winner Essay Contest)',
    adminName: 'Msimamizi Mkuu',
    timestamp: 'Jana',
    type: 'user'
  }
];

export const INITIAL_LIBRARY_BOOKS: LibraryItem[] = [
  {
    id: 'lib-1',
    title: 'NECTA ACSEE Physics Paper 1 & 2 (2020 - 2024 Solved with Marking Scheme)',
    category: 'Mitihani ya NECTA',
    level: 'A-Level',
    classGrade: 'Kidato cha 5 & 6',
    subject: 'Physics',
    year: 2024,
    authorOrPublisher: 'Baraza la Mitihani la Taifa (NECTA)',
    fileFormat: 'PDF',
    fileSize: '8.4 MB',
    coverImage: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&auto=format&fit=crop&q=80',
    downloadsCount: 1840,
    description: 'Mkusanyiko kamili wa mitihani ya NECTA ya Physics Kidato cha Sita kwa miaka 5 iliyopita ikiwa na majibu yaliyofafanuliwa hatua kwa hatua kulingana na muundo rasmi wa mtihani.',
    uploaderName: 'Nicolous Amini Munisi',
    uploaderRole: 'student',
    uploaderSchool: 'Malampaka Secondary School',
    isSaved: true,
    createdAt: 'Wiki 2 zilizopita'
  },
  {
    id: 'lib-2',
    title: 'TIE Advanced Biology for Secondary Schools: Form 5 & 6',
    category: 'Vitabu vya Masomo',
    level: 'A-Level',
    classGrade: 'Kidato cha 5 & 6',
    subject: 'Biology',
    year: 2023,
    authorOrPublisher: 'Taasisi ya Elimu Tanzania (TIE)',
    fileFormat: 'PDF',
    fileSize: '15.2 MB',
    coverImage: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=400&auto=format&fit=crop&q=80',
    downloadsCount: 2450,
    description: 'Kitabu rasmi cha serikali cha somo la Biolojia ngazi ya Kidato cha Tano na Sita. Kina vielelezo vya kisasa, michoro, na mada zote za Cytology, Genetics, Physiology na Ecology.',
    uploaderName: 'Mwl. Peter Masanja',
    uploaderRole: 'admin',
    uploaderSchool: 'Malampaka Secondary School',
    isSaved: false,
    createdAt: 'Mwezi 1 uliopita'
  },
  {
    id: 'lib-3',
    title: 'Calculations in AS / A-Level Chemistry (Jim Clark & TIE Tanzanian Guide)',
    category: 'Vitabu vya Masomo',
    level: 'A-Level',
    classGrade: 'Kidato cha 5 & 6',
    subject: 'Chemistry',
    year: 2022,
    authorOrPublisher: 'Jim Clark & Longman Publishers',
    fileFormat: 'PDF',
    fileSize: '11.8 MB',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80',
    downloadsCount: 1690,
    description: 'Mwongozo bora kabisa duniani wa hesabu za Kemia: Mole concept, Chemical Energetics, Equilibrium, Solubility Product, na Acid-Base titrations.',
    uploaderName: 'Sarah Mmbaga',
    uploaderRole: 'student',
    uploaderSchool: 'Ilboru High School',
    isSaved: true,
    createdAt: 'Mwezi 1 uliopita'
  },
  {
    id: 'lib-4',
    title: 'NECTA CSEE Basic Mathematics Solved Past Papers (2018 - 2023)',
    category: 'Mitihani ya NECTA',
    level: 'O-Level',
    classGrade: 'Kidato cha 3 & 4',
    subject: 'Mathematics',
    year: 2023,
    authorOrPublisher: 'NECTA & Chama cha Hisabati Tanzania (MAT)',
    fileFormat: 'PDF',
    fileSize: '9.6 MB',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&auto=format&fit=crop&q=80',
    downloadsCount: 3120,
    description: 'Mitihani ya Hisabati ya Kidato cha Nne (Form IV) iliyotatuliwa kwa umakini mkubwa. Kila swali limeonyeshwa njia ya kupata alama zote 100.',
    uploaderName: 'Kelvin Komba',
    uploaderRole: 'student',
    uploaderSchool: 'University of Dar es Salaam (UDSM)',
    isSaved: false,
    createdAt: 'Wiki 3 zilizopita'
  },
  {
    id: 'lib-5',
    title: 'CSSC Northern Zone Inter-Schools Joint Mock Examination 2025',
    category: 'Majaribio ya Mock',
    level: 'A-Level',
    classGrade: 'Kidato cha 5 & 6',
    subject: 'Physics',
    year: 2025,
    authorOrPublisher: 'CSSC Inter-Schools Academic Committee',
    fileFormat: 'PDF',
    fileSize: '4.7 MB',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=80',
    downloadsCount: 940,
    description: 'Mtihani wa pamoja wa majaribio wa shule za kanda ya kaskazini (Ilboru, Kibaha, Tabora Boys, Marian). Una viwango vya juu vya maswali ya utambuzi.',
    uploaderName: 'Dennis Lyimo',
    uploaderRole: 'admin',
    uploaderSchool: 'Ilboru High School',
    isSaved: false,
    createdAt: 'Wiki 1 iliyopita'
  },
  {
    id: 'lib-6',
    title: 'TIE Basic Mathematics for Secondary Schools: Form 3 & 4',
    category: 'Vitabu vya Masomo',
    level: 'O-Level',
    classGrade: 'Kidato cha 3 & 4',
    subject: 'Mathematics',
    year: 2023,
    authorOrPublisher: 'Taasisi ya Elimu Tanzania (TIE)',
    fileFormat: 'PDF',
    fileSize: '14.0 MB',
    coverImage: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&auto=format&fit=crop&q=80',
    downloadsCount: 2200,
    description: 'Kitabu kipya cha kiada cha Hisabati kwa wanafunzi wa Kidato cha Tatu na Nne kulingana na mtaala ulioboreshwa wa Tanzania.',
    uploaderName: 'Baraka Mwita',
    uploaderRole: 'student',
    uploaderSchool: 'Malampaka Secondary School',
    isSaved: false,
    createdAt: 'Mwezi 2 iliyopita'
  },
  {
    id: 'lib-7',
    title: 'Mwangaza wa Kiswahili: Uchambuzi wa Riwaya, Tamthiliya na Ushairi NECTA',
    category: 'Vitabu vya Masomo',
    level: 'O-Level',
    classGrade: 'Kidato cha 3 & 4',
    subject: 'Kiswahili',
    year: 2024,
    authorOrPublisher: 'Prof. F. Senkoro & TUKI',
    fileFormat: 'PDF',
    fileSize: '6.5 MB',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&auto=format&fit=crop&q=80',
    downloadsCount: 1450,
    description: 'Uchambuzi wa vitabu teule vya Kiswahili: "Kilio Chetu", "Ngw\'anamalundi", "Takadini", "Kizazi cha Mateso", na mashairi ya Diwani ya Wasakatonge.',
    uploaderName: 'Subira Hassan',
    uploaderRole: 'student',
    uploaderSchool: 'Lumumba Secondary School',
    isSaved: true,
    createdAt: 'Wiki 2 zilizopita'
  },
  {
    id: 'lib-8',
    title: 'Introduction to Computer Science & Python Programming (UDSM CoICT Practical Handbook)',
    category: 'Vitabu vya Masomo',
    level: 'Chuo Kikuu',
    classGrade: 'Mwaka wa 1 & 2',
    subject: 'Computer Science',
    year: 2024,
    authorOrPublisher: 'College of Information and Communication Technologies (CoICT)',
    fileFormat: 'PDF',
    fileSize: '8.2 MB',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
    downloadsCount: 1280,
    description: 'Mwongozo wa misingi ya sayansi ya kompyuta, data structures, algorithms, na mifano halisi ya programu za Python kwa wanafunzi wa vyuo vikuu.',
    uploaderName: 'Kelvin Komba',
    uploaderRole: 'student',
    uploaderSchool: 'University of Dar es Salaam (UDSM)',
    isSaved: false,
    createdAt: 'Mwezi 1 uliopita'
  },
  {
    id: 'lib-9',
    title: 'NECTA PSLE Sayansi na Teknolojia Darasa la 7 (Mtihani wa Taifa 2020-2024)',
    category: 'Mitihani ya NECTA',
    level: 'Msingi',
    classGrade: 'Darasa la 7',
    subject: 'Sayansi',
    year: 2024,
    authorOrPublisher: 'Baraza la Mitihani la Taifa (NECTA)',
    fileFormat: 'PDF',
    fileSize: '5.1 MB',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&auto=format&fit=crop&q=80',
    downloadsCount: 890,
    description: 'Majaribio na mitihani ya kumaliza elimu ya msingi (PSLE) ya Sayansi ikiwa na picha za wazi na maelezo ya kina ya majibu.',
    uploaderName: 'Amina Selemani',
    uploaderRole: 'student',
    uploaderSchool: 'Jangwani Secondary School',
    isSaved: false,
    createdAt: 'Wiki 3 zilizopita'
  },
  {
    id: 'lib-10',
    title: 'Mwongozo wa Mwalimu: Mbinu za Ufundishaji Vitendo wa Sayansi (Laboratories Manual)',
    category: 'Miongozo ya Walimu',
    level: 'Ualimu',
    classGrade: 'Vyuo vya Ualimu & Walimu',
    subject: 'General Science',
    year: 2023,
    authorOrPublisher: 'Wizara ya Elimu, Sayansi na Teknolojia (MoEST)',
    fileFormat: 'PDF',
    fileSize: '7.8 MB',
    coverImage: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=400&auto=format&fit=crop&q=80',
    downloadsCount: 650,
    description: 'Miongozo rasmi ya usalama maabarani, maandalizi ya kemikali (reagents), vifaa vya kielektroniki vya fizikia, na uandaaji wa vipimo vya vitendo.',
    uploaderName: 'Mwl. Dennis Lyimo',
    uploaderRole: 'admin',
    uploaderSchool: 'Ilboru High School',
    isSaved: false,
    createdAt: 'Mwezi 2 uliopita'
  }
];

// ============================================
// ADMIN COMPREHENSIVE MOCK DATA
// ============================================
export const INITIAL_FLAGGED_REPORTS: FlaggedReport[] = [
  {
    id: 'rep-1',
    targetType: 'post',
    targetId: 'post-flagged-1',
    targetTitle: 'Kudai kuwa na mtihani wa NECTA unaovuja kesho asubuhi',
    targetSnippet: 'Nani anataka mtihani wa Physics Paper 1 na Marking Scheme kabla ya muda? Inbox WhatsApp...',
    reporterName: 'Mwl. Peter Masanja',
    reason: 'Udanganyifu wa Mtihani',
    status: 'pending',
    reportedAt: 'Dakika 10 zilizopita',
    severity: 'high'
  },
  {
    id: 'rep-2',
    targetType: 'comment',
    targetId: 'comm-flagged-2',
    targetTitle: 'Kauli ya kejeli kwenye mjadala wa hesabu za Differential Equations',
    targetSnippet: 'Wewe huelewi chochote, acha kujiita mwanafunzi wa PCB, hujui hata Integration by parts...',
    reporterName: 'Sarah Mmbaga',
    reason: 'Lugha Chafu',
    status: 'pending',
    reportedAt: 'Saa 1 iliyopita',
    severity: 'medium'
  },
  {
    id: 'rep-3',
    targetType: 'resource',
    targetId: 'res-flagged-3',
    targetTitle: 'Nyaraka ya matangazo ya bidhaa za simu ndani ya muhtasari wa Chemistry',
    targetSnippet: 'Pakua hii link upate vocha ya bure na simu za bei rahisi Kariakoo...',
    reporterName: 'Kelvin Komba',
    reason: 'Spam',
    status: 'resolved',
    reportedAt: 'Jana',
    severity: 'low'
  }
];

export const INITIAL_TEACHER_VERIFICATIONS: TeacherVerificationRequest[] = [
  {
    id: 'tvr-1',
    teacherName: 'Mwl. Dennis Lyimo',
    email: 'dennis.lyimo@ilboru.sc.tz',
    schoolName: 'Ilboru High School',
    subjects: ['Advanced Mathematics', 'Physics Form 5 & 6'],
    tscNumber: 'TSC/TZ/2016/48201',
    experienceYears: 11,
    status: 'pending',
    submittedAt: 'Leo, 09:15 Asubuhi'
  },
  {
    id: 'tvr-2',
    teacherName: 'Mwl. Asha Bakari Salum',
    email: 'asha.bakari@zansec.edu.tz',
    schoolName: 'Zanzibar Feza High School',
    subjects: ['Chemistry', 'Biology Form 3 & 4'],
    tscNumber: 'TSC/ZN/2019/12093',
    experienceYears: 7,
    status: 'pending',
    submittedAt: 'Jana, 16:40'
  },
  {
    id: 'tvr-3',
    teacherName: 'Mwl. Josephat Mwakyusa',
    email: 'j.mwakyusa@kibaha.ac.tz',
    schoolName: 'Kibaha Secondary School',
    subjects: ['History', 'General Studies'],
    tscNumber: 'TSC/TZ/2014/09312',
    experienceYears: 14,
    status: 'approved',
    submittedAt: 'Wiki 1 iliyopita'
  }
];

export const INITIAL_FEE_TRANSACTIONS: SchoolFeeTransaction[] = [
  {
    id: 'tx-1',
    controlNumber: '998100234120',
    studentName: 'Nicolous Amini Munisi',
    schoolName: 'Malampaka Secondary School',
    gradeLevel: 'Form VI (PCB)',
    amount: 250000,
    status: 'paid',
    paymentChannel: 'M-Pesa',
    date: 'Leo, 11:30'
  },
  {
    id: 'tx-2',
    controlNumber: '998100234121',
    studentName: 'Sarah Mmbaga',
    schoolName: 'Ilboru High School',
    gradeLevel: 'Form V (PCM)',
    amount: 350000,
    status: 'paid',
    paymentChannel: 'CRDB',
    date: 'Jana, 14:20'
  },
  {
    id: 'tx-3',
    controlNumber: '998100234122',
    studentName: 'Kelvin Komba',
    schoolName: 'University of Dar es Salaam',
    gradeLevel: 'Shahada Mwaka 2',
    amount: 1500000,
    status: 'pending',
    paymentChannel: 'NMB',
    date: 'Tarehe 05 Machi 2026'
  },
  {
    id: 'tx-4',
    controlNumber: '998100234123',
    studentName: 'Neema Lyimo',
    schoolName: 'Kibaha Secondary School',
    gradeLevel: 'Form IV',
    amount: 180000,
    status: 'overdue',
    paymentChannel: 'Airtel Money',
    date: 'Tarehe 28 Feb 2026'
  }
];

// ============================================
// OPPORTUNITIES 5 CORE PILLARS MOCK DATA
// ============================================
export const INITIAL_COMPETITION_QUESTIONS: CompetitionQuestion[] = [
  {
    id: 'cq-1',
    competition: 'Tanzania National Mathematics Olympiad (TNMO)',
    year: 2025,
    topic: 'Number Theory & Modular Arithmetic',
    questionText: 'Tafuta tarakimu mbili za mwisho (last two digits) za namba 7^(2026) inayogawanywa na 100.',
    options: ['01', '49', '43', '07'],
    correctIndex: 1,
    explanation: 'Kwa mujibu wa Euler\'s Totient Theorem, φ(100) = 40. Kwa hiyo 7^40 ≡ 1 (mod 100). Tunagawanya 2026 kwa 40: 2026 = 40 * 50 + 26. Hivyo 7^2026 ≡ 7^26 (mod 100). Kwa kuwa 7^4 = 2401 ≡ 01 (mod 100), 7^26 = (7^4)^6 * 7^2 ≡ 1^6 * 49 ≡ 49 (mod 100).',
    points: 25
  },
  {
    id: 'cq-2',
    competition: 'Young Scientists Tanzania (YST) Science & Innovation',
    year: 2025,
    topic: 'Renewable Energy & Thermodynamics',
    questionText: 'Kwenye mfumo wa sola unaozalisha umeme kwa matumizi ya shule za vijijini, ni kigezo gani kikuu kinachoamua ufanisi wa MPPT (Maximum Power Point Tracking) kulinganisha na PWM controller ya kawaida?',
    options: [
      'Inaongeza voltage ya betri moja kwa moja bila kubadilisha current',
      'Inabadilisha voltage ya ziada kuwa mkondo (current) wa ziada hivyo kuongeza hadi 30% ya nishati inayochajiwa',
      'Inapunguza joto la betri wakati wa usiku',
      'Haitaji paneli za sola kuelekea jua'
    ],
    correctIndex: 1,
    explanation: 'MPPT hutumia kibadilishaji cha DC-DC chenye ufanisi wa hali ya juu kinacholazimisha paneli kufanya kazi kwenye Vmp (Voltage at Maximum Power) na kubadilisha voltage ya ziada kuwa mkondo wa kuchaji betri bila kupoteza nishati kwa mfumo wa joto.',
    points: 20
  },
  {
    id: 'cq-3',
    competition: 'National Inter-Schools Debate & Critical Thinking League',
    year: 2025,
    topic: 'Education Policy & AI Integration in African Schools',
    questionText: 'Katika hoja ya kusema: "Teknolojia ya AI inapaswa kuruhusiwa kutumika na wanafunzi wa sekondari Tanzania wakati wa mitihani ya darasani", ni ipi kauli thabiti zaidi ya kikanuni (Rebuttal) ya upande pinzani (Opposition)?',
    options: [
      'Wanafunzi wote hawana simu hivyo siyo haki',
      'AI inaua uwezo wa msingi wa utambuzi na uchambuzi binafsi (critical reasoning & epistemic curiosity) kabla mwanafunzi hajajenga misingi ya maarifa',
      'AI inagharimu pesa nyingi kununua tokeni mtandaoni',
      'Walimu wengi hawajui Kiingereza fasaha'
    ],
    correctIndex: 1,
    explanation: 'Kikanuni, hoja thabiti ya kikanuni (epistemological rebuttal) huangazia namna matumizi ya AI kabla ya kujenga uwezo wa msingi wa kufikiri yanavyopunguza uwezo wa ubongo kuchambua na kutatua changamoto za dharura.',
    points: 20
  }
];

export const INITIAL_HACKATHON_TEAMS: HackathonTeam[] = [
  {
    id: 'team-1',
    name: 'KilimoPulse AI',
    hackathonName: 'Swahilies AgriTech Hackathon 2026',
    ideaSummary: 'Mfumo wa USSD na AI unaotambua magonjwa ya mazao ya mahindi na alizeti kupitia picha na sauti za Kiswahili kwa wakulima wadogo.',
    membersCount: 3,
    maxMembers: 4,
    lookingForRoles: ['UI/UX Designer (Figma)', 'Mobile Developer (Flutter)'],
    members: [
      { name: 'Nicolous Munisi', role: 'Team Lead & Backend AI', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
      { name: 'Kelvin Komba', role: 'Machine Learning Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { name: 'Sarah Mmbaga', role: 'Data Scientist & Field Research', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }
    ],
    contactHandle: '@municryptrix'
  },
  {
    id: 'team-2',
    name: 'ShuleBima M-FinTech',
    hackathonName: 'Vodacom Digital Innovation Accelerator',
    ideaSummary: 'Mfumo wa akiba na mikopo ya dharura ya ada za shule unaounganisha wazazi na namba za udhibiti za GePG moja kwa moja.',
    membersCount: 2,
    maxMembers: 4,
    lookingForRoles: ['Backend Python / Node API Lead', 'Product Marketing & Pitch Lead'],
    members: [
      { name: 'Neema Lyimo', role: 'FinTech Strategist', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' },
      { name: 'Baraka Mwita', role: 'Frontend React Developer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' }
    ],
    contactHandle: '@neemalyimo'
  },
  {
    id: 'team-3',
    name: 'AfyaTanzania Tele-Doc',
    hackathonName: 'Buni Hub HealthTech Challenge',
    ideaSummary: 'Mawasiliano ya haraka ya dharura kwa zahanati za vijijini kupitia SMS na Bluetooth Mesh bila kuhitaji bando ya intaneti.',
    membersCount: 3,
    maxMembers: 4,
    lookingForRoles: ['Embedded Systems / IoT Engineer'],
    members: [
      { name: 'Fatma Mussa', role: 'Biomedical Lead', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
      { name: 'Said Juma', role: 'Full-Stack Developer', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100' },
      { name: 'David Kimaro', role: 'Cloud Architect', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' }
    ],
    contactHandle: '@afyatanzania'
  }
];

export const INITIAL_HACKATHON_PROJECTS: HackathonProject[] = [
  {
    id: 'proj-1',
    title: 'EduKan Offline PWA & Mesh Sync',
    teamName: 'Malampaka Tech Innovators',
    hackathon: 'Tanzania National Science & Innovation Challenge',
    summary: 'Mfumo unaoruhusu wanafunzi wa vijijini kusoma vitabu vya TIE na mitihani ya NECTA bila intaneti na kubadilishana notisi kwa WiFi Direct.',
    demoUrl: 'https://edukan.tz/offline-preview',
    githubUrl: 'https://github.com/edukan/offline-mesh',
    techStack: ['React', 'TypeScript', 'IndexedDB', 'Tailwind', 'ServiceWorker'],
    votesCount: 342,
    hasVoted: false,
    previewImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'proj-2',
    title: 'SmartDarasa Solar Lighting & Tablet Hub',
    teamName: 'CoICT Green Labs UDSM',
    hackathon: 'Vodacom Digital Innovation Accelerator',
    summary: 'Kifaa cha gharama nafuu cha sola chenye router ya ndani inayohifadhi zaidi ya video 500 za elimu ya vitendo kwa maabara za fizikia na kemia.',
    demoUrl: 'https://smartdarasa.org',
    githubUrl: 'https://github.com/udsm/smart-darasa',
    techStack: ['Python', 'Raspberry Pi', 'Solar MPPT', 'FastAPI'],
    votesCount: 289,
    hasVoted: true,
    previewImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'proj-3',
    title: 'M-Nukuu: AI Voice Transcriber kwa Kiswahili',
    teamName: 'DIT NLP Research Group',
    hackathon: 'Buni Hub AI Challenge',
    summary: 'Teknolojia ya kunakili mihadhara ya walimu na wahadhiri moja kwa moja hadi kwenye notisi za maandishi safi yenye muhtasari wa kisasa kwa wanafunzi wenye ulemavu wa kusikia.',
    demoUrl: 'https://mnukuu.ac.tz',
    githubUrl: 'https://github.com/dit/mnukuu-kiswahili',
    techStack: ['Whisper AI', 'PyTorch', 'Next.js', 'WebAudio API'],
    votesCount: 415,
    hasVoted: false,
    previewImage: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_SKILL_ROADMAPS: SkillRoadmap[] = [
  {
    id: 'road-swe',
    careerTitle: 'Software Engineer & Full-Stack Developer',
    description: 'Ramani kamili ya kuanzia mwanzo hadi kupata kazi ya mhandisi wa programu (Web, Mobile & Cloud) nchini Tanzania na kampuni za kimataifa.',
    duration: 'Miezi 6 - 9',
    demandLevel: 'Critical',
    milestones: [
      { id: 'm-1', title: '1. Misingi ya Web (HTML, CSS, Modern JavaScript & Git)', desc: 'Jifunze DOM, ES6+, Git version control, GitHub portfolio, na CSS frameworks kama Tailwind.', skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Git', 'GitHub'], isCompleted: true },
      { id: 'm-2', title: '2. Frontend Framework (React / TypeScript)', desc: 'Jifunze Component lifecycle, Hooks, State management, TypeScript types, na API consumption.', skills: ['React 18+', 'TypeScript', 'Tailwind CSS', 'Vite'], isCompleted: true },
      { id: 'm-3', title: '3. Backend & APIs (Node.js, Express & REST)', desc: 'Kutengeneza API salama, uthibitishaji wa JWT, muunganisho wa Database (PostgreSQL / MongoDB).', skills: ['Node.js', 'Express', 'PostgreSQL', 'JWT'], isCompleted: false },
      { id: 'm-4', title: '4. Tanzanian Payment Gateways Integration', desc: 'Jinsi ya kuunganisha mifumo ya M-Pesa Daraja API, Tigo Pesa, na NMB/CRDB payment gateways.', skills: ['M-Pesa API', 'Webhooks', 'Security', 'GePG'], isCompleted: false },
      { id: 'm-5', title: '5. Cloud Deployment & Docker', desc: 'Kurusha mifumo live kwenye Google Cloud Run, Vercel, Docker containers, na monitoring.', skills: ['Docker', 'Cloud Run', 'CI/CD', 'Linux'], isCompleted: false }
    ]
  },
  {
    id: 'road-data',
    careerTitle: 'Data Analyst & Business Intelligence Specialist',
    description: 'Kujifunza uchambuzi wa data, taarifa za kibiashara, na ripoti za utendaji kwa benki (CRDB, NMB), mashirika ya simu (Vodacom) na serikali.',
    duration: 'Miezi 4 - 6',
    demandLevel: 'Very High',
    milestones: [
      { id: 'd-1', title: '1. Advanced Excel & Google Sheets', desc: 'VLOOKUP, INDEX-MATCH, Pivot tables, Conditional formatting, na Macros za kiotomatiki.', skills: ['Advanced Excel', 'Pivot Tables', 'Data Cleaning'], isCompleted: true },
      { id: 'd-2', title: '2. SQL & Database Querying', desc: 'Kuandika SQL queries za kuchimba data kutoka PostgreSQL/MySQL, JOINs, Group By, Window Functions.', skills: ['SQL', 'PostgreSQL', 'Relational DB'], isCompleted: true },
      { id: 'd-3', title: '3. Python for Data Analysis', desc: 'Matumizi ya maktaba za Pandas, NumPy, na uchambuzi wa taarifa za idadi ya watu na biashara.', skills: ['Python', 'Pandas', 'NumPy'], isCompleted: false },
      { id: 'd-4', title: '4. Dashboards & Visualization (PowerBI / Tableau)', desc: 'Kutengeneza bodi za ripoti zinazoonyesha mauzo, faida, na mwenendo wa kibiashara.', skills: ['PowerBI', 'Tableau', 'Storytelling'], isCompleted: false }
    ]
  },
  {
    id: 'road-cyber',
    careerTitle: 'Cybersecurity & Network Defense Analyst',
    description: 'Kulinda mifumo ya kibenki, miundombinu ya serikali na taarifa za wanafunzi dhidi ya mashambulizi ya kidijitali.',
    duration: 'Miezi 6 - 12',
    demandLevel: 'Critical',
    milestones: [
      { id: 'c-1', title: '1. Computer Networking & Protocols', desc: 'Mifumo ya TCP/IP, DNS, DHCP, Subnetting, OSI Model, na uelewa wa Wireshark packet capture.', skills: ['Networking', 'TCP/IP', 'Wireshark'], isCompleted: true },
      { id: 'c-2', title: '2. Linux Administration & Shell Scripting', desc: 'Uendeshaji wa seva za Linux (Ubuntu/Debian), ruhusa za mafaili, bash scripting, na SSH hardening.', skills: ['Linux Bash', 'SSH', 'System Hardening'], isCompleted: false },
      { id: 'c-3', title: '3. Vulnerability Assessment & Pen Testing', desc: 'Kutumia zana za Nmap, Metasploit, Burp Suite, na uelewa wa OWASP Top 10 vulnerabilities.', skills: ['OWASP Top 10', 'Burp Suite', 'Nmap'], isCompleted: false },
      { id: 'c-4', title: '4. Security Operations & Incident Response', desc: 'Kufuatilia kumbukumbu za seva (logs), kugundua wavamizi, na kutekeleza miongozo ya TCRA / eGA.', skills: ['SIEM', 'eGA Standards', 'Incident Handling'], isCompleted: false }
    ]
  }
];

export const INITIAL_UNIVERSITY_COSTS: UniversityProfileCost[] = [
  {
    id: 'uni-udsm',
    name: 'University of Dar es Salaam',
    shortName: 'UDSM (Mlimani)',
    location: 'Dar es Salaam (Ubungo)',
    tuitionMin: 1000000,
    tuitionMax: 1500000,
    hostelFeePerYear: 180000, // Magufuli hostels ~ TZS 500/day
    offCampusRentPerMonth: 90000, // Kijitonyama/Ubungo/Mwenge room
    recommendedDailyAllowance: 10000, // TZS 10,000 / day HESLB Boom
    popularColleges: ['CoICT (Computing)', 'CoET (Engineering)', 'UDBS (Business)', 'CoNAS (Natural Sciences)']
  },
  {
    id: 'uni-udom',
    name: 'University of Dodoma',
    shortName: 'UDOM',
    location: 'Dodoma (Chimwaga & Iyumbu)',
    tuitionMin: 900000,
    tuitionMax: 1300000,
    hostelFeePerYear: 150000,
    offCampusRentPerMonth: 65000,
    recommendedDailyAllowance: 9000,
    popularColleges: ['CIVE (Informatics)', 'CHS (Health Sciences)', 'COED (Education)', 'CNMS (Natural Sciences)']
  },
  {
    id: 'uni-sua',
    name: 'Sokoine University of Agriculture',
    shortName: 'SUA',
    location: 'Morogoro (Edward Moringe & Mazimbu)',
    tuitionMin: 950000,
    tuitionMax: 1400000,
    hostelFeePerYear: 160000,
    offCampusRentPerMonth: 60000,
    recommendedDailyAllowance: 8500,
    popularColleges: ['Agriculture', 'Veterinary Medicine', 'Forestry & Wildlife', 'Applied Sciences']
  },
  {
    id: 'uni-dit',
    name: 'Dar es Salaam Institute of Technology',
    shortName: 'DIT',
    location: 'Dar es Salaam (Posta / City Centre)',
    tuitionMin: 1100000,
    tuitionMax: 1600000,
    hostelFeePerYear: 200000,
    offCampusRentPerMonth: 110000,
    recommendedDailyAllowance: 12000,
    popularColleges: ['Computer Studies', 'Civil Engineering', 'Electrical & Telecommunications', 'Mining']
  },
  {
    id: 'uni-must',
    name: 'Mbeya University of Science and Technology',
    shortName: 'MUST',
    location: 'Mbeya (Iyunga)',
    tuitionMin: 900000,
    tuitionMax: 1300000,
    hostelFeePerYear: 150000,
    offCampusRentPerMonth: 55000,
    recommendedDailyAllowance: 8000,
    popularColleges: ['Engineering & Technology', 'Information & Communication', 'Science & Technical Education']
  },
  {
    id: 'uni-cuhas',
    name: 'Catholic University of Health and Allied Sciences',
    shortName: 'CUHAS (Bugando)',
    location: 'Mwanza (Bugando Hill)',
    tuitionMin: 2200000,
    tuitionMax: 3100000,
    hostelFeePerYear: 350000,
    offCampusRentPerMonth: 100000,
    recommendedDailyAllowance: 11000,
    popularColleges: ['Doctor of Medicine (MD)', 'Pharmacy', 'Medical Laboratory Sciences', 'Nursing']
  }
];

export const INITIAL_STUDENT_AMBASSADORS: StudentAmbassador[] = [
  {
    id: 'amb-1',
    name: 'Baraka Mwita',
    university: 'University of Dar es Salaam (UDSM)',
    faculty: 'Computer Science (CoICT) - Mwaka wa 3',
    yearOfStudy: 'Final Year Student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    badge: 'UDSM Tech Ambassador 🌟',
    bio: 'Nimekaa Magufuli Hostels miaka yote mitatu. Niko hapa kukuongoza kuhusu maandalizi ya First Year, laptop unayohitaji, na jinsi ya kudumisha GPA ya First Class.',
    frequentAnswers: [
      {
        question: 'Je, hostel za Magufuli Hostel (UDSM) zinatosha kwa wanafunzi wote wa First Year?',
        answer: 'Hostel za Magufuli ziko na uwezo mkubwa wa kubeba maelfu ya wanafunzi, na kipaumbele cha kwanza huwa ni wanafunzi wapya wa First Year na wanafunzi wa kike. Gharama yake ni TZS 500 tu kwa siku (takriban TZS 90,000 kwa muhula). Ni salama sana na kuna mabasi ya wanafunzi kutoka hostel hadi Main Campus.'
      },
      {
        question: 'Laptop ya aina gani inafaa kwa mwanafunzi wa Engineering au Computer Science?',
        answer: 'Kwa UDSM CoICT au CoET, laptop yenye RAM angalau 8GB (au 16GB ikiwezekana), processor ya Core i5 au Ryzen 5 ya kizazi cha karibuni, na SSD ya 256GB au 512GB inatosha sana kwa miaka yako yote mitatu au minne ya chuo.'
      },
      {
        question: 'Siri ya kupata GPA ya First Class (3.5 - 5.0) chuo kikuu ni nini?',
        answer: 'Tofauti ya chuo kikuu na sekondari ni kwamba mitihani ya UE (University Examinations) inabeba 60% au 50%, lakini Continuous Assessment (CA - Tests & Assignments) inabeba 40% au 50%! Ukiingia kwenye UE ukiwa na CA ya alama 35/40, hata ukifanya kawaida kwenye UE unapata "A" safi.'
      }
    ]
  },
  {
    id: 'amb-2',
    name: 'Neema Lyimo',
    university: 'University of Dodoma (UDOM)',
    faculty: 'Doctor of Medicine (MD) - Mwaka wa 4',
    yearOfStudy: '4th Year Medical Cadet',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    badge: 'UDOM Health Ambassador 🩺',
    bio: 'Kutoka PCB Malampaka hadi Chuo Kikuu cha Dodoma. Nipo tayari kusaidia yeyote anayetaka kusoma Udaktari, Ufamasia au Nursing.',
    frequentAnswers: [
      {
        question: 'Je, masomo ya Udaktari (MD) UDOM yana presha kubwa kama inavyosemekana?',
        answer: 'Ni kweli masomo yanahitaji nidhamu ya juu sana na kujituma, hasa mada za Anatomy, Physiology na Biochemistry katika miaka miwili ya kwanza. Lakini ukisoma kwa makundi (study groups) na kufuata ratiba bila kulimbikiza notisi (no last-minute cramming), unafaulu vizuri sana.'
      },
      {
        question: 'HESLB inatoa mkopo kwa kiasi gani kwa wanafunzi wa Udaktari?',
        answer: 'Kozi za Afya na Udaktari zipo kwenye Kundi la Kipaumbele cha Kwanza (Priority Cadre No. 1) cha Bodi ya Mikopo (HESLB). Wanafunzi wengi hupata mkopo wa 100% wa ada na posho kamili ya chakula na malazi (Boom).'
      }
    ]
  },
  {
    id: 'amb-3',
    name: 'Kelvin Shirima',
    university: 'Dar es Salaam Institute of Technology (DIT)',
    faculty: 'Civil & Structural Engineering - Mwaka wa 3',
    yearOfStudy: '3rd Year Engineering',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    badge: 'DIT Engineering Mentor 🛠️',
    bio: 'Mhitimu wa PCM aliyeingia DIT. Ukitaka kujua uhalisia wa warsha (workshops), mitambo, field ya viwandani na maisha ya Posta/Ilala, niulize hapa.',
    frequentAnswers: [
      {
        question: 'Ni ipi faida ya kusoma Engineering DIT kulinganisha na vyuo vingine?',
        answer: 'DIT ina mkazo mkubwa wa mafunzo kwa vitendo (Hands-on practical training). Kuanzia First Year unashika mashine za lathe, kulehemu, kuchora michoro ya CAD, na kufanya vipimo halisi maabarani. Huu uzoefu unakupa uwezo mkubwa viwandani kabla hata hujahitimu.'
      }
    ]
  }
];


