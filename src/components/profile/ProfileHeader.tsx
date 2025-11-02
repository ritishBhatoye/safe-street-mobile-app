import React from "react";
import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
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
    <View className="bg-white">
      <LinearGradient
        colors={["#3B82F6", "#8B5CF6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-16 pb-24 px-6"
      >
        <View className="items-center">
          {/* Avatar with Edit Button */}
          <Pressable
            onPress={onAvatarPress}
            className="relative mb-5 active:scale-95"
            disabled={isUploading}
          >
            {/* Outer glow ring */}
            <View className="absolute -inset-1 rounded-full bg-white/30 blur-xl" />

            {/* Avatar container with border */}
            <View className="w-28 h-28 rounded-full bg-white p-1 shadow-2xl">
              <View className="w-full h-full rounded-full bg-gradient-to-br from-blue-50 to-purple-50 items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <View className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center">
                    <Ionicons name="person" size={48} color="#8B5CF6" />
                  </View>
                )}

                {/* Shimmer overlay when uploading */}
                {isUploading && (
                  <View className="absolute inset-0 bg-white/40">
                    <View className="w-full h-full animate-pulse bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  </View>
                )}
              </View>
            </View>

            {/* Edit Icon Overlay - Modern floating button */}
            {!isUploading && (
              <View className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white items-center justify-center shadow-xl border-2 border-blue-500">
                <Ionicons name="camera" size={18} color="#3B82F6" />
              </View>
            )}
          </Pressable>

          {/* User Info */}
          <Text className="text-white font-dm-sans-bold text-2xl mb-1.5 tracking-tight">
            {name}
          </Text>
          <View className="bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
            <Text className="text-white/95 font-dm-sans text-sm">{email}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Bottom curve overlay */}
      <View className="h-6 bg-white -mt-6 rounded-t-3xl" />
    </View>
  );
};
