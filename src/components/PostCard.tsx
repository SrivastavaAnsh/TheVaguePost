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
import { Post } from '@/lib/types';
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
        particleCount: 22,
        spread: 50,
        origin: { x, y },
        colors: ['#FFE600', '#111111', '#EF4444', '#2563EB'],
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

  return (
    <article
      id={post.id}
      className={`relative rounded-2xl p-5 sm:p-6 bg-white border transition-all ${
        post.is_pinned
          ? 'border-neutral-900 shadow-hard'
          : 'border-neutral-200 shadow-soft hover:border-neutral-300'
      }`}
    >
      {/* Tape strip for pinned post */}
      {post.is_pinned && (
        <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-sm bg-graffiti-yellow border border-black/10 text-[10px] font-mono font-black uppercase tracking-wider text-black shadow-sm flex items-center gap-1 -rotate-1">
          <Pin className="w-2.5 h-2.5 fill-current" />
          PINNED
        </div>
      )}

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Category Tag */}
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200">
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
                  ? 'bg-graffiti-yellow border-black text-black'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-black'
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete thought"
              className="p-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Title (if present) */}
      {post.title && (
        <h3 className="text-lg font-bold text-ink tracking-tight mb-2">
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
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              hasLiked
                ? 'bg-red-50 border-red-200 text-red-600 font-bold'
                : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-300'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                hasLiked ? 'fill-current text-red-500' : ''
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              commentsOpen
                ? 'bg-black border-black text-white'
                : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-300'
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
