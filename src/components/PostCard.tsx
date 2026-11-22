'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Pin, 
  Trash2
} from 'lucide-react';
import { Post, VibeCategory } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { sound } from './SoundEffects';
import { CommentsDrawer } from './CommentsDrawer';
import { useToast } from './Toast';

interface PostCardProps {
  post: Post;
  isAuthor: boolean;
  pinnedCount: number;
  onPostUpdated: () => void;
}

const CATEGORY_STYLES: Record<VibeCategory, { bg: string; text: string; border: string }> = {
  'Thought': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  'Idea': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'Hot Take': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'Observation': { bg: 'bg-neutral-100', text: 'text-neutral-800', border: 'border-neutral-300' },
  'Shower Thought': { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
  'Late Night': { bg: 'bg-neutral-100', text: 'text-neutral-800', border: 'border-neutral-300' },
  'Visual Fragment': { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  'Random Spark': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
};

export function PostCard({
  post,
  isAuthor,
  pinnedCount,
  onPostUpdated,
}: PostCardProps) {
  const { showToast } = useToast();
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [isPinning, setIsPinning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [anonToken, setAnonToken] = useState('');

  useEffect(() => {
    setLikesCount(post.likes_count);
    setCommentsCount(post.comments_count);
  }, [post.likes_count, post.comments_count]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem('vague_anon_token');
      if (!token) {
        token = 'anon_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('vague_anon_token', token);
      }
      setAnonToken(token);

      fetch(`/api/posts/${post.id}/like?anon_token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setHasLiked(data.liked);
          }
        })
        .catch(() => {});
    }
  }, [post.id]);

  const handleLike = async (e: React.MouseEvent) => {
    if (isLiking) return;
    setIsLiking(true);

    const prevLiked = hasLiked;
    const prevCount = likesCount;

    setHasLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    if (!prevLiked) {
      sound.playLike();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 24,
        spread: 55,
        origin: { x, y },
        colors: ['#059669', '#EF4444', '#FFE600', '#111111'],
        disableForReducedMotion: true,
      });
    } else {
      sound.playPop();
    }

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anon_token: anonToken }),
      });
      const data = await res.json();
      if (data.success) {
        setHasLiked(data.liked);
        setLikesCount(data.likes_count);
      }
    } catch {
      setHasLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleTogglePin = async () => {
    if (isPinning) return;

    if (!post.is_pinned && pinnedCount >= 5) {
      sound.playPop();
      showToast('Maximum 5 pinned thoughts reached! Unpin one first.', 'error');
      return;
    }

    setIsPinning(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/pin`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        sound.playPin();
        showToast(
          data.post.is_pinned ? 'Thought pinned!' : 'Thought unpinned',
          'success'
        );
        onPostUpdated();
      } else {
        showToast(data.error || 'Failed to update pin', 'error');
      }
    } catch {
      showToast('Network error while pinning', 'error');
    } finally {
      setIsPinning(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this thought?')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        sound.playPop();
        showToast('Thought deleted', 'info');
        onPostUpdated();
      }
    } catch {
      showToast('Failed to delete', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    sound.playPop();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/#${post.id}`;
      navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  const catStyle = CATEGORY_STYLES[post.category] || CATEGORY_STYLES['Thought'];

  return (
    <article
      id={post.id}
      className={`relative rounded-2xl p-5 sm:p-6 bg-white border transition-all ${
        post.is_pinned
          ? 'border-neutral-900 shadow-hard'
          : 'border-neutral-200 shadow-soft hover:border-neutral-300'
      }`}
    >
      {/* Tape strip for pinned thoughts */}
      {post.is_pinned && (
        <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-sm bg-street-yellow border border-black/10 text-[10px] font-mono font-black uppercase tracking-wider text-black shadow-sm flex items-center gap-1 -rotate-1">
          <Pin className="w-2.5 h-2.5 fill-current text-black" />
          PINNED
        </div>
      )}

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Category Tag */}
          <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
            {post.category}
          </span>
          <span className="text-[11px] font-mono text-muted">
            {formatDate(post.created_at)}
          </span>
        </div>

        {/* Author Actions */}
        {isAuthor && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleTogglePin}
              disabled={isPinning}
              title={post.is_pinned ? "Unpin thought" : "Pin thought (Max 5)"}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                post.is_pinned
                  ? 'bg-street-yellow border-black text-black'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-black'
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete thought"
              className="p-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-street-red hover:border-red-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      {post.title && (
        <h3 className="text-lg sm:text-xl font-bold text-ink tracking-tight mb-2">
          {post.title}
        </h3>
      )}

      {/* Content */}
      <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-normal whitespace-pre-line">
        {post.content}
      </p>

      {/* Media: Image or GIF */}
      {post.media_type !== 'none' && post.media_url && (
        <div className="mt-4 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.media_url}
            alt={post.title || 'Thought Media'}
            className="w-full max-h-[460px] object-cover object-center"
            loading="lazy"
          />
        </div>
      )}

      {/* Interaction Bar */}
      <div className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          {/* Like Button (Opposite Red on color wheel!) */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              hasLiked
                ? 'bg-street-red-bg border-street-red/30 text-street-red font-bold'
                : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:text-street-red hover:border-street-red/30'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                hasLiked ? 'fill-current text-street-red' : ''
              }`}
            />
            <span>{likesCount}</span>
          </button>

          {/* Comment Button (Emerald Green highlight!) */}
          <button
            onClick={() => {
              sound.playPop();
              setCommentsOpen(!commentsOpen);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              commentsOpen
                ? 'bg-street-green border-street-green text-white shadow-sm'
                : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:text-street-green hover:border-street-green/40'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{commentsCount}</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          title="Copy link"
          className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Comments Drawer */}
      <CommentsDrawer
        postId={post.id}
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        isAuthor={isAuthor}
        onCommentAdded={() => {
          setCommentsCount((prev) => prev + 1);
          onPostUpdated();
        }}
      />
    </article>
  );
}
