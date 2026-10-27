'use client';

import React, { useState, useEffect } from 'react';
import { PlacementTest, PlacementTestInput, StudentTrack } from '@/types/placement';
import { X, Calendar, Clock, Building, Briefcase, Link as LinkIcon, FileText } from 'lucide-react';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlacementTestInput) => Promise<void>;
  editingTest?: PlacementTest | null;
  defaultTrack: StudentTrack;
}

export const TestModal: React.FC<TestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTest,
  defaultTrack,
}) => {
  const [track, setTrack] = useState<StudentTrack>(defaultTrack);
  const [companyName, setCompanyName] = useState('');
  const [profileName, setProfileName] = useState('');
  const [testDate, setTestDate] = useState('');
  const [testTime, setTestTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [testLink, setTestLink] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTest) {
      setTrack(editingTest.track);
      setCompanyName(editingTest.companyName);
      setProfileName(editingTest.profileName);
      setTestDate(editingTest.testDate);
      setTestTime(editingTest.testTime);
      setDurationMinutes(editingTest.durationMinutes || 90);
      setTestLink(editingTest.testLink || '');
      setNotes(editingTest.notes || '');
    } else {
      setTrack(defaultTrack);
      setCompanyName('');
      setProfileName('');
      // Default to today or tomorrow
      setTestDate(new Date().toISOString().split('T')[0]);
      setTestTime('18:00');
      setDurationMinutes(90);
      setTestLink('');
      setNotes('');
    }
  }, [editingTest, defaultTrack, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !profileName || !testDate || !testTime) {
      alert('Please fill in Company Name, Profile, Date, and Time!');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        track,
        companyName: companyName.trim(),
        profileName: profileName.trim(),
        testDate,
        testTime,
        durationMinutes: Number(durationMinutes) || 90,
        testLink: testLink.trim() || undefined,
        notes: notes.trim() || undefined,
        status: 'Upcoming',
      });
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to save test. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {editingTest ? 'Edit Placement Test' : 'Add New Placement Test'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Track Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Whose College is this for?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTrack('mine')}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition ${
                  track === 'mine'
                    ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                🎓 My College
              </button>
              <button
                type="button"
                onClick={() => setTrack('hers')}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition ${
                  track === 'hers'
                    ? 'bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-700 dark:text-rose-300 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                🌸 Her College
              </button>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Google, Microsoft, Bain"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Profile Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Profile / Role Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Software Engineer (SDE), Analyst"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Date, Time & Duration row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Time <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={testTime}
                  onChange={(e) => setTestTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Duration (mins)
              </label>
              <input
                type="number"
                min="15"
                step="15"
                placeholder="90"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Test Link (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Test Portal / Meeting Link (Optional)
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="url"
                placeholder="https://..."
                value={testLink}
                onChange={(e) => setTestLink(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Notes / Syllabus / Shortlist info (Optional)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <textarea
                rows={2}
                placeholder="e.g. 2 coding problems + 20 MCQs. PPT at 4:30 PM."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingTest ? 'Update Test' : 'Post to Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
