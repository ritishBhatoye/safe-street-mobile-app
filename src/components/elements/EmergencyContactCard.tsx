import React from 'react';
import { View, Linking } from 'react-native';
import { Text } from '../atoms/Text';
import { Card } from '../atoms/Card';
import { Avatar } from '../atoms/Avatar';
import { IconButton } from '../atoms/IconButton';

interface EmergencyContactCardProps {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  avatarUrl?: string;
  isDefault?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({
  name,
  phone,
  relationship,
  avatarUrl,
  isDefault,
  onEdit,
  onDelete,
}) => {
  const handleCall = () => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleMessage = () => {
    Linking.openURL(`sms:${phone}`);
  };

  return (
    <Card variant="elevated" className="mb-3">
      <View className="flex-row items-center gap-3">
        {/* Avatar */}
        <Avatar
          source={avatarUrl ? { uri: avatarUrl } : undefined}
          size="medium"
          backgroundColor="#E5E7EB"
        />

        {/* Info */}
        <View className="flex-1">
          <View className="mb-1 flex-row items-center gap-2">
            <Text
              variant="body"
              weight="semibold"
              className="text-gray-900 dark:text-white"
            >
              {name}
            </Text>
            {isDefault && (
              <View className="rounded-full bg-primary-100 px-2 py-0.5">
                <Text variant="label" className="text-primary-600">
                  Default
                </Text>
              </View>
            )}
          </View>
          <Text variant="caption" className="mb-1 text-gray-600 dark:text-gray-400">
            {relationship}
          </Text>
          <Text variant="caption" className="text-gray-500 dark:text-gray-500">
            {phone}
          </Text>
        </View>

        {/* Actions */}
        <View className="flex-row gap-2">
          <IconButton icon="call" size={20} color="#22C55E" onPress={handleCall} />
          <IconButton
            icon="chatbubble"
            size={20}
            color="#3B82F6"
            onPress={handleMessage}
          />
          {onEdit && (
            <IconButton icon="create" size={20} color="#6B7280" onPress={onEdit} />
          )}
          {onDelete && (
            <IconButton icon="trash" size={20} color="#EF4444" onPress={onDelete} />
          )}
        </View>
      </View>
    </Card>
  );
};
