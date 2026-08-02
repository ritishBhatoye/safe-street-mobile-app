import { Card } from "@/components/atoms";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View, Text } from "react-native";

interface Props {
  onPress: () => void;
}

export const EditProfileCard = (onPress: Props) => {
  return (
    <Card variant="elevated" className="mb-3">
      <Pressable onPress={() => onPress} className="flex-row items-center py-2 active:opacity-70">
        <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
          <Ionicons name="create-outline" size={20} color="#3B82F6" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 dark:text-white font-dm-sans-semibold text-base">
            Edit Profile
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-sm">
            Update your name and phone number
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </Pressable>
    </Card>
  );
};
