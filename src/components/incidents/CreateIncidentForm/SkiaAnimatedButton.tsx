import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Canvas,
  RoundedRect,
  LinearGradient,
  vec,
  BlurMask,
  Circle,
} from '@shopify/react-native-skia';

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
  const [shimmer, setShimmer] = React.useState(0);
  const [pulse, setPulse] = React.useState(1);

  useEffect(() => {
    if (loading) {
      const animateShimmer = () => {
        setShimmer(prev => (prev + 0.02) % 1);
        requestAnimationFrame(animateShimmer);
      };
      const shimmerId = requestAnimationFrame(animateShimmer);
      return () => cancelAnimationFrame(shimmerId);
    }
  }, [loading]);

  useEffect(() => {
    if (!disabled && !loading) {
      const animatePulse = () => {
        setPulse(1 + 0.05 * Math.sin(Date.now() / 2000));
        requestAnimationFrame(animatePulse);
      };
      const pulseId = requestAnimationFrame(animatePulse);
      return () => cancelAnimationFrame(pulseId);
    }
  }, [disabled, loading]);

  const getColors = () => {
    if (disabled) return ['#9CA3AF', '#6B7280'];
    
    switch (variant) {
      case 'primary': return ['#3B82F6', '#1D4ED8'];
      case 'secondary': return ['#6B7280', '#4B5563'];
      case 'success': return ['#10B981', '#059669'];
      default: return ['#3B82F6', '#1D4ED8'];
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
          transform={[{ scale: pulse }]}
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
            x={-width + shimmer * width * 2}
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
            opacity={0.2}
            color={colors[0]}
          >
            <BlurMask blur={8} style="normal" />
          </RoundedRect>
        )}

        {/* Loading dots */}
        {loading && (
          <>
            {Array.from({ length: 3 }, (_, i) => {
              const x = width / 2 - 15 + i * 15;
              const y = height / 2 + Math.sin(Date.now() / 300 + i * 0.5) * 3;
              
              return (
                <Circle
                  key={i}
                  cx={x}
                  cy={y}
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