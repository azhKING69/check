'use client';

import React, { useEffect, useState } from 'react';
import { PlacementTest } from '@/types/placement';
import { getTestDateTime } from '@/lib/clashDetector';
import { getGoogleCalendarUrl } from '@/lib/calendar';
import { Clock, Calendar, CalendarPlus, ExternalLink } from 'lucide-react';

interface NextTestBannerProps {
  upcomingTests: PlacementTest[];
}

export const NextTestBanner: React.FC<NextTestBannerProps> = ({ upcomingTests }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  } | null>(null);

  const nextTest = upcomingTests[0] || null;

  useEffect(() => {
    if (!nextTest) {
      setTimeLeft(null);
      return;
    }

    const targetDate = getTestDateTime(nextTest.testDate, nextTest.testTime);

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextTest]);

  if (!nextTest) return null;

  const formattedDate = new Date(nextTest.testDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Specification Column */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
              <span>Immediate Assessment</span>
            </span>

            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                nextTest.track === 'mine'
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-purple-50 text-purple-700 border-purple-200/60'
              }`}
            >
              {nextTest.track === 'mine' ? 'Candidate 1' : 'Candidate 2'}
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {nextTest.companyName}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
              {nextTest.profileName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
            <span className="inline-flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800">{formattedDate}</span>
            </span>
            <span className="inline-flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800">{nextTest.testTime}</span>
              <span>({nextTest.durationMinutes || 90} mins window)</span>
            </span>
          </div>
        </div>

        {/* Right Countdown & Action Suite */}
        <div className="flex flex-col sm:items-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {/* Strict Tabular Numbers Countdown */}
          <div className="flex items-center space-x-1.5">
            {timeLeft && !timeLeft.isPast ? (
              <>
                {timeLeft.days > 0 && (
                  <div className="flex flex-col items-center bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg min-w-[46px]">
                    <span className="text-base sm:text-lg font-extrabold font-mono text-slate-900 leading-none">
                      {timeLeft.days}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 mt-1">Days</span>
                  </div>
                )}
                <div className="flex flex-col items-center bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg min-w-[46px]">
                  <span className="text-base sm:text-lg font-extrabold font-mono text-slate-900 leading-none">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400 mt-1">Hours</span>
                </div>
                <div className="flex flex-col items-center bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg min-w-[46px]">
                  <span className="text-base sm:text-lg font-extrabold font-mono text-slate-900 leading-none">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400 mt-1">Mins</span>
                </div>
                <div className="flex flex-col items-center bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg min-w-[46px]">
                  <span className="text-base sm:text-lg font-extrabold font-mono text-blue-600 leading-none">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400 mt-1">Secs</span>
                </div>
              </>
            ) : (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Assessment In Progress
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {nextTest.testLink && (
              <a
                href={nextTest.testLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                <span>Portal Link</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
            <a
              href={getGoogleCalendarUrl(nextTest)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Add to Calendar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
