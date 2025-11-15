import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Submitting your report...',
}) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Rotation animation
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );

      // Scale pulse animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );

      // Progress simulation
      progress.value = withTiming(1, { duration: 3000, easing: Easing.out(Easing.quad) });
    } else {
      rotation.value = 0;
      scale.value = 1;
      progress.value = 0;
    }
  }, [visible, rotation, scale, progress]);

  const spinnerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    const width = interpolate(progress.value, [0, 1], [0, SCREEN_WIDTH - 80]);
    return { width };
  });

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      className="absolute inset-0 z-50"
    >
      {/* Backdrop */}
      <BlurView intensity={20} tint="dark" className="flex-1">
        <View className="flex-1 bg-black/30 items-center justify-center">
          
          {/* Loading Card */}
          <View className="bg-white dark:bg-gray-800 rounded-3xl p-8 mx-8 items-center shadow-2xl">
            
            {/* Animated Spinner */}
            <Animated.View style={spinnerStyle} className="mb-6">
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8', '#1E40AF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-16 h-16 rounded-full items-center justify-center"
              >
                <View className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full items-center justify-center">
                  <View className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Loading Text */}
            <Text className="text-black dark:text-white font-dm-sans-bold text-lg mb-2 text-center">
              Submitting Report
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-sm text-center mb-6">
              {message}
            </Text>

            {/* Progress Bar */}
            <View className="w-full">
              <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <Animated.View style={progressStyle}>
                  <LinearGradient
                    colors={['#3B82F6', '#1D4ED8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="h-full"
                  />
                </Animated.View>
              </View>
              
              {/* Progress Text */}
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-500 dark:text-gray-400 font-dm-sans text-xs">
                  Processing...
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 font-dm-sans text-xs">
                  Please wait
                </Text>
              </View>
            </View>

            {/* Safety Message */}
            <View className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
              <Text className="text-blue-700 dark:text-blue-300 font-dm-sans text-xs text-center">
                🛡️ Your report helps keep the community safe
              </Text>
            </View>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
};