import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ReanimatedBackgroundProps {
  currentStep: number;
}

export const ReanimatedBackground: React.FC<ReanimatedBackgroundProps> = ({
  currentStep,
}) => {
  // Animated values
  const progress = useSharedValue(0);
  const rotation1 = useSharedValue(0);
  const rotation2 = useSharedValue(0);
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    // Update progress based on current step
    progress.value = withTiming((currentStep - 1) / 2, {
      duration: 800,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

    // Continuous rotations
    rotation1.value = withRepeat(
      withTiming(360, {
        duration: 20000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    rotation2.value = withRepeat(
      withTiming(-360, {
        duration: 15000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Breathing scale animations
    scale1.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    scale2.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.1, { duration: 4000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Opacity pulse
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [currentStep]);

  // Step-based color schemes
  const getStepColors = (step: number) => {
    switch (step) {
      case 1:
        return ['#3B82F6', '#1D4ED8', '#1E40AF']; // Blue theme
      case 2:
        return ['#F59E0B', '#D97706', '#B45309']; // Orange theme
      case 3:
        return ['#10B981', '#059669', '#047857']; // Green theme
      default:
        return ['#6B7280', '#4B5563', '#374151']; // Gray theme
    }
  };

  const stepColors = getStepColors(currentStep);

  // Animated styles for floating circles
  const circle1Style = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.5, 1],
      [stepColors[0], stepColors[1], stepColors[2]]
    );

    return {
      transform: [
        { rotate: `${rotation1.value}deg` },
        { scale: scale1.value },
      ],
      backgroundColor,
      opacity: opacity.value * 0.15,
    };
  });

  const circle2Style = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.5, 1],
      [stepColors[1], stepColors[2], stepColors[0]]
    );

    return {
      transform: [
        { rotate: `${rotation2.value}deg` },
        { scale: scale2.value },
      ],
      backgroundColor,
      opacity: opacity.value * 0.12,
    };
  });

  const circle3Style = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.5, 1],
      [stepColors[2], stepColors[0], stepColors[1]]
    );

    return {
      transform: [
        { rotate: `${rotation1.value * 0.5}deg` },
        { scale: interpolate(scale1.value, [0.8, 1.2], [1.1, 0.9]) },
      ],
      backgroundColor,
      opacity: opacity.value * 0.08,
    };
  });

  // Progress particles animation
  const particlesStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [20, -20]
          ),
        },
      ],
      opacity: interpolate(progress.value, [0, 0.5, 1], [0.3, 0.6, 0.9]),
    };
  });

  return (
    <Animated.View style={StyleSheet.absoluteFillObject}>
      {/* Base gradient background */}
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Floating animated circles */}
      <Animated.View
        style={[
          styles.circle,
          {
            width: 120,
            height: 120,
            top: SCREEN_HEIGHT * 0.2,
            left: SCREEN_WIDTH * 0.1,
          },
          circle1Style,
        ]}
      />

      <Animated.View
        style={[
          styles.circle,
          {
            width: 160,
            height: 160,
            top: SCREEN_HEIGHT * 0.15,
            right: SCREEN_WIDTH * 0.1,
          },
          circle2Style,
        ]}
      />

      <Animated.View
        style={[
          styles.circle,
          {
            width: 200,
            height: 200,
            bottom: SCREEN_HEIGHT * 0.2,
            left: SCREEN_WIDTH * 0.3,
          },
          circle3Style,
        ]}
      />

      {/* Progress particles */}
      <Animated.View style={[styles.particlesContainer, particlesStyle]}>
        {Array.from({ length: 15 }, (_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: (SCREEN_WIDTH / 15) * i,
                backgroundColor: stepColors[0],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Subtle overlay gradient */}
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.1)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  particlesContainer: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.1,
    left: 0,
    right: 0,
    height: 20,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
});