'use client';

import React from 'react';
import { PlacementTest, ClashInfo } from '@/types/placement';
import { getGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendar';
import {
  Calendar,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  CalendarPlus,
  AlertTriangle,
  Download,
} from 'lucide-react';

interface TestCardProps {
  test: PlacementTest;
  isAdmin: boolean;
  onEdit: (test: PlacementTest) => void;
  onDelete: (id: string, name: string) => void;
  clashes: ClashInfo[];
}

export const TestCard: React.FC<TestCardProps> = ({
  test,
  isAdmin,
  onEdit,
  onDelete,
  clashes,
}) => {
  const isClash = clashes.some(
    (c) =>
      c.type === 'direct_clash' &&
      (c.test1.id === test.id || c.test2.id === test.id)
  );

  const dateObj = new Date(test.testDate);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-xs ${
        isClash
          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900 ring-1 ring-rose-500/30'
          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Track Badge & Clash Indicator */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              test.track === 'mine'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {test.track === 'mine' ? '🎓 My College' : '🌸 Her College'}
          </span>

          {isClash && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              Slot Clash!
            </span>
          )}
        </div>

        {/* Admin Quick Actions */}
        {isAdmin && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(test)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 bg-zinc-100 dark:bg-zinc-800 transition"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(test.id, test.companyName)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 bg-zinc-100 dark:bg-zinc-800 transition"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Info */}
      <div className="mt-2.5">
        <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50">
          {test.companyName}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-0.5">
          {test.profileName}
        </p>
      </div>

      {/* Date & Time pill */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          {formattedDate}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          {test.testTime} ({test.durationMinutes || 90}m)
        </span>
      </div>

      {/* Notes / Links */}
      {test.notes && (
        <div className="mt-2.5 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
          {test.notes}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
        {test.testLink ? (
          <a
            href={test.testLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Test Portal Link</span>
          </a>
        ) : (
          <span className="text-xs text-zinc-400 italic">No link provided</span>
        )}

        <div className="flex items-center gap-1.5">
          <a
            href={getGoogleCalendarUrl(test)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Add to Cal</span>
          </a>
        </div>
      </div>
    </div>
  );
};
