'use client';

import React, { useState, useEffect } from 'react';
import { PlacementTest, PlacementTestInput, StudentTrack } from '@/types/placement';
import { X, Calendar } from 'lucide-react';

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
      alert('Required fields: Company Name, Profile, Date, and Time.');
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
      alert('Unable to persist record. Verify network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-slate-100 text-slate-800">
              <Calendar className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {editingTest ? 'Edit Assessment Record' : 'Record New Assessment'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Candidate Assignment */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Candidate Assignment
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTrack('mine')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  track === 'mine'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Candidate 1 (Primary)
              </button>
              <button
                type="button"
                onClick={() => setTrack('hers')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  track === 'hers'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Candidate 2 (Partner)
              </button>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Organization / Company <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Goldman Sachs, Google, Bain"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-hidden transition"
            />
          </div>

          {/* Role Profile */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Role Profile <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Software Engineer, Technology Analyst"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-hidden transition"
            />
          </div>

          {/* Date, Time, Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-hidden transition"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Start Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                required
                value={testTime}
                onChange={(e) => setTestTime(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-hidden transition"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Duration (Mins)
              </label>
              <input
                type="number"
                min="15"
                step="15"
                placeholder="90"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-hidden transition"
              />
            </div>
          </div>

          {/* Test Link */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Portal URL / Platform Link
            </label>
            <input
              type="url"
              placeholder="https://hackerearth.com/..."
              value={testLink}
              onChange={(e) => setTestLink(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-hidden transition"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Assessment Instructions / Syllabus
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 2 Programming problems (DSA), 20 Aptitude MCQs."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-hidden transition"
            />
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Persisting...' : editingTest ? 'Update Record' : 'Record Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
