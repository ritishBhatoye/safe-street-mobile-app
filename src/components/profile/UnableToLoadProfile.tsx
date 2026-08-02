import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../atoms";

interface Props {
  onRetry: () => void;
  onSignOut: () => Promise<void>;
}

const UnableToLoadProfile = ({ onRetry, onSignOut }: Props) => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={["top"]}>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-gray-900 dark:text-white font-dm-sans-bold text-xl mt-4 text-center">
            Unable to Load Profile
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-center mt-2 mb-6">
            We could not load your profile data. Please try again.
          </Text>
          <Button title="Retry" onPress={onRetry} variant="primary" className="mb-3" />

          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
            <Text className="mx-4 text-gray-500 dark:text-gray-400 font-dm-sans text-sm">or</Text>
            <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
          </View>

          <Button
            title="Sign Out & Login Again"
            onPress={onSignOut}
            variant="danger"
            className="border-0"
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default UnableToLoadProfile;
