import React, { useState } from 'react';
import {
  Code,
  Users,
  Vote,
  ExternalLink,
  Github,
  Plus,
  Search,
  CheckCircle,
  Sparkles,
  Share2,
  Heart,
  ChevronRight
} from 'lucide-react';
import { HackathonTeam, HackathonProject, UserProfile } from '../../types';
import { INITIAL_HACKATHON_TEAMS, INITIAL_HACKATHON_PROJECTS } from '../../data/mockData';

interface Props {
  currentUser?: UserProfile;
  onAwardPoints?: (points: number, reason: string) => void;
}

export const HackathonsHub: React.FC<Props> = ({ currentUser, onAwardPoints }) => {
  const [activeTab, setActiveTab] = useState<'matchmaking' | 'showcase'>('matchmaking');

  // Teams state
  const [teams, setTeams] = useState<HackathonTeam[]>(INITIAL_HACKATHON_TEAMS);
  const [teamRoleFilter, setTeamRoleFilter] = useState('All');
  const [teamSearch, setTeamSearch] = useState('');
  const [joinedTeamIds, setJoinedTeamIds] = useState<string[]>([]);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  // New Team Form state
  const [newTeamName, setNewTeamName] = useState('');
  const [newHackathonName, setNewHackathonName] = useState('Swahilies AgriTech Hackathon 2026');
  const [newIdeaSummary, setNewIdeaSummary] = useState('');
  const [newRolesNeeded, setNewRolesNeeded] = useState('');

  // Projects state
  const [projects, setProjects] = useState<HackathonProject[]>(INITIAL_HACKATHON_PROJECTS);
  const [isSubmitProjectOpen, setIsSubmitProjectOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');

  // New Project Form state
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjHackathon, setNewProjHackathon] = useState('Buni Hub AI Challenge');
  const [newProjSummary, setNewProjSummary] = useState('');
  const [newProjDemo, setNewProjDemo] = useState('');
  const [newProjGithub, setNewProjGithub] = useState('');
  const [newProjTech, setNewProjTech] = useState('');

  // Handle join team request
  const handleApplyToTeam = (teamId: string) => {
    if (joinedTeamIds.includes(teamId)) return;
    setJoinedTeamIds([...joinedTeamIds, teamId]);
    if (onAwardPoints) {
      onAwardPoints(10, 'Umetuma maombi ya kujiunga na timu ya Hackathon');
    }
  };

  // Handle create new team
  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newIdeaSummary.trim()) return;

    const roles = newRolesNeeded.split(',').map((r) => r.trim()).filter(Boolean);
    const created: HackathonTeam = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      hackathonName: newHackathonName,
      ideaSummary: newIdeaSummary,
      membersCount: 1,
      maxMembers: 4,
      lookingForRoles: roles.length > 0 ? roles : ['Frontend React', 'Backend Node.js'],
      members: [
        {
          name: currentUser?.name || 'Nicolous Munisi',
          role: 'Team Lead / Founder',
          avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
        }
      ],
      contactHandle: currentUser?.handle ? `@${currentUser.handle}` : '@municryptrix'
    };

    setTeams([created, ...teams]);
    setIsCreateTeamOpen(false);
    setNewTeamName('');
    setNewIdeaSummary('');
    setNewRolesNeeded('');

    if (onAwardPoints) {
      onAwardPoints(20, 'Umeunda timu mpya ya Hackathon kwenye mfumo wa EduKan');
    }
  };

  // Handle project vote
  const handleVoteProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const hasVoted = p.hasVoted;
          return {
            ...p,
            hasVoted: !hasVoted,
            votesCount: hasVoted ? p.votesCount - 1 : p.votesCount + 1
          };
        }
        return p;
      })
    );

    if (onAwardPoints) {
      onAwardPoints(5, 'Umepiga kura kwenye mradi wa Hackathon');
    }
  };

  // Handle submit project
  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjSummary.trim()) return;

    const stack = newProjTech.split(',').map((s) => s.trim()).filter(Boolean);
    const submitted: HackathonProject = {
      id: `proj-${Date.now()}`,
      title: newProjTitle,
      teamName: currentUser?.name ? `${currentUser.name}'s Team` : 'EduKan Innovators',
      hackathon: newProjHackathon,
      summary: newProjSummary,
      demoUrl: newProjDemo || 'https://edukan.tz/preview',
      githubUrl: newProjGithub || 'https://github.com/edukan',
      techStack: stack.length > 0 ? stack : ['React', 'TypeScript', 'Tailwind'],
      votesCount: 1,
      hasVoted: true,
      previewImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'
    };

    setProjects([submitted, ...projects]);
    setIsSubmitProjectOpen(false);
    setNewProjTitle('');
    setNewProjSummary('');
    setNewProjDemo('');
    setNewProjGithub('');
    setNewProjTech('');

    if (onAwardPoints) {
      onAwardPoints(25, 'Umeweka mradi wako wa Hackathon kwenye Project Showcase');
    }
  };

  const filteredTeams = teams.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      t.hackathonName.toLowerCase().includes(teamSearch.toLowerCase()) ||
      t.ideaSummary.toLowerCase().includes(teamSearch.toLowerCase());
    const matchesRole =
      teamRoleFilter === 'All' ||
      t.lookingForRoles.some((r) => r.toLowerCase().includes(teamRoleFilter.toLowerCase()));
    return matchesSearch && matchesRole;
  });

  const filteredProjects = projects.filter((p) => {
    return (
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.summary.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.teamName.toLowerCase().includes(projectSearch.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/60 text-blue-200 text-xs font-semibold backdrop-blur-xs mb-3">
            <Code className="w-3.5 h-3.5" />
            <span>Fursa ya 3: Hackathons za Tech (Matchmaking & Project Showcase)</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-heading">
            Tafuta Wajumbe wa Timu & Onyesha Miradi Yako
          </h2>
          <p className="text-blue-100/90 text-xs sm:text-sm mt-1 leading-relaxed">
            Ungana na wanafunzi wa vyuo vikuu na sekondari wanaojua React, Python, UI/UX na Mobile kuunda timu za hackathon, au weka mradi uliotengeneza ili jamii ya wanafunzi ikupigie kura.
          </p>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('matchmaking')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'matchmaking'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'bg-blue-800/50 text-blue-100 hover:bg-blue-800'
              }`}
            >
              🤝 Team Finder / Matchmaking
            </button>
            <button
              onClick={() => setActiveTab('showcase')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'showcase'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'bg-blue-800/50 text-blue-100 hover:bg-blue-800'
              }`}
            >
              🚀 Maonyesho ya Miradi (Project Showcase)
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: TEAM FINDER / MATCHMAKING */}
      {activeTab === 'matchmaking' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tafuta timu, fani au shindano..."
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                />
              </div>

              <select
                value={teamRoleFilter}
                onChange={(e) => setTeamRoleFilter(e.target.value)}
                className="p-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              >
                <option value="All">Fani Zote Zinazotafutwa</option>
                <option value="Frontend">Frontend / Web</option>
                <option value="Backend">Backend / API</option>
                <option value="UI/UX">UI/UX Designer</option>
                <option value="Mobile">Mobile App (Flutter)</option>
                <option value="IoT">IoT / Vifaa</option>
              </select>
            </div>

            <button
              onClick={() => setIsCreateTeamOpen(true)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tangaza Timu Yako Mpya</span>
            </button>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTeams.map((team) => {
              const hasApplied = joinedTeamIds.includes(team.id);
              return (
                <div
                  key={team.id}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full">
                        {team.hackathonName}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        {team.membersCount} / {team.maxMembers} Wajumbe
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading font-bold text-base text-gray-900 leading-snug">
                        {team.name}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{team.ideaSummary}</p>
                    </div>

                    {/* Roles needed */}
                    <div>
                      <div className="text-[11px] font-bold text-gray-700 mb-1.5">
                        Nafasi Zilizowazi (Looking for):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {team.lookingForRoles.map((role, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md font-medium"
                          >
                            🔍 {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Current members */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-[11px] text-gray-500 mb-1.5">Wajumbe Waliopo:</div>
                      <div className="flex items-center gap-2">
                        {team.members.map((m, idx) => (
                          <img
                            key={idx}
                            src={m.avatar}
                            alt={m.name}
                            title={`${m.name} (${m.role})`}
                            className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-xs"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-mono">{team.contactHandle}</span>

                    <button
                      onClick={() => handleApplyToTeam(team.id)}
                      disabled={hasApplied}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        hasApplied
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-blue-700 hover:bg-blue-800 text-white shadow-2xs'
                      }`}
                    >
                      {hasApplied ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Maombi Yametumwa</span>
                        </>
                      ) : (
                        <span>Omba Kujiunga</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal for creating a team */}
          {isCreateTeamOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-heading font-bold text-base text-gray-900">
                    Tangaza Timu Yako ya Hackathon
                  </h3>
                  <button
                    onClick={() => setIsCreateTeamOpen(false)}
                    className="text-gray-400 hover:text-gray-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateTeam} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Jina la Timu</label>
                    <input
                      type="text"
                      required
                      placeholder="Mf: BuniAI Innovators au KilimoPulse"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Shindano la Hackathon</label>
                    <input
                      type="text"
                      required
                      value={newHackathonName}
                      onChange={(e) => setNewHackathonName(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Muhtasari wa Wazo la Mradi</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Eleza changamoto mnayotatua na teknolojia mtakayotumia..."
                      value={newIdeaSummary}
                      onChange={(e) => setNewIdeaSummary(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Fani Zinazotafutwa (Tenganisha kwa koma)
                    </label>
                    <input
                      type="text"
                      placeholder="UI/UX Designer, React Developer, Data Lead"
                      value={newRolesNeeded}
                      onChange={(e) => setNewRolesNeeded(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateTeamOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold"
                    >
                      Ghairi
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold"
                    >
                      Chapisha Timu (+20 pts)
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROJECT SHOWCASE & COMMUNITY VOTING */}
      {activeTab === 'showcase' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Tafuta miradi ya wanafunzi..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              />
            </div>

            <button
              onClick={() => setIsSubmitProjectOpen(true)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Weka Mradi Wako Kwenye Showcase</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-blue-300 transition-all"
              >
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={proj.previewImage}
                      alt={proj.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {proj.hackathon}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <div className="text-[11px] font-semibold text-blue-700">{proj.teamName}</div>
                      <h4 className="font-heading font-bold text-base text-gray-900 mt-0.5 leading-snug">
                        {proj.title}
                      </h4>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{proj.summary}</p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-gray-100 text-gray-700 font-mono px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-100 flex items-center justify-between text-xs mt-3">
                  <div className="flex items-center gap-3 pt-3">
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1"
                    >
                      <span>Demo Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  </div>

                  <button
                    onClick={() => handleVoteProject(proj.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      proj.hasVoted
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${proj.hasVoted ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{proj.votesCount}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Project Modal */}
          {isSubmitProjectOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-heading font-bold text-base text-gray-900">
                    Weka Mradi Wako Kwenye Showcase
                  </h3>
                  <button
                    onClick={() => setIsSubmitProjectOpen(false)}
                    className="text-gray-400 hover:text-gray-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitProject} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Jina la Mradi / App</label>
                    <input
                      type="text"
                      required
                      placeholder="Mf: AfyaMama SMS au ShuleMesh"
                      value={newProjTitle}
                      onChange={(e) => setNewProjTitle(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Shindano Lililotengenezewa</label>
                    <input
                      type="text"
                      required
                      value={newProjHackathon}
                      onChange={(e) => setNewProjHackathon(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Maelezo Mafupi (Problem & Solution)</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Eleza tatizo mradi unalotatua nchini Tanzania..."
                      value={newProjSummary}
                      onChange={(e) => setNewProjSummary(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Link ya Live Demo</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newProjDemo}
                        onChange={(e) => setNewProjDemo(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Link ya GitHub</label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={newProjGithub}
                        onChange={(e) => setNewProjGithub(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Teknolojia Zilizotumika (Tenganisha kwa koma)
                    </label>
                    <input
                      type="text"
                      placeholder="React, Python, FastApi, PostgreSQL"
                      value={newProjTech}
                      onChange={(e) => setNewProjTech(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSubmitProjectOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold"
                    >
                      Ghairi
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold"
                    >
                      Chapisha Mradi (+25 pts)
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
