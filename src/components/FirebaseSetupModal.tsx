'use client';

import React from 'react';
import { X, Cloud, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

interface FirebaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFirebaseActive: boolean;
}

export const FirebaseSetupModal: React.FC<FirebaseSetupModalProps> = ({
  isOpen,
  onClose,
  isFirebaseActive,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                24/7 Cloud Sync (Firebase Firestore)
              </h3>
              <p className="text-xs text-zinc-500">Never pauses or sleeps, real-time live updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isFirebaseActive ? (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">Cloud Firestore is active and connected!</p>
              <p className="text-xs mt-1 opacity-90">
                All tests added by you or your girlfriend from your phones will instantly sync in real-time across all devices.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300">
              💡 <strong>Currently running in Local Mode:</strong> All your additions & edits work right now and are saved in your browser. To make it a true public live notice board accessible from your phone and for batchmates, follow these 3 quick steps:
            </div>

            <ol className="list-decimal pl-4 space-y-2.5">
              <li>
                Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">console.firebase.google.com</a> and click <strong>"Create a project"</strong> (it's 100% free).
              </li>
              <li>
                Click <strong>"Firestore Database"</strong> &rarr; <strong>"Create Database"</strong> (Start in <em>Test Mode</em> so reads & writes are open).
              </li>
              <li>
                Click the ⚙️ <strong>Project Settings</strong> icon &rarr; <strong>"Add app" (Web / &lt;/&gt;)</strong>, and copy the config keys into your <code>.env.local</code> file (or Vercel Environment Variables).
              </li>
            </ol>

            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px] text-zinc-800 dark:text-zinc-200 overflow-x-auto space-y-1">
              <div>NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...</div>
              <div>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com</div>
              <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app-id</div>
              <div>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com</div>
              <div>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456...</div>
              <div>NEXT_PUBLIC_FIREBASE_APP_ID=1:12345:web:...</div>
              <div>NEXT_PUBLIC_ADMIN_PIN=1234</div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
