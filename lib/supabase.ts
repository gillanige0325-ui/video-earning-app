import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Database Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  balance: number;
  total_earned: number;
  videos_watched_today: number;
  last_video_date: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  category: string;
  earning_amount: number;
  is_active: boolean;
  created_at: string;
}

export interface VideoWatch {
  id: string;
  user_id: string;
  video_id: string;
  watched_at: string;
  earning_amount: number;
  watch_duration: number;
  completed: boolean;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  amount_usd: number;
  amount_pkr: number;
  exchange_rate: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  payment_method: string;
  payment_details: any;
  processed_at?: string;
  created_at: string;
}