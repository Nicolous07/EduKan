import React from 'react';

interface FeedSkeletonProps {
  count?: number;
}

export const FeedSkeleton: React.FC<FeedSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-4 w-full" aria-busy="true" aria-label="Inapakia machapisho...">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`feed-skeleton-${idx}`}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-4 relative overflow-hidden"
        >
          {/* Subtle Ambient Pulse Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar Shimmer Circle */}
              <div className="w-10 h-10 rounded-full shimmer-element shrink-0" />
              <div className="space-y-2">
                {/* Author Name Shimmer */}
                <div className="w-28 sm:w-36 h-3.5 rounded-md shimmer-element" />
                {/* School Name & Level Shimmer */}
                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-24 h-2.5 rounded-sm shimmer-element" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                  <div className="w-12 h-2.5 rounded-sm shimmer-element" />
                </div>
              </div>
            </div>

            {/* Category / Subject Pill Skeleton */}
            <div className="w-16 h-6 rounded-full shimmer-element-emerald" />
          </div>

          {/* Post Content Skeleton Lines */}
          <div className="space-y-2 pt-1">
            <div className="w-full h-3.5 rounded shimmer-element" />
            <div className="w-11/12 h-3.5 rounded shimmer-element" />
            <div className="w-3/5 h-3.5 rounded shimmer-element" />
          </div>

          {/* Media Placeholder Skeleton (on every alternate card) */}
          {idx % 2 === 0 && (
            <div className="w-full h-44 sm:h-52 rounded-xl shimmer-element relative flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center">
                <div className="w-6 h-6 rounded-md bg-gray-300/60" />
              </div>
            </div>
          )}

          {/* Action Buttons Skeleton Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Like Button Skeleton */}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md shimmer-element" />
                <div className="w-6 h-2.5 rounded shimmer-element" />
              </div>
              {/* Comment Button Skeleton */}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md shimmer-element" />
                <div className="w-6 h-2.5 rounded shimmer-element" />
              </div>
              {/* Share Button Skeleton */}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md shimmer-element" />
              </div>
            </div>

            {/* Bookmark Skeleton */}
            <div className="w-5 h-5 rounded-md shimmer-element" />
          </div>
        </div>
      ))}
    </div>
  );
};
