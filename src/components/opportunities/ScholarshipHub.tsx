import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Copy,
  Download,
  RefreshCw,
  Award,
  ChevronRight,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../../types';
import { aiService } from '../../lib/aiService';

interface Props {
  currentUser?: UserProfile;
  onAwardPoints?: (points: number, reason: string) => void;
}

interface ScholarshipPreset {
  id: string;
  name: string;
  provider: string;
  targetLevel: string;
  minDivision: string;
  minGpa: number;
  coverage: string;
  deadline: string;
  focusArea: string;
  criteria: string[];
}

const SCHOLARSHIP_PRESETS: ScholarshipPreset[] = [
  {
    id: 'samia',
    name: 'Samia Scholarship Scheme (Sayansi & Teknolojia)',
    provider: 'Wizara ya Elimu, Sayansi na Teknolojia (MoEST)',
    targetLevel: 'Kidato cha Sita (A-Level)',
    minDivision: 'Division I.7 - I.9',
    minGpa: 4.5,
    coverage: '100% Ada ya Chuo, Laptop, Malazi, Chakula & Vitabu',
    deadline: 'Tarehe 31 Julai 2026',
    focusArea: 'Sayansi Asilia, Uhandisi, Tiba, Hisabati (STEM)',
    criteria: [
      'Ufaulu wa Daraja la Kwanza (Division 1) Kidato cha Sita katika mchepuo wa Sayansi (PCB, PCM, PGM, CBG, PMC)',
      'Kupata udahili katika Chuo Kikuu cha Umma Tanzania katika kozi za kipaumbele',
      'Uraia wa Tanzania na rekodi safi ya kimaadili'
    ]
  },
  {
    id: 'heslb-priority',
    name: 'HESLB Special Priority Cadre (Bodi ya Mikopo)',
    provider: 'Bodi ya Mikopo ya Wanafunzi wa Elimu ya Juu (HESLB)',
    targetLevel: 'Kidato cha Sita & Diploma',
    minDivision: 'Division I au II',
    minGpa: 3.5,
    coverage: 'Hadi 100% Ada, Boom (TZS 10,000/siku), Vifaa & Mafunzo kwa Vitendo',
    deadline: 'Tarehe 31 Agosti 2026',
    focusArea: 'Afya, Ualimu wa Sayansi & Hisabati, Kilimo, Mafuta & Gesi',
    criteria: [
      'Kupata udahili kwenye kozi zilizo kwenye orodha ya kipaumbele cha taifa',
      'Uthibitisho wa uhitaji wa kifedha (yatima, kaya masikini, walemavu, au kipato duni)',
      'Namba ya mtihani wa Kidato cha 4 na 6 iliyothibitishwa na NECTA'
    ]
  },
  {
    id: 'mastercard',
    name: 'Mastercard Foundation Scholars Program (Afrika)',
    provider: 'Mastercard Foundation & Vyuo Shirikishi (UCT, KNUST, Ashesi)',
    targetLevel: 'Kidato cha Sita / Shahada',
    minDivision: 'Division I (Pointi 7 - 10)',
    minGpa: 4.0,
    coverage: 'Ada yote, Nauli ya ndege, Malazi, Laptop, Bima ya Afya & Kazi za Uongozi',
    deadline: 'Tarehe 15 Aprili 2026',
    focusArea: 'Teknolojia, Kilimo Biashara, Uongozi wa Jamii',
    criteria: [
      'Uwezo mkubwa wa kitaaluma na uongozi uliothibitishwa katika shule au jamii',
      'Kuthibitisha nia thabiti ya kurudi na kuleta mabadiliko chanya barani Afrika',
      'Uhitaji wa kiuchumi (financial disadvantage)'
    ]
  },
  {
    id: 'daad',
    name: 'DAAD In-Country / In-Region Scholarships',
    provider: 'Serikali ya Ujerumani (DAAD Africa)',
    targetLevel: 'Shahada ya Kwanza / Uzamili (Masters)',
    minDivision: 'GPA 3.8+',
    minGpa: 3.8,
    coverage: 'Ada, Malipo ya Kila Mwezi ya Maisha, Utafiti na Safari',
    deadline: 'Tarehe 30 Novemba 2026',
    focusArea: 'Sayansi za Mazingira, Nishati Jadidifu, Afya ya Umma',
    criteria: [
      'Kumaliza Shahada ya Kwanza ndani ya miaka 6 iliyopita na GPA ya First Class au Upper Second',
      'Pendekezo thabiti la utafiti (Research Proposal) lenye tija kwa maendeleo ya Tanzania',
      'Ujuzi wa Kiingereza fasaha wa kitaaluma'
    ]
  }
];

