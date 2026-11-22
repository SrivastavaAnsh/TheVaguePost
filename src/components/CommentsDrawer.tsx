'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Image as ImageIcon, 
  Film, 
  X, 
  Crown, 
  Upload, 
  AlertCircle,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { Comment } from '@/lib/types';
import { formatDate, getCommenterAvatar } from '@/lib/utils';
import { sound } from './SoundEffects';
import { GifPickerModal } from './GifPickerModal';

interface CommentsDrawerProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  isAuthor: boolean;
  onCommentAdded: () => void;
}

export function CommentsDrawer({
  postId,
  isOpen,
  onClose,
  isAuthor,
  onCommentAdded,
}: CommentsDrawerProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'gif'>('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [replyAsAuthor, setReplyAsAuthor] = useState(isAuthor);
  const [gifModalOpen, setGifModalOpen] = useState(false);

  // Visitor Anonymous Token
  const [anonToken, setAnonToken] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem('vague_anon_token');
      if (!token) {
        token = 'anon_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('vague_anon_token', token);
      }
      setAnonToken(token);
    }
  }, []);

  useEffect(() => {
    setReplyAsAuthor(isAuthor);
  }, [isAuthor]);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl.trim()) {
      setError('Please add a message, image, or GIF.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          media_type: mediaType,
          media_url: mediaType !== 'none' ? mediaUrl.trim() : undefined,
          anon_token: anonToken,
          is_author: isAuthor && replyAsAuthor,
        }),
      });

      const data = await res.json();
      if (data.success) {
        sound.playComment();
        setComments((prev) => [...prev, data.comment]);
        setContent('');
        setMediaType('none');
        setMediaUrl('');
        onCommentAdded();
      } else {
        setError(data.error || 'Failed to post comment');
      }
    } catch {
      setError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
      {/* Drawer Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-accent-cyan" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-frost">
            Discussion & Reactions ({comments.length})
          </h4>
        </div>
        <span className="text-[10px] font-mono text-secondary">
          No login needed • Commenters get #1, #2...
        </span>
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {loading ? (
          <div className="py-6 text-center text-xs font-mono text-secondary animate-pulse">
            Loading conversations...
          </div>
        ) : comments.length === 0 ? (
          <div className="py-6 text-center rounded-2xl bg-white/[0.02] border border-white/5 p-4">
            <p className="text-xs text-secondary font-kanit">
              No comments yet. Be <strong className="text-accent-glow">User #1</strong> to react!
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const avatarInfo = getCommenterAvatar(comment.user_number);

            return (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-2xl border transition-all ${
                  comment.is_author
                    ? 'bg-gradient-to-r from-accent/10 to-accent-cyan/10 border-accent/30 shadow-glow'
                    : 'bg-[#151922] border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    {/* Commenter Avatar */}
                    {comment.is_author ? (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-accent to-accent-cyan p-0.5 shadow-glow shrink-0">
                        <div className="w-full h-full bg-[#0C0C0C] rounded-full flex items-center justify-center">
                          <Crown className="w-3.5 h-3.5 text-amber-300" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`w-7 h-7 rounded-full bg-gradient-to-tr ${avatarInfo.bg} flex items-center justify-center border ${avatarInfo.border} text-xs font-mono font-bold shrink-0 shadow-sm`}
                      >
                        <span className={avatarInfo.text}>
                          {comment.user_number}
                        </span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold font-kanit text-frost">
                          {comment.is_author ? 'Ansh (Author)' : `User ${comment.user_number}`}
                        </span>
                        {comment.is_author && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-accent/20 border border-accent/40 text-accent-glow font-semibold flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> AUTHOR
                          </span>
                        )}
                        {!comment.is_author && (
                          <span className="text-[10px] font-mono text-secondary/60">
                            #{comment.user_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-secondary/70">
                    {formatDate(comment.created_at)}
                  </span>
                </div>

                {/* Comment Text */}
                {comment.content && (
                  <p className="text-xs text-frost/90 font-kanit leading-relaxed pl-9">
                    {comment.content}
                  </p>
                )}

                {/* Attached Media */}
                {comment.media_type !== 'none' && comment.media_url && (
                  <div className="mt-2.5 pl-9">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={comment.media_url}
                      alt="Attachment"
                      className="max-h-52 rounded-xl border border-white/10 object-cover shadow-md"
                      loading="lazy"
                    />
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* New Comment Input Box */}
      <form onSubmit={handleSubmit} className="p-3 rounded-2xl bg-[#12151E] border border-white/10 space-y-2.5">
        {/* Author Mode toggle if logged in */}
        {isAuthor && (
          <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs font-mono">
            <span className="text-secondary">Author replying identity:</span>
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setReplyAsAuthor(!replyAsAuthor);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all ${
                replyAsAuthor
                  ? 'bg-accent/20 border-accent/40 text-accent-glow font-bold'
                  : 'bg-white/5 border-white/10 text-secondary'
              }`}
            >
              {replyAsAuthor ? '★ Replying as Author (Ansh)' : 'Replying as Anonymous'}
            </button>
          </div>
        )}

        {/* Text Input */}
        <textarea
          rows={2}
          placeholder="Leave a vague reaction, idea, or thought..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-transparent border-0 text-xs text-frost placeholder:text-secondary/50 focus:outline-none resize-none leading-relaxed"
        />

        {/* Attached preview */}
        {mediaUrl && (
          <div className="relative inline-block rounded-xl overflow-hidden max-h-36 border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mediaUrl} alt="Attached" className="h-28 w-auto object-cover" />
            <button
              type="button"
              onClick={() => {
                setMediaType('none');
                setMediaUrl('');
              }}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-white hover:bg-red-500 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {isUploading && (
          <p className="text-[11px] font-mono text-accent-cyan animate-pulse">
            Uploading attachment...
          </p>
        )}

        {error && (
          <p className="text-[11px] font-mono text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {error}
          </p>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <div className="flex items-center gap-1">
            {/* Upload image */}
            <label className="cursor-pointer p-1.5 rounded-lg hover:bg-white/5 text-secondary hover:text-frost transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <ImageIcon className="w-4 h-4" />
            </label>

            {/* Pick GIF */}
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setGifModalOpen(true);
              }}
              title="Add a GIF"
              className="p-1.5 rounded-lg hover:bg-white/5 text-secondary hover:text-accent-glow transition-colors"
            >
              <Film className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (!content.trim() && !mediaUrl.trim())}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-glow text-white text-xs font-semibold rounded-xl shadow-glow disabled:opacity-40 transition-all"
          >
            <Send className="w-3 h-3" />
            <span>Send</span>
          </button>
        </div>
      </form>

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
