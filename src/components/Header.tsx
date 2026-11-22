'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Lock, 
  Unlock, 
  Plus, 
  Pin, 
  MessageSquare, 
  Heart,
  Flame,
  Radio
} from 'lucide-react';
import { sound } from './SoundEffects';

interface HeaderProps {
  isAuthor: boolean;
  onOpenPasskey: () => void;
  onOpenNewThought: () => void;
  onLockAuthor: () => void;
  stats?: {
    totalPosts: number;
    pinnedPosts: number;
    maxPinned: number;
    totalLikes: number;
    totalCommenters: number;
  };
}

export function Header({
  isAuthor,
  onOpenPasskey,
  onOpenNewThought,
  onLockAuthor,
  stats,
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0C0C0C]/85 border-b border-white/5 transition-all">
      <div className="max-w-4xl mx-auto px-4 py-3.5 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent to-accent-cyan p-0.5 shadow-glow">
              <div className="w-full h-full bg-[#0C0C0C] rounded-[14px] flex items-center justify-center">
                <span className="font-kanit font-black text-xl text-frost tracking-tighter">V</span>
              </div>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-glow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-kanit font-extrabold text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-frost via-white to-secondary tracking-tight">
                THE VAGUEPOST
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent-glow font-bold">
                <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE
              </span>
            </div>
            <p className="text-[11px] text-secondary font-mono tracking-wide hidden xs:block">
              Raw thoughts & fragments from Ansh
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundEnabled ? "Mute interactive audio" : "Enable playful sound effects"}
            className="p-2 rounded-xl bg-[#14171B] border border-white/10 text-secondary hover:text-frost hover:border-white/20 transition-all"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-accent-cyan" />
            ) : (
              <VolumeX className="w-4 h-4 text-secondary/60" />
            )}
          </button>

          {/* Author Mode Switch */}
          {isAuthor ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenNewThought();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-accent to-accent-glow text-white text-xs font-semibold rounded-xl shadow-glow hover:opacity-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">Post Thought</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  onLockAuthor();
                }}
                title="Lock Author Mode"
                className="flex items-center gap-1 px-2.5 py-1.5 bg-accent/20 border border-accent/40 text-accent-glow text-xs font-mono rounded-xl hover:bg-accent/30 transition-all"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Active</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                sound.playPop();
                onOpenPasskey();
              }}
              title="Unlock Author Mode (Ansh only)"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14171B] border border-white/10 text-xs font-mono text-secondary hover:text-frost hover:border-accent/40 rounded-xl transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-accent-glow" />
              <span className="hidden sm:inline">Author</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Info Stats Bar */}
      {stats && (
        <div className="bg-[#101318]/90 border-t border-white/5 px-4 py-1.5 text-[11px] font-mono text-secondary">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-4 shrink-0">
              <span className="flex items-center gap-1 text-frost">
                <Sparkles className="w-3 h-3 text-accent-glow" />
                <strong className="text-white">{stats.totalPosts}</strong> thoughts
              </span>
              <span className="flex items-center gap-1 text-accent-cyan">
                <Pin className="w-3 h-3" />
                <strong>{stats.pinnedPosts}/5</strong> pinned
              </span>
              <span className="flex items-center gap-1 text-pink-400">
                <Heart className="w-3 h-3" />
                <strong>{stats.totalLikes}</strong> likes
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <MessageSquare className="w-3 h-3" />
                <strong>{stats.totalCommenters}</strong> commenters
              </span>
            </div>

            <div className="hidden sm:block text-[10px] text-secondary/70">
              Visitors comment anonymously with numbers #1, #2, #3...
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
