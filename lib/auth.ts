import { supabase } from './supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: any;
  token?: string;
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  phone?: string
): Promise<AuthResponse> {
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { success: false, message: authError.message };
    }

    // Create user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user?.id,
        email,
        full_name: fullName,
        phone,
        balance: 0,
        total_earned: 0,
        videos_watched_today: 0,
        last_video_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (userError) {
      return { success: false, message: userError.message };
    }

    // Generate JWT token
    const token = jwt.sign({ userId: userData.id, email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return {
      success: true,
      message: 'Registration successful',
      user: userData,
      token,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { success: false, message: 'Invalid credentials' };
    }

    // Get user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      return { success: false, message: 'User profile not found' };
    }

    // Generate JWT token
    const token = jwt.sign({ userId: userData.id, email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return {
      success: true,
      message: 'Login successful',
      user: userData,
      token,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}