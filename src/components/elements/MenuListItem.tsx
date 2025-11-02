import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ICONS } from '@/constants';

import { Icon, Text } from '../atoms';

interface MenuListItemProps {
  title: string;
  iconName: keyof typeof import('@expo/vector-icons/Ionicons').glyphMap;
  color: string;
  onPress?: () => void;
  className?: string;
}

export const MenuListItem: React.FC<MenuListItemProps> = ({
  title,
  iconName,
  color,
  onPress,
  className,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center rounded-xl bg-white p-4 shadow-sm ${className}`}
    >
      <View
        className="mr-4 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon name={iconName} size="small" color={color} />
      </View>
      <Text variant="body" weight="medium" className="flex-1">
        {title}
      </Text>
      <Icon name={ICONS.arrowRight} size="small" color="#6B7280" />
    </TouchableOpacity>
  );
};
