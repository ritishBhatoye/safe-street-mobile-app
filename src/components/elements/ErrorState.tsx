import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  emoji?: string;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Unable to Load",
  message,
  onRetry,
  retryText = "Try Again",
  emoji = "⚠️",
  className = "",
}) => {
  return (
    <View className={`flex-1 items-center justify-center px-6 ${className}`}>
      <View className="w-16 h-16 rounded-full bg-danger-100 dark:bg-danger-900/30 items-center justify-center mb-4">
        <Text className="text-3xl">{emoji}</Text>
      </View>
      <Text className="text-lg font-dm-sans-bold text-gray-900 dark:text-white mb-2 text-center">
        {title}
      </Text>
      <Text className="text-sm font-dm-sans text-gray-600 dark:text-gray-400 text-center mb-4">
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          className="bg-primary-500 px-6 py-3 rounded-xl"
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text className="text-white font-dm-sans-semibold">{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorState;
