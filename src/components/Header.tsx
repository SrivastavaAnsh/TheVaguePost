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
    <header className="sticky top-0 z-40 w-full bg-[#FEF7F0]/85 backdrop-blur-md border-b border-black/[0.06]">
      {/* Full width stretching across screen: Left to Right */}
      <div className="w-full px-6 sm:px-10 lg:px-14 py-3.5 flex items-center justify-between gap-4">
        {/* Far Left: Brand inspired by MyThoughts ✦ in reference image */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xl sm:text-2xl tracking-tight text-[#0F172A] font-kanit">
              The VaguePost
            </span>
            {/* 4-point Purple Sparkle Star */}
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 fill-current" viewBox="0 0 100 100">
              <path d="M50 0 C50 35, 65 50, 100 50 C65 50, 50 65, 50 100 C50 65, 35 50, 0 50 C35 50, 50 35, 50 0 Z" />
            </svg>
          </div>
          <span className="text-[11px] font-mono text-slate-500 pl-1 hidden xs:inline">
            • by Ansh
          </span>
        </div>

        {/* Far Right: Interactive Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundEnabled ? "Mute audio" : "Enable playful sound effects"}
            className="p-2 rounded-full bg-white/80 hover:bg-white border border-black/[0.06] text-slate-600 transition-colors shadow-sm"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
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
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0F172A] hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all"
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
                className="p-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100 transition-colors"
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 hover:bg-white text-xs sm:text-sm font-mono text-slate-700 rounded-full transition-colors border border-black/[0.06] shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Author</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
