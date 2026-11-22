'use client';

import React from 'react';
import { Pin } from 'lucide-react';
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
    <section className="mb-8 font-kanit">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-street-yellow text-black shadow-sm">
            <Pin className="w-3.5 h-3.5 fill-current" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink font-mono flex items-center gap-2">
            Pinned Thoughts
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-street-green-bg text-street-green border border-street-green/20">
              {pinnedPosts.length}/5
            </span>
          </h2>
        </div>
      </div>

      <div className="space-y-4">
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
