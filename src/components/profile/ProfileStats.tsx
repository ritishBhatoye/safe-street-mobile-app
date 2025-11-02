import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/atoms/Card';

interface ProfileStatsProps {
  incidentsReported: number;
  memberSince: string;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  incidentsReported,
  memberSince,
}) => {
  return (
    <View className="flex-row gap-3 px-4 -mt-6 mb-4">
      {/* Incidents Reported Card */}
      <Card variant="elevated" className="flex-1">
        <View className="items-center py-2">
          <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center mb-2">
            <Ionicons name="alert-circle" size={24} color="#3B82F6" />
          </View>
          <Text className="text-gray-900 dark:text-white font-dm-sans-bold text-2xl mb-1">
            {incidentsReported}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-sm text-center">
            Incidents{'\n'}Reported
          </Text>
        </View>
      </Card>

      {/* Member Since Card */}
      <Card variant="elevated" className="flex-1">
        <View className="items-center py-2">
          <View className="w-12 h-12 rounded-full bg-secondary-100 items-center justify-center mb-2">
            <Ionicons name="calendar" size={24} color="#14B8A6" />
          </View>
          <Text className="text-gray-900 dark:text-white font-dm-sans-bold text-lg mb-1 text-center">
            {memberSince}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-sm text-center">
            Member Since
          </Text>
        </View>
      </Card>
    </View>
  );
};
