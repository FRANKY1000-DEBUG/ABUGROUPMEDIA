export type VideoStatus = "draft" | "published" | "scheduled";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Show {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  logo_url: string | null;
  host: string | null;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  category_id: string | null;
  show_id: string | null;
  author_id: string | null;
  duration_seconds: number | null;
  published_at: string | null;
  status: VideoStatus;
  featured: boolean;
  views: number;
  likes: number;
  author_name: string | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  show?: Show | null;
}

export interface Episode {
  id: string;
  show_id: string;
  video_id: string;
  episode_number: number;
  season: number;
}

export interface WatchProgress {
  id: string;
  user_id: string;
  video_id: string;
  progress: number; // 0..1
  position_seconds: number;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  tagline: string | null;
  contact_email: string | null;
  support_phone: string | null;
  maintenance_mode: boolean;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  video_id: string;
  created_at: string;
}
