import { Stack } from "expo-router";
import React from "react";
import { Animated, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileLoading = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={["top"]}>
        <Animated.ScrollView className="flex-1">
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
        </Animated.ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ProfileLoading;
