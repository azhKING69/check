'use client';

import React, { useState } from 'react';
import { X, KeyRound } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const expectedPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === expectedPin) {
      localStorage.setItem('placement_admin_auth', 'true');
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-slate-100 text-slate-800">
              <KeyRound className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Administrative Authentication
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Provide the 4-digit Master PIN to unlock scheduling mutation rights from this device.
        </p>

        <form onSubmit={handleVerify} className="space-y-3 pt-1">
          <div>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoFocus
              value={pin}
              onChange={(e) => {
                setError(false);
                setPin(e.target.value);
              }}
              className="w-full text-center tracking-widest text-lg font-mono py-2.5 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-hidden transition"
            />
            {error && (
              <p className="text-xs font-semibold text-rose-600 text-center mt-2">
                Authentication failed. Incorrect PIN.
              </p>
            )}
          </div>

          <div className="flex space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer shadow-xs"
            >
              Authenticate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
