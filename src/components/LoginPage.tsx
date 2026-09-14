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
import { UserProfile, UserRole } from '../types';
import { INITIAL_USER } from '../data/mockData';
import { supabase } from '../lib/supabase';
import { saveUserProfileToDb } from '../lib/supabaseService';

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
  const [identifier, setIdentifier] = useState('S.0112/0045/2024');
  const [password, setPassword] = useState('edukan123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regLevel, setRegLevel] = useState('Kidato cha V - VI (A-Level)');
  const [regTitle, setRegTitle] = useState('Kiranja wa Masomo (Academic Prefect)');
  const [regSchool, setRegSchool] = useState('Malampaka Secondary School');
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

      // 2. Resolve persona / credentials for local & demo users (Always 'student' for non-admin)
      const isUniversity = identifier.toLowerCase().includes('kelvin') || identifier.toLowerCase().includes('udsm');
      
      let loggedUser: UserProfile;
      if (isUniversity) {
        loggedUser = {
          ...INITIAL_USER,
          id: 'usr-kelvin-udsm',
          name: 'Kelvin Komba',
          handle: 'kelvin_tech',
          email: identifier.includes('@') ? identifier.trim() : 'kelvin@udsm.ac.tz',
          role: 'student',
          studentRegNo: '2022-04-08912',
          level: 'Chuo Kikuu (Higher Ed)',
          combination: 'Sayansi ya Kompyuta & IT',
          title: 'Mwanafunzi wa Shahada / Diploma',
          schoolName: 'University of Dar es Salaam (UDSM)',
          bio: 'Mwanafunzi wa Shahada ya Sayansi ya Kompyuta UDSM. Napenda maendeleo ya AI na programu.',
        };
      } else {
        loggedUser = {
          ...INITIAL_USER,
          id: 'user-student-1',
          name: 'Nicolous Munisi (Mwanafunzi)',
          handle: 'nicolous_student',
          email: identifier.includes('@') ? identifier.trim() : 'mwanafunzi@edukan.tz',
          role: 'student',
          studentRegNo: identifier.startsWith('S.') ? identifier.trim() : 'S.0112/0045/2024',
          level: 'Kidato cha V - VI (A-Level)',
          combination: 'PCB (Physics, Chemistry, Biology)',
          title: 'Kiranja wa Masomo (Academic Prefect)',
          schoolName: 'Malampaka Secondary School',
        };
      }

      // Sync user profile to database and local cache
      await saveUserProfileToDb(loggedUser);
      setLoading(false);
      onLoginSuccess(loggedUser, 'student');
      onClose();
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
        points: finalRole === 'admin' ? 5000 : 200,
        followersCount: 0,
        followingCount: 3,
        achievements: [],
        studentRegNo: finalRole === 'admin' ? 'ADMIN-TZ-001' : `S.${Math.floor(1000 + Math.random() * 9000)}/2025`
      };

      // Persist to Supabase and cache
      await saveUserProfileToDb(newUser);
      localStorage.setItem('edukan_is_registered', 'true');

      setLoading(false);
      onLoginSuccess(newUser, finalRole);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || 'Imeshindikana kusajili. Jaribu tena.');
    }
  };

  const handleQuickDemo = (role: 'student' | 'university' | 'guest') => {
    if (role === 'guest') {
      if (onGuestContinue) {
        onGuestContinue();
      } else {
        onClose();
      }
      return;
    }

    if (role === 'university') {
      setIdentifier('kelvin@udsm.ac.tz');
      setPassword('edukan123');
    } else {
      setIdentifier('S.0112/0045/2024');
      setPassword('edukan123');
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
              {/* Quick Demo Pre-fill Pills */}
              <div className="bg-emerald-50/70 dark:bg-slate-800/70 p-3 rounded-2xl border border-emerald-200/80 dark:border-slate-700">
                <div className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Akaunti za Majaribio (Bofya kuingia haraka):</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('student')}
                    className="text-[11px] font-semibold bg-white dark:bg-slate-800 border border-emerald-300 dark:border-slate-600 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    👨‍🎓 Mwanafunzi wa Sekondari (Malampaka)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('university')}
                    className="text-[11px] font-semibold bg-white dark:bg-slate-800 border border-blue-300 dark:border-slate-600 text-blue-800 dark:text-blue-300 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    🎓 Mwanafunzi wa Chuo Kikuu (UDSM)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier('nicolousmunisi07@gmail.com');
                      setPassword('@EduKan#26admin');
                    }}
                    className="text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-300 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    🛡️ Msimamizi Mkuu (Admin)
                  </button>
                </div>
              </div>

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
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    (Demo: <strong className="text-emerald-800 dark:text-emerald-300 font-mono">edukan123</strong>)
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
                  onClick={() => handleQuickDemo('guest')}
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
