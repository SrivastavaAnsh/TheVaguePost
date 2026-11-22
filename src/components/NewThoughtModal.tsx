'use client';

import React, { useState } from 'react';
import { 
  X, 
  Pin, 
  Upload, 
  Film, 
  Link as LinkIcon, 
  AlertCircle 
} from 'lucide-react';
import { VibeCategory } from '@/lib/types';
import { sound } from './SoundEffects';
import { GifPickerModal } from './GifPickerModal';

interface NewThoughtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  pinnedCount: number;
}

const CATEGORIES: VibeCategory[] = [
  'Thought',
  'Idea',
  'Hot Take',
  'Observation',
  'Shower Thought',
  'Late Night',
  'Visual Fragment',
];

export function NewThoughtModal({
  isOpen,
  onClose,
  onPostCreated,
  pinnedCount,
}: NewThoughtModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<VibeCategory>('Thought');
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'gif'>('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [gifModalOpen, setGifModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMediaType('image');
        setMediaUrl(data.url);
        sound.playPop();
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch {
      setError('Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePinToggle = () => {
    if (!isPinned && pinnedCount >= 5) {
      sound.playPop();
      setError('Maximum 5 pinned thoughts! Unpin one first.');
      return;
    }
    sound.playPop();
    setIsPinned(!isPinned);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please write your thought.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || undefined,
          content: content.trim(),
          category,
          media_type: mediaType,
          media_url: mediaType !== 'none' ? mediaUrl.trim() : undefined,
          is_pinned: isPinned,
        }),
      });

      const data = await res.json();
      if (data.success) {
        sound.playPin();
        onPostCreated();
        onClose();
        setTitle('');
        setContent('');
        setCategory('Thought');
        setMediaType('none');
        setMediaUrl('');
        setIsPinned(false);
      } else {
        sound.playPop();
        setError(data.error || 'Failed to publish');
      }
    } catch {
      setError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border-2 border-black rounded-2xl p-6 shadow-hard my-8 font-kanit">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-5 right-5 text-neutral-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-black text-ink tracking-tight mb-4">
          New Thought
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono text-muted mb-1">
              Title <span className="opacity-60">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Midnight epiphanies..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-black"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-mono text-muted mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setCategory(cat);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    category === cat
                      ? 'bg-black text-white font-bold'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-mono text-muted mb-1">
              Your Thought
            </label>
            <textarea
              required
              rows={4}
              placeholder="Write your raw thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-black resize-none leading-relaxed"
            />
          </div>

          {/* Media */}
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted">Attach Media</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMediaType('none');
                    setMediaUrl('');
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    mediaType === 'none' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  None
                </button>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="px-2 py-0.5 rounded text-[11px] flex items-center gap-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800">
                    <Upload className="w-3 h-3" /> Upload
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setGifModalOpen(true);
                  }}
                  className="px-2 py-0.5 rounded text-[11px] flex items-center gap-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800"
                >
                  <Film className="w-3 h-3" /> GIF
                </button>
              </div>
            </div>

            {mediaType !== 'none' && (
              <div className="pt-1 space-y-2">
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <input
                    type="url"
                    placeholder="Or paste image or GIF URL..."
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="flex-1 bg-white border border-neutral-300 rounded-lg px-2.5 py-1 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-black"
                  />
                </div>

                {mediaUrl && (
                  <div className="relative rounded-lg overflow-hidden max-h-40 border border-neutral-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mediaUrl} alt="Preview" className="w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaType('none');
                        setMediaUrl('');
                      }}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black text-white hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pin Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-black" />
              <div>
                <span className="text-xs font-bold text-ink">Pin to Top</span>
                <span className="text-[10px] font-mono text-muted ml-2">
                  ({pinnedCount}/5 used)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePinToggle}
              className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                isPinned ? 'bg-black' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isPinned ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-red-50 text-xs text-red-600 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-mono text-muted hover:text-black transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-hard-sm disabled:opacity-40 transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              {isSubmitting ? 'Posting...' : 'Post Thought'}
            </button>
          </div>
        </form>
      </div>

      <GifPickerModal
        isOpen={gifModalOpen}
        onClose={() => setGifModalOpen(false)}
        onSelectGif={(url) => {
          setMediaType('gif');
          setMediaUrl(url);
        }}
      />
    </div>
  );
}
