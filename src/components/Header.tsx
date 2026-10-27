'use client';

import React from 'react';
import { StudentTrack } from '@/types/placement';
import { Lock, Plus, ShieldCheck, Database, Calendar } from 'lucide-react';

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
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 w-full">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Primary Navigation Row - Strict Single-Row Mobile Layout */}
        <div className="flex items-center justify-between h-14 gap-2.5 sm:gap-4 min-w-0">
          {/* Brand Identity */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Calendar className="w-4 h-4 text-slate-100" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                  Placement Ledger
                </span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <span className="hidden sm:inline">Active Synchronized</span>
                  <span className="sm:hidden">Live</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Suite */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Cloud Persistence State */}
            <button
              onClick={onOpenCloudModal}
              title={isFirebaseActive ? "Connected to Cloud Firestore" : "Running local store. Tap to connect cloud."}
              className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition cursor-pointer ${
                isFirebaseActive
                  ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>{isFirebaseActive ? 'Cloud 24/7' : 'Cloud Setup'}</span>
            </button>

            {/* Admin Authentication */}
            {isAdmin ? (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={onOpenAddModal}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Assessment</span>
                  <span className="sm:hidden">Add</span>
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

        {/* Track Switcher Strip: Zero Emojis, Institutional Low-Opacity Tabs */}
        <div className="flex items-center space-x-1.5 py-1.5 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTrack('mine')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
              activeTrack === 'mine'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Candidate 1 (Primary)
          </button>
          <button
            onClick={() => setActiveTrack('hers')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
              activeTrack === 'hers'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Candidate 2 (Partner)
          </button>
          <button
            onClick={() => setActiveTrack('combined')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
              activeTrack === 'combined'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Dual Schedule & Conflicts</span>
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
