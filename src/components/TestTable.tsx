'use client';

import React from 'react';
import { PlacementTest, ClashInfo } from '@/types/placement';
import { getGoogleCalendarUrl } from '@/lib/calendar';
import {
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  CalendarPlus,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface TestTableProps {
  tests: PlacementTest[];
  isAdmin: boolean;
  onEdit: (test: PlacementTest) => void;
  onDelete: (id: string, name: string) => void;
  clashes: ClashInfo[];
}

export const TestTable: React.FC<TestTableProps> = ({
  tests,
  isAdmin,
  onEdit,
  onDelete,
  clashes,
}) => {
  const isDirectClash = (testId: string) =>
    clashes.some(
      (c) =>
        c.type === 'direct_clash' &&
        (c.test1.id === testId || c.test2.id === testId)
    );

  if (tests.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-xs">
        <FileText className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p className="text-xs font-bold text-slate-900">
          No records found in this view
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Modify the search query or switch view tabs to inspect other assessments.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-2.5 px-3 sm:px-4">Track</th>
              <th className="py-2.5 px-3 sm:px-4">Organization / Company</th>
              <th className="py-2.5 px-3 sm:px-4">Role Profile</th>
              <th className="py-2.5 px-3 sm:px-4">Date & Slot</th>
              <th className="py-2.5 px-3 sm:px-4">Portal / Instructions</th>
              <th className="py-2.5 px-3 sm:px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {tests.map((test) => {
              const clash = isDirectClash(test.id);
              const dateObj = new Date(test.testDate);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });

              return (
                <tr
                  key={test.id}
                  className={`hover:bg-slate-50/70 transition ${
                    clash ? 'bg-rose-50/30' : ''
                  }`}
                >
                  {/* Candidate Track Badge */}
                  <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        test.track === 'mine'
                          ? 'bg-slate-100 text-slate-700 border-slate-200/80'
                          : 'bg-purple-50 text-purple-700 border-purple-200/80'
                      }`}
                    >
                      {test.track === 'mine' ? 'Candidate 1' : 'Candidate 2'}
                    </span>
                  </td>

                  {/* Company Name */}
                  <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">
                        {test.companyName}
                      </span>
                      {clash && (
                        <span
                          title="Overlaps with partner exam window"
                          className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold"
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span>Overlap</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Profile Name */}
                  <td className="py-3 px-3 sm:px-4 font-medium text-slate-700 max-w-[200px] truncate">
                    {test.profileName}
                  </td>

                  {/* Date & Time */}
                  <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">
                      {formattedDate}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{test.testTime}</span>
                      <span className="text-slate-400">({test.durationMinutes || 90}m)</span>
                    </div>
                  </td>

                  {/* Portal & Instructions */}
                  <td className="py-3 px-3 sm:px-4 max-w-[240px]">
                    <div className="space-y-0.5">
                      {test.testLink && (
                        <a
                          href={test.testLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-blue-600 font-semibold hover:underline"
                        >
                          <span>Portal Access</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {test.notes && (
                        <p className="text-[11px] text-slate-500 truncate" title={test.notes}>
                          {test.notes}
                        </p>
                      )}
                      {!test.testLink && !test.notes && (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </div>
                  </td>

                  {/* Action Suite */}
                  <td className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1">
                      <a
                        href={getGoogleCalendarUrl(test)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Add to Google Calendar"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" />
                      </a>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onEdit(test)}
                            title="Edit Record"
                            className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(test.id, test.companyName)}
                            title="Delete Record"
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
