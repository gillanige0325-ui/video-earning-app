import { supabase } from './supabase';

const MINIMUM_WITHDRAWAL = parseFloat(process.env.MINIMUM_WITHDRAWAL || '5');
const PKR_EXCHANGE_RATE = parseFloat(process.env.PKR_EXCHANGE_RATE || '278.5');

export async function requestWithdrawal(
  userId: string,
  amountUSD: number,
  paymentMethod: string,
  paymentDetails: any
): Promise<{ success: boolean; message: string; withdrawal?: any }> {
  try {
    // Validate amount
    if (amountUSD < MINIMUM_WITHDRAWAL) {
      return {
        success: false,
        message: `Minimum withdrawal amount is $${MINIMUM_WITHDRAWAL}`,
      };
    }

    // Get user balance
    const { data: user } = await supabase
      .from('users')
      .select('balance')
      .eq('id', userId)
      .single();

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.balance < amountUSD) {
      return {
        success: false,
        message: `Insufficient balance. Available: $${user.balance.toFixed(2)}`,
      };
    }

    // Calculate PKR amount
    const amountPKR = amountUSD * PKR_EXCHANGE_RATE;

    // Create withdrawal request
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .insert({
        user_id: userId,
        amount_usd: amountUSD,
        amount_pkr: amountPKR,
        exchange_rate: PKR_EXCHANGE_RATE,
        status: 'pending',
        payment_method: paymentMethod,
        payment_details: paymentDetails,
      })
      .select()
      .single();

    if (withdrawalError) {
      return { success: false, message: withdrawalError.message };
    }

    // Deduct from user balance
    await supabase
      .from('users')
      .update({
        balance: user.balance - amountUSD,
      })
      .eq('id', userId);

    return {
      success: true,
      message: `Withdrawal request submitted. You will receive PKR ${amountPKR.toFixed(2)}`,
      withdrawal,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getWithdrawalHistory(userId: string) {
  try {
    const { data: withdrawals, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, message: error.message, withdrawals: [] };
    }

    return { success: true, withdrawals: withdrawals || [] };
  } catch (error: any) {
    return { success: false, message: error.message, withdrawals: [] };
  }
}

export async function getWithdrawalStats(userId: string) {
  try {
    const { data: withdrawals } = await supabase
      .from('withdrawals')
      .select('amount_usd, status')
      .eq('user_id', userId);

    const stats = {
      totalWithdrawn: 0,
      pendingAmount: 0,
      completedWithdrawals: 0,
      pendingWithdrawals: 0,
    };

    withdrawals?.forEach((w) => {
      if (w.status === 'completed') {
        stats.totalWithdrawn += w.amount_usd;
        stats.completedWithdrawals++;
      } else if (w.status === 'pending' || w.status === 'processing') {
        stats.pendingAmount += w.amount_usd;
        stats.pendingWithdrawals++;
      }
    });

    return { success: true, stats };
  } catch (error: any) {
    return { success: false, message: error.message, stats: null };
  }
}