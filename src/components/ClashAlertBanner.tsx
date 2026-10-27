'use client';

import React from 'react';
import { ClashInfo } from '@/types/placement';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface ClashAlertBannerProps {
  clashes: ClashInfo[];
}

export const ClashAlertBanner: React.FC<ClashAlertBannerProps> = ({ clashes }) => {
  if (clashes.length === 0) return null;

  const directClashes = clashes.filter((c) => c.type === 'direct_clash');
  const sameDayClashes = clashes.filter((c) => c.type === 'same_day');

  return (
    <div className="space-y-3">
      {/* Direct Slot Overlap Alert */}
      {directClashes.length > 0 && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-rose-900 tracking-tight">
                  Direct Slot Conflict Detected
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                  {directClashes.length} Overlapping {directClashes.length === 1 ? 'Slot' : 'Slots'}
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-0.5">
                Overlapping examination windows require scheduling coordination or platform priority.
              </p>

              <div className="mt-3 space-y-2">
                {directClashes.map((c, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-white border border-rose-200/80 text-xs shadow-2xs"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="font-bold text-slate-900 shrink-0">
                        {c.test1.testDate}:
                      </span>
                      <span className="font-semibold text-slate-900 truncate">
                        Candidate 1: {c.test1.companyName} ({c.test1.testTime})
                      </span>
                      <span className="text-slate-400 shrink-0">-</span>
                      <span className="font-semibold text-purple-700 truncate">
                        Candidate 2: {c.test2.companyName} ({c.test2.testTime})
                      </span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                      Direct Overlap
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Same-Date Warning */}
      {sameDayClashes.length > 0 && directClashes.length === 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-amber-900 tracking-tight">
                  Same-Date Notice
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                  {sameDayClashes.length} {sameDayClashes.length === 1 ? 'Date' : 'Dates'}
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                Both candidates have examinations scheduled on the same calendar date, but hours do not directly overlap.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
