import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Text } from '../atoms';

interface CategoryChipProps {
  title: string;
  isSelected?: boolean;
  onPress?: () => void;
  className?: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  title,
  isSelected = false,
  onPress,
  className,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`rounded-full px-4 py-2 ${
      isSelected ? 'bg-green-500' : 'bg-gray-500/20 '
    } ${className}`}
  >
    <Text
      weight="medium"
      className={isSelected ? 'text-white' : 'text-gray-600'}
    >
      {title}
    </Text>
  </TouchableOpacity>
);
