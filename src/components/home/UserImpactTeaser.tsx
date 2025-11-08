import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withDelay } from "react-native-reanimated";
import { Card } from "../atoms/Card";
import { supabase } from "@/lib/supabase";

interface UserStats {
  reports_submitted: number;
  community_impact: number;
}

export const UserImpactTeaser: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>({ reports_submitted: 0, community_impact: 0 });
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(1100, withSpring(1));
    translateY.value = withDelay(1100, withSpring(0));
    fetchUserStats();
  }, [opacity, translateY]);

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("reports_submitted, community_impact")
        .eq("id", user.id)
        .single();

      if (profile) {
        setStats({
          reports_submitted: profile.reports_submitted || 0,
          community_impact: profile.community_impact || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={() => router.push("/(tabs)/profile")}>
        <Card variant="elevated" className="bg-gradient-to-r from-tertiary-50 to-primary-50 dark:from-tertiary-900/20 dark:to-primary-900/20">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-base font-dm-sans-bold text-gray-900 dark:text-white mb-3">
                Your Impact
              </Text>
              <View className="flex-row items-center gap-6">
                <View>
                  <Text className="text-2xl font-dm-sans-bold text-tertiary-600 dark:text-tertiary-400">
                    {stats.reports_submitted}
                  </Text>
                  <Text className="text-xs font-dm-sans text-gray-600 dark:text-gray-400">
                    Reports
                  </Text>
                </View>
                <View>
                  <Text className="text-2xl font-dm-sans-bold text-primary-600 dark:text-primary-400">
                    {stats.community_impact}
                  </Text>
                  <Text className="text-xs font-dm-sans text-gray-600 dark:text-gray-400">
                    Impact Score
                  </Text>
                </View>
              </View>
            </View>
            <View className="items-center">
              <View className="w-14 h-14 rounded-full bg-tertiary-500 items-center justify-center mb-2">
                <Ionicons name="trophy" size={28} color="white" />
              </View>
              <Text className="text-xs font-dm-sans-medium text-tertiary-600 dark:text-tertiary-400">
                View Profile
              </Text>
            </View>
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
};
