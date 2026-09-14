import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Home,
  BookOpen,
  School,
  Sparkles,
  ShieldCheck,
  User,
  Search,
  Bell,
  CheckCircle2,
  ChevronDown,
  Plus,
  MoreHorizontal,
  Settings,
  X,
  HelpCircle,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  Wifi,
  WifiOff,
  Library,
  MessageSquare,
  LogIn,
  Database,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onOpenQuickAction?: (mode?: 'post' | 'question') => void;
  onOpenFeedback?: () => void;
  onOpenLogin?: () => void;
  isOnline?: boolean;
  onToggleOffline?: () => void;
  dbStatus?: { online: boolean; tableReady: boolean; message: string };
  isSyncing?: boolean;
  onSyncDb?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  currentRole,
  setCurrentRole,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenSearch,
  onOpenQuickAction,
  onOpenFeedback,
  onOpenLogin,
  isOnline = true,
  onToggleOffline,
  dbStatus,
  isSyncing = false,
  onSyncDb,
  isDarkMode = false,
  onToggleDarkMode
}) => {
  const [isFooterHidden, setIsFooterHidden] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [settingsSubmenu, setSettingsSubmenu] = useState<'main' | 'settings' | 'help'>('main');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSaverEnabled, setDataSaverEnabled] = useState(false);
  const lastScrollYRef = useRef(0);
  const isHiddenRef = useRef(false);

  // Smooth, responsive auto-hide ONLY for bottom navigation footer on mobile
  useEffect(() => {
    let touchStartY = 0;
    let touchLastY = 0;

    const getScrollPos = (target?: EventTarget | null): number => {
      if (target && target instanceof HTMLElement && target !== document.body && target !== document.documentElement) {
        if (target.scrollTop > 0) {
          return target.scrollTop;
        }
      }
      return Math.max(
        0,
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        (document.scrollingElement ? document.scrollingElement.scrollTop : 0) ||
        0
      );
    };

    lastScrollYRef.current = getScrollPos();

    const updateFooterVisibility = (hide: boolean) => {
      if (isHiddenRef.current !== hide) {
        isHiddenRef.current = hide;
        setIsFooterHidden(hide);
      }
    };

    const handleScroll = (e?: Event) => {
      const currentScrollY = getScrollPos(e?.target);
      const prevScrollY = lastScrollYRef.current;
      const diff = currentScrollY - prevScrollY;

      // Safe zone near top of page: ALWAYS visible
      if (currentScrollY <= 25) {
        lastScrollYRef.current = currentScrollY;
        updateFooterVisibility(false);
        return;
      }

      // Scrolling UP towards top of page -> IMMEDIATELY reveal footer on mobile!
      if (diff < -3) {
        updateFooterVisibility(false);
        lastScrollYRef.current = currentScrollY;
      }
      // Scrolling DOWN into feed -> smoothly hide footer to maximize reading space
      else if (diff > 8 && currentScrollY > 50) {
        updateFooterVisibility(true);
        lastScrollYRef.current = currentScrollY;
      }
    };

    // Instant touch gesture detection for mobile phone view
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        touchLastY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const currentY = e.touches[0].clientY;
      const deltaFromStart = currentY - touchStartY;
      const deltaFromLast = currentY - touchLastY;
      touchLastY = currentY;

      const currentScrollY = getScrollPos(e.target);

      if (currentScrollY <= 25) {
        updateFooterVisibility(false);
        return;
      }

      // Dragging finger DOWN -> scrolling UP -> reveal footer
      if (deltaFromStart > 8 || deltaFromLast > 4) {
        updateFooterVisibility(false);
        touchStartY = currentY;
      }
      // Dragging finger UP -> scrolling DOWN -> hide footer
      else if ((deltaFromStart < -14 || deltaFromLast < -7) && currentScrollY > 50) {
        updateFooterVisibility(true);
        touchStartY = currentY;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const currentScrollY = getScrollPos();
      lastScrollYRef.current = currentScrollY;

      if (currentScrollY <= 25) {
        updateFooterVisibility(false);
        return;
      }

      if (e.deltaY < -1) {
        updateFooterVisibility(false);
      } else if (e.deltaY > 6 && currentScrollY > 50) {
        updateFooterVisibility(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Ensure footer is revealed on tab changes
  useEffect(() => {
    setIsFooterHidden(false);
    isHiddenRef.current = false;
    lastScrollYRef.current = 0;
  }, [activeTab]);

  interface NavItem {
    id: string;
    label: string;
    subtitle: string;
    icon: any;
    adminOnly?: boolean;
    badge?: string | number;
  }

  const isUserAdmin = currentUser.role === 'admin';

  const baseNavItems: NavItem[] = [
    { id: 'feed', label: 'Home', subtitle: 'Home (Feed)', icon: Home },
    { id: 'library', label: 'Library', subtitle: 'Digital Library & Past Papers', icon: Library },
    { id: 'study', label: 'Study Rooms', subtitle: 'Academic Study Rooms & Q&A', icon: BookOpen },
    { id: 'schools', label: 'Schools', subtitle: 'School Communities & Chat', icon: School },
    { id: 'opportunities', label: 'Opportunities', subtitle: 'Scholarships & Grants', icon: Sparkles }
  ];

  const navItems: NavItem[] = isUserAdmin
    ? [...baseNavItems, { id: 'admin', label: 'Admin', subtitle: 'Admin Panel & Moderation', icon: ShieldCheck }]
    : baseNavItems;

  return (
    <>
      {/* Main Top Header: Pinned at top on phone view and desktop, never scrolls away */}
      <header
        id="app-main-header"
        className="fixed top-0 left-0 right-0 z-40 md:sticky md:top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-emerald-100/80 dark:border-slate-800 shadow-xs pointer-events-auto w-full transition-colors duration-200"
      >
        {/* Main Top Bar: Profile & Search Bar on Mobile, Full Bar on Desktop */}
        <div
          id="navbar-top-bar"
          className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200"
        >
        {/* Offline Alert Strip in Header */}
        {!isOnline && (
          <div
            id="header-offline-indicator-banner"
            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[11px] font-semibold py-1.5 px-3 sm:px-6 flex items-center justify-between shadow-xs border-b border-amber-800/40 animate-in fade-in"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <WifiOff className="w-3.5 h-3.5 text-amber-200 shrink-0" />
              <span className="font-bold tracking-tight">You are Offline</span>
              <span className="hidden sm:inline text-amber-100 font-normal">
                — Viewing saved feed from cache
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] bg-amber-800/80 text-amber-100 px-2 py-0.5 rounded font-mono">
                Cached Feed
              </span>
              {onToggleOffline && (
                <button
                  type="button"
                  onClick={onToggleOffline}
                  className="text-[10px] bg-white text-amber-900 px-2.5 py-0.5 rounded font-bold hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
                  title="Click to reconnect network"
                >
                  Reconnect
                </button>
              )}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Mobile Top Header: Dedicated Profile + Search Bar + Dark Mode + Notifications */}
          <div
            id="mobile-top-header-row"
            className="flex md:hidden items-center justify-between h-14 gap-2 w-full"
          >
            {/* 1. Profile on Left */}
            <button
              id="mobile-header-profile-btn"
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 shrink-0 group focus:outline-none cursor-pointer"
              aria-label="Student Profile"
            >
              <div className="relative w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 overflow-hidden shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-slate-900" />
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-800 dark:text-slate-100 leading-tight truncate max-w-[65px] xs:max-w-[85px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 leading-none">
                  {currentUser.points} pts
                </span>
              </div>
            </button>

            {/* 2. Mobile Search Icon Button */}
            <div className="flex items-center">
              <button
                id="mobile-header-search-btn"
                onClick={onOpenSearch}
                className="p-2 text-gray-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-2xl hover:bg-emerald-50 dark:hover:bg-slate-800 active:bg-emerald-100 transition-all focus:outline-none flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Search"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* 3. Dark Mode Toggle + Admin Shortcut + Notifications + EduKan Logo */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Mobile Dark Mode Toggle Button */}
              {onToggleDarkMode && (
                <button
                  id="mobile-header-darkmode-btn"
                  onClick={onToggleDarkMode}
                  className="p-2 text-gray-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-2xl hover:bg-emerald-50 dark:hover:bg-slate-800 active:bg-emerald-100 transition-all focus:outline-none flex items-center justify-center shrink-0 cursor-pointer"
                  aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? (
                    <Sun className="w-4.5 h-4.5 text-amber-400 stroke-[2.25] transition-transform" />
                  ) : (
                    <Moon className="w-4.5 h-4.5 text-slate-700 dark:text-slate-200 stroke-[2.25] transition-transform" />
                  )}
                </button>
              )}

              {/* Admin Panel Quick Access on Mobile - Only for verified Admins */}
              {isUserAdmin && (
                <button
                  id="mobile-header-admin-btn"
                  onClick={() => {
                    if (currentRole !== 'admin') setCurrentRole('admin');
                    setActiveTab('admin');
                  }}
                  className={`px-2 py-1 rounded-xl flex items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-purple-700 text-white shadow-xs font-bold'
                      : 'bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80'
                  }`}
                  title="Admin Panel"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="text-[10px] font-bold">Admin</span>
                </button>
              )}

              {!isOnline && (
                <div
                  id="mobile-offline-header-badge"
                  className="flex items-center gap-1 px-1.5 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded-xl text-[10px] font-bold"
                  title="You are offline - feed is served from local cache"
                >
                  <WifiOff className="w-3 h-3 text-amber-700 dark:text-amber-400 animate-pulse" />
                  <span className="hidden xs:inline font-mono">Offline</span>
                </div>
              )}
              <button
                id="mobile-header-notif-btn"
                onClick={onOpenNotifications}
                className="relative p-2 text-gray-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-2xl hover:bg-emerald-50 dark:hover:bg-slate-800 active:bg-emerald-100 transition-all focus:outline-none cursor-pointer"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white dark:border-slate-900" />
                  </span>
                )}
              </button>
              <div
                onClick={() => setActiveTab('feed')}
                className="w-8 h-8 bg-emerald-600 dark:bg-emerald-500 rounded-xl flex items-center justify-center shadow-2xs cursor-pointer active:scale-95 transition-transform shrink-0"
                title="EduKan"
              >
                <span className="text-white font-black text-sm leading-none">E</span>
              </div>
            </div>
          </div>

          {/* Desktop Top Header (hidden md:flex) - Simplified, Compact & Icon-Only */}
          <div className="hidden md:flex items-center justify-between h-12 gap-3 lg:gap-5">
            {/* Logo & Identity */}
            <div
              onClick={() => setActiveTab('feed')}
              className="flex items-center gap-2 cursor-pointer shrink-0 group"
            >
              <div className="w-7 h-7 bg-emerald-600 dark:bg-emerald-500 rounded-lg flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-sm leading-none">E</span>
              </div>
              <span className="text-xl font-black text-emerald-800 dark:text-emerald-400 tracking-tight font-heading">
                EduKan
              </span>
            </div>

            {/* Desktop Navigation & Search: Icons Only */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Search Icon Only */}
              <button
                id="desktop-header-search-btn"
                onClick={onOpenSearch}
                title="Search schools, subjects, opportunities, notes... (Ctrl+K)"
                aria-label="Search"
                className="w-8.5 h-8.5 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/80 dark:hover:bg-slate-800 active:bg-emerald-100 rounded-xl transition-all border border-transparent hover:border-emerald-200 dark:hover:border-slate-700 focus:outline-none cursor-pointer"
              >
                <Search className="w-4 h-4 stroke-[2.25]" />
              </button>

              <div className="h-4 w-px bg-gray-200 dark:bg-slate-700 mx-0.5" />

              {/* Navigation Icons (Home, Library, Study Rooms, Schools, Opportunities, Admin) */}
              <nav className="flex items-center gap-1 h-full py-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      id={`nav-btn-${item.id}`}
                      title={item.subtitle}
                      aria-label={item.label}
                      className={`relative w-8.5 h-8.5 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-xs'
                          : 'text-gray-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/80 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                      {item.badge !== undefined && (
                        <span className={`absolute -top-1 -right-1 px-1 min-w-[14px] h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center leading-none ${
                          isActive ? 'bg-white text-emerald-800' : 'bg-emerald-600 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-1.5 lg:gap-2.5 shrink-0">
              {/* Offline/Online Status Indicator on Desktop */}
              {!isOnline ? (
                <div
                  id="desktop-offline-header-pill"
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded-xl text-[11px] font-bold shadow-2xs"
                  title="Offline mode. Cached feed is active."
                >
                  <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                  <span>Offline</span>
                  {onToggleOffline && (
                    <button
                      type="button"
                      onClick={onToggleOffline}
                      className="ml-0.5 text-[10px] bg-amber-200/80 hover:bg-amber-300 text-amber-900 px-1 py-0.5 rounded cursor-pointer"
                      title="Reconnect network"
                    >
                      Reconnect
                    </button>
                  )}
                </div>
              ) : (
                <div
                  className="hidden xl:flex items-center gap-1 text-[11px] text-emerald-800 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60"
                  title="EduKan is connected online"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online</span>
                </div>
              )}

              {/* Dark Mode Toggle Desktop Button */}
              {onToggleDarkMode && (
                <button
                  id="desktop-header-darkmode-btn"
                  onClick={onToggleDarkMode}
                  className="p-2 text-gray-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all rounded-xl hover:bg-emerald-50/80 dark:hover:bg-slate-800 active:bg-emerald-100 border border-transparent hover:border-emerald-200/80 dark:hover:border-slate-700 focus:outline-none cursor-pointer"
                  aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? (
                    <Sun className="w-4 h-4 text-amber-400 stroke-[2.25] transition-transform hover:rotate-45" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 stroke-[2.25] transition-transform hover:-rotate-12" />
                  )}
                </button>
              )}

              {/* Notification Bell */}
              <button
                id="desktop-header-notif-btn"
                onClick={onOpenNotifications}
                className="relative p-2 text-gray-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all rounded-xl hover:bg-emerald-50/80 dark:hover:bg-slate-800 active:bg-emerald-100 border border-transparent hover:border-emerald-200/80 dark:hover:border-slate-700 focus:outline-none cursor-pointer"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 border border-white dark:border-slate-900" />
                  </span>
                )}
              </button>

              {/* Quick Feedback Button Desktop */}
              {onOpenFeedback && (
                <button
                  id="desktop-header-feedback-btn"
                  onClick={onOpenFeedback}
                  className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-400 bg-gray-100/90 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-xl transition-all border border-gray-200 dark:border-slate-700 hover:border-emerald-200 cursor-pointer shadow-2xs"
                  title="Send Feedback or Suggestions"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Feedback</span>
                </button>
              )}

              {/* Login / Auth Button Desktop */}
              {onOpenLogin && (
                <button
                  id="desktop-header-login-btn"
                  onClick={onOpenLogin}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 rounded-xl transition-all border border-emerald-200 dark:border-emerald-800/80 cursor-pointer shadow-2xs"
                  title="Sign in or switch account"
                >
                  <User className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Compact User Avatar Pill */}
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-emerald-50/60 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
                aria-label="Student Profile"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-gray-800 dark:text-slate-100 leading-tight truncate max-w-[90px]">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 leading-none">
                    {currentUser.points} pts
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        </div>
      </header>

      {/* Mobile Spacer to keep page content from being obscured under the fixed top header */}
      <div
        id="mobile-header-spacer"
        className={`md:hidden shrink-0 pointer-events-none ${!isOnline ? 'h-[92px]' : 'h-14'}`}
        aria-hidden="true"
      />

      {/* Modern TikTok-Style Bottom Navigation Bar on Mobile (Auto-Hidden ONLY for Footer & Sits at Bottom) */}
      <nav
        id="navbar-bottom-tiktok-nav"
        className={`md:hidden pointer-events-auto fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-gray-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-2 py-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] flex items-center justify-around select-none transform transition-transform duration-300 ease-out will-change-transform ${
          isFooterHidden ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        {/* Tab 1: Home (Feed) */}
        <button
          id="tiktok-tab-feed"
          onClick={() => setActiveTab('feed')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'feed' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${activeTab === 'feed' ? 'stroke-[2.5] text-emerald-700 dark:text-emerald-400' : 'text-gray-500 dark:text-slate-400'}`} />
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'feed' ? 'font-bold text-emerald-800 dark:text-emerald-400' : 'font-medium'}`}>
            Home
          </span>
        </button>

        {/* Tab 2: Library */}
        <button
          id="tiktok-tab-library"
          onClick={() => setActiveTab('library')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'library' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Library className={`w-5 h-5 ${activeTab === 'library' ? 'stroke-[2.5] text-emerald-700 dark:text-emerald-400' : 'text-gray-500 dark:text-slate-400'}`} />
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'library' ? 'font-bold text-emerald-800 dark:text-emerald-400' : 'font-medium'}`}>
            Library
          </span>
        </button>

        {/* Tab 3: TikTok Iconic Center '+' Action Button */}
        <div className="flex-1 flex items-center justify-center">
          <button
            id="tiktok-tab-create-btn"
            onClick={() => {
              if (onOpenQuickAction) {
                onOpenQuickAction('post');
              } else {
                setActiveTab('feed');
              }
            }}
            className="relative flex items-center justify-center group focus:outline-none py-0.5 cursor-pointer"
            aria-label="Ask Question or Create Post"
          >
            <div className="relative w-11 h-8 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/30 ring-2 ring-white dark:ring-slate-800 group-active:scale-90 transition-transform">
              <span className="absolute -inset-1 rounded-xl bg-emerald-400/35 animate-pulse pointer-events-none" />
              <Plus className="relative z-10 w-5 h-5 stroke-[2.75]" />
            </div>
          </button>
        </div>

        {/* Tab 4: Study Rooms */}
        <button
          id="tiktok-tab-study"
          onClick={() => setActiveTab('study')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'study' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <BookOpen className={`w-5 h-5 ${activeTab === 'study' ? 'stroke-[2.5] text-emerald-700 dark:text-emerald-400' : 'text-gray-500 dark:text-slate-400'}`} />
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[62px] ${
            activeTab === 'study' ? 'font-bold text-emerald-800 dark:text-emerald-400' : 'font-medium'
          }`}>
            Rooms
          </span>
        </button>

        {/* Tab 5: More & Admin */}
        <button
          id="tiktok-tab-profile"
          data-tab="more"
          onClick={() => {
            setSettingsSubmenu('main');
            setIsMoreMenuOpen(true);
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative cursor-pointer ${
            isMoreMenuOpen || activeTab === 'opportunities' || activeTab === 'admin'
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
          }`}
          aria-label="More, Opportunities & Settings"
          title="More & Admin"
        >
          <div className="relative">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'admin'
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 ring-2 ring-purple-600/50 shadow-xs'
                  : isMoreMenuOpen || activeTab === 'opportunities'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-600/30 shadow-2xs'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              {activeTab === 'admin' ? (
                <ShieldCheck className="w-4 h-4 text-purple-700 dark:text-purple-400 stroke-[2.5]" />
              ) : (
                <MoreHorizontal className="w-5 h-5 stroke-[2.5]" />
              )}
            </div>
            {/* Small indicator badge */}
            <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-purple-600 ring-1 ring-white dark:ring-slate-800" />
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight ${
              activeTab === 'admin'
                ? 'font-extrabold text-purple-900 dark:text-purple-300'
                : isMoreMenuOpen || activeTab === 'opportunities'
                ? 'font-bold text-emerald-800 dark:text-emerald-400'
                : 'font-medium'
            }`}
          >
            {activeTab === 'admin' ? 'Admin' : 'More'}
          </span>
        </button>
      </nav>

      {/* Mobile More Navigation Drawer / Bottom Sheet */}
      {isMoreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto">
          {/* Dark Backdrop */}
          <div
            onClick={() => {
              setIsMoreMenuOpen(false);
              setSettingsSubmenu('main');
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div
            id="mobile-more-navigation-drawer"
            className="relative z-10 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl border-t border-gray-100 dark:border-slate-800 max-h-[85vh] flex flex-col overflow-hidden text-gray-900 dark:text-slate-100"
          >
            {/* Grabber Indicator */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 bg-gray-300 dark:bg-slate-700 rounded-full" />
            </div>

            {/* Drawer Header */}
            <div className="px-5 py-2.5 flex items-center justify-between border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                  {settingsSubmenu === 'settings' ? (
                    <Settings className="w-4 h-4" />
                  ) : settingsSubmenu === 'help' ? (
                    <HelpCircle className="w-4 h-4" />
                  ) : (
                    <MoreHorizontal className="w-4 h-4 stroke-[2.5]" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                    {settingsSubmenu === 'settings'
                      ? 'System Settings'
                      : settingsSubmenu === 'help'
                      ? 'Help & FAQs'
                      : 'More on EduKan'}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">
                    {settingsSubmenu === 'settings'
                      ? 'Preferences, dark mode & data saver'
                      : settingsSubmenu === 'help'
                      ? 'Quick guide & community support'
                      : 'Opportunities, schools, settings & admin'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {settingsSubmenu !== 'main' && (
                  <button
                    onClick={() => setSettingsSubmenu('main')}
                    className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold px-2 py-1 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setSettingsSubmenu('main');
                  }}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="px-5 py-4 overflow-y-auto space-y-4 max-h-[70vh]">
              {settingsSubmenu === 'main' && (
                <>
                  {/* Quick Profile Card */}
                  <div
                    onClick={() => {
                      setActiveTab('profile');
                      setIsMoreMenuOpen(false);
                    }}
                    className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/50 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-800 rounded-2xl border border-emerald-200/80 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-500 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-500 shadow-2xs shrink-0">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">{currentUser.name}</span>
                          <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                            Lv. 2
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-600 dark:text-slate-300 mt-0.5 flex items-center gap-2">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">{currentUser.points} EduPoints</span>
                          <span>•</span>
                          <span className="text-gray-500 dark:text-slate-400">{currentUser.school}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  </div>

                  {/* Core Navigation Grid: Library, Opportunities, Study Rooms, Schools, Admin */}
                  <div>
                    <div className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-1">
                      NAVIGATION & PORTALS
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Library */}
                      <button
                        id="more-nav-library"
                        onClick={() => {
                          setActiveTab('library');
                          setIsMoreMenuOpen(false);
                        }}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all group col-span-2 sm:col-span-1 cursor-pointer ${
                          activeTab === 'library'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-600 ring-2 ring-emerald-400/30'
                            : 'bg-white dark:bg-slate-800/90 border-gray-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/40 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                            <Library className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <span className="text-[9px] bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-bold px-1.5 py-0.5 rounded-md uppercase">
                            Books & Exams
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400">
                            National Library
                          </h4>
                          <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            Textbooks, NECTA past papers & revision notes
                          </p>
                        </div>
                      </button>

                      {/* Opportunities */}
                      <button
                        id="more-nav-opportunities"
                        onClick={() => {
                          setActiveTab('opportunities');
                          setIsMoreMenuOpen(false);
                        }}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all group cursor-pointer ${
                          activeTab === 'opportunities'
                            ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-600 ring-2 ring-amber-400/30'
                            : 'bg-white dark:bg-slate-800/90 border-gray-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-50/40 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <span className="text-[9px] bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold px-1.5 py-0.5 rounded-md uppercase">
                            New
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-400">
                            Opportunities & Grants
                          </h4>
                          <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            Scholarships, internships & tech programs
                          </p>
                        </div>
                      </button>

                      {/* Study Rooms */}
                      <button
                        id="more-nav-study"
                        onClick={() => {
                          setActiveTab('study');
                          setIsMoreMenuOpen(false);
                        }}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all group cursor-pointer ${
                          activeTab === 'study'
                            ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-600 ring-2 ring-blue-400/30'
                            : 'bg-white dark:bg-slate-800/90 border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/40 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <span className="text-[9px] bg-blue-200/80 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 font-bold px-1.5 py-0.5 rounded-md">
                            Q&A
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-800 dark:group-hover:text-blue-400">
                            Study Rooms
                          </h4>
                          <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            Topics, questions & academic discussions
                          </p>
                        </div>
                      </button>

                      {/* Schools & Chat */}
                      <button
                        id="more-nav-schools"
                        onClick={() => {
                          setActiveTab('schools');
                          setIsMoreMenuOpen(false);
                        }}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all group cursor-pointer ${
                          activeTab === 'schools'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-600 ring-2 ring-emerald-400/30'
                            : 'bg-white dark:bg-slate-800/90 border-gray-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/40 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                            <School className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <span className="text-[9px] bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-bold px-1.5 py-0.5 rounded-md">
                            Chat & Groups
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400">
                            Schools & Chat
                          </h4>
                          <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            School communities, grades & private chat
                          </p>
                        </div>
                      </button>

                      {/* Admin Panel - Only visible to authenticated Admin users */}
                      {isUserAdmin && (
                        <button
                          id="more-nav-admin"
                          onClick={() => {
                            setActiveTab('admin');
                            if (currentRole !== 'admin') {
                              setCurrentRole('admin');
                            }
                            setIsMoreMenuOpen(false);
                          }}
                          className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all group col-span-2 cursor-pointer ${
                            activeTab === 'admin'
                              ? 'bg-purple-900 text-white border-purple-800 ring-2 ring-purple-500 shadow-md'
                              : 'bg-gradient-to-r from-purple-50 via-indigo-50/50 to-purple-50 dark:from-purple-950/40 dark:via-slate-800 dark:to-purple-950/40 border-purple-200 dark:border-purple-800/70 hover:border-purple-300 dark:hover:border-purple-600 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              activeTab === 'admin' ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                            }`}>
                              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                            </div>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              activeTab === 'admin' ? 'bg-white text-purple-900' : 'bg-purple-600 text-white shadow-xs'
                            }`}>
                              Admin Panel 🛡️
                            </span>
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold ${activeTab === 'admin' ? 'text-white' : 'text-purple-950 dark:text-purple-200'}`}>
                              Admin & Security Panel
                            </h4>
                            <p className={`text-[11px] mt-0.5 ${activeTab === 'admin' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-300'}`}>
                              Manage students, register schools, emergency broadcasts, audit logs & feedback
                            </p>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Settings & Tools List */}
                  <div>
                    <div className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-1">
                      SETTINGS & TOOLS
                    </div>
                    <div className="bg-gray-50/80 dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700 divide-y divide-gray-100 dark:divide-slate-700/60 overflow-hidden">
                      {/* Dark Mode Fast Toggle Row in Mobile Drawer */}
                      {onToggleDarkMode && (
                        <div className="px-3.5 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-800 dark:text-slate-100">Dark Mode</div>
                              <div className="text-[10px] text-gray-500 dark:text-slate-400">
                                {isDarkMode ? 'Dark theme active' : 'Light theme active'}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={onToggleDarkMode}
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                              isDarkMode ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
                            }`}
                            aria-label="Toggle Dark Mode"
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                isDarkMode ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      )}

                      {/* Settings */}
                      <button
                        id="more-nav-settings-btn"
                        onClick={() => setSettingsSubmenu('settings')}
                        className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-gray-100/80 dark:hover:bg-slate-700/60 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 flex items-center justify-center">
                            <Settings className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-800 dark:text-slate-100">System Settings</div>
                            <div className="text-[10px] text-gray-500 dark:text-slate-400">Notifications, language & data saver</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>

                      {/* Switch Role - Only available for verified admin users */}
                      {isUserAdmin && (
                        <div className="px-3.5 py-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                              <SlidersHorizontal className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-800 dark:text-slate-100">Active Role</div>
                              <div className="text-[10px] text-gray-500 dark:text-slate-400">
                                {currentRole === 'student' ? 'Student (Nicolous)' : 'EduKan Admin'}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const nextRole = currentRole === 'student' ? 'admin' : 'student';
                              setCurrentRole(nextRole);
                              if (nextRole === 'admin') setActiveTab('admin');
                              else if (activeTab === 'admin') setActiveTab('feed');
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
                          >
                            Switch to {currentRole === 'student' ? 'Admin' : 'Student'}
                          </button>
                        </div>
                      )}

                      {/* Help & FAQs */}
                      <button
                        id="more-nav-help-btn"
                        onClick={() => setSettingsSubmenu('help')}
                        className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-gray-100/80 dark:hover:bg-slate-700/60 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                            <HelpCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-800 dark:text-slate-100">Help & FAQs</div>
                            <div className="text-[10px] text-gray-500 dark:text-slate-400">How to use, earn points and find scholarships</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>

                      {/* Send Feedback */}
                      {onOpenFeedback && (
                        <button
                          id="more-nav-feedback-btn"
                          onClick={() => {
                            setIsMoreMenuOpen(false);
                            onOpenFeedback();
                          }}
                          className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-amber-50/70 dark:hover:bg-amber-950/30 transition-colors text-left group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <MessageSquare className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-800 dark:text-slate-100 flex items-center gap-1.5">
                                <span>Send Feedback</span>
                                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800">+10 pts</span>
                              </div>
                              <div className="text-[10px] text-gray-500 dark:text-slate-400">Suggest improvements or submit a review</div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                      )}

                      {/* Login Page */}
                      {onOpenLogin && (
                        <button
                          id="more-nav-login-btn"
                          onClick={() => {
                            setIsMoreMenuOpen(false);
                            onOpenLogin();
                          }}
                          className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30 transition-colors text-left group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <LogIn className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-800 dark:text-slate-100">Sign In / Switch Account</div>
                              <div className="text-[10px] text-gray-500 dark:text-slate-400">Log in or create a student profile</div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Settings Submenu */}
              {settingsSubmenu === 'settings' && (
                <div className="space-y-3">
                  <div className="bg-gray-50/80 dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700 divide-y divide-gray-100 dark:divide-slate-700/60 overflow-hidden">
                    {/* Dark Mode in Settings */}
                    {onToggleDarkMode && (
                      <div className="px-3.5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-800 dark:text-slate-100">Dark Mode Theme</div>
                            <div className="text-[10px] text-gray-500 dark:text-slate-400">Comfortable viewing in low light</div>
                          </div>
                        </div>
                        <button
                          onClick={onToggleDarkMode}
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                            isDarkMode ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
                          }`}
                          aria-label="Toggle Dark Mode"
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              isDarkMode ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    )}

                    {/* Push Notifications Toggle */}
                    <div className="px-3.5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 dark:text-slate-100">System Notifications</div>
                          <div className="text-[10px] text-gray-500 dark:text-slate-400">Question replies & new opportunities</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          notificationsEnabled ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
                        }`}
                        aria-label="Toggle notifications"
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Data Saver Mode Toggle */}
                    <div className="px-3.5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 dark:text-slate-100">Data Saver Mode</div>
                          <div className="text-[10px] text-gray-500 dark:text-slate-400">Reduces animations and heavy image quality</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setDataSaverEnabled(!dataSaverEnabled)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          dataSaverEnabled ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
                        }`}
                        aria-label="Toggle data saver"
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            dataSaverEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Language Selection */}
                    <div className="px-3.5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 dark:text-slate-100">System Language</div>
                          <div className="text-[10px] text-gray-500 dark:text-slate-400">English (Selected)</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        English
                      </span>
                    </div>

                    {/* Network Connection & Offline Caching Test */}
                    <div className="px-3.5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isOnline ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        }`}>
                          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 dark:text-slate-100">Network Mode</div>
                          <div className="text-[10px] text-gray-500 dark:text-slate-400">
                            {isOnline ? 'Connected (Live Feed)' : 'Offline (Cached Feed Active)'}
                          </div>
                        </div>
                      </div>
                      {onToggleOffline && (
                        <button
                          type="button"
                          onClick={onToggleOffline}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors cursor-pointer ${
                            !isOnline
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
                              : 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100'
                          }`}
                        >
                          {!isOnline ? 'Go Online' : 'Test Offline'}
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all text-center shadow-xs cursor-pointer"
                  >
                    Open Profile & Account Details
                  </button>
                </div>
              )}

              {/* Help & Support Submenu */}
              {settingsSubmenu === 'help' && (
                <div className="space-y-3">
                  <div className="bg-emerald-50/80 dark:bg-emerald-950/60 p-3 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80">
                    <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">How to use EduKan</h4>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                      EduKan connects Tanzanian students and educators to share revision notes, solve past papers, collaborate in subject study rooms, and access global scholarship opportunities.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-2 text-xs">
                    <div className="font-semibold text-gray-800 dark:text-slate-100">Frequently Asked Questions:</div>
                    <div className="text-[11px] text-gray-600 dark:text-slate-300 space-y-1">
                      <p>
                        <strong>1. How do EduPoints work?</strong><br />
                        Earn points by asking academic questions (+5), contributing verified solutions (+10), and sharing top study resources.
                      </p>
                      <p>
                        <strong>2. How can I apply for scholarships?</strong><br />
                        Visit the <em>Opportunities</em> section, choose an opportunity, and tap 'Apply Now'.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-5 py-2.5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/80 flex items-center justify-between text-[10px] text-gray-400 dark:text-slate-500">
              <span>EduKan TZ • Education Without Borders</span>
              <span className="font-mono">Version 2.4</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
