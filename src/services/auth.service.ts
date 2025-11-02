import { supabase } from '@/lib/supabase';
import type { AuthError, User } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

class AuthService {
  /**
   * Sign up a new user
   */
  async signUp({ email, password, name }: SignUpData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        return { user: null, error };
      }

      // Create user profile
      if (data.user) {
        await this.createUserProfile(data.user.id, email, name);
      }

      return { user: data.user, error: null };
    } catch (error) {
      return {
        user: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error };
      }

      return { user: data.user, error: null };
    } catch (error) {
      return {
        user: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const result = await supabase.auth.signOut();
      return { error: result.error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'safestreet://reset-password',
      });
      return { error: result.error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      return null;
    }
  }

  /**
   * Create user profile in database
   */
  private async createUserProfile(userId: string, email: string, name: string) {
    try {
      const result = await supabase.from('profiles').insert({
        id: userId,
        email,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (result.error) {
        console.error('Error creating user profile:', result.error);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'safestreet://auth/callback',
        },
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }

  /**
   * Sign in with Apple
   */
  async signInWithApple() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'safestreet://auth/callback',
        },
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }
}

export const authService = new AuthService();
