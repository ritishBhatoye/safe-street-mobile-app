import React, { useEffect } from "react";
import { View, Text, Pressable, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withDelay } from "react-native-reanimated";
import { Card } from "../atoms/Card";

export const EmergencyCard: React.FC = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(800, withSpring(1));
    translateY.value = withDelay(800, withSpring(0));
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleCall = (number: string, label: string) => {
    Alert.alert(
      `Call ${label}`,
      `Do you want to call ${number}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () => Linking.openURL(`tel:${number}`),
        },
      ]
    );
  };

  const handleSOS = () => {
    Alert.alert(
      "Emergency SOS",
      "This will alert your emergency contacts and share your location. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send SOS",
          style: "destructive",
          onPress: () => {
            // Implement SOS functionality
            console.log("SOS triggered");
          },
        },
      ]
    );
  };

  return (
    <Animated.View style={animatedStyle}>
      <View className="mb-3">
        <Text className="text-lg font-dm-sans-bold text-gray-900 dark:text-white mb-1">
          Emergency Services
        </Text>
        <Text className="text-sm font-dm-sans text-gray-500 dark:text-gray-400">
          Quick access to help
        </Text>
      </View>

      <Card variant="elevated" className="bg-danger-50 dark:bg-danger-900/20">
        <View className="gap-3">
          {/* Police */}
          <Pressable
            onPress={() => handleCall("911", "Police")}
            className="flex-row items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl active:opacity-70"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center">
                <Ionicons name="shield-checkmark" size={20} color="white" />
              </View>
              <View>
                <Text className="text-base font-dm-sans-semibold text-gray-900 dark:text-white">
                  Police
                </Text>
                <Text className="text-sm font-dm-sans text-gray-500 dark:text-gray-400">
                  911
                </Text>
              </View>
            </View>
            <Ionicons name="call" size={20} color="#3399FF" />
          </Pressable>

          {/* Women's Helpline */}
          <Pressable
            onPress={() => handleCall("1091", "Women's Helpline")}
            className="flex-row items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl active:opacity-70"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-secondary-500 items-center justify-center">
                <Ionicons name="people" size={20} color="white" />
              </View>
              <View>
                <Text className="text-base font-dm-sans-semibold text-gray-900 dark:text-white">
                  Women&apos;s Helpline
                </Text>
                <Text className="text-sm font-dm-sans text-gray-500 dark:text-gray-400">
                  1091
                </Text>
              </View>
            </View>
            <Ionicons name="call" size={20} color="#00FFF5" />
          </Pressable>

          {/* SOS Button */}
          <Pressable
            onPress={handleSOS}
            className="p-4 bg-danger-500 rounded-xl active:opacity-80 items-center"
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="warning" size={24} color="white" />
              <Text className="text-lg font-dm-sans-bold text-white">
                EMERGENCY SOS
              </Text>
            </View>
          </Pressable>
        </View>
      </Card>
    </Animated.View>
  );
};
