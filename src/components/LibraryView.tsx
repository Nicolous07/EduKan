import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';
import { LibraryItem, LibraryLevel, LibraryCategory, UserProfile, UserRole } from '../types';

interface Props {
  books: LibraryItem[];
  currentUser: UserProfile;
  currentRole: UserRole;
  onAddBook: (book: Partial<LibraryItem>) => void;
  onDownloadBook: (bookId: string) => void;
  onToggleSaveBook: (bookId: string) => void;
}

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
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlySaved, setOnlySaved] = useState<boolean>(false);

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
  const [newFileFormat, setNewFileFormat] = useState<'PDF' | 'DOCX' | 'EPUB'>('PDF');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('4.5 MB');

  // Preview / Details modal
  const [previewBook, setPreviewBook] = useState<LibraryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Levels list
  const levels: { id: string; label: string; sub: string }[] = [
    { id: 'all', label: 'Ngazi Zote', sub: 'Vitabu Vyote' },
    { id: 'A-Level', label: 'A-Level (Form 5 & 6)', sub: 'Kidato V - VI' },
    { id: 'O-Level', label: 'O-Level (Form 1 - 4)', sub: 'Kidato I - IV' },
    { id: 'Chuo Kikuu', label: 'Vyuo Vikuu & Vyuo', sub: 'Higher Education' },
    { id: 'Msingi', label: 'Shule ya Msingi', sub: 'Darasa I - VII' },
    { id: 'Ualimu', label: 'Ualimu & Miongozo', sub: 'Teacher Guides' }
  ];

  // Categories list
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

  // Filter books
  const filteredBooks = books.filter((item) => {
    if (selectedLevel !== 'all' && item.level !== selectedLevel) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedSubject !== 'all' && item.subject.toLowerCase() !== selectedSubject.toLowerCase()) return false;
    if (onlySaved && !item.isSaved) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubject = item.subject.toLowerCase().includes(q);
      const matchAuthor = item.authorOrPublisher.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q) || false;
      const matchGrade = item.classGrade.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject && !matchAuthor && !matchDesc && !matchGrade) return false;
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

    const newBook: Partial<LibraryItem> = {
      title: newTitle.trim(),
      category: newCategory,
      level: newLevel,
      classGrade: newClassGrade.trim() || 'Kidato cha 5 & 6',
      subject: newSubject,
      year: newYear ? parseInt(newYear) || 2025 : 2025,
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

    // Create a real downloadable text/data file preview
    const blobContent = `=====================================================
EDUKAN TANZANIA - MAKTABA YA TAIFA YA MASOMO
=====================================================
Kichwa cha Kitabu / Mtihani: ${book.title}
Ngazi / Darasa: ${book.level} (${book.classGrade})
Somo: ${book.subject}
Mwaka: ${book.year || '2024'}
Mchapishaji / Baraza: ${book.authorOrPublisher}
Muundo wa Faili: ${book.fileFormat} (${book.fileSize})
Imepakiwa na: ${book.uploaderName} (${book.uploaderSchool || 'EduKan Network'})

MAELEZO:
${book.description || 'Hakuna maelezo ya ziada.'}

Hiki ni kifupisho rasmi kilichopakuliwa kutoka EduKan Tanzania.
Ili kupata nakala kamili iliyochapishwa, fika katika maktaba ya shule yako au mtandao rasmi wa TIE/NECTA.
=====================================================`;

    const blob = new Blob([blobContent], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}_EduKan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);

    showToast(`"${book.title.slice(0, 32)}..." limepakuliwa kwa mafanikio! (+5 pts)`);
  };

  return (
    <div className="space-y-5 pb-28 sm:pb-16">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-18 right-5 z-50 bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-2 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-emerald-700/60 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 backdrop-blur-xs text-emerald-200 text-xs px-3 py-1 rounded-full font-mono border border-emerald-700/60">
              <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
              <span>EDUKAN DIGITAL LIBRARY • MAKTABA YA TAIFA</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{books.length} Vitabu & Mitihani Imepakiwa</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
        <div className="flex items-center gap-2">
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
            <span>Nyenzo Zangu Zilizohifadhiwa (My Saved Resources)</span>
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-emerald-100 dark:border-slate-800 shadow-xs space-y-3.5">
        {/* Top Search Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={onlySaved ? "Tafuta kwenye nyenzo zako ulizohifadhi..." : "Tafuta kitabu, mtihani wa NECTA, somo, mwandishi, au mwaka..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-10 pr-9 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Subject Dropdown */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs py-2.5 px-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-medium text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Masomo Yote</option>
              {subjects.filter(s => s !== 'all').map((subj) => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Level Filters (Darasa / Level) */}
        <div>
          <div className="text-[11px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Chagua Ngazi ya Darasa (Class & Academic Level):</span>
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

        {/* Category Filters (Aina ya Nyaraka) */}
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

      {/* Books Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>Orodha ya Vitabu & Mitihani ({filteredBooks.length}):</span>
          </div>
          {(selectedLevel !== 'all' || selectedCategory !== 'all' || selectedSubject !== 'all' || searchQuery || onlySaved) && (
            <button
              onClick={() => {
                setSelectedLevel('all');
                setSelectedCategory('all');
                setSelectedSubject('all');
                setSearchQuery('');
                setOnlySaved(false);
              }}
              className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
            >
              Futa Vichungi Vyote
            </button>
          )}
        </div>

        {filteredBooks.length === 0 ? (
          onlySaved ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-amber-200/80 dark:border-amber-900/60 space-y-3 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
                <Bookmark className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm">Bado Hujaiwekea Alama (Bookmark) Nyenzo Yoyote</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Hifadhi vitabu vya kiada, notisi, na mitihani ya NECTA kwa kubofya alama ya <span className="font-bold text-amber-700 dark:text-amber-400">alama-kitabu (bookmark)</span> kwenye nyenzo yoyote ili iweze kupatikana hapa kwa urahisi unapotaka kujisomea.
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
                Jaribu kubadilisha darasa, kategoria, au maneno ya utafutaji. Au kuwa wa kwanza kupakia mtihani/kitabu hiki!
              </p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                + Pakia Kitabu au Mtihani Sasa
              </button>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/90 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Book Header & Thumbnail */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-20 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/60 overflow-hidden shrink-0 shadow-xs relative group-hover:scale-105 transition-transform">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400 p-1 text-center">
                          <BookOpen className="w-5 h-5 mb-1" />
                          <span className="text-[8px] font-bold uppercase">{book.subject}</span>
                        </div>
                      )}
                      <span className="absolute bottom-0 inset-x-0 bg-emerald-900/80 text-white text-[8px] font-mono text-center py-0.5 font-bold">
                        {book.fileFormat}
                      </span>
                    </div>

                    {/* Book Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                          {book.level}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300">
                          {book.subject}
                        </span>
                      </div>

                      <h3
                        onClick={() => setPreviewBook(book)}
                        className="text-xs sm:text-sm font-bold text-gray-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
                        title={book.title}
                      >
                        {book.title}
                      </h3>

                      <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-1 truncate">
                        <span>{book.classGrade}</span>
                        {book.year && <span>• {book.year}</span>}
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

                  {/* Description preview */}
                  {book.description && (
                    <p className="text-[11px] text-gray-600 dark:text-slate-300 line-clamp-2 leading-relaxed bg-gray-50/70 dark:bg-slate-800/60 p-2 rounded-xl border border-gray-100 dark:border-slate-800">
                      {book.description}
                    </p>
                  )}

                  {/* Author / Publisher & File Info */}
                  <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-slate-400 pt-1">
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
                    <button
                      onClick={() => setPreviewBook(book)}
                      className="px-2.5 py-1 text-xs text-gray-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg font-medium transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-600"
                    >
                      Angalia
                    </button>

                    <button
                      onClick={() => handleDownload(book)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Pakua</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

              {/* Grid 3: Author & Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Mwandishi / Taasisi</label>
                  <input
                    type="text"
                    placeholder="Mfano: TIE, NECTA, Mwl. Dennis Lyimo"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Mwaka (Year)</label>
                  <input
                    type="number"
                    placeholder="2025"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">
                  Chagua Faili la Kitabu au Mtihani (PDF, DOCX, EPUB) *
                </label>
                <div className="border-2 border-dashed border-emerald-300/80 dark:border-emerald-700/80 bg-emerald-50/40 dark:bg-emerald-950/30 rounded-2xl p-4 text-center hover:bg-emerald-50/80 dark:hover:bg-emerald-950/50 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.epub"
                    onChange={handleFileUploadSim}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                      <Upload className="w-4 h-4" />
                    </div>
                    {uploadedFileName ? (
                      <div>
                        <span className="font-bold text-emerald-900 dark:text-emerald-200 block truncate max-w-xs">{uploadedFileName}</span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Ukubwa: {uploadedFileSize} ({newFileFormat})</span>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-emerald-900 dark:text-emerald-200">Bofya hapa kuchagua faili au buruta hapa</span>
                        <span className="text-[10px] text-gray-500 dark:text-slate-400">Inasaidia PDF, Word (DOCX), na Vitabu vya EPUB</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-slate-300 mb-1">Maelezo Mafupi (Description)</label>
                <textarea
                  rows={2}
                  placeholder="Eleza kwa ufupi mada zilizopo, mwaka wa mtihani, au maelekezo muhimu kwa wasomaji..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none resize-none text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
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

      {/* Preview Details Modal */}
      {previewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 text-gray-900 dark:text-slate-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  {previewBook.category}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300">
                  {previewBook.level}
                </span>
              </div>
              <button
                onClick={() => setPreviewBook(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-slate-100 leading-snug">
                {previewBook.title}
              </h2>
              <div className="text-xs text-gray-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                <span>Darasa: {previewBook.classGrade}</span>
                <span>•</span>
                <span>Somo: {previewBook.subject}</span>
                {previewBook.year && <span>• Mwaka: {previewBook.year}</span>}
              </div>
            </div>

            {previewBook.description && (
              <div className="bg-gray-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-700/80 text-xs text-gray-700 dark:text-slate-300 leading-relaxed">
                <div className="font-bold text-gray-900 dark:text-slate-100 mb-1">Maelezo ya Kitabu:</div>
                <p>{previewBook.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-slate-300 bg-emerald-50/50 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
              <div>
                <span className="text-gray-400 dark:text-slate-400 block text-[10px] uppercase font-bold">Mwandishi / Taasisi:</span>
                <span className="font-semibold text-gray-800 dark:text-slate-200">{previewBook.authorOrPublisher}</span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-slate-400 block text-[10px] uppercase font-bold">Faili:</span>
                <span className="font-semibold text-gray-800 dark:text-slate-200">{previewBook.fileFormat} • {previewBook.fileSize}</span>
              </div>
              <div className="mt-1">
                <span className="text-gray-400 dark:text-slate-400 block text-[10px] uppercase font-bold">Imepakiwa na:</span>
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">{previewBook.uploaderName}</span>
              </div>
              <div className="mt-1">
                <span className="text-gray-400 dark:text-slate-400 block text-[10px] uppercase font-bold">Waliopakua:</span>
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">{previewBook.downloadsCount} wasomaji</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  onToggleSaveBook(previewBook.id);
                  setPreviewBook({ ...previewBook, isSaved: !previewBook.isSaved });
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  previewBook.isSaved
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${previewBook.isSaved ? 'fill-emerald-700 dark:fill-emerald-400' : ''}`} />
                <span>{previewBook.isSaved ? 'Imehifadhiwa' : 'Hifadhi'}</span>
              </button>

              <button
                onClick={() => {
                  handleDownload(previewBook);
                  setPreviewBook(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Pakua Faili Sasa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
