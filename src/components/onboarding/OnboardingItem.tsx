import { useEffect, useRef } from "react";
import { View, Animated, type Animated as AnimatedType } from "react-native";
import { Text } from "react-native";
import type { OnBoardingType } from "@/data/onboardingData";

interface OnboardingItemProps {
  item: OnBoardingType;
  width: number;
  scrollX: AnimatedType.Value;
  index: number;
}

export const OnboardingItem = ({
  item,
  width,
  scrollX,
  index,
}: OnboardingItemProps) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  // Floating animations for decorative circles
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -15,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -10,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim3, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim3, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [floatAnim1, floatAnim2, floatAnim3]);

  // Scale animation for icon
  const iconScale = scrollX.interpolate({
    inputRange,
    outputRange: [0.7, 1, 0.7],
    extrapolate: "clamp",
  });

  // Opacity animation
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.3, 1, 0.3],
    extrapolate: "clamp",
  });

  // Translate Y animation for text
  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [50, 0, -50],
    extrapolate: "clamp",
  });

  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-8 gap-6">
      {/* Icon Container with decorative circles */}
      <Animated.View
        style={{
          transform: [{ scale: iconScale }],
          opacity,
        }}
        className="mb-12 items-center justify-center"
      >
        {/* Floating decorative background circles */}
        <Animated.View
          style={{
            transform: [{ translateY: floatAnim1 }],
          }}
          className="absolute h-64 w-64 rounded-full bg-white/10"
        />
        <Animated.View
          style={{
            transform: [{ translateY: floatAnim2 }],
          }}
          className="absolute h-48 w-48 rounded-full bg-white/20"
        />
        <Animated.View
          style={{
            transform: [{ translateY: floatAnim3 }],
          }}
          className="absolute h-32 w-32 rounded-full bg-white/30"
        />

        {/* Icon */}
        <Text style={{ fontSize: 100 }}>{item.icon}</Text>

        {/* Floating Action Labels and Avatars - Alternating positions */}
        {index % 2 === 0 ? (
          <>
            {/* Left-Top Label */}
            <Animated.View
              style={{
                transform: [{ translateY: floatAnim2 }],
              }}
              className="absolute -left-24 -top-16"
            >
              <View className="rounded-full bg-white px-4 py-2 shadow-lg">
                <Text
                  style={{ color: item.accentColor }}
                  className="font-dm-sans-semibold text-sm"
                >
                  {item.actionLabels[0]}
                </Text>
              </View>
            </Animated.View>

            {/* Left Avatar */}
            <Animated.View
              style={{
                transform: [{ translateY: floatAnim1 }],
              }}
              className="absolute -left-32 top-8"
            >
              <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-400 shadow-md">
                <Text className="text-2xl">👤</Text>
              </View>
            </Animated.View>

            {/* Right-Bottom Label */}
            <Animated.View
              style={{
                transform: [{ translateY: floatAnim3 }],
              }}
              className="absolute -bottom-16 -right-20"
            >
              <View className="rounded-full bg-white px-4 py-2 shadow-lg">
                <Text
                  style={{ color: item.accentColor }}
                  className="font-dm-sans-semibold text-sm"
                >
                  {item.actionLabels[1]}
                </Text>
              </View>
            </Animated.View>

            {/* Right Avatar */}
            <Animated.View
              style={{
                transform: [{ translateY: floatAnim2 }],
              }}
              className="absolute -right-28 bottom-4"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-cyan-400 shadow-md">
                <Text className="text-xl">✨</Text>
              </View>
            </Animated.View>
          </>
        ) : (
          <>
            {/* Top-Right Label */}
            <Animated.View
              style={{
                transform: [{ translateY: floatAnim2 }],
              }}
              className="absolute -right-24 -top-16"
            >
              <View className="rounded-full bg-white px-4 py-2 shadow-lg">
                <Text
                  style={{ color: item.accentColor }}
                  className="font-dm-sans-semibold text-sm"
                >
                  {item.actionLabels[0]}
                </Text>
              </View>
            </Animated.View>

            {/* Right Avatar */}
            <Animated.View
              style={{
                transform: [{ translateY: floatAnim1 }],
              }}
              className="absolute -right-32 top-8"
            >
              <View className="h-12 w-12 items-center justify-center rounded-full bg-orange-400 shadow-md">
                <Text className="text-2xl">🎯</Text>
              </View>
            </Animated.View>

            {/* Bottom-Left Label */}
            <Animated.View
              style={{
                transform: [{ translateY: floatAnim3 }],
              }}
              className="absolute -bottom-16 -left-20"
            >
              <View className="rounded-full bg-white px-4 py-2 shadow-lg">
                <Text
                  style={{ color: item.accentColor }}
                  className="font-dm-sans-semibold text-sm"
                >
                  {item.actionLabels[1]}
                </Text>
              </View>
            </Animated.View>

            {/* Left Avatar */}
            <Animated.View
              style={{
                transform: [{ translateY: floatAnim2 }],
              }}
              className="absolute -left-28 bottom-4"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-400 shadow-md">
                <Text className="text-xl">💡</Text>
              </View>
            </Animated.View>
          </>
        )}
      </Animated.View>

      {/* Text Content with floating effect */}
      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
        }}
        className="w-full items-center gap-4 mt-5"
      >
        {/* Title with bubble background */}
        <View className="mb-4 rounded-3xl bg-white/10 px-6 py-3 backdrop-blur-sm">
          <Text className="font-dm-sans-bold text-center text-3xl text-white">
            {item.title}
          </Text>
        </View>

        {/* Subtitle */}
        <Text className="font-dm-sans text-center text-lg leading-7 text-white/90">
          {item.subtitle}
        </Text>
      </Animated.View>
    </View>
  );
};
