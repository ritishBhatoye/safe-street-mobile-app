import React from 'react';
import { View } from 'react-native';

import { Text } from '../atoms';

interface StatCardProps {
  value: string | number;
  label: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  color = 'blue',
  className,
}) => {
  const getColorStyles = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          label: 'text-blue-500',
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          text: 'text-green-600',
          label: 'text-green-500',
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-600',
          label: 'text-purple-500',
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-600',
          label: 'text-orange-500',
        };
      case 'red':
        return { bg: 'bg-red-50', text: 'text-red-600', label: 'text-red-500' };
      default:
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          label: 'text-blue-500',
        };
    }
  };

  const styles = getColorStyles();

  return (
    <View className={`flex-1 rounded-xl p-4 ${styles.bg} ${className}`}>
      <Text variant="heading" weight="bold" className={styles.text}>
        {value}
      </Text>
      <Text variant="label" className={styles.label}>
        {label}
      </Text>
    </View>
  );
};
