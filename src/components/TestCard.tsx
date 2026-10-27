'use client';

import React from 'react';
import { PlacementTest, ClashInfo } from '@/types/placement';
import { getGoogleCalendarUrl } from '@/lib/calendar';
import {
  Edit2,
  Trash2,
  CalendarPlus,
  AlertCircle,
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
      className={`p-3.5 sm:p-4 rounded-xl bg-white border transition space-y-2.5 shadow-xs ${
        isClash
          ? 'border-rose-300 hover:border-rose-400 bg-rose-50/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Row: Track Badge, Entity Name, Admin Controls */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                test.track === 'mine'
                  ? 'bg-slate-100 text-slate-700 border-slate-200/80'
                  : 'bg-purple-50 text-purple-700 border-purple-200/80'
              }`}
            >
              {test.track === 'mine' ? 'PIPI' : 'Chintu'}
            </span>

            {isClash && (
              <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                <AlertCircle className="w-3 h-3" />
                <span>Slot Overlap</span>
              </span>
            )}
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate mt-1">
            {test.companyName}
          </h3>
          <p className="text-xs font-medium text-slate-600 truncate">
            {test.profileName}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 shrink-0">
          <a
            href={getGoogleCalendarUrl(test)}
            target="_blank"
            rel="noopener noreferrer"
            title="Add to Google Calendar"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
          </a>

          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(test)}
                title="Edit Record"
                className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(test.id, test.companyName)}
                title="Delete Record"
                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2-Column Mobile Data Strip */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-left">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Date
          </span>
          <span className="font-semibold text-slate-800 text-[11px] sm:text-xs truncate block">
            {formattedDate}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Slot
          </span>
          <span className="font-semibold text-slate-800 text-[11px] sm:text-xs truncate block">
            {test.testTime} ({test.durationMinutes || 90}m)
          </span>
        </div>
      </div>
    </div>
  );
};
