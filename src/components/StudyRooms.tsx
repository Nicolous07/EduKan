import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Award,
  HelpCircle,
  FileText,
  ThumbsUp,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Sparkles,
  Bookmark,
  RefreshCw,
  Check,
  Paperclip,
  Image as ImageIcon,
  X,
  Upload
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuestionItem, StudyResource, UserProfile } from '../types';
import { OpeningBookLoader } from './common/OpeningBookLoader';
import { StudyRoomSkeleton } from './common/StudyRoomSkeleton';
import { isQuestionRecommendedForUser } from '../lib/recommendations';

interface Props {
  questions: QuestionItem[];
  resources: StudyResource[];
  currentUser: UserProfile;
  onAddQuestion: (q: Partial<QuestionItem>) => void;
  onAddAnswer: (questionId: string, answerText: string) => void;
  onMarkBestAnswer: (questionId: string, answerId: string) => void;
  onVoteAnswer: (questionId: string, answerId: string, type: 'up' | 'down') => void;
}

export const StudyRooms: React.FC<Props> = ({
  questions,
  resources,
  currentUser,
  onAddQuestion,
  onAddAnswer,
  onMarkBestAnswer,
  onVoteAnswer
}) => {
  const [activeMode, setActiveMode] = useState<'questions' | 'resources'>('questions');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilterMode, setLevelFilterMode] = useState<'recommended' | 'all'>('recommended');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleModeChange = (mode: 'questions' | 'resources') => {
    if (activeMode === mode) return;
    setIsLoading(true);
    setActiveMode(mode);
    setTimeout(() => {
      setIsLoading(false);
    }, 450);
  };

  const handleSubjectChange = (sub: string) => {
    if (selectedSubject === sub) return;
    setIsLoading(true);
    setSelectedSubject(sub);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const handleDownload = (title: string) => {
    setDownloadNotice(`Umeipakua "${title}" kikamilifu.`);
    setTimeout(() => {
      setDownloadNotice(null);
    }, 3500);
  };
  
  // Ask Question modal
  const [isAsking, setIsAsking] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSubject, setNewSubject] = useState('Physics');
  const [questionAttachment, setQuestionAttachment] = useState<{ name: string; url: string; type: 'image' | 'file' } | null>(null);
  const questionFileInputRef = useRef<HTMLInputElement>(null);

  // Answer input and upload state per question
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({});
  const [answerAttachments, setAnswerAttachments] = useState<Record<string, { name: string; url: string; type: 'image' | 'file' }>>({});
  const [activeAnswerQuestionId, setActiveAnswerQuestionId] = useState<string | null>(null);
  const answerFileInputRef = useRef<HTMLInputElement>(null);

  const handleQuestionFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = () => {
      setQuestionAttachment({
        name: file.name,
        url: reader.result as string,
        type: isImg ? 'image' : 'file'
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAnswerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeAnswerQuestionId) return;
    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = () => {
      setAnswerAttachments(prev => ({
        ...prev,
        [activeAnswerQuestionId]: {
          name: file.name,
          url: reader.result as string,
          type: isImg ? 'image' : 'file'
        }
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const subjects = [
    'All',
    'Physics',
    'Chemistry',
    'Biology',
    'Mathematics',
    'Computer Science',
    'Economics',
    'Geography',
    'History'
  ];

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const finalContent = questionAttachment 
      ? `${newContent.trim()}\n\n📎 Kiambatisho: ${questionAttachment.name}`
      : newContent.trim();

    onAddQuestion({
      title: newTitle.trim(),
      topic: newTopic.trim() || 'General',
      subject: newSubject,
      content: finalContent
    });

    setNewTitle('');
    setNewTopic('');
    setNewContent('');
    setQuestionAttachment(null);
    setIsAsking(false);
  };

  const handleBestAnswerAward = (questionId: string, answerId: string) => {
    onMarkBestAnswer(questionId, answerId);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSub = selectedSubject === 'All' || q.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.content.toLowerCase().includes(searchQuery.toLowerCase()) || q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilterMode === 'all' || isQuestionRecommendedForUser(q, currentUser);
    return matchesSub && matchesSearch && matchesLevel;
  });

  const filteredResources = resources.filter(r => {
    const matchesSub = selectedSubject === 'All' || r.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSub && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-28 sm:pb-16">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Vyumba vya Masomo & Kujisomea (Study Rooms)
          </h1>
          <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
            Uliza maswali magumu ya NECTA, pata majibu kutoka kwa wanafunzi na walimu bora, na pakua past papers za bure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => handleModeChange('questions')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMode === 'questions' ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 shadow-2xs' : 'text-gray-600 dark:text-slate-400'
              }`}
            >
              ❓ Maswali ({questions.length})
            </button>
            <button
              onClick={() => handleModeChange('resources')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMode === 'resources' ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 shadow-2xs' : 'text-gray-600 dark:text-slate-400'
              }`}
            >
              📄 Vifaa & Past Papers ({resources.length})
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            title="Sasisha Orodha"
            disabled={isLoading}
            className="p-2 text-gray-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={() => setIsAsking(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Uliza Swali</span>
          </button>
        </div>
      </div>

      {/* Academic Level Recommendations Control */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-3.5 border border-emerald-100 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-gray-900 dark:text-slate-100">Uchujaji wa Maswali Kulingana na Level:</span>
              <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md truncate">
                {currentUser.level || 'Kidato cha V - VI'}
              </span>
              {currentUser.title && (
                <span className="bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-semibold px-2 py-0.5 rounded-md hidden sm:inline truncate">
                  {currentUser.title}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 truncate">
              {levelFilterMode === 'recommended'
                ? `Inaonyesha maswali yanayolingana na kiwango chako pekee (Mfano: Wanafunzi wa Chuo Kikuu hawaoni maswali ya Form 1).`
                : `Inaonyesha maswali yote kuanzia Shule ya Msingi, O-Level, A-Level hadi Chuo Kikuu.`}
            </p>
          </div>
        </div>

        <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setLevelFilterMode('recommended')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              levelFilterMode === 'recommended'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mapendekezo Yangu</span>
          </button>
          <button
            onClick={() => setLevelFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              levelFilterMode === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
            }`}
          >
            <span>Maswali Yote ({questions.length})</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => handleSubjectChange(sub)}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedSubject === sub
                ? 'bg-emerald-700 text-white shadow-2xs font-semibold'
                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            {sub === 'All' ? 'Masomo Yote' : sub}
          </button>
        ))}
      </div>

      {/* Ask Question Modal */}
      {isAsking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-slate-800 shadow-xl animate-in fade-in zoom-in-95 text-gray-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-4">
              <h3 className="font-heading font-bold text-gray-900 dark:text-slate-100 text-base">Uliza Swali Jipya la Kimasomo</h3>
              <button onClick={() => setIsAsking(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-lg">
                ×
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Somo (Subject)</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none"
                  >
                    {subjects.filter(s => s !== 'All').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Mada (Topic)</label>
                  <input
                    type="text"
                    placeholder="Mfano: Electricity & Magnetism"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Kichwa cha Swali (Title)</label>
                <input
                  type="text"
                  placeholder="Mfano: Jinsi ya kukokotoa induced emf..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Maelezo Kamili ya Swali au Calculation</label>
                <textarea
                  rows={4}
                  placeholder="Eleza kwa undani swali lako au hatua unazokwama..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 resize-none focus:outline-none"
                  required
                />
              </div>

              {/* Upload Attachment Section for Question */}
              <div className="p-3 bg-gray-50 dark:bg-slate-800/80 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2">
                <input
                  type="file"
                  ref={questionFileInputRef}
                  onChange={handleQuestionFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Ambatisha Picha ya Swali au Mchoro (Optional)</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => questionFileInputRef.current?.click()}
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pakia Faili / Picha</span>
                  </button>
                </div>

                {questionAttachment && (
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      {questionAttachment.type === 'image' ? (
                        <img
                          src={questionAttachment.url}
                          alt="Question Media"
                          className="w-8 h-8 rounded object-cover ring-1 ring-emerald-400 shrink-0"
                        />
                      ) : (
                        <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      <span className="truncate text-[11px] font-medium text-gray-800 dark:text-slate-200">
                        {questionAttachment.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setQuestionAttachment(null)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded cursor-pointer"
                      title="Ondoa kiambatisho"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAsking(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 font-semibold hover:bg-gray-200 dark:hover:bg-slate-700"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-xs"
                >
                  Tuma Swali
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOADING STATE OR CONTENT */}
      {isLoading ? (
        <div className="space-y-6">
          <OpeningBookLoader
            message={activeMode === 'questions' ? 'Inafungua Maswali ya NECTA & Mijadala...' : 'Inafungua Maktaba ya Past Papers & Notisi...'}
            subMessage={selectedSubject === 'All' ? 'Inapakia nyenzo na maswali kutoka shule na walimu bora nchini...' : `Inachambua nyenzo zilizothibitishwa za somo la ${selectedSubject}...`}
          />
          <StudyRoomSkeleton mode={activeMode} count={3} />
        </div>
      ) : (
        <>
          {/* QUESTIONS MODE */}
          {activeMode === 'questions' && (
            <div className="space-y-4">
              {filteredQuestions.map((q) => (
                <div key={q.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={q.author.avatar} alt={q.author.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-xs text-gray-900 dark:text-slate-100">{q.author.name}</div>
                        <div className="text-[10px] text-gray-500 dark:text-slate-400">{q.author.school} • {q.author.form}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800">
                        {q.subject}
                      </span>
                      <span className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full">
                        {q.topic}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-slate-100">{q.title}</h3>
                    <p className="text-xs text-gray-700 dark:text-slate-300 mt-1 leading-relaxed whitespace-pre-line">{q.content}</p>
                  </div>

                  {/* Answers List */}
                  <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-slate-300">
                      <span>Majibu ({q.answers.length})</span>
                      {q.hasBestAnswer && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                          <Award className="w-3.5 h-3.5" /> Best Answer Imechaguliwa (+1 Pt)
                        </span>
                      )}
                    </div>

                    {q.answers.map((ans) => (
                      <div
                        key={ans.id}
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                          ans.isBestAnswer
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-500 dark:border-emerald-600 ring-1 ring-emerald-400 dark:ring-emerald-700'
                            : 'bg-gray-50/80 dark:bg-slate-800/70 border-gray-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <img src={ans.author.avatar} alt={ans.author.name} className="w-6 h-6 rounded-full object-cover" />
                            <span className="font-bold text-gray-900 dark:text-slate-100">{ans.author.name}</span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400 font-mono">({ans.author.points} pts)</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {ans.isBestAnswer ? (
                              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                                🏆 Best Answer
                              </span>
                            ) : (
                              <button
                                onClick={() => handleBestAnswerAward(q.id, ans.id)}
                                className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-semibold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700"
                              >
                                Mark as Best Answer
                              </button>
                            )}

                            <button
                              onClick={() => onVoteAnswer(q.id, ans.id, 'up')}
                              className="flex items-center gap-1 text-gray-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{ans.votes}</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-800 dark:text-slate-200 whitespace-pre-line">{ans.content}</p>
                      </div>
                    ))}

                    {/* Submit Answer Input with File/Diagram Upload */}
                    <div className="space-y-1.5 pt-1">
                      {/* Hidden Answer Attachment Input */}
                      <input
                        type="file"
                        ref={answerFileInputRef}
                        onChange={handleAnswerFileUpload}
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                      />

                      {answerAttachments[q.id] && (
                        <div className="flex items-center justify-between p-1.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            {answerAttachments[q.id].type === 'image' ? (
                              <img
                                src={answerAttachments[q.id].url}
                                alt="Solution Attachment"
                                className="w-7 h-7 rounded object-cover ring-1 ring-emerald-400 shrink-0"
                              />
                            ) : (
                              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />
                            )}
                            <span className="truncate text-[11px] font-medium text-emerald-900 dark:text-emerald-200">
                              {answerAttachments[q.id].name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const copy = { ...answerAttachments };
                              delete copy[q.id];
                              setAnswerAttachments(copy);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 rounded cursor-pointer"
                            title="Ondoa kiambatisho"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Weka jibu lako au hatua za utatuzi hapa..."
                          value={answerInputs[q.id] || ''}
                          onChange={(e) => setAnswerInputs({ ...answerInputs, [q.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const text = answerInputs[q.id]?.trim() || '';
                              const att = answerAttachments[q.id];
                              if (text || att) {
                                const finalAns = att ? (text ? `${text}\n📎 [Kiambatisho: ${att.name}]` : `📎 [Kiambatisho: ${att.name}]`) : text;
                                onAddAnswer(q.id, finalAns);
                                setAnswerInputs({ ...answerInputs, [q.id]: '' });
                                if (att) {
                                  const copy = { ...answerAttachments };
                                  delete copy[q.id];
                                  setAnswerAttachments(copy);
                                }
                              }
                            }
                          }}
                          className="flex-1 text-xs p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                        />

                        {/* File Upload Button for Answer */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveAnswerQuestionId(q.id);
                            answerFileInputRef.current?.click();
                          }}
                          title="Pakia picha ya mahesabu au jibu (Upload solution photo/doc)"
                          className="p-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors shrink-0 cursor-pointer"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            const text = answerInputs[q.id]?.trim() || '';
                            const att = answerAttachments[q.id];
                            if (text || att) {
                              const finalAns = att ? (text ? `${text}\n📎 [Kiambatisho: ${att.name}]` : `📎 [Kiambatisho: ${att.name}]`) : text;
                              onAddAnswer(q.id, finalAns);
                              setAnswerInputs({ ...answerInputs, [q.id]: '' });
                              if (att) {
                                const copy = { ...answerAttachments };
                                delete copy[q.id];
                                setAnswerAttachments(copy);
                              }
                            }
                          }}
                          disabled={!answerInputs[q.id]?.trim() && !answerAttachments[q.id]}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0 cursor-pointer"
                        >
                          Jibu
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* RESOURCES MODE */}
          {activeMode === 'resources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map((res) => (
                <div key={res.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                        {res.category}
                      </span>
                      <span className="text-gray-400 dark:text-slate-500 font-mono text-[11px]">{res.fileFormat} • {res.fileSize}</span>
                    </div>
                    <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-slate-100 mb-1">{res.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Mada: {res.topic} • Imetolewa na: {res.schoolOrOrg}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 mt-2">
                    <span>⭐ {res.rating} ({res.downloadsCount} downloads)</span>
                    <button
                      onClick={() => handleDownload(res.title)}
                      className="bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Pakua Bure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
