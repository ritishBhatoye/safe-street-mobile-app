import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  StatusBar,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthWrapper = ({
  title = "Welcome Back",
  subTitle = "Sign in to stay safe and connected",
  children,
  gradColors = ["#3399FF", "#0080FF"],
}: {
  title: string;
  subTitle: string;
  gradColors?: [string, string, ...string[]];
  children: React.ReactNode;
}) => {
  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="light-content" />
      {/* Header with Gradient */}
      <LinearGradient
        colors={gradColors}
        className="pb-8 pt-16"
        style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <SafeAreaView className="px-6">
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            className="mb-8 h-10 w-10 items-center justify-center rounded-full bg-white/20"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>

          {/* Title */}
          <View className="mb-4">
            <Text className="font-dm-sans-bold mb-2 text-4xl text-white">{title}</Text>
            <Text className="font-dm-sans text-lg text-white/80">{subTitle}</Text>
          </View>

          {/* Shield Icon */}
          <View className="items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <Text style={{ fontSize: 40 }}>🛡️</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AuthWrapper;
