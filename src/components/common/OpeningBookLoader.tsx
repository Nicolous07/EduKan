import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';

interface OpeningBookLoaderProps {
  message?: string;
  subMessage?: string;
  compact?: boolean;
}

const LEARNING_TIPS = [
  'Kusoma kwa pamoja na wenzako huongeza uelewa kwa 60%!',
  'Wanafunzi wanaouliza maswali hufanya vizuri zaidi katika mitihani ya NECTA.',
  'Kila jibu zuri unalotoa linakupa EduPoints 15 na kukuza beji yako!',
  'Angalia notisi zilizothibitishwa za Physics, Math na Biology.'
];

export const OpeningBookLoader: React.FC<OpeningBookLoaderProps> = ({
  message = 'Inafungua Kitabu cha Masomo...',
  subMessage = 'Kupakia maswali ya mtihani, mijadala na notisi za masomo...',
  compact = false
}) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LEARNING_TIPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full flex flex-col items-center justify-center text-center ${compact ? 'py-6 px-4' : 'py-12 px-6'} select-none`}>
      {/* 3D Animated Opening Book Stage */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Soft Ambient Light Glow */}
        <div className="absolute -inset-4 bg-emerald-400/20 rounded-full blur-xl animate-book-glow pointer-events-none" />

        {/* Floating Sparkles */}
        <div className="absolute -top-3 -right-2 text-amber-500 animate-bounce">
          <Sparkles className="w-4 h-4 fill-amber-400" />
        </div>
        <div className="absolute -bottom-2 -left-2 text-emerald-600 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 fill-emerald-500" />
        </div>

        {/* Book Container with 3D perspective */}
        <div className="relative w-28 h-20 perspective-800 flex items-center justify-center">
          {/* Back Cover / Book Spine Base */}
          <div className="absolute inset-0 bg-emerald-900 rounded-md shadow-lg border border-emerald-950 flex items-center justify-between px-1">
            {/* Left Cover Page */}
            <div className="w-[52px] h-[72px] bg-emerald-800 rounded-l-sm border-r border-emerald-900/50 flex flex-col justify-between p-1.5 shadow-inner">
              <div className="w-4 h-1 bg-emerald-600/60 rounded" />
              <div className="space-y-1">
                <div className="w-8 h-0.5 bg-emerald-700/60 rounded" />
                <div className="w-6 h-0.5 bg-emerald-700/60 rounded" />
              </div>
            </div>
            {/* Book Spine Center */}
            <div className="w-1.5 h-full bg-emerald-950 rounded-xs flex flex-col items-center justify-center py-1">
              <div className="w-0.5 h-full bg-amber-400/40 rounded-full" />
            </div>
            {/* Right Cover Page */}
            <div className="w-[52px] h-[72px] bg-emerald-800 rounded-r-sm border-l border-emerald-900/50 flex flex-col justify-between p-1.5 items-end shadow-inner">
              <div className="w-4 h-1 bg-emerald-600/60 rounded" />
              <div className="space-y-1 text-right">
                <div className="w-8 h-0.5 bg-emerald-700/60 rounded ml-auto" />
                <div className="w-6 h-0.5 bg-emerald-700/60 rounded ml-auto" />
              </div>
            </div>
          </div>

          {/* Golden Ribbon / Bookmark Hanging Out */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-4 bg-amber-500 shadow-xs rounded-b-xs border-x border-amber-600 z-30" />

          {/* Left Static Inside Page */}
          <div className="absolute left-[3px] top-[4px] w-[50px] h-[70px] bg-emerald-50 rounded-l-xs border border-emerald-200/80 shadow-xs p-1.5 flex flex-col justify-between z-10">
            <div className="space-y-1">
              <div className="w-7 h-1 bg-emerald-300 rounded" />
              <div className="w-9 h-0.5 bg-emerald-200 rounded" />
              <div className="w-8 h-0.5 bg-emerald-200 rounded" />
              <div className="w-6 h-0.5 bg-emerald-200 rounded" />
            </div>
            <div className="text-[7px] text-emerald-600/70 font-mono font-bold">A+</div>
          </div>

          {/* Right Static Inside Page */}
          <div className="absolute right-[3px] top-[4px] w-[50px] h-[70px] bg-emerald-50 rounded-r-xs border border-emerald-200/80 shadow-xs p-1.5 flex flex-col justify-between items-end z-10">
            <div className="space-y-1 text-right">
              <div className="w-7 h-1 bg-emerald-300 rounded ml-auto" />
              <div className="w-9 h-0.5 bg-emerald-200 rounded ml-auto" />
              <div className="w-8 h-0.5 bg-emerald-200 rounded ml-auto" />
              <div className="w-5 h-0.5 bg-emerald-200 rounded ml-auto" />
            </div>
            <BookOpen className="w-2.5 h-2.5 text-emerald-500" />
          </div>

          {/* Turning Page 1 */}
          <div className="absolute right-[5px] top-[4px] w-[48px] h-[70px] bg-white border border-emerald-100/90 shadow-sm p-1.5 z-20 page-flip-1 flex flex-col justify-around">
            <div className="w-7 h-1 bg-emerald-200 rounded" />
            <div className="w-8 h-0.5 bg-gray-200 rounded" />
            <div className="w-6 h-0.5 bg-gray-200 rounded" />
          </div>

          {/* Turning Page 2 */}
          <div className="absolute right-[5px] top-[4px] w-[48px] h-[70px] bg-amber-50/70 border border-emerald-100 shadow-sm p-1.5 z-20 page-flip-2 flex flex-col justify-around">
            <div className="w-6 h-1 bg-amber-200 rounded" />
            <div className="w-7 h-0.5 bg-gray-200 rounded" />
            <div className="w-5 h-0.5 bg-gray-200 rounded" />
          </div>

          {/* Turning Page 3 */}
          <div className="absolute right-[5px] top-[4px] w-[48px] h-[70px] bg-emerald-50/90 border border-emerald-200/80 shadow-sm p-1.5 z-20 page-flip-3 flex flex-col justify-around">
            <div className="w-7 h-1 bg-emerald-300/80 rounded" />
            <div className="w-8 h-0.5 bg-emerald-200/80 rounded" />
            <div className="w-6 h-0.5 bg-emerald-200/80 rounded" />
          </div>
        </div>
      </div>

      {/* Loading Messages */}
      <div className="max-w-md mx-auto space-y-1.5">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 font-heading flex items-center justify-center gap-1.5">
          <span>{message}</span>
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          {subMessage}
        </p>

        {/* Rotating Learning Tip Pill */}
        {!compact && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50/90 border border-emerald-200/80 rounded-full text-[11px] text-emerald-800 shadow-2xs transition-all duration-300">
            <span className="font-bold text-emerald-700 bg-emerald-200/70 px-1.5 py-0.2 rounded-full text-[9px]">
              DOKEZO
            </span>
            <span className="truncate max-w-[280px] sm:max-w-sm">{LEARNING_TIPS[tipIndex]}</span>
          </div>
        )}
      </div>
    </div>
  );
};
