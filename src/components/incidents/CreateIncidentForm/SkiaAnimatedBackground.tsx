import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  Canvas,
  Circle,
  LinearGradient,
  vec,
  BlurMask,
} from '@shopify/react-native-skia';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SkiaAnimatedBackgroundProps {
  currentStep: number;
}

export const SkiaAnimatedBackground: React.FC<SkiaAnimatedBackgroundProps> = ({
  currentStep,
}) => {
  const [progress, setProgress] = React.useState(0);
  const [scale, setScale] = React.useState(1);

  useEffect(() => {
    setProgress((currentStep - 1) / 2);
    
    const animate = () => {
      setScale(1 + 0.05 * Math.sin(Date.now() / 2000));
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [currentStep]);

  const getStepColors = (step: number) => {
    switch (step) {
      case 1: return ['#3B82F6', '#1D4ED8'];
      case 2: return ['#F59E0B', '#D97706'];
      case 3: return ['#10B981', '#059669'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  const stepColors = getStepColors(currentStep);

  return (
    <Canvas style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: 'absolute' }}>
      <LinearGradient
        start={vec(0, 0)}
        end={vec(SCREEN_WIDTH, SCREEN_HEIGHT)}
        colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
      />

      <Circle
        cx={SCREEN_WIDTH * 0.2}
        cy={SCREEN_HEIGHT * 0.3}
        r={50 * scale}
        opacity={0.08}
      >
        <LinearGradient
          start={vec(0, 0)}
          end={vec(100, 100)}
          colors={stepColors}
        />
        <BlurMask blur={15} style="normal" />
      </Circle>

      <Circle
        cx={SCREEN_WIDTH * 0.8}
        cy={SCREEN_HEIGHT * 0.7}
        r={70 * scale}
        opacity={0.06}
      >
        <LinearGradient
          start={vec(0, 0)}
          end={vec(140, 140)}
          colors={stepColors}
        />
        <BlurMask blur={20} style="normal" />
      </Circle>
    </Canvas>
  );
};