import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useUploadAvatarMutation, useUpdateProfileMutation } from '@/services/profile.service';
import { useAuth } from '@/contexts/AuthContext';
import { compressImage, validateImageSize } from '@/utils/image.utils';
import { showToast } from '@/utils/toast';

export const useAvatarUpload = () => {
  const { user } = useAuth();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        showToast.error('Permission Denied', 'Please allow access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showToast.error('Error', 'Failed to select image');
    }
  };

  const handleImageSelected = async (imageUri: string) => {
    if (!user?.id) {
      showToast.error('Error', 'User not authenticated');
      return;
    }

    setIsProcessing(true);

    try {
      // For now, just use the local URI (temporary solution)
      // TODO: Set up proper storage when Supabase storage is configured
      
      // Update profile with local image URI
      await updateProfile({
        userId: user.id,
        data: { avatar_url: imageUri },
      }).unwrap();

      showToast.success('Success', 'Profile picture updated (local only)');
    } catch (error) {
      console.error('Error updating avatar:', error);
      showToast.error('Update Failed', 'Failed to update profile picture');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    pickImage,
    isUploading: isUploading || isProcessing,
  };
};
