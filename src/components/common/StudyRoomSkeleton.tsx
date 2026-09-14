import React from 'react';

interface StudyRoomSkeletonProps {
  mode?: 'questions' | 'resources';
  count?: number;
}

export const StudyRoomSkeleton: React.FC<StudyRoomSkeletonProps> = ({
  mode = 'questions',
  count = 3
}) => {
  if (mode === 'resources') {
    return (
      <div className="space-y-3 w-full" aria-busy="true" aria-label="Inapakia notisi na nyenzo...">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={`resource-skeleton-${idx}`}
            className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
          >
            <div className="flex items-start sm:items-center gap-3.5">
              {/* File Icon Skeleton */}
              <div className="w-12 h-12 rounded-xl shimmer-element shrink-0" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {/* Subject Badge */}
                  <div className="w-16 h-5 rounded-md shimmer-element-emerald" />
                  {/* Class Level Badge */}
                  <div className="w-14 h-5 rounded-md shimmer-element" />
                </div>
                {/* Resource Title */}
                <div className="w-48 sm:w-64 h-4 rounded shimmer-element" />
                {/* Meta info (Author & Size) */}
                <div className="flex items-center gap-2">
                  <div className="w-20 h-3 rounded shimmer-element" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                  <div className="w-12 h-3 rounded shimmer-element" />
                </div>
              </div>
            </div>

            {/* Download Button Skeleton */}
            <div className="w-28 h-9 rounded-xl shimmer-element shrink-0 self-end sm:self-center" />
          </div>
        ))}
      </div>
    );
  }

  // Questions Mode Skeletons
  return (
    <div className="space-y-3.5 w-full" aria-busy="true" aria-label="Inapakia maswali ya masomo...">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`question-skeleton-${idx}`}
          className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs flex gap-3.5 sm:gap-4 relative overflow-hidden"
        >
          {/* Vote Column Skeleton */}
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50/90 border border-gray-100 w-11 shrink-0 space-y-1.5">
            <div className="w-5 h-5 rounded shimmer-element" />
            <div className="w-4 h-3.5 rounded shimmer-element" />
            <div className="w-5 h-5 rounded shimmer-element" />
          </div>

          {/* Question Details Skeleton */}
          <div className="flex-1 space-y-2.5">
            {/* Subject and Topic Badges */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-5 rounded-md shimmer-element-emerald" />
              <div className="w-20 h-5 rounded-md shimmer-element" />
            </div>

            {/* Title Skeleton */}
            <div className="space-y-1.5">
              <div className="w-full sm:w-4/5 h-4 rounded shimmer-element" />
              <div className="w-2/3 h-3.5 rounded shimmer-element" />
            </div>

            {/* Author and Answers Meta */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full shimmer-element" />
                <div className="w-24 h-3 rounded shimmer-element" />
              </div>
              <div className="w-18 h-5 rounded-full shimmer-element" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
