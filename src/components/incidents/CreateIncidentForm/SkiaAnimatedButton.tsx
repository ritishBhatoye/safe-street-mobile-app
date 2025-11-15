import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Canvas,
  RoundedRect,
  LinearGradient,
  vec,
  useSharedValueEffect,
  useValue,
  BlurMask,
  Circle,
} from '@shopify/react-native-skia';
import { useSharedValue, withTiming, withRepeat, Easing } from 'react-native-reanimated';

interface SkiaAnimatedButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'success';
  icon?: string;
  width?: number;
  height?: number;
}

export const SkiaAnimatedButton: React.FC<SkiaAnimatedButtonProps> = ({
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
  const progress = useSharedValue(0);
  const shimmer = useSharedValue(0);
  const pulse = useSharedValue(1);
  
  // Skia values
  const skiaProgress = useValue(0);
  const skiaShimmer = useValue(0);
  const skiaPulse = useValue(1);

  // Sync values
  useSharedValueEffect(() => {
    skiaProgress.current = progress.value;
  }, progress);

  useSharedValueEffect(() => {
    skiaShimmer.current = shimmer.value;
  }, shimmer);

  useSharedValueEffect(() => {
    skiaPulse.current = pulse.value;
  }, pulse);

  useEffect(() => {
    if (loading) {
      progress.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
      
      shimmer.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      progress.value = withTiming(0, { duration: 300 });
      shimmer.value = withTiming(0, { duration: 300 });
    }

    if (!disabled && !loading) {
      pulse.value = withRepeat(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
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

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={{ width, height }}
    >
      <Canvas style={{ width, height, position: 'absolute' }}>
        {/* Main button background */}
        <RoundedRect
          x={0}
          y={0}
          width={width}
          height={height}
          r={height / 2}
          transform={[{ scale: skiaPulse }]}
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, height)}
            colors={colors}
          />
        </RoundedRect>

        {/* Loading shimmer effect */}
        {loading && (
          <RoundedRect
            x={-width + skiaShimmer.current * width * 2}
            y={0}
            width={width}
            height={height}
            r={height / 2}
            opacity={0.3}
            color="white"
          >
            <BlurMask blur={10} style="normal" />
          </RoundedRect>
        )}

        {/* Glow effect */}
        {!disabled && (
          <RoundedRect
            x={-2}
            y={-2}
            width={width + 4}
            height={height + 4}
            r={(height + 4) / 2}
            opacity={0.3}
            color={colors[0]}
          >
            <BlurMask blur={8} style="normal" />
          </RoundedRect>
        )}

        {/* Loading spinner dots */}
        {loading && (
          <>
            {Array.from({ length: 3 }, (_, i) => {
              const x = width / 2 - 15 + i * 15;
              const y = height / 2;
              const delay = i * 0.2;
              const animatedY = y + Math.sin(skiaProgress.current * Math.PI * 2 + delay * Math.PI * 2) * 3;
              
              return (
                <Circle
                  key={i}
                  cx={x}
                  cy={animatedY}
                  r={3}
                  color="white"
                  opacity={0.8}
                />
              );
            })}
          </>
        )}
      </Canvas>

      {/* Button content */}
      <View className="flex-1 flex-row items-center justify-center">
        {!loading && icon && (
          <Ionicons 
            name={icon as any} 
            size={20} 
            color="white" 
            style={{ marginRight: 8 }}
          />
        )}
        {!loading && (
          <Text className="text-white font-dm-sans-bold text-base">
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};