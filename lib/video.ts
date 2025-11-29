import { supabase } from './supabase';

const DAILY_VIDEO_LIMIT = parseInt(process.env.DAILY_VIDEO_LIMIT || '30');
const VIDEO_EARNING_AMOUNT = parseFloat(process.env.VIDEO_EARNING_AMOUNT || '0.5');

export async function canWatchVideo(userId: string): Promise<{
  canWatch: boolean;
  videosWatchedToday: number;
  remainingVideos: number;
  message?: string;
}> {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('videos_watched_today, last_video_date')
      .eq('id', userId)
      .single();

    if (!user) {
      return {
        canWatch: false,
        videosWatchedToday: 0,
        remainingVideos: 0,
        message: 'User not found',
      };
    }

    const today = new Date().toISOString().split('T')[0];
    let videosWatchedToday = user.videos_watched_today;

    // Reset counter if it's a new day
    if (user.last_video_date !== today) {
      videosWatchedToday = 0;
      await supabase
        .from('users')
        .update({
          videos_watched_today: 0,
          last_video_date: today,
        })
        .eq('id', userId);
    }

    const canWatch = videosWatchedToday < DAILY_VIDEO_LIMIT;
    const remainingVideos = DAILY_VIDEO_LIMIT - videosWatchedToday;

    return {
      canWatch,
      videosWatchedToday,
      remainingVideos,
      message: canWatch ? undefined : 'Daily video limit reached',
    };
  } catch (error: any) {
    return {
      canWatch: false,
      videosWatchedToday: 0,
      remainingVideos: 0,
      message: error.message,
    };
  }
}

export async function recordVideoWatch(
  userId: string,
  videoId: string,
  watchDuration: number,
  completed: boolean
): Promise<{ success: boolean; message: string; earning?: number }> {
  try {
    // Check if user can watch more videos
    const watchStatus = await canWatchVideo(userId);
    if (!watchStatus.canWatch) {
      return { success: false, message: watchStatus.message || 'Cannot watch video' };
    }

    // Check if video was already watched today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingWatch } = await supabase
      .from('video_watches')
      .select('*')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .gte('watched_at', `${today}T00:00:00`)
      .single();

    if (existingWatch) {
      return { success: false, message: 'Video already watched today' };
    }

    // Only award earnings if video is completed (watched at least 80%)
    const earning = completed ? VIDEO_EARNING_AMOUNT : 0;

    // Record video watch
    const { error: watchError } = await supabase.from('video_watches').insert({
      user_id: userId,
      video_id: videoId,
      watched_at: new Date().toISOString(),
      earning_amount: earning,
      watch_duration: watchDuration,
      completed,
    });

    if (watchError) {
      return { success: false, message: watchError.message };
    }

    // Update user balance and stats
    const { data: user } = await supabase
      .from('users')
      .select('balance, total_earned, videos_watched_today')
      .eq('id', userId)
      .single();

    if (user) {
      await supabase
        .from('users')
        .update({
          balance: user.balance + earning,
          total_earned: user.total_earned + earning,
          videos_watched_today: user.videos_watched_today + 1,
        })
        .eq('id', userId);
    }

    return {
      success: true,
      message: completed
        ? `Video completed! You earned $${earning}`
        : 'Video recorded but not completed',
      earning,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getAvailableVideos(
  userId: string,
  category?: string,
  limit: number = 20
) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get videos already watched today
    const { data: watchedVideos } = await supabase
      .from('video_watches')
      .select('video_id')
      .eq('user_id', userId)
      .gte('watched_at', `${today}T00:00:00`);

    const watchedVideoIds = watchedVideos?.map((w) => w.video_id) || [];

    // Get available videos
    let query = supabase
      .from('videos')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (category) {
      query = query.eq('category', category);
    }

    if (watchedVideoIds.length > 0) {
      query = query.not('id', 'in', `(${watchedVideoIds.join(',')})`);
    }

    const { data: videos, error } = await query;

    if (error) {
      return { success: false, message: error.message, videos: [] };
    }

    return { success: true, videos: videos || [] };
  } catch (error: any) {
    return { success: false, message: error.message, videos: [] };
  }
}