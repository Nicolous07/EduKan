import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Sparkles,
  Calendar,
  School,
  User,
  X,
  Bookmark,
  ExternalLink,
  Award,
  Layers,
  GraduationCap,
  Eye,
  Plus,
  SlidersHorizontal,
  Check,
  Share2,
  ZoomIn
} from 'lucide-react';
import { LibraryItem, LibraryLevel, LibraryCategory, UserProfile, UserRole } from '../types';

export type DisciplineCategory =
  | 'all'
  | 'Science'
  | 'Math'
  | 'Language'
  | 'Literature'
  | 'Social Studies'
  | 'Commercial'
  | 'Technology';

interface Props {
  books: LibraryItem[];
  currentUser: UserProfile;
  currentRole: UserRole;
  onAddBook: (book: Partial<LibraryItem>) => void;
  onDownloadBook: (bookId: string) => void;
  onToggleSaveBook: (bookId: string) => void;
}

interface UserBookProgress {
  progress: number; // 0 to 100
  currentPage: number;
  totalPages: number;
  isDownloaded: boolean;
  updatedAt: string;
}

const PROGRESS_STORAGE_KEY = 'edukan_library_progress';

export const LibraryView: React.FC<Props> = ({
  books,
  currentUser,
  currentRole,
  onAddBook,
  onDownloadBook,
  onToggleSaveBook
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineCategory>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlySaved, setOnlySaved] = useState<boolean>(false);

  // User reading progress state map
  const [progressMap, setProgressMap] = useState<Record<string, UserBookProgress>>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read library progress from storage:', e);
    }
    // Initialize default progress from books
    const initialMap: Record<string, UserBookProgress> = {};
    books.forEach((b) => {
      const totalPages = b.pages || 180;
      const progress = b.readingProgress ?? 0;
      const currentPage = b.currentPage ?? Math.round((progress / 100) * totalPages);
      initialMap[b.id] = {
        progress,
        currentPage,
        totalPages,
        isDownloaded: !!b.isDownloaded,
        updatedAt: new Date().toISOString()
      };
    });
    return initialMap;
  });

  // Save progress changes to localStorage
  const saveProgress = (bookId: string, page: number, totalPages: number, markDownloaded?: boolean) => {
    setProgressMap((prev) => {
      const existing = prev[bookId];
      const validTotal = totalPages > 0 ? totalPages : existing?.totalPages || 180;
      const clampedPage = Math.max(0, Math.min(page, validTotal));
      const calculatedPct = Math.round((clampedPage / validTotal) * 100);

      const updatedMap = {
        ...prev,
        [bookId]: {
          progress: calculatedPct,
          currentPage: clampedPage,
          totalPages: validTotal,
          isDownloaded: markDownloaded !== undefined ? markDownloaded : (existing?.isDownloaded || false),
          updatedAt: new Date().toISOString()
        }
      };

      try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updatedMap));
      } catch (err) {
        console.warn('Could not persist library progress:', err);
      }

      return updatedMap;
    });
  };

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<LibraryCategory>('Vitabu vya Masomo');
  const [newLevel, setNewLevel] = useState<LibraryLevel>('A-Level');
  const [newClassGrade, setNewClassGrade] = useState('Kidato cha 5 & 6');
  const [newSubject, setNewSubject] = useState('Physics');
  const [newYear, setNewYear] = useState('2025');
  const [newAuthor, setNewAuthor] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPages, setNewPages] = useState('180');
  const [newFileFormat, setNewFileFormat] = useState<'PDF' | 'DOCX' | 'EPUB'>('PDF');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('4.5 MB');

  // Quick View Modal state
  const [quickViewBook, setQuickViewBook] = useState<LibraryItem | null>(null);
  const [modalCurrentPage, setModalCurrentPage] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // When quickViewBook opens, sync its current page state
  useEffect(() => {
    if (quickViewBook) {
      const prog = progressMap[quickViewBook.id];
      if (prog) {
        setModalCurrentPage(prog.currentPage);
      } else {
        setModalCurrentPage(quickViewBook.currentPage || 0);
      }
    }
  }, [quickViewBook]);

  // Discipline Category options
  const disciplineCategories: { id: DisciplineCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'Masomo & Fani Zote', icon: '🌐' },
    { id: 'Science', label: 'Science (Sayansi: Physics, Chemistry, Biology)', icon: '🔬' },
    { id: 'Math', label: 'Math (Hisabati & Takwimu)', icon: '📐' },
    { id: 'Language', label: 'Language (Lugha: Kiswahili & English)', icon: '🗣️' },
    { id: 'Literature', label: 'Literature (Fasihi, Ushairi & Riwaya)', icon: '📖' },
    { id: 'Social Studies', label: 'Social Studies (Historia, Jiografia, Uraia)', icon: '🌍' },
    { id: 'Commercial', label: 'Commercial (Biashara, Uchumi, Hesabu)', icon: '💼' },
    { id: 'Technology', label: 'Technology & Sayansi ya Kompyuta', icon: '💻' }
  ];

  // Levels list
  const levels: { id: string; label: string; sub: string }[] = [
    { id: 'all', label: 'Ngazi Zote', sub: 'Vitabu Vyote' },
    { id: 'A-Level', label: 'A-Level (Form 5 & 6)', sub: 'Kidato V - VI' },
    { id: 'O-Level', label: 'O-Level (Form 1 - 4)', sub: 'Kidato I - IV' },
    { id: 'Chuo Kikuu', label: 'Vyuo Vikuu & Vyuo', sub: 'Higher Education' },
    { id: 'Msingi', label: 'Shule ya Msingi', sub: 'Darasa I - VII' },
    { id: 'Ualimu', label: 'Ualimu & Miongozo', sub: 'Teacher Guides' }
  ];

  // Document types list
  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Aina Zote' },
    { id: 'Vitabu vya Masomo', label: '📚 Vitabu vya Kiada' },
    { id: 'Mitihani ya NECTA', label: '📝 Mitihani ya NECTA' },
    { id: 'Notisi za Masomo', label: '💡 Notisi za Masomo' },
    { id: 'Majaribio ya Mock', label: '🎯 Majaribio ya Mock' },
    { id: 'Miongozo ya Walimu', label: '🧑‍🏫 Miongozo ya Walimu' }
  ];

  // Subjects list
  const subjects = [
    'all',
    'Physics',
    'Chemistry',
    'Biology',
    'Mathematics',
    'Kiswahili',
    'English',
    'Geography',
    'History',
    'Civics',
    'Commerce',
    'Computer Science',
    'Sayansi'
  ];

  // Helper to match discipline category
  const matchesDiscipline = (item: LibraryItem, discipline: DisciplineCategory): boolean => {
    if (discipline === 'all') return true;
    const subj = item.subject.toLowerCase();
    const title = item.title.toLowerCase();
    const desc = (item.description || '').toLowerCase();

    if (discipline === 'Science') {
      return (
        subj.includes('physics') ||
        subj.includes('chemistry') ||
        subj.includes('biology') ||
        subj.includes('sayansi') ||
        title.includes('physics') ||
        title.includes('chemistry') ||
        title.includes('biology') ||
        title.includes('sayansi')
      );
    }
    if (discipline === 'Math') {
      return (
        subj.includes('math') ||
        subj.includes('hisabati') ||
        subj.includes('takwimu') ||
        title.includes('math') ||
        title.includes('hisabati')
      );
    }
    if (discipline === 'Language') {
      return (
        subj.includes('kiswahili') ||
        subj.includes('english') ||
        subj.includes('lugha') ||
        title.includes('language') ||
        title.includes('lugha') ||
        title.includes('english') ||
        title.includes('kiswahili')
      );
    }
    if (discipline === 'Literature') {
      return (
        subj.includes('fasihi') ||
        subj.includes('literature') ||
        title.includes('fasihi') ||
        title.includes('ushairi') ||
        title.includes('riwaya') ||
        title.includes('tamthili') ||
        title.includes('literature') ||
        desc.includes('riwaya') ||
        desc.includes('ushairi') ||
        desc.includes('fasihi')
      );
    }
    if (discipline === 'Social Studies') {
      return (
        subj.includes('geography') ||
        subj.includes('jiografia') ||
        subj.includes('history') ||
        subj.includes('historia') ||
        subj.includes('civics') ||
        subj.includes('uraia') ||
        subj.includes('general studies')
      );
    }
    if (discipline === 'Commercial') {
      return (
        subj.includes('commerce') ||
        subj.includes('bookkeeping') ||
        subj.includes('economics') ||
        subj.includes('uchumi') ||
        subj.includes('biashara')
      );
    }
    if (discipline === 'Technology') {
      return (
        subj.includes('computer') ||
        subj.includes('ict') ||
        subj.includes('tehama') ||
        subj.includes('program')
      );
    }
    return true;
  };

  // Real-time instant filtering
  const filteredBooks = books.filter((item) => {
    if (selectedLevel !== 'all' && item.level !== selectedLevel) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedDiscipline !== 'all' && !matchesDiscipline(item, selectedDiscipline)) return false;
    if (selectedSubject !== 'all' && item.subject.toLowerCase() !== selectedSubject.toLowerCase()) return false;
    if (onlySaved && !item.isSaved) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubject = item.subject.toLowerCase().includes(q);
      const matchAuthor = item.authorOrPublisher.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q) || false;
      const matchGrade = item.classGrade.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject && !matchAuthor && !matchDesc && !matchGrade && !matchCat) return false;
    }
    return true;
  });

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setUploadedFileSize(`${sizeMb} MB`);
      if (file.name.endsWith('.docx')) setNewFileFormat('DOCX');
      else if (file.name.endsWith('.epub')) setNewFileFormat('EPUB');
      else setNewFileFormat('PDF');
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Tafadhali andika jina au kichwa cha kitabu/mtihani.');
      return;
    }

    const pagesCount = parseInt(newPages) || 180;
    const newBook: Partial<LibraryItem> = {
      title: newTitle.trim(),
      category: newCategory,
      level: newLevel,
      classGrade: newClassGrade.trim() || 'Kidato cha 5 & 6',
      subject: newSubject,
      year: newYear ? parseInt(newYear) || 2025 : 2025,
      pages: pagesCount,
      readingProgress: 0,
      currentPage: 0,
      isDownloaded: false,
      authorOrPublisher: newAuthor.trim() || currentUser.name,
      fileFormat: newFileFormat,
      fileSize: uploadedFileSize || '5.2 MB',
      coverImage: newSubject === 'Physics'
        ? 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&auto=format&fit=crop&q=80'
        : newSubject === 'Chemistry'
        ? 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80'
        : newSubject === 'Biology'
        ? 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=400&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&auto=format&fit=crop&q=80',
      description: newDescription.trim() || `Nyenzo ya kimasomo ya ${newTitle.trim()} iliyopakiwa na mwanajumuiya wa EduKan.`,
      uploaderName: currentUser.name,
      uploaderRole: currentRole,
      uploaderSchool: currentUser.schoolName,
      downloadsCount: 1,
      createdAt: 'Sasa hivi'
    };

    onAddBook(newBook);
    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewAuthor('');
    setNewDescription('');
    setUploadedFileName(null);
    showToast('Hongera! Kitabu/Mtihani umepakiwa kikamilifu kwenye Maktaba ya Taifa! 📚 (+25 pts)');
  };

  const handleDownload = (book: LibraryItem) => {
    onDownloadBook(book.id);
    const totalPages = book.pages || 180;
    const current = progressMap[book.id];
    saveProgress(book.id, current?.currentPage || 0, totalPages, true);
    showToast(`Faili la "${book.title}" linapakuliwa... 📥 (+5 pts)`);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 right-5 z-50 bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-2 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-700/60 shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="inline-flex items-center gap-2 bg-emerald-700/80 backdrop-blur-xs text-emerald-100 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-600/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>MAKTABA YA TAIFA YA MITIHANI NA VITABU (TANZANIA)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>NECTA & TIE Official Archives</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
                Maktaba ya Vitabu & Mitihani (Library)
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                Kutana na vitabu vya kiada vya TIE, mitihani ya NECTA iliyotatuliwa, notisi fupi, na majaribio ya shule kwa makundi na madarasa yote kuanzia Msingi, O-Level, A-Level hadi Vyuo Vikuu. Pakua au pakia nyaraka zako!
              </p>
            </div>

            {/* Upload Button */}
            <div className="shrink-0 flex items-center gap-2">
              <button
                id="upload-book-btn"
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span>Pakia Kitabu / Mtihani</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ambient decorative element */}
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Dedicated View Mode Tabs: Maktaba Yote vs My Saved Resources */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="library-tab-all"
            type="button"
            onClick={() => setOnlySaved(false)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              !onlySaved
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Maktaba Yote (All Materials)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
              !onlySaved ? 'bg-emerald-800 text-emerald-100' : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300'
            }`}>
              {books.length}
            </span>
          </button>

          <button
            id="library-tab-saved"
            type="button"
            onClick={() => setOnlySaved(true)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              onlySaved
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${onlySaved ? 'fill-white' : 'text-amber-600'}`} />
            <span>Nyenzo Zangu Zilizohifadhiwa (Saved)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
              onlySaved ? 'bg-amber-700 text-amber-100' : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
            }`}>
              {books.filter(b => b.isSaved).length}
            </span>
          </button>
        </div>

        {onlySaved && (
          <span className="hidden md:inline-block text-xs text-amber-800 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-800">
            ⭐ Nyenzo zote ulizozihifadhi kwa ajili ya kujisomea
          </span>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-emerald-100 dark:border-slate-800 shadow-xs space-y-4">
        {/* Top Search & Filter Dropdown Row */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Real-Time Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="library-realtime-search"
              type="text"
              placeholder={
                onlySaved
                  ? "Tafuta kwenye nyenzo ulizohifadhi..."
                  : "Tafuta papo hapo: kitabu, mtihani wa NECTA, somo, mwandishi, mwaka..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-10 pr-9 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 p-1 cursor-pointer"
                title="Futa utafutaji"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Dropdown (Science, Math, Language, Literature, etc.) */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <select
                id="library-discipline-filter"
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value as DisciplineCategory)}
                className="text-xs bg-transparent font-semibold text-gray-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                {disciplineCategories.map((item) => (
                  <option key={item.id} value={item.id} className="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">
                    {item.icon} {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Specific Dropdown */}
            <select
              id="library-subject-dropdown"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs py-2.5 px-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-medium text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Somo Maalum (All)</option>
              {subjects.filter(s => s !== 'all').map((subj) => (
                <option key={subj} value={subj} className="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Level Filters (Darasa / Level) */}
        <div>
          <div className="text-[11px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Chagua Ngazi ya Darasa (Academic Level):</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            {levels.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedLevel === lvl.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-gray-50 dark:bg-slate-800 hover:bg-emerald-50/60 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-200/80 dark:border-slate-700'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Document Type Categories */}
        <div>
          <div className="text-[11px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Aina ya Nyaraka:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-teal-700 text-white font-bold shadow-xs'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Search Feedback & Count */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>Orodha ya Vitabu & Mitihani:</span>
          <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-mono text-[11px]">
            {filteredBooks.length} vimepatikana
          </span>
          {searchQuery && (
            <span className="text-[11px] text-gray-400 font-normal">
              kwa "{searchQuery}"
            </span>
          )}
        </div>

        {(selectedLevel !== 'all' ||
          selectedCategory !== 'all' ||
          selectedDiscipline !== 'all' ||
          selectedSubject !== 'all' ||
          searchQuery ||
          onlySaved) && (
          <button
            onClick={() => {
              setSelectedLevel('all');
              setSelectedCategory('all');
              setSelectedDiscipline('all');
              setSelectedSubject('all');
              setSearchQuery('');
              setOnlySaved(false);
            }}
            className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
          >
            Futa Vichungi Vyote
          </button>
        )}
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        onlySaved ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-amber-200/80 dark:border-amber-900/60 space-y-3 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
              <Bookmark className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm">Bado Hujaiwekea Alama Nyenzo Yoyote</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Hifadhi vitabu vya kiada, notisi, na mitihani ya NECTA kwa kubofya alama ya <span className="font-bold text-amber-700 dark:text-amber-400">alamisho (bookmark)</span> ili viweze kupatikana hapa kwa urahisi unapotaka kujisomea.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setOnlySaved(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Gundua Maktaba Yote Sasa
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-gray-200 dark:border-slate-800 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm">Hakuna kitabu au mtihani unaolingana na utafutaji wako</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
              Jaribu kubadilisha kategoria, darasa, au maneno ya utafutaji. Au kuwa wa kwanza kupakia nyenzo hii!
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Futa Neno la Utafutaji
                </button>
              )}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                + Pakia Kitabu au Mtihani Sasa
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((book) => {
            const totalPages = book.pages || 180;
            const progressInfo = progressMap[book.id] || {
              progress: book.readingProgress || 0,
              currentPage: book.currentPage || 0,
              totalPages,
              isDownloaded: !!book.isDownloaded
            };
            const pct = progressInfo.progress;
            const curPage = progressInfo.currentPage;

            return (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/90 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Book Header & Thumbnail */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    {/* Thumbnail with Quick View Trigger */}
                    <div
                      onClick={() => setQuickViewBook(book)}
                      className="w-18 h-24 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/60 overflow-hidden shrink-0 shadow-xs relative group-hover:scale-105 transition-transform cursor-pointer"
                      title="Bofya kuangalia kitabu hiki (Quick View)"
                    >
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400 p-1 text-center">
                          <BookOpen className="w-6 h-6 mb-1" />
                          <span className="text-[8px] font-bold uppercase">{book.subject}</span>
                        </div>
                      )}
                      <span className="absolute bottom-0 inset-x-0 bg-emerald-950/85 text-white text-[8px] font-mono text-center py-0.5 font-bold">
                        {book.fileFormat}
                      </span>
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                    </div>

                    {/* Book Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                          {book.level}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300">
                          {book.subject}
                        </span>
                      </div>

                      <h3
                        onClick={() => setQuickViewBook(book)}
                        className="text-xs sm:text-sm font-bold text-gray-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
                        title={book.title}
                      >
                        {book.title}
                      </h3>

                      <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                        <span>{book.classGrade}</span>
                        {book.year && <span>• {book.year}</span>}
                        <span>•</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {totalPages} Kurasa
                        </span>
                      </div>
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={() => onToggleSaveBook(book.id)}
                      className={`p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors shrink-0 ${
                        book.isSaved ? 'text-emerald-700 dark:text-emerald-400' : ''
                      }`}
                      title={book.isSaved ? 'Imehifadhiwa' : 'Hifadhi kwenye Alamisho'}
                    >
                      <Bookmark className={`w-4 h-4 ${book.isSaved ? 'fill-emerald-700 dark:fill-emerald-400' : ''}`} />
                    </button>
                  </div>

                  {/* Reading Progress Indicator */}
                  <div className="bg-gray-50/90 dark:bg-slate-800/60 rounded-xl p-2.5 border border-gray-100 dark:border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-semibold">
                        {pct === 100 ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Imekamilika (100%)</span>
                          </span>
                        ) : pct > 0 ? (
                          <span className="text-teal-700 dark:text-teal-300 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Inasomwa: Ukurasa {curPage} / {totalPages}</span>
                          </span>
                        ) : progressInfo.isDownloaded ? (
                          <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            <Download className="w-3.5 h-3.5" />
                            <span>Imepakuliwa • Anza Kusoma</span>
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-slate-400">
                            Hujaanza Kusoma ({totalPages} Kurasa)
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] font-bold text-gray-600 dark:text-slate-300">
                        {pct}%
                      </span>
                    </div>

                    {/* Progress Bar Track & Fill */}
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          pct === 100
                            ? 'bg-emerald-500'
                            : pct > 0
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : progressInfo.isDownloaded
                            ? 'bg-blue-400 w-2'
                            : 'bg-transparent'
                        }`}
                        style={{ width: `${Math.max(pct > 0 ? pct : 0, 0)}%` }}
                      />
                    </div>
                  </div>

                  {/* Description preview */}
                  {book.description && (
                    <p className="text-[11px] text-gray-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  )}

                  {/* Author / Publisher & File Info */}
                  <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-slate-400 pt-0.5">
                    <span className="truncate max-w-[150px]" title={book.authorOrPublisher}>
                      🏛️ {book.authorOrPublisher}
                    </span>
                    <span className="font-mono bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-gray-700 dark:text-slate-300">
                      {book.fileSize}
                    </span>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="px-4 py-3 bg-gray-50/90 dark:bg-slate-800/70 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                    <Download className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                    <span>{book.downloadsCount} wamepakua</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Quick View Button */}
                    <button
                      onClick={() => setQuickViewBook(book)}
                      className="px-2.5 py-1.5 text-xs text-gray-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors border border-gray-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
                      title="Fungua maelezo ya haraka ya kitabu hiki bila kutoka ukurasa huu"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>

                    {/* Direct Download Button */}
                    <button
                      onClick={() => handleDownload(book)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                      title="Pakua faili hili la kimasomo"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Pakua</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* QUICK VIEW MODAL (Displays full description, page count,  */}
      {/* larger cover image preview, and reading progress controls)*/}
      {/* ======================================================== */}
      {quickViewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs">
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-emerald-100 dark:border-slate-800 max-h-[92vh] overflow-y-auto space-y-5 animate-in zoom-in-95 text-gray-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  {quickViewBook.category}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300">
                  {quickViewBook.level}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white">
                  📄 {quickViewBook.pages || 180} Kurasa (Pages)
                </span>
              </div>
              <button
                onClick={() => setQuickViewBook(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                title="Funga Quick View"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Details Grid: Left Cover + Right Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
              {/* Larger Cover Image Preview */}
              <div className="sm:col-span-5 flex flex-col items-center">
                <div className="w-full aspect-3/4 max-w-[240px] rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 overflow-hidden shadow-md relative group">
                  {quickViewBook.coverImage ? (
                    <img
                      src={quickViewBook.coverImage}
                      alt={quickViewBook.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-emerald-700 dark:text-emerald-300 p-4 text-center">
                      <BookOpen className="w-12 h-12 mb-2 stroke-[1.5]" />
                      <span className="text-xs font-bold uppercase">{quickViewBook.subject}</span>
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 bg-emerald-950/90 text-white text-[10px] font-mono px-2 py-0.5 rounded-md font-bold shadow-xs">
                    {quickViewBook.fileFormat} • {quickViewBook.fileSize}
                  </span>
                </div>

                <div className="text-center mt-2.5 text-[11px] text-gray-500 dark:text-slate-400">
                  <span>📥 {quickViewBook.downloadsCount} wasomaji wamepakua</span>
                </div>
              </div>

              {/* Right: Title, Info, Full Description & Reading Progress */}
              <div className="sm:col-span-7 space-y-3.5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-slate-100 leading-snug">
                    {quickViewBook.title}
                  </h2>
                  <div className="text-xs text-gray-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                    <span>Darasa: {quickViewBook.classGrade}</span>
                    <span>•</span>
                    <span>Somo: {quickViewBook.subject}</span>
                    {quickViewBook.year && <span>• Mwaka: {quickViewBook.year}</span>}
                  </div>
                </div>

                {/* Key Meta Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <div>
                    <span className="text-gray-400 dark:text-slate-400 block text-[10px] uppercase font-bold">Mwandishi / Mchapishaji:</span>
                    <span className="font-semibold text-gray-800 dark:text-slate-200">{quickViewBook.authorOrPublisher}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 dark:text-slate-400 block text-[10px] uppercase font-bold">Jumla ya Kurasa:</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">{quickViewBook.pages || 180} Kurasa</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-gray-400 dark:text-slate-400 block text-[10px] uppercase font-bold">Imepakiwa na:</span>
                    <span className="font-medium text-emerald-800 dark:text-emerald-300">{quickViewBook.uploaderName}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-gray-400 dark:text-slate-400 block text-[10px] uppercase font-bold">Aina ya Nyenzo:</span>
                    <span className="font-medium text-gray-800 dark:text-slate-200">{quickViewBook.category}</span>
                  </div>
                </div>

                {/* Full Description Section (Without leaving the page) */}
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 text-xs text-gray-700 dark:text-slate-300 leading-relaxed">
                  <div className="font-bold text-gray-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Maelezo Kamili ya Kitabu (Full Description):</span>
                  </div>
                  <p className="whitespace-pre-line">{quickViewBook.description || 'Hakuna maelezo ya ziada yaliyowekwa kwa sasa.'}</p>
                </div>

                {/* Reading Progress Logger */}
                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>Rekodi Maendeleo Yako ya Kusoma:</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {Math.round((modalCurrentPage / (quickViewBook.pages || 180)) * 100)}%
                    </span>
                  </div>

                  {/* Range Slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={0}
                      max={quickViewBook.pages || 180}
                      value={modalCurrentPage}
                      onChange={(e) => setModalCurrentPage(parseInt(e.target.value) || 0)}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400">
                      <span>Ukurasa wa 0</span>
                      <span className="font-bold text-gray-800 dark:text-slate-200">
                        Ukurasa wa {modalCurrentPage} kati ya {quickViewBook.pages || 180}
                      </span>
                      <span>Mwisho ({quickViewBook.pages || 180})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={quickViewBook.pages || 180}
                        value={modalCurrentPage}
                        onChange={(e) => setModalCurrentPage(parseInt(e.target.value) || 0)}
                        className="w-16 p-1 text-center font-mono text-xs border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100"
                      />
                      <span className="text-[11px] text-gray-500">ukurasa uliofikia</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const totalPages = quickViewBook.pages || 180;
                        saveProgress(quickViewBook.id, modalCurrentPage, totalPages);
                        showToast(`Maendeleo ya kusoma yamehifadhiwa: Ukurasa ${modalCurrentPage}/${totalPages}! 📖`);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Hifadhi Kurasa</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Action Buttons Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onToggleSaveBook(quickViewBook.id);
                    setQuickViewBook({ ...quickViewBook, isSaved: !quickViewBook.isSaved });
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    quickViewBook.isSaved
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                      : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${quickViewBook.isSaved ? 'fill-emerald-700 dark:fill-emerald-400' : ''}`} />
                  <span>{quickViewBook.isSaved ? 'Imehifadhiwa' : 'Hifadhi Alamisho'}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast('Kiungo cha nyenzo hii kimenakiliwa! 📋');
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700"
                  title="Shiriki"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuickViewBook(null)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Funga
                </button>

                <button
                  onClick={() => {
                    handleDownload(quickViewBook);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Pakua Faili Sasa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Book / Exam Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-4 animate-in zoom-in-95 text-gray-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <Upload className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-slate-100 text-base">Pakia Kitabu au Mtihani</h3>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Changia nyenzo ya masomo kwa wanafunzi Tanzania nzima</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">
                  Kichwa cha Kitabu / Mtihani (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mfano: NECTA ACSEE Physics 2024 Solved Papers au TIE Biology Form 5"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Grid 1: Level & Class Grade */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Ngazi ya Elimu (Level) *</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as LibraryLevel)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-gray-900 dark:text-slate-100"
                  >
                    <option value="A-Level">A-Level (Form V - VI)</option>
                    <option value="O-Level">O-Level (Form I - IV)</option>
                    <option value="Chuo Kikuu">Chuo Kikuu & Vyuo</option>
                    <option value="Msingi">Shule ya Msingi (STD 1 - 7)</option>
                    <option value="Ualimu">Ualimu & Miongozo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Darasa Maalum (Grade)</label>
                  <input
                    type="text"
                    placeholder="Mfano: Kidato cha 6 au Mwaka wa 2"
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Grid 2: Category & Subject */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Aina ya Nyaraka *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as LibraryCategory)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-gray-900 dark:text-slate-100"
                  >
                    <option value="Vitabu vya Masomo">Vitabu vya Masomo (Textbooks)</option>
                    <option value="Mitihani ya NECTA">Mitihani ya NECTA (Past Papers)</option>
                    <option value="Notisi za Masomo">Notisi za Masomo (Summary)</option>
                    <option value="Majaribio ya Mock">Majaribio ya Mock (Mock Exams)</option>
                    <option value="Miongozo ya Walimu">Miongozo ya Walimu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Somo (Subject) *</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-gray-900 dark:text-slate-100"
                  >
                    {subjects.filter(s => s !== 'all').map((subj) => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid 3: Author, Year & Pages */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-1">
                  <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Mwandishi</label>
                  <input
                    type="text"
                    placeholder="TIE au NECTA"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-gray-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Mwaka</label>
                  <input
                    type="number"
                    placeholder="2025"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-gray-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Kurasa</label>
                  <input
                    type="number"
                    placeholder="180"
                    value={newPages}
                    onChange={(e) => setNewPages(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-gray-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">
                  Chagua Faili la Kitabu au Mtihani (PDF, DOCX, EPUB) *
                </label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-gray-50/50 dark:bg-slate-800/40">
                  <input
                    type="file"
                    accept=".pdf,.docx,.epub"
                    onChange={handleFileUploadSim}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                    <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    {uploadedFileName ? (
                      <div className="text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                        ✓ {uploadedFileName} ({uploadedFileSize})
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-gray-700 dark:text-slate-300">
                          Bofya au kokota faili hapa
                        </span>
                        <span className="text-[10px] text-gray-400">
                          PDF, DOCX au EPUB (Upeo 50 MB)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">
                  Maelezo Fupi ya Nyenzo (Description)
                </label>
                <textarea
                  rows={2}
                  placeholder="Eleza kirefu mada zilizomo, faida ya kitabu hiki, na muundo wa majibu..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 resize-none"
                />
              </div>

              {/* Form Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 font-medium transition-colors"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Pakia Kwenye Maktaba</span>
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
