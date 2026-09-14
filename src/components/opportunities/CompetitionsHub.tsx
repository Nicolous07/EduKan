import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Timer,
  CheckCircle2,
  XCircle,
  Award,
  Play,
  RotateCcw,
  Sparkles,
  Medal,
  Flame,
  ChevronRight,
  HelpCircle,
  Zap
} from 'lucide-react';
import { CompetitionQuestion, LeaderboardStudent, UserProfile } from '../../types';
import { INITIAL_COMPETITION_QUESTIONS } from '../../data/mockData';

interface Props {
  currentUser?: UserProfile;
  onAwardPoints?: (points: number, reason: string) => void;
}

const MOCK_COMPETITION_CHAMPIONS: LeaderboardStudent[] = [
  {
    id: 'champ-1',
    rank: 1,
    name: 'Sarah Mmbaga',
    handle: 'sarah_chem',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    schoolName: 'Ilboru High School',
    region: 'Arusha',
    level: 'Form VI (PCM)',
    points: 2940,
    streakDays: 24,
    answersGiven: 68,
    badge: 'Tanzania Math Olympiad Gold 🥇'
  },
  {
    id: 'champ-2',
    rank: 2,
    name: 'Kelvin Komba',
    handle: 'kelvin_udsm',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    schoolName: 'University of Dar es Salaam (CoICT)',
    region: 'Dar es Salaam',
    level: 'Mwaka wa 2',
    points: 2710,
    streakDays: 18,
    answersGiven: 54,
    badge: 'YST Science Silver 🥈'
  },
  {
    id: 'champ-3',
    rank: 3,
    name: 'Nicolous Amini Munisi',
    handle: 'municryptrix',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    schoolName: 'Malampaka Secondary School',
    region: 'Shinyanga',
    level: 'Form VI (PCB)',
    points: 2420,
    streakDays: 15,
    answersGiven: 48,
    badge: 'National Science Bronze 🥉',
    isCurrentUser: true
  },
  {
    id: 'champ-4',
    rank: 4,
    name: 'Neema Lyimo',
    handle: 'neema_md',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    schoolName: 'Kibaha Secondary School',
    region: 'Pwani',
    level: 'Form VI (PCB)',
    points: 2180,
    streakDays: 12,
    answersGiven: 39,
    badge: 'Debate League Finalist'
  },
  {
    id: 'champ-5',
    rank: 5,
    name: 'Baraka Mwita',
    handle: 'baraka_udsm',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    schoolName: 'Tabora Boys',
    region: 'Tabora',
    level: 'Form VI (PGM)',
    points: 1950,
    streakDays: 9,
    answersGiven: 31,
    badge: 'Physics Olympiad Star'
  }
];

