'use client';

import React from 'react';
import { ClashInfo } from '@/types/placement';
import { AlertCircle, AlertTriangle, Flame } from 'lucide-react';

interface ClashAlertBannerProps {
  clashes: ClashInfo[];
}

export const ClashAlertBanner: React.FC<ClashAlertBannerProps> = ({ clashes }) => {
  if (clashes.length === 0) return null;

  const directClashes = clashes.filter((c) => c.type === 'direct_clash');
  const sameDayClashes = clashes.filter((c) => c.type === 'same_day');

  return (
    <div className="space-y-3">
      {directClashes.length > 0 && (
        <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
                <span>Direct Slot Clash Detected!</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-300">
                  {directClashes.length} {directClashes.length === 1 ? 'Slot Overlap' : 'Slot Overlaps'}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 mt-1">
                You and your girlfriend have tests scheduled at overlapping times!
              </p>

              <div className="mt-3 space-y-2">
                {directClashes.map((c, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-rose-200 dark:border-rose-900 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {c.test1.testDate}:
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        (You) {c.test1.companyName} at {c.test1.testTime}
                      </span>
                      <span className="text-zinc-400">vs</span>
                      <span className="text-rose-600 dark:text-rose-400 font-medium">
                        (Her) {c.test2.companyName} at {c.test2.testTime}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-md self-start sm:self-auto">
                      Time Overlap
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {sameDayClashes.length > 0 && directClashes.length === 0 && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Same-Day Exams: {sameDayClashes.length} date(s) match
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                Both of you have tests on the same day, but timings do not directly clash.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
