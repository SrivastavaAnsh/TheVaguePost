'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, KeyRound, X, Sparkles, AlertCircle } from 'lucide-react';
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
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-md bg-[#12151E] border border-accent/30 rounded-3xl p-7 shadow-glow overflow-hidden font-kanit"
        >
          {/* Subtle background glow */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="absolute top-5 right-5 text-secondary hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent to-accent-cyan p-0.5 mb-4 shadow-lg">
            <div className="w-full h-full bg-[#12151E] rounded-[14px] flex items-center justify-center">
              <Lock className="w-6 h-6 text-accent-glow" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-frost">Author Studio Access</h3>
          <p className="text-xs text-secondary mt-1.5 leading-relaxed font-normal">
            Only Ansh can publish thoughts, pin posts, or manage content on The VaguePost. Enter your author passkey to unlock creator mode.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-mono text-secondary mb-1.5">
                Author Passkey
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter secret passkey..."
                  value={passkey}
                  onChange={(e) => {
                    setPasskey(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full bg-[#181C26] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-frost placeholder:text-secondary/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <p className="text-[11px] text-secondary font-mono">
                Default key: <span className="text-accent-cyan">vaguepost2026</span>
              </p>
              <button
                type="submit"
                disabled={loading || !passkey.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-accent to-accent-cyan text-white font-medium text-sm rounded-xl hover:opacity-95 disabled:opacity-40 transition-all flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Verifying...' : 'Unlock Studio'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
