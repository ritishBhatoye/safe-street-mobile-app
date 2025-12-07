import { useEffect, useState, useRef } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Authentication middleware hook that protects routes
 * Redirects unauthenticated users to sign-in
 * Redirects authenticated users away from auth screens
 * Skips onboarding for users who have already seen it
 */
export function useProtectedRoute() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const isNavigating = useRef(false);

  // Check onboarding status on mount
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const seen = await AsyncStorage.getItem("hasSeenOnboarding");
        setHasSeenOnboarding(seen === "true");
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setHasSeenOnboarding(false);
      }
    };

    checkOnboarding();
  }, []);

  useEffect(() => {
    // Don't do anything while auth state or onboarding check is loading
    if (loading || hasSeenOnboarding === null) return;

    // Prevent double navigation
    if (isNavigating.current) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";
    const inScreensGroup = segments[0] === "(screens)";
    const inOnboarding = segments[0] === "(onboarding)";

    // Protected routes that require authentication
    const isProtectedRoute = inTabsGroup || inScreensGroup;

    // If user has seen onboarding and is on onboarding screen, redirect to auth
    if (hasSeenOnboarding && inOnboarding && !user) {
      console.log("[Auth Middleware] User has seen onboarding, redirecting to sign-in");
      isNavigating.current = true;
      router.replace("/(auth)/sign-in");
      setTimeout(() => {
        isNavigating.current = false;
      }, 500);
      return;
    }

    if (!user && isProtectedRoute) {
      // User is not authenticated but trying to access protected route
      console.log("[Auth Middleware] Unauthenticated user detected, redirecting to sign-in");
      isNavigating.current = true;
      router.replace("/(auth)/sign-in");
      setTimeout(() => {
        isNavigating.current = false;
      }, 500);
    } else if (user && (inAuthGroup || inOnboarding)) {
      // User is authenticated but on auth/onboarding screens
      console.log("[Auth Middleware] Authenticated user on auth screen, redirecting to home");
      isNavigating.current = true;
      router.replace("/(tabs)/home");
      setTimeout(() => {
        isNavigating.current = false;
      }, 500);
    }
  }, [user, loading, segments, router, hasSeenOnboarding]);
}
