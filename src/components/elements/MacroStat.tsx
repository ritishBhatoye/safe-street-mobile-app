import React from 'react';
import { View } from 'react-native';
import { Text } from '../atoms';

interface MacroStatProps {
  label: string;
  value: string | number;
  color?: 'blue' | 'orange' | 'cyan' | 'green';
  className?: string;
}

export const MacroStat: React.FC<MacroStatProps> = ({
  label,
  value,
  color = 'blue',
  className,
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-600';
      case 'orange':
        return 'text-orange-600';
      case 'cyan':
        return 'text-cyan-600';
      case 'green':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <View className={`flex-1 items-center ${className}`}>
      <Text variant="label" color="secondary" className="mb-1">
        {label}
      </Text>
      <Text variant="caption" weight="bold" className={getColorClass()}>
        {value}
      </Text>
    </View>
  );
};
