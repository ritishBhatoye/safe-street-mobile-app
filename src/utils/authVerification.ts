import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

/**
 * Verify user authentication and database existence
 * This ensures the user session is valid AND the user exists in the database
 * 
 * Use this in hooks and services to prevent issues when user is deleted from database
 * but session still exists locally
 * 
 * @returns User object if authenticated and exists in database
 * @throws Error if not authenticated or user doesn't exist in database
 */
export async function verifyAuthenticatedUser(): Promise<User> {
  // Get current session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    // Clear invalid session
    await supabase.auth.signOut();
    throw new Error('User not authenticated');
  }

  // Verify user exists in database
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    // User doesn't exist in database, clear session
    console.log('[Auth Verification] User not found in database, clearing session');
    await supabase.auth.signOut();
    throw new Error('User account not found. Please sign in again.');
  }

  return user;
}

/**
 * Check if user is authenticated and exists in database
 * Non-throwing version of verifyAuthenticatedUser
 * 
 * @returns User object if authenticated, null otherwise
 */
export async function checkAuthenticatedUser(): Promise<User | null> {
  try {
    return await verifyAuthenticatedUser();
  } catch {
    return null;
  }
}
