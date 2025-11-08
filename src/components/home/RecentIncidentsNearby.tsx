import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withDelay } from "react-native-reanimated";

import { NearbyIncidentCard } from "./NearbyIncidentCard";

interface RecentIncidentsNearbyProps {
  incidents: NearbyIncidentType[];
}

export const RecentIncidentsNearby: React.FC<RecentIncidentsNearbyProps> = ({ incidents }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(400, withSpring(1));
    translateY.value = withDelay(400, withSpring(0));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (incidents.length === 0) {
    return (
      <Animated.View style={animatedStyle}>
        <View className="bg-success-50 dark:bg-success-900/20 rounded-2xl p-6 items-center">
          <Text className="text-2xl mb-2">✨</Text>
          <Text className="text-base font-dm-sans-semibold text-success-700 dark:text-success-300 mb-1">
            All Clear!
          </Text>
          <Text className="text-sm font-dm-sans text-success-600 dark:text-success-400 text-center">
            No recent incidents in your area
          </Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <View className="mb-3">
        <Text className="text-lg font-dm-sans-bold text-gray-900 dark:text-white mb-1">
          Recent Incidents Nearby
        </Text>
        <Text className="text-sm font-dm-sans text-gray-500 dark:text-gray-400">
          {incidents.length} incident{incidents.length !== 1 ? "s" : ""} within 5km
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {incidents.map((incident) => (
          <NearbyIncidentCard key={incident.id} incident={incident} />
        ))}
      </ScrollView>
    </Animated.View>
  );
};
