import { useGetProfileQuery, useUpdateProfileMutation } from '@/services/profile.service';
import { useAuth } from '@/contexts/AuthContext';
import type { ProfileUpdateData } from '@/types/profile';

export const useProfile = () => {
  const { user } = useAuth();
  
  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProfileQuery(user?.id || '', {
    skip: !user?.id,
  });

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const handleUpdateProfile = async (data: ProfileUpdateData) => {
    if (!user?.id) throw new Error('User not authenticated');
    
    return await updateProfile({ userId: user.id, data }).unwrap();
  };

  return {
    profile,
    isLoading,
    isError,
    error,
    refetch,
    updateProfile: handleUpdateProfile,
    isUpdating,
  };
};
