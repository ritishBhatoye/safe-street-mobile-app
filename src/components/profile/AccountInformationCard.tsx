import React from "react";
import { Card } from "../atoms";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  profile: UserProfileType;
  userId: string;
}

export const AccountInformationCard = ({ profile, userId }: Props) => {
  return (
    <Card variant="elevated" className="mb-3">
      <View className="py-2">
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 rounded-full bg-secondary-100 items-center justify-center mr-3">
            <Ionicons name="information-circle-outline" size={20} color="#14B8A6" />
          </View>
          <Text className="text-gray-900 dark:text-white font-dm-sans-semibold text-base">
            Account Information
          </Text>
        </View>

        <View className="ml-13 space-y-2">
          <View className="mb-2">
            <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-xs">User ID</Text>
            <Text className="text-gray-900 dark:text-white font-dm-sans-mono text-sm">
              {/* {user?.id.substring(0, 8)}... */}
              {userId}
            </Text>
          </View>

          {profile.phone && (
            <View>
              <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-xs">Phone</Text>
              <Text className="text-gray-900 dark:text-white font-dm-sans text-sm">
                {profile.phone}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};
