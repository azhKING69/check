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
  Calendar,
  Sparkles,
  Share2,
} from 'lucide-react';

export default function PlacementNoticeBoard() {
  const [tests, setTests] = useState<PlacementTest[]>([]);
  const [activeTrack, setActiveTrack] = useState<StudentTrack | 'combined'>('mine');
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

  // Lock Admin
  const handleLockAdmin = () => {
    localStorage.removeItem('placement_admin_auth');
    setIsAdmin(false);
  };

  // Clash Detection across all tests
  const clashes = useMemo(() => {
    return detectClashes(tests);
  }, [tests]);

  // Current time state to avoid SSR prerender drift
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    setCurrentTime(Date.now());
    const interval = setInterval(() => setCurrentTime(Date.now()), 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);
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
      .reverse(); // Most recent past first
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
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deletePlacementTest(id);
    }
  };

  const handleSaveTest = async (input: PlacementTestInput) => {
    if (editingTest) {
      await updatePlacementTest(editingTest.id, input);
    } else {
      await addPlacementTest(input);
    }
  };

  // CSV Export for sharing or personal spreadsheet
  const handleExportCSV = () => {
    const headers = [
      'Track',
      'Company Name',
      'Profile',
      'Test Date',
      'Test Time',
      'Duration (mins)',
      'Test Link',
      'Notes',
    ];
    const rows = trackFilteredTests.map((t) => [
      t.track === 'mine' ? 'My College' : 'Her College',
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
    link.setAttribute('download', `placement_tests_${activeTrack}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy shareable link
  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard! You can share this with your batchmates.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      {/* Sticky Header */}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Next Test Countdown Hero */}
        <NextTestBanner upcomingTests={upcomingTests} />

        {/* Clash Alert Radar Banner (Direct slot conflicts & same-day warnings) */}
        <ClashAlertBanner clashes={clashes} />

        {/* Search, Filter Tabs & Layout Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Tabs: Upcoming vs Past vs All */}
          <div className="inline-flex p-1 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-xl text-xs sm:text-sm font-medium self-start">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'upcoming'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Upcoming ({upcomingTests.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'past'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Past ({pastTests.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              All ({trackFilteredTests.length})
            </button>
          </div>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search company or profile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-zinc-200/60 dark:bg-zinc-800/60 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('table')}
                title="Table View"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                title="Cards View"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Share / Export */}
            <button
              onClick={handleShareLink}
              title="Share Link"
              className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition shadow-xs"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportCSV}
              title="Export as CSV"
              className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition shadow-xs"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content View: Table or Cards */}
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

        {/* Mobile View or Cards mode */}
        <div
          className={`${
            viewMode === 'table' ? 'sm:hidden' : ''
          } grid grid-cols-1 md:grid-cols-2 gap-3.5`}
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
            <div className="col-span-full py-12 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
              <Calendar className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                No tests match your filter
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Try switching between Upcoming and Past, or clear the search query.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button for Mobile Admin */}
      {isAdmin && (
        <button
          onClick={handleOpenAdd}
          title="Add New Test"
          className="fixed bottom-6 right-6 z-40 sm:hidden w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center active:scale-95 transition"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Modals */}
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
