import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface ShimmerEffectProps {
  children: React.ReactNode;
  duration?: number;
}

export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({ 
  children, 
  duration = 1500 
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue, duration]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
};
