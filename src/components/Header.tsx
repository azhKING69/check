'use client';

import React from 'react';
import { StudentTrack } from '@/types/placement';
import { Lock, Plus, ShieldCheck, Calendar } from 'lucide-react';

interface HeaderProps {
  activeTrack: StudentTrack | 'combined';
  setActiveTrack: (track: StudentTrack | 'combined') => void;
  isAdmin: boolean;
  onOpenPinModal: () => void;
  onLockAdmin: () => void;
  onOpenAddModal: () => void;
  clashCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTrack,
  setActiveTrack,
  isAdmin,
  onOpenPinModal,
  onLockAdmin,
  onOpenAddModal,
  clashCount,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 w-full">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Primary Navigation Row */}
        <div className="flex items-center justify-between h-14 gap-2.5 sm:gap-4 min-w-0">
          {/* Brand Identity */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Calendar className="w-4 h-4 text-slate-100" />
            </div>
            <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
              Placement Ledger
            </span>
          </div>

          {/* Right Action Suite */}
          <div className="flex items-center space-x-2 shrink-0">
            {isAdmin ? (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={onOpenAddModal}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Assessment</span>
                </button>
                <button
                  onClick={onLockAdmin}
                  title="Admin unlocked. Tap to lock session."
                  className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenPinModal}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Track Switcher Strip: PIPI vs Chintu vs Dual Schedule */}
        <div className="flex items-center space-x-1.5 py-1.5 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTrack('mine')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
              activeTrack === 'mine'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            PIPI
          </button>
          <button
            onClick={() => setActiveTrack('hers')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
              activeTrack === 'hers'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Chintu
          </button>
          <button
            onClick={() => setActiveTrack('combined')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
              activeTrack === 'combined'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Conflict</span>
            {clashCount > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                {clashCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
