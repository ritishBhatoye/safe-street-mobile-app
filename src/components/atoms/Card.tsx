import React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  onPress?: () => void;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  onPress,
  children,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-white dark:bg-gray-800 shadow-md';
      case 'outlined':
        return 'bg-transparent border border-gray-200 dark:border-gray-700';
      case 'filled':
        return 'bg-gray-50 dark:bg-gray-800';
      default:
        return 'bg-white dark:bg-gray-800 shadow-md';
    }
  };

  const content = (
    <View
      className={`rounded-2xl p-4 ${getVariantStyles()} ${className}`}
      {...props}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} className="active:opacity-80">
        {content}
      </Pressable>
    );
  }

  return content;
};
