'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Pin, 
  Plus, 
  Flame, 
  Lightbulb, 
  Moon, 
  Palette, 
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Post, VibeCategory } from '@/lib/types';
import { Header } from '@/components/Header';
import { PostCard } from '@/components/PostCard';
import { PinnedSection } from '@/components/PinnedSection';
import { PasskeyModal } from '@/components/PasskeyModal';
import { NewThoughtModal } from '@/components/NewThoughtModal';
import { sound } from '@/components/SoundEffects';
import { useToast } from '@/components/Toast';

const FILTER_TAGS = [
  { label: 'All', icon: Sparkles },
  { label: '📌 Pinned', icon: Pin },
  { label: 'Thought', icon: Sparkles },
  { label: 'Idea', icon: Lightbulb },
  { label: 'Hot Take', icon: Flame },
  { label: 'Late Night', icon: Moon },
  { label: 'Visual Fragment', icon: Palette },
];

export default function HomePage() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
  const [newThoughtModalOpen, setNewThoughtModalOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalPosts: 0,
    pinnedPosts: 0,
    maxPinned: 5,
    totalLikes: 0,
    totalCommenters: 0,
  });

  const checkAuthorAuth = useCallback(() => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split('; ');
      const authCookie = cookies.find((row) => row.startsWith('vague_author_token='));
      setIsAuthor(authCookie?.split('=')[1] === 'author-auth-valid');
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [postsRes, statsRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/stats'),
      ]);

      const postsData = await postsRes.json();
      const statsData = await statsRes.json();

      if (postsData.success) {
        setPosts(postsData.posts);
      }
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
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

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    // Tag filter
    if (activeFilter === '📌 Pinned') {
      if (!post.is_pinned) return false;
    } else if (activeFilter !== 'All') {
      if (post.category !== activeFilter) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title?.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchCat = post.category.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchCat) return false;
    }

    return true;
  });

  const pinnedPosts = posts.filter((p) => p.is_pinned);
  const showPinnedSection = activeFilter === 'All' && !searchQuery.trim();
  const regularFeedPosts = showPinnedSection
    ? filteredPosts.filter((p) => !p.is_pinned)
    : filteredPosts;

  return (
    <div className="relative min-h-screen bg-[#0C0C0C] bg-grid selection:bg-accent/30 selection:text-frost">
      {/* Ambient glowing gradients */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[130px] pointer-events-none animate-ambient" />
      <div className="fixed top-60 right-1/4 w-96 h-96 bg-accent-cyan/15 rounded-full blur-[130px] pointer-events-none animate-ambient" />

      {/* Header */}
      <Header
        isAuthor={isAuthor}
        onOpenPasskey={() => setPasskeyModalOpen(true)}
        onOpenNewThought={() => setNewThoughtModalOpen(true)}
        onLockAuthor={handleLockAuthor}
        stats={stats}
      />

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 relative z-10">
        {/* Playful Hero Card */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#141824]/90 to-[#0F121A]/90 border border-white/10 shadow-2xl overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent-glow text-xs font-mono font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              ANSH&apos;S UNFILTERED BRAINDUMP
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-frost to-secondary tracking-tight">
              Thoughts, Ideas &amp; Visual Fragments
            </h2>

            <p className="mt-2.5 text-xs sm:text-sm text-secondary font-light max-w-xl leading-relaxed">
              Where half-baked thoughts, late-night design epiphanies, and visual sparks live. Anyone can like and react with text, images, or GIFs — no sign-up required. Commenters are sequentially assigned <span className="font-mono text-accent-cyan font-bold">User #1, #2, #3...</span>
            </p>

            {/* Author Quick Callout or Active Creator Banner */}
            {isAuthor ? (
              <div className="mt-5 flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-accent/20 to-accent-cyan/20 border border-accent/40 shadow-glow">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-glow animate-ping" />
                  <span className="text-xs font-mono font-semibold text-frost">
                    Author Mode Active • Broadcast to The VaguePost
                  </span>
                </div>
                <button
                  onClick={() => {
                    sound.playPop();
                    setNewThoughtModalOpen(true);
                  }}
                  className="px-4 py-1.5 bg-accent hover:bg-accent-glow text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Post Thought
                </button>
              </div>
            ) : (
              <div className="mt-5 flex items-center gap-2 text-[11px] font-mono text-secondary/80">
                <span>✦ Read-only for visitors • Only Ansh can post thoughts</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="space-y-3 mb-8">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search thoughts, ideas, hot takes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12151E] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-frost placeholder:text-secondary/50 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Tag Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {FILTER_TAGS.map((tag) => (
              <button
                key={tag.label}
                onClick={() => {
                  sound.playPop();
                  setActiveFilter(tag.label);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium shrink-0 transition-all ${
                  activeFilter === tag.label
                    ? 'bg-accent text-white shadow-glow'
                    : 'bg-[#12151E] text-secondary hover:text-frost hover:bg-[#181C26] border border-white/5'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-secondary">Summoning vague thoughts...</p>
          </div>
        ) : (
          <>
            {/* Pinned Section (Top Showcase, max 5) */}
            {showPinnedSection && (
              <PinnedSection
                pinnedPosts={pinnedPosts}
                isAuthor={isAuthor}
                onPostUpdated={fetchData}
              />
            )}

            {/* River of Thoughts */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono uppercase tracking-wider text-secondary font-bold">
                  {activeFilter === 'All' ? 'Latest Thoughts' : `${activeFilter} Feed`} ({regularFeedPosts.length})
                </h3>
              </div>

              {regularFeedPosts.length === 0 ? (
                <div className="py-16 text-center rounded-3xl bg-[#12151E]/60 border border-white/5 p-6 space-y-3">
                  <p className="text-sm text-secondary font-kanit">
                    No thoughts found matching this filter or search.
                  </p>
                  {isAuthor && (
                    <button
                      onClick={() => {
                        sound.playPop();
                        setNewThoughtModalOpen(true);
                      }}
                      className="px-4 py-2 bg-accent hover:bg-accent-glow text-white text-xs font-bold rounded-xl shadow-glow transition-all"
                    >
                      Post the first thought
                    </button>
                  )}
                </div>
              ) : (
                regularFeedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    isAuthor={isAuthor}
                    pinnedCount={stats.pinnedPosts}
                    onPostUpdated={fetchData}
                  />
                ))
              )}
            </section>
          </>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/10 text-center space-y-3 font-mono text-xs text-secondary">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://anshsrivas1ava.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-frost hover:text-accent-glow transition-colors"
            >
              <span>Portfolio of Ansh Srivastava</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span className="text-secondary/70">The VaguePost © {new Date().getFullYear()}</span>
            <span>•</span>
            <button
              onClick={() => {
                sound.playPop();
                setPasskeyModalOpen(true);
              }}
              className="hover:text-frost transition-colors flex items-center gap-1"
            >
              <Lock className="w-3 h-3 text-accent" />
              <span>{isAuthor ? 'Author Unlocked' : 'Author Login'}</span>
            </button>
          </div>
          <p className="text-[11px] text-secondary/60">
            Crafted with Kanit &amp; JetBrains Mono typography, Node.js SQLite, and Framer Motion.
          </p>
        </footer>
      </main>

      {/* Author Passkey Modal */}
      <PasskeyModal
        isOpen={passkeyModalOpen}
        onClose={() => setPasskeyModalOpen(false)}
        onSuccess={() => {
          setIsAuthor(true);
          showToast('Welcome Ansh! Author Mode Unlocked.', 'success');
          fetchData();
        }}
      />

      {/* New Thought Composer Modal */}
      <NewThoughtModal
        isOpen={newThoughtModalOpen}
        onClose={() => setNewThoughtModalOpen(false)}
        onPostCreated={() => {
          showToast('Thought posted successfully!', 'success');
          fetchData();
        }}
        pinnedCount={stats.pinnedPosts}
      />
    </div>
  );
}
