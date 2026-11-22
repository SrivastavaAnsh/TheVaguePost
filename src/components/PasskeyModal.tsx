'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, X, AlertCircle } from 'lucide-react';
import { sound } from './SoundEffects';

interface PasskeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PasskeyModal({ isOpen, onClose, onSuccess }: PasskeyModalProps) {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkey.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        sound.playPin();
        onSuccess();
        onClose();
        setPasskey('');
      } else {
        sound.playPop();
        setError(data.error || 'Incorrect passkey');
      }
    } catch {
      setError('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white border-2 border-black rounded-2xl p-6 shadow-hard font-kanit">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-graffiti-yellow border border-black flex items-center justify-center mb-3">
          <Lock className="w-5 h-5 text-black" />
        </div>

        <h3 className="text-lg font-bold text-ink">Author Access</h3>
        <p className="text-xs text-muted mt-1">
          Enter passkey to publish and manage thoughts.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                autoFocus
                placeholder="Passkey..."
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-red-50 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted">
              Key: vaguepost2026
            </span>
            <button
              type="submit"
              disabled={loading || !passkey.trim()}
              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-medium text-xs rounded-xl shadow-hard-sm disabled:opacity-40 transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              {loading ? 'Checking...' : 'Unlock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
