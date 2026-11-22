'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Pin, 
  Upload, 
  Film, 
  Link as LinkIcon, 
  Check, 
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

const CATEGORIES: { label: VibeCategory; emoji: string }[] = [
  { label: 'Thought', emoji: '💭' },
  { label: 'Idea', emoji: '💡' },
  { label: 'Hot Take', emoji: '🔥' },
  { label: 'Observation', emoji: '👁️' },
  { label: 'Shower Thought', emoji: '🚿' },
  { label: 'Late Night', emoji: '🌙' },
  { label: 'Visual Fragment', emoji: '🎨' },
  { label: 'Random Spark', emoji: '⚡' },
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
      setError('Upload failed. Please check network.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePinToggle = () => {
    if (!isPinned && pinnedCount >= 5) {
      sound.playPop();
      setError('You already have 5 pinned thoughts! Unpin one first before pinning another.');
      return;
    }
    sound.playPop();
    setIsPinned(!isPinned);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please write your thought first!');
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
        // Reset form
        setTitle('');
        setContent('');
        setCategory('Thought');
        setMediaType('none');
        setMediaUrl('');
        setIsPinned(false);
      } else {
        sound.playPop();
        setError(data.error || 'Failed to publish thought');
      }
    } catch {
      setError('Network error. Failed to publish.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-[#12151E] border border-accent/30 rounded-3xl p-6 sm:p-7 shadow-glow my-8 font-kanit"
        >
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

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-1">
            <Sparkles className="w-5 h-5 text-accent-glow" />
            <h2 className="text-xl font-bold text-frost">Share a New Thought</h2>
          </div>
          <p className="text-xs text-secondary mb-5 font-mono">
            Author Broadcast • Instant live publishing to The VaguePost
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title (Optional) */}
            <div>
              <label className="block text-xs font-mono text-secondary mb-1">
                Headline / Title <span className="opacity-50">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. The Architecture of Vagueness..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#181C26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-frost placeholder:text-secondary/50 focus:outline-none focus:border-accent"
              />
            </div>

            {/* Vibe / Category Selector */}
            <div>
              <label className="block text-xs font-mono text-secondary mb-1.5">
                Vibe / Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setCategory(cat.label);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1.5 transition-all font-mono ${
                      category === cat.label
                        ? 'bg-accent text-white shadow-glow'
                        : 'bg-[#181C26] text-secondary hover:text-frost hover:bg-[#1E2330]'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Thought Content */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono text-secondary">
                  Your Thought / Idea / Musings
                </label>
                <span className="text-[10px] font-mono text-secondary/60">
                  {content.length} characters
                </span>
              </div>
              <textarea
                required
                rows={4}
                placeholder="What's spinning in your mind? Write raw, unhinged, profound, or vague thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-[#181C26] border border-white/10 rounded-xl p-3.5 text-sm text-frost placeholder:text-secondary/50 focus:outline-none focus:border-accent resize-none leading-relaxed"
              />
            </div>

            {/* Media Attachment Selector */}
            <div className="p-3.5 rounded-2xl bg-[#161A24] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-secondary">Attach Media</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMediaType('none');
                      setMediaUrl('');
                    }}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-mono transition-all ${
                      mediaType === 'none'
                        ? 'bg-white/15 text-white'
                        : 'text-secondary hover:text-frost'
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
                    <span
                      className={`px-2.5 py-1 text-[11px] rounded-lg font-mono flex items-center gap-1 transition-all ${
                        mediaType === 'image' && !mediaUrl.startsWith('http')
                          ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30'
                          : 'text-secondary hover:text-frost hover:bg-white/5'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      Upload
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setGifModalOpen(true);
                    }}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-mono flex items-center gap-1 transition-all ${
                      mediaType === 'gif'
                        ? 'bg-accent/20 text-accent-glow border border-accent/30'
                        : 'text-secondary hover:text-frost hover:bg-white/5'
                    }`}
                  >
                    <Film className="w-3 h-3" />
                    GIF
                  </button>
                </div>
              </div>

              {/* Direct URL input if user wants to paste URL */}
              {mediaType !== 'none' && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <input
                      type="url"
                      placeholder="Paste image or GIF URL directly..."
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      className="flex-1 bg-[#181C26] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-frost placeholder:text-secondary/50 focus:outline-none focus:border-accent"
                    />
                  </div>

                  {/* Media Preview */}
                  {mediaUrl && (
                    <div className="relative rounded-xl overflow-hidden max-h-48 border border-white/10 bg-black/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mediaUrl}
                        alt="Preview"
                        className="w-full h-auto max-h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setMediaType('none');
                          setMediaUrl('');
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isUploading && (
                <p className="text-xs text-accent-cyan font-mono animate-pulse">
                  Uploading image to server...
                </p>
              )}
            </div>

            {/* Pin Option (Max 5) */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#161A24] border border-white/5">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${isPinned ? 'bg-amber-400/20 text-amber-300' : 'bg-white/5 text-secondary'}`}>
                  <Pin className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-frost">Pin to Top</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      {pinnedCount}/5 Used
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary">
                    Feature this thought at the top of the feed (at most 5 pinned thoughts).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePinToggle}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  isPinned ? 'bg-amber-400' : 'bg-[#242938]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isPinned ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onClose();
                }}
                className="px-4 py-2.5 text-xs font-mono text-secondary hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-accent to-accent-cyan text-white text-xs font-semibold rounded-xl shadow-glow hover:opacity-95 disabled:opacity-40 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isSubmitting ? 'Publishing...' : 'Publish Thought'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <GifPickerModal
        isOpen={gifModalOpen}
        onClose={() => setGifModalOpen(false)}
        onSelectGif={(url) => {
          setMediaType('gif');
          setMediaUrl(url);
        }}
      />
    </AnimatePresence>
  );
}
