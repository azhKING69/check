'use client';

import React from 'react';
import { PlacementTest, ClashInfo } from '@/types/placement';
import { Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getTestDateTime } from '@/lib/clashDetector';

interface KpiRibbonProps {
  upcomingTests: PlacementTest[];
  pastTests: PlacementTest[];
  clashes: ClashInfo[];
}

export const KpiRibbon: React.FC<KpiRibbonProps> = ({
  upcomingTests,
  pastTests,
  clashes,
}) => {
  const nextTest = upcomingTests[0] || null;
  const directClashes = clashes.filter((c) => c.type === 'direct_clash');

  // Compute countdown for next test
  let nextTestTimeLabel = 'None';
  if (nextTest) {
    const target = getTestDateTime(nextTest.testDate, nextTest.testTime).getTime();
    const diff = target - Date.now();
    if (diff <= 0) {
      nextTestTimeLabel = 'Active Now';
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        nextTestTimeLabel = `In ${days}d ${hours % 24}h`;
      } else {
        nextTestTimeLabel = `In ${hours}h ${mins}m`;
      }
    }
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 min-w-0">
      {/* KPI 1: Next Assessment */}
      <div className="p-3.5 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
        <div className="flex justify-between items-start">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
            Next Assessment
          </span>
          <div className="shrink-0 text-blue-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="my-1.5 sm:my-2">
          <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight truncate block">
            {nextTest ? nextTest.companyName : 'None Pending'}
          </span>
        </div>
        <span className="text-[11px] sm:text-xs font-medium truncate text-blue-600">
          {nextTest ? `${nextTestTimeLabel} - ${nextTest.testTime}` : 'All caught up'}
        </span>
      </div>

      {/* KPI 2: Total Active Pipeline */}
      <div className="p-3.5 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
        <div className="flex justify-between items-start">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
            Upcoming Pipeline
          </span>
          <div className="shrink-0 text-slate-700">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="my-1.5 sm:my-2">
          <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight truncate block">
            {upcomingTests.length}
          </span>
        </div>
        <span className="text-[11px] sm:text-xs font-medium truncate text-slate-500">
          Scheduled rounds in queue
        </span>
      </div>

      {/* KPI 3: Conflict Radar */}
      <div className="p-3.5 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
        <div className="flex justify-between items-start">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
            Conflict Radar
          </span>
          <div className={`shrink-0 ${directClashes.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="my-1.5 sm:my-2">
          <span className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight truncate block ${
            directClashes.length > 0 ? 'text-rose-600' : 'text-slate-900'
          }`}>
            {directClashes.length}
          </span>
        </div>
        <span className={`text-[11px] sm:text-xs font-medium truncate ${
          directClashes.length > 0 ? 'text-rose-600 font-semibold' : 'text-emerald-600'
        }`}>
          {directClashes.length > 0 ? 'Direct slot overlap detected' : 'Zero slot conflicts'}
        </span>
      </div>

      {/* KPI 4: Completed Rounds */}
      <div className="p-3.5 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
        <div className="flex justify-between items-start">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
            Completed Rounds
          </span>
          <div className="shrink-0 text-slate-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="my-1.5 sm:my-2">
          <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight truncate block">
            {pastTests.length}
          </span>
        </div>
        <span className="text-[11px] sm:text-xs font-medium truncate text-slate-500">
          Archived assessments
        </span>
      </div>
    </div>
  );
};
