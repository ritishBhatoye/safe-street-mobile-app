import React from "react";

import { View, Text, StatusBar } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/atoms";
import { router } from "expo-router";

const SuccessStep = () => {
  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#22C55E", "#16A34A"]}
        className="flex-1"
        style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <View className="flex-1 items-center justify-center px-6">
          <View className="mb-8 h-32 w-32 items-center justify-center rounded-full bg-white/20">
            <Ionicons name="checkmark-circle" size={80} color="#FFFFFF" />
          </View>

          <Text className="font-dm-sans-bold mb-4 text-center text-3xl text-white">
            Password Reset!
          </Text>

          <Text className="font-dm-sans mb-8 text-center text-lg text-white/80">
            Your password has been successfully reset.{"\n"}You can now sign in with your new
            password.
          </Text>

          <Button
            title="Back to Sign In"
            onPress={() => router.replace("/(auth)/sign-in")}
            variant="secondary"
            className="w-full bg-white"
          />
        </View>
      </LinearGradient>
    </View>
  );
};

export default SuccessStep;
