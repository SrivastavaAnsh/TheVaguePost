'use client';

import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { sound } from './SoundEffects';

interface GifPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGif: (url: string) => void;
}

const CURATED_GIFS = [
  { label: 'Mind Blown', url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
  { label: 'Popcorn', url: 'https://media.giphy.com/media/gl0mkIZOW6Nwc/giphy.gif' },
  { label: 'Yes', url: 'https://media.giphy.com/media/NEvPzZ8bd1V4Y/giphy.gif' },
  { label: 'Cat Typing', url: 'https://media.giphy.com/media/unQ3IJU2RG7DO/giphy.gif' },
  { label: 'Vibes', url: 'https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif' },
  { label: 'Applause', url: 'https://media.giphy.com/media/nbvFVPiEiJH6Q/giphy.gif' },
  { label: 'Tea', url: 'https://media.giphy.com/media/3o85xGocUH8RYoDKKs/giphy.gif' },
  { label: 'Dance', url: 'https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif' },
  { label: 'Looking', url: 'https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif' },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white border-2 border-black rounded-2xl p-5 shadow-hard font-kanit">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <h3 className="text-base font-bold text-ink">Choose a GIF</h3>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="text-neutral-400 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCustomSubmit} className="mt-3 flex gap-2">
          <input
            type="url"
            placeholder="Paste any GIF URL..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-1.5 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            disabled={!customUrl.trim()}
            className="px-3 py-1.5 bg-black hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold"
          >
            Use
          </button>
        </form>

        <div className="mt-2 relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reaction GIFs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-8 pr-2.5 py-1 text-xs text-ink placeholder:text-muted focus:outline-none"
          />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
          {filteredGifs.map((gif, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                sound.playPop();
                onSelectGif(gif.url);
                onClose();
              }}
              className="group rounded-lg overflow-hidden aspect-video border border-neutral-200 hover:border-black focus:border-black transition-all bg-neutral-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gif.url}
                alt={gif.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
