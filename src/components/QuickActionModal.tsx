import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  HelpCircle,
  BarChart2,
  Award,
  BookOpen,
  Sparkles,
  MessageSquare,
  Compass,
  CheckCircle2,
  Smile,
  Plus,
  Mic,
  MicOff,
  Radio,
  Volume2,
  AlertCircle,
  Upload,
  Paperclip,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { Post, QuestionItem, UserProfile, PostCategory } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onAddPost: (post: Partial<Post>) => void;
  onAddQuestion: (q: Partial<QuestionItem>) => void;
  onNavigateTab: (tab: string) => void;
  defaultMode?: 'post' | 'question';
}

const TANZANIA_SUBJECTS = [
  'Physics',
  'Chemistry',
  'Biology',
  'Mathematics (BAM / Adv)',
  'Geography',
  'History',
  'Kiswahili',
  'English Language & Lit',
  'Civics / GS',
  'Economics',
  'Commerce & Bookkeeping',
  'Computer Science / ICT'
];

export const QuickActionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onAddPost,
  onAddQuestion,
  onNavigateTab,
  defaultMode = 'post'
}) => {
  const [activeMode, setActiveMode] = useState<'post' | 'question'>(defaultMode);

  // Post State
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<PostCategory>('masomo');
  const [postType, setPostType] = useState<'normal' | 'question' | 'achievement' | 'poll'>('normal');
  const [subjectTag, setSubjectTag] = useState('Physics');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  // Question State
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionSubject, setQuestionSubject] = useState('Physics');
  const [questionTopic, setQuestionTopic] = useState('');
  const [questionContent, setQuestionContent] = useState('');

  // Attachment State for Post
  const [postMediaUrl, setPostMediaUrl] = useState<string | null>(null);
  const [postMediaType, setPostMediaType] = useState<'image' | 'document' | null>(null);
  const [postMediaName, setPostMediaName] = useState<string | null>(null);
  const postFileInputRef = useRef<HTMLInputElement>(null);

  // Attachment State for Question
  const [questionImageUrl, setQuestionImageUrl] = useState<string | null>(null);
  const [questionImageName, setQuestionImageName] = useState<string | null>(null);
  const questionFileInputRef = useRef<HTMLInputElement>(null);

  const handlePostFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = () => {
      setPostMediaUrl(reader.result as string);
      setPostMediaType(isImg ? 'image' : 'document');
      setPostMediaName(file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleQuestionFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setQuestionImageUrl(reader.result as string);
      setQuestionImageName(file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Status feedback
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Web Speech API Voice Note State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [speechLang, setSpeechLang] = useState<'sw-TZ' | 'en-US'>('sw-TZ');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Clean up recording on unmount or close
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startVoiceRecording = () => {
    setSpeechError(null);
    setInterimTranscript('');

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSpeechError(
        'Kipengele cha Web Speech API hakipatikani kwenye kivinjari hiki moja kwa moja. Tafadhali tumia kivinjari kama Google Chrome, Edge au Safari kutumia kinasa sauti.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLang;

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingDuration(0);
        timerRef.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            if (activeMode === 'post') {
              setPostContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
            } else {
              setQuestionContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
            }
          } else {
            currentInterim += transcript;
          }
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Ruhusa ya maikrofoni imekataliwa. Tafadhali bonyeza icon ya kufuli au ruhusu kipaza sauti kwenye kivinjari.');
        } else if (event.error === 'network') {
          setSpeechError('Hitilafu ya mtandao katika kutambua sauti. Hakikisha intaneti inafanya kazi.');
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Hitilafu ya kurekodi sauti: ${event.error}`);
        }
        stopVoiceRecording();
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition', err);
      setSpeechError('Haikuweza kuunganisha maikrofoni. Hakikisha maikrofoni inafanya kazi.');
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    if (interimTranscript) {
      if (activeMode === 'post') {
        setPostContent((prev) => (prev ? `${prev} ${interimTranscript}` : interimTranscript));
      } else {
        setQuestionContent((prev) => (prev ? `${prev} ${interimTranscript}` : interimTranscript));
      }
      setInterimTranscript('');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const filteredPoll = postType === 'poll'
      ? pollOptions.filter(o => o.trim()).map((text, i) => ({ id: `opt-${Date.now()}-${i}`, text, votes: 0 }))
      : undefined;

    const newPost: Partial<Post> = {
      type: postType,
      category: postCategory,
      content: postContent.trim(),
      subject: postCategory === 'masomo' ? subjectTag : (postCategory === 'ushauri' ? 'Ushauri wa Elimu' : 'Burudani & Michezo'),
      mediaUrl: postMediaUrl || undefined,
      mediaType: postMediaType || undefined,
      pollOptions: filteredPoll
    };

    onAddPost(newPost);
    setSubmittedMessage('Your post is now live! +5 EduPoints earned 🌟');
    setTimeout(() => {
      setSubmittedMessage(null);
      setPostContent('');
      setPollOptions(['', '']);
      setPostMediaUrl(null);
      setPostMediaType(null);
      setPostMediaName(null);
      onClose();
    }, 1200);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTitle.trim() || !questionContent.trim()) return;

    const formattedContent = questionImageUrl && !questionContent.includes('Kiambatisho')
      ? `${questionContent.trim()}\n\n📎 Mchoro/Picha ya Swali: ${questionImageName || 'Picha ya Swali'}`
      : questionContent.trim();

    onAddQuestion({
      title: questionTitle.trim(),
      subject: questionSubject,
      topic: questionTopic.trim() || 'General Topic',
      content: formattedContent,
      imageUrl: questionImageUrl || undefined
    });

    setSubmittedMessage('Your question has been posted to students! +10 EduPoints 🎯');
    setTimeout(() => {
      setSubmittedMessage(null);
      setQuestionTitle('');
      setQuestionTopic('');
      setQuestionContent('');
      setQuestionImageUrl(null);
      setQuestionImageName(null);
      onClose();
      onNavigateTab('study');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-emerald-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-slate-100 text-base font-heading">
                EduKan Quick Action
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Share an idea, ask an exam question, or advise fellow students
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 pt-3 pb-1 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveMode('post')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'post'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Create Post</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('question')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'question'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ask Academic Question</span>
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900">
          {submittedMessage ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-slate-100">{submittedMessage}</h4>
              <p className="text-xs text-gray-500 dark:text-slate-400">Updating automatically...</p>
            </div>
          ) : activeMode === 'post' ? (
            <form onSubmit={handlePostSubmit} className="space-y-4">
              {/* Category Pill Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Post Category:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPostCategory('masomo')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      postCategory === 'masomo'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-200 dark:ring-emerald-800'
                        : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Academics</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostCategory('ushauri')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      postCategory === 'ushauri'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-200 dark:ring-emerald-800'
                        : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Guidance</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostCategory('burudani')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      postCategory === 'burudani'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-200 dark:ring-emerald-800'
                        : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Smile className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Student Life</span>
                  </button>
                </div>
              </div>

              {/* Post Type Selector */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPostType('normal')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    postType === 'normal'
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                      : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('question')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                    postType === 'question'
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                      : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <HelpCircle className="w-3 h-3" />
                  Question
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('poll')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                    postType === 'poll'
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                      : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <BarChart2 className="w-3 h-3" />
                  Poll
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('achievement')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                    postType === 'achievement'
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                      : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Award className="w-3 h-3" />
                  Achievement
                </button>
              </div>

              {/* Subject selector if Masomo */}
              {postCategory === 'masomo' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                    Subject:
                  </label>
                  <select
                    value={subjectTag}
                    onChange={(e) => setSubjectTag(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 dark:text-slate-100"
                  >
                    {TANZANIA_SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Post Content with Voice Note Feature */}
              <div>
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-slate-300">
                    Post Message / Content:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {/* Language selector toggle */}
                    <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px]">
                      <button
                        type="button"
                        onClick={() => setSpeechLang('sw-TZ')}
                        className={`px-1.5 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                          speechLang === 'sw-TZ'
                            ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                            : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                        }`}
                        title="Swahili Language"
                      >
                        Swahili
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpeechLang('en-US')}
                        className={`px-1.5 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                          speechLang === 'en-US'
                            ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                            : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                        }`}
                        title="English Language"
                      >
                        English
                      </button>
                    </div>

                    {/* Voice Note Trigger */}
                    {!isRecording ? (
                      <button
                        type="button"
                        id="btn-voice-record-post"
                        onClick={startVoiceRecording}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all shadow-2xs cursor-pointer"
                        title="Dictate with voice (Web Speech API)"
                      >
                        <Mic className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Voice Record</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopVoiceRecording}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all shadow-xs animate-pulse cursor-pointer"
                      >
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop ({formatDuration(recordingDuration)})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Voice Recording Status Card */}
                {isRecording && (
                  <div className="p-3 bg-red-50/90 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl mb-2 flex items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative flex items-center justify-center shrink-0">
                        <span className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute" />
                        <span className="w-3 h-3 bg-red-600 rounded-full relative" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5 flex-wrap">
                          <span>Listening to your voice... ({formatDuration(recordingDuration)})</span>
                          <span className="text-[10px] bg-red-200/80 dark:bg-red-900/80 text-red-800 dark:text-red-200 px-1.5 py-0.2 rounded font-mono">
                            {speechLang === 'sw-TZ' ? 'Swahili' : 'English'}
                          </span>
                        </div>
                        <p className="text-[11px] text-red-700 dark:text-red-400 italic truncate mt-0.5">
                          {interimTranscript
                            ? `"${interimTranscript}"`
                            : 'Speak clearly, speech is transcribed into text in real-time...'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={stopVoiceRecording}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0 shadow-2xs cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                )}

                {/* Speech Error Banner if any */}
                {speechError && (
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded-xl mb-2 flex items-start justify-between gap-2 text-xs text-amber-900 dark:text-amber-300 animate-in fade-in">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{speechError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSpeechError(null)}
                      className="text-amber-700 hover:text-amber-900 font-bold ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                )}

                <textarea
                  required
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder={
                    postCategory === 'masomo'
                      ? 'Share a study insight, formula, or exam tip (or click "Voice Record")...'
                      : postCategory === 'ushauri'
                      ? 'Offer advice on studying methods, course selection, or student well-being...'
                      : 'Share sports updates, arts, or campus/school club activities...'
                  }
                  className="w-full text-xs sm:text-sm p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />

                {/* File Upload Trigger and Attachment Preview for Post */}
                <div className="mt-2.5">
                  <input
                    type="file"
                    ref={postFileInputRef}
                    onChange={handlePostFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                  />
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      id="btn-upload-file-post"
                      onClick={() => postFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-slate-700 bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                      title="Upload image or academic document (+)"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                      <span>Upload File / Photo (+)</span>
                    </button>

                    {postMediaName && (
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium truncate max-w-[200px]">
                        ✓ {postMediaName}
                      </span>
                    )}
                  </div>

                  {postMediaUrl && (
                    <div className="mt-2 p-2.5 bg-emerald-50/90 dark:bg-slate-800/90 rounded-xl border border-emerald-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs animate-in fade-in">
                      <div className="flex items-center gap-2 min-w-0">
                        {postMediaType === 'image' ? (
                          <img src={postMediaUrl} alt="Preview" className="w-10 h-10 rounded-lg object-cover ring-1 ring-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">{postMediaName || 'Attached File'}</p>
                          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                            {postMediaType === 'image' ? 'Image Attachment' : 'PDF / Document File'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPostMediaUrl(null);
                          setPostMediaType(null);
                          setPostMediaName(null);
                        }}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer shrink-0"
                        title="Remove attachment"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Poll inputs if poll */}
              {postType === 'poll' && (
                <div className="p-3 bg-emerald-50/50 dark:bg-slate-800/60 rounded-xl border border-emerald-100 dark:border-slate-700 space-y-2">
                  <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">Poll Options:</div>
                  {pollOptions.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Option ${idx + 1}...`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...pollOptions];
                        copy[idx] = e.target.value;
                        setPollOptions(copy);
                      }}
                      className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100 placeholder:text-gray-400"
                    />
                  ))}
                  {pollOptions.length < 4 && (
                    <button
                      type="button"
                      onClick={() => setPollOptions([...pollOptions, ''])}
                      className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                    >
                      + Add another option
                    </button>
                  )}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800">
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>You earn +5 EduPoints for posting</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!postContent.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-semibold px-5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Now</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              {/* Question Subject & Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                    Subject:
                  </label>
                  <select
                    value={questionSubject}
                    onChange={(e) => setQuestionSubject(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 dark:text-slate-100"
                  >
                    {TANZANIA_SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                    Topic:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electromagnetism, Calculus..."
                    value={questionTopic}
                    onChange={(e) => setQuestionTopic(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Question Title */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                  Question Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to solve RLC resonance frequency in AC circuits..."
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Detailed Content with Voice Note */}
              <div>
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-slate-300">
                    Detailed Question:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {/* Language selector toggle */}
                    <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px]">
                      <button
                        type="button"
                        onClick={() => setSpeechLang('sw-TZ')}
                        className={`px-1.5 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                          speechLang === 'sw-TZ'
                            ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                            : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                        }`}
                        title="Swahili Language"
                      >
                        Swahili
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpeechLang('en-US')}
                        className={`px-1.5 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                          speechLang === 'en-US'
                            ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                            : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                        }`}
                        title="English Language"
                      >
                        English
                      </button>
                    </div>

                    {/* Voice Note Trigger */}
                    {!isRecording ? (
                      <button
                        type="button"
                        id="btn-voice-record-question"
                        onClick={startVoiceRecording}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all shadow-2xs cursor-pointer"
                        title="Dictate question with voice (Web Speech API)"
                      >
                        <Mic className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Voice Record</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopVoiceRecording}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all shadow-xs animate-pulse cursor-pointer"
                      >
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop ({formatDuration(recordingDuration)})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Voice Recording Status Card for Question */}
                {isRecording && (
                  <div className="p-3 bg-red-50/90 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl mb-2 flex items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative flex items-center justify-center shrink-0">
                        <span className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute" />
                        <span className="w-3 h-3 bg-red-600 rounded-full relative" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5 flex-wrap">
                          <span>Listening to question... ({formatDuration(recordingDuration)})</span>
                          <span className="text-[10px] bg-red-200/80 dark:bg-red-900/80 text-red-800 dark:text-red-200 px-1.5 py-0.2 rounded font-mono">
                            {speechLang === 'sw-TZ' ? 'Swahili' : 'English'}
                          </span>
                        </div>
                        <p className="text-[11px] text-red-700 dark:text-red-400 italic truncate mt-0.5">
                          {interimTranscript
                            ? `"${interimTranscript}"`
                            : 'State your question, speech is transcribed in real-time...'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={stopVoiceRecording}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0 shadow-2xs cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                )}

                {/* Speech Error Banner if any */}
                {speechError && (
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded-xl mb-2 flex items-start justify-between gap-2 text-xs text-amber-900 dark:text-amber-300 animate-in fade-in">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{speechError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSpeechError(null)}
                      className="text-amber-700 hover:text-amber-900 font-bold ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                )}

                <textarea
                  required
                  rows={4}
                  value={questionContent}
                  onChange={(e) => setQuestionContent(e.target.value)}
                  placeholder="Write full details of your question (or click 'Voice Record' to dictate)..."
                  className="w-full text-xs sm:text-sm p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />

                {/* File Upload Trigger and Diagram Preview for Question */}
                <div className="mt-2.5">
                  <input
                    type="file"
                    ref={questionFileInputRef}
                    onChange={handleQuestionFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      id="btn-upload-file-question"
                      onClick={() => questionFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-slate-700 bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                      title="Upload question diagram or equation snapshot (+)"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                      <span>Upload Diagram / Photo (+)</span>
                    </button>

                    {questionImageName && (
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium truncate max-w-[200px]">
                        ✓ {questionImageName}
                      </span>
                    )}
                  </div>

                  {questionImageUrl && (
                    <div className="mt-2 p-2.5 bg-emerald-50/90 dark:bg-slate-800/90 rounded-xl border border-emerald-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs animate-in fade-in">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={questionImageUrl} alt="Question diagram preview" className="w-10 h-10 rounded-lg object-cover ring-1 ring-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">{questionImageName || 'Question Diagram'}</p>
                          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">Academic Diagram / Snapshot</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setQuestionImageUrl(null);
                          setQuestionImageName(null);
                        }}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer shrink-0"
                        title="Remove diagram"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800">
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>You earn +10 EduPoints for asking a question</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!questionTitle.trim() || !questionContent.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-semibold px-5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Submit Question</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
