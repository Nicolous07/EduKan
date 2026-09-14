import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  GraduationCap,
  School,
  Library,
  Compass,
  ShieldCheck,
  Award,
  Layers
} from 'lucide-react';

export type LoadingPageType =
  | 'feed'
  | 'study'
  | 'library'
  | 'schools'
  | 'opportunities'
  | 'profile'
  | 'admin'
  | 'default';

interface EduLoadingProps {
  fullScreen?: boolean;
  pageKey?: LoadingPageType | string;
  message?: string;
  subMessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface PageThemeConfig {
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  badgeStyle: string;
  containerGradient: string;
  ringBorder: string;
  dashBorder: string;
  glowPing: string;
  defaultTitle: string;
  defaultQuote: string;
  dotColors: [string, string, string];
}

const PAGE_THEMES: Record<string, PageThemeConfig> = {
  feed: {
    icon: Compass,
    badge: 'Community Feed',
    badgeStyle: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    containerGradient: 'from-emerald-600 via-emerald-700 to-teal-800',
    ringBorder: 'border-t-emerald-600 border-r-teal-500 border-b-amber-400',
    dashBorder: 'border-emerald-400/60',
    glowPing: 'bg-emerald-500/20',
    defaultTitle: 'Loading Posts & National Discussions...',
    defaultQuote: 'Connect with students and educators from across Tanzania.',
    dotColors: ['bg-emerald-600', 'bg-teal-500', 'bg-amber-400']
  },
  study: {
    icon: BookOpen,
    badge: 'Study Rooms',
    badgeStyle: 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700',
    containerGradient: 'from-teal-600 via-cyan-700 to-blue-800',
    ringBorder: 'border-t-teal-500 border-r-cyan-400 border-b-emerald-400',
    dashBorder: 'border-teal-400/60',
    glowPing: 'bg-teal-500/20',
    defaultTitle: 'Preparing Questions, Answers & Science Rooms...',
    defaultQuote: 'Learn PCB, PCM, HGL, CBG and O-Level subjects with top teachers.',
    dotColors: ['bg-teal-600', 'bg-cyan-500', 'bg-emerald-400']
  },
  library: {
    icon: Library,
    badge: 'Digital Library',
    badgeStyle: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    containerGradient: 'from-amber-600 via-yellow-700 to-emerald-800',
    ringBorder: 'border-t-amber-500 border-r-emerald-500 border-b-yellow-400',
    dashBorder: 'border-amber-400/60',
    glowPing: 'bg-amber-500/20',
    defaultTitle: 'Opening Digital Library: Books, Notes & NECTA Past Papers...',
    defaultQuote: 'Over 2,500 curated books and past examinations in your pocket.',
    dotColors: ['bg-amber-600', 'bg-emerald-500', 'bg-yellow-400']
  },
  schools: {
    icon: School,
    badge: 'School Communities',
    badgeStyle: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    containerGradient: 'from-blue-600 via-indigo-700 to-emerald-800',
    ringBorder: 'border-t-blue-500 border-r-indigo-500 border-b-emerald-400',
    dashBorder: 'border-blue-400/60',
    glowPing: 'bg-blue-500/20',
    defaultTitle: 'Gathering School Profiles, Fees & Academic Rankings...',
    defaultQuote: 'Discover top schools and academic excellence across the nation.',
    dotColors: ['bg-blue-600', 'bg-indigo-500', 'bg-emerald-400']
  },
  opportunities: {
    icon: Sparkles,
    badge: 'Opportunities & Scholarships',
    badgeStyle: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    containerGradient: 'from-purple-600 via-fuchsia-700 to-amber-700',
    ringBorder: 'border-t-purple-500 border-r-amber-400 border-b-fuchsia-400',
    dashBorder: 'border-purple-400/60',
    glowPing: 'bg-purple-500/20',
    defaultTitle: 'Filtering Scholarships, Competitions & Fellowships...',
    defaultQuote: 'Scholarships and educational programs in Tanzania and abroad await.',
    dotColors: ['bg-purple-600', 'bg-amber-500', 'bg-fuchsia-400']
  },
  profile: {
    icon: GraduationCap,
    badge: 'Scholar Profile',
    badgeStyle: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700',
    containerGradient: 'from-rose-600 via-purple-700 to-emerald-800',
    ringBorder: 'border-t-rose-500 border-r-purple-500 border-b-emerald-400',
    dashBorder: 'border-rose-400/60',
    glowPing: 'bg-rose-500/20',
    defaultTitle: 'Loading Academic Records, Points & Achievement Badges...',
    defaultQuote: 'Every step you take in education shapes tomorrow’s success.',
    dotColors: ['bg-rose-600', 'bg-purple-500', 'bg-emerald-400']
  },
  admin: {
    icon: ShieldCheck,
    badge: 'Master Admin',
    badgeStyle: 'bg-purple-900 dark:bg-purple-950 text-purple-100 border-purple-700',
    containerGradient: 'from-purple-800 via-indigo-900 to-black',
    ringBorder: 'border-t-purple-400 border-r-amber-400 border-b-teal-400',
    dashBorder: 'border-purple-300/60',
    glowPing: 'bg-purple-600/30',
    defaultTitle: 'Verifying Master Admin Console (Nicolous Munisi)...',
    defaultQuote: 'Security, content moderation, and nation-wide EduKan administration.',
    dotColors: ['bg-purple-500', 'bg-amber-400', 'bg-teal-400']
  },
  default: {
    icon: BookOpen,
    badge: 'EduKan Tanzania',
    badgeStyle: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    containerGradient: 'from-emerald-600 via-emerald-700 to-teal-800',
    ringBorder: 'border-t-emerald-600 border-r-teal-500 border-b-amber-400',
    dashBorder: 'border-emerald-400/60',
    glowPing: 'bg-emerald-500/20',
    defaultTitle: 'Loading Educational System...',
    defaultQuote: 'Education is the illumination of life and liberation of thought.',
    dotColors: ['bg-emerald-600', 'bg-teal-500', 'bg-amber-400']
  }
};

export const EduLoading: React.FC<EduLoadingProps> = ({
  fullScreen = false,
  pageKey = 'default',
  message,
  subMessage,
  size = 'md'
}) => {
  const currentTheme = PAGE_THEMES[pageKey] || PAGE_THEMES.default;
  const IconComponent = currentTheme.icon;

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-300">
      {/* Animated Orbiting Ring & Logo Container */}
      <div className={`relative flex items-center justify-center ${sizeClasses[size]} mb-4`}>
        {/* Outer Pulsing Aura */}
        <div className={`absolute inset-0 rounded-full ${currentTheme.glowPing} animate-ping duration-1000`} />

        {/* Outer Rotating Gradient Ring */}
        <div className={`absolute inset-0 rounded-full border-3 border-transparent ${currentTheme.ringBorder} animate-spin duration-700`} />

        {/* Inner Counter-Rotating Dash Ring */}
        <div className={`absolute inset-1.5 rounded-full border-2 border-dashed ${currentTheme.dashBorder} animate-spin [animation-duration:3s] [animation-direction:reverse]`} />

        {/* Center Themed Glow Badge */}
        <div className={`relative w-3/4 h-3/4 rounded-2xl bg-gradient-to-br ${currentTheme.containerGradient} flex items-center justify-center text-white shadow-lg transform hover:scale-105 transition-transform`}>
          <IconComponent className="w-1/2 h-1/2 text-white animate-pulse" />

          {/* Floating Sparkle */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
          </span>
        </div>
      </div>

      {/* Brand Title with Dynamic Per-Page Category Tag */}
      <div className="flex flex-col sm:flex-row items-center gap-1.5 mb-1.5">
        <div className="flex items-center gap-1">
          <span className="font-heading font-black text-emerald-950 dark:text-emerald-300 tracking-tight text-base sm:text-lg">
            Edu<span className="text-emerald-700 dark:text-emerald-400">Kan</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-md border border-emerald-300/60 dark:border-emerald-800/80">
            Tanzania
          </span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${currentTheme.badgeStyle}`}>
          {currentTheme.badge}
        </span>
      </div>

      {/* Dynamic Animated Status Text */}
      <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-slate-100 max-w-xs animate-pulse mt-0.5">
        {message || currentTheme.defaultTitle}
      </p>

      {/* Per-Page Academic Quote */}
      <div className="mt-2 min-h-[22px] max-w-xs flex items-center justify-center">
        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium italic transition-all duration-300">
          {subMessage || currentTheme.defaultQuote}
        </p>
      </div>

      {/* Visual Bouncing Dots with Theme-matched Colors */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className={`w-2 h-2 rounded-full ${currentTheme.dotColors[0]} animate-bounce [animation-delay:-0.3s]`} />
        <span className={`w-2 h-2 rounded-full ${currentTheme.dotColors[1]} animate-bounce [animation-delay:-0.15s]`} />
        <span className={`w-2 h-2 rounded-full ${currentTheme.dotColors[2]} animate-bounce`} />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-8 border border-emerald-100 dark:border-slate-800 shadow-2xl max-w-sm w-full mx-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
