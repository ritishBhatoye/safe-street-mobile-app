import { Button, Input } from "@/components/atoms";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View, Text } from "react-native";

const ResetPasswordStep = ({
  confirmPassword,
  showPassword,
  setNewPassword,
  newPassword,
  handleResetPassword,
  setShowPassword,
  setConfirmPassword,
  loading,
}: {
  showPassword: boolean;
  newPassword: string;
  confirmPassword: string;
  loading: boolean;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  handleResetPassword: () => Promise<void>;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
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
  );
};

export default ResetPasswordStep;
