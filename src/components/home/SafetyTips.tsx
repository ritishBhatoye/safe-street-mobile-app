import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { Card } from "../atoms/Card";

const SAFETY_TIPS = [
  { icon: "eye", text: "Stay aware of your surroundings at all times" },
  { icon: "people", text: "Walk in well-lit areas with other people" },
  { icon: "call", text: "Keep emergency contacts readily accessible" },
  { icon: "location", text: "Share your location with trusted contacts" },
  { icon: "time", text: "Avoid isolated areas during late hours" },
  { icon: "shield-checkmark", text: "Trust your instincts if something feels wrong" },
  { icon: "car", text: "Park in well-lit, visible areas" },
  { icon: "home", text: "Lock doors and windows when leaving" },
  { icon: "flashlight", text: "Carry a flashlight or use your phone's light" },
  { icon: "notifications", text: "Stay updated on local safety alerts" },
];

export const SafetyTips: React.FC = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const tipOpacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(1000, withSpring(1));
    translateY.value = withDelay(1000, withSpring(0));
  }, [opacity, translateY]);

  useEffect(() => {
    const interval = setInterval(() => {
      tipOpacity.value = withSequence(
        withTiming(0, { duration: 300 }),
        withTiming(1, { duration: 300 })
      );

      setTimeout(() => {
        setCurrentTipIndex((prev) => (prev + 1) % SAFETY_TIPS.length);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, [tipOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const tipAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tipOpacity.value,
  }));

  const currentTip = SAFETY_TIPS[currentTipIndex];

  return (
    <Animated.View style={animatedStyle}>
      <View className="mb-3">
        <Text className="text-lg font-dm-sans-bold text-gray-900 dark:text-white mb-1">
          SafeStreet Tips
        </Text>
        <Text className="text-sm font-dm-sans text-gray-500 dark:text-gray-400">
          Stay safe with these reminders
        </Text>
      </View>

      <Card variant="elevated" className="bg-gradient-to-r from-accent-50 to-warning-50 dark:from-accent-900/20 dark:to-warning-900/20">
        <Animated.View style={tipAnimatedStyle} className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-accent-500 items-center justify-center mr-4">
            <Ionicons name={currentTip.icon as any} size={24} color="white" />
          </View>
          <Text className="flex-1 text-base font-dm-sans-medium text-gray-900 dark:text-white">
            {currentTip.text}
          </Text>
        </Animated.View>

        {/* Progress indicator */}
        <View className="flex-row gap-1 mt-4">
          {SAFETY_TIPS.map((_, index) => (
            <View
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index === currentTipIndex
                  ? "bg-accent-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </View>
      </Card>
    </Animated.View>
  );
};
