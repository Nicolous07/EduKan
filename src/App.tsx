import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeFeed } from './components/HomeFeed';
import { StudyRooms } from './components/StudyRooms';
import { LibraryView } from './components/LibraryView';
import { SchoolCommunities } from './components/SchoolCommunities';
import { OpportunitiesView } from './components/OpportunitiesView';
import { StudentProfileView } from './components/StudentProfileView';
import { AdminPanel } from './components/AdminPanel';
import { NotificationsModal } from './components/NotificationsModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { QuickActionModal } from './components/QuickActionModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { FeedbackModal } from './components/FeedbackModal';
import { LoginPage } from './components/LoginPage';
import { EduLoading } from './components/EduLoading';
import { Plus } from 'lucide-react';

import {
  INITIAL_USER,
  INITIAL_SCHOOLS,
  INITIAL_POSTS,
  INITIAL_QUESTIONS,
  INITIAL_RESOURCES,
  INITIAL_OPPORTUNITIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_LIBRARY_BOOKS,
  INITIAL_MANAGED_STUDENTS
} from './data/mockData';
import { getInitialState, saveState } from './lib/store';
import {
  fetchPostsFromDb,
  createPostInDb,
  togglePostLikeInDb,
  fetchBooksFromDb,
  createBookInDb,
  fetchStudyQuestionsFromDb,
  createQuestionInDb,
  fetchScholarshipsFromDb,
  getDbStatus,
  DbStatus
} from './lib/supabaseService';
import {
  UserProfile,
  Post,
  SchoolCommunity,
  QuestionItem,
  StudyResource,
  OpportunityItem,
  AppNotification,
  UserRole,
  LibraryItem,
  ManagedStudent,
  PostCategory
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [currentRole, setCurrentRole] = useState<UserRole>(() => getInitialState('edukan_active_role', 'student'));
  
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => getInitialState('edukan_user', INITIAL_USER));

  // Global Dark Mode state with persistence in localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('edukan_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply dark mode class to document.documentElement
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('edukan_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('edukan_theme', 'light');
      }
    } catch (e) {
      console.warn('Failed to update dark mode class', e);
    }
  }, [isDarkMode]);

  // Guard admin tab: Non-admin users cannot access the admin panel
  useEffect(() => {
    if (activeTab === 'admin' && currentUser.role !== 'admin') {
      setActiveTab('feed');
    }
  }, [activeTab, currentUser.role]);

  // Initialize posts, checking localStorage cached feed state first
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const cached = localStorage.getItem('edukan_cached_feed_state');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed.posts) && parsed.posts.length > 0) {
          return parsed.posts;
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached feed', e);
    }
    return getInitialState('edukan_posts', INITIAL_POSTS);
  });

  const [schools, setSchools] = useState<SchoolCommunity[]>(() => getInitialState('edukan_schools', INITIAL_SCHOOLS));
  const [questions, setQuestions] = useState<QuestionItem[]>(() => getInitialState('edukan_questions', INITIAL_QUESTIONS));
  const [resources, setResources] = useState<StudyResource[]>(() => getInitialState('edukan_resources', INITIAL_RESOURCES));
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(() => getInitialState('edukan_opportunities', INITIAL_OPPORTUNITIES));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getInitialState('edukan_notifications', INITIAL_NOTIFICATIONS));
  const [libraryBooks, setLibraryBooks] = useState<LibraryItem[]>(() => getInitialState('edukan_library_books', INITIAL_LIBRARY_BOOKS));
  const [managedStudents, setManagedStudents] = useState<ManagedStudent[]>(() => getInitialState('edukan_managed_students', INITIAL_MANAGED_STUDENTS));

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  // Opens login page right away if user is not registered yet
  const [isLoginPageOpen, setIsLoginPageOpen] = useState<boolean>(() => {
    return !getInitialState('edukan_is_registered', false);
  });
  const [isLoadingAnim, setIsLoadingAnim] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Inapakia data za elimu...');
  const [quickActionMode, setQuickActionMode] = useState<'post' | 'question'>('post');

  const triggerAnimatedLoader = (msg = 'Inapakia data za elimu...', duration = 1200) => {
    setLoadingMessage(msg);
    setIsLoadingAnim(true);
    setTimeout(() => {
      setIsLoadingAnim(false);
    }, duration);
  };

  // Network Online / Offline Detection
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      return navigator.onLine;
    }
    return true;
  });

  // Supabase Database Connection & Sync Status
  const [dbStatus, setDbStatus] = useState<DbStatus>({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    tableReady: false,
    message: 'Inaunganisha na Supabase Database...',
    lastChecked: new Date().toISOString()
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync data directly with Supabase Database
  const syncAllDataFromSupabase = async (showNotification = false) => {
    setIsSyncing(true);
    try {
      const status = await getDbStatus();
      setDbStatus(status);

      const [postsRes, booksRes, questionsRes, scholarshipsRes] = await Promise.all([
        fetchPostsFromDb(),
        fetchBooksFromDb(),
        fetchStudyQuestionsFromDb(),
        fetchScholarshipsFromDb()
      ]);

      if (postsRes.posts && postsRes.posts.length > 0) {
        setPosts(postsRes.posts);
      }
      if (booksRes.books && booksRes.books.length > 0) {
        setLibraryBooks(booksRes.books);
      }
      if (questionsRes.questions && questionsRes.questions.length > 0) {
        setQuestions(questionsRes.questions);
      }
      if (scholarshipsRes.scholarships && scholarshipsRes.scholarships.length > 0) {
        setOpportunities(scholarshipsRes.scholarships);
      }

      if (showNotification) {
        setNotifications((prev) => [
          {
            id: `notif-sync-${Date.now()}`,
            title: postsRes.source === 'supabase' ? '⚡ Data za Supabase Zimesasishwa!' : '📦 Data za Ndani Zimesasishwa',
            message:
              postsRes.source === 'supabase'
                ? 'Mfumo wako umepokea machapisho, vitabu na maswali ya hivi punde moja kwa moja kutoka Supabase.'
                : 'Mtandao haupo au meza zinasanidiwa. Mfumo unatumia kumbukumbu ya ndani (offline cache).',
            category: 'announcement',
            timestamp: 'Sasa hivi',
            read: false
          },
          ...prev
        ]);
      }
    } catch (err) {
      console.warn('Sync notice:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync from Supabase on mount
  useEffect(() => {
    syncAllDataFromSupabase(false);
  }, []);

  // Listen to browser network changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncAllDataFromSupabase(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setDbStatus({
        online: false,
        tableReady: false,
        message: 'Mtandao haupo (Hali ya Offline / Cache inatumika)',
        lastChecked: new Date().toISOString()
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Reset scroll to top whenever navigation tab changes on mobile and desktop
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
  }, [activeTab]);

  // Cache feed state to localStorage whenever posts change to allow offline viewing
  useEffect(() => {
    try {
      const cacheData = {
        posts,
        cachedAt: new Date().toISOString(),
        totalCount: posts.length
      };
      localStorage.setItem('edukan_cached_feed_state', JSON.stringify(cacheData));
    } catch (err) {
      console.warn('Failed to save feed cache to localStorage', err);
    }
  }, [posts]);

  // Sync other standard state to local storage
  useEffect(() => saveState('edukan_active_role', currentRole), [currentRole]);
  useEffect(() => saveState('edukan_user', currentUser), [currentUser]);
  useEffect(() => saveState('edukan_posts', posts), [posts]);
  useEffect(() => saveState('edukan_schools', schools), [schools]);
  useEffect(() => saveState('edukan_questions', questions), [questions]);
  useEffect(() => saveState('edukan_notifications', notifications), [notifications]);
  useEffect(() => saveState('edukan_library_books', libraryBooks), [libraryBooks]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Post Handlers
  const handleAddPost = (p: Partial<Post>) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        school: currentUser.schoolName,
        role: currentRole,
        verified: true
      },
      type: p.type || 'normal',
      category: p.category || 'masomo',
      content: p.content || '',
      subject: p.subject,
      mediaUrl: p.mediaUrl,
      mediaType: p.mediaType,
      pollOptions: p.pollOptions,
      likes: 0,
      commentsCount: 0,
      sharesCount: 0,
      comments: [],
      schoolId: currentUser.schoolId,
      schoolName: currentUser.schoolName,
      createdAt: `Sasa hivi (${timeFormatted})`
    };
    setPosts([newPost, ...posts]);
    setCurrentUser(u => ({ ...u, points: u.points + 5 }));
    // Persist to Supabase and cache
    createPostInDb(newPost);
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        const nextLikes = isLiked ? p.likes + 1 : Math.max(0, p.likes - 1);
        togglePostLikeInDb(postId, nextLikes);
        return { ...p, isLiked, likes: nextLikes };
      }
      return p;
    }));
  };

  const handleSavePost = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved } : p));
  };

  const handleSharePost = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, sharesCount: (p.sharesCount || 0) + 1 } : p));
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId && p.pollOptions) {
        // Toggle if clicked again
        if (p.userVotedOptionId === optionId) {
          return {
            ...p,
            userVotedOptionId: undefined,
            pollOptions: p.pollOptions.map(opt => opt.id === optionId ? { ...opt, votes: Math.max(0, opt.votes - 1) } : opt)
          };
        }
        // Change vote
        const prevVoted = p.userVotedOptionId;
        return {
          ...p,
          userVotedOptionId: optionId,
          pollOptions: p.pollOptions.map(opt => {
            if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
            if (opt.id === prevVoted) return { ...opt, votes: Math.max(0, opt.votes - 1) };
            return opt;
          })
        };
      }
      return p;
    }));
    setCurrentUser(u => ({ ...u, points: u.points + 1 }));
  };

  const handleAddComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newComment = {
      id: `comm-${Date.now()}`,
      postId,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        school: currentUser.schoolName,
        role: currentRole
      },
      content: text.trim(),
      createdAt: `Sasa (${timeFormatted})`,
      likes: 0,
      isLiked: false
    };

    setPosts(posts.map(p => {
      if (p.id === postId) {
        const existing = p.comments || [];
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...existing, newComment]
        };
      }
      return p;
    }));
    setCurrentUser(u => ({ ...u, points: u.points + 2 }));
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId && p.comments) {
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c.id === commentId) {
              const isLiked = !c.isLiked;
              return { ...c, isLiked, likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1) };
            }
            return c;
          })
        };
      }
      return p;
    }));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId && p.comments) {
        return {
          ...p,
          commentsCount: Math.max(0, p.commentsCount - 1),
          comments: p.comments.filter(c => c.id !== commentId)
        };
      }
      return p;
    }));
  };

  // Library Handlers
  const handleAddLibraryBook = (newBook: Partial<LibraryItem>) => {
    const book: LibraryItem = {
      id: `book-${Date.now()}`,
      title: newBook.title || 'Kitabu cha Kiada / Mtihani',
      authorOrPublisher: newBook.authorOrPublisher || 'TIE / NECTA',
      level: newBook.level || 'O-Level',
      category: newBook.category || 'Vitabu vya Masomo',
      classGrade: newBook.classGrade || 'Kidato cha 4',
      subject: newBook.subject || 'General',
      coverImage: newBook.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
      downloadUrl: newBook.downloadUrl || '#',
      fileSize: newBook.fileSize || '3.5 MB',
      fileFormat: newBook.fileFormat || 'PDF',
      year: newBook.year || 2024,
      downloadsCount: 0,
      description: newBook.description || 'Kimepakiwa na mwanachama wa mtandao wa EduKan.',
      uploaderName: currentUser.name,
      uploaderRole: currentRole,
      uploaderSchool: currentUser.schoolName,
      createdAt: 'Sasa hivi',
      verified: newBook.verified ?? true,
      pages: newBook.pages || 14
    };
    setLibraryBooks([book, ...libraryBooks]);
    setCurrentUser(u => ({ ...u, points: u.points + 20 }));
    // Persist to Supabase and cache
    createBookInDb(book);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: '📚 Kitabu Kimepakiwa Maktaba!',
      message: `Umefanikiwa kupakia "${book.title}" na kuzawadiwa +20 EduPoints.`,
      category: 'announcement',
      timestamp: 'Sasa hivi',
      read: false
    };
    setNotifications([notif, ...notifications]);
  };

  const handleDownloadLibraryBook = (bookId: string) => {
    setLibraryBooks(books => books.map(b => b.id === bookId ? { ...b, downloads: b.downloads + 1 } : b));
    setCurrentUser(u => ({ ...u, points: u.points + 1 }));
  };

  const handleToggleSaveLibraryBook = (bookId: string) => {
    setLibraryBooks(books => books.map(b => b.id === bookId ? { ...b, isSaved: !b.isSaved } : b));
  };

  // Award Points Handler
  const handleAwardPoints = (points: number, reason?: string) => {
    setCurrentUser(u => ({ ...u, points: u.points + points }));
    if (reason) {
      const notif: AppNotification = {
        id: `notif-pts-${Date.now()}`,
        title: `🎉 Umejipatia +${points} EduPoints!`,
        message: reason,
        category: 'points',
        timestamp: 'Sasa hivi',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  // Questions Handler
  const handleAddQuestion = (q: Partial<QuestionItem>) => {
    const newQ: QuestionItem = {
      id: `q-${Date.now()}`,
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        school: currentUser.schoolName,
        form: `${currentUser.level} • ${currentUser.combination}`
      },
      subject: q.subject || 'Physics',
      topic: q.topic || 'General',
      title: q.title || '',
      content: q.content || '',
      answers: [],
      viewsCount: 1,
      hasBestAnswer: false,
      createdAt: 'Sasa hivi'
    };
    setQuestions([newQ, ...questions]);
    setCurrentUser(u => ({ ...u, points: u.points + 10 }));
    // Persist to Supabase and cache
    createQuestionInDb(newQ);
  };

  const handleAddAnswer = (questionId: string, answerText: string) => {
    const newAns = {
      id: `ans-${Date.now()}`,
      questionId,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        school: currentUser.schoolName,
        role: currentRole,
        points: currentUser.points
      },
      content: answerText,
      isBestAnswer: false,
      votes: 1,
      createdAt: 'Punde hivi'
    };
    setQuestions(questions.map(q => q.id === questionId ? { ...q, answers: [...q.answers, newAns] } : q));
    setCurrentUser(u => ({ ...u, points: u.points + 15 }));
  };

  const handleMarkBestAnswer = (questionId: string, answerId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          hasBestAnswer: true,
          answers: q.answers.map(a => ({ ...a, isBestAnswer: a.id === answerId }))
        };
      }
      return q;
    }));
    setCurrentUser(u => ({ ...u, points: u.points + 50 }));
  };

  const handleVoteAnswer = (questionId: string, answerId: string, type: 'up' | 'down') => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: q.answers.map(a => a.id === answerId ? { ...a, votes: type === 'up' ? a.votes + 1 : a.votes - 1 } : a)
        };
      }
      return q;
    }));
  };

  const handleToggleJoinSchool = (schoolId: string) => {
    setSchools(schools.map(s => s.id === schoolId ? { ...s, joined: !s.joined } : s));
  };

  const handleToggleSaveOpp = (id: string) => {
    setOpportunities(opportunities.map(o => o.id === id ? { ...o, isSaved: !o.isSaved } : o));
  };

  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-emerald-50/25 dark:bg-slate-950 font-sans text-gray-800 dark:text-slate-100 lg:overflow-hidden transition-colors duration-200">
      {/* Top Horizontal Navigation Bar with Auto-Hide on Mobile & TikTok Bottom Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        currentRole={currentRole}
        setCurrentRole={(newRole) => {
          setCurrentRole(newRole);
          triggerAnimatedLoader(`Switching to: ${newRole === 'admin' ? 'EduKan Admin' : 'Student Profile'}...`, 800);
        }}
        unreadNotificationsCount={unreadNotifs}
        isOnline={isOnline}
        onToggleOffline={() => setIsOnline(prev => !prev)}
        dbStatus={dbStatus}
        isSyncing={isSyncing}
        onSyncDb={() => syncAllDataFromSupabase(true)}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenLogin={() => setIsLoginPageOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        onOpenQuickAction={(mode) => {
          setQuickActionMode(mode || 'post');
          setIsQuickActionOpen(true);
        }}
      />

      {/* Main Body Content Container with Separated Panes */}
      <main className={`flex-1 min-h-0 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:px-6 lg:py-4 pb-28 md:pb-6 flex flex-col ${activeTab === 'feed' ? 'lg:overflow-hidden' : 'lg:overflow-y-auto lg:custom-scrollbar'}`}>
        {activeTab === 'feed' && (
          <HomeFeed
            posts={posts}
            currentUser={currentUser}
            schools={schools}
            isOnline={isOnline}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onSavePost={handleSavePost}
            onSharePost={handleSharePost}
            onVotePoll={handleVotePoll}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onDeleteComment={handleDeleteComment}
            onNavigateTab={setActiveTab}
            onOpenQuickAction={(mode) => {
              setQuickActionMode(mode || 'post');
              setIsQuickActionOpen(true);
            }}
          />
        )}

        {activeTab === 'library' && (
          <LibraryView
            books={libraryBooks}
            currentUser={currentUser}
            onAddBook={handleAddLibraryBook}
            onDownloadBook={handleDownloadLibraryBook}
            onToggleSaveBook={handleToggleSaveLibraryBook}
          />
        )}

        {activeTab === 'study' && (
          <StudyRooms
            questions={questions}
            resources={resources}
            currentUser={currentUser}
            onAddQuestion={handleAddQuestion}
            onAddAnswer={handleAddAnswer}
            onMarkBestAnswer={handleMarkBestAnswer}
            onVoteAnswer={handleVoteAnswer}
          />
        )}

        {(activeTab === 'schools' || activeTab === 'chat') && (
          <SchoolCommunities
            schools={schools}
            currentUser={currentUser}
            onToggleJoin={handleToggleJoinSchool}
            onExploreSchool={(schId) => setActiveTab('feed')}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunitiesView
            opportunities={opportunities}
            currentUser={currentUser}
            onToggleSave={handleToggleSaveOpp}
            onAwardPoints={handleAwardPoints}
          />
        )}

        {activeTab === 'profile' && (
          <StudentProfileView
            user={currentUser}
            posts={posts}
            questions={questions}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onUpdateProfile={(updated) => {
              setCurrentUser(prev => ({ ...prev, ...updated }));
              // Also update user's author references in posts
              setPosts(prev => prev.map(p => {
                if (p.author.id === currentUser.id) {
                  return {
                    ...p,
                    author: {
                      ...p.author,
                      name: updated.name || p.author.name,
                      avatar: updated.avatar || p.author.avatar,
                      school: updated.schoolName || p.author.school
                    }
                  };
                }
                return p;
              }));
            }}
            onOpenLogin={() => setIsLoginPageOpen(true)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            schools={schools}
            posts={posts}
            questions={questions}
            resources={resources}
            libraryBooks={libraryBooks}
            opportunities={opportunities}
            managedStudents={managedStudents}
            currentUser={currentUser}
            onNavigateTab={setActiveTab}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
            onBroadcastAnnouncement={(title, msg, priority, audience) => {
              const notif: AppNotification = {
                id: `notif-${Date.now()}`,
                title: `📢 ${title}`,
                message: msg,
                category: 'announcement',
                timestamp: 'Sasa hivi',
                read: false
              };
              setNotifications([notif, ...notifications]);
            }}
            onVerifySchool={(id) => {
              setSchools(schools.map(s => s.id === id ? { ...s, verified: !s.verified } : s));
            }}
            onAddSchool={(school) => {
              const newSchool: SchoolCommunity = {
                id: `sch-${Date.now()}`,
                name: school.name || 'Shule Mpya',
                region: school.region || 'Dar es Salaam',
                district: school.district || 'Ilala',
                category: school.category || 'High School',
                principal: school.principal || 'Mkuu wa Shule',
                studentCount: school.studentCount || 850,
                logo: school.logo || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80',
                coverImage: school.coverImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
                verified: true,
                established: '2010',
                about: school.about || 'Jumuiya rasmi ya wanafunzi na walimu kwenye mtandao wa elimu EduKan.',
                annualFee: 450000,
                feeAccountControlPrefix: '998100',
                activeDiscussions: 8
              };
              setSchools([newSchool, ...schools]);
            }}
            onDeleteSchool={(id) => {
              setSchools(schools.filter(s => s.id !== id));
            }}
            onEditSchool={(id, updated) => {
              setSchools(schools.map(s => s.id === id ? { ...s, ...updated } : s));
            }}
            onDeletePost={(id) => {
              setPosts(posts.filter(p => p.id !== id));
            }}
            onEditPost={(postId, updatedContent, updatedCategory, updatedSubject) => {
              setPosts(posts.map(p => {
                if (p.id === postId) {
                  return {
                    ...p,
                    content: updatedContent,
                    category: updatedCategory,
                    subject: updatedSubject || p.subject
                  };
                }
                return p;
              }));
            }}
            onPinPost={(id) => {
              setPosts(posts.map(p => p.id === id ? { ...p, isPinned: !p.isPinned } : p));
            }}
            onDeleteComment={(postId, commentId) => {
              setPosts(posts.map(p => {
                if (p.id === postId && p.comments) {
                  const filtered = p.comments.filter(c => c.id !== commentId);
                  return {
                    ...p,
                    comments: filtered,
                    commentsCount: Math.max(0, (p.commentsCount || 1) - 1)
                  };
                }
                return p;
              }));
            }}
            onEditComment={(postId, commentId, updatedText) => {
              setPosts(posts.map(p => {
                if (p.id === postId && p.comments) {
                  const updatedComments = p.comments.map(c => c.id === commentId ? { ...c, content: updatedText } : c);
                  return {
                    ...p,
                    comments: updatedComments
                  };
                }
                return p;
              }));
            }}
            onDeleteQuestion={(id) => {
              setQuestions(questions.filter(q => q.id !== id));
            }}
            onEditQuestion={(id, title, subject, body) => {
              setQuestions(questions.map(q => {
                if (q.id === id) {
                  return {
                    ...q,
                    title,
                    subject,
                    content: body
                  };
                }
                return q;
              }));
            }}
            onDeleteAnswer={(questionId, answerId) => {
              setQuestions(questions.map(q => {
                if (q.id === questionId && q.answers) {
                  return {
                    ...q,
                    answers: q.answers.filter(a => a.id !== answerId)
                  };
                }
                return q;
              }));
            }}
            onVerifyLibraryBook={(id) => {
              setLibraryBooks(libraryBooks.map(b => b.id === id ? { ...b, verified: !b.verified } : b));
            }}
            onDeleteLibraryBook={(id) => {
              setLibraryBooks(libraryBooks.filter(b => b.id !== id));
            }}
            onAddLibraryBook={(book) => {
              handleAddLibraryBook(book);
            }}
            onEditLibraryBook={(id, updated) => {
              setLibraryBooks(libraryBooks.map(b => b.id === id ? { ...b, ...updated } : b));
            }}
            onAddOpportunity={(opp) => {
              setOpportunities([opp, ...opportunities]);
            }}
            onEditOpportunity={(id, updated) => {
              setOpportunities(opportunities.map(o => o.id === id ? { ...o, ...updated } : o));
            }}
            onDeleteOpportunity={(id) => {
              setOpportunities(opportunities.filter(o => o.id !== id));
            }}
            onUpdateManagedStudents={(updated) => {
              setManagedStudents(updated);
              saveState('edukan_managed_students', updated);
            }}
            onBanUser={(studentId, isBanned) => {
              setManagedStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: isBanned ? 'banned' : 'active' } : s));
              if (currentUser.id === studentId) {
                setCurrentUser(prev => ({ ...prev, status: isBanned ? 'banned' : 'active' }));
              }
            }}
          />
        )}
      </main>

      {/* Global Notifications Modal */}
      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
        onNotificationClick={(notif) => {
          if (notif.actionTab) setActiveTab(notif.actionTab);
          setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
        }}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        schools={schools}
        opportunities={opportunities}
        questions={questions}
        libraryBooks={libraryBooks}
        posts={posts}
        onSelectTab={setActiveTab}
      />

      {/* Floating Action Button (FAB) - Desktop Only (Mobile uses TikTok center button) */}
      <div className="hidden md:flex fixed bottom-5 right-5 z-40 flex-col items-end gap-1.5 group">
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gray-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap mb-0.5 flex items-center gap-1.5">
          <span>Chapisha / Uliza Swali</span>
          <span className="text-[9px] bg-emerald-600 px-1 py-0.2 rounded text-white font-mono">+5/+10 pts</span>
        </div>
        <button
          id="global-quick-action-fab"
          onClick={() => {
            setQuickActionMode('post');
            setIsQuickActionOpen(true);
          }}
          aria-label="Chapisha Post au Uliza Swali Haraka"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center ring-2 sm:ring-3 ring-white/95 focus:outline-none cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Quick Action Overlay Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        currentUser={currentUser}
        onAddPost={handleAddPost}
        onAddQuestion={handleAddQuestion}
        onNavigateTab={setActiveTab}
        defaultMode={quickActionMode}
      />

      {/* Vinara (Leaderboard) Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentUser={currentUser}
        schools={schools}
        onNavigateTab={setActiveTab}
      />

      {/* Global Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        currentUser={currentUser}
        currentRole={currentRole}
        onSuccessToast={(msg) => {
          const notif: AppNotification = {
            id: `notif-${Date.now()}`,
            title: '⭐ Maoni Yametumwa!',
            message: msg,
            category: 'points',
            timestamp: 'Sasa hivi',
            read: false
          };
          setNotifications([notif, ...notifications]);
        }}
      />

      {/* Modern Login & Registration Modal / Page */}
      {isLoginPageOpen && (
        <LoginPage
          isOpen={isLoginPageOpen}
          schools={schools.map(s => ({ id: s.id, name: s.name }))}
          onClose={() => setIsLoginPageOpen(false)}
          onLoginSuccess={(loggedInUser, role) => {
            setCurrentUser(loggedInUser);
            saveState('edukan_user', loggedInUser);
            if (role) {
              setCurrentRole(role);
              saveState('edukan_active_role', role);
              if (role === 'admin') {
                setActiveTab('admin');
              }
            }
            saveState('edukan_is_registered', true);
            setIsLoginPageOpen(false);
            triggerAnimatedLoader(
              role === 'admin'
                ? `Karibu Msimamizi Mkuu ${loggedInUser.name}! Inafungua Paneli ya Admin...`
                : `Karibu ${loggedInUser.name}! Inasasisha wasifu...`,
              1000
            );
          }}
          onGuestContinue={() => setIsLoginPageOpen(false)}
          isFirstVisit={!getInitialState('edukan_is_registered', false)}
        />
      )}

      {/* Animated Academic Loading Overlay */}
      {isLoadingAnim && (
        <EduLoading
          message={loadingMessage}
          onDismiss={() => setIsLoadingAnim(false)}
        />
      )}
    </div>
  );
}
