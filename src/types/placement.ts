export type StudentTrack = 'mine' | 'hers';

export interface PlacementTest {
  id: string;
  track: StudentTrack;        // 'mine' (My College) vs 'hers' (Her College)
  companyName: string;        // e.g. "Google", "Goldman Sachs"
  profileName: string;        // e.g. "Software Engineer", "Consultant"
  testDate: string;           // YYYY-MM-DD
  testTime: string;           // HH:MM (24-hour, e.g. "18:00")
  durationMinutes?: number;   // e.g. 90 minutes (default 90)
  testLink?: string;          // Platform link (Mettl, HackerEarth, etc.)
  notes?: string;             // Syllabus, PPT links, etc.
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
