import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../atoms/Text';
import { Card } from '../atoms/Card';

interface SafetyScoreCardProps {
  score: number; // 0-100
  location: string;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export const SafetyScoreCard: React.FC<SafetyScoreCardProps> = ({
  score,
  location,
  trend = 'stable',
  className = '',
}) => {
  const getScoreColor = () => {
    if (score >= 80) return 'text-success-500';
    if (score >= 60) return 'text-warning-500';
    return 'text-danger-500';
  };

  const getScoreBgColor = () => {
    if (score >= 80) return 'bg-success-50 dark:bg-success-900/20';
    if (score >= 60) return 'bg-warning-50 dark:bg-warning-900/20';
    return 'bg-danger-50 dark:bg-danger-900/20';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Safe';
    if (score >= 60) return 'Moderate';
    return 'Caution';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'remove';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#22C55E';
      case 'down':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <Card variant="elevated" className={className}>
      <View className="items-center">
        {/* Score Circle */}
        <View
          className={`mb-4 h-32 w-32 items-center justify-center rounded-full ${getScoreBgColor()}`}
        >
          <Text variant="heading" weight="bold" className={`text-4xl ${getScoreColor()}`}>
            {score}
          </Text>
          <Text variant="caption" className="text-gray-600 dark:text-gray-400">
            Safety Score
          </Text>
        </View>

        {/* Label */}
        <Text
          variant="body"
          weight="semibold"
          className="mb-1 text-gray-900 dark:text-white"
        >
          {getScoreLabel()}
        </Text>

        {/* Location */}
        <View className="mb-3 flex-row items-center gap-1">
          <Ionicons name="location" size={14} color="#6B7280" />
          <Text variant="caption" className="text-gray-500 dark:text-gray-400">
            {location}
          </Text>
        </View>

        {/* Trend */}
        <View className="flex-row items-center gap-1">
          <Ionicons name={getTrendIcon()} size={16} color={getTrendColor()} />
          <Text variant="caption" className="text-gray-500 dark:text-gray-400">
            {trend === 'up'
              ? 'Improving'
              : trend === 'down'
                ? 'Declining'
                : 'Stable'}
          </Text>
        </View>
      </View>
    </Card>
  );
};