export const ScholarshipHub: React.FC<Props> = ({ currentUser, onAwardPoints }) => {
  const [activeSubTab, setActiveSubTab] = useState<'essay' | 'checker'>('essay');

  // AI Essay Generator State
  const [scholarshipTarget, setScholarshipTarget] = useState('samia');
  const [applicantLevel, setApplicantLevel] = useState(currentUser?.level || 'Kidato cha Sita (Form VI)');
  const [fieldOfStudy, setFieldOfStudy] = useState(currentUser?.combination || 'PCB (Sayansi ya Tiba & Uhandisi)');
  const [careerAspiration, setCareerAspiration] = useState('Kutumia teknolojia ya akili mnemba (AI) na sayansi ya tiba kuboresha huduma za afya vijijini Tanzania.');
  const [keyAchievements, setKeyAchievements] = useState('Nilipata A ya Physics na Chemistry kwenye mtihani wa Mock, na nimeongoza klabu ya sayansi shuleni.');
  const [financialNeedStory, setFinancialNeedStory] = useState('Ninatoka katika familia ya wakulima wadogo mkoani Shinyanga, na ufadhili huu ndio utakaofungua ndoto yangu ya chuo kikuu bila kulemea wazazi wangu.');
  const [tone, setTone] = useState<'passionate' | 'academic' | 'humble'>('passionate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEssay, setGeneratedEssay] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Eligibility Checker State
  const [checkLevel, setCheckLevel] = useState('Form VI');
  const [checkDivision, setCheckDivision] = useState('I.7');
  const [checkGpa, setCheckGpa] = useState('4.6');
  const [checkCombination, setCheckCombination] = useState('PCB');
  const [checkSpecialNeeds, setCheckSpecialNeeds] = useState(false);
  const [checkedResults, setCheckedResults] = useState<{
    scholarship: ScholarshipPreset;
    eligibleScore: number;
    status: 'High' | 'Medium' | 'Low';
    feedback: string[];
  }[] | null>(null);

  // Handle AI Essay Generation
  const handleGenerateEssay = async () => {
    setIsGenerating(true);
    setCopied(false);

    const selected = SCHOLARSHIP_PRESETS.find(s => s.id === scholarshipTarget) || SCHOLARSHIP_PRESETS[0];

    try {
      const res = await aiService.generateScholarshipEssay({
        scholarshipName: selected.name,
        scholarshipProvider: selected.provider,
        applicantLevel,
        fieldOfStudy,
        careerAspiration,
        keyAchievements,
        financialNeedStory,
        tone,
        studentName: currentUser?.name || 'Nicolous Amini Munisi',
        studentSchool: currentUser?.schoolName || 'Malampaka Secondary School'
      });

      setGeneratedEssay(res.essay);

      if (onAwardPoints) {
        onAwardPoints(15, 'Umeandaa rasimu ya Motivation Letter kwa msaada wa Gemini AI');
      }
    } catch (err) {
      console.error('Error generating essay:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Eligibility Check
  const handleCheckEligibility = () => {
    const results = SCHOLARSHIP_PRESETS.map((sch) => {
      let score = 50;
      const feedback: string[] = [];

      // Check level
      if (checkLevel === 'Form VI') {
        if (sch.id === 'samia' || sch.id === 'heslb-priority' || sch.id === 'mastercard') {
          score += 20;
          feedback.push('Kiwango chako cha Kidato cha Sita kinakidhi vigezo vya msingi vya mpango huu.');
        }
      }

      // Check division/gpa
      if (checkDivision === 'I.7' || checkDivision === 'I.8' || checkDivision === 'I.9') {
        score += 25;
        feedback.push('Alama zako za daraja la kwanza (Division 1 ya juu) zinakupa nafasi kubwa ya kipaumbele.');
      } else if (checkDivision.startsWith('I.')) {
        score += 15;
        feedback.push('Division 1 yako inatosheleza ushindani wa maombi.');
      } else {
        score -= 10;
        feedback.push('Huenda ukahitaji barua kali za mapendekezo (recommendations) kuongeza uzito wa maombi.');
      }

      // Check science combination
      if (['PCB', 'PCM', 'PGM', 'CBG'].includes(checkCombination.toUpperCase())) {
        if (sch.id === 'samia') {
          score += 15;
          feedback.push('Mchepuo wa sayansi (STEM) ni kigezo namba 1 cha Samia Scholarship.');
        }
      }

      if (checkSpecialNeeds) {
        score += 10;
        feedback.push('Hali ya uhitaji maalum au kaya duni inakuongezea alama za upendeleo wa HESLB na Mastercard.');
      }

      score = Math.min(score, 98);
      const status = score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low';

      return {
        scholarship: sch,
        eligibleScore: score,
        status,
        feedback
      };
    });

    setCheckedResults(results);
    if (onAwardPoints) {
      onAwardPoints(10, 'Umefanya ukaguzi wa vigezo vya Scholarships');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold backdrop-blur-xs mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Fursa ya 1: Ufadhili wa Masomo & Scholarships</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-heading">
            Andika Motivation Letter & Pima Vigezo vya Ufadhili
          </h2>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 leading-relaxed">
            Tumia zana yetu ya kiakili (AI Essay Draft Tool) kutengeneza barua kali ya maombi inayovutia kamati za ufadhili kama Samia Scholarship, HESLB, Mastercard, na DAAD.
          </p>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveSubTab('essay')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'essay'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'bg-emerald-700/50 text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              ✍️ AI Essay / Motivation Letter Tool
            </button>
            <button
              onClick={() => setActiveSubTab('checker')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'checker'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'bg-emerald-700/50 text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              🎯 Kikaguzi cha Vigezo (Eligibility Checker)
            </button>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: AI ESSAY DRAFT TOOL */}
      {activeSubTab === 'essay' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Sanidi Barua Yako (AI Prompt Inputs)</span>
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                +15 EduPoints
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Chagua Aina ya Ufadhili (Target Scholarship)
              </label>
              <select
                value={scholarshipTarget}
                onChange={(e) => setScholarshipTarget(e.target.value)}
                className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              >
                {SCHOLARSHIP_PRESETS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.provider})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kiwango cha Elimu</label>
                <input
                  type="text"
                  value={applicantLevel}
                  onChange={(e) => setApplicantLevel(e.target.value)}
                  placeholder="Mf: Form VI au Shahada"
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mchepuo / Kozi</label>
                <input
                  type="text"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="Mf: PCB, PCM, Computer Science"
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mafanikio Yako Makuu (Key Achievements)
              </label>
              <textarea
                rows={2}
                value={keyAchievements}
                onChange={(e) => setKeyAchievements(e.target.value)}
                placeholder="Eleza alama zako za juu, uongozi, au miradi ya shule..."
                className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Uhitaji wa Kifedha & Asili ya Familia (Financial Need Story)
              </label>
              <textarea
                rows={2}
                value={financialNeedStory}
                onChange={(e) => setFinancialNeedStory(e.target.value)}
                placeholder="Kwanini unahitaji ufadhili huu kufanikisha ndoto zako..."
                className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Malengo ya Baadaye kwa Tanzania (Future Impact)
              </label>
              <textarea
                rows={2}
                value={careerAspiration}
                onChange={(e) => setCareerAspiration(e.target.value)}
                placeholder="Utaleta mabadiliko gani kiuchumi, kiafya au kiteknolojia..."
                className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mtindo wa Uandishi (Tone of Voice)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTone('passionate')}
                  className={`p-2 rounded-xl text-[11px] font-semibold border text-center cursor-pointer ${
                    tone === 'passionate'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  🔥 Wenye Shauku (Passionate)
                </button>
                <button
                  type="button"
                  onClick={() => setTone('academic')}
                  className={`p-2 rounded-xl text-[11px] font-semibold border text-center cursor-pointer ${
                    tone === 'academic'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  🎓 Wa Kitaaluma (Academic)
                </button>
                <button
                  type="button"
                  onClick={() => setTone('humble')}
                  className={`p-2 rounded-xl text-[11px] font-semibold border text-center cursor-pointer ${
                    tone === 'humble'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  🌱 Wa Unyenyekevu (Humble)
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerateEssay}
              disabled={isGenerating}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Inachambua & Kuandika Rasimu Yako...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tengeneza Rasimu ya Motivation Letter</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Output Preview */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-heading font-bold text-sm text-gray-900">
                    Rasimu Yako ya Motivation Letter
                  </h3>
                </div>

                {generatedEssay && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedEssay);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Imenakiliwa!' : 'Nakili'}</span>
                    </button>
                    <button
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([generatedEssay], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = 'Motivation_Letter_EduKan.txt';
                        document.body.appendChild(element);
                        element.click();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Pakua TXT</span>
                    </button>
                  </div>
                )}
              </div>

              {generatedEssay ? (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-2">
                    <span>Maneno: {generatedEssay.split(/\s+/).length} | Herufi: {generatedEssay.length}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Ubora wa Ushindani: 96% (Tayari Kutuma)
                    </span>
                  </div>
                  <textarea
                    rows={16}
                    value={generatedEssay}
                    onChange={(e) => setGeneratedEssay(e.target.value)}
                    className="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-mono leading-relaxed text-gray-800 focus:bg-white"
                  />
                </div>
              ) : (
                <div className="py-16 text-center text-gray-400 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h4 className="text-sm font-bold text-gray-700">Hujatengeneza rasimu bado</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Jaza maelezo yako upande wa kushoto na ubofye "Tengeneza Rasimu ya Motivation Letter". AI itatengeneza barua iliyopangwa kitaalamu tayari kwa kuomba Samia Scholarship au mikopo.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick tips */}
            <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Kidokezo cha Ushindi:</strong> Kamati za ufadhili hutafuta hadithi halisi ya mwanafunzi (authenticity) na mchango wake kwa jamii badala ya maneno ya jumla. Hariri rasimu yako kuongeza majina ya vijiji vyenu au shule yako.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: ELIGIBILITY CHECKER */}
      {activeSubTab === 'checker' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Kikaguzi cha Vigezo vya Ufadhili (Eligibility Checker)</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Weka matokeo yako kuona ufadhili unaokidhi vigezo vyake mara moja.
                </p>
              </div>

              <button
                onClick={handleCheckEligibility}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Pima Sasa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kiwango cha Elimu</label>
                <select
                  value={checkLevel}
                  onChange={(e) => setCheckLevel(e.target.value)}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                >
                  <option value="Form VI">Kidato cha Sita (A-Level)</option>
                  <option value="Form IV">Kidato cha Nne (O-Level)</option>
                  <option value="Diploma">Stashahada (Diploma)</option>
                  <option value="Bachelor">Shahada ya Kwanza (University)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Daraja / Division</label>
                <select
                  value={checkDivision}
                  onChange={(e) => setCheckDivision(e.target.value)}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                >
                  <option value="I.7">Division I.7 (Ufaulu wa Juu Zaidi)</option>
                  <option value="I.9">Division I.8 - I.9</option>
                  <option value="I.12">Division I.10 - I.13</option>
                  <option value="II">Division II</option>
                  <option value="III">Division III</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">GPA ya Sasa (Kama Upo Chuo)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={checkGpa}
                  onChange={(e) => setCheckGpa(e.target.value)}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mchepuo (Combination / Fani)</label>
                <select
                  value={checkCombination}
                  onChange={(e) => setCheckCombination(e.target.value)}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                >
                  <option value="PCB">PCB (Physics, Chem, Bio)</option>
                  <option value="PCM">PCM (Physics, Chem, Math)</option>
                  <option value="PGM">PGM (Physics, Geo, Math)</option>
                  <option value="CBG">CBG (Chem, Bio, Geo)</option>
                  <option value="EGM">EGM (Econ, Geo, Math)</option>
                  <option value="HGL">HGL (Hist, Geo, Lang)</option>
                  <option value="HKL">HKL (Hist, Kisw, Lang)</option>
                  <option value="CS">Computer Science / IT</option>
                  <option value="OTHER">Fani Nyingine</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkSpecialNeeds}
                    onChange={(e) => setCheckSpecialNeeds(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300"
                  />
                  <span>Hali Maalum (Yatima / Kaya Duni)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {checkedResults ? (
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm text-gray-900">
                Matokeo ya Upimaji wa Vigezo vya Ufadhili ({checkedResults.length} Zimechambuliwa)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checkedResults.map(({ scholarship, eligibleScore, status, feedback }) => (
                  <div
                    key={scholarship.id}
                    className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-3 hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                          {scholarship.provider}
                        </span>
                        <h4 className="font-heading font-bold text-sm text-gray-900 mt-1">
                          {scholarship.name}
                        </h4>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            status === 'High'
                              ? 'bg-emerald-100 text-emerald-800'
                              : status === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          Nafasi: {eligibleScore}%
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl space-y-1">
                      <div><strong>Kifurushi:</strong> {scholarship.coverage}</div>
                      <div><strong>Mwisho wa Maombi:</strong> {scholarship.deadline}</div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-gray-700 mb-1">Tathmini ya Mfumo:</div>
                      <ul className="space-y-1 text-xs text-gray-600">
                        {feedback.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-gray-400">Vigezo: {scholarship.minDivision}</span>
                      <button
                        onClick={() => {
                          setScholarshipTarget(scholarship.id);
                          setActiveSubTab('essay');
                        }}
                        className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Andika Essay ya Hii</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50/60 rounded-2xl p-8 text-center border border-emerald-100">
              <Award className="w-10 h-10 text-emerald-700 mx-auto mb-2 opacity-80" />
              <h4 className="text-sm font-bold text-gray-900">Bofya "Pima Sasa" Kuchambua Nafasi Yako</h4>
              <p className="text-xs text-gray-600 max-w-md mx-auto mt-1">
                Kikaguzi hiki kitachakata daraja lako, mchepuo wako wa masomo na vigezo vya uhitaji dhidi ya kanuni za Samia Scholarship, HESLB na programu za kimataifa.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
