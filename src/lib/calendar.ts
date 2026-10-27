import { PlacementTest } from '@/types/placement';
import { getTestDateTime } from './clashDetector';

export function getGoogleCalendarUrl(test: PlacementTest): string {
  const start = getTestDateTime(test.testDate, test.testTime);
  const duration = test.durationMinutes || 90;
  const end = new Date(start.getTime() + duration * 60 * 1000);

  const formatTime = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const title = encodeURIComponent(`[Placement Test] ${test.companyName} - ${test.profileName}`);
  const details = encodeURIComponent(
    `Placement Test for ${test.companyName}\nProfile: ${test.profileName}\nTrack: ${
      test.track === 'mine' ? 'My College' : 'Her College'
    }\n${test.testLink ? `Test Link: ${test.testLink}\n` : ''}${
      test.notes ? `Notes: ${test.notes}\n` : ''
    }`
  );
  const dates = `${formatTime(start)}/${formatTime(end)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`;
}

export function downloadIcsFile(test: PlacementTest) {
  const start = getTestDateTime(test.testDate, test.testTime);
  const duration = test.durationMinutes || 90;
  const end = new Date(start.getTime() + duration * 60 * 1000);

  const formatTime = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Placement Tracker//EN',
    'BEGIN:VEVENT',
    `UID:${test.id}@placementtracker.app`,
    `DTSTAMP:${formatTime(new Date())}`,
    `DTSTART:${formatTime(start)}`,
    `DTEND:${formatTime(end)}`,
    `SUMMARY:[Placement Test] ${test.companyName} - ${test.profileName}`,
    `DESCRIPTION:${test.companyName} (${test.profileName})\\n${test.notes || ''}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${test.companyName.replace(/\s+/g, '_')}_test.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
