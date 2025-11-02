import React from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IconButtonProps extends PressableProps {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  backgroundColor?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 24,
  color = '#3399FF',
  variant = 'ghost',
  backgroundColor,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'solid':
        return 'bg-primary-500 active:bg-primary-600';
      case 'outline':
        return 'border-2 border-primary-500 active:bg-primary-50';
      case 'ghost':
        return 'active:bg-gray-100 dark:active:bg-gray-800';
      default:
        return '';
    }
  };

  return (
    <Pressable
      className={`h-10 w-10 items-center justify-center rounded-full ${getVariantStyles()} ${className}`}
      style={backgroundColor ? { backgroundColor } : undefined}
      {...props}
    >
      <Ionicons
        name={icon}
        size={size}
        color={variant === 'solid' ? '#FFFFFF' : color}
      />
    </Pressable>
  );
};
