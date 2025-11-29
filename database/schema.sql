-- Video Earning App Database Schema
-- Run this in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  balance DECIMAL(10, 2) DEFAULT 0.00,
  total_earned DECIMAL(10, 2) DEFAULT 0.00,
  videos_watched_today INTEGER DEFAULT 0,
  last_video_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  video_url VARCHAR(1000) NOT NULL,
  thumbnail_url VARCHAR(1000),
  duration INTEGER NOT NULL, -- in seconds
  category VARCHAR(100) DEFAULT 'general',
  earning_amount DECIMAL(10, 2) DEFAULT 0.50,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Video watches table
CREATE TABLE IF NOT EXISTS video_watches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  watched_at TIMESTAMP DEFAULT NOW(),
  earning_amount DECIMAL(10, 2) DEFAULT 0.00,
  watch_duration INTEGER NOT NULL, -- in seconds
  completed BOOLEAN DEFAULT false,
  UNIQUE(user_id, video_id, DATE(watched_at))
);

-- Withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount_usd DECIMAL(10, 2) NOT NULL,
  amount_pkr DECIMAL(12, 2) NOT NULL,
  exchange_rate DECIMAL(10, 4) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, rejected
  payment_method VARCHAR(100) NOT NULL,
  payment_details JSONB,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_video_watches_user_id ON video_watches(user_id);
CREATE INDEX IF NOT EXISTS idx_video_watches_video_id ON video_watches(video_id);
CREATE INDEX IF NOT EXISTS idx_video_watches_watched_at ON video_watches(watched_at);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_is_active ON videos(is_active);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample videos
INSERT INTO videos (title, description, video_url, thumbnail_url, duration, category, earning_amount) VALUES
('Action Movie Clip - Epic Fight Scene', 'Watch this amazing action sequence from a blockbuster movie', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 180, 'action', 0.50),
('Comedy Sketch - Hilarious Moments', 'Laugh out loud with this comedy compilation', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 240, 'comedy', 0.50),
('Drama Scene - Emotional Performance', 'A powerful dramatic scene from an award-winning film', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 300, 'drama', 0.50),
('Thriller Clip - Suspenseful Moment', 'Edge of your seat thriller sequence', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 200, 'thriller', 0.50),
('Romance Scene - Beautiful Love Story', 'A touching romantic moment', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 220, 'romance', 0.50),
('Sci-Fi Clip - Future Technology', 'Amazing science fiction visual effects', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 260, 'sci-fi', 0.50),
('Horror Scene - Scary Moments', 'Spine-chilling horror sequence', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 190, 'horror', 0.50),
('Documentary Clip - Nature Wildlife', 'Stunning wildlife documentary footage', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 280, 'documentary', 0.50),
('Animation Short - Cartoon Fun', 'Entertaining animated short film', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 210, 'animation', 0.50),
('Music Video - Latest Hit Song', 'Popular music video with great visuals', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 230, 'music', 0.50);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_watches ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for videos table
CREATE POLICY "Anyone can view active videos" ON videos
  FOR SELECT USING (is_active = true);

-- RLS Policies for video_watches table
CREATE POLICY "Users can view own watches" ON video_watches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watches" ON video_watches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for withdrawals table
CREATE POLICY "Users can view own withdrawals" ON withdrawals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own withdrawals" ON withdrawals
  FOR INSERT WITH CHECK (auth.uid() = user_id);