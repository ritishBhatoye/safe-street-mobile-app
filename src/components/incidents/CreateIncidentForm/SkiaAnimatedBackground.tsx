import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  Canvas,
  Circle,
  LinearGradient,
  vec,
  useSharedValueEffect,
  useValue,
  runTiming,
  Easing,
  Path,
  Skia,
  BlurMask,
} from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SkiaAnimatedBackgroundProps {
  currentStep: number;
}

export const SkiaAnimatedBackground: React.FC<SkiaAnimatedBackgroundProps> = ({
  currentStep,
}) => {
  // Animated values
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  
  // Skia values
  const skiaProgress = useValue(0);
  const skiaRotation = useValue(0);
  const skiaScale = useValue(1);

  // Sync React Native Reanimated with Skia
  useSharedValueEffect(() => {
    skiaProgress.current = progress.value;
  }, progress);

  useSharedValueEffect(() => {
    skiaRotation.current = rotation.value;
  }, rotation);

  useSharedValueEffect(() => {
    skiaScale.current = scale.value;
  }, scale);

  useEffect(() => {
    // Animate progress based on current step
    progress.value = withTiming((currentStep - 1) / 2, {
      duration: 800,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

    // Continuous rotation
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 20000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Breathing scale animation
    scale.value = withRepeat(
      withTiming(1.1, {
        duration: 3000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, [currentStep]);

  // Create animated path for flowing lines
  const createFlowPath = (progress: number, offset: number = 0) => {
    const path = Skia.Path.Make();
    const amplitude = 50;
    const frequency = 0.02;
    const phaseShift = offset * Math.PI;
    
    path.moveTo(0, SCREEN_HEIGHT / 2);
    
    for (let x = 0; x <= SCREEN_WIDTH; x += 5) {
      const y = SCREEN_HEIGHT / 2 + 
        amplitude * Math.sin(frequency * x + progress * Math.PI * 2 + phaseShift) +
        amplitude * 0.5 * Math.sin(frequency * x * 2 + progress * Math.PI * 4 + phaseShift);
      path.lineTo(x, y);
    }
    
    return path;
  };

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

  return (
    <Canvas style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: 'absolute' }}>
      {/* Background gradient */}
      <LinearGradient
        start={vec(0, 0)}
        end={vec(SCREEN_WIDTH, SCREEN_HEIGHT)}
        colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
      />

      {/* Animated flowing background shapes */}
      <Circle
        cx={SCREEN_WIDTH * 0.2}
        cy={SCREEN_HEIGHT * 0.3}
        r={60}
        opacity={0.1}
        transform={[
          { rotate: skiaRotation },
          { scale: skiaScale },
        ]}
      >
        <LinearGradient
          start={vec(0, 0)}
          end={vec(120, 120)}
          colors={[stepColors[0], stepColors[1]]}
        />
        <BlurMask blur={20} style="normal" />
      </Circle>

      <Circle
        cx={SCREEN_WIDTH * 0.8}
        cy={SCREEN_HEIGHT * 0.2}
        r={80}
        opacity={0.08}
        transform={[
          { rotate: -skiaRotation },
          { scale: skiaScale },
        ]}
      >
        <LinearGradient
          start={vec(0, 0)}
          end={vec(160, 160)}
          colors={[stepColors[1], stepColors[2]]}
        />
        <BlurMask blur={25} style="normal" />
      </Circle>

      <Circle
        cx={SCREEN_WIDTH * 0.6}
        cy={SCREEN_HEIGHT * 0.7}
        r={100}
        opacity={0.06}
        transform={[
          { rotate: skiaRotation * 0.5 },
          { scale: skiaScale },
        ]}
      >
        <LinearGradient
          start={vec(0, 0)}
          end={vec(200, 200)}
          colors={[stepColors[0], stepColors[2]]}
        />
        <BlurMask blur={30} style="normal" />
      </Circle>

      {/* Flowing animated lines */}
      <Path
        path={createFlowPath(skiaProgress.current, 0)}
        style="stroke"
        strokeWidth={2}
        opacity={0.15}
        color={stepColors[0]}
      >
        <BlurMask blur={3} style="normal" />
      </Path>

      <Path
        path={createFlowPath(skiaProgress.current, 1)}
        style="stroke"
        strokeWidth={1.5}
        opacity={0.1}
        color={stepColors[1]}
      >
        <BlurMask blur={2} style="normal" />
      </Path>

      <Path
        path={createFlowPath(skiaProgress.current, 2)}
        style="stroke"
        strokeWidth={1}
        opacity={0.08}
        color={stepColors[2]}
      >
        <BlurMask blur={4} style="normal" />
      </Path>

      {/* Progress indicator particles */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = (SCREEN_WIDTH / 20) * i;
        const baseY = SCREEN_HEIGHT * 0.9;
        const animatedY = baseY + 20 * Math.sin(skiaProgress.current * Math.PI * 2 + i * 0.5);
        const opacity = skiaProgress.current > i / 20 ? 0.3 : 0.1;
        
        return (
          <Circle
            key={i}
            cx={x}
            cy={animatedY}
            r={3}
            opacity={opacity}
            color={stepColors[0]}
          >
            <BlurMask blur={2} style="normal" />
          </Circle>
        );
      })}
    </Canvas>
  );
};