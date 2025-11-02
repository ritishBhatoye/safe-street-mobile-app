import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/atoms/Button';
import type { UserProfile, ProfileUpdateData } from '@/types/profile';

interface EditProfileModalProps {
  visible: boolean;
  currentProfile: UserProfile;
  onClose: () => void;
  onSave: (data: ProfileUpdateData) => Promise<void>;
  onAvatarPress: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  currentProfile,
  onClose,
  onSave,
  onAvatarPress,
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [phone, setPhone] = useState(currentProfile.phone || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (phone && !/^\+?[\d\s-()]+$/.test(phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white dark:bg-gray-900"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <Pressable onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color="#6B7280" />
          </Pressable>
          <Text className="font-dm-sans-bold text-lg text-gray-900 dark:text-white">
            Edit Profile
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1 px-4 pt-6">
          {/* Avatar Section */}
          <View className="items-center mb-6">
            <Pressable
              onPress={onAvatarPress}
              className="relative active:opacity-80"
            >
              <View className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center overflow-hidden">
                {currentProfile.avatar_url ? (
                  <Image
                    source={{ uri: currentProfile.avatar_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={64} color="#9CA3AF" />
                )}
              </View>
              
              <View className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary-500 items-center justify-center shadow-lg">
                <Ionicons name="camera" size={20} color="white" />
              </View>
            </Pressable>
            <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-sm mt-2">
              Tap to change photo
            </Text>
          </View>

          {/* Name Input */}
          <View className="mb-4">
            <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold text-sm mb-2">
              Full Name *
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-dm-sans text-base text-gray-900 dark:text-white"
            />
            {errors.name && (
              <Text className="text-red-500 font-dm-sans text-sm mt-1">
                {errors.name}
              </Text>
            )}
          </View>

          {/* Email Input (Read-only) */}
          <View className="mb-4">
            <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold text-sm mb-2">
              Email
            </Text>
            <TextInput
              value={currentProfile.email}
              editable={false}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-dm-sans text-base text-gray-500 dark:text-gray-400"
            />
            <Text className="text-gray-500 dark:text-gray-400 font-dm-sans text-xs mt-1">
              Email cannot be changed
            </Text>
          </View>

          {/* Phone Input */}
          <View className="mb-6">
            <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold text-sm mb-2">
              Phone Number
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-dm-sans text-base text-gray-900 dark:text-white"
            />
            {errors.phone && (
              <Text className="text-red-500 font-dm-sans text-sm mt-1">
                {errors.phone}
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={loading}
            variant="primary"
            size="large"
            className="mb-2"
          />
          <Button
            title="Cancel"
            onPress={onClose}
            variant="ghost"
            size="large"
            className="border border-gray-300 dark:border-gray-600"
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
