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
} from 'lucide-react';

interface TestTableProps {
  tests: PlacementTest[];
  isAdmin: boolean;
  onEdit: (test: PlacementTest) => void;
  onDelete: (id: string, name: string) => void;
  clashes: ClashInfo[];
}

export const TestTable: React.FC<TestTableProps> = ({
  tests,
  isAdmin,
  onEdit,
  onDelete,
  clashes,
}) => {
  // Check if a test has a direct clash
  const isDirectClash = (testId: string) =>
    clashes.some(
      (c) =>
        c.type === 'direct_clash' &&
        (c.test1.id === testId || c.test2.id === testId)
    );

  if (tests.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
        <Calendar className="w-10 h-10 mx-auto text-zinc-400 mb-2" />
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          No tests found for this filter
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Add a new company test or try changing the search filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-zinc-50/80 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Track</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Profile</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Details / Links</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {tests.map((test) => {
              const clash = isDirectClash(test.id);
              const dateObj = new Date(test.testDate);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });

              return (
                <tr
                  key={test.id}
                  className={`hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors ${
                    clash ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                  }`}
                >
                  {/* Track Badge */}
                  <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        test.track === 'mine'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {test.track === 'mine' ? '🎓 My College' : '🌸 Her College'}
                    </span>
                  </td>

                  {/* Company Name */}
                  <td className="py-3.5 px-4 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {test.companyName}
                      </span>
                      {clash && (
                        <span
                          title="Clashes with partner's test!"
                          className="p-1 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Profile Name */}
                  <td className="py-3.5 px-4 align-middle text-zinc-600 dark:text-zinc-300 font-medium">
                    {test.profileName}
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {formattedDate}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{test.testTime}</span>
                      <span className="text-zinc-400">({test.durationMinutes || 90}m)</span>
                    </div>
                  </td>

                  {/* Notes / Links */}
                  <td className="py-3.5 px-4 align-middle max-w-[200px]">
                    <div className="space-y-1">
                      {test.testLink && (
                        <a
                          href={test.testLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Portal Link</span>
                        </a>
                      )}
                      {test.notes && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate" title={test.notes}>
                          {test.notes}
                        </p>
                      )}
                      {!test.testLink && !test.notes && (
                        <span className="text-zinc-400 text-xs italic">-</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Google Calendar Link */}
                      <a
                        href={getGoogleCalendarUrl(test)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Add to Google Calendar"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        <CalendarPlus className="w-4 h-4" />
                      </a>

                      {/* Admin Actions */}
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onEdit(test)}
                            title="Edit Test"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(test.id, test.companyName)}
                            title="Delete Test"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
