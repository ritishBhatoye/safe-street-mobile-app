import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  Canvas,
  Circle,
  LinearGradient,
  vec,
  useSharedValueEffect,
  useValue,
  Path,
  Skia,
  BlurMask,
  Group,
} from '@shopify/react-native-skia';
import { useSharedValue, withTiming, withSequence, Easing } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkiaStepTransitionProps {
  currentStep: number;
  totalSteps: number;
}

export const SkiaStepTransition: React.FC<SkiaStepTransitionProps> = ({
  currentStep,
  totalSteps,
}) => {
  // Animated values
  const progress = useSharedValue(0);
  const ripple = useSharedValue(0);
  
  // Skia values
  const skiaProgress = useValue(0);
  const skiaRipple = useValue(0);

  // Sync values
  useSharedValueEffect(() => {
    skiaProgress.current = progress.value;
  }, progress);

  useSharedValueEffect(() => {
    skiaRipple.current = ripple.value;
  }, ripple);

  useEffect(() => {
    // Animate progress
    progress.value = withTiming((currentStep - 1) / (totalSteps - 1), {
      duration: 600,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

    // Ripple effect on step change
    ripple.value = withSequence(
      withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) })
    );
  }, [currentStep]);

  // Create progress path
  const createProgressPath = () => {
    const path = Skia.Path.Make();
    const y = 30;
    const startX = 20;
    const endX = SCREEN_WIDTH - 20;
    const progressX = startX + (endX - startX) * skiaProgress.current;
    
    // Background line
    path.moveTo(startX, y);
    path.lineTo(endX, y);
    
    return path;
  };

  const createActiveProgressPath = () => {
    const path = Skia.Path.Make();
    const y = 30;
    const startX = 20;
    const endX = SCREEN_WIDTH - 20;
    const progressX = startX + (endX - startX) * skiaProgress.current;
    
    // Active progress line
    path.moveTo(startX, y);
    path.lineTo(progressX, y);
    
    return path;
  };

  // Step colors
  const stepColors = [
    ['#3B82F6', '#1D4ED8'], // Blue
    ['#F59E0B', '#D97706'], // Orange  
    ['#10B981', '#059669'], // Green
  ];

  const currentColors = stepColors[Math.min(currentStep - 1, stepColors.length - 1)];

  return (
    <Canvas style={{ width: SCREEN_WIDTH, height: 80 }}>
      {/* Background progress line */}
      <Path
        path={createProgressPath()}
        style="stroke"
        strokeWidth={4}
        color="#E5E7EB"
        strokeCap="round"
      />

      {/* Active progress line */}
      <Path
        path={createActiveProgressPath()}
        style="stroke"
        strokeWidth={4}
        strokeCap="round"
      >
        <LinearGradient
          start={vec(20, 30)}
          end={vec(SCREEN_WIDTH - 20, 30)}
          colors={currentColors}
        />
      </Path>

      {/* Step circles */}
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isCurrent = stepNumber === currentStep;
        const x = 20 + ((SCREEN_WIDTH - 40) / (totalSteps - 1)) * index;
        
        return (
          <Group key={stepNumber}>
            {/* Ripple effect for current step */}
            {isCurrent && (
              <Circle
                cx={x}
                cy={30}
                r={15 + skiaRipple.current * 10}
                opacity={0.3 - skiaRipple.current * 0.3}
                color={currentColors[0]}
              >
                <BlurMask blur={5} style="normal" />
              </Circle>
            )}
            
            {/* Main step circle */}
            <Circle
              cx={x}
              cy={30}
              r={12}
              color={isActive ? currentColors[0] : '#D1D5DB'}
            >
              {isActive && (
                <LinearGradient
                  start={vec(x - 12, 30 - 12)}
                  end={vec(x + 12, 30 + 12)}
                  colors={currentColors}
                />
              )}
            </Circle>

            {/* Inner circle for completed steps */}
            {isActive && (
              <Circle
                cx={x}
                cy={30}
                r={6}
                color="white"
                opacity={0.9}
              />
            )}

            {/* Glow effect for current step */}
            {isCurrent && (
              <Circle
                cx={x}
                cy={30}
                r={20}
                opacity={0.2}
                color={currentColors[0]}
              >
                <BlurMask blur={8} style="normal" />
              </Circle>
            )}
          </Group>
        );
      })}

      {/* Floating particles around current step */}
      {Array.from({ length: 8 }, (_, i) => {
        const currentStepX = 20 + ((SCREEN_WIDTH - 40) / (totalSteps - 1)) * (currentStep - 1);
        const angle = (i / 8) * Math.PI * 2 + skiaProgress.current * Math.PI * 2;
        const radius = 25 + Math.sin(skiaProgress.current * Math.PI * 4) * 5;
        const x = currentStepX + Math.cos(angle) * radius;
        const y = 30 + Math.sin(angle) * radius;
        
        return (
          <Circle
            key={i}
            cx={x}
            cy={y}
            r={2}
            opacity={0.6}
            color={currentColors[1]}
          >
            <BlurMask blur={1} style="normal" />
          </Circle>
        );
      })}
    </Canvas>
  );
};