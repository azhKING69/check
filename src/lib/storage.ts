import { PlacementTest, PlacementTestInput } from '@/types/placement';
import { db, isFirebaseConfigured } from './firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'placement_ledger_v2';

const INITIAL_SAMPLE_DATA: PlacementTest[] = [
  {
    id: 'rec-001',
    track: 'mine',
    companyName: 'Google',
    profileName: 'Software Engineering (L3/SWE)',
    testDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    testTime: '18:00',
    durationMinutes: 90,
    testLink: 'https://hackerearth.com',
    notes: 'Section 1: Data Structures & Algorithms. Section 2: Core Computer Systems.',
    status: 'Upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rec-002',
    track: 'hers',
    companyName: 'Microsoft',
    profileName: 'Software Development Engineer',
    testDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    testTime: '18:30',
    durationMinutes: 90,
    testLink: 'https://codility.com',
    notes: 'Slot conflict test case: Overlaps with Candidate 1 Google schedule.',
    status: 'Upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rec-003',
    track: 'mine',
    companyName: 'Goldman Sachs',
    profileName: 'Engineering Summer Analyst',
    testDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    testTime: '10:00',
    durationMinutes: 105,
    testLink: 'https://hirepro.in',
    notes: 'Quantitative aptitude, Math foundations, and Programming aptitude.',
    status: 'Upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rec-004',
    track: 'hers',
    companyName: 'McKinsey & Company',
    profileName: 'Business Technology Analyst',
    testDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    testTime: '16:00',
    durationMinutes: 60,
    testLink: 'https://shl.com',
    notes: 'Digital Assessment: Problem Solving Simulation.',
    status: 'Upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function getLocalData(): PlacementTest[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_DATA;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_DATA));
      return INITIAL_SAMPLE_DATA;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SAMPLE_DATA;
  }
}

function saveLocalData(tests: PlacementTest[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tests));
}

export function subscribeToTests(
  onUpdate: (tests: PlacementTest[]) => void
): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'placement_tests'), orderBy('testDate', 'asc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const tests: PlacementTest[] = [];
          snapshot.forEach((docSnap) => {
            tests.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<PlacementTest, 'id'>),
            });
          });
          onUpdate(tests);
        },
        (error) => {
          console.warn('Firestore subscription failed, falling back to local store:', error);
          onUpdate(getLocalData());
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn('Error setting up Firestore listener:', e);
    }
  }

  const localTests = getLocalData();
  onUpdate(localTests);

  const handleStorageChange = () => {
    onUpdate(getLocalData());
  };
  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}

export async function addPlacementTest(
  input: PlacementTestInput
): Promise<PlacementTest> {
  const newRecord: PlacementTest = {
    ...input,
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'placement_tests'), {
        ...input,
        createdAt: newRecord.createdAt,
        updatedAt: newRecord.updatedAt,
      });
      return { ...newRecord, id: docRef.id };
    } catch (err) {
      console.error('Failed to write to Firestore, fallback to local:', err);
    }
  }

  const current = getLocalData();
  const updated = [newRecord, ...current];
  saveLocalData(updated);
  return newRecord;
}

export async function updatePlacementTest(
  id: string,
  input: Partial<PlacementTestInput>
): Promise<void> {
  const updatedAt = new Date().toISOString();

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'placement_tests', id);
      await updateDoc(docRef, {
        ...input,
        updatedAt,
      });
      return;
    } catch (err) {
      console.error('Failed to update in Firestore, fallback to local:', err);
    }
  }

  const current = getLocalData();
  const updated = current.map((t) =>
    t.id === id ? { ...t, ...input, updatedAt } : t
  );
  saveLocalData(updated);
}

export async function deletePlacementTest(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'placement_tests', id));
      return;
    } catch (err) {
      console.error('Failed to delete from Firestore, fallback to local:', err);
    }
  }

  const current = getLocalData();
  const updated = current.filter((t) => t.id !== id);
  saveLocalData(updated);
}
