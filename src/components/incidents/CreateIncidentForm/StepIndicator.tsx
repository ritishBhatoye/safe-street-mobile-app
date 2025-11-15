import React from 'react';
import { View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeInUp,
  interpolateColor 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
}) => {
  const progress = useSharedValue(currentStep / totalSteps);

  React.useEffect(() => {
    progress.value = withSpring(currentStep / totalSteps, {
      damping: 15,
      stiffness: 150,
    });
  }, [currentStep]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <Animated.View entering={FadeInUp.delay(100)} className="mb-8">
      {/* Progress Bar */}
      <View className="mb-6">
        <View className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <Animated.View style={progressStyle}>
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-full"
            />
          </Animated.View>
        </View>
        
        <View className="flex-row justify-between mt-3">
          <Text className="text-gray-500 dark:text-gray-400 font-dm-sans text-xs">
            Step {currentStep}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 font-dm-sans text-xs">
            {currentStep} of {totalSteps}
          </Text>
        </View>
      </View>

      {/* Step Circles */}
      <View className="flex-row items-center justify-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <View key={stepNumber} className="flex-row items-center">
              <Animated.View
                entering={FadeInUp.delay(200 + index * 100)}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  isActive
                    ? 'bg-blue-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                } ${isCurrent ? 'scale-110' : 'scale-100'}`}
                style={{
                  shadowColor: isActive ? '#3B82F6' : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isCurrent ? 0.3 : 0,
                  shadowRadius: 4,
                  elevation: isCurrent ? 4 : 0,
                }}
              >
                {isActive ? (
                  <Text className="text-white font-dm-sans-bold text-sm">
                    ✓
                  </Text>
                ) : (
                  <Text className="text-gray-500 font-dm-sans-bold text-sm">
                    {stepNumber}
                  </Text>
                )}
              </Animated.View>
              
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
      <Animated.View entering={FadeInUp.delay(400)} className="mt-4">
        <Text className="text-center text-gray-600 dark:text-gray-400 font-dm-sans text-sm">
          {stepTitles[currentStep - 1]}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};