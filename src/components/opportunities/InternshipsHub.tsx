import React, { useState } from 'react';
import {
  Briefcase,
  Compass,
  CheckCircle,
  Circle,
  FileCheck,
  User,
  Copy,
  Printer,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Layers
} from 'lucide-react';
import { SkillRoadmap, UserProfile } from '../../types';
import { INITIAL_SKILL_ROADMAPS } from '../../data/mockData';

interface Props {
  currentUser?: UserProfile;
  onAwardPoints?: (points: number, reason: string) => void;
}

export const InternshipsHub: React.FC<Props> = ({ currentUser, onAwardPoints }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'portfolio'>('roadmap');

  // Roadmaps state
  const [roadmaps, setRoadmaps] = useState<SkillRoadmap[]>(INITIAL_SKILL_ROADMAPS);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(INITIAL_SKILL_ROADMAPS[0].id);

  // Portfolio Builder state
  const [fullName, setFullName] = useState(currentUser?.name || 'Nicolous Amini Munisi');
  const [professionalTitle, setProfessionalTitle] = useState('Junior Full-Stack Developer & AI Enthusiast');
  const [education, setEducation] = useState(
    `${currentUser?.schoolName || 'Malampaka Secondary School'} (${currentUser?.level || 'Form VI'})`
  );
  const [bio, setBio] = useState(
    'Mwanafunzi mwenye uwezo wa kujenga mifumo ya kisasa ya web (React, Node, TypeScript) na shauku ya kutatua changamoto za kijamii kupitia teknolojia ya wazi.'
  );
  const [skillsList, setSkillsList] = useState('React, TypeScript, Tailwind CSS, Python, Git & GitHub, SQL');
  const [keyProjects, setKeyProjects] = useState(
    '1. EduKan Offline PWA: Mfumo wa vitabu vya TIE na mitihani ya NECTA unaofanya kazi bila intaneti.\n2. KilimoPulse USSD: Mfumo wa simu kwa wakulima wadogo kutambua magonjwa ya mahindi.'
  );
  const [certifications, setCertifications] = useState(
    'Google Africa Developer Scholarship (GADS) 2025, CS50x Harvard (edX)'
  );
  const [email, setEmail] = useState(currentUser?.email || 'nicolousmunisi07@gmail.com');
  const [phone, setPhone] = useState('+255 745 123 456');
  const [github, setGithub] = useState('https://github.com/municryptrix');
  const [portfolioCopied, setPortfolioCopied] = useState(false);

  // Toggle milestone completion
  const handleToggleMilestone = (roadmapId: string, milestoneId: string) => {
    setRoadmaps((prev) =>
      prev.map((rm) => {
        if (rm.id === roadmapId) {
          return {
            ...rm,
            milestones: rm.milestones.map((m) =>
              m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m
            )
          };
        }
        return rm;
      })
    );

    if (onAwardPoints) {
      onAwardPoints(10, 'Umekamilisha hatua ya ujuzi kwenye ramani ya ajira (Roadmap Tracker)');
    }
  };

  const currentRoadmap =
    roadmaps.find((r) => r.id === selectedRoadmapId) || roadmaps[0];
  const completedMilestonesCount = currentRoadmap.milestones.filter((m) => m.isCompleted).length;
  const progressPercent = Math.round(
    (completedMilestonesCount / currentRoadmap.milestones.length) * 100
  );

  const handleCopyPortfolio = () => {
    const text = `WASIFU WA KAZI NA PORTFOLIO YA MWANAFUNZI
==================================================
Jina: ${fullName}
Cheo: ${professionalTitle}
Elimu: ${education}
Mawasiliano: ${email} | ${phone}
GitHub: ${github}

KUHUSU MIMI (PROFESSIONAL SUMMARY)
--------------------------------------------------
${bio}

UJUZI WA KITEKNOLOJIA (CORE SKILLS)
--------------------------------------------------
${skillsList}

MIRADI ILIYOKAMILIKA (PROJECTS)
--------------------------------------------------
${keyProjects}

VYETI NA MAFUNZO MAALUM (CERTIFICATIONS)
--------------------------------------------------
${certifications}
==================================================`;

    navigator.clipboard.writeText(text);
    setPortfolioCopied(true);
    setTimeout(() => setPortfolioCopied(false), 2000);

    if (onAwardPoints) {
      onAwardPoints(15, 'Umenakili wasifu wako wa kitaalamu (Portfolio Builder)');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/60 text-teal-200 text-xs font-semibold backdrop-blur-xs mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Fursa ya 4: Mafunzo, Internships & Kazi (Roadmap Tracker & Portfolio Builder)</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-heading">
            Ramani ya Ujuzi wa Soko la Ajira & Kijenzi cha Wasifu
          </h2>
          <p className="text-teal-100/90 text-xs sm:text-sm mt-1 leading-relaxed">
            Fuatilia hatua kwa hatua ujuzi unaotafutwa na kampuni kama Vodacom, CRDB, NMB, na benki nchini Tanzania, na tengeneza wasifu wako wa kitaalamu (CV & Portfolio) papo hapo tayari kwa kuomba field au internship.
          </p>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'roadmap'
                  ? 'bg-white text-teal-950 shadow-sm'
                  : 'bg-teal-800/50 text-teal-100 hover:bg-teal-800'
              }`}
            >
              🗺️ Ramani ya Ujuzi (Roadmap Tracker)
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-white text-teal-950 shadow-sm'
                  : 'bg-teal-800/50 text-teal-100 hover:bg-teal-800'
              }`}
            >
              💼 Kijenzi cha Wasifu (Portfolio Builder)
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: ROADMAP TRACKER */}
      {activeTab === 'roadmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Career Path Selector */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-heading font-bold text-sm text-gray-900">
              Chagua Fani ya Kazi (Career Tracks)
            </h3>

            <div className="space-y-2.5">
              {roadmaps.map((rm) => {
                const isSelected = rm.id === selectedRoadmapId;
                const completed = rm.milestones.filter((m) => m.isCompleted).length;
                const pct = Math.round((completed / rm.milestones.length) * 100);

                return (
                  <button
                    key={rm.id}
                    onClick={() => setSelectedRoadmapId(rm.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-teal-50/70 border-teal-600 shadow-2xs'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug">
                        {rm.careerTitle}
                      </h4>
                      <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded">
                        {rm.demandLevel}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-500">
                      Muda: <strong>{rm.duration}</strong> • {rm.milestones.length} Hatua Kuu
                    </div>

                    {/* Mini progress bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>Maendeleo Yako:</span>
                        <strong className="text-teal-800">{pct}%</strong>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-600 rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Nafasi za Field & Kazi Tanzania:</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Wanafunzi wanaofikia zaidi ya 60% ya ramani ya Software Engineering au Data wanapata nafasi za kipaumbele za kujiunga na programu za CRDB Innovation Hub na Vodacom Graduate Trainee.
              </p>
            </div>
          </div>

          {/* Milestones Timeline */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  Ramani ya Ujuzi
                </span>
                <h3 className="font-heading font-bold text-base text-gray-900 mt-1">
                  {currentRoadmap.careerTitle}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">{currentRoadmap.description}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                  {completedMilestonesCount} / {currentRoadmap.milestones.length} Hatua Zimekamilika ({progressPercent}%)
                </div>
              </div>
            </div>

            {/* Steps list */}
            <div className="space-y-4">
              {currentRoadmap.milestones.map((m, idx) => {
                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all space-y-2 ${
                      m.isCompleted
                        ? 'bg-emerald-50/40 border-emerald-300'
                        : 'bg-gray-50/50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleMilestone(currentRoadmap.id, m.id)}
                          className="mt-0.5 cursor-pointer text-teal-700 hover:scale-110 transition-transform"
                        >
                          {m.isCompleted ? (
                            <CheckCircle className="w-5 h-5 fill-emerald-600 text-white" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </button>

                        <div>
                          <h4
                            className={`text-xs sm:text-sm font-bold ${
                              m.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}
                          >
                            {m.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{m.desc}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap shrink-0 ${
                          m.isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {m.isCompleted ? 'Imekamilika (+10 pts)' : 'Inasubiri'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pl-8 pt-1">
                      {m.skills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] bg-white border border-gray-200 text-gray-700 font-mono px-2 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PORTFOLIO & CV BUILDER */}
      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Portfolio Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-600" />
                <span>Jaza Wasifu Wako (Portfolio Builder)</span>
              </h3>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                Tayari kwa Field
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Jina Kamili</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Cheo / Fani ya Kazi</label>
                <input
                  type="text"
                  value={professionalTitle}
                  onChange={(e) => setProfessionalTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Kiwango cha Elimu & Shule/Chuo</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Muhtasari wa Kitaalamu (Bio / Summary)</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Ujuzi wa Msingi (Core Skills)</label>
              <input
                type="text"
                value={skillsList}
                onChange={(e) => setSkillsList(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Miradi Yako Muhimu (Projects Built)</label>
              <textarea
                rows={3}
                value={keyProjects}
                onChange={(e) => setKeyProjects(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Vyeti & Mafunzo (Certifications)</label>
              <input
                type="text"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Namba ya Simu</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Barua Pepe</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Link ya GitHub / LinkedIn</label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* Live CV & Portfolio Preview */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Uhakiki wa Wasifu wa Moja kwa Moja (Live Preview)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPortfolio}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{portfolioCopied ? 'Imenakiliwa!' : 'Nakili Maandishi'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Chapisha / PDF</span>
                  </button>
                </div>
              </div>

              {/* Printable CV Card format */}
              <div className="mt-4 p-6 bg-gray-50/70 border border-gray-200 rounded-2xl space-y-5">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-bold font-heading text-gray-900">{fullName}</h2>
                  <div className="text-xs font-semibold text-teal-700 mt-0.5">{professionalTitle}</div>
                  <div className="text-[11px] text-gray-500 mt-1 flex flex-wrap gap-3">
                    <span>📍 {education}</span>
                    <span>✉️ {email}</span>
                    <span>📞 {phone}</span>
                    {github && <span>🔗 {github}</span>}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5 text-teal-800">
                    Kuhusu Mimi (Summary)
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed">{bio}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5 text-teal-800">
                    Ujuzi wa Kiteknolojia (Core Skills)
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsList
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-white border border-gray-300 text-gray-800 px-2.5 py-0.5 rounded-md font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5 text-teal-800">
                    Miradi Yangu (Projects)
                  </h4>
                  <pre className="text-xs text-gray-700 font-sans whitespace-pre-wrap leading-relaxed">
                    {keyProjects}
                  </pre>
                </div>

                {certifications && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5 text-teal-800">
                      Vyeti & Mafunzo Maalum
                    </h4>
                    <p className="text-xs text-gray-700">{certifications}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center text-[11px] text-gray-400">
              Inatengenezwa kiotomatiki na Mfumo wa EduKan Tanzania • Tayari kwa Field & Internship
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
