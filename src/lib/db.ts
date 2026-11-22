import fs from 'fs';
import path from 'path';
import { Post, Comment, VibeCategory } from './types';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'vaguepost.db');

// Safe singleton database holder
let dbInstance: any = null;

function getDb() {
  if (dbInstance) return dbInstance;

  try {
    // Node.js 22+ & 24 native SQLite
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseSync } = require('node:sqlite');
    dbInstance = new DatabaseSync(dbPath);
    initTables(dbInstance);
    return dbInstance;
  } catch (err) {
    console.warn("Native node:sqlite not directly available, using embedded fallback or file store:", err);
    throw err;
  }
}

function initTables(db: any) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT,
      content TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Thought',
      media_type TEXT NOT NULL DEFAULT 'none',
      media_url TEXT,
      is_pinned INTEGER NOT NULL DEFAULT 0,
      pinned_at TEXT,
      likes_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      user_number INTEGER NOT NULL,
      is_author INTEGER NOT NULL DEFAULT 0,
      user_anon_token TEXT NOT NULL,
      content TEXT NOT NULL,
      media_type TEXT NOT NULL DEFAULT 'none',
      media_url TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS likes (
      post_id TEXT NOT NULL,
      user_anon_token TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (post_id, user_anon_token)
    );

    CREATE TABLE IF NOT EXISTS anonymous_users (
      anon_token TEXT PRIMARY KEY,
      user_number INTEGER NOT NULL UNIQUE,
      first_seen_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_posts_pinned ON posts (is_pinned, pinned_at DESC, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_comments_post ON comments (post_id, created_at ASC);
  `);

  // Seed sample thoughts if table is empty
  const countRow = db.prepare('SELECT COUNT(*) as count FROM posts').get();
  if (!countRow || countRow.count === 0) {
    seedInitialPosts(db);
  }
}

function seedInitialPosts(db: any) {
  const now = new Date();
  const initialPosts = [
    {
      id: 'vague-1',
      title: 'The Architecture of Vagueness',
      content: "Sometimes an idea needs to remain vague before it sharpens into reality. The moment you over-specify too early, the magic of spontaneous iteration evaporates. Welcome to The VaguePost — my digital brain-dump.",
      category: 'Thought',
      media_type: 'none',
      media_url: '',
      is_pinned: 1,
      pinned_at: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'vague-2',
      title: 'Late Night Prototyping Mode',
      content: "3:40 AM hits and suddenly physics in UI feel like the most important problem in human history. Spring stiffness = 300, damping = 24. Perfection.",
      category: 'Late Night',
      media_type: 'image',
      media_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      is_pinned: 1,
      pinned_at: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: 'vague-3',
      title: 'Hot Take on Clean Interfaces',
      content: "Minimalism got boring when everyone started removing personality. Give me tactile buttons, weird glowing accents, sound effects, and zero-click delights any day.",
      category: 'Hot Take',
      media_type: 'none',
      media_url: '',
      is_pinned: 0,
      pinned_at: null,
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      id: 'vague-4',
      title: 'Visual Resonance',
      content: "Capturing light reflections on curved glass in motion. There's a subtle harmony when typography aligns with raw dark backgrounds.",
      category: 'Visual Fragment',
      media_type: 'gif',
      media_url: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
      is_pinned: 0,
      pinned_at: null,
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    }
  ];

  const insert = db.prepare(`
    INSERT INTO posts (id, title, content, category, media_type, media_url, is_pinned, pinned_at, likes_count, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of initialPosts) {
    insert.run(
      p.id,
      p.title,
      p.content,
      p.category,
      p.media_type,
      p.media_url,
      p.is_pinned,
      p.pinned_at,
      p.is_pinned ? 42 : 17,
      p.created_at,
      p.created_at
    );
  }
}

// Post operations
export function getPosts(filter?: { category?: string; pinnedOnly?: boolean }) {
  const db = getDb();
  let query = `
    SELECT p.*,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comments_count
    FROM posts p
  `;
  const params: any[] = [];
  const conditions: string[] = [];

  if (filter?.pinnedOnly) {
    conditions.push('p.is_pinned = 1');
  }

  if (filter?.category && filter.category !== 'All') {
    conditions.push('p.category = ?');
    params.push(filter.category);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  // Order: pinned first (by pinned_at desc), then non-pinned (created_at desc)
  query += ' ORDER BY p.is_pinned DESC, p.pinned_at DESC, p.created_at DESC';

  const rows = db.prepare(query).all(...params);
  return rows.map((r: any) => ({
    ...r,
    is_pinned: Boolean(r.is_pinned),
    likes_count: Number(r.likes_count),
    comments_count: Number(r.comments_count)
  })) as Post[];
}

export function getPostById(id: string) {
  const db = getDb();
  const post = db.prepare(`
    SELECT p.*,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comments_count
    FROM posts p
    WHERE p.id = ?
  `).get(id);

  if (!post) return null;
  return {
    ...post,
    is_pinned: Boolean(post.is_pinned),
    likes_count: Number(post.likes_count),
    comments_count: Number(post.comments_count)
  } as Post;
}

export function createPost(data: {
  title?: string;
  content: string;
  category?: VibeCategory;
  media_type?: 'none' | 'image' | 'gif';
  media_url?: string;
  is_pinned?: boolean;
}) {
  const db = getDb();
  const id = 'vp-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  const isPinned = data.is_pinned ? 1 : 0;

  if (isPinned) {
    const pinnedCount = db.prepare('SELECT COUNT(*) as count FROM posts WHERE is_pinned = 1').get().count;
    if (pinnedCount >= 5) {
      throw new Error('Maximum of 5 pinned thoughts reached! Please unpin another thought first.');
    }
  }

  const stmt = db.prepare(`
    INSERT INTO posts (id, title, content, category, media_type, media_url, is_pinned, pinned_at, likes_count, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
  `);

  stmt.run(
    id,
    data.title || null,
    data.content,
    data.category || 'Thought',
    data.media_type || 'none',
    data.media_url || null,
    isPinned,
    isPinned ? now : null,
    now,
    now
  );

  return getPostById(id);
}

export function updatePost(id: string, data: Partial<Post>) {
  const db = getDb();
  const existing = getPostById(id);
  if (!existing) throw new Error('Post not found');

  const now = new Date().toISOString();
  let isPinned = existing.is_pinned ? 1 : 0;
  let pinnedAt = existing.pinned_at;

  if (data.is_pinned !== undefined) {
    const requestedPinned = data.is_pinned ? 1 : 0;
    if (requestedPinned && !existing.is_pinned) {
      const pinnedCount = db.prepare('SELECT COUNT(*) as count FROM posts WHERE is_pinned = 1 AND id != ?').get(id).count;
      if (pinnedCount >= 5) {
        throw new Error('Maximum of 5 pinned thoughts reached! Please unpin another thought first.');
      }
      isPinned = 1;
      pinnedAt = now;
    } else if (!requestedPinned) {
      isPinned = 0;
      pinnedAt = null;
    }
  }

  const stmt = db.prepare(`
    UPDATE posts
    SET title = ?, content = ?, category = ?, media_type = ?, media_url = ?, is_pinned = ?, pinned_at = ?, updated_at = ?
    WHERE id = ?
  `);

  stmt.run(
    data.title !== undefined ? data.title : existing.title || null,
    data.content !== undefined ? data.content : existing.content,
    data.category !== undefined ? data.category : existing.category,
    data.media_type !== undefined ? data.media_type : existing.media_type,
    data.media_url !== undefined ? data.media_url : existing.media_url || null,
    isPinned,
    pinnedAt,
    now,
    id
  );

  return getPostById(id);
}

export function togglePin(id: string) {
  const existing = getPostById(id);
  if (!existing) throw new Error('Post not found');

  const newPinState = !existing.is_pinned;
  return updatePost(id, { is_pinned: newPinState });
}

export function deletePost(id: string) {
  const db = getDb();
  db.prepare('DELETE FROM comments WHERE post_id = ?').run(id);
  db.prepare('DELETE FROM likes WHERE post_id = ?').run(id);
  const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);
  return result.changes > 0;
}

// Like operations
export function toggleLike(postId: string, userAnonToken: string) {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM likes WHERE post_id = ? AND user_anon_token = ?').get(postId, userAnonToken);

  if (existing) {
    // Unlike
    db.prepare('DELETE FROM likes WHERE post_id = ? AND user_anon_token = ?').run(postId, userAnonToken);
    db.prepare('UPDATE posts SET likes_count = MAX(0, likes_count - 1) WHERE id = ?').run(postId);
  } else {
    // Like
    const now = new Date().toISOString();
    db.prepare('INSERT INTO likes (post_id, user_anon_token, created_at) VALUES (?, ?, ?)').run(postId, userAnonToken, now);
    db.prepare('UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?').run(postId);
  }

  const post = getPostById(postId);
  return {
    liked: !existing,
    likes_count: post?.likes_count || 0
  };
}

export function hasLiked(postId: string, userAnonToken: string): boolean {
  if (!userAnonToken) return false;
  const db = getDb();
  const row = db.prepare('SELECT 1 FROM likes WHERE post_id = ? AND user_anon_token = ?').get(postId, userAnonToken);
  return Boolean(row);
}

// Anonymous user numbering assignment
export function getOrCreateUserNumber(anonToken: string): number {
  const db = getDb();
  const existing = db.prepare('SELECT user_number FROM anonymous_users WHERE anon_token = ?').get(anonToken);
  if (existing) {
    return Number(existing.user_number);
  }

  // Assign the next sequential global number starting from 1
  const maxRow = db.prepare('SELECT COALESCE(MAX(user_number), 0) as max_num FROM anonymous_users').get();
  const nextNum = Number(maxRow.max_num) + 1;
  const now = new Date().toISOString();

  db.prepare('INSERT INTO anonymous_users (anon_token, user_number, first_seen_at) VALUES (?, ?, ?)').run(anonToken, nextNum, now);
  return nextNum;
}

// Comments operations
export function getComments(postId: string): Comment[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC').all(postId);
  return rows.map((r: any) => ({
    ...r,
    is_author: Boolean(r.is_author),
    user_number: Number(r.user_number)
  }));
}

export function createComment(data: {
  post_id: string;
  content: string;
  media_type?: 'none' | 'image' | 'gif';
  media_url?: string;
  anon_token: string;
  is_author?: boolean;
}) {
  const db = getDb();
  const post = getPostById(data.post_id);
  if (!post) throw new Error('Post not found');

  const id = 'cm-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  const isAuthor = Boolean(data.is_author);

  // Determine user number: if author, 0 (or author badge), otherwise sequential 1, 2, 3...
  let userNumber = 0;
  if (!isAuthor) {
    userNumber = getOrCreateUserNumber(data.anon_token);
  }

  const stmt = db.prepare(`
    INSERT INTO comments (id, post_id, user_number, is_author, user_anon_token, content, media_type, media_url, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    data.post_id,
    userNumber,
    isAuthor ? 1 : 0,
    data.anon_token,
    data.content,
    data.media_type || 'none',
    data.media_url || null,
    now
  );

  return {
    id,
    post_id: data.post_id,
    user_number: userNumber,
    is_author: isAuthor,
    user_anon_token: data.anon_token,
    content: data.content,
    media_type: data.media_type || 'none',
    media_url: data.media_url || null,
    created_at: now
  } as Comment;
}

export function getStats() {
  const db = getDb();
  const totalPosts = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
  const pinnedPosts = db.prepare('SELECT COUNT(*) as count FROM posts WHERE is_pinned = 1').get().count;
  const totalComments = db.prepare('SELECT COUNT(*) as count FROM comments').get().count;
  const totalLikes = db.prepare('SELECT COALESCE(SUM(likes_count), 0) as count FROM posts').get().count;
  const totalCommenters = db.prepare('SELECT COUNT(*) as count FROM anonymous_users').get().count;

  return {
    totalPosts: Number(totalPosts),
    pinnedPosts: Number(pinnedPosts),
    maxPinned: 5,
    totalComments: Number(totalComments),
    totalLikes: Number(totalLikes),
    totalCommenters: Number(totalCommenters)
  };
}
