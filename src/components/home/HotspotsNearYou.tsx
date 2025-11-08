import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withDelay } from "react-native-reanimated";
import { Card } from "../atoms/Card";
import { Hotspot } from "@/services/home.service";

interface HotspotsNearYouProps {
  hotspots: Hotspot[];
}

export const HotspotsNearYou: React.FC<HotspotsNearYouProps> = ({ hotspots }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(500, withSpring(1));
    translateY.value = withDelay(500, withSpring(0));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (hotspots.length === 0) {
    return null;
  }

  return (
    <Animated.View style={animatedStyle}>
      <View className="mb-3">
        <Text className="text-lg font-dm-sans-bold text-gray-900 dark:text-white mb-1">
          Hotspots Near You
        </Text>
        <Text className="text-sm font-dm-sans text-gray-500 dark:text-gray-400">
          Areas with multiple incidents
        </Text>
      </View>

      {hotspots.map((hotspot, index) => (
        <Card key={index} variant="elevated" className="mb-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 rounded-lg bg-danger-500 items-center justify-center mr-3">
                  <Ionicons name="warning" size={18} color="white" />
                </View>
                <Text className="text-base font-dm-sans-semibold text-gray-900 dark:text-white flex-1" numberOfLines={1}>
                  {hotspot.location}
                </Text>
              </View>
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text className="text-sm font-dm-sans-medium text-danger-700 dark:text-danger-300">
                    {hotspot.incident_count} incidents
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="location" size={14} color="#9CA3AF" />
                  <Text className="text-sm font-dm-sans text-gray-600 dark:text-gray-400">
                    {hotspot.distance?.toFixed(1)} km away
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>
      ))}
    </Animated.View>
  );
};