export const CompetitionsHub: React.FC<Props> = ({ currentUser, onAwardPoints }) => {
  const [activeView, setActiveView] = useState<'practice' | 'leaderboard'>('practice');

  // Practice session state
  const [questions] = useState<CompetitionQuestion[]>(INITIAL_COMPETITION_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Timer: 5 minutes (300 seconds) per session
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timeLeft > 0 && !sessionCompleted) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setSessionCompleted(true);
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, sessionCompleted]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStartSession = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setSessionCompleted(false);
    setTimeLeft(300);
    setTimerRunning(true);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);

    const q = questions[currentIdx];
    if (selectedOption === q.correctIndex) {
      setScore((prev) => prev + q.points);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setSessionCompleted(true);
      setTimerRunning(false);
      if (onAwardPoints) {
        onAwardPoints(score + 30, 'Umekamilisha Mazoezi ya Mashindano ya Kitaifa (Timer Challenge)');
      }
    }
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-orange-900 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/60 text-amber-200 text-xs font-semibold backdrop-blur-xs mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Fursa ya 2: Mashindano & Olympiads (Practice Hub & Leaderboard)</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-heading">
            Mazoezi ya Maswali ya Miaka ya Nyuma kwa Timer
          </h2>
          <p className="text-amber-100/90 text-xs sm:text-sm mt-1 leading-relaxed">
            Fanya mazoezi ya mitihani halisi ya Tanzania Mathematics Olympiad (TNMO), Young Scientists (YST), na Debate League ukiwa na muda unaopungua, shinda medali na upande kwenye orodha ya kitaifa.
          </p>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveView('practice')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'practice'
                  ? 'bg-white text-amber-950 shadow-sm'
                  : 'bg-amber-600/50 text-amber-100 hover:bg-amber-600'
              }`}
            >
              ⏱️ Chumba cha Mazoezi (Timed Practice Hub)
            </button>
            <button
              onClick={() => setActiveView('leaderboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'leaderboard'
                  ? 'bg-white text-amber-950 shadow-sm'
                  : 'bg-amber-600/50 text-amber-100 hover:bg-amber-600'
              }`}
            >
              🏆 Orodha ya Vinara Kitaifa (Leaderboard)
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: PRACTICE HUB WITH TIMER */}
      {activeView === 'practice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Question Arena */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-6">
            {!timerRunning && !sessionCompleted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                  <Trophy className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-gray-900 font-heading">
                    Uko Tayari kwa Shindano la Leo?
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Kila zoezi lina maswali ya utambuzi wa juu kutoka TNMO na Young Scientists. Una dakika 5 (sekunde 300) kuthibitisha umahiri wako na kujishindia hadi alama 65 za EduPoints.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
                  <span className="flex items-center gap-1"><Timer className="w-4 h-4 text-amber-600" /> Dakika 5</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><HelpCircle className="w-4 h-4 text-emerald-600" /> Maswali 3 ya Mfano</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-orange-500" /> +30 Bonus Points</span>
                </div>

                <button
                  onClick={handleStartSession}
                  className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 mx-auto cursor-pointer shadow-md transition-all"
                >
                  <Play className="w-4 h-4" />
                  <span>Anzisha Mazoezi kwa Timer</span>
                </button>
              </div>
            ) : sessionCompleted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Medal className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    Zoezi Limekamilika!
                  </span>
                  <h3 className="text-2xl font-bold font-heading text-gray-900 mt-2">
                    Umepata Alama {score} / 65
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto">
                    Hongera sana! Alama zako zimeongezwa kwenye wasifu wako na kukuinua kwenye nafasi ya kitaifa ya EduKan.
                  </p>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl max-w-sm mx-auto flex items-center justify-between text-xs">
                  <div className="text-left">
                    <div className="text-gray-500 text-[11px]">EduPoints Ulizopata:</div>
                    <div className="text-base font-bold text-amber-900">+{score + 30} Points</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-[11px]">Muda Uliotumika:</div>
                    <div className="text-base font-bold text-gray-800">{formatTime(300 - timeLeft)}</div>
                  </div>
                </div>

                <button
                  onClick={handleStartSession}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Fanya Zoezi Lingine</span>
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      {currentQ.competition} ({currentQ.year})
                    </span>
                    <h4 className="text-xs font-bold text-gray-500">Mada: {currentQ.topic}</h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        timeLeft < 60 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      <Timer className="w-3.5 h-3.5" />
                      <span>{formatTime(timeLeft)}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-400">
                      Swali {currentIdx + 1} kati ya {questions.length}
                    </span>
                  </div>
                </div>

                {/* Question Text */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70 text-xs sm:text-sm font-medium text-gray-900 leading-relaxed">
                  {currentQ.questionText}
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;

                    let btnClass = 'border-gray-200 hover:border-gray-300 bg-white text-gray-800';
                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'border-rose-400 bg-rose-50 text-rose-900';
                      }
                    } else if (isSelected) {
                      btnClass = 'border-amber-600 bg-amber-50 text-amber-900 font-semibold';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-3 text-left text-xs rounded-xl border transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation block */}
                {isAnswerSubmitted && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ufafanuzi wa Kina (Solution Steps):</span>
                    </div>
                    <p className="leading-relaxed text-gray-700">{currentQ.explanation}</p>
                  </div>
                )}

                {/* Bottom Action */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Alama za Swali Hili: <strong>+{currentQ.points} Points</strong>
                  </span>

                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="px-5 py-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Thibitisha Jibu
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{currentIdx + 1 < questions.length ? 'Swali Linalofuata' : 'Kamilisha Zoezi'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Side stats & Tips */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-3">
              <h4 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Mfululizo Wako wa Ushindani (Streak)</span>
              </h4>

              <div className="flex items-center justify-between bg-orange-50/70 p-3 rounded-xl border border-orange-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-orange-600">15</span>
                  <div className="text-[11px] text-orange-950 font-medium leading-tight">
                    Siku Mfululizo za<br />Kufanya Mazoezi
                  </div>
                </div>
                <span className="text-xs font-bold bg-orange-200 text-orange-900 px-2 py-0.5 rounded-full">
                  Moto 🔥
                </span>
              </div>

              <div className="text-xs text-gray-600 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span>Nafasi Yako Kitaifa:</span>
                  <strong className="text-gray-900">#3 Kitaifa</strong>
                </div>
                <div className="flex justify-between">
                  <span>Alama za Ushindani:</span>
                  <strong className="text-amber-800">2,420 Points</strong>
                </div>
                <div className="flex justify-between">
                  <span>Medali:</span>
                  <strong className="text-emerald-700">1x Shaba, 2x Vyeti</strong>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Faida za Kushiriki Mashindano:</span>
              </div>
              <p className="leading-relaxed text-emerald-900/80">
                Wanafunzi wanaoshinda Tanzania National Mathematics Olympiad (TNMO) hupata mapendekezo ya moja kwa moja ya Samia Scholarship na nafasi za uwakilishi wa taifa kwenye Pan-African Mathematics Olympiad (PAMO).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: LEADERBOARD & GAMIFICATION */}
      {activeView === 'leaderboard' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Orodha ya Vinara wa Kitaifa (National Champions Leaderboard)</span>
              </h3>
              <p className="text-xs text-gray-500">
                Wanafunzi waliofanya vizuri zaidi kwenye mazoezi ya TNMO, Sayansi na mijadala kote Tanzania.
              </p>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full self-start sm:self-auto">
              Inasasishwa Kila Siku Saa 6 Usiku
            </span>
          </div>

          <div className="space-y-3">
            {MOCK_COMPETITION_CHAMPIONS.map((champ) => {
              const isTop3 = champ.rank <= 3;
              return (
                <div
                  key={champ.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between flex-wrap gap-3 ${
                    champ.isCurrentUser
                      ? 'bg-amber-50/60 border-amber-300 shadow-2xs'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        champ.rank === 1
                          ? 'bg-amber-400 text-white shadow-sm'
                          : champ.rank === 2
                          ? 'bg-gray-300 text-gray-800'
                          : champ.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {champ.rank === 1 ? '🥇' : champ.rank === 2 ? '🥈' : champ.rank === 3 ? '🥉' : champ.rank}
                    </div>

                    <img
                      src={champ.avatar}
                      alt={champ.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-gray-900">{champ.name}</span>
                        {champ.isCurrentUser && (
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                            Wewe
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {champ.schoolName} • {champ.region} ({champ.level})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {champ.badge}
                    </span>
                    <div className="text-right">
                      <div className="font-bold text-amber-900">{champ.points.toLocaleString()} pts</div>
                      <div className="text-[10px] text-gray-400">{champ.streakDays} days streak 🔥</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
