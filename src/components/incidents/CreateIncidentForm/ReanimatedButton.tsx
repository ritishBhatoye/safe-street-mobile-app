import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface ReanimatedButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'success';
  icon?: string;
  width?: number;
  height?: number;
}

export const ReanimatedButton: React.FC<ReanimatedButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  icon,
  width = 200,
  height = 50,
}) => {
  // Animated values
  const shimmer = useSharedValue(0);
  const pulse = useSharedValue(1);
  const pressScale = useSharedValue(1);
  const loadingDots = useSharedValue(0);

  useEffect(() => {
    if (loading) {
      // Shimmer effect
      shimmer.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.linear }),
        -1,
        false
      );

      // Loading dots animation
      loadingDots.value = withRepeat(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        -1,
        false
      );
    } else {
      shimmer.value = withTiming(0, { duration: 300 });
      loadingDots.value = withTiming(0, { duration: 300 });
    }

    if (!disabled && !loading) {
      // Gentle pulse animation
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    } else {
      pulse.value = withTiming(1, { duration: 300 });
    }
  }, [loading, disabled]);

  // Color schemes
  const getColors = () => {
    if (disabled) {
      return ['#9CA3AF', '#6B7280'];
    }
    
    switch (variant) {
      case 'primary':
        return ['#3B82F6', '#1D4ED8'];
      case 'secondary':
        return ['#6B7280', '#4B5563'];
      case 'success':
        return ['#10B981', '#059669'];
      default:
        return ['#3B82F6', '#1D4ED8'];
    }
  };

  const colors = getColors();

  // Handle press with animation
  const handlePress = () => {
    if (disabled || loading) return;

    pressScale.value = withSequence(
      withTiming(0.95, { duration: 100, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 100, easing: Easing.out(Easing.quad) })
    );

    // Call onPress after animation starts
    setTimeout(() => {
      runOnJS(onPress)();
    }, 50);
  };

  // Button container animated style
  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: pressScale.value * pulse.value },
      ],
      shadowOpacity: disabled ? 0 : interpolate(pulse.value, [1, 1.02], [0.2, 0.4]),
    };
  });

  // Shimmer overlay animated style
  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmer.value,
      [0, 1],
      [-width, width * 2]
    );

    return {
      transform: [{ translateX }],
      opacity: loading ? 0.3 : 0,
    };
  });

  // Loading dots animated styles
  const dot1Style = useAnimatedStyle(() => {
    const translateY = interpolate(
      loadingDots.value,
      [0, 0.33, 0.66, 1],
      [0, -8, 0, 0]
    );
    return { transform: [{ translateY }] };
  });

  const dot2Style = useAnimatedStyle(() => {
    const translateY = interpolate(
      loadingDots.value,
      [0, 0.33, 0.66, 1],
      [0, 0, -8, 0]
    );
    return { transform: [{ translateY }] };
  });

  const dot3Style = useAnimatedStyle(() => {
    const translateY = interpolate(
      loadingDots.value,
      [0, 0.33, 0.66, 1],
      [0, 0, 0, -8]
    );
    return { transform: [{ translateY }] };
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          {
            width,
            height,
            borderRadius: height / 2,
            overflow: 'hidden',
            shadowColor: colors[0],
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 12,
            elevation: 8,
          },
          buttonStyle,
        ]}
      >
        {/* Background Gradient */}
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Shimmer Overlay */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'white',
              },
              shimmerStyle,
            ]}
          />

          {/* Button Content */}
          <View className="flex-row items-center justify-center">
            {loading ? (
              // Loading Dots
              <View className="flex-row items-center space-x-2">
                <Animated.View
                  style={[
                    { width: 6, height: 6, borderRadius: 3, backgroundColor: 'white' },
                    dot1Style,
                  ]}
                />
                <Animated.View
                  style={[
                    { width: 6, height: 6, borderRadius: 3, backgroundColor: 'white', marginHorizontal: 4 },
                    dot2Style,
                  ]}
                />
                <Animated.View
                  style={[
                    { width: 6, height: 6, borderRadius: 3, backgroundColor: 'white' },
                    dot3Style,
                  ]}
                />
              </View>
            ) : (
              <>
                {icon && (
                  <Ionicons 
                    name={icon as any} 
                    size={20} 
                    color="white" 
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text className="text-white font-dm-sans-bold text-base">
                  {title}
                </Text>
              </>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};