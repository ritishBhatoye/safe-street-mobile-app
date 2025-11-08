import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Card } from "../atoms/Card";
import { Badge } from "../atoms/Badge";

interface HeroSafetySnapshotProps {
  safetyScore: SafetyScoreType;
}

export const HeroSafetySnapshot: React.FC<HeroSafetySnapshotProps> = ({ safetyScore }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 15 });
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getScoreColor = () => {
    if (safetyScore.score >= 7) return "#22C55E";
    if (safetyScore.score >= 4) return "#F59E0B";
    return "#EF4444";
  };

  const getScoreBgColor = () => {
    if (safetyScore.score >= 7) return "bg-success-50 dark:bg-success-900/20";
    if (safetyScore.score >= 4) return "bg-warning-50 dark:bg-warning-900/20";
    return "bg-danger-50 dark:bg-danger-900/20";
  };

  const getBadgeVariant = (): "success" | "warning" | "danger" => {
    if (safetyScore.score >= 7) return "success";
    if (safetyScore.score >= 4) return "warning";
    return "danger";
  };

  const getBadgeLabel = () => {
    if (safetyScore.score >= 7) return "Safe";
    if (safetyScore.score >= 4) return "Moderate";
    return "Caution";
  };

  const getTrendIcon = () => {
    switch (safetyScore.trend) {
      case "up":
        return "trending-up";
      case "down":
        return "trending-down";
      default:
        return "remove";
    }
  };

  return (
    <Animated.View style={animatedStyle}>
      <Card variant="elevated" className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <View className="items-center py-4">
          {/* Score Circle */}
          <View className={`mb-4 h-36 w-36 items-center justify-center rounded-full ${getScoreBgColor()}`}>
            <Text
              className="text-5xl font-dm-sans-bold mb-1"
              style={{ color: getScoreColor() }}
            >
              {safetyScore.score}
            </Text>
            <Text className="text-sm font-dm-sans-medium text-gray-600 dark:text-gray-400">
              Safety Score
            </Text>
          </View>

          {/* Badge */}
          <View className="mb-3">
            <Badge label={getBadgeLabel()} variant={getBadgeVariant()} size="large" />
          </View>

          {/* Location */}
          <View className="flex-row items-center gap-1 mb-2">
            <Ionicons name="location" size={16} color="#6B7280" />
            <Text className="text-base font-dm-sans-medium text-gray-700 dark:text-gray-300">
              {safetyScore.location}
            </Text>
          </View>

          {/* Trend */}
          <View className="flex-row items-center gap-1">
            <Ionicons name={getTrendIcon()} size={16} color={getScoreColor()} />
            <Text className="text-sm font-dm-sans text-gray-500 dark:text-gray-400">
              {safetyScore.trend === "up"
                ? "Improving"
                : safetyScore.trend === "down"
                  ? "Declining"
                  : "Stable"}
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};
