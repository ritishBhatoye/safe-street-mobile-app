import { Button, Input } from "@/components/atoms";
import React from "react";
import { View, Text } from "react-native";

const EmailStep = ({
  email,
  setEmail,
  loading,
  handleSendOTP,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  handleSendOTP: () => Promise<void>;
}) => {
  return (
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
  );
};

export default EmailStep;
