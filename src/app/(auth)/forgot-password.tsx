import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
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
import { SafeAreaView } from "react-native-safe-area-context";

type Step = "email" | "otp" | "password" | "success";

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
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={["#F59E0B", "#D97706"]}
        // className="pb-8 pt-16"
        style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <SafeAreaView className="px-6">
          <Pressable
            onPress={() => (step === "email" ? router.back() : setStep("email"))}
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
              <>
                <View className="mb-6 rounded-2xl bg-warning-50 p-4 dark:bg-warning-900/20">
                  <Text className="font-dm-sans text-sm leading-6 text-warning-700 dark:text-warning-300">
                    Enter your email and we&apos;ll send you a 6-digit verification code.
                  </Text>
                </View>

                <Input
                  label="Email Address"
                  placeholder="your.email@example.com"
                  value={email}
                  onValueChange={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  variant="outline"
                  className="mb-6"
                  labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
                />

                <Button
                  title={loading ? "Sending..." : "Send OTP"}
                  onPress={handleSendOTP}
                  loading={loading}
                  disabled={!email}
                  className="mb-4"
                />
              </>
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
              <>
                <Input
                  label="New Password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onValueChange={setNewPassword}
                  secureTextEntry={!showPassword}
                  variant="outline"
                  className="mb-4"
                  labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
                  endContent={
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
                    </Pressable>
                  }
                />

                <Input
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onValueChange={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  variant="outline"
                  className="mb-6"
                  labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
                />

                <View className="mb-6 rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/20">
                  <Text className="font-dm-sans text-sm leading-6 text-blue-700 dark:text-blue-300">
                    Password must be at least 8 characters long
                  </Text>
                </View>

                <Button
                  title={loading ? "Resetting..." : "Reset Password"}
                  onPress={handleResetPassword}
                  loading={loading}
                  disabled={!newPassword || !confirmPassword}
                  className="mb-4"
                />
              </>
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
