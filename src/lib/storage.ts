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

const LOCAL_STORAGE_KEY = 'placement_tests_local_v1';

// Initial default sample data so user sees something right away
const INITIAL_SAMPLE_DATA: PlacementTest[] = [
  {
    id: 'sample-1',
    track: 'mine',
    companyName: 'Google',
    profileName: 'Software Engineering (SWE)',
    testDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    testTime: '18:00',
    durationMinutes: 90,
    testLink: 'https://hackerEarth.com',
    notes: '2 Coding questions (DP + Graphs), 30 mins Aptitude.',
    status: 'Upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    track: 'hers',
    companyName: 'Microsoft',
    profileName: 'Software Development Engineer (SDE)',
    testDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow (Same day!)
    testTime: '18:30', // CLASH with Google!
    durationMinutes: 90,
    testLink: 'https://codility.com',
    notes: 'Codility test link sent on mail. Keep ID card ready.',
    status: 'Upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    track: 'mine',
    companyName: 'Goldman Sachs',
    profileName: 'Summer Analyst',
    testDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], // In 3 days
    testTime: '10:00',
    durationMinutes: 105,
    testLink: 'https://hirepro.in',
    notes: 'Quantitative + Math + CS fundamentals.',
    status: 'Upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-4',
    track: 'hers',
    companyName: 'McKinsey & Co.',
    profileName: 'Business Analyst',
    testDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0], // In 4 days
    testTime: '16:00',
    durationMinutes: 60,
    testLink: 'https://shl.com',
    notes: 'Problem Solving Game (PSG). Practice beforehand.',
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
  // If Firebase is configured, use live Firestore onSnapshot listener
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
          console.warn('Firestore subscription failed, falling back to local:', error);
          onUpdate(getLocalData());
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn('Error setting up Firestore listener:', e);
    }
  }

  // Fallback to local storage
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
    id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
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
      console.error('Failed to add to Firestore, saving locally:', err);
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
      console.error('Failed to update in Firestore, falling back locally:', err);
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
      console.error('Failed to delete from Firestore, falling back locally:', err);
    }
  }

  const current = getLocalData();
  const updated = current.filter((t) => t.id !== id);
  saveLocalData(updated);
}
