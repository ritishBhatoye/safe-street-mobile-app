import { View, Animated, type Animated as AnimatedType } from 'react-native';
import { Text } from 'react-native';
import type { OnBoardingType } from '@/data/onboardingData';

interface OnboardingItemProps {
  item: OnBoardingType;
  width: number;
  scrollX: AnimatedType.Value;
  index: number;
}

export const OnboardingItem = ({ item, width, scrollX, index }: OnboardingItemProps) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  // Scale animation for icon
  const iconScale = scrollX.interpolate({
    inputRange,
    outputRange: [0.7, 1, 0.7],
    extrapolate: 'clamp',
  });

  // Opacity animation
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.3, 1, 0.3],
    extrapolate: 'clamp',
  });

  // Translate Y animation for text
  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [50, 0, -50],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={{ width }}
      className="flex-1 items-center justify-center px-8"
    >
      {/* Icon Container with decorative circles */}
      <Animated.View
        style={{
          transform: [{ scale: iconScale }],
          opacity,
        }}
        className="mb-12 items-center justify-center"
      >
        {/* Decorative background circles */}
        <View className="absolute h-64 w-64 rounded-full bg-white/10" />
        <View className="absolute h-48 w-48 rounded-full bg-white/20" />
        <View className="absolute h-32 w-32 rounded-full bg-white/30" />
        
        {/* Icon */}
        <Text style={{ fontSize: 100 }}>{item.icon}</Text>
      </Animated.View>

      {/* Text Content */}
      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
        }}
        className="w-full items-center"
      >
        <Text className="mb-4 text-center text-3xl font-bold text-white">
          {item.title}
        </Text>
        <Text className="text-center text-lg leading-7 text-white/90">
          {item.subtitle}
        </Text>
      </Animated.View>
    </View>
  );
};
