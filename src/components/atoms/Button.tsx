import React from 'react';
import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
}

export const Button = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'items-center justify-center rounded-2xl';
  
  const variantStyles = {
    primary: 'bg-primary-500 active:bg-primary-600',
    secondary: 'bg-secondary-500 active:bg-secondary-600',
    outline: 'border-2 border-white bg-transparent active:bg-white/10',
    ghost: 'bg-transparent active:bg-white/10',
  };

  const sizeStyles = {
    small: 'px-4 py-2',
    medium: 'px-6 py-3',
    large: 'px-8 py-4',
  };

  const textSizeStyles = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const textColorStyles = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-white',
    ghost: 'text-white',
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        isDisabled ? 'opacity-50' : ''
      } ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text
          className={`font-dm-sans-semibold ${textSizeStyles[size]} ${textColorStyles[variant]}`}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};
