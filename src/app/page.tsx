'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PlacementTest, PlacementTestInput, StudentTrack } from '@/types/placement';
import {
  subscribeToTests,
  addPlacementTest,
  updatePlacementTest,
  deletePlacementTest,
} from '@/lib/storage';
import { detectClashes, getTestDateTime } from '@/lib/clashDetector';
import { isFirebaseConfigured } from '@/lib/firebase';
import { Header } from '@/components/Header';
import { KpiRibbon } from '@/components/KpiRibbon';
import { NextTestBanner } from '@/components/NextTestBanner';
import { ClashAlertBanner } from '@/components/ClashAlertBanner';
import { TestTable } from '@/components/TestTable';
import { TestCard } from '@/components/TestCard';
import { TestModal } from '@/components/TestModal';
import { AdminPinModal } from '@/components/AdminPinModal';
import { FirebaseSetupModal } from '@/components/FirebaseSetupModal';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Download,
  Share2,
} from 'lucide-react';

export default function PlacementNoticeBoard() {
  const [tests, setTests] = useState<PlacementTest[]>([]);
  const [activeTrack, setActiveTrack] = useState<StudentTrack | 'combined'>('combined');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isAdmin, setIsAdmin] = useState(false);

  // Modals state
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<PlacementTest | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  // Check admin session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('placement_admin_auth');
      if (auth === 'true') {
        setIsAdmin(true);
      }
    }
  }, []);

  // Subscribe to live test updates (Firebase or Local)
  useEffect(() => {
    const unsubscribe = subscribeToTests((data) => {
      setTests(data);
    });
    return () => unsubscribe();
  }, []);

  // Current time state for hydration safety
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    setCurrentTime(Date.now());
    const interval = setInterval(() => setCurrentTime(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  // Lock Admin
  const handleLockAdmin = () => {
    localStorage.removeItem('placement_admin_auth');
    setIsAdmin(false);
  };

  // Clash Detection across all tests
  const clashes = useMemo(() => {
    return detectClashes(tests);
  }, [tests]);

  // Separate Upcoming vs Past tests
  const sortedAllTests = useMemo(() => {
    return [...tests].sort((a, b) => {
      const timeA = getTestDateTime(a.testDate, a.testTime).getTime();
      const timeB = getTestDateTime(b.testDate, b.testTime).getTime();
      return timeA - timeB;
    });
  }, [tests]);

  // Filter by track (mine / hers / combined)
  const trackFilteredTests = useMemo(() => {
    if (activeTrack === 'combined') return sortedAllTests;
    return sortedAllTests.filter((t) => t.track === activeTrack);
  }, [sortedAllTests, activeTrack]);

  // Upcoming vs Past split
  const upcomingTests = useMemo(() => {
    if (!currentTime) return trackFilteredTests;
    return trackFilteredTests.filter((t) => {
      const end = new Date(
        getTestDateTime(t.testDate, t.testTime).getTime() +
          (t.durationMinutes || 90) * 60 * 1000
      );
      return end.getTime() >= currentTime;
    });
  }, [trackFilteredTests, currentTime]);

  const pastTests = useMemo(() => {
    if (!currentTime) return [];
    return trackFilteredTests
      .filter((t) => {
        const end = new Date(
          getTestDateTime(t.testDate, t.testTime).getTime() +
            (t.durationMinutes || 90) * 60 * 1000
        );
        return end.getTime() < currentTime;
      })
      .reverse();
  }, [trackFilteredTests, currentTime]);

  // Filtered by search & active tab
  const displayedTests = useMemo(() => {
    let list =
      activeTab === 'upcoming'
        ? upcomingTests
        : activeTab === 'past'
        ? pastTests
        : trackFilteredTests;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.companyName.toLowerCase().includes(q) ||
          t.profileName.toLowerCase().includes(q) ||
          t.notes?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeTab, upcomingTests, pastTests, trackFilteredTests, searchQuery]);

  // Handlers for Add/Edit/Delete
  const handleOpenAdd = () => {
    setEditingTest(null);
    setIsTestModalOpen(true);
  };

  const handleEdit = (test: PlacementTest) => {
    setEditingTest(test);
    setIsTestModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Confirm deletion of record: "${name}"?`)) {
      await deletePlacementTest(id);
    }
  };

  const handleSaveTest = async (input: PlacementTestInput) => {
    if (editingTest) {
      await updatePlacementTest(editingTest.id, input);
    } else {
      await addPlacementTest(input);
      // Auto-switch track if needed so user immediately sees their created record
      if (activeTrack !== 'combined' && activeTrack !== input.track) {
        setActiveTrack(input.track);
      }
      setActiveTab('upcoming');
    }
  };

  // CSV Export for tabular records
  const handleExportCSV = () => {
    const headers = [
      'Candidate Track',
      'Organization',
      'Role Profile',
      'Assessment Date',
      'Slot Time',
      'Duration (Minutes)',
      'Portal Link',
      'Instructions',
    ];
    const rows = trackFilteredTests.map((t) => [
      t.track === 'mine' ? 'Candidate 1 (Primary)' : 'Candidate 2 (Partner)',
      `"${t.companyName.replace(/"/g, '""')}"`,
      `"${t.profileName.replace(/"/g, '""')}"`,
      t.testDate,
      t.testTime,
      t.durationMinutes || 90,
      `"${t.testLink || ''}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `assessment_schedule_${activeTrack}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy shareable link
  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Ledger URL copied to clipboard.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col w-full font-sans antialiased">
      {/* Institutional Top Header */}
      <Header
        activeTrack={activeTrack}
        setActiveTrack={setActiveTrack}
        isAdmin={isAdmin}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onLockAdmin={handleLockAdmin}
        onOpenAddModal={handleOpenAdd}
        clashCount={clashes.filter((c) => c.type === 'direct_clash').length}
        isFirebaseActive={isFirebaseConfigured}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 space-y-4 sm:space-y-6">
        {/* KPI Metric Ribbon (2-column mobile, 4-column desktop) */}
        <KpiRibbon
          upcomingTests={upcomingTests}
          pastTests={pastTests}
          clashes={clashes}
        />

        {/* Immediate Assessment Focus Card */}
        <NextTestBanner upcomingTests={upcomingTests} />

        {/* Slot Conflict Radar */}
        <ClashAlertBanner clashes={clashes} />

        {/* Action Bar & Controls: Strict Single-Row Mobile Header Rule */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 min-w-0 pt-1">
          {/* Status Tabs: Upcoming vs Past vs All */}
          <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-semibold self-start border border-slate-200/60">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming ({upcomingTests.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                activeTab === 'past'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past ({pastTests.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({trackFilteredTests.length})
            </button>
          </div>

          {/* Search Bar & Layout Suite */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter by company or profile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:border-slate-900 transition"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
              <button
                onClick={() => setViewMode('table')}
                title="Tabular Ledger View"
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                title="Card View"
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Utility Actions */}
            <button
              onClick={handleShareLink}
              title="Copy share link"
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleExportCSV}
              title="Export as CSV Ledger"
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Desktop Tabular View (Section 6.2) */}
        {viewMode === 'table' ? (
          <div className="hidden sm:block">
            <TestTable
              tests={displayedTests}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
              clashes={clashes}
            />
          </div>
        ) : null}

        {/* Mobile View: 3-Column Data Strip Pattern (Section 5.2) */}
        <div
          className={`${
            viewMode === 'table' ? 'sm:hidden' : ''
          } grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 min-w-0`}
        >
          {displayedTests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
              clashes={clashes}
            />
          ))}

          {displayedTests.length === 0 && (
            <div className="col-span-full py-10 text-center rounded-xl border border-slate-200 bg-white shadow-xs">
              <p className="text-xs font-bold text-slate-900">
                No matching assessment records
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Switch filters or record a new test schedule.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Trigger for Mobile Admin */}
      {isAdmin && (
        <button
          onClick={handleOpenAdd}
          title="Record New Assessment"
          className="fixed bottom-5 right-5 z-40 sm:hidden w-12 h-12 rounded-full bg-slate-900 text-white shadow-lg flex items-center justify-center active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}

      {/* Institutional Modals */}
      <TestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onSubmit={handleSaveTest}
        editingTest={editingTest}
        defaultTrack={activeTrack === 'hers' ? 'hers' : 'mine'}
      />

      <AdminPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => setIsAdmin(true)}
      />

      <FirebaseSetupModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        isFirebaseActive={isFirebaseConfigured}
      />
    </div>
  );
}
