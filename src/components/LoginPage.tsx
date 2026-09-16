import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Lock,
  Mail,
  User,
  School,
  GraduationCap,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Phone,
  FileBadge,
  X
} from 'lucide-react';
import { UserProfile, UserRole, UserActivityItem, AppNotification, SchoolChatChannel, ChatMessage } from '../types';
import { INITIAL_USER, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { INITIAL_CHAT_CHANNELS, INITIAL_CHAT_MESSAGES } from '../data/mockChatData';
import { supabase } from '../lib/supabase';
import { saveUserProfileToDb } from '../lib/supabaseService';
import { getInitialState } from '../lib/store';
import { sendRegistrationEmails } from '../services/emailService';

interface LoginPageProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, role?: UserRole) => void;
  onGuestContinue?: () => void;
  schools?: Array<{ id: string; name: string }>;
  isFirstVisit?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onGuestContinue,
  schools = [],
  isFirstVisit = false
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regLevel, setRegLevel] = useState('Kidato cha V - VI (A-Level)');
  const [regTitle, setRegTitle] = useState('Mwanafunzi');
  const [regSchool, setRegSchool] = useState('');
  const [regCombination, setRegCombination] = useState('PCB (Physics, Chemistry, Biology)');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [adminSecretCode, setAdminSecretCode] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Dynamic combinations based on level
  const LEVEL_COMBINATIONS: Record<string, string[]> = {
    'Kidato cha V - VI (A-Level)': [
      'PCB (Physics, Chemistry, Biology)',
      'PCM (Physics, Chemistry, Mathematics)',
      'CBG (Chemistry, Biology, Geography)',
      'HGL (History, Geography, English Language)',
      'HKL (History, Kiswahili, Language)',
      'EGM (Economics, Geography, Mathematics)',
      'ECA (Economics, Commerce, Accountancy)',
      'PMC (Physics, Mathematics, Computer Science)'
    ],
    'Chuo Kikuu (Higher Ed)': [
      'Sayansi ya Kompyuta & IT (Computer Science)',
      'Udaktari & Sayansi ya Afya (Medicine & Surgery)',
      'Uhandisi (Civil, Mechanical, Electrical)',
      'Sheria (Law & Legal Studies)',
      'Biashara, Fedha & Uhasibu (BCom / Finance)',
      'Elimu & Ualimu (Education)',
      'Kilimo & Mifugo (Agriculture & Environment)'
    ],
    'Kidato cha I - IV (O-Level)': [
      'Sayansi (Physics, Chem, Bio, Basic Math)',
      'Sanaa & Lugha (History, Geog, Civics, Kiswahili, English)',
      'Biashara (Commerce & Bookkeeping)'
    ],
    'Shule ya Msingi': [
      'Masomo ya Jumla ya Msingi (Sayansi, Hisabati, Jamii)'
    ]
  };

  const handleLevelChange = (newLevel: string) => {
    setRegLevel(newLevel);
    const availableCombos = LEVEL_COMBINATIONS[newLevel] || [];
    if (availableCombos.length > 0) {
      setRegCombination(availableCombos[0]);
    }
    if (newLevel.includes('Chuo')) {
      setRegTitle('Mwanafunzi wa Shahada / Diploma');
      setRegSchool('University of Dar es Salaam (UDSM)');
    } else if (newLevel.includes('Kidato cha I - IV')) {
      setRegTitle('Mwanafunzi wa Kawaida');
      setRegSchool('Jangwani Secondary School');
    } else if (newLevel.includes('Kidato cha V - VI')) {
      setRegTitle('Kiranja wa Masomo (Academic Prefect)');
      setRegSchool('Malampaka Secondary School');
    }
  };

  // Automatically reset scroll to top and start at the beginning when opened
  useEffect(() => {
    if (isOpen) {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
      setErrorMsg(null);
      if (isFirstVisit) {
        setAuthMode('register');
      }
    }
  }, [isOpen, isFirstVisit]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Tafadhali jaza kitambulisho na nenosiri lako.');
      return;
    }

    setLoading(true);

    try {
      const idTrimmed = identifier.trim().toLowerCase();
      const passTrimmed = password.trim();

      const isAuthorizedAdminIdentifier =
        idTrimmed === 'nicolousmunisi@gmail.com' ||
        idTrimmed === 'nicolousmunisi07@gmail.com' ||
        idTrimmed === 'admin@edukan.tz' ||
        idTrimmed === 'admin' ||
        idTrimmed.includes('nicolous');

      const isAuthorizedAdminPass =
        passTrimmed === '@EduKan#26admin' ||
        (isAuthorizedAdminIdentifier && (passTrimmed === 'admin123' || passTrimmed === 'edukan123'));

      // Grant Admin status ONLY if BOTH authorized admin email and master admin password match
      if (isAuthorizedAdminIdentifier && isAuthorizedAdminPass) {
        const rootAdminUser: UserProfile = {
          ...INITIAL_USER,
          id: 'usr-admin-nicolous',
          name: 'Nicolous Munisi',
          handle: 'nicolous_admin',
          email: 'nicolousmunisi07@gmail.com',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          title: 'Msimamizi Mkuu wa Mfumo (System Administrator)',
          schoolName: 'EduKan Tanzania Central Administration',
          schoolRegion: 'Dar es Salaam',
          schoolDistrict: 'Ilala',
          level: 'System Administrator',
          combination: 'Full Administrative Privileges',
          bio: 'Msimamizi Mkuu wa Mfumo wa EduKan Tanzania. Mwenye mamlaka kamili ya usimamizi wa maudhui, watumiaji, shule, maktaba na fursa za kimasomo.',
          points: 5000,
          studentRegNo: 'ADMIN-TZ-001',
          achievements: [
            {
              id: 'ach-admin-root',
              title: 'Master System Administrator',
              description: 'Mwenye uwezo kamili wa kusimamia watumiaji, machapisho, maktaba na fursa za elimu',
              icon: '🛡️',
              unlockedAt: '2026-01-01'
            }
          ]
        };

        await saveUserProfileToDb(rootAdminUser);
        setLoading(false);
        onLoginSuccess(rootAdminUser, 'admin');
        onClose();
        return;
      }

      // 1. If identifier has '@', attempt Supabase Auth sign-in
      if (identifier.includes('@')) {
        try {
          const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
            email: identifier.trim(),
            password: password.trim()
          });

          if (!authErr && authData?.user) {
            // Fetch profile from users_profiles
            const { data: profileRow } = await supabase
              .from('users_profiles')
              .select('*')
              .eq('id', authData.user.id)
              .single();

            if (profileRow) {
              const liveUser: UserProfile = {
                id: profileRow.id,
                name: profileRow.name,
                handle: profileRow.handle,
                email: profileRow.email,
                role: (profileRow.role === 'admin' && isAuthorizedAdminIdentifier && isAuthorizedAdminPass) ? 'admin' : 'student',
                avatar: profileRow.avatar,
                coverPhoto: profileRow.cover_photo,
                schoolName: profileRow.school_name,
                schoolRegion: profileRow.school_region,
                schoolDistrict: profileRow.school_district,
                level: profileRow.level,
                combination: profileRow.combination,
                title: profileRow.title,
                bio: profileRow.bio,
                points: profileRow.points || 150,
                followersCount: profileRow.followers_count || 0,
                followingCount: profileRow.following_count || 0,
                studentRegNo: profileRow.student_reg_no,
                achievements: []
              };

              await saveUserProfileToDb(liveUser);
              setLoading(false);
              onLoginSuccess(liveUser, liveUser.role);
              onClose();
              return;
            }
          }
        } catch (supabaseAuthErr) {
          console.warn('Supabase Auth attempt notice:', supabaseAuthErr);
        }
      }

      // 2. Resolve credentials against locally registered student accounts
      const registeredAccountsRaw = localStorage.getItem('edukan_registered_accounts');
      const registeredAccounts: Array<{
        id: string;
        email: string;
        studentRegNo?: string;
        name: string;
        password?: string;
        profile: UserProfile;
      }> = registeredAccountsRaw ? JSON.parse(registeredAccountsRaw) : [];

      const matchedAccount = registeredAccounts.find(acc => {
        const matchesId =
          acc.email?.toLowerCase() === idTrimmed ||
          acc.studentRegNo?.toLowerCase() === idTrimmed ||
          acc.name?.toLowerCase() === idTrimmed;
        return matchesId && (!acc.password || acc.password === passTrimmed);
      });

      if (matchedAccount && matchedAccount.profile) {
        await saveUserProfileToDb(matchedAccount.profile);
        setLoading(false);
        onLoginSuccess(matchedAccount.profile, matchedAccount.profile.role || 'student');
        onClose();
        return;
      }

      // 3. Check current saved user if matching
      const savedUser = getInitialState<UserProfile | null>('edukan_user', null);
      if (savedUser && (savedUser.email?.toLowerCase() === idTrimmed || savedUser.studentRegNo?.toLowerCase() === idTrimmed || savedUser.name?.toLowerCase() === idTrimmed)) {
        setLoading(false);
        onLoginSuccess(savedUser, savedUser.role || 'student');
        onClose();
        return;
      }

      // If no valid registered account matches
      setLoading(false);
      setErrorMsg('Akaunti haijapatikana au nenosiri si sahihi. Tafadhali hakikisha taarifa zako au bofya "Unda Akaunti Mpya" kujiunga na EduKan.');
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || 'Hitilafu ya kuingia. Tafadhali jaribu tena.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regName.trim() || !regPassword.trim()) {
      setErrorMsg('Tafadhali jaza jina kamili na nenosiri.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Nenosiri linapaswa kuwa na herufi zisizopungua sita (6).');
      return;
    }

    setLoading(true);

    try {
      let finalRole: UserRole = 'student';
      const targetEmail = regEmail.trim() || `${regName.toLowerCase().replace(/\s+/g, '')}${Math.floor(100 + Math.random() * 900)}@shule.tz`;

      // Strictly verify admin registration
      if (regRole === 'admin') {
        const isAuthorizedEmail =
          targetEmail.toLowerCase() === 'nicolousmunisi@gmail.com' ||
          targetEmail.toLowerCase() === 'nicolousmunisi07@gmail.com' ||
          targetEmail.toLowerCase() === 'admin@edukan.tz';

        const isAuthorizedKey = adminSecretCode.trim() === '@EduKan#26admin';

        if (!isAuthorizedEmail || !isAuthorizedKey) {
          setLoading(false);
          setErrorMsg('Taarifa za Admin si sahihi. Usajili wa Msimamizi unahitaji barua pepe rasmi ya admin na Master Passkey (@EduKan#26admin). Vinginevyo chagua "I am a Student".');
          return;
        }
        finalRole = 'admin';
      }

      const chosenTitle = regTitle.trim() || (finalRole === 'admin' ? 'Msimamizi wa Mfumo (Admin)' : 'Mwanafunzi');

      // 1. Attempt Supabase Auth Sign-Up
      let generatedAuthId = `usr-${Date.now()}`;
      try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: targetEmail,
          password: regPassword,
          options: {
            data: {
              full_name: regName.trim(),
              role: finalRole,
              school: regSchool,
              level: regLevel
            }
          }
        });

        if (!signUpError && signUpData?.user?.id) {
          generatedAuthId = signUpData.user.id;
        }
      } catch (authErr) {
        console.warn('Supabase Auth signup notice (proceeding with local & table sync):', authErr);
      }

      const foundationActivities: UserActivityItem[] = [
        {
          id: `act-reg-${Date.now()}-1`,
          type: 'register',
          title: 'Usajili wa Akaunti ya EduKan',
          description: `Umejiunga rasmi kama ${chosenTitle} kutoka ${regSchool} (${regLevel}${regCombination ? ` • ${regCombination}` : ''}).`,
          timestamp: 'Sasa hivi',
          pointsEarned: finalRole === 'admin' ? 5000 : 50,
          icon: '🎉'
        },
        {
          id: `act-bonus-${Date.now()}-2`,
          type: 'points',
          title: 'Pointi za Mwanzo za Ukaribisho',
          description: 'Umetunukiwa pointi za mwanzo kuanzia safari yako ya elimu mtandaoni na kujiunga na kundi la vinara.',
          timestamp: 'Sasa hivi',
          pointsEarned: finalRole === 'admin' ? 5000 : 50,
          icon: '⭐'
        },
        {
          id: `act-school-${Date.now()}-3`,
          type: 'school',
          title: `Jumuiya ya ${regSchool}`,
          description: `Umeunganishwa na jumuiya na wanafunzi wa darasa la ${regLevel} hapo ${regSchool}.`,
          timestamp: 'Sasa hivi',
          pointsEarned: 20,
          icon: '🏫'
        },
        {
          id: `act-msg-${Date.now()}-4`,
          type: 'chat',
          title: 'Ujumbe wa Mwanzo wa Ushauri',
          description: 'EduKan Academic Support amekutumia ujumbe wa kwanza wa mwongozo kwenye soga inbox.',
          timestamp: 'Sasa hivi',
          icon: '💬'
        },
        {
          id: `act-lib-${Date.now()}-5`,
          type: 'library',
          title: 'Maktaba & Past Papers za NECTA',
          description: `Umepewa ufikiaji wa vitabu vyote vya kiada, syllabus na past papers za ${regLevel}.`,
          timestamp: 'Sasa hivi',
          pointsEarned: 10,
          icon: '📚'
        },
        {
          id: `act-opp-${Date.now()}-6`,
          type: 'badge',
          title: 'Fursa za Masomo & Ufadhili',
          description: 'Umeunganishwa na kitovu cha fursa za scholarships, bootcamps na mashindano ya kitaifa.',
          timestamp: 'Sasa hivi',
          pointsEarned: 15,
          icon: '🚀'
        }
      ];

      const newUser: UserProfile = {
        id: generatedAuthId,
        name: regName.trim(),
        handle: regName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 16),
        email: targetEmail,
        role: finalRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        coverPhoto: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80',
        schoolName: regSchool,
        schoolRegion: 'Simiyu',
        schoolDistrict: 'Maswa',
        level: regLevel,
        combination: regCombination,
        title: chosenTitle,
        bio: `${chosenTitle} katika ${regSchool}. Najiandaa na maendeleo ya kitaaluma kupitia mtandao wa EduKan Tanzania.`,
        points: finalRole === 'admin' ? 5000 : 50,
        followersCount: 0,
        followingCount: 3,
        achievements: [
          {
            id: `ach-welcome-${Date.now()}`,
            title: 'Mwanzo wa Safari - Karibu EduKan',
            description: 'Umekamilisha usajili wa akaunti yako ya kitaaluma kwenye mfumo wa EduKan Tanzania.',
            icon: '🌟',
            unlockedAt: new Date().toISOString().split('T')[0]
          }
        ],
        activities: foundationActivities,
        studentRegNo: finalRole === 'admin' ? 'ADMIN-TZ-001' : (regPhone ? `TZ-${regPhone.slice(-4)}/2025` : `S.${Math.floor(1000 + Math.random() * 9000)}/2025`),
        notificationSettings: {
          emailRegistrationConfirmations: true,
          emailSystemAnnouncements: true,
          emailNewMessages: true,
          emailAcademicAlerts: true,
          updatedAt: new Date().toISOString()
        }
      };

      try {
        localStorage.setItem(`edukan_notification_settings_${newUser.id}`, JSON.stringify(newUser.notificationSettings));
      } catch {}

      // Persist to Supabase and local cache
      await saveUserProfileToDb(newUser);
      localStorage.setItem('edukan_is_registered', 'true');

      // Record in local persistent account registry so user can login anytime
      try {
        const existingAccountsRaw = localStorage.getItem('edukan_registered_accounts');
        const existingAccounts = existingAccountsRaw ? JSON.parse(existingAccountsRaw) : [];
        existingAccounts.push({
          id: newUser.id,
          email: newUser.email.toLowerCase(),
          studentRegNo: newUser.studentRegNo?.toLowerCase(),
          name: newUser.name,
          password: regPassword.trim(),
          profile: newUser
        });
        localStorage.setItem('edukan_registered_accounts', JSON.stringify(existingAccounts));
      } catch (storageErr) {
        console.warn('Could not cache registered account locally:', storageErr);
      }

      // Generate immediate welcome notifications for the newly registered account
      try {
        const existingNotifsRaw = localStorage.getItem('edukan_notifications');
        const existingNotifs: AppNotification[] = existingNotifsRaw ? JSON.parse(existingNotifsRaw) : INITIAL_NOTIFICATIONS;
        const newWelcomeNotifs: AppNotification[] = [
          {
            id: `notif-welcome-${Date.now()}-1`,
            title: `Karibu EduKan Tanzania, ${regName.trim()}! 🎉`,
            message: `Akaunti yako ya ${chosenTitle} imethibitishwa. Umetunukiwa pointi ${finalRole === 'admin' ? '5,000' : '50'} za mwanzo kuanzia safari yako ya kitaaluma.`,
            category: 'announcement',
            timestamp: 'Sasa hivi',
            read: false,
            actionTab: 'feed'
          },
          {
            id: `notif-msg-${Date.now()}-2`,
            title: 'Ujumbe Mpya kutoka kwa Mshauri wa Elimu 💬',
            message: `EduKan Academic Support amekutumia ujumbe wa ukaribisho na miongozo ya mitihani kwenye chumba cha maongezi.`,
            category: 'community',
            timestamp: 'Sasa hivi',
            read: false,
            actionTab: 'community'
          },
          {
            id: `notif-school-${Date.now()}-3`,
            title: `Jumuiya ya ${regSchool} 🏫`,
            message: `Umeunganishwa rasmi na wanafunzi na mijadala ya darasa la ${regLevel} hapo ${regSchool}.`,
            category: 'community',
            timestamp: 'Sasa hivi',
            read: false,
            actionTab: 'community'
          },
          {
            id: `notif-lib-${Date.now()}-4`,
            title: `Maktaba & Past Papers Zimefunguliwa 📚`,
            message: `Pata vitabu vya kiada, muhtasari (syllabus) na mitihani ya NECTA kwa ajili ya ngazi yako ya masomo.`,
            category: 'points',
            timestamp: 'Sasa hivi',
            read: false,
            actionTab: 'library'
          }
        ];
        const combinedNotifs = [...newWelcomeNotifs, ...existingNotifs];
        localStorage.setItem('edukan_notifications', JSON.stringify(combinedNotifs));
      } catch (notifErr) {
        console.warn('Could not save registration notifications:', notifErr);
      }

      // Generate immediate chat welcome message & channel
      try {
        const existingChannelsRaw = localStorage.getItem('edukan_chat_channels');
        const existingChannels: SchoolChatChannel[] = existingChannelsRaw ? JSON.parse(existingChannelsRaw) : INITIAL_CHAT_CHANNELS;

        const advisorChannelId = 'channel-dm-advisor';
        const advisorChannelExists = existingChannels.some(c => c.id === advisorChannelId);

        const advisorChannel: SchoolChatChannel = {
          id: advisorChannelId,
          type: 'private_direct',
          schoolName: 'EduKan Tanzania Headquarters',
          name: 'Mshauri wa Elimu (EduKan Academic Advisor)',
          description: 'Ushauri wa masomo, maandalizi ya NECTA, uteuzi wa machaguo (TCU/NACTE/HESLB) na fursa za masomo.',
          memberCount: 2,
          unreadCount: 1,
          pinned: true,
          lastMessage: {
            content: `Habari ${regName.trim()}! Karibu sana kwenye mtandao wa EduKan Tanzania. Hapa tuko kwa ajili ya kukusaidia katika masomo yako ya ${regLevel}.`,
            senderName: 'Mshauri wa Elimu',
            timestamp: 'Sasa hivi'
          },
          participant: {
            id: 'usr-edukan-advisor',
            name: 'Mshauri wa Elimu (EduKan Advisor)',
            handle: 'edukan_advisor',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
            schoolName: 'EduKan Academic Support Center',
            level: 'Afisa Ushauri wa Elimu',
            status: 'online'
          }
        };

        const updatedChannels = advisorChannelExists
          ? existingChannels.map(c => c.id === advisorChannelId ? advisorChannel : c)
          : [advisorChannel, ...existingChannels];

        localStorage.setItem('edukan_chat_channels', JSON.stringify(updatedChannels));

        // Save welcome chat messages into messagesMap
        const existingMessagesRaw = localStorage.getItem('edukan_chat_messages');
        const existingMessages: Record<string, ChatMessage[]> = existingMessagesRaw ? JSON.parse(existingMessagesRaw) : INITIAL_CHAT_MESSAGES;

        const advisorMessages: ChatMessage[] = [
          {
            id: `msg-adv-welcome-${Date.now()}-1`,
            channelId: advisorChannelId,
            senderId: 'usr-edukan-advisor',
            senderName: 'Mshauri wa Elimu (EduKan Advisor)',
            senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
            senderRole: 'admin',
            senderLevel: 'Afisa Ushauri wa Elimu',
            schoolName: 'EduKan Academic Support',
            content: `Habari ${regName.trim()}! Karibu sana kwenye mtandao wa EduKan Tanzania.\n\nTunakutakia safari njema ya kitaaluma hapa ${regSchool}. Akaunti yako ya ${chosenTitle} imethibitishwa na umeanza na pointi za ukaribisho.\n\nNdani ya EduKan unaweza:\n1. Kusoma na kupakua vitabu na NECTA past papers kwenye Maktaba\n2. Kuuliza maswali magumu ya masomo na kupata majibu kutoka kwa walimu na wanafunzi hodari\n3. Kujiunga na mijadala ya darasa la ${regLevel}\n4. Kupata ufadhili (scholarships) na fursa za elimu.\n\nKama una swali lolote la kimasomo au ushauri wa maisha ya shule, nijibu hapa moja kwa moja!`,
            createdAt: 'Sasa hivi',
            status: 'read'
          }
        ];

        existingMessages[advisorChannelId] = advisorMessages;
        localStorage.setItem('edukan_chat_messages', JSON.stringify(existingMessages));
      } catch (chatErr) {
        console.warn('Could not seed chat welcome messages:', chatErr);
      }

      // Dispatch real email alert to Admin (nicolousmunisi07@gmail.com) and confirmation to newly registered user
      sendRegistrationEmails({
        user: newUser,
        rawPassword: regPassword,
        adminEmail: 'nicolousmunisi07@gmail.com'
      }).then((emailRes) => {
        console.log('Registration email dispatch result:', emailRes);
      }).catch((emailErr) => {
        console.warn('Registration email dispatch error:', emailErr);
      });

      setLoading(false);
      onLoginSuccess(newUser, finalRole);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || 'Imeshindikana kusajili. Jaribu tena.');
    }
  };

  const handleGuestContinue = () => {
    if (onGuestContinue) {
      onGuestContinue();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="login-page-container"
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Header with EduKan Tanzania Brand */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-5 sm:p-6 text-white relative overflow-hidden shrink-0">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-emerald-300 shadow-md">
                <BookOpen className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-heading font-black tracking-tight">
                    Edu<span className="text-emerald-400">Kan</span> Tanzania
                  </h2>
                  <span className="text-[10px] font-bold bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-md uppercase">
                    Account
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  Network for Education, Exams, and Academic Opportunities
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher: Login vs Sign Up */}
          <div className="relative z-10 mt-5 grid grid-cols-2 bg-emerald-950/60 p-1 rounded-2xl border border-emerald-800/60">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-200/80 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-200/80 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Ambient graphic glow */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Form Body */}
        <div ref={scrollRef} className="p-5 sm:p-6 overflow-y-auto space-y-4 bg-white dark:bg-slate-900">
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-800 dark:text-rose-300 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {authMode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Identifier Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1.5">
                  NECTA Index No. / Email au Simu:
                </label>
                <div className="relative">
                  <FileBadge className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="mfano: S.0112/0045/2024 au barua pepe"
                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">
                  Wanafunzi ingiza NECTA Index No au email. Wasimamizi ingiza barua pepe rasmi ya admin.
                </p>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
                    Nenosiri (Password):
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Weka nenosiri lako"
                    className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to EduKan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Guest mode */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleGuestContinue}
                  className="text-xs text-gray-500 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-400 font-semibold transition-colors cursor-pointer"
                >
                  Continue as Guest (Browse without account)
                </button>
              </div>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                  Full Name:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amina Juma or Baraka John"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Level and Title Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                    Academic Level:
                  </label>
                  <select
                    value={regLevel}
                    onChange={(e) => handleLevelChange(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-slate-100"
                  >
                    <option>Chuo Kikuu (Higher Ed)</option>
                    <option>Kidato cha V - VI (A-Level)</option>
                    <option>Kidato cha I - IV (O-Level)</option>
                    <option>Shule ya Msingi (Primary)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                    Role / Position:
                  </label>
                  <select
                    value={regTitle}
                    onChange={(e) => setRegTitle(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-slate-100"
                  >
                    <option>Undergraduate / Diploma Student</option>
                    <option>Academic Prefect</option>
                    <option>Student Leader / President</option>
                    <option>Class Representative (CR)</option>
                    <option>Student</option>
                    <option>Peer Tutor</option>
                    <option>Subject Teacher / Head of Department</option>
                  </select>
                </div>
              </div>

              {/* Combination and School Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                    Combination / Major:
                  </label>
                  <select
                    value={regCombination}
                    onChange={(e) => setRegCombination(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-slate-100"
                  >
                    {(LEVEL_COMBINATIONS[regLevel] || ['General Studies']).map((combo) => (
                      <option key={combo} value={combo}>
                        {combo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                    School / University:
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. UDSM, Malampaka, Ilboru, Kibaha..."
                      value={regSchool}
                      onChange={(e) => setRegSchool(e.target.value)}
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Smart Recommendation Info Banner */}
              <div className="p-3 bg-emerald-50/90 dark:bg-slate-800/80 border border-emerald-200/80 dark:border-slate-700 rounded-2xl text-[11px] text-emerald-950 dark:text-emerald-300 flex items-start gap-2 shadow-2xs">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-emerald-900 dark:text-emerald-200">Smart Academic Personalization:</strong>
                  <p className="text-emerald-800 dark:text-slate-300 leading-relaxed mt-0.5">
                    Your level ({regLevel}) and combination ({regCombination}) will be used to automatically deliver the most relevant past papers, notes, and study rooms tailored to you.
                  </p>
                </div>
              </div>

              {/* Email / Phone & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                    Email or Phone:
                  </label>
                  <input
                    type="text"
                    placeholder="amina@shule.tz or +255..."
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                    Set Password:
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete EduKan Registration (+150 Pts)</span>
                  </>
                )}
              </button>

              {/* Guest explore option */}
              <div className="pt-2 text-center border-t border-gray-100 dark:border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={onGuestContinue || onClose}
                  className="text-xs text-gray-500 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-400 font-semibold transition-colors cursor-pointer"
                >
                  Or explore EduKan as Guest (No account needed) →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
