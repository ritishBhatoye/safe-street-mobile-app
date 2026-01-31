import { Button } from "@/components/atoms";
import { formatOTPTimer } from "@/utils/handlers";
import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";

const OtpStep = ({
  timer,
  otp,
  otpRefs,
  setStep,
  handleResendOTP,
  loading,
  handleOTPChange,
  handleOTPKeyPress,
}: {
  timer: number;
  otp: string[];
  otpRefs: React.RefObject<(TextInput | null)[]>;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
  handleResendOTP: () => Promise<void>;
  loading: boolean;
  handleOTPChange: (index: number, value: string) => void;
  handleOTPKeyPress: (index: number, key: string) => void;
}) => {
  return (
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

        {/* Timer and Resend Button */}
        <View className="mt-6 items-center">
          {timer > 0 ? (
            <>
              <Text className="font-dm-sans text-sm text-gray-500 dark:text-gray-400">
                Resend OTP in
              </Text>
              <Text className="font-dm-sans-bold mt-1 text-xl text-primary-500">
                {formatOTPTimer(timer)}
              </Text>
            </>
          ) : (
            <Pressable
              onPress={handleResendOTP}
              disabled={loading}
              className="rounded-xl bg-primary-500 px-6 py-3"
            >
              <Text className="font-dm-sans-semibold text-white">
                {loading ? "Sending..." : "Resend OTP"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <Button
        title="Verify & Continue"
        onPress={() => setStep("password")}
        disabled={otp.join("").length !== 6}
        className="mb-4"
      />
    </>
  );
};

export default OtpStep;
