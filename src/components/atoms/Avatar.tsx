import React from 'react';
import { Image, View } from 'react-native';

interface AvatarProps {
  source?: any;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 'medium',
  backgroundColor = '#F3F4F6',
  className,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'w-10 h-10';
      case 'medium':
        return 'w-16 h-16';
      case 'large':
        return 'w-20 h-20';
      default:
        return 'w-16 h-16';
    }
  };

  return (
    <View
      className={`items-center justify-center rounded-full ${getSizeStyles()} ${className}`}
      style={{ backgroundColor }}
    >
      {source && (
        <Image
          source={source}
          className={`rounded-full ${getSizeStyles()}`}
          resizeMode="cover"
        />
      )}
    </View>
  );
};
