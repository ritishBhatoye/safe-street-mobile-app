import React from "react";
import { View, Text } from "react-native";

interface BadgeProps {
  label: string;
  variant: "safe" | "caution" | "danger" | "critical" | "danger" | "info" | "error";
  size?: "small" | "medium" | "large";
}

export const Badge: React.FC<BadgeProps> = ({ label, variant, size = "medium" }) => {
  const variantStyles = {
    safe: "bg-success-100 dark:bg-success-900/30",
    caution: "bg-warning-100 dark:bg-warning-900/30",
    danger: "bg-danger-100 dark:bg-danger-900/30",
    critical: "bg-red-100 dark:bg-red-900/30",
    error: "bg-red-100 dark:bg-red-900/30",
    info: "bg-info-100 dark:bg-info-900/30",
  };

  const textStyles = {
    safe: "text-success-700 dark:text-success-300",
    caution: "text-warning-700 dark:text-warning-300",
    danger: "text-danger-700 dark:text-danger-300",
    critical: "text-red-700 dark:text-red-300",
    error: "text-red-700 dark:text-red-300",
    info: "text-info-700 dark:text-info-300",
  };

  const sizeStyles = {
    small: "px-2 py-0.5",
    medium: "px-3 py-1",
    large: "px-4 py-1.5",
  };

  const textSizeStyles = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  return (
    <View className={`rounded-full ${variantStyles[variant]} ${sizeStyles[size]}`}>
      <Text className={`font-dm-sans-semibold ${textStyles[variant]} ${textSizeStyles[size]}`}>
        {label}
      </Text>
    </View>
  );
};
