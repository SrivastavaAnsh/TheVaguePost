'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Image as ImageIcon, 
  Film, 
  X, 
  Crown, 
  AlertCircle
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
      setError('Add a comment, image, or GIF.');
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
    <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3 font-kanit">
      {/* Comments List */}
      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {loading ? (
          <p className="py-4 text-center text-xs font-mono text-muted">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted">
            No comments yet. Be <strong className="text-black font-mono">User 1</strong> to comment!
          </p>
        ) : (
          comments.map((comment) => {
            const avatarInfo = getCommenterAvatar(comment.user_number);

            return (
              <div
                key={comment.id}
                className={`p-3 rounded-xl border ${
                  comment.is_author
                    ? 'bg-street-green-bg/60 border-street-green/40 shadow-sm'
                    : 'bg-neutral-50/80 border-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {comment.is_author ? (
                      <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center">
                        <Crown className="w-3.5 h-3.5 text-street-yellow" />
                      </div>
                    ) : (
                      <div
                        className={`w-6 h-6 rounded-lg ${avatarInfo.bg} flex items-center justify-center text-xs font-mono font-bold shadow-sm`}
                      >
                        {comment.user_number}
                      </div>
                    )}

                    <span className="text-xs font-bold text-ink">
                      {comment.is_author ? 'Ansh (Author)' : `User ${comment.user_number}`}
                    </span>
                    {comment.is_author && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-street-green text-white font-bold">
                        AUTHOR
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-muted">
                    {formatDate(comment.created_at)}
                  </span>
                </div>

                {comment.content && (
                  <p className="text-xs text-neutral-800 leading-relaxed pl-8">
                    {comment.content}
                  </p>
                )}

                {comment.media_type !== 'none' && comment.media_url && (
                  <div className="mt-2 pl-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={comment.media_url}
                      alt="Attachment"
                      className="max-h-48 rounded-lg border border-neutral-200 object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Comment Input */}
      <form onSubmit={handleSubmit} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
        {isAuthor && (
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200 text-xs font-mono">
            <span className="text-muted text-[11px]">Identity:</span>
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setReplyAsAuthor(!replyAsAuthor);
              }}
              className="text-[10px] font-bold text-street-green underline"
            >
              {replyAsAuthor ? '★ Replying as Ansh (Author)' : 'Replying as Anonymous'}
            </button>
          </div>
        )}

        <textarea
          rows={2}
          placeholder="Leave a comment (text, image, or GIF)..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-transparent border-0 text-xs text-ink placeholder:text-muted focus:outline-none resize-none leading-relaxed"
        />

        {mediaUrl && (
          <div className="relative inline-block rounded-lg overflow-hidden max-h-28 border border-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mediaUrl} alt="Attached" className="h-20 w-auto object-cover" />
            <button
              type="button"
              onClick={() => {
                setMediaType('none');
                setMediaUrl('');
              }}
              className="absolute top-1 right-1 p-0.5 rounded-full bg-black text-white hover:bg-street-red transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {isUploading && (
          <p className="text-[10px] font-mono text-street-green">
            Uploading attachment...
          </p>
        )}

        {error && (
          <p className="text-[10px] font-mono text-street-red flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {error}
          </p>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-neutral-200">
          <div className="flex items-center gap-1">
            <label className="cursor-pointer p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <ImageIcon className="w-4 h-4" />
            </label>

            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setGifModalOpen(true);
              }}
              title="Add a GIF"
              className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors"
            >
              <Film className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (!content.trim() && !mediaUrl.trim())}
            className="flex items-center gap-1 px-3 py-1.5 bg-street-green hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-40 transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <Send className="w-3 h-3" />
            <span>Comment</span>
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
