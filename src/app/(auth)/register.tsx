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

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      showToast.warning("Missing Fields", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      showToast.error("Password Mismatch", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      showToast.warning("Weak Password", "Password must be at least 6 characters");
      return;
    }

    if (!agreeToTerms) {
      showToast.warning("Terms Required", "Please agree to Terms & Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      const { user, error } = await authService.signUp({ email, password, name });

      if (error) {
        showToast.error("Registration Failed", error.message || "Failed to create account");
        setLoading(false);
        return;
      }

      if (user) {
        // Check if email confirmation is required
        if (user.email_confirmed_at) {
          showToast.success("Welcome!", "Account created successfully");
          router.replace("/(tabs)/home");
        } else {
          showToast.info("Verify Email", "Please check your email to confirm your account");
          router.replace("./sign-in");
        }
      }
    } catch (error) {
      showToast.error("Error", "An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: "google" | "apple") => {
    try {
      if (provider === "google") {
        const result = await authService.signInWithGoogle();
        if (result.error) {
          showToast.error(
            "Sign Up Failed",
            result.error.message || "Failed to sign up with Google",
          );
        }
      } else if (provider === "apple") {
        const result = await authService.signInWithApple();
        if (result.error) {
          showToast.error("Sign Up Failed", result.error.message || "Failed to sign up with Apple");
        }
      }
    } catch (error) {
      showToast.error("Error", "An unexpected error occurred");
    }
  };

  const isFormValid = name && email && password && confirmPassword && agreeToTerms;

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header with Gradient */}
      <LinearGradient
        colors={["#8B5CF6", "#7C3AED"]}
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
            <Text className="font-dm-sans-bold mb-2 text-4xl text-white">Create Account</Text>
            <Text className="font-dm-sans text-lg text-white/80">
              Join Safe Street community today
            </Text>
          </View>

          {/* Icon */}
          <View className="items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <Text style={{ fontSize: 40 }}>🤝</Text>
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
            {/* Name Input */}
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onValueChange={setName}
              variant="outline"
              className="mb-4"
              labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
            />

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
              placeholder="Create a strong password"
              value={password}
              onValueChange={setPassword}
              isPassword
              variant="outline"
              className="mb-4"
              labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
            />

            {/* Confirm Password Input */}
            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onValueChange={setConfirmPassword}
              isPassword
              variant="outline"
              className="mb-4"
              labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
            />

            {/* Terms & Conditions */}
            <Pressable
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              className="mb-6 flex-row items-start gap-3"
            >
              <View
                className={`h-6 w-6 items-center justify-center rounded-lg border-2 ${
                  agreeToTerms
                    ? "border-primary-500 bg-primary-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {agreeToTerms && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <Text className="font-dm-sans flex-1 text-sm text-gray-600 dark:text-gray-400">
                I agree to the{" "}
                <Text className="font-dm-sans-semibold text-primary-500">Terms of Service</Text> and{" "}
                <Text className="font-dm-sans-semibold text-primary-500">Privacy Policy</Text>
              </Text>
            </Pressable>

            {/* Register Button */}
            <Button
              title={loading ? "Creating Account..." : "Create Account"}
              onPress={handleRegister}
              loading={loading}
              disabled={!isFormValid}
              className="mb-6"
              variant="primary"
            />

            {/* Divider */}
            <View className="mb-6 flex-row items-center gap-4">
              <Divider className="flex-1" />
              <Text className="font-dm-sans text-sm text-gray-500 dark:text-gray-400">
                Or sign up with
              </Text>
              <Divider className="flex-1" />
            </View>

            {/* Social Sign Up */}
            <View className="mb-8 flex-row gap-4">
              <Pressable
                onPress={() => handleSocialSignUp("google")}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <Ionicons name="logo-google" size={20} color="#EA4335" />
                <Text className="font-dm-sans-semibold text-gray-700 dark:text-gray-300">
                  Google
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleSocialSignUp("apple")}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <Ionicons name="logo-apple" size={20} color="#000000" />
                <Text className="font-dm-sans-semibold text-gray-700 dark:text-gray-300">
                  Apple
                </Text>
              </Pressable>
            </View>

            {/* Sign In Link */}
            <View className="flex-row items-center justify-center gap-1">
              <Text className="font-dm-sans text-gray-600 dark:text-gray-400">
                Already have an account?
              </Text>
              <Pressable onPress={() => router.push("./sign-in")}>
                <Text className="font-dm-sans-bold text-primary-500">Sign In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
