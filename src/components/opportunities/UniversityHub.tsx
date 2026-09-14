import React, { useState } from 'react';
import {
  Building2,
  Calculator,
  MessageCircle,
  Coins,
  Send,
  Sparkles,
  CheckCircle2,
  MapPin,
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { UniversityProfileCost, StudentAmbassador, UserProfile } from '../../types';
import { INITIAL_UNIVERSITY_COSTS, INITIAL_STUDENT_AMBASSADORS } from '../../data/mockData';
import { aiService } from '../../lib/aiService';

interface Props {
  currentUser?: UserProfile;
  onAwardPoints?: (points: number, reason: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ambassador';
  ambassadorName: string;
  text: string;
  time: string;
}

export const UniversityHub: React.FC<Props> = ({ currentUser, onAwardPoints }) => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'ambassadors'>('calculator');

  // Calculator state
  const [universities] = useState<UniversityProfileCost[]>(INITIAL_UNIVERSITY_COSTS);
  const [selectedUniId, setSelectedUniId] = useState(INITIAL_UNIVERSITY_COSTS[0].id);
  const [accommodationType, setAccommodationType] = useState<'on_campus' | 'off_campus'>('on_campus');
  const [heslbCoverage, setHeslbCoverage] = useState<number>(100); // 0, 50, 75, 100%
  const [dailyMealAllowance, setDailyMealAllowance] = useState<number>(10000); // TZS 10,000 / day standard boom
  const [academicDaysPerYear] = useState<number>(240); // 2 semesters ~ 120 days each

  // Ambassador chat state
  const [ambassadors] = useState<StudentAmbassador[]>(INITIAL_STUDENT_AMBASSADORS);
  const [selectedAmbassadorId, setSelectedAmbassadorId] = useState(INITIAL_STUDENT_AMBASSADORS[0].id);
  const [userChatInput, setUserChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ambassador',
      ambassadorName: 'Baraka Mwita',
      text: 'Habari ndugu yangu! Mimi ni Baraka, mwanafunzi wa mwaka wa 3 CoICT Mlimani UDSM. Karibu sana kuuliza chochote kuhusu hostel, masomo, au maisha ya chuo!',
      time: '10:00 Asubuhi'
    }
  ]);

  const selectedUni =
    universities.find((u) => u.id === selectedUniId) || universities[0];

  // Calculations
  const averageTuition = Math.round((selectedUni.tuitionMin + selectedUni.tuitionMax) / 2);
  const accommodationCost =
    accommodationType === 'on_campus'
      ? selectedUni.hostelFeePerYear
      : selectedUni.offCampusRentPerMonth * 10; // 10 months of study

  const mealsAndLivingCost = dailyMealAllowance * academicDaysPerYear;
  const booksAndStationery = 200000;
  const healthInsuranceNhif = 50400; // Standard NHIF student fee in Tanzania

  const totalAnnualCost =
    averageTuition + accommodationCost + mealsAndLivingCost + booksAndStationery + healthInsuranceNhif;

  // HESLB covers tuition (up to coverage %), meals/boom (up to coverage %), accommodation (partially)
  const heslbTuitionCovered = (averageTuition * heslbCoverage) / 100;
  const heslbMealsCovered = (mealsAndLivingCost * heslbCoverage) / 100;
  const heslbAccommodationCovered =
    heslbCoverage > 0 ? (accommodationType === 'on_campus' ? accommodationCost : Math.min(accommodationCost, 250000)) : 0;
  const heslbTotalContribution =
    heslbTuitionCovered + heslbMealsCovered + heslbAccommodationCovered;

  const parentStudentOutOfPocket = Math.max(0, totalAnnualCost - heslbTotalContribution);

  // Send message to ambassador
  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || userChatInput;
    if (!message.trim()) return;

    const currentAmbassador =
      ambassadors.find((a) => a.id === selectedAmbassadorId) || ambassadors[0];

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      ambassadorName: currentUser?.name || 'Mimi',
      text: message,
      time: timeFormatted
    };

    setChatHistory((prev) => [...prev, userMsg]);
    if (!textToSend) setUserChatInput('');

    // Check for preset answer match first
    const matched = currentAmbassador.frequentAnswers.find(
      (fa) =>
        fa.question.toLowerCase().includes(message.toLowerCase()) ||
        message.toLowerCase().includes(fa.question.toLowerCase().substring(0, 15))
    );

    let reply = matched?.answer;

    if (!reply) {
      try {
        const aiRes = await aiService.chatWithTutor(
          `Kama balozi wa chuo kikuu (${currentAmbassador.name}, ${currentAmbassador.course}, ${currentAmbassador.universityName}), tafadhali jibu swali hili la mwanafunzi anayetaka kujiunga: "${message}"`
        );
        reply = aiRes.reply;
      } catch (err) {
        reply = 'Asante kwa swali zuri! Chuo kikuu kinahitaji maandalizi ya mapema hasa kupanga bajeti na kusoma kwa bidii ili kudumisha GPA nzuri.';
      }
    }

    const ambMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'ambassador',
      ambassadorName: currentAmbassador.name,
      text: reply || 'Asante kwa swali lako, niko tayari kukusaidia zaidi.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, ambMsg]);

    if (onAwardPoints) {
      onAwardPoints(10, 'Umeshiriki mazungumzo na Balozi wa Chuo Kikuu');
    }
  };

  const selectedAmbassador =
    ambassadors.find((a) => a.id === selectedAmbassadorId) || ambassadors[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-800/60 text-purple-200 text-xs font-semibold backdrop-blur-xs mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Fursa ya 5: Vyuo Vikuu (Cost Calculator & Student Ambassador Chat)</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-heading">
            Gharama Halisi za Maisha & Ushauri wa Wanafunzi wa Vyuo
          </h2>
          <p className="text-purple-100/90 text-xs sm:text-sm mt-1 leading-relaxed">
            Kokotoa bajeti kamili ya mwaka (ada, malazi, chakula cha kila siku cha TZS 10,000 na makato ya mkopo wa HESLB), na zungumza moja kwa moja na mabalozi wetu wa vyuo vikuu (UDSM, UDOM, DIT, SUA) upate uzoefu wa moja kwa moja.
          </p>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-white text-purple-950 shadow-sm'
                  : 'bg-purple-800/50 text-purple-100 hover:bg-purple-800'
              }`}
            >
              🧮 Kikokotoo cha Gharama za Chuo (Cost Calculator)
            </button>
            <button
              onClick={() => setActiveTab('ambassadors')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ambassadors'
                  ? 'bg-white text-purple-950 shadow-sm'
                  : 'bg-purple-800/50 text-purple-100 hover:bg-purple-800'
              }`}
            >
              💬 Mazungumzo na Mabalozi (Student Ambassador Chat)
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: COST & LIVING CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs panel */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-purple-600" />
                <span>Vigezo vya Hesabu (Cost Variables)</span>
              </h3>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Tanzania Shillings (TZS)
              </span>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Chagua Chuo Kikuu</label>
              <select
                value={selectedUniId}
                onChange={(e) => setSelectedUniId(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white text-xs font-medium"
              >
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.shortName} - {u.location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Aina ya Malazi (Accommodation)</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAccommodationType('on_campus')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    accommodationType === 'on_campus'
                      ? 'bg-purple-50 border-purple-600 text-purple-900 font-bold'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xs">🏢 Ndani ya Chuo (Hostel)</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 font-normal">
                    Takriban TZS {selectedUni.hostelFeePerYear.toLocaleString()} / Mwaka
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccommodationType('off_campus')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    accommodationType === 'off_campus'
                      ? 'bg-purple-50 border-purple-600 text-purple-900 font-bold'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xs">🏡 Kupanga Nje (Mtaani)</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 font-normal">
                    Takriban TZS {selectedUni.offCampusRentPerMonth.toLocaleString()} / Mwezi
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Kiwango cha Mkopo wa Bodi (HESLB Loan Coverage)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[100, 75, 50, 0].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setHeslbCoverage(pct)}
                    className={`py-2 rounded-xl border font-bold text-center cursor-pointer transition-all ${
                      heslbCoverage === pct
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pct === 0 ? '0% Binafsi' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="font-bold text-gray-700">Posho ya Chakula ya Siku (Boom Allowance)</label>
                <span className="font-bold text-purple-900">
                  TZS {dailyMealAllowance.toLocaleString()} / Siku
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="20000"
                step="500"
                value={dailyMealAllowance}
                onChange={(e) => setDailyMealAllowance(Number(e.target.value))}
                className="w-full accent-purple-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                <span>TZS 5,000 (Chini)</span>
                <span>TZS 10,000 (Kiwango cha HESLB)</span>
                <span>TZS 20,000 (Juu)</span>
              </div>
            </div>

            <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-100 text-[11px] text-purple-950 space-y-1">
              <div>
                <strong>Taasisi / Shule Kuu:</strong> {selectedUni.popularColleges.join(', ')}
              </div>
              <div>
                <strong>Mahali:</strong> {selectedUni.location}
              </div>
            </div>
          </div>

          {/* Results calculation breakdown */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs flex flex-col justify-between space-y-6">
            <div>
              <div className="border-b border-gray-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  Ripoti ya Makadirio ya Kifedha
                </span>
                <h3 className="font-heading font-bold text-lg text-gray-900 mt-1">
                  Mchanganuo wa Gharama za Mwaka Mzima ({selectedUni.name})
                </h3>
              </div>

              {/* Items Breakdown list */}
              <div className="divide-y divide-gray-100 text-xs mt-3">
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-600">Ada ya Chuo (Tuition Fee):</span>
                  <strong className="text-gray-900">TZS {averageTuition.toLocaleString()}</strong>
                </div>

                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-600">
                    Malazi ({accommodationType === 'on_campus' ? 'Hostel ya Ndani' : 'Kupanga Nje'}):
                  </span>
                  <strong className="text-gray-900">TZS {accommodationCost.toLocaleString()}</strong>
                </div>

                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-600">
                    Chakula & Matumizi ({academicDaysPerYear} Siku @ TZS {dailyMealAllowance.toLocaleString()}):
                  </span>
                  <strong className="text-gray-900">TZS {mealsAndLivingCost.toLocaleString()}</strong>
                </div>

                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-600">Vitabu & Vifaa vya Kujifunzia (Stationery):</span>
                  <strong className="text-gray-900">TZS {booksAndStationery.toLocaleString()}</strong>
                </div>

                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-600">Bima ya Afya ya Wanafunzi (NHIF):</span>
                  <strong className="text-gray-900">TZS {healthInsuranceNhif.toLocaleString()}</strong>
                </div>

                <div className="py-3 flex justify-between text-sm bg-gray-50/70 px-3 rounded-xl mt-2 font-bold">
                  <span className="text-gray-900">Jumla Kuu ya Mwaka:</span>
                  <span className="text-purple-950">TZS {totalAnnualCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Split cards: HESLB vs Out of Pocket */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Inayolipwa na HESLB ({heslbCoverage}%):
                  </div>
                  <div className="text-lg font-bold font-heading text-emerald-900 mt-1">
                    TZS {heslbTotalContribution.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Inajumuisha ada ya chuo na posho ya kila siku (Boom) inayoingizwa benki.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    Gharama ya Mzazi / Mwanafunzi:
                  </div>
                  <div className="text-lg font-bold font-heading text-amber-950 mt-1">
                    TZS {parentStudentOutOfPocket.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1">
                    Kiasi halisi unachopaswa kukiandaa kabla na wakati wa muhula wa masomo.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 text-center">
              Makadirio haya yamezingatia miongozo ya hivi karibuni ya TCU na HESLB nchini Tanzania.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT AMBASSADOR CHAT */}
      {activeTab === 'ambassadors' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ambassador Profiles Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-heading font-bold text-sm text-gray-900">
              Mabalozi wa Vyuo Vikuu (Student Ambassadors)
            </h3>

            <div className="space-y-3">
              {ambassadors.map((amb) => {
                const isSelected = amb.id === selectedAmbassadorId;
                return (
                  <button
                    key={amb.id}
                    onClick={() => {
                      setSelectedAmbassadorId(amb.id);
                      setChatHistory([
                        {
                          id: `msg-${Date.now()}`,
                          sender: 'ambassador',
                          ambassadorName: amb.name,
                          text: `Habari! Mimi ni ${amb.name} wa ${amb.university}. Karibu uniulize chochote kuhusu ${amb.faculty}!`,
                          time: 'Sasa hivi'
                        }
                      ]);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-purple-50/80 border-purple-600 shadow-2xs'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={amb.avatar}
                        alt={amb.name}
                        className="w-11 h-11 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-gray-900">{amb.name}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="text-[11px] text-purple-700 font-semibold">{amb.badge}</div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{amb.bio}</p>

                    <div className="text-[10px] text-gray-400 font-medium">
                      🏛️ {amb.university} • {amb.yearOfStudy}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Chat Arena */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between overflow-hidden h-[540px]">
            {/* Chat header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <div className="flex items-center gap-3">
                <img
                  src={selectedAmbassador.avatar}
                  alt={selectedAmbassador.name}
                  className="w-9 h-9 rounded-full object-cover border"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs sm:text-sm text-gray-900">
                      {selectedAmbassador.name}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {selectedAmbassador.faculty} • {selectedAmbassador.university}
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Mtandaoni (Verified Senior)
              </span>
            </div>

            {/* Chat message bubbles */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-purple-700 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200/60'
                    }`}
                  >
                    <div className="font-bold text-[10px] opacity-75 mb-1">
                      {msg.ambassadorName} • {msg.time}
                    </div>
                    <div>{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompts Suggestions */}
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/60 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-gray-400 font-bold whitespace-nowrap text-[10px]">Uliza Haraka:</span>
              {selectedAmbassador.frequentAnswers.map((fa, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(fa.question)}
                  className="px-2.5 py-1 bg-white hover:bg-purple-50 hover:border-purple-300 text-gray-700 hover:text-purple-900 border border-gray-200 rounded-full whitespace-nowrap text-[10px] cursor-pointer transition-colors shrink-0"
                >
                  💡 {fa.question}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Andika swali lako kwa balozi wa chuo kikuu..."
                value={userChatInput}
                onChange={(e) => setUserChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="flex-1 p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!userChatInput.trim()}
                className="p-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white rounded-xl cursor-pointer transition-colors shadow-2xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
