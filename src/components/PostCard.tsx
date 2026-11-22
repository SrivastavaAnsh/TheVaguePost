'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Pin, 
  Trash2, 
  Sparkles, 
  Check, 
  Eye,
  MoreHorizontal
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
  'Thought': { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/30' },
  'Idea': { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  'Hot Take': { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/30' },
  'Observation': { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/30' },
  'Shower Thought': { bg: 'bg-teal-500/10', text: 'text-teal-300', border: 'border-teal-500/30' },
  'Late Night': { bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  'Visual Fragment': { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-300', border: 'border-fuchsia-500/30' },
  'Random Spark': { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30' },
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

      // Check if liked
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

    // Optimistic update
    setHasLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    if (!prevLiked) {
      sound.playLike();
      // Confetti burst
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { x, y },
        colors: ['#B600A8', '#4E8CF9', '#10A37F', '#F59E0B', '#FF3366'],
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
      // Rollback on network failure
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
      showToast('Maximum of 5 pinned thoughts reached! Unpin one first.', 'error');
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
          data.post.is_pinned ? 'Thought pinned to top!' : 'Thought unpinned',
          'success'
        );
        onPostUpdated();
      } else {
        showToast(data.error || 'Failed to update pin status', 'error');
      }
    } catch {
      showToast('Network error while pinning', 'error');
    } finally {
      setIsPinning(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this thought?')) return;
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
      showToast('Failed to delete thought', 'error');
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
    <motion.article
      id={post.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative rounded-3xl p-5 sm:p-6 transition-all font-kanit backdrop-blur-md ${
        post.is_pinned
          ? 'bg-[#141824]/90 border border-amber-400/30 shadow-card hover:border-amber-400/50'
          : 'bg-[#11141D]/90 border border-white/5 shadow-card hover:border-white/15'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pinned Badge */}
          {post.is_pinned && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300">
              <Pin className="w-2.5 h-2.5 fill-current" /> PINNED
            </span>
          )}

          {/* Category Badge */}
          <span
            className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
          >
            {post.category}
          </span>

          {/* Author indicator */}
          <span className="text-[11px] font-mono text-secondary flex items-center gap-1">
            by <strong className="text-frost">Ansh</strong>
          </span>
        </div>

        {/* Time Ago & Author Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-secondary/70">
            {formatDate(post.created_at)}
          </span>

          {isAuthor && (
            <div className="flex items-center gap-1 pl-2 border-l border-white/10">
              <button
                onClick={handleTogglePin}
                disabled={isPinning}
                title={post.is_pinned ? "Unpin thought" : "Pin thought (Max 5)"}
                className={`p-1.5 rounded-lg border transition-all ${
                  post.is_pinned
                    ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                    : 'bg-white/5 border-white/10 text-secondary hover:text-white'
                }`}
              >
                <Pin className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete thought"
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-secondary hover:text-red-400 hover:border-red-400/40 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title (if present) */}
      {post.title && (
        <h3 className="text-lg sm:text-xl font-bold text-frost tracking-tight mb-2 group-hover:text-white transition-colors">
          {post.title}
        </h3>
      )}

      {/* Content */}
      <p className="text-sm sm:text-base text-frost/90 leading-relaxed font-light whitespace-pre-line">
        {post.content}
      </p>

      {/* Media: Image or GIF */}
      {post.media_type !== 'none' && post.media_url && (
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 bg-black/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.media_url}
            alt={post.title || 'VaguePost Media'}
            className="w-full max-h-[500px] object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}

      {/* Interaction Bar */}
      <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              hasLiked
                ? 'bg-pink-500/20 border-pink-500/40 text-pink-400 shadow-glow'
                : 'bg-[#151922] border-white/5 text-secondary hover:text-pink-300 hover:border-pink-500/20'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform ${
                hasLiked ? 'fill-current scale-110' : ''
              }`}
            />
            <span className="font-bold">{likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => {
              sound.playPop();
              setCommentsOpen(!commentsOpen);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              commentsOpen
                ? 'bg-accent-cyan/20 border-accent-cyan/40 text-accent-cyan'
                : 'bg-[#151922] border-white/5 text-secondary hover:text-accent-cyan hover:border-accent-cyan/20'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="font-bold">{commentsCount}</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          title="Copy link to thought"
          className="p-1.5 rounded-xl bg-[#151922] border border-white/5 text-secondary hover:text-frost hover:border-white/10 transition-colors"
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
    </motion.article>
  );
}
