import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

interface AnimatedProfileHeaderProps {
  avatarUrl?: string;
  name: string;
  scrollY: SharedValue<number>;
  onAvatarPress: () => void;
}

export const AnimatedProfileHeader: React.FC<AnimatedProfileHeaderProps> = ({
  avatarUrl,
  name,
  scrollY,
  onAvatarPress,
}) => {
  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [100, 150], [0, 1], Extrapolate.CLAMP);

    return {
      opacity,
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [100, 150], [20, 0], Extrapolate.CLAMP);

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={headerStyle}>
      <LinearGradient
        colors={["#3B82F6", "#8B5CF6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <SafeAreaView edges={["top"]}>
          <Animated.View
            style={contentStyle}
            className="h-14 flex-row items-center px-4 justify-between"
          >
            <View className="flex-row items-center flex-1">
              <Pressable onPress={onAvatarPress} className="active:opacity-70">
                <View className="w-10 h-10 rounded-full bg-white p-0.5 shadow-lg mr-3">
                  {avatarUrl ? (
                    <Image
                      source={{ uri: avatarUrl }}
                      className="w-full h-full rounded-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full rounded-full bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center">
                      <Ionicons name="person" size={20} color="#8B5CF6" />
                    </View>
                  )}
                </View>
              </Pressable>
              <Text
                className="text-white font-dm-sans-bold text-lg flex-1"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name}
              </Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );
};
