import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

/**
 * Authentication middleware utilities
 * Provides functions to check auth state and protect API calls
 */

/**
 * Get the current authenticated user
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[Auth Middleware] Error getting session:', error);
      return null;
    }
    
    return session?.user ?? null;
  } catch (error) {
    console.error('[Auth Middleware] Exception getting user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in API calls or service functions that require auth
 * @throws Error if user is not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required. Please sign in to continue.');
  }
  
  // Verify user exists in database
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();
  
  if (error || !profile) {
    // User doesn't exist in database, clear session
    console.log('[Auth Middleware] User not found in database, clearing session');
    await supabase.auth.signOut();
    throw new Error('User account not found. Please sign in again.');
  }
  
  return user;
}

/**
 * Get auth token for API calls
 * @returns JWT token or null if not authenticated
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[Auth Middleware] Error getting token:', error);
      return null;
    }
    
    return session?.access_token ?? null;
  } catch (error) {
    console.error('[Auth Middleware] Exception getting token:', error);
    return null;
  }
}

/**
 * Refresh the current session
 * @returns true if refresh successful, false otherwise
 */
export async function refreshSession(): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('[Auth Middleware] Error refreshing session:', error);
      return false;
    }
    
    return data.session !== null;
  } catch (error) {
    console.error('[Auth Middleware] Exception refreshing session:', error);
    return false;
  }
}
