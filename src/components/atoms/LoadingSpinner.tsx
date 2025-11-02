import React from 'react';
import { ActivityIndicator, View, type ViewProps } from 'react-native';
import { Text } from './Text';

interface LoadingSpinnerProps extends ViewProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#3399FF',
  message,
  fullScreen = false,
  className = '',
  ...props
}) => {
  const content = (
    <View className={`items-center justify-center gap-3 ${className}`} {...props}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text variant="body" className="text-gray-600 dark:text-gray-400">
          {message}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        {content}
      </View>
    );
  }

  return content;
};
