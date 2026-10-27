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
const EVENT_NAME = 'placement_ledger_sync';

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

// Active subscribers in this window/tab
const subscribers = new Set<(tests: PlacementTest[]) => void>();

function notifySubscribers(data: PlacementTest[]) {
  subscribers.forEach((cb) => {
    try {
      cb(data);
    } catch (e) {
      console.error('Subscriber callback error:', e);
    }
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }));
  }
}

export function getLocalData(): PlacementTest[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_DATA;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_DATA));
      return INITIAL_SAMPLE_DATA;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SAMPLE_DATA;
  } catch {
    return INITIAL_SAMPLE_DATA;
  }
}

function saveLocalData(tests: PlacementTest[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tests));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function subscribeToTests(
  onUpdate: (tests: PlacementTest[]) => void
): () => void {
  // Register callback
  subscribers.add(onUpdate);

  // Immediately feed current local cache
  const initialData = getLocalData();
  onUpdate(initialData);

  // Listen for local tab events
  const handleLocalEvent = (e: Event) => {
    const custom = e as CustomEvent<PlacementTest[]>;
    if (custom.detail) {
      onUpdate(custom.detail);
    } else {
      onUpdate(getLocalData());
    }
  };

  const handleCrossTabStorage = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY) {
      onUpdate(getLocalData());
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener(EVENT_NAME, handleLocalEvent);
    window.addEventListener('storage', handleCrossTabStorage);
  }

  // If Firebase is active, also listen to cloud Firestore updates
  let unsubscribeFirestore: (() => void) | null = null;
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'placement_tests'), orderBy('testDate', 'asc'));
      unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudTests: PlacementTest[] = [];
            snapshot.forEach((docSnap) => {
              cloudTests.push({
                id: docSnap.id,
                ...(docSnap.data() as Omit<PlacementTest, 'id'>),
              });
            });
            saveLocalData(cloudTests);
            notifySubscribers(cloudTests);
          }
        },
        (error) => {
          console.warn('Firestore live listener warning (using local store):', error.message);
        }
      );
    } catch (e) {
      console.warn('Failed to attach Firestore onSnapshot:', e);
    }
  }

  return () => {
    subscribers.delete(onUpdate);
    if (typeof window !== 'undefined') {
      window.removeEventListener(EVENT_NAME, handleLocalEvent);
      window.removeEventListener('storage', handleCrossTabStorage);
    }
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
    }
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

  // 1. Instant optimistic update to local cache & active UI
  const current = getLocalData();
  const updated = [newRecord, ...current];
  saveLocalData(updated);
  notifySubscribers(updated);

  // 2. Asynchronous write to Firestore (with 5-second timeout so it never blocks)
  if (isFirebaseConfigured && db) {
    try {
      const writePromise = addDoc(collection(db, 'placement_tests'), {
        ...input,
        createdAt: newRecord.createdAt,
        updatedAt: newRecord.updatedAt,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore write timeout')), 5000)
      );

      const docRef = await Promise.race([writePromise, timeoutPromise]);
      newRecord.id = docRef.id;
    } catch (err: any) {
      console.warn('Firestore cloud sync notice:', err?.message || err);
      // Local state is already updated and safe!
    }
  }

  return newRecord;
}

export async function updatePlacementTest(
  id: string,
  input: Partial<PlacementTestInput>
): Promise<void> {
  const updatedAt = new Date().toISOString();

  // 1. Instant optimistic update locally
  const current = getLocalData();
  const updated = current.map((t) =>
    t.id === id ? { ...t, ...input, updatedAt } : t
  );
  saveLocalData(updated);
  notifySubscribers(updated);

  // 2. Asynchronous write to Firestore
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'placement_tests', id);
      const writePromise = updateDoc(docRef, {
        ...input,
        updatedAt,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore update timeout')), 5000)
      );

      await Promise.race([writePromise, timeoutPromise]);
    } catch (err: any) {
      console.warn('Firestore cloud update notice:', err?.message || err);
    }
  }
}

export async function deletePlacementTest(id: string): Promise<void> {
  // 1. Instant optimistic delete locally
  const current = getLocalData();
  const updated = current.filter((t) => t.id !== id);
  saveLocalData(updated);
  notifySubscribers(updated);

  // 2. Asynchronous delete in Firestore
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'placement_tests', id);
      const deletePromise = deleteDoc(docRef);

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore delete timeout')), 5000)
      );

      await Promise.race([deletePromise, timeoutPromise]);
    } catch (err: any) {
      console.warn('Firestore cloud delete notice:', err?.message || err);
    }
  }
}
