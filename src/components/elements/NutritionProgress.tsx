import React from 'react';
import { View } from 'react-native';
import { ProgressBar, Text } from '../atoms';

interface NutritionProgressProps {
  title: string;
  current: number;
  target: number;
  unit?: string;
  color?: string;
  className?: string;
}

export const NutritionProgress: React.FC<NutritionProgressProps> = ({
  title,
  current,
  target,
  unit = '',
  color = '#10B981',
  className,
}) => {
  const progress = (current / target) * 100;

  return (
    <View className={className}>
      <View className="mb-2 flex-row items-center justify-between">
        <Text variant="caption" weight="medium" color="secondary">
          {title}
        </Text>
        <Text variant="caption" weight="bold">
          {current}/{target}
          {unit}
        </Text>
      </View>
      <ProgressBar progress={progress} color={color} />
    </View>
  );
};
