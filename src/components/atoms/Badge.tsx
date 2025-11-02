import React from 'react';
import { View } from 'react-native';

import { Text } from './Text';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  size = 'medium',
  className,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-100';
      case 'secondary':
        return 'bg-gray-100';
      case 'success':
        return 'bg-green-100';
      case 'warning':
        return 'bg-orange-100';
      case 'error':
        return 'bg-red-100';
      default:
        return 'bg-blue-100';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return 'text-blue-600';
      case 'secondary':
        return 'text-gray-600';
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-orange-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const getSizeStyles = () => (size === 'small' ? 'px-2 py-1' : 'px-3 py-2');

  return (
    <View
      className={`rounded-full ${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      <Text
        variant={size === 'small' ? 'label' : 'caption'}
        weight="medium"
        className={getTextColor()}
      >
        {text}
      </Text>
    </View>
  );
};
