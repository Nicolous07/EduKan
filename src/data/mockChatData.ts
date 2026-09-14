import { SchoolChatChannel, ChatMessage } from '../types';

export const INITIAL_CHAT_CHANNELS: SchoolChatChannel[] = [
  // 1. School Community General Channels (Jumuiya ya Shule Nzima)
  {
    id: 'channel-malampaka-general',
    type: 'school_general',
    schoolId: 'sch-malampaka',
    schoolName: 'Malampaka Secondary School',
    name: 'Jumuiya Kuu ya Malampaka (General Community)',
    description: 'Chumba kikuu cha mijadala ya kitaaluma, matangazo ya shule, na ushirikiano wa wanafunzi wote wa Malampaka.',
    level: 'Shule Nzima (All Levels)',
    category: 'High School',
    memberCount: 840,
    unreadCount: 2,
    pinned: true,
    lastMessage: {
      content: 'Asante Grace kwa taarifa ya maabara. Wanafunzi wote wa Sayansi mzingatie muda.',
      senderName: 'Nicolous Amini Munisi',
      timestamp: '14:25'
    }
  },
  {
    id: 'channel-ilboru-general',
    type: 'school_general',
    schoolId: 'sch-ilboru',
    schoolName: 'Ilboru High School',
    name: 'Jumuiya Kuu ya Ilboru (General Forum)',
    description: 'Jukwaa la kitaaluma la wanafunzi na walimu wa Ilboru High School. Sayansi, ubunifu na maandalizi ya NECTA.',
    level: 'Shule Nzima',
    category: 'High School',
    memberCount: 1120,
    unreadCount: 0,
    lastMessage: {
      content: 'Mock ya Kanda ya Kaskazini imeanza kupakiwa kwenye maktaba yetu ya EduKan.',
      senderName: 'Sarah Mmbaga',
      timestamp: 'Jana'
    }
  },
  {
    id: 'channel-kibasila-general',
    type: 'school_general',
    schoolId: 'sch-kibasila',
    schoolName: 'Kibasila Secondary School',
    name: 'Jumuiya Kuu ya Kibasila (Dar es Salaam)',
    description: 'Mawasiliano na mijadala ya wanafunzi wa Kibasila Secondary Temeke.',
    level: 'Shule Nzima',
    category: 'High School',
    memberCount: 650,
    unreadCount: 0,
    lastMessage: {
      content: 'Karibuni kwenye mjadala wa Basic Mathematics jioni ya leo.',
      senderName: 'Kelvin Temba',
      timestamp: 'Mchana'
    }
  },

  // 2. Level Groups (Vikundi kulingana na Level hapo Shuleni)
  {
    id: 'channel-malampaka-f6',
    type: 'level_group',
    schoolId: 'sch-malampaka',
    schoolName: 'Malampaka Secondary School',
    name: 'Kidato cha Sita (Form VI) - NECTA Finalists',
    description: 'Kikundi maalum cha wanafunzi wa Kidato cha Sita Malampaka. Maandalizi ya ACSEE, NECTA past papers, na mada ngumu.',
    level: 'Form VI',
    category: 'High School',
    memberCount: 195,
    unreadCount: 3,
    pinned: true,
    lastMessage: {
      content: 'Wakuu, kwenye Physics Paper 1 nani ana derivation ya Simple Harmonic Motion?',
      senderName: 'Baraka Mwita',
      timestamp: '15:10'
    }
  },
  {
    id: 'channel-malampaka-pcb',
    type: 'level_group',
    schoolId: 'sch-malampaka',
    schoolName: 'Malampaka Secondary School',
    name: 'PCM & PCB Sayansi Hub (Form V & VI)',
    description: 'Mjadala wa kina wa fizikia, kemia na biolojia kwa wanafunzi wa tahasusi za sayansi.',
    level: 'Sayansi (PCB/PCM)',
    category: 'High School',
    memberCount: 130,
    unreadCount: 1,
    lastMessage: {
      content: 'Tumekubaliana kufanya review ya Organic Chemistry saa 3 usiku.',
      senderName: 'Grace Mwakyusa',
      timestamp: '11:05'
    }
  },
  {
    id: 'channel-malampaka-f5',
    type: 'level_group',
    schoolId: 'sch-malampaka',
    schoolName: 'Malampaka Secondary School',
    name: 'Kidato cha Tano (Form V) - Academic Forum',
    description: 'Kikundi cha wanafunzi wapya wa kidato cha tano kuanzisha misingi imara ya masomo ya A-Level.',
    level: 'Form V',
    category: 'High School',
    memberCount: 220,
    unreadCount: 0,
    lastMessage: {
      content: 'Notisi za Coordinate Geometry zimeshapakiwa.',
      senderName: 'Juma Selemani',
      timestamp: 'Jana'
    }
  },
  {
    id: 'channel-malampaka-f4',
    type: 'level_group',
    schoolId: 'sch-malampaka',
    schoolName: 'Malampaka Secondary School',
    name: 'Kidato cha Nne (Form IV) - CSEE Candidates',
    description: 'Maandalizi ya mtihani wa taifa wa kidato cha nne. Majaribio ya Mock na maswali ya NECTA.',
    level: 'Form IV',
    category: 'Secondary School',
    memberCount: 280,
    unreadCount: 0,
    lastMessage: {
      content: 'Ratiba ya Mock ya mkoa imetoka, tuipitie wote.',
      senderName: 'Amina Kassim',
      timestamp: 'Jana'
    }
  },
  {
    id: 'channel-malampaka-olevel',
    type: 'level_group',
    schoolId: 'sch-malampaka',
    schoolName: 'Malampaka Secondary School',
    name: 'O-Level Foundation (Kidato cha 1 - 3)',
    description: 'Kikundi cha kusaidiana masomo ya msingi ya sekondari kwa madarasa ya chini.',
    level: 'O-Level (Form 1 - 3)',
    category: 'Secondary School',
    memberCount: 310,
    unreadCount: 0,
    lastMessage: {
      content: 'Maswali ya Basic Chemistry yamejibiwa.',
      senderName: 'David John',
      timestamp: '3 siku zilizopita'
    }
  },
  {
    id: 'channel-ilboru-f6',
    type: 'level_group',
    schoolId: 'sch-ilboru',
    schoolName: 'Ilboru High School',
    name: 'Form VI Science Elite (Ilboru)',
    description: 'Mijadala ya kimataifa na kitaifa ya masomo ya sayansi kwa watarajiwa wa mtihani wa Form VI Ilboru.',
    level: 'Form VI',
    category: 'High School',
    memberCount: 210,
    unreadCount: 0,
    lastMessage: {
      content: 'Solutions za Advanced Calculus ziko tayari.',
      senderName: 'Sarah Mmbaga',
      timestamp: 'Jana'
    }
  },

  // 3. Wanafunzi Mmoja Mmoja (Private Direct 1-on-1 Messages)
  {
    id: 'channel-dm-baraka',
    type: 'private_direct',
    schoolName: 'Malampaka Secondary School',
    name: 'Baraka Mwita',
    description: 'Mwanafunzi wa Kidato cha Sita • PCM • Malampaka Secondary',
    memberCount: 2,
    unreadCount: 1,
    pinned: true,
    lastMessage: {
      content: 'Mambo vipi Nicolous! Nimepata lile swali la Physics ulosema, ngoja nikupigie picha ya solution.',
      senderName: 'Baraka Mwita',
      timestamp: '15:20'
    },
    participant: {
      id: 'usr-baraka-leader',
      name: 'Baraka Mwita',
      handle: 'baraka_leader',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      schoolName: 'Malampaka Secondary School',
      level: 'Form VI • PCM',
      status: 'online'
    }
  },
  {
    id: 'channel-dm-grace',
    type: 'private_direct',
    schoolName: 'Malampaka Secondary School',
    name: 'Grace Mwakyusa (Peer Tutor)',
    description: 'Mwanafunzi & Mkufunzi Mwenza wa Biolojia na Kemia • Malampaka',
    memberCount: 2,
    unreadCount: 0,
    lastMessage: {
      content: 'Safi sana, nitaangalia lile swali la Genetics jioni hii nikitoka masomoni.',
      senderName: 'Grace Mwakyusa',
      timestamp: '12:40'
    },
    participant: {
      id: 'usr-grace-student',
      name: 'Grace Mwakyusa (Peer Tutor)',
      handle: 'grace_mwakyusa',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      schoolName: 'Malampaka Secondary School',
      level: 'Form VI • PCB',
      status: 'online'
    }
  },
  {
    id: 'channel-dm-sarah',
    type: 'private_direct',
    schoolName: 'Ilboru High School',
    name: 'Sarah Mmbaga',
    description: 'Mwanafunzi wa Kidato cha Sita • PCB • Ilboru High School',
    memberCount: 2,
    unreadCount: 0,
    lastMessage: {
      content: 'Vipi Nicolous, umepata ile NECTA Chemistry Practical ya 2023 tuliyokuwa tunaongelea?',
      senderName: 'Sarah Mmbaga',
      timestamp: 'Jana'
    },
    participant: {
      id: 'usr-sarah-ilboru',
      name: 'Sarah Mmbaga',
      handle: 'sarah_ilboru',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      schoolName: 'Ilboru High School',
      level: 'Form VI • PCB',
      status: 'offline',
      lastSeen: 'Dakika 25 zilizopita'
    }
  },
  {
    id: 'channel-dm-emmanuel',
    type: 'private_direct',
    schoolName: 'Mzumbe Secondary School',
    name: 'Emmanuel Kisena',
    description: 'Mwanafunzi wa Kidato cha Sita • EGM • Mzumbe Secondary',
    memberCount: 2,
    unreadCount: 0,
    lastMessage: {
      content: 'Nashukuru kwa maelezo ya Calculus, imeniweka sawa sana kwenye hesabu zangu.',
      senderName: 'Emmanuel Kisena',
      timestamp: 'Jana'
    },
    participant: {
      id: 'usr-emmanuel',
      name: 'Emmanuel Kisena',
      handle: 'emmanuel_mzumbe',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
      schoolName: 'Mzumbe Secondary School',
      level: 'Form VI • EGM',
      status: 'offline',
      lastSeen: 'Saa 2 zilizopita'
    }
  },
  {
    id: 'channel-dm-neema',
    type: 'private_direct',
    schoolName: 'St. Francis Girls Secondary',
    name: 'Neema Mwambipile',
    description: 'Mwanafunzi wa Kidato cha Sita • CBG • St. Francis Girls',
    memberCount: 2,
    unreadCount: 0,
    lastMessage: {
      content: 'Hongera kwa kushinda tuzo ya Best Answer kwenye EduKan!',
      senderName: 'Neema Mwambipile',
      timestamp: '2 siku zilizopita'
    },
    participant: {
      id: 'usr-neema',
      name: 'Neema Mwambipile',
      handle: 'neema_stfrancis',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
      schoolName: 'St. Francis Girls Secondary',
      level: 'Form VI • CBG',
      status: 'online'
    }
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  // Messages in Jumuiya Kuu ya Malampaka
  'channel-malampaka-general': [
    {
      id: 'msg-gen-1',
      channelId: 'channel-malampaka-general',
      senderId: 'usr-baraka-leader',
      senderName: 'Baraka Mwita',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCM',
      schoolName: 'Malampaka Secondary School',
      content: 'Habari za mchana wana-Malampaka wote! Ningependa kuwakumbusha kuwa kesho Ijumaa kuanzia saa 10:00 jioni kutakuwa na kikao cha kitaaluma cha maabara (Physics & Chemistry Laboratory session) kwa ajili ya maandalizi ya mitihani.',
      createdAt: '13:45',
      status: 'read',
      reactions: { '👍': 14, '🔥': 8 }
    },
    {
      id: 'msg-gen-2',
      channelId: 'channel-malampaka-general',
      senderId: 'usr-grace-student',
      senderName: 'Grace Mwakyusa (Peer Tutor)',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCB',
      schoolName: 'Malampaka Secondary School',
      content: 'Asante Baraka kwa taarifa! Pia kwa wanafunzi wa Form 4 na Form 6 wanaohitaji mwongozo wa taratibu za NECTA Biology Practical, nimeambatanisha muhtasari wa reagents na vipimo vya chakula (Food Tests) hapa chini.',
      createdAt: '14:10',
      status: 'read',
      attachment: {
        type: 'resource',
        title: 'NECTA Biology Practical Quick Review Manual 2026.pdf',
        fileSize: '2.4 MB',
        subject: 'Biology'
      },
      reactions: { '❤️': 12, '💡': 9 }
    },
    {
      id: 'msg-gen-3',
      channelId: 'channel-malampaka-general',
      senderId: 'usr-nicolous',
      senderName: 'Nicolous Amini Munisi',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCB',
      schoolName: 'Malampaka Secondary School',
      content: 'Asante Grace kwa taarifa ya maabara. Wanafunzi wote wa Sayansi mzingatie muda. Pia wale wa O-Level mnakaribishwa kujiunga kwenye maktaba kutazama miongozo ya awali.',
      createdAt: '14:25',
      status: 'read',
      reactions: { '👏': 11 }
    }
  ],

  // Messages in Kidato cha Sita (Form VI) Level Group
  'channel-malampaka-f6': [
    {
      id: 'msg-f6-1',
      channelId: 'channel-malampaka-f6',
      senderId: 'usr-baraka-leader',
      senderName: 'Baraka Mwita',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCM',
      schoolName: 'Malampaka Secondary School',
      content: 'Wakuu wa Form 6, kwenye Physics Paper 1 nani ana derivation sahihi ya Simple Harmonic Motion (Damped and Forced Oscillations) ya NECTA 2024? Kuna kipengele cha differential equation kinanitatiza kidogo.',
      createdAt: '14:50',
      status: 'read',
      reactions: { '💡': 5 }
    },
    {
      id: 'msg-f6-2',
      channelId: 'channel-malampaka-f6',
      senderId: 'usr-nicolous',
      senderName: 'Nicolous Amini Munisi',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCB',
      schoolName: 'Malampaka Secondary School',
      content: 'Hapo Baraka unaanza na equation ya nguvu zote: F_net = -kx - b(dx/dt) = m(d²x/dt²). Ukiipanga unapata d²x/dt² + 2γ(dx/dt) + ω₀²x = 0 ambapo 2γ = b/m na ω₀² = k/m. Kisha unatatua kwa auxiliary equation r² + 2γr + ω₀² = 0!',
      createdAt: '15:02',
      replyTo: {
        id: 'msg-f6-1',
        senderName: 'Baraka Mwita',
        content: 'Wakuu wa Form 6, kwenye Physics Paper 1 nani ana derivation sahihi...'
      },
      status: 'read',
      reactions: { '🔥': 7, '👏': 6 }
    },
    {
      id: 'msg-f6-3',
      channelId: 'channel-malampaka-f6',
      senderId: 'usr-baraka-leader',
      senderName: 'Baraka Mwita',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCM',
      schoolName: 'Malampaka Secondary School',
      content: 'Asante sana Nicolous! Hapo kwenye auxiliary equation ndipo nilipokuwa nimekwama kidogo kwenye underdamping condition (γ < ω₀). Sasa imekaa wazi kabisa.',
      createdAt: '15:10',
      status: 'read',
      reactions: { '👍': 4 }
    }
  ],

  // Messages in PCM & PCB Sayansi Hub
  'channel-malampaka-pcb': [
    {
      id: 'msg-pcb-1',
      channelId: 'channel-malampaka-pcb',
      senderId: 'usr-grace-student',
      senderName: 'Grace Mwakyusa (Peer Tutor)',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCB',
      schoolName: 'Malampaka Secondary School',
      content: 'Habari za asubuhi wanakemia na wanafizikia! Tumekubaliana kufanya review ya Organic Chemistry (Carbonyl Compounds - Aldehydes and Ketones addition reactions) saa 3 usiku kupitia group hili.',
      createdAt: '10:30',
      status: 'read',
      reactions: { '🔥': 9 }
    },
    {
      id: 'msg-pcb-2',
      channelId: 'channel-malampaka-pcb',
      senderId: 'usr-nicolous',
      senderName: 'Nicolous Amini Munisi',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCB',
      schoolName: 'Malampaka Secondary School',
      content: 'Nimeandaa pia maswali 5 ya NECTA kuhusu Nucleophilic Addition na 2,4-DNP test ili tupitie pamoja usiku huo.',
      createdAt: '11:00',
      status: 'read',
      reactions: { '💡': 6, '👍': 5 }
    }
  ],

  // Private 1-on-1 Messages with Baraka Mwita
  'channel-dm-baraka': [
    {
      id: 'msg-dm-baraka-1',
      channelId: 'channel-dm-baraka',
      senderId: 'usr-baraka-leader',
      senderName: 'Baraka Mwita',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCM',
      schoolName: 'Malampaka Secondary School',
      content: 'Mambo vipi Nicolous! Nilitaka kukuuliza, una kile kitabu cha Roger Muncaster cha A-Level Physics kwenye PDF?',
      createdAt: '14:30',
      status: 'read'
    },
    {
      id: 'msg-dm-baraka-2',
      channelId: 'channel-dm-baraka',
      senderId: 'usr-nicolous',
      senderName: 'Nicolous Amini Munisi',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCB',
      schoolName: 'Malampaka Secondary School',
      content: 'Ndio kiongozi, ninacho hapa! Nilishakipakia pia kwenye maktaba yetu ya EduKan. Lakini ngoja nikupe link ya haraka uweze kukisoma mara moja.',
      createdAt: '14:45',
      attachment: {
        type: 'resource',
        title: 'Pacific & Roger Muncaster A-Level Physics 4th Ed.pdf',
        fileSize: '14.2 MB',
        subject: 'Physics'
      },
      status: 'read',
      reactions: { '🔥': 1 }
    },
    {
      id: 'msg-dm-baraka-3',
      channelId: 'channel-dm-baraka',
      senderId: 'usr-baraka-leader',
      senderName: 'Baraka Mwita',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCM',
      schoolName: 'Malampaka Secondary School',
      content: 'Mambo vipi Nicolous! Nimepata lile swali la Physics ulosema, ngoja nikupigie picha ya solution nikutumie sasa hivi.',
      createdAt: '15:20',
      status: 'read',
      reactions: { '👍': 1 }
    }
  ],

  // Private 1-on-1 Messages with Grace Mwakyusa
  'channel-dm-grace': [
    {
      id: 'msg-dm-grace-1',
      channelId: 'channel-dm-grace',
      senderId: 'usr-nicolous',
      senderName: 'Nicolous Amini Munisi',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCB',
      schoolName: 'Malampaka Secondary School',
      content: 'Grace habari, nilikuwa naomba msaada wa kuelewa vizuri difference ya Chi-Square Test calculation kwenye Genetics.',
      createdAt: '12:15',
      status: 'read'
    },
    {
      id: 'msg-dm-grace-2',
      channelId: 'channel-dm-grace',
      senderId: 'usr-grace-student',
      senderName: 'Grace Mwakyusa (Peer Tutor)',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCB',
      schoolName: 'Malampaka Secondary School',
      content: 'Safi sana, nitaangalia lile swali la Genetics jioni hii nikitoka masomoni. Fomula ya msingi ni Σ (O - E)² / E, kisha tunaangalia degrees of freedom (n - 1) kwenye probability table.',
      createdAt: '12:40',
      status: 'read',
      reactions: { '💡': 1 }
    }
  ],

  // Private 1-on-1 Messages with Sarah Mmbaga (Ilboru)
  'channel-dm-sarah': [
    {
      id: 'msg-dm-sarah-1',
      channelId: 'channel-dm-sarah',
      senderId: 'usr-sarah-ilboru',
      senderName: 'Sarah Mmbaga',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCB',
      schoolName: 'Ilboru High School',
      content: 'Vipi Nicolous, umepata ile NECTA Chemistry Practical ya 2023 tuliyokuwa tunaongelea kwenye Study Room juzi?',
      createdAt: 'Jana 18:30',
      status: 'read'
    },
    {
      id: 'msg-dm-sarah-2',
      channelId: 'channel-dm-sarah',
      senderId: 'usr-nicolous',
      senderName: 'Nicolous Amini Munisi',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      senderRole: 'student',
      senderLevel: 'Form VI • PCB',
      schoolName: 'Malampaka Secondary School',
      content: 'Ndio Sarah, nimeipata! Ilikuwa na maswali ya Volumetric Analysis (Redox Titration ya KMnO4 na FAS) pamoja na Qualitative Analysis ya Cation Fe²⁺ na Anion SO₄²⁻.',
      createdAt: 'Jana 19:15',
      status: 'read',
      reactions: { '👏': 1 }
    }
  ]
};

// Available students for starting a new private direct chat
export interface PeerStudentContact {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  schoolName: string;
  schoolId?: string;
  level: string;
  combination?: string;
  points: number;
  status: 'online' | 'offline';
  bio?: string;
}

export const PEER_STUDENTS: PeerStudentContact[] = [
  {
    id: 'usr-baraka-leader',
    name: 'Baraka Mwita',
    handle: 'baraka_leader',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Malampaka Secondary School',
    schoolId: 'sch-malampaka',
    level: 'Form VI',
    combination: 'PCM (Physics, Chem, Math)',
    points: 1250,
    status: 'online',
    bio: 'Kiranja wa Masomo & Academic discussion leader'
  },
  {
    id: 'usr-grace-student',
    name: 'Grace Mwakyusa (Peer Tutor)',
    handle: 'grace_mwakyusa',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Malampaka Secondary School',
    schoolId: 'sch-malampaka',
    level: 'Form VI',
    combination: 'PCB (Physics, Chem, Bio)',
    points: 3200,
    status: 'online',
    bio: 'Biology & Chemistry Peer Mentor'
  },
  {
    id: 'usr-sarah-ilboru',
    name: 'Sarah Mmbaga',
    handle: 'sarah_ilboru',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Ilboru High School',
    schoolId: 'sch-ilboru',
    level: 'Form VI',
    combination: 'PCB (Physics, Chem, Bio)',
    points: 1480,
    status: 'offline',
    bio: 'Medical Aspirant | Top Contributor'
  },
  {
    id: 'usr-emmanuel',
    name: 'Emmanuel Kisena',
    handle: 'emmanuel_mzumbe',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Mzumbe Secondary School',
    schoolId: 'sch-mzumbe',
    level: 'Form VI',
    combination: 'EGM (Econ, Geo, Math)',
    points: 980,
    status: 'offline',
    bio: 'Economics & Mathematics Enthusiast'
  },
  {
    id: 'usr-neema',
    name: 'Neema Mwambipile',
    handle: 'neema_stfrancis',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    schoolName: 'St. Francis Girls Secondary',
    schoolId: 'sch-stfrancis',
    level: 'Form VI',
    combination: 'CBG (Chem, Bio, Geo)',
    points: 1050,
    status: 'online',
    bio: 'Science researcher and student tutor'
  },
  {
    id: 'usr-victor',
    name: 'Victor Lyimo',
    handle: 'victor_loyola',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Loyola High School',
    schoolId: 'sch-loyola',
    level: 'Form VI',
    combination: 'PCB (Physics, Chem, Bio)',
    points: 860,
    status: 'online',
    bio: 'Robotics & Applied Physics Student'
  },
  {
    id: 'usr-subira',
    name: 'Subira Hassan',
    handle: 'subira_znz',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Lumumba Secondary School',
    schoolId: 'sch-lumumba',
    level: 'Form VI',
    combination: 'HKL (History, Kiswahili, Lang)',
    points: 920,
    status: 'offline',
    bio: 'Lugha ya Kiswahili & Literature advocate'
  },
  {
    id: 'usr-kelvin-kibasila',
    name: 'Kelvin Temba',
    handle: 'kelvin_kibasila',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    schoolName: 'Kibasila Secondary School',
    schoolId: 'sch-kibasila',
    level: 'Form IV',
    combination: 'Sayansi ya Msingi',
    points: 740,
    status: 'online',
    bio: 'Form IV Candidate | Tech & Math lover'
  }
];
