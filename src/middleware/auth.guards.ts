import { requireAuth } from './auth.middleware';
import { supabase } from '@/lib/supabase';

/**
 * Auth guards for role-based and permission-based access control
 * Use these when you need to check specific user permissions
 */

/**
 * Check if user has verified their email
 * @throws Error if email is not verified
 */
export async function requireVerifiedEmail(): Promise<void> {
  const user = await requireAuth();
  
  if (!user.email_confirmed_at) {
    throw new Error('Email verification required. Please verify your email to continue.');
  }
}

/**
 * Check if user has completed their profile
 * @throws Error if profile is incomplete
 */
export async function requireCompleteProfile(): Promise<void> {
  const user = await requireAuth();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('full_name, phone_number')
    .eq('id', user.id)
    .single();
  
  if (error) {
    throw new Error('Unable to verify profile status');
  }
  
  if (!profile.full_name || !profile.phone_number) {
    throw new Error('Please complete your profile to continue');
  }
}

/**
 * Check if user has specific metadata field
 * @param field - The metadata field to check
 * @param value - Optional expected value
 * @throws Error if field doesn't exist or doesn't match value
 */
export async function requireMetadata(field: string, value?: any): Promise<void> {
  const user = await requireAuth();
  
  const metadata = user.user_metadata || {};
  
  if (!(field in metadata)) {
    throw new Error(`Required metadata field '${field}' is missing`);
  }
  
  if (value !== undefined && metadata[field] !== value) {
    throw new Error(`Metadata field '${field}' does not match required value`);
  }
}

/**
 * Check if user account is active (not banned/suspended)
 * @throws Error if account is not active
 */
export async function requireActiveAccount(): Promise<void> {
  const user = await requireAuth();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_active, banned_at')
    .eq('id', user.id)
    .single();
  
  if (error) {
    throw new Error('Unable to verify account status');
  }
  
  if (profile.banned_at) {
    throw new Error('Your account has been suspended. Please contact support.');
  }
  
  if (profile.is_active === false) {
    throw new Error('Your account is inactive. Please contact support.');
  }
}

/**
 * Combine multiple guards - all must pass
 * @param guards - Array of guard functions to execute
 */
export async function requireAll(...guards: (() => Promise<void>)[]): Promise<void> {
  for (const guard of guards) {
    await guard();
  }
}

/**
 * Example usage in a service:
 * 
 * ```typescript
 * import { requireVerifiedEmail, requireCompleteProfile } from '@/middleware/auth.guards';
 * 
 * async function createSensitiveReport(data: ReportData) {
 *   // Require both verified email and complete profile
 *   await requireVerifiedEmail();
 *   await requireCompleteProfile();
 *   
 *   // Or use requireAll for cleaner syntax
 *   await requireAll(requireVerifiedEmail, requireCompleteProfile);
 *   
 *   // Continue with the operation
 * }
 * ```
 */
