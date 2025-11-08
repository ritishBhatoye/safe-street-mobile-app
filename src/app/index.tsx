import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';

export default function Index() {
  const { user, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  // Redirect based on auth state
  if (user) {
    // User is authenticated, go to main app
    return <Redirect href="/(tabs)/index" />;
  }

  // User is not authenticated, go to onboarding
  return <Redirect href="/(onboarding)/index" />;
}
