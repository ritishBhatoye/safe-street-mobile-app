import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Pressable, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPasswordHeader = ({
  step,
  email,
  onBackPress,
}: {
  step: Step;
  email: string;
  onBackPress: () => void;
}) => {
  return (
    <LinearGradient
      colors={["#F59E0B", "#D97706"]}
      style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
    >
      <SafeAreaView className="px-6">
        <Pressable
          onPress={onBackPress}
          className="mb-8 h-10 w-10 items-center justify-center rounded-full bg-white/20"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>

        <View className="mb-4">
          <Text className="font-dm-sans-bold mb-2 text-4xl text-white">
            {step === "email" && "Forgot Password?"}
            {step === "otp" && "Enter OTP"}
            {step === "password" && "New Password"}
          </Text>
          <Text className="font-dm-sans text-lg text-white/80">
            {step === "email" && "We'll send you a verification code"}
            {step === "otp" && `Code sent to ${email}`}
            {step === "password" && "Create a strong password"}
          </Text>
        </View>

        <View className="items-center py-10 pt-5">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-white/20">
            <Text style={{ fontSize: 40 }}>
              {step === "email" && "🔑"}
              {step === "otp" && "📧"}
              {step === "password" && "🔒"}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ForgotPasswordHeader;
