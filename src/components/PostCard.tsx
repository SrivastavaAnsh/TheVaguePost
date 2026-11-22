'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Pin, 
  Trash2,
  Calendar
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
  'Thought': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
  'Idea': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
  'Hot Take': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
  'Observation': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  'Shower Thought': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100' },
  'Late Night': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
  'Visual Fragment': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100' },
  'Random Spark': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
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
        particleCount: 20,
        spread: 50,
        origin: { x, y },
        colors: ['#FBBF24', '#818CF8', '#F472B6', '#38BDF8'],
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
      showToast('Maximum 5 pinned thoughts! Unpin one first.', 'error');
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
      className={`relative rounded-3xl p-6 sm:p-7 bg-white transition-all ${
        post.is_pinned
          ? 'border border-amber-300 shadow-[0_4px_24px_-4px_rgba(251,191,36,0.15)] ring-1 ring-amber-200'
          : 'border border-black/[0.05] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)]'
      }`}
    >
      {/* Pinned Pill Sticker */}
      {post.is_pinned && (
        <div className="absolute -top-3 left-7 px-3 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 shadow-sm flex items-center gap-1">
          <Pin className="w-2.5 h-2.5 fill-current text-amber-600" />
          PINNED
        </div>
      )}

      {/* Top Meta Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Category Tag */}
          <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
            {post.category}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
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
              className={`p-1.5 rounded-full border text-xs transition-colors ${
                post.is_pinned
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-black'
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete thought"
              className="p-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      {post.title && (
        <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
          {post.title}
        </h3>
      )}

      {/* Content */}
      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal whitespace-pre-line">
        {post.content}
      </p>

      {/* Media: Image or GIF */}
      {post.media_type !== 'none' && post.media_url && (
        <div className="mt-4 rounded-2xl overflow-hidden border border-black/[0.05] bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.media_url}
            alt={post.title || 'Thought Media'}
            className="w-full max-h-[460px] object-cover object-center"
            loading="lazy"
          />
        </div>
      )}

      {/* Interaction Bar matching reference image aesthetic */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
        <div className="flex items-center gap-3">
          {/* Date Stamp */}
          <div className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(post.created_at)}</span>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
              hasLiked
                ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                hasLiked ? 'fill-current text-rose-500' : ''
              }`}
            />
            <span>{likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => {
              sound.playPop();
              setCommentsOpen(!commentsOpen);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
              commentsOpen
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
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
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
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
