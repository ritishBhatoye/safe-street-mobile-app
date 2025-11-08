import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withDelay } from "react-native-reanimated";
import { Card } from "../atoms/Card";

import * as Location from "expo-location";

interface MiniMapPreviewProps {
  userLocation: Location.LocationObject | null;
  incidents: NearbyIncidentType[];
  onPress: () => void;
}

export const MiniMapPreview: React.FC<MiniMapPreviewProps> = ({
  userLocation,
  incidents,
  onPress,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(700, withSpring(1));
    translateY.value = withDelay(700, withSpring(0));
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const nearestIncidents = incidents.slice(0, 5);

  return (
    <Animated.View style={animatedStyle}>
      <View className="mb-3">
        <Text className="text-lg font-dm-sans-bold text-gray-900 dark:text-white mb-1">
          Map Preview
        </Text>
        <Text className="text-sm font-dm-sans text-gray-500 dark:text-gray-400">
          Tap to view full map
        </Text>
      </View>

      <Pressable onPress={onPress}>
        <Card variant="elevated" className="overflow-hidden">
          <View className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 items-center justify-center relative">
            {/* Mock map background */}
            <View className="absolute inset-0 opacity-20">
              <View className="flex-1 flex-row flex-wrap">
                {Array.from({ length: 20 }).map((_, i) => (
                  <View
                    key={i}
                    className="w-1/5 h-1/4 border border-gray-300 dark:border-gray-600"
                  />
                ))}
              </View>
            </View>

            {/* User location marker */}
            {userLocation && (
              <View className="absolute" style={{ top: "50%", left: "50%" }}>
                <View className="w-4 h-4 rounded-full bg-primary-500 border-2 border-white" />
              </View>
            )}

            {/* Incident markers */}
            {nearestIncidents.map((incident, index) => {
              const angle = (index * 2 * Math.PI) / nearestIncidents.length;
              const radius = 60;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              const color =
                incident.priority === "critical"
                  ? "#EF4444"
                  : incident.priority === "high"
                    ? "#F97316"
                    : "#F59E0B";

              return (
                <View
                  key={incident.id}
                  className="absolute"
                  style={{
                    top: 96 + y,
                    left: 96 + x,
                  }}
                >
                  <View
                    className="w-3 h-3 rounded-full border border-white"
                    style={{ backgroundColor: color }}
                  />
                </View>
              );
            })}

            {/* Overlay */}
            <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons name="location" size={16} color="white" />
                <Text className="text-sm font-dm-sans-medium text-white">
                  {nearestIncidents.length} incidents nearby
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
};
