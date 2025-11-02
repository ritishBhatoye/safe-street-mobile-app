import React, { useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useProfileStats } from "@/hooks/useProfileStats";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { Card } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { showToast } from "@/utils/toast";
import type { ProfileUpdateData } from "@/types";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { profile, isLoading, isError, refetch, updateProfile } = useProfile();
  const { stats, refetch: refetchStats } = useProfileStats();
  const { pickImage, isUploading } = useAvatarUpload();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchStats()]);
    setRefreshing(false);
  };

  const handleAvatarPress = () => {
    pickImage();
  };

  const handleEditProfile = async (data: ProfileUpdateData) => {
    try {
      await updateProfile(data);
      showToast.success("Success", "Profile updated successfully");
    } catch (error) {
      showToast.error("Error", "Failed to update profile. Please try again.");
      throw error;
    }
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            showToast.success("Signed Out", "You have been signed out successfully");
          } catch (error) {
            showToast.error("Error", "Unable to sign out. Please try again.");
            console.error("Sign out error:", error);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={["top"]}>
        <ScrollView className="flex-1">
          {/* Shimmer Header */}
          <View className="bg-white">
            <View className="bg-gradient-to-r from-blue-500 to-purple-500 pt-16 pb-24 px-6">
              <View className="items-center">
                {/* Avatar Shimmer */}
                <View className="w-28 h-28 rounded-full bg-white/30 mb-5 animate-pulse" />

                {/* Name Shimmer */}
                <View className="w-32 h-7 bg-white/30 rounded-lg mb-2 animate-pulse" />

                {/* Email Shimmer */}
                <View className="w-48 h-6 bg-white/20 rounded-full animate-pulse" />
              </View>
            </View>
            <View className="h-6 bg-white -mt-6 rounded-t-3xl" />
          </View>

          {/* Stats Shimmer */}
          <View className="px-4 py-4">
            <View className="bg-white rounded-2xl p-4 shadow-sm">
              <View className="flex-row justify-around">
                <View className="items-center">
                  <View className="w-16 h-8 bg-gray-200 rounded-lg mb-2 animate-pulse" />
                  <View className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                </View>
                <View className="w-px bg-gray-200" />
                <View className="items-center">
                  <View className="w-16 h-8 bg-gray-200 rounded-lg mb-2 animate-pulse" />
                  <View className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                </View>
              </View>
            </View>
          </View>

          {/* Cards Shimmer */}
          <View className="px-4 mt-2">
            <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-gray-200 mr-3 animate-pulse" />
                <View className="flex-1">
                  <View className="w-24 h-5 bg-gray-200 rounded mb-2 animate-pulse" />
                  <View className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
                </View>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-gray-200 mr-3 animate-pulse" />
                <View className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
              </View>
              <View className="ml-13">
                <View className="w-20 h-4 bg-gray-200 rounded mb-1 animate-pulse" />
                <View className="w-24 h-4 bg-gray-200 rounded mb-3 animate-pulse" />
                <View className="w-16 h-4 bg-gray-200 rounded mb-1 animate-pulse" />
                <View className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError || !profile) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-gray-900 dark:text-white font-dm-sans-bold text-xl mt-4 text-center">
            Unable to Load Profile
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-center mt-2 mb-6">
            We could not load your profile data. Please try again.
          </Text>
          <Button title="Retry" onPress={() => refetch()} variant="primary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={["top"]}>
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Profile Header */}
        <ProfileHeader
          avatarUrl={profile.avatar_url}
          name={profile.name}
          email={profile.email}
          onAvatarPress={handleAvatarPress}
          isUploading={isUploading}
        />

        {/* Profile Stats */}
        {stats && (
          <ProfileStats
            incidentsReported={stats.incidentsReported}
            memberSince={stats.memberSince}
          />
        )}

        {/* Profile Actions */}
        <View className="px-4 mt-2">
          {/* Edit Profile Card */}
          <Card variant="elevated" className="mb-3">
            <Pressable
              onPress={() => setEditModalVisible(true)}
              className="flex-row items-center py-2 active:opacity-70"
            >
              <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
                <Ionicons name="create-outline" size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-white font-dm-sans-semibold text-base">
                  Edit Profile
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-sm">
                  Update your name and phone number
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
          </Card>

          {/* Account Info Card */}
          <Card variant="elevated" className="mb-3">
            <View className="py-2">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-secondary-100 items-center justify-center mr-3">
                  <Ionicons name="information-circle-outline" size={20} color="#14B8A6" />
                </View>
                <Text className="text-gray-900 dark:text-white font-dm-sans-semibold text-base">
                  Account Information
                </Text>
              </View>

              <View className="ml-13 space-y-2">
                <View className="mb-2">
                  <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-xs">
                    User ID
                  </Text>
                  <Text className="text-gray-900 dark:text-white font-dm-sans-mono text-sm">
                    {user?.id.substring(0, 8)}...
                  </Text>
                </View>

                {profile.phone && (
                  <View>
                    <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-xs">
                      Phone
                    </Text>
                    <Text className="text-gray-900 dark:text-white font-dm-sans text-sm">
                      {profile.phone}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Card>

          {/* Sign Out Button */}
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            size="large"
            className="border-2 border-red-500 mt-4"
          />
        </View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={editModalVisible}
        currentProfile={profile}
        onClose={() => setEditModalVisible(false)}
        onSave={handleEditProfile}
        onAvatarPress={handleAvatarPress}
      />
    </SafeAreaView>
  );
}
