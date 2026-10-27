'use client';

import React, { useEffect, useState } from 'react';
import { PlacementTest } from '@/types/placement';
import { getTestDateTime } from '@/lib/clashDetector';
import { getGoogleCalendarUrl } from '@/lib/calendar';
import { Clock, Calendar, ArrowRight, ExternalLink } from 'lucide-react';

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

  if (!nextTest) {
    return (
      <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-5 text-center">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          🎉 No upcoming tests scheduled right now. Take a deep breath or add new dates!
        </p>
      </div>
    );
  }

  const formattedDate = new Date(nextTest.testDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-900 text-white shadow-xl border border-indigo-900/40 p-5 sm:p-6">
      {/* Background glow decoration */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              Next Scheduled Test
            </span>

            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                nextTest.track === 'mine'
                  ? 'bg-blue-600/30 text-blue-200 border border-blue-500/30'
                  : 'bg-rose-600/30 text-rose-200 border border-rose-500/30'
              }`}
            >
              {nextTest.track === 'mine' ? '🎓 My College' : '🌸 Her College'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {nextTest.companyName}
          </h2>
          <p className="text-zinc-300 font-medium text-sm sm:text-base mt-0.5">
            {nextTest.profileName}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs sm:text-sm text-zinc-300">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              {nextTest.testTime} (Duration: {nextTest.durationMinutes || 90}m)
            </span>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex flex-col sm:items-end gap-3 border-t sm:border-t-0 pt-4 sm:pt-0 border-zinc-800">
          <div className="flex items-center gap-2">
            {timeLeft && !timeLeft.isPast ? (
              <>
                {timeLeft.days > 0 && (
                  <div className="flex flex-col items-center bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-zinc-800 min-w-[50px]">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                      {timeLeft.days}
                    </span>
                    <span className="text-[10px] uppercase text-zinc-400">Days</span>
                  </div>
                )}
                <div className="flex flex-col items-center bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-zinc-800 min-w-[50px]">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase text-zinc-400">Hours</span>
                </div>
                <div className="flex flex-col items-center bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-zinc-800 min-w-[50px]">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase text-zinc-400">Mins</span>
                </div>
                <div className="flex flex-col items-center bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-zinc-800 min-w-[50px]">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-blue-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase text-zinc-400">Secs</span>
                </div>
              </>
            ) : (
              <div className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-sm font-semibold">
                Starting / In Progress!
              </div>
            )}
          </div>

          {/* Quick Add to Calendar Button */}
          <a
            href={getGoogleCalendarUrl(nextTest)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Add to Google Calendar</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
};
