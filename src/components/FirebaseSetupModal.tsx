'use client';

import React from 'react';
import { X, Database, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-slate-100 text-slate-800">
              <Database className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Cloud Synchronization Architecture
              </h3>
              <p className="text-[11px] text-slate-500">Google Cloud Firestore persistent backend</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isFirebaseActive ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold">Cloud Firestore is active and verified.</p>
              <p className="text-emerald-700 mt-0.5">
                Mutations from either candidate sync in real time across all active sessions with zero polling.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <span className="font-semibold text-slate-900 block mb-0.5">Operating Mode: Local Store</span>
              Records are currently cached in device storage. To enable multi-device synchronization for partner and peers, link a free Google Cloud Firestore instance.
            </div>

            <ol className="list-decimal pl-4 space-y-2 text-slate-700">
              <li>
                Navigate to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">console.firebase.google.com</a> and initialize a project.
              </li>
              <li>
                Select <strong>Firestore Database</strong> and initialize in <strong>Test Mode</strong>.
              </li>
              <li>
                Register a Web Application under Project Settings, and export the environment tokens:
              </li>
            </ol>

            <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] space-y-1 overflow-x-auto">
              <div>NEXT_PUBLIC_ADMIN_PIN=1234</div>
              <div>NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...</div>
              <div>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com</div>
              <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app-id</div>
              <div>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com</div>
              <div>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456...</div>
              <div>NEXT_PUBLIC_FIREBASE_APP_ID=1:12345:web:...</div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
