export interface Profile {
  id: string;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
  role?: 'admin' | 'user' | string | null;
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  anime_id: string;
  anime_title: string;
  anime_poster: string | null;
  status: 'watching' | 'plan_to_watch' | 'completed';
  created_at: string;
}

export interface WatchHistoryItem {
  id: string;
  user_id: string;
  anime_id: string;
  anime_title: string;
  anime_poster: string | null;
  episode_id: string;
  episode_title: string;
  episode_number: number;
  last_watched_at: string;
}
