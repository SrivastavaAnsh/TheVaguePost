'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Plus, Lock, Unlock } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Brand / Logo with Graffiti Marker Accent */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-black text-lg tracking-tighter shadow-hard-sm">
            V
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-ink font-kanit">
                The VaguePost
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-graffiti-yellow text-black font-bold uppercase tracking-wider">
                RAW
              </span>
            </div>
            <p className="text-[11px] text-muted font-mono -mt-0.5">
              by Ansh
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundEnabled ? "Mute interactive audio" : "Enable sound effects"}
            className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-black" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-400" />
            )}
          </button>

          {/* Author Actions */}
          {isAuthor ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenNewThought();
                }}
                className="flex items-center gap-1 px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Thought</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  onLockAuthor();
                }}
                title="Lock author mode"
                className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
              >
                <Unlock className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                sound.playPop();
                onOpenPasskey();
              }}
              title="Author Login"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-mono text-neutral-700 rounded-xl transition-colors"
            >
              <Lock className="w-3 h-3 text-neutral-500" />
              <span>Author</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
