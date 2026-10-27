'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PlacementTest, PlacementTestInput, StudentTrack } from '@/types/placement';
import { X, Calendar, Search, Check } from 'lucide-react';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlacementTestInput) => Promise<void>;
  editingTest?: PlacementTest | null;
  defaultTrack: StudentTrack;
}

const PREDEFINED_ROLES = [
  // SDE & Engineering
  'Software Engineer',
  'Software Developer',
  'SDE (Software Development Engineer)',
  'Associate Software Engineer',
  'Graduate Software Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Engineer',
  'Systems Engineer',
  'DevOps Engineer',
  // AI & Machine Learning
  'AI Engineer',
  'Machine Learning Engineer',
  'Applied ML Engineer',
  'AI Research Scientist',
  // Data & Analytics
  'Data Scientist',
  'Data Analyst',
  'Data Engineer',
  'Business Intelligence Analyst',
  'Quantitative Analyst',
  'Quantitative Researcher',
  // Consulting, Management & Business
  'Management Trainee',
  'Business Analyst',
  'Technology Analyst',
  'Associate Consultant',
  'Management Consultant',
  'Strategy & Operations Analyst',
  'Product Manager',
  'Associate Product Manager (APM)',
];

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const roleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTest) {
      setTrack(editingTest.track);
      setCompanyName(editingTest.companyName);
      setProfileName(editingTest.profileName);
      setTestDate(editingTest.testDate);
      setTestTime(editingTest.testTime);
      setDurationMinutes(editingTest.durationMinutes || 90);
    } else {
      setTrack(defaultTrack);
      setCompanyName('');
      setProfileName('');
      const tomorrow = new Date(Date.now() + 86400000);
      setTestDate(tomorrow.toISOString().split('T')[0]);
      setTestTime('18:00');
      setDurationMinutes(90);
    }
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }, [editingTest, defaultTrack, isOpen]);

  // Filter suggestions based on typed input
  const filteredSuggestions = React.useMemo(() => {
    if (!profileName.trim()) return [];
    const query = profileName.toLowerCase().trim();
    return PREDEFINED_ROLES.filter((role) =>
      role.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [profileName]);

  const handleSelectRole = (role: string) => {
    setProfileName(role);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDownRole = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
        e.preventDefault();
        handleSelectRole(filteredSuggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-slate-100 text-slate-800">
              <Calendar className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {editingTest ? 'Edit Assessment' : 'New Assessment'}
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
          {/* Candidate Selection: PIPI vs Chintu */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Candidate
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
                PIPI
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
                Chintu
              </button>
            </div>
          </div>

          {/* Company Name (No Placeholder) */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Company <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-hidden transition"
            />
          </div>

          {/* Role Profile with Google-style Autocomplete */}
          <div className="relative">
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Role Profile <span className="text-rose-500">*</span>
            </label>
            <input
              ref={roleInputRef}
              type="text"
              required
              value={profileName}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setProfileName(e.target.value);
                setShowSuggestions(true);
                setHighlightedIndex(-1);
              }}
              onKeyDown={handleKeyDownRole}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-hidden transition"
            />

            {/* Google-like Autocomplete Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden py-1 divide-y divide-slate-100"
              >
                {filteredSuggestions.map((suggestion, index) => {
                  const isHighlighted = index === highlightedIndex;
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault(); // prevent blur
                        handleSelectRole(suggestion);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition cursor-pointer ${
                        isHighlighted
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Search className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{suggestion}</span>
                      </div>
                      {profileName.toLowerCase() === suggestion.toLowerCase() && (
                        <Check className="w-3 h-3 text-emerald-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-2 gap-2.5">
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
                Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                required
                value={testTime}
                onChange={(e) => setTestTime(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-hidden transition"
              />
            </div>
          </div>

          {/* Duration in Minutes */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Duration (Minutes)
            </label>
            <input
              type="number"
              min="15"
              step="15"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
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
              {isSubmitting ? 'Saving...' : editingTest ? 'Update Record' : 'Record Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
