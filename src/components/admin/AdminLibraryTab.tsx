import React, { useState, useRef } from 'react';
import {
  Library,
  Search,
  CheckCircle2,
  Trash2,
  Plus,
  FileText,
  Download,
  Calendar,
  Layers,
  GraduationCap,
  X,
  BookOpen,
  Filter,
  Edit3,
  Upload,
  Paperclip
} from 'lucide-react';
import { LibraryItem, LibraryLevel, LibraryCategory, UserProfile } from '../../types';

interface Props {
  books: LibraryItem[];
  currentUser: UserProfile;
  onVerifyBook?: (id: string) => void;
  onDeleteBook?: (id: string) => void;
  onAddBook?: (book: Partial<LibraryItem>) => void;
  onEditBook?: (id: string, updated: Partial<LibraryItem>) => void;
  onTriggerFeedback: (msg: string) => void;
  onAddAuditLog: (action: string, target: string, type: 'content' | 'school' | 'user' | 'broadcast' | 'system') => void;
}

export const AdminLibraryTab: React.FC<Props> = ({
  books,
  currentUser,
  onVerifyBook,
  onDeleteBook,
  onAddBook,
  onEditBook,
  onTriggerFeedback,
  onAddAuditLog
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified' | 'Mitihani ya NECTA' | 'Vitabu vya Masomo' | 'Notisi za Masomo'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<LibraryItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editLevel, setEditLevel] = useState<LibraryLevel>('O-Level');
  const [editCategory, setEditCategory] = useState<LibraryCategory>('Mitihani ya NECTA');
  const [editDescription, setEditDescription] = useState('');
  const [editVerified, setEditVerified] = useState(false);
  const [editDownloadUrl, setEditDownloadUrl] = useState('');
  const [editAttachedFile, setEditAttachedFile] = useState<{ name: string; size: string; dataUrl: string } | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // New Book Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [level, setLevel] = useState<LibraryLevel>('O-Level');
  const [category, setCategory] = useState<LibraryCategory>('Mitihani ya NECTA');
  const [classGrade, setClassGrade] = useState('Kidato cha 4');
  const [year, setYear] = useState('2024');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [pages, setPages] = useState('14');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; dataUrl: string } | null>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setAttachedFile({
        name: file.name,
        size: sizeStr,
        dataUrl: res
      });
      if (!title.trim()) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setEditAttachedFile({
        name: file.name,
        size: sizeStr,
        dataUrl: res
      });
    };
    reader.readAsDataURL(file);
  };

  const startEditBook = (book: LibraryItem) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditSubject(book.subject);
    setEditLevel(book.level);
    setEditCategory(book.category);
    setEditDescription(book.description || '');
    setEditVerified(!!book.verified);
    setEditDownloadUrl(book.downloadUrl || '');
    setEditAttachedFile(null);
  };

  const handleSaveEditBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook || !editTitle.trim()) return;

    if (onEditBook) {
      onEditBook(editingBook.id, {
        title: editTitle.trim(),
        subject: editSubject,
        level: editLevel,
        category: editCategory,
        description: editDescription.trim(),
        verified: editVerified,
        downloadUrl: editAttachedFile ? editAttachedFile.dataUrl : (editDownloadUrl.trim() || editingBook.downloadUrl),
        fileSize: editAttachedFile ? editAttachedFile.size : editingBook.fileSize
      });
    }

    onAddAuditLog('Imehariri Kitabu/Mtihani', editTitle.trim(), 'content');
    onTriggerFeedback(`Kitabu "${editTitle.trim()}" kimesasishwa kwa mafanikio!`);
    setEditingBook(null);
  };

  const filteredBooks = books.filter(book => {
    if (filter === 'verified' && !book.verified) return false;
    if (filter === 'unverified' && book.verified) return false;
    if (filter === 'Mitihani ya NECTA' && book.category !== 'Mitihani ya NECTA') return false;
    if (filter === 'Vitabu vya Masomo' && book.category !== 'Vitabu vya Masomo') return false;
    if (filter === 'Notisi za Masomo' && book.category !== 'Notisi za Masomo') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        book.title.toLowerCase().includes(q) ||
        book.subject.toLowerCase().includes(q) ||
        book.level.toLowerCase().includes(q) ||
        (book.uploaderName && book.uploaderName.toLowerCase().includes(q)) ||
        (book.authorOrPublisher && book.authorOrPublisher.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateOfficialBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newBook: Partial<LibraryItem> = {
      title: title.trim(),
      subject,
      level,
      category,
      classGrade,
      year: year.trim() || undefined,
      pages: parseInt(pages) || 12,
      fileSize: attachedFile ? attachedFile.size : '4.2 MB',
      downloadUrl: attachedFile ? attachedFile.dataUrl : (downloadUrl.trim() || 'https://www.necta.go.tz'),
      authorOrPublisher: 'TIE / Baraza la Mitihani la Tanzania (NECTA)',
      description: description.trim() || `Nyenzo rasmi ya kitaaluma kwa kidato cha ${classGrade} (${level}) iliyothibitishwa na Msimamizi wa EduKan.`,
      verified: true
    };

    if (onAddBook) {
      onAddBook(newBook);
    }

    onAddAuditLog('Imechapisha Kitabu/Mtihani Rasmi', title.trim(), 'content');
    onTriggerFeedback(`"${title.trim()}" limechapishwa kwenye Maktaba ya Taifa! 📚`);

    setTitle('');
    setDescription('');
    setDownloadUrl('');
    setAttachedFile(null);
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
            <Library className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <span>Usimamizi wa Maktaba ya Kitaifa na Mitihani ({books.length})</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Kagua mitihani na vitabu vilivyopakiwa, thibitisha usahihi wa notisi za TIE/NECTA, au ondoa maudhui yasiyofaa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Tafuta mtihani au kitabu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden xs:inline">Pakia Rasmi (+)</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
            filter === 'all'
              ? 'bg-emerald-800 dark:bg-emerald-700 text-white font-semibold shadow-xs'
              : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
          }`}
        >
          Yote ({books.length})
        </button>

        <button
          onClick={() => setFilter('unverified')}
          className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
            filter === 'unverified'
              ? 'bg-amber-600 text-white font-semibold shadow-xs'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/70 border border-amber-200 dark:border-amber-800'
          }`}
        >
          <span>Yanasubiri Uhakiki ⏳</span>
          <span className="bg-white/30 text-xs px-1.5 rounded-full font-bold">
            {books.filter(b => !b.verified).length}
          </span>
        </button>

        <button
          onClick={() => setFilter('verified')}
          className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
            filter === 'verified'
              ? 'bg-emerald-800 dark:bg-emerald-700 text-white font-semibold shadow-xs'
              : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
          }`}
        >
          Yaliyoidhinishwa ✓ ({books.filter(b => b.verified).length})
        </button>

        <button
          onClick={() => setFilter('Mitihani ya NECTA')}
          className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
            filter === 'Mitihani ya NECTA'
              ? 'bg-emerald-800 dark:bg-emerald-700 text-white font-semibold shadow-xs'
              : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
          }`}
        >
          Mitihani ya NECTA
        </button>

        <button
          onClick={() => setFilter('Vitabu vya Masomo')}
          className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
            filter === 'Vitabu vya Masomo'
              ? 'bg-emerald-800 dark:bg-emerald-700 text-white font-semibold shadow-xs'
              : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
          }`}
        >
          Vitabu vya TIE / Masomo
        </button>

        <button
          onClick={() => setFilter('Notisi za Masomo')}
          className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
            filter === 'Notisi za Masomo'
              ? 'bg-emerald-800 dark:bg-emerald-700 text-white font-semibold shadow-xs'
              : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
          }`}
        >
          Notisi za Walimu
        </button>
      </div>

      {/* Books List / Table */}
      <div className="space-y-2.5 pt-1">
        {filteredBooks.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 dark:bg-slate-800/60 rounded-2xl text-gray-500 dark:text-slate-400 text-xs border border-gray-200 dark:border-slate-800">
            Hakuna vitabu au mitihani inayolingana na kichujio hiki.
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                !book.verified
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 ring-1 ring-amber-200 dark:ring-amber-900'
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800">
                  <FileText className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white font-heading">
                      {book.title}
                    </h4>
                    {book.verified ? (
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.2 rounded-md flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                        Imethibitishwa
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold px-2 py-0.2 rounded-md animate-pulse border border-amber-200 dark:border-amber-800">
                        Inasubiri Uhakiki
                      </span>
                    )}
                    <span className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-0.2 rounded-md font-medium border border-gray-200 dark:border-slate-700">
                      {book.level} • {book.subject}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 line-clamp-2">
                    {book.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-slate-400 mt-1.5 flex-wrap">
                    <span>Mwandishi/Mchapishaji: <strong className="text-gray-700 dark:text-slate-200">{book.authorOrPublisher || book.uploaderName}</strong></span>
                    <span>•</span>
                    <span>Ukubwa: {book.fileSize} ({book.pages || 14} kurasa)</span>
                    {book.year && (
                      <>
                        <span>•</span>
                        <span>Mwaka: {book.year}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>Pakua: {book.downloadsCount}</span>
                  </div>
                </div>
              </div>

              {/* Admin Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
                <button
                  onClick={() => startEditBook(book)}
                  className="p-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 transition-colors cursor-pointer border border-blue-200 dark:border-blue-800"
                  title="Hariri Kitabu / Taarifa"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {onVerifyBook && (
                  <button
                    onClick={() => {
                      onVerifyBook(book.id);
                      onAddAuditLog(
                        book.verified ? 'Imeondoa Uthibitisho wa Kitabu' : 'Imethibitisha Kitabu/Mtihani Rasmi',
                        book.title,
                        'content'
                      );
                      onTriggerFeedback(`Hadhi ya "${book.title}" imesasishwa!`);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      book.verified
                        ? 'bg-gray-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-gray-700 dark:text-slate-300 hover:text-amber-900 border border-gray-200 dark:border-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{book.verified ? 'Batilisha' : 'Thibitisha ✓'}</span>
                  </button>
                )}

                {onDeleteBook && (
                  <button
                    onClick={() => {
                      onDeleteBook(book.id);
                      onAddAuditLog('Imefuta Kitabu/Mtihani', book.title, 'content');
                      onTriggerFeedback(`"${book.title}" limefutwa kwenye Maktaba.`);
                    }}
                    className="p-2 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-300 transition-colors cursor-pointer border border-red-200 dark:border-red-800"
                    title="Futa Kitabu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Publish Official Book / NECTA Exam with Dedicated Upload Button */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col text-gray-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50 dark:bg-slate-800/80 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <Library className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm font-heading">
                  Chapisha Mtihani au Kitabu Rasmi (TIE/NECTA)
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOfficialBook} className="p-6 space-y-3.5 text-xs overflow-y-auto">
              {/* Dedicated Upload Button Section */}
              <div className="p-3.5 bg-emerald-50/60 dark:bg-slate-800/70 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>Pakia Faili Moja kwa Moja (Upload Document / PDF):</span>
                  </div>
                  <input
                    type="file"
                    ref={addFileInputRef}
                    onChange={handleAddFileUpload}
                    accept=".pdf,.doc,.docx,.epub,image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => addFileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Chagua Faili (+)</span>
                  </button>
                </div>

                {attachedFile ? (
                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="font-semibold text-gray-900 dark:text-white truncate">{attachedFile.name}</span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                        {attachedFile.size}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded-full cursor-pointer ml-2"
                      title="Ondoa faili hili"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-600 dark:text-slate-400">
                    Bofya kitufe cha <strong>Chagua Faili (+)</strong> kupakia PDF ya mtihani, kitabu au notisi kutoka kwenye kompyuta/simu yako.
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Kichwa cha Kitabu / Mtihani:</label>
                <input
                  type="text"
                  placeholder="Mfano: NECTA CSEE 2023 - Basic Mathematics Paper 1 na Majibu"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Somo (Subject):</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Civics', 'Kiswahili', 'English', 'Commerce', 'Bookkeeping'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Ngazi ya Elimu:</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="O-Level">O-Level (Kidato 1 - 4)</option>
                    <option value="A-Level">A-Level (Kidato 5 - 6)</option>
                    <option value="Chuo Kikuu">Chuo Kikuu / Vyuo</option>
                    <option value="Msingi">Shule ya Msingi</option>
                    <option value="Ualimu">Vyuo vya Ualimu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Aina ya Nyenzo:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Mitihani ya NECTA">Mitihani ya NECTA / Mock</option>
                    <option value="Vitabu vya Masomo">Vitabu vya Masomo (TIE)</option>
                    <option value="Notisi za Masomo">Notisi za Masomo</option>
                    <option value="Majaribio ya Mock">Majaribio ya Mock</option>
                    <option value="Miongozo ya Walimu">Miongozo ya Walimu</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Mwaka:</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="2024"
                  />
                </div>
              </div>

              {!attachedFile && (
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Au Kiungo cha Faili (PDF URL):</label>
                  <input
                    type="url"
                    placeholder="https://edukan.tz/resources/necta-2023-math.pdf"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Maelezo Mafupi:</label>
                <textarea
                  rows={2}
                  placeholder="Eleza nini kilichomo ndani ya mtihani au kitabu hiki..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Chapisha Mtihani</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Book / Past Paper */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col text-gray-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-blue-50 dark:bg-slate-800/80 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm font-heading">
                    Hariri Taarifa za Kitabu / Mtihani
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Mabadiliko yatasasishwa mara moja kwenye Maktaba</p>
                </div>
              </div>
              <button
                onClick={() => setEditingBook(null)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBook} className="p-6 space-y-4 text-xs overflow-y-auto">
              {/* File upload in edit */}
              <div className="p-3 bg-blue-50/50 dark:bg-slate-800/60 border border-blue-200 dark:border-blue-900 rounded-xl">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-gray-700 dark:text-slate-300">Sasisha Faili (Badilisha PDF/Document):</span>
                  <input
                    type="file"
                    ref={editFileInputRef}
                    onChange={handleEditFileUpload}
                    accept=".pdf,.doc,.docx,image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Pakia Faili Jipya</span>
                  </button>
                </div>
                {editAttachedFile && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Faili jipya limechaguliwa: {editAttachedFile.name} ({editAttachedFile.size})
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Jina Kamili la Kitabu / Mtihani</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Somo</label>
                  <input
                    type="text"
                    required
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Ngazi (Level)</label>
                  <select
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value as LibraryLevel)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white text-xs"
                  >
                    <option value="O-Level">O-Level (Kidato 1-4)</option>
                    <option value="A-Level">A-Level (Kidato 5-6)</option>
                    <option value="Chuo Kikuu">Chuo Kikuu</option>
                    <option value="Msingi">Msingi</option>
                    <option value="Ualimu">Ualimu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Aina ya Maudhui (Category)</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as LibraryCategory)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white text-xs"
                >
                  <option value="Mitihani ya NECTA">Mitihani ya NECTA</option>
                  <option value="Vitabu vya Masomo">Vitabu vya Masomo</option>
                  <option value="Notisi za Masomo">Notisi za Masomo</option>
                  <option value="Majaribio ya Mock">Majaribio ya Mock</option>
                  <option value="Miongozo ya Walimu">Miongozo ya Walimu</option>
                  <option value="Tafiti & Makala">Tafiti & Makala</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Maelezo Mafupi (Description)</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white text-xs resize-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <input
                  type="checkbox"
                  id="editVerifiedCheck"
                  checked={editVerified}
                  onChange={(e) => setEditVerified(e.target.checked)}
                  className="rounded text-emerald-700 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="editVerifiedCheck" className="text-xs font-bold text-emerald-950 dark:text-emerald-300 cursor-pointer">
                  Weka Tiki ya Usahihi (Verified Official Tag)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Hifadhi Mabadiliko</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
