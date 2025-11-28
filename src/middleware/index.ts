/**
 * Authentication Middleware
 * Centralized exports for all auth utilities
 */

// Core auth middleware
export {
  getCurrentUser,
  isAuthenticated,
  requireAuth,
  getAuthToken,
  refreshSession,
} from './auth.middleware';

// Auth guards (optional advanced features)
export {
  requireVerifiedEmail,
  requireCompleteProfile,
  requireMetadata,
  requireActiveAccount,
  requireAll,
} from './auth.guards';
