import { useGetProfileQuery, useUpdateProfileMutation } from '@/services/profile.service';
import { useAuth } from '@/contexts/AuthContext';


export const useProfile = () => {
  const { user } = useAuth();
  
  // console.log('useProfile - user:', user?.id);
  
  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProfileQuery(user?.id || '', {
    skip: !user?.id,
  });
  
  // console.log('useProfile - profile:', profile, 'isLoading:', isLoading, 'isError:', isError, 'error:', error);

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const handleUpdateProfile = async (data: ProfileUpdateDataType) => {
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
