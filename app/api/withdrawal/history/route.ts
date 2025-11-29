import { NextRequest, NextResponse } from 'next/server';
import { getWithdrawalHistory, getWithdrawalStats } from '@/lib/withdrawal';
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

    const history = await getWithdrawalHistory(decoded.userId);
    const stats = await getWithdrawalStats(decoded.userId);

    return NextResponse.json({
      success: true,
      history: history.withdrawals,
      stats: stats.stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}