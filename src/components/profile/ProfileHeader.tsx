import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

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
    <View className="bg-white dark:bg-gray-900">
      <LinearGradient
        colors={["#3B82F6", "#8B5CF6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{paddingTop:16,paddingBottom:50,paddingHorizontal:6}}
        className="pt-16 pb-24 px-6"
      >
        <View className="items-center">
          {/* Avatar with Edit Button */}
          <Pressable
            onPress={onAvatarPress}
            className="relative mb-5 active:scale-95 active:opacity-90"
            disabled={isUploading}
          >
            {/* Outer glow ring */}
            <View className="absolute -inset-2 rounded-full bg-white/20 shadow-2xl" />

            {/* Avatar container with border */}
            <View className="w-32 h-32 rounded-full bg-white p-1.5 shadow-2xl">
              <View className="w-full h-full rounded-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                {avatarUrl ? (
                  <>
                    <Image
                      source={{ uri: avatarUrl }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                    {/* Shimmer overlay when uploading */}
                    {isUploading && (
                      <View className="absolute inset-0 bg-black/30">
                        <View className="w-full h-full animate-pulse bg-white/40" />
                      </View>
                    )}
                  </>
                ) : (
                  <View className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center">
                    <Ionicons name="person" size={56} color="#8B5CF6" />
                  </View>
                )}
              </View>
            </View>

            {/* Edit Icon Overlay */}
            {!isUploading && (
              <View className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-white items-center justify-center shadow-xl border-2 border-blue-500">
                <Ionicons name="camera" size={20} color="#3B82F6" />
              </View>
            )}

            {/* Uploading indicator */}
            {isUploading && (
              <View className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-blue-500 items-center justify-center shadow-xl border-2 border-white animate-pulse">
                <Ionicons name="cloud-upload" size={18} color="#FFFFFF" />
              </View>
            )}
          </Pressable>

          {/* User Info */}
          <Text className="text-white font-dm-sans-bold text-2xl mb-2 tracking-tight text-center px-4">
            {name}
          </Text>
          <View className="bg-white/25 px-5 py-2 rounded-full border border-white/30">
            <Text className="text-white font-dm-sans text-sm">{email}</Text>
          </View>

          {/* Uploading status text */}
          {isUploading && (
            <View className="mt-3 bg-white/20 px-4 py-1.5 rounded-full animate-pulse">
              <Text className="text-white/90 font-dm-sans-medium text-xs">Uploading...</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Bottom curve overlay */}
      <View className="h-6 bg-white dark:bg-gray-900 -mt-6 pt-16 rounded-t-3xl" />
    </View>
  );
};
