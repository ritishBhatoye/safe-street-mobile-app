import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Authentication middleware hook that protects routes
 * Redirects unauthenticated users to sign-in
 * Redirects authenticated users away from auth screens
 */
export function useProtectedRoute() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Don't do anything while auth state is loading
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const inScreensGroup = segments[0] === '(screens)';
    const inOnboarding = segments[0] === '(onboarding)';

    // Protected routes that require authentication
    const isProtectedRoute = inTabsGroup || inScreensGroup;

    if (!user && isProtectedRoute) {
      // User is not authenticated but trying to access protected route
      // Redirect to sign-in page
      console.log('[Auth Middleware] Unauthenticated user detected, redirecting to sign-in');
      router.replace('/(auth)/sign-in');
    } else if (user && (inAuthGroup || inOnboarding)) {
      // User is authenticated but on auth/onboarding screens
      // Redirect to main app home screen
      console.log('[Auth Middleware] Authenticated user on auth screen, redirecting to home');
      router.replace('/(tabs)/home');
    }
  }, [user, loading, segments, router]);
}
