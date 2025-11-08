import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: 'small' | 'medium' | 'large' | number;
  color?: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'medium',
  color = '#374151',
  className,
}) => {
  const getSize = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 24;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  return (
    <Ionicons
      name={name}
      size={getSize()}
      color={color}
      className={className}
    />
  );
};
