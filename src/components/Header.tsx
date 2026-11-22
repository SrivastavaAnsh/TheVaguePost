'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Plus, Lock, Unlock, Sparkles } from 'lucide-react';
import { sound } from './SoundEffects';

interface HeaderProps {
  isAuthor: boolean;
  onOpenPasskey: () => void;
  onOpenNewThought: () => void;
  onLockAuthor: () => void;
  pinnedCount: number;
}

export function Header({
  isAuthor,
  onOpenPasskey,
  onOpenNewThought,
  onLockAuthor,
  pinnedCount,
}: HeaderProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setSoundEnabled(sound.enabled);
  }, []);

  const handleToggleSound = () => {
    const newState = sound.toggle();
    setSoundEnabled(newState);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Full width container spanning across the entire screen */}
      <div className="w-full px-6 sm:px-10 lg:px-12 py-3.5 flex items-center justify-between gap-4">
        {/* Far Left: Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-black text-lg tracking-tighter shadow-hard-green">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-ink font-kanit">
                The VaguePost
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-street-green-bg border border-street-green/30 text-street-green font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-street-green animate-pulse" /> RAW
              </span>
            </div>
            <p className="text-[11px] text-muted font-mono">
              by <strong className="text-black">Ansh</strong>
            </p>
          </div>
        </div>

        {/* Far Right: Interactive Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundEnabled ? "Mute interactive audio" : "Enable sound effects"}
            className="p-2 sm:p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-street-green" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-400" />
            )}
          </button>

          {/* Author Mode Controls */}
          {isAuthor ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenNewThought();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-street-green hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-hard transition-transform active:translate-x-0.5 active:translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Thought</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  onLockAuthor();
                }}
                title="Lock author mode"
                className="p-2 sm:p-2.5 rounded-xl bg-street-green-bg border border-street-green/30 text-street-green hover:bg-emerald-100 transition-colors"
              >
                <Unlock className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                sound.playPop();
                onOpenPasskey();
              }}
              title="Author Login"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs sm:text-sm font-mono text-neutral-800 rounded-xl transition-colors font-medium border border-neutral-200"
            >
              <Lock className="w-3.5 h-3.5 text-neutral-500" />
              <span>Author</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
