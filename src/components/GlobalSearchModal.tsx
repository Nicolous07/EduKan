import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  School,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Library,
  MessageSquare
} from 'lucide-react';
import { SchoolCommunity, OpportunityItem, QuestionItem, LibraryItem, Post } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  schools: SchoolCommunity[];
  opportunities: OpportunityItem[];
  questions: QuestionItem[];
  libraryBooks?: LibraryItem[];
  posts?: Post[];
  onSelectTab: (tab: string) => void;
}

type FilterCategory = 'all' | 'schools' | 'questions' | 'opportunities' | 'library' | 'posts';

const SUGGESTED_SEARCHES = [
  'Physics',
  'Tabora Boys',
  'NECTA Past Papers',
  'Scholarship za Uturuki',
  'Ilboru',
  'Advanced Mathematics',
  'Vyuo Vikuu Tanzania'
];

export const GlobalSearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  schools = [],
  opportunities = [],
  questions = [],
  libraryBooks = [],
  posts = [],
  onSelectTab
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input whenever opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setActiveCategory('all');
    }
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredSchools = schools.filter(s => {
    if (!s) return false;
    const name = (s.name || '').toLowerCase();
    const region = (s.region || '').toLowerCase();
    const cat = (s.category || '').toLowerCase();
    const district = (s.district || '').toLowerCase();
    return name.includes(q) || region.includes(q) || cat.includes(q) || district.includes(q);
  });

  const filteredQuestions = questions.filter(question => {
    if (!question) return false;
    const title = (question.title || '').toLowerCase();
    const subject = (question.subject || '').toLowerCase();
    const content = (question.content || '').toLowerCase();
    const topic = (question.topic || '').toLowerCase();
    return title.includes(q) || subject.includes(q) || content.includes(q) || topic.includes(q);
  });

  const filteredOpps = opportunities.filter(o => {
    if (!o) return false;
    const title = (o.title || '').toLowerCase();
    const organizer = (o.organizer || (o as any).organization || '').toLowerCase();
    const cat = (o.category || '').toLowerCase();
    const desc = (o.description || '').toLowerCase();
    return title.includes(q) || organizer.includes(q) || cat.includes(q) || desc.includes(q);
  });

  const filteredBooks = libraryBooks.filter(b => {
    if (!b) return false;
    const title = (b.title || '').toLowerCase();
    const subject = (b.subject || '').toLowerCase();
    const author = (b.authorOrPublisher || '').toLowerCase();
    const desc = (b.description || '').toLowerCase();
    const grade = (b.classGrade || '').toLowerCase();
    return title.includes(q) || subject.includes(q) || author.includes(q) || desc.includes(q) || grade.includes(q);
  });

  const filteredPosts = posts.filter(p => {
    if (!p) return false;
    const content = (p.content || '').toLowerCase();
    const authorName = (p.author?.name || '').toLowerCase();
    const subject = (p.subject || '').toLowerCase();
    const school = (p.author?.school || '').toLowerCase();
    return content.includes(q) || authorName.includes(q) || subject.includes(q) || school.includes(q);
  });

  const totalResults =
    (activeCategory === 'all' || activeCategory === 'schools' ? filteredSchools.length : 0) +
    (activeCategory === 'all' || activeCategory === 'questions' ? filteredQuestions.length : 0) +
    (activeCategory === 'all' || activeCategory === 'opportunities' ? filteredOpps.length : 0) +
    (activeCategory === 'all' || activeCategory === 'library' ? filteredBooks.length : 0) +
    (activeCategory === 'all' || activeCategory === 'posts' ? filteredPosts.length : 0);

  const handleSelectItem = (tab: string) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <div
      id="instant-search-spotlight-overlay"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-start justify-center pt-8 sm:pt-14 px-3 sm:px-4 pointer-events-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="instant-search-palette"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh] text-gray-900 dark:text-slate-100"
      >
        {/* Top Search Input Bar */}
        <div className="relative px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3 bg-gradient-to-r from-emerald-50/40 via-white to-teal-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
            <Search className="w-5 h-5 stroke-[2.5]" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tafuta shule, vitabu, maswali, scholarships, mada..."
            className="flex-1 text-sm sm:text-base font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 bg-transparent focus:outline-none"
            aria-label="Tafuta kwenye mfumo wa EduKan"
          />

          {query.length > 0 && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Futa utafutaji"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5 shrink-0 pl-1 border-l border-gray-200 dark:border-slate-700">
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-gray-400 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md uppercase font-mono">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Funga utafutaji"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-gray-50/90 dark:bg-slate-800/80 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-xl font-semibold transition-all shrink-0 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            Vyote {q.length > 0 && `(${totalResults})`}
          </button>
          <button
            onClick={() => setActiveCategory('library')}
            className={`px-3 py-1 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'library'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            <span>Maktaba & Mitihani</span>
            {q.length > 0 && <span className="text-[10px] opacity-80 font-mono">({filteredBooks.length})</span>}
          </button>
          <button
            onClick={() => setActiveCategory('questions')}
            className={`px-3 py-1 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'questions'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Maswali ya Masomo</span>
            {q.length > 0 && <span className="text-[10px] opacity-80 font-mono">({filteredQuestions.length})</span>}
          </button>
          <button
            onClick={() => setActiveCategory('opportunities')}
            className={`px-3 py-1 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'opportunities'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fursa & Scholarships</span>
            {q.length > 0 && <span className="text-[10px] opacity-80 font-mono">({filteredOpps.length})</span>}
          </button>
          <button
            onClick={() => setActiveCategory('schools')}
            className={`px-3 py-1 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'schools'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>Shule & Vyuo</span>
            {q.length > 0 && <span className="text-[10px] opacity-80 font-mono">({filteredSchools.length})</span>}
          </button>
          <button
            onClick={() => setActiveCategory('posts')}
            className={`px-3 py-1 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'posts'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Machapisho</span>
            {q.length > 0 && <span className="text-[10px] opacity-80 font-mono">({filteredPosts.length})</span>}
          </button>
        </div>

        {/* Search Content / Results */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* If query is empty, show instant trending tags */}
          {q.length === 0 ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Mada Zinazotafutwa Zaidi Leo</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_SEARCHES.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setQuery(item);
                        inputRef.current?.focus();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-800 dark:hover:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-700 border border-gray-200 dark:border-slate-700 text-xs text-gray-700 dark:text-slate-300 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Clock className="w-3 h-3 text-gray-400 dark:text-slate-500" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Jump Shortcuts */}
              <div className="pt-2">
                <div className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  Kuruka Haraka Kwenye Sehemu
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div
                    onClick={() => handleSelectItem('library')}
                    className="p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 cursor-pointer transition-all flex items-center gap-3 shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Library className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">Maktaba ya Taifa</div>
                      <div className="text-[10px] text-gray-500 dark:text-slate-400">{libraryBooks.length} Vitabu & Mitihani</div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleSelectItem('study')}
                    className="p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 cursor-pointer transition-all flex items-center gap-3 shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">Vyumba vya Masomo</div>
                      <div className="text-[10px] text-gray-500 dark:text-slate-400">{questions.length} Maswali & Majadiliano</div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleSelectItem('opportunities')}
                    className="p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl hover:border-amber-400 hover:bg-amber-50/40 dark:hover:bg-amber-950/30 cursor-pointer transition-all flex items-center gap-3 shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">Fursa & Scholarships</div>
                      <div className="text-[10px] text-gray-500 dark:text-slate-400">{opportunities.length} Nafasi Zilizopo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : totalResults === 0 ? (
            /* Empty state when no matches */
            <div className="py-10 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-800 dark:text-slate-200">Hakuna kilichopatikana kwa &quot;{query}&quot;</h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
                Hakikisha herufi zimeandikwa vizuri, au jaribu maneno mepesi kama &quot;Physics&quot;, &quot;Tabora&quot;, au &quot;Scholarship&quot;.
              </p>
            </div>
          ) : (
            /* Results listing */
            <div className="space-y-4">
              {/* Library Books Results */}
              {(activeCategory === 'all' || activeCategory === 'library') && filteredBooks.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Maktaba & Mitihani ({filteredBooks.length})</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">Bonyeza kutazama na kupakua</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredBooks.slice(0, 5).map((book) => (
                      <div
                        key={book.id}
                        onClick={() => handleSelectItem('library')}
                        className="p-2.5 sm:p-3 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/90 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Library className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{book.title}</span>
                              <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded font-mono shrink-0">
                                {book.fileFormat || 'PDF'}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-slate-400 flex items-center gap-2 truncate">
                              <span className="font-semibold text-emerald-700 dark:text-emerald-400">{book.subject}</span>
                              <span>•</span>
                              <span>{book.level} ({book.classGrade})</span>
                              <span>•</span>
                              <span>{book.authorOrPublisher}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions Results */}
              {(activeCategory === 'all' || activeCategory === 'questions') && filteredQuestions.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Maswali ya Masomo ({filteredQuestions.length})</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">Mada na majibu ya wanafunzi</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredQuestions.slice(0, 5).map((qItem) => (
                      <div
                        key={qItem.id}
                        onClick={() => handleSelectItem('study')}
                        className="p-2.5 sm:p-3 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/90 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-gray-900 dark:text-white truncate">{qItem.title}</div>
                            <div className="text-[10px] text-gray-500 dark:text-slate-400 flex items-center gap-2 truncate">
                              <span className="font-semibold text-blue-700 dark:text-blue-400">{qItem.subject}</span>
                              <span>•</span>
                              <span>{qItem.author?.name || 'Mwanafunzi'}</span>
                              <span>•</span>
                              <span>{qItem.answers?.length || 0} Majibu</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-700 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opportunities Results */}
              {(activeCategory === 'all' || activeCategory === 'opportunities') && filteredOpps.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Fursa & Scholarships ({filteredOpps.length})</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">Nafasi za masomo & ajira</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredOpps.slice(0, 5).map((opp) => (
                      <div
                        key={opp.id}
                        onClick={() => handleSelectItem('opportunities')}
                        className="p-2.5 sm:p-3 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/90 hover:border-amber-300 dark:hover:border-amber-600 hover:bg-amber-50/50 dark:hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-gray-900 dark:text-white truncate">{opp.title}</div>
                            <div className="text-[10px] text-gray-500 dark:text-slate-400 flex items-center gap-2 truncate">
                              <span className="font-semibold text-amber-700 dark:text-amber-400">{opp.category}</span>
                              <span>•</span>
                              <span>{opp.organizer || (opp as any).organization || 'EduKan'}</span>
                              <span>•</span>
                              <span>Mwisho: {opp.deadline}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-700 dark:group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schools Results */}
              {(activeCategory === 'all' || activeCategory === 'schools') && filteredSchools.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Shule & Vyuo ({filteredSchools.length})</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">Bonyeza kutazama jamii</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredSchools.slice(0, 5).map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleSelectItem('schools')}
                        className="p-2.5 sm:p-3 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/90 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <School className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{s.name}</span>
                              {s.verified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-slate-400 flex items-center gap-2 truncate">
                              <span>Mkoa wa {s.region}</span>
                              <span>•</span>
                              <span>{(s.studentCount || (s as any).studentsCount || 0).toLocaleString()} Wanafunzi</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts Results */}
              {(activeCategory === 'all' || activeCategory === 'posts') && filteredPosts.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Machapisho ya Jamii ({filteredPosts.length})</span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-normal">Kutoka ukurasa mkuu</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredPosts.slice(0, 5).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectItem('feed')}
                        className="p-2.5 sm:p-3 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/90 hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50/50 dark:hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={p.author?.name || 'Mwandishi'}
                            className="w-9 h-9 rounded-xl object-cover shrink-0 ring-1 ring-gray-200 dark:ring-slate-700"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-gray-900 dark:text-white truncate">{p.author?.name}</div>
                            <div className="text-[11px] text-gray-600 dark:text-slate-300 truncate">{p.content}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-teal-700 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 sm:px-6 py-2.5 bg-gray-50 dark:bg-slate-800/90 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-800 dark:text-emerald-400">EduKan Search</span>
            <span>•</span>
            <span>Utafutaji wa papo kwa papo bila hitilafu</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 font-medium cursor-pointer"
          >
            Funga (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
