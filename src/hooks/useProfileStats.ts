import { useGetUserStatsQuery } from '@/services/profile.service';
import { useAuth } from '@/contexts/AuthContext';

export const useProfileStats = () => {
  const { user } = useAuth();
  
  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserStatsQuery(user?.id || '', {
    skip: !user?.id,
  });

  return {
    stats,
    isLoading,
    isError,
    error,
    refetch,
  };
};
