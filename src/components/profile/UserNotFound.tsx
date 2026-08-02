import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../atoms";

const UserNotFound = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={["top"]}>
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 items-center justify-center mb-6">
            <Ionicons name="person-outline" size={48} color="#FFFFFF" />
          </View>
          <Text className="text-gray-900 dark:text-white font-dm-sans-bold text-2xl mb-2 text-center">
            Welcome to Safe Street
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-center mb-8 px-4">
            Sign in to access your profile, report incidents, and help make your community safer
          </Text>
          <Button
            title="Sign In"
            onPress={() => router.push("/(auth)/sign-in")}
            variant="primary"
            size="large"
            className="mb-3 w-full"
          />
          <Button
            title="Create Account"
            onPress={() => router.push("/(auth)/register")}
            variant="outline"
            size="large"
            className="w-full"
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default UserNotFound;
