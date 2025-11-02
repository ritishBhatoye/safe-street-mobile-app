import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  onDelete,
  icon,
  variant = 'filled',
  size = 'medium',
  className = '',
}) => {
  const getVariantStyles = () => {
    if (selected) {
      return 'bg-primary-500 border-primary-500';
    }
    return variant === 'filled'
      ? 'bg-gray-100 dark:bg-gray-800'
      : 'bg-transparent border border-gray-300 dark:border-gray-600';
  };

  const getSizeStyles = () => (size === 'small' ? 'px-3 py-1' : 'px-4 py-2');

  const textColor = selected ? 'text-white' : 'text-gray-700 dark:text-gray-300';

  const content = (
    <View
      className={`flex-row items-center gap-2 rounded-full ${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={size === 'small' ? 14 : 16}
          color={selected ? '#FFFFFF' : '#6B7280'}
        />
      )}
      <Text className={`font-dm-sans-medium text-sm ${textColor}`}>{label}</Text>
      {onDelete && (
        <Pressable onPress={onDelete} hitSlop={8}>
          <Ionicons
            name="close-circle"
            size={size === 'small' ? 14 : 16}
            color={selected ? '#FFFFFF' : '#6B7280'}
          />
        </Pressable>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} className="active:opacity-70">
        {content}
      </Pressable>
    );
  }

  return content;
};
