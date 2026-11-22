'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Sparkles } from 'lucide-react';
import { sound } from './SoundEffects';

interface GifPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGif: (url: string) => void;
}

const CURATED_GIFS = [
  { label: 'Mind Blown', url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
  { label: 'Popcorn Vibes', url: 'https://media.giphy.com/media/gl0mkIZOW6Nwc/giphy.gif' },
  { label: 'Nodding Yes', url: 'https://media.giphy.com/media/NEvPzZ8bd1V4Y/giphy.gif' },
  { label: 'Cat Typing', url: 'https://media.giphy.com/media/unQ3IJU2RG7DO/giphy.gif' },
  { label: 'Vibe Check', url: 'https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif' },
  { label: 'Mind Overload', url: 'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif' },
  { label: 'Applause', url: 'https://media.giphy.com/media/nbvFVPiEiJH6Q/giphy.gif' },
  { label: 'Sipping Tea', url: 'https://media.giphy.com/media/3o85xGocUH8RYoDKKs/giphy.gif' },
  { label: 'Galaxy Brain', url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
  { label: 'Dance Groovy', url: 'https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif' },
  { label: 'Hacking Matrix', url: 'https://media.giphy.com/media/3knKct3fGqxhK/giphy.gif' },
  { label: 'Looking Around', url: 'https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif' },
];

export function GifPickerModal({ isOpen, onClose, onSelectGif }: GifPickerModalProps) {
  const [customUrl, setCustomUrl] = useState('');
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filteredGifs = CURATED_GIFS.filter((g) =>
    g.label.toLowerCase().includes(filter.toLowerCase())
  );

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      sound.playPop();
      onSelectGif(customUrl.trim());
      onClose();
      setCustomUrl('');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-[#11141D] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden font-kanit"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-glow" />
              <h3 className="text-lg font-semibold text-frost">Pick a Playful GIF</h3>
            </div>
            <button
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="text-secondary hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Custom URL Input */}
          <form onSubmit={handleCustomSubmit} className="mt-4 flex gap-2">
            <input
              type="url"
              placeholder="Or paste any GIF image URL..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 bg-[#181C26] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-frost placeholder:text-secondary focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={!customUrl.trim()}
              className="px-4 py-2 bg-accent hover:bg-accent-glow disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-all"
            >
              Use
            </button>
          </form>

          {/* Filter */}
          <div className="mt-3 relative">
            <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reaction GIFs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-[#181C26]/60 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-frost placeholder:text-secondary focus:outline-none focus:border-accent"
            />
          </div>

          {/* Grid of GIFs */}
          <div className="mt-4 grid grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {filteredGifs.map((gif, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  sound.playPop();
                  onSelectGif(gif.url);
                  onClose();
                }}
                className="group relative rounded-xl overflow-hidden aspect-video border border-white/5 hover:border-accent focus:outline-none focus:border-accent transition-all bg-black/40"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gif.url}
                  alt={gif.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                  <span className="text-[10px] text-white/90 font-mono block truncate text-center">
                    {gif.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 text-center">
            <p className="text-[11px] text-secondary font-mono">
              Tip: Click any GIF to attach it instantly to your comment!
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
