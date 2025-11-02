import React from 'react';
import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface ProfileHeaderProps {
  avatarUrl?: string;
  name: string;
  email: string;
  onAvatarPress: () => void;
  isUploading?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarUrl,
  name,
  email,
  onAvatarPress,
  isUploading = false,
}) => {
  return (
    <LinearGradient
      colors={['#3B82F6', '#8B5CF6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="pt-16 pb-8 px-6"
    >
      <View className="items-center">
        {/* Avatar with Edit Button */}
        <Pressable
          onPress={onAvatarPress}
          className="relative mb-4 active:opacity-80"
          disabled={isUploading}
        >
          <View className="w-32 h-32 rounded-full bg-white/20 items-center justify-center overflow-hidden">
            {isUploading ? (
              <ActivityIndicator size="large" color="white" />
            ) : avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person" size={64} color="white" />
            )}
          </View>
          
          {/* Edit Icon Overlay */}
          {!isUploading && (
            <View className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white items-center justify-center shadow-lg">
              <Ionicons name="camera" size={20} color="#3B82F6" />
            </View>
          )}
        </Pressable>

        {/* User Info */}
        <Text className="text-white font-dm-sans-bold text-2xl mb-1">
          {name}
        </Text>
        <Text className="text-white/80 font-dm-sans text-base">
          {email}
        </Text>
      </View>
    </LinearGradient>
  );
};
