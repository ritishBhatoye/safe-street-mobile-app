import React, { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withDelay } from "react-native-reanimated";
import { QuickActionButton } from "../atoms/QuickActionButton";

export const QuickActions: React.FC = () => {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(200, withSpring(1));
    translateY.value = withDelay(200, withSpring(0));
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View className="flex-row justify-between gap-3 px-1">
        <QuickActionButton
          icon="walk"
          label="Walk"
          color="#22C55E"
          onPress={() => router.push("/(tabs)/home/walk-with-me")}
        />
        <QuickActionButton
          icon="alert-circle"
          label="Report"
          color="#EF4444"
          onPress={() => router.push("/(tabs)/reports")}
        />
        <QuickActionButton
          icon="call"
          label="SOS"
          color="#F59E0B"
          onPress={() => {
            // Navigate to emergency contacts
            console.log("Emergency contacts");
          }}
        />
        <QuickActionButton
          icon="map"
          label="Map"
          color="#3B82F6"
          onPress={() => router.push("/(tabs)/map")}
        />
      </View>
    </Animated.View>
  );
};
