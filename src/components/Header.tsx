'use client';

import React from 'react';
import { StudentTrack } from '@/types/placement';
import { Lock, Unlock, Plus, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTrack: StudentTrack | 'combined';
  setActiveTrack: (track: StudentTrack | 'combined') => void;
  isAdmin: boolean;
  onOpenPinModal: () => void;
  onLockAdmin: () => void;
  onOpenAddModal: () => void;
  clashCount: number;
  isFirebaseActive: boolean;
  onOpenCloudModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTrack,
  setActiveTrack,
  isAdmin,
  onOpenPinModal,
  onLockAdmin,
  onOpenAddModal,
  clashCount,
  isFirebaseActive,
  onOpenCloudModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6">
        {/* Top row: Brand + Admin & Sync status */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                Placement Board
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Live
                </span>
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Sorted test schedule & clash radar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Cloud Sync Status Pill */}
            <button
              onClick={onOpenCloudModal}
              title={isFirebaseActive ? "Connected to Cloud Firestore" : "Running locally. Tap to setup 24/7 Cloud Sync"}
              className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition ${
                isFirebaseActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isFirebaseActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isFirebaseActive ? 'Cloud Synced' : 'Cloud Setup'}
            </button>

            {/* Admin Toggle */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAddModal}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg shadow-sm transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Test</span>
                </button>
                <button
                  onClick={onLockAdmin}
                  title="Admin unlocked. Tap to lock"
                  className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 border border-emerald-300 dark:border-emerald-800 transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenPinModal}
                title="Admin Login to Add/Edit tests"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* View Switcher Tabs (My College, Her College, Dual / Clash View) */}
        <div className="mt-3 flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTrack('mine')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTrack === 'mine'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              🎓 My College
            </button>
            <button
              onClick={() => setActiveTrack('hers')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTrack === 'hers'
                  ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              🌸 Her College
            </button>
            <button
              onClick={() => setActiveTrack('combined')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTrack === 'combined'
                  ? 'bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <span>⚡ Both & Clashes</span>
              {clashCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold inline-flex items-center justify-center animate-pulse">
                  {clashCount}
                </span>
              )}
            </button>
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400 hidden md:block">
            {activeTrack === 'combined'
              ? 'Comparing both schedules for slot clashes'
              : `Viewing ${activeTrack === 'mine' ? 'your' : "her"} college board`}
          </div>
        </div>
      </div>
    </header>
  );
};
