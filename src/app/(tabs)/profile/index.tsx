import React, { useState } from "react";
import { View, RefreshControl, Text, Alert } from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useProfileStats } from "@/hooks/useProfileStats";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { Card } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { showToast } from "@/utils/toast";
import UserNotFound from "@/components/profile/UserNotFound";
import {
  AccountInformationCard,
  EditProfileCard,
  ProfileLoading,
  UnableToLoadProfile,
  AnimatedProfileHeader,
  EditProfileModal,
  ProfileHeader,
  EmergencyContactsCard,
  ProfileStats,
} from "@/components/profile";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { profile, isLoading, isError, refetch, updateProfile } = useProfile();
  const { stats, refetch: refetchStats } = useProfileStats();
  const { pickImage, isUploading } = useAvatarUpload();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Check if user is not authenticated
  if (!user) {
    return <UserNotFound />;
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchStats()]);
    setRefreshing(false);
  };

  const handleAvatarPress = () => {
    pickImage();
  };

  const handleEditProfile = async (data: ProfileUpdateDataType) => {
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
    return <ProfileLoading />;
  }

  if (isError || !profile) {
    return (
      <UnableToLoadProfile
        onRetry={() => refetch()}
        onSignOut={async () => {
          try {
            await signOut();
            router.push("/(auth)/sign-in");
          } catch (error) {
            console.error("Sign out error:", error);
          }
        }}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <AnimatedProfileHeader
              avatarUrl={profile.avatar_url}
              name={profile.name}
              scrollY={scrollY}
              onAvatarPress={handleAvatarPress}
            />
          ),
        }}
      />
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <Animated.ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          contentContainerStyle={{ paddingBottom: 140 }}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {/* Profile Header */}
          <ProfileHeader
            avatarUrl={profile.avatar_url}
            name={profile.name}
            email={profile.email}
            onAvatarPress={handleAvatarPress}
            isUploading={isUploading}
            scrollY={scrollY}
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
            {/* Emergency Contacts Card */}
            <EmergencyContactsCard />

            {/* Edit Profile Card */}
            <EditProfileCard onPress={() => setEditModalVisible(true)} />

            {/* Account Info Card */}
            <AccountInformationCard profile={profile} userId={user?.id.substring(0, 8)} />
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
              variant="danger"
              size="large"
              className="border-0 mt-4"
            />
          </View>

          {/* Bottom Spacing */}
          <View className="h-8" />
        </Animated.ScrollView>

        {/* Edit Profile Modal */}
        <EditProfileModal
          visible={editModalVisible}
          currentProfile={profile}
          onClose={() => setEditModalVisible(false)}
          onSave={handleEditProfile}
          onAvatarPress={handleAvatarPress}
        />
      </View>
    </>
  );
}
