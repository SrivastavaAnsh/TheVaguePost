'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Post } from '@/lib/types';
import { Header } from '@/components/Header';
import { PostCard } from '@/components/PostCard';
import { PinnedSection } from '@/components/PinnedSection';
import { PasskeyModal } from '@/components/PasskeyModal';
import { NewThoughtModal } from '@/components/NewThoughtModal';
import { useToast } from '@/components/Toast';

export default function HomePage() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);

  // Modals
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
  const [newThoughtModalOpen, setNewThoughtModalOpen] = useState(false);

  const checkAuthorAuth = useCallback(() => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split('; ');
      const authCookie = cookies.find((row) => row.startsWith('vague_author_token='));
      setIsAuthor(authCookie?.split('=')[1] === 'author-auth-valid');
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Failed to fetch thoughts', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthorAuth();
    fetchData();
  }, [checkAuthorAuth, fetchData]);

  const handleLockAuthor = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      document.cookie = 'vague_author_token=; Max-Age=0; path=/;';
      setIsAuthor(false);
      showToast('Author mode locked', 'info');
    } catch {}
  };

  const pinnedPosts = posts.filter((p) => p.is_pinned);
  const feedPosts = posts.filter((p) => !p.is_pinned);

  return (
    <div className="relative min-h-screen bg-[#FEF7F0] cosmic-canvas text-ink font-kanit">
      {/* Full-Width Header */}
      <Header
        isAuthor={isAuthor}
        onOpenPasskey={() => setPasskeyModalOpen(true)}
        onOpenNewThought={() => setNewThoughtModalOpen(true)}
        onLockAuthor={handleLockAuthor}
        pinnedCount={pinnedPosts.length}
      />

      {/* Main Stream Area */}
      <main className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        {/* Clean Aesthetic Intro */}
        <div className="mb-8 flex items-center justify-between border-b border-black/[0.06] pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-600 block mb-1">
              LATEST THOUGHTS
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              Some thoughts are worth sharing.
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1 leading-relaxed">
              A cozy space for ideas, thoughts, and everything in between.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 text-center space-y-2">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-400">Loading thoughts...</p>
          </div>
        ) : (
          <>
            {/* Pinned Thoughts (Max 5) */}
            <PinnedSection
              pinnedPosts={pinnedPosts}
              isAuthor={isAuthor}
              onPostUpdated={fetchData}
            />

            {/* Stream of Thoughts */}
            <section className="space-y-5">
              {feedPosts.length === 0 && pinnedPosts.length === 0 ? (
                <div className="py-16 text-center rounded-3xl bg-white border border-black/[0.05] p-6 shadow-sm">
                  <p className="text-sm text-slate-500">
                    No thoughts yet.
                  </p>
                </div>
              ) : (
                feedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    isAuthor={isAuthor}
                    pinnedCount={pinnedPosts.length}
                    onPostUpdated={fetchData}
                  />
                ))
              )}
            </section>
          </>
        )}

        {/* Clean Footer */}
        <footer className="mt-16 pt-6 border-t border-black/[0.06] text-center font-mono text-xs text-slate-400 space-y-1">
          <p>The VaguePost • Ansh Srivastava</p>
        </footer>
      </main>

      {/* Author Passkey Modal */}
      <PasskeyModal
        isOpen={passkeyModalOpen}
        onClose={() => setPasskeyModalOpen(false)}
        onSuccess={() => {
          setIsAuthor(true);
          showToast('Author Mode Unlocked', 'success');
          fetchData();
        }}
      />

      {/* New Thought Composer Modal */}
      <NewThoughtModal
        isOpen={newThoughtModalOpen}
        onClose={() => setNewThoughtModalOpen(false)}
        onPostCreated={() => {
          showToast('Thought posted!', 'success');
          fetchData();
        }}
        pinnedCount={pinnedPosts.length}
      />
    </div>
  );
}
