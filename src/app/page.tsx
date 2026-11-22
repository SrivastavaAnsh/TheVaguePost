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
    <div className="relative min-h-screen bg-canvas graffiti-canvas text-ink font-kanit">
      {/* Subtle Graffiti Hand-Drawn Background Doodles */}
      <div className="fixed top-12 left-4 md:left-12 pointer-events-none select-none opacity-20">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
        </svg>
      </div>
      <div className="fixed bottom-16 right-4 md:right-16 pointer-events-none select-none opacity-20 rotate-12">
        <svg width="56" height="56" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M10 80 Q 30 10, 50 80 T 90 20" strokeLinecap="round" />
        </svg>
      </div>

      {/* Clean Header */}
      <Header
        isAuthor={isAuthor}
        onOpenPasskey={() => setPasskeyModalOpen(true)}
        onOpenNewThought={() => setNewThoughtModalOpen(true)}
        onLockAuthor={handleLockAuthor}
        pinnedCount={pinnedPosts.length}
      />

      {/* Main Stream Area */}
      <main className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        {/* Simple Clean Title Bar with Graffiti Highlight */}
        <div className="mb-8 flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight flex items-center gap-2">
              <span className="marker-highlight">Thoughts</span> &amp; Musings
            </h1>
            <p className="text-xs text-muted font-mono mt-1">
              Read, like, and comment anonymously. Only Ansh posts.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 text-center space-y-2">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-muted">Loading thoughts...</p>
          </div>
        ) : (
          <>
            {/* Pinned Thoughts (Max 5) */}
            <PinnedSection
              pinnedPosts={pinnedPosts}
              isAuthor={isAuthor}
              onPostUpdated={fetchData}
            />

            {/* All Other Thoughts Feed */}
            <section className="space-y-5">
              {feedPosts.length === 0 && pinnedPosts.length === 0 ? (
                <div className="py-16 text-center rounded-2xl bg-white border border-neutral-200 p-6">
                  <p className="text-sm text-muted">
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
        <footer className="mt-16 pt-6 border-t border-neutral-200 text-center font-mono text-xs text-muted space-y-2">
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
