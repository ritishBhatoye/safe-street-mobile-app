import { Animated, View, type Animated as AnimatedType } from 'react-native';
import type { OnBoardingType } from '@/data/onboardingData';

interface PaginationProps {
  data: OnBoardingType[];
  scrollX: AnimatedType.Value;
  width: number;
}

export const Pagination = ({ data, scrollX, width }: PaginationProps) => (
  <View className="mb-6 flex-row gap-2">
    {data.map((_, index) => {
      const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ];

      const dotWidth = scrollX.interpolate({
        inputRange,
        outputRange: [8, 24, 8],
        extrapolate: 'clamp',
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.4, 1, 0.4],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View
          key={index}
          style={{ width: dotWidth, opacity }}
          className="h-2 rounded-full bg-white"
        />
      );
    })}
  </View>
);
