'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Pin, Sparkles } from 'lucide-react';
import { Post } from '@/lib/types';
import { PostCard } from './PostCard';

interface PinnedSectionProps {
  pinnedPosts: Post[];
  isAuthor: boolean;
  onPostUpdated: () => void;
}

export function PinnedSection({
  pinnedPosts,
  isAuthor,
  onPostUpdated,
}: PinnedSectionProps) {
  if (pinnedPosts.length === 0) return null;

  return (
    <section className="mb-10 font-kanit">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300">
            <Pin className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-frost tracking-tight flex items-center gap-2">
              Pinned Thoughts
              <span className="text-xs font-mono font-normal text-amber-300/80 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                {pinnedPosts.length}/5
              </span>
            </h2>
            <p className="text-[11px] font-mono text-secondary">
              Hand-picked musings kept at the pinnacle
            </p>
          </div>
        </div>

        {isAuthor && (
          <span className="text-[11px] font-mono text-secondary/80 hidden sm:inline">
            Max 5 pinned thoughts
          </span>
        )}
      </div>

      {/* Pinned Thoughts Grid */}
      <div className="space-y-5">
        {pinnedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isAuthor={isAuthor}
            pinnedCount={pinnedPosts.length}
            onPostUpdated={onPostUpdated}
          />
        ))}
      </div>
    </section>
  );
}
