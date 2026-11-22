export type VibeCategory = 
  | 'Thought' 
  | 'Idea' 
  | 'Observation' 
  | 'Hot Take' 
  | 'Shower Thought' 
  | 'Late Night' 
  | 'Visual Fragment'
  | 'Random Spark';

export interface Post {
  id: string;
  title?: string;
  content: string;
  category: VibeCategory;
  media_type: 'none' | 'image' | 'gif';
  media_url?: string;
  is_pinned: boolean;
  pinned_at?: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_number: number;
  is_author: boolean;
  user_anon_token: string;
  content: string;
  media_type: 'none' | 'image' | 'gif';
  media_url?: string;
  created_at: string;
}

export interface AnonymousUser {
  anon_token: string;
  user_number: number;
  first_seen_at: string;
}

export interface CreatePostPayload {
  content: string;
  title?: string;
  category?: VibeCategory;
  media_type?: 'none' | 'image' | 'gif';
  media_url?: string;
  is_pinned?: boolean;
}

export interface CreateCommentPayload {
  post_id: string;
  content: string;
  media_type?: 'none' | 'image' | 'gif';
  media_url?: string;
  anon_token: string;
  is_author?: boolean;
}
