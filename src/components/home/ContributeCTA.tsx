import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withDelay } from "react-native-reanimated";
import { Card } from "../atoms/Card";

export const ContributeCTA: React.FC = () => {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(900, withSpring(1));
    translateY.value = withDelay(900, withSpring(0));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={() => router.push("/(tabs)/reports")}>
        <Card variant="elevated" className="bg-gradient-to-r from-primary-500 to-secondary-500">
          <View className="flex-row items-center">
            <View className="flex-1 pr-4">
              <Text className="text-xl font-dm-sans-bold text-white mb-2">
                Make Your Community Safer
              </Text>
              <Text className="text-sm font-dm-sans text-white/90 mb-3">
                Report incidents and help others stay informed
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-dm-sans-semibold text-white">
                  Report Now
                </Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </View>
            </View>
            <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center">
              <Ionicons name="add-circle" size={40} color="white" />
            </View>
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
};
