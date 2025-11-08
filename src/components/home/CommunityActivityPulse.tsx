import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Card } from "../atoms/Card";

interface CommunityActivityPulseProps {
  activity: CommunityActivityType;
}

export const CommunityActivityPulse: React.FC<CommunityActivityPulseProps> = ({ activity }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(600, withSpring(1));
    translateY.value = withDelay(600, withSpring(0));

    // Pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Card variant="elevated" className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
        <View className="flex-row items-center">
          <Animated.View style={pulseStyle} className="mr-4">
            <View className="w-12 h-12 rounded-full bg-primary-500 items-center justify-center">
              <Ionicons name="pulse" size={24} color="white" />
            </View>
          </Animated.View>

          <View className="flex-1">
            <Text className="text-base font-dm-sans-bold text-gray-900 dark:text-white mb-2">
              Community Activity Pulse
            </Text>
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-1">
                <Ionicons name="document-text" size={16} color="#3399FF" />
                <Text className="text-sm font-dm-sans-semibold text-primary-600 dark:text-primary-400">
                  {activity.new_reports_24h}
                </Text>
                <Text className="text-xs font-dm-sans text-gray-600 dark:text-gray-400">
                  reports
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                <Text className="text-sm font-dm-sans-semibold text-success-600 dark:text-success-400">
                  {activity.confirmations_24h}
                </Text>
                <Text className="text-xs font-dm-sans text-gray-600 dark:text-gray-400">
                  confirms
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};
