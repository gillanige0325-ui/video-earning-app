import { NextRequest, NextResponse } from 'next/server';
import { getAvailableVideos, canWatchVideo } from '@/lib/video';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');

    // Check watch status
    const watchStatus = await canWatchVideo(decoded.userId);

    // Get available videos
    const result = await getAvailableVideos(decoded.userId, category, limit);

    return NextResponse.json({
      ...result,
      watchStatus,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}