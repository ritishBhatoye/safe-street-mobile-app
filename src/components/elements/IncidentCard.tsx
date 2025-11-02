import React from 'react';
import { View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../atoms/Text';
import { Badge } from '../atoms/Badge';
import { Card } from '../atoms/Card';

interface IncidentCardProps {
  id: string;
  type: string;
  severity: 'safe' | 'caution' | 'danger' | 'critical';
  title: string;
  description: string;
  location: string;
  distance?: string;
  timeAgo: string;
  confirmedCount: number;
  imageUrl?: string;
  onPress?: () => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  type,
  severity,
  title,
  description,
  location,
  distance,
  timeAgo,
  confirmedCount,
  imageUrl,
  onPress,
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'safe':
        return 'success';
      case 'caution':
        return 'warning';
      case 'danger':
        return 'error';
      case 'critical':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getSeverityIcon = () => {
    switch (severity) {
      case 'safe':
        return 'checkmark-circle';
      case 'caution':
        return 'warning';
      case 'danger':
        return 'alert-circle';
      case 'critical':
        return 'alert';
      default:
        return 'information-circle';
    }
  };

  return (
    <Card variant="elevated" onPress={onPress} className="mb-3">
      <View className="flex-row gap-3">
        {/* Image */}
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            className="h-20 w-20 rounded-xl"
            resizeMode="cover"
          />
        )}

        {/* Content */}
        <View className="flex-1">
          {/* Header */}
          <View className="mb-2 flex-row items-center justify-between">
            <Badge text={type} variant={getSeverityColor()} size="small" />
            <View className="flex-row items-center gap-1">
              <Ionicons
                name={getSeverityIcon()}
                size={16}
                color={
                  severity === 'critical' || severity === 'danger'
                    ? '#EF4444'
                    : severity === 'caution'
                      ? '#F59E0B'
                      : '#22C55E'
                }
              />
              <Text variant="caption" className="text-gray-500 dark:text-gray-400">
                {timeAgo}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text
            variant="body"
            weight="semibold"
            className="mb-1 text-gray-900 dark:text-white"
          >
            {title}
          </Text>

          {/* Description */}
          <Text
            variant="caption"
            className="mb-2 text-gray-600 dark:text-gray-400"
            numberOfLines={2}
          >
            {description}
          </Text>

          {/* Footer */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <Ionicons name="location" size={14} color="#6B7280" />
              <Text variant="caption" className="text-gray-500 dark:text-gray-400">
                {location}
                {distance && ` • ${distance}`}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="people" size={14} color="#6B7280" />
              <Text variant="caption" className="text-gray-500 dark:text-gray-400">
                {confirmedCount} confirmed
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};
