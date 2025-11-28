import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Higher-order component to protect individual screens
 * Usage: Wrap your screen component with <ProtectedRoute>
 * 
 * Example:
 * ```tsx
 * export default function MyScreen() {
 *   return (
 *     <ProtectedRoute>
 *       <View>Protected content</View>
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Show loading state while checking authentication
  if (loading) {
    return fallback || <LoadingSpinner fullScreen message="Verifying authentication..." />;
  }

  // Redirect to sign-in if not authenticated
  if (!user) {
    router.replace('/(auth)/sign-in');
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
