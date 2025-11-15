import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  Canvas,
  Circle,
  LinearGradient,
  vec,
  Path,
  Skia,
  BlurMask,
} from '@shopify/react-native-skia';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkiaStepTransitionProps {
  currentStep: number;
  totalSteps: number;
}

export const SkiaStepTransition: React.FC<SkiaStepTransitionProps> = ({
  currentStep,
  totalSteps,
}) => {
  const [progress, setProgress] = React.useState(0);
  const [ripple, setRipple] = React.useState(0);

  useEffect(() => {
    setProgress((currentStep - 1) / (totalSteps - 1));
    
    const animateRipple = () => {
      setRipple(prev => (prev + 0.02) % 1);
      requestAnimationFrame(animateRipple);
    };
    
    const animationId = requestAnimationFrame(animateRipple);
    return () => cancelAnimationFrame(animationId);
  }, [currentStep, totalSteps]);

  const stepColors = [
    ['#3B82F6', '#1D4ED8'],
    ['#F59E0B', '#D97706'], 
    ['#10B981', '#059669'],
  ];

  const currentColors = stepColors[Math.min(currentStep - 1, stepColors.length - 1)];

  // Create progress path
  const createProgressPath = () => {
    const path = Skia.Path.Make();
    const y = 30;
    const startX = 20;
    const endX = SCREEN_WIDTH - 20;
    const progressX = startX + (endX - startX) * progress;
    
    path.moveTo(startX, y);
    path.lineTo(progressX, y);
    return path;
  };

  return (
    <Canvas style={{ width: SCREEN_WIDTH, height: 80 }}>
      {/* Background line */}
      <Path
        path={(() => {
          const path = Skia.Path.Make();
          path.moveTo(20, 30);
          path.lineTo(SCREEN_WIDTH - 20, 30);
          return path;
        })()}
        style="stroke"
        strokeWidth={4}
        color="#E5E7EB"
        strokeCap="round"
      />

      {/* Active progress line */}
      <Path
        path={createProgressPath()}
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
          <React.Fragment key={stepNumber}>
            {/* Ripple effect for current step */}
            {isCurrent && (
              <Circle
                cx={x}
                cy={30}
                r={15 + ripple * 10}
                opacity={0.3 - ripple * 0.3}
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
            />

            {/* Inner circle for active steps */}
            {isActive && (
              <Circle
                cx={x}
                cy={30}
                r={6}
                color="white"
                opacity={0.9}
              />
            )}
          </React.Fragment>
        );
      })}
    </Canvas>
  );
};