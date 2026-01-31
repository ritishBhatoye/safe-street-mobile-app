import { router } from "expo-router";

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { authService } from "@/services/auth.service";
import { showToast } from "@/utils/toast";
import ForgotPasswordHeader from "@/components/auth/ForgotPasswordScreen /ForgotPasswordHeader";
import SuccessStep from "@/components/auth/ForgotPasswordScreen /SuccessStep";
import EmailStep from "@/components/auth/ForgotPasswordScreen /EmailStep";
import ResetPasswordStep from "@/components/auth/ForgotPasswordScreen /ResetPasswordStep";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP input refs
  const otpRefs = useRef<(TextInput | null)[]>([]);

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    if (!email) {
      showToast.warning("Email Required", "Please enter your email address");
      return;
    }

    setLoading(true);
    const result = await authService.sendPasswordResetOTP(email);

    if (result.error) {
      showToast.error("Failed", result.error.message || "Failed to send OTP");
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep("otp");
    showToast.success("OTP Sent!", "Check your email for the verification code");
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      showToast.warning("Invalid OTP", "Please enter the 6-digit code");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      showToast.warning("Weak Password", "Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast.warning("Mismatch", "Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await authService.verifyOTPAndResetPassword(email, otpCode, newPassword);

    if (result.error) {
      showToast.error("Failed", result.error.message || "Failed to reset password");
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep("success");
    showToast.success("Success!", "Your password has been reset");

    router.push("/(auth)/sign-in");
  };

  // Handle OTP input
  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedCode.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP backspace
  const handleOTPKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    const result = await authService.sendPasswordResetOTP(email);

    if (result.error) {
      showToast.error("Failed", "Could not resend OTP");
    } else {
      showToast.success("OTP Sent!", "Check your email");
      setOtp(["", "", "", "", "", ""]);
    }
    setLoading(false);
  };

  // Success Screen
  if (step === "success") {
    return <SuccessStep />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <ForgotPasswordHeader
        step={step}
        email={email}
        onBackPress={() => (step === "email" ? router.back() : setStep("email"))}
      />

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
            {/* Step 1: Email Input */}
            {step === "email" && (
              <EmailStep
                email={email}
                setEmail={setEmail}
                loading={loading}
                handleSendOTP={handleSendOTP}
              />
            )}

            {/* Step 2: OTP Input */}
            {step === "otp" && (
              <>
                <View className="mb-8">
                  <Text className="font-dm-sans-medium mb-4 text-center text-gray-700 dark:text-gray-300">
                    Enter the 6-digit code
                  </Text>

                  <View className="flex-row justify-between gap-2">
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          otpRefs.current[index] = ref;
                        }}
                        value={digit}
                        onChangeText={(value) => handleOTPChange(index, value)}
                        onKeyPress={({ nativeEvent }) => handleOTPKeyPress(index, nativeEvent.key)}
                        keyboardType="number-pad"
                        maxLength={1}
                        className="h-14 flex-1 rounded-xl border-2 border-gray-300 bg-white text-center text-2xl font-dm-sans-bold text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        style={{ minWidth: 45 }}
                      />
                    ))}
                  </View>
                </View>

                <Button
                  title="Verify & Continue"
                  onPress={() => setStep("password")}
                  disabled={otp.join("").length !== 6}
                  className="mb-4"
                />

                <Pressable
                  onPress={handleResendOTP}
                  disabled={loading}
                  className="items-center py-3"
                >
                  <Text className="font-dm-sans-semibold text-primary-500">
                    Didn&#39;t receive code? Resend
                  </Text>
                </Pressable>
              </>
            )}

            {/* Step 3: New Password */}
            {step === "password" && (
              <ResetPasswordStep
                showPassword
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                loading={loading}
                setNewPassword={setNewPassword}
                handleResetPassword={handleResetPassword}
                setShowPassword={setShowPassword}
                setConfirmPassword={setConfirmPassword}
              />
            )}

            {/* Back to Sign In */}
            <Pressable
              onPress={() => router.back()}
              className="flex-row items-center justify-center gap-2 py-3"
            >
              <Ionicons name="arrow-back" size={16} color="#3399FF" />
              <Text className="font-dm-sans-semibold text-primary-500">Back to Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
