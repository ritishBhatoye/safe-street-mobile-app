import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { Divider } from "@/components/atoms/Divider";
import { authService } from "@/services/auth.service";
import { showToast } from "@/utils/toast";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      showToast.warning("Missing Fields", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { user, error } = await authService.signIn({ email, password });

      if (error) {
        showToast.error("Sign In Failed", error.message || "Failed to sign in");
        setLoading(false);
        return;
      }

      if (user) {
        showToast.success("Welcome Back!", "Successfully signed in");
        // Navigate to home
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      showToast.error("Error", "An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "apple") => {
    try {
      if (provider === "google") {
        const result = await authService.signInWithGoogle();
        if (result.error) {
          showToast.error(
            "Sign In Failed",
            result.error.message || "Failed to sign in with Google",
          );
        }
      } else if (provider === "apple") {
        const result = await authService.signInWithApple();
        if (result.error) {
          showToast.error("Sign In Failed", result.error.message || "Failed to sign in with Apple");
        }
      }
    } catch (error) {
      showToast.error("Error", "An unexpected error occurred");
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header with Gradient */}
      <LinearGradient
        colors={["#3399FF", "#0080FF"]}
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
            <Text className="font-dm-sans-bold mb-2 text-4xl text-white">Welcome Back</Text>
            <Text className="font-dm-sans text-lg text-white/80">
              Sign in to stay safe and connected
            </Text>
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
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pt-8">
            {/* Email Input */}
            <Input
              label="Email"
              placeholder="your.email@example.com"
              value={email}
              onValueChange={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              variant="outline"
              className="mb-4"
              labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
            />

            {/* Password Input */}
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onValueChange={setPassword}
              isPassword
              variant="outline"
              className="mb-2"
              labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
            />

            {/* Forgot Password */}
            <Pressable
              onPress={() => router.push("/(auth)/forgot-password")}
              className="mb-6 self-end"
            >
              <Text className="font-dm-sans-semibold text-sm text-primary-500">
                Forgot Password?
              </Text>
            </Pressable>

            {/* Sign In Button */}
            <Button
              title={loading ? "Signing In..." : "Sign In"}
              onPress={handleSignIn}
              loading={loading}
              disabled={!email || !password}
              className="mb-6"
            />

            {/* Divider */}
            <View className="mb-6 flex-row items-center gap-4">
              <Divider className="flex-1" />
              <Text className="font-dm-sans text-sm text-gray-500 dark:text-gray-400">
                Or continue with
              </Text>
              <Divider className="flex-1" />
            </View>

            {/* Social Sign In */}
            <View className="mb-8 flex-row gap-4">
              <Pressable
                onPress={() => handleSocialSignIn("google")}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <Ionicons name="logo-google" size={20} color="#EA4335" />
                <Text className="font-dm-sans-semibold text-gray-700 dark:text-gray-300">
                  Google
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleSocialSignIn("apple")}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <Ionicons name="logo-apple" size={20} color="#000000" />
                <Text className="font-dm-sans-semibold text-gray-700 dark:text-gray-300">
                  Apple
                </Text>
              </Pressable>
            </View>

            {/* Sign Up Link */}
            <View className="flex-row items-center justify-center gap-1">
              <Text className="font-dm-sans text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?
              </Text>
              <Pressable onPress={() => router.push("./register")}>
                <Text className="font-dm-sans-bold text-primary-500">Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
