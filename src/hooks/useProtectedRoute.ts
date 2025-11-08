import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export function useProtectedRoute() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const inScreensGroup = segments[0] === '(screens)';
    const inOnboarding = segments[0] === '(onboarding)';

    // Protected routes that require authentication
    const isProtectedRoute = inTabsGroup || inScreensGroup;

    if (!user && isProtectedRoute) {
      // User is not signed in but trying to access protected route
      // Redirect to sign in
      router.replace('/(auth)/sign-in' as any);
    } else if (user && (inAuthGroup || inOnboarding)) {
      // User is signed in but on auth/onboarding screens
      // Redirect to main app
      router.replace('/(tabs)/' as any);
    }
  }, [user, loading, segments]);
}
