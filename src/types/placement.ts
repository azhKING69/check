export type StudentTrack = 'mine' | 'hers';

export interface PlacementTest {
  id: string;
  track: StudentTrack;        // 'mine' vs 'hers'
  companyName: string;        // e.g. "Google", "Goldman Sachs"
  profileName: string;        // e.g. "Software Engineer", "Associate Consultant"
  testDate: string;           // YYYY-MM-DD
  testTime: string;           // HH:MM (24-hour, e.g. "18:00")
  durationMinutes?: number;   // default 90 minutes
  testLink?: string;          // assessment portal URL
  notes?: string;             // syllabus / instructions
  status?: 'Upcoming' | 'Ongoing' | 'Completed' | 'Shortlist Out';
  createdAt: string;
  updatedAt: string;
}

export type PlacementTestInput = Omit<PlacementTest, 'id' | 'createdAt' | 'updatedAt'>;

export interface ClashInfo {
  test1: PlacementTest;
  test2: PlacementTest;
  type: 'direct_clash' | 'same_day';
  description: string;
}
