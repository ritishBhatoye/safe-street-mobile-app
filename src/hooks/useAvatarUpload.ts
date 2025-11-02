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
      // Validate image size
      const isValidSize = await validateImageSize(imageUri);
      if (!isValidSize) {
        showToast.error('File Too Large', 'Please select an image smaller than 2MB');
        setIsProcessing(false);
        return;
      }

      // Compress image
      const compressedUri = await compressImage(imageUri);

      // Upload to storage
      const avatarUrl = await uploadAvatar({
        userId: user.id,
        imageUri: compressedUri,
      }).unwrap();

      // Update profile with new avatar URL
      await updateProfile({
        userId: user.id,
        data: { avatar_url: avatarUrl },
      }).unwrap();

      showToast.success('Success', 'Profile picture updated');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showToast.error('Upload Failed', 'Failed to upload profile picture');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    pickImage,
    isUploading: isUploading || isProcessing,
  };
};
