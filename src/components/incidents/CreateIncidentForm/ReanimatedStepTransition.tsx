import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ReanimatedStepTransitionProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const ReanimatedStepTransition: React.FC<ReanimatedStepTransitionProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
}) => {
  // Animated values
  const progress = useSharedValue(0);
  const ripple = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    // Animate progress
    progress.value = withTiming((currentStep - 1) / (totalSteps - 1), {
      duration: 600,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

    // Ripple effect on step change
    ripple.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 400, easing: Easing.in(Easing.quad) })
    );

    // Continuous pulse for current step
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [currentStep]);

  // Step colors
  const stepColors = [
    ['#3B82F6', '#1D4ED8'], // Blue
    ['#F59E0B', '#D97706'], // Orange  
    ['#10B981', '#059669'], // Green
  ];

  const currentColors = stepColors[Math.min(currentStep - 1, stepColors.length - 1)];

  // Progress bar animated style
  const progressBarStyle = useAnimatedStyle(() => {
    const width = interpolate(
      progress.value,
      [0, 1],
      [0, SCREEN_WIDTH - 40]
    );

    return {
      width,
    };
  });

  // Current step title animation
  const titleStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 0.5, 1], [0.7, 1, 0.7]),
      transform: [
        {
          scale: interpolate(progress.value, [0, 0.5, 1], [0.95, 1, 0.95]),
        },
      ],
    };
  });

  return (
    <View className="mb-8">
      {/* Progress Bar Container */}
      <View className="mb-6">
        {/* Background line */}
        <View className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-5">
          {/* Active progress line */}
          <Animated.View style={[progressBarStyle]} className="h-full rounded-full overflow-hidden">
            <LinearGradient
              colors={currentColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </View>
        
        {/* Progress text */}
        <View className="flex-row justify-between mt-3 mx-5">
          <Text className="text-gray-500 dark:text-gray-400 font-dm-sans text-xs">
            Step {currentStep}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 font-dm-sans text-xs">
            {currentStep} of {totalSteps}
          </Text>
        </View>
      </View>

      {/* Step Circles */}
      <View className="flex-row items-center justify-center mb-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <View key={stepNumber} className="flex-row items-center">
              {/* Step Circle Container */}
              <View className="relative">
                {/* Ripple effect for current step */}
                {isCurrent && (
                  <RippleEffect
                    ripple={ripple}
                    pulse={pulse}
                    color={currentColors[0]}
                  />
                )}
                
                {/* Main step circle */}
                <StepCircle
                  isActive={isActive}
                  isCurrent={isCurrent}
                  stepNumber={stepNumber}
                  colors={currentColors}
                  pulse={pulse}
                />
              </View>
              
              {/* Connection line */}
              {index < totalSteps - 1 && (
                <View
                  className={`w-8 h-0.5 mx-2 ${
                    stepNumber < currentStep
                      ? 'bg-blue-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Current Step Title */}
      <Animated.View style={titleStyle}>
        <Text className="text-center text-gray-600 dark:text-gray-400 font-dm-sans text-sm">
          {stepTitles[currentStep - 1]}
        </Text>
      </Animated.View>
    </View>
  );
};

// Ripple Effect Component
const RippleEffect: React.FC<{
  ripple: Animated.SharedValue<number>;
  pulse: Animated.SharedValue<number>;
  color: string;
}> = ({ ripple, pulse, color }) => {
  const rippleStyle = useAnimatedStyle(() => {
    const scale = interpolate(ripple.value, [0, 1], [1, 2.5]);
    const opacity = interpolate(ripple.value, [0, 0.5, 1], [0, 0.4, 0]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
      opacity: 0.2,
    };
  });

  return (
    <>
      {/* Continuous pulse */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: color,
            top: -14,
            left: -14,
          },
          pulseStyle,
        ]}
      />
      
      {/* Ripple on step change */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: color,
            top: -14,
            left: -14,
          },
          rippleStyle,
        ]}
      />
    </>
  );
};

// Step Circle Component
const StepCircle: React.FC<{
  isActive: boolean;
  isCurrent: boolean;
  stepNumber: number;
  colors: string[];
  pulse: Animated.SharedValue<number>;
}> = ({ isActive, isCurrent, stepNumber, colors, pulse }) => {
  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: isCurrent ? pulse.value : 1 }],
    };
  });

  return (
    <Animated.View style={circleStyle}>
      <View
        className={`w-12 h-12 rounded-full items-center justify-center ${
          isActive ? '' : 'bg-gray-200 dark:bg-gray-700'
        }`}
        style={{
          backgroundColor: isActive ? colors[0] : undefined,
          shadowColor: isActive ? colors[0] : 'transparent',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isCurrent ? 0.4 : 0,
          shadowRadius: 8,
          elevation: isCurrent ? 8 : 0,
        }}
      >
        {isActive ? (
          <Text className="text-white font-dm-sans-bold text-sm">✓</Text>
        ) : (
          <Text className="text-gray-500 font-dm-sans-bold text-sm">
            {stepNumber}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};