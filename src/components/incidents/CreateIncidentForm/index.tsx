import React from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { CreateIncidentRequest } from '@/types/incidents';
import { IncidentType, IncidentSeverity } from '@/constants/incidents';
import { IncidentTypeStep } from './IncidentTypeStep';
import { SeverityDetailsStep } from './SeverityDetailsStep';
import { LocationDescriptionStep } from './LocationDescriptionStep';
import { SkiaAnimatedBackground } from './SkiaAnimatedBackground';
import { SkiaStepTransition } from './SkiaStepTransition';
import { SkiaAnimatedButton } from './SkiaAnimatedButton';

interface CreateIncidentFormProps {
  // Form Data
  formData: Partial<CreateIncidentRequest>;
  onFormDataChange: (data: Partial<CreateIncidentRequest>) => void;
  
  // Step Management
  currentStep: number;
  onStepChange: (step: number) => void;
  
  // Actions
  onSubmit: () => void;
  onCancel?: () => void;
  
  // State
  isLoading: boolean;
  isGettingLocation: boolean;
  errors: string[];
  
  // Location Handler
  onGetLocation: () => void;
}

export const CreateIncidentForm: React.FC<CreateIncidentFormProps> = ({
  formData,
  onFormDataChange,
  currentStep,
  onStepChange,
  onSubmit,
  onCancel,
  isLoading,
  isGettingLocation,
  errors,
  onGetLocation,
}) => {
  const stepTitles = [
    'Select Incident Type',
    'Set Severity & Title', 
    'Add Location & Details'
  ];

  const nextStep = () => {
    if (currentStep < 3) {
      onStepChange(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return !!formData.type;
      case 2:
        return !!formData.severity && !!formData.title?.trim();
      case 3:
        return !!formData.latitude && !!formData.longitude;
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <IncidentTypeStep
            selectedType={formData.type}
            onTypeSelect={(type: IncidentType) => 
              onFormDataChange({ ...formData, type })
            }
          />
        );
      case 2:
        return (
          <SeverityDetailsStep
            selectedSeverity={formData.severity}
            title={formData.title || ''}
            onSeveritySelect={(severity: IncidentSeverity) => 
              onFormDataChange({ ...formData, severity })
            }
            onTitleChange={(title: string) => 
              onFormDataChange({ ...formData, title })
            }
          />
        );
      case 3:
        return (
          <LocationDescriptionStep
            latitude={formData.latitude}
            longitude={formData.longitude}
            address={formData.address}
            description={formData.description || ''}
            isGettingLocation={isGettingLocation}
            onGetLocation={onGetLocation}
            onDescriptionChange={(description: string) => 
              onFormDataChange({ ...formData, description })
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1">
      {/* Skia Animated Background */}
      <SkiaAnimatedBackground currentStep={currentStep} />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Error Messages */}
        {errors.length > 0 && (
          <Animated.View entering={FadeInDown.delay(100)}>
            <BlurView intensity={20} tint="light" className="rounded-2xl mb-4 overflow-hidden">
              <View className="p-4 bg-red-500/10">
                {errors.map((error, index) => (
                  <View key={index} className="flex-row items-center mb-1">
                    <Ionicons name="warning" size={16} color="#EF4444" />
                    <Text className="text-red-600 dark:text-red-400 text-sm ml-2 font-dm-sans">
                      {error}
                    </Text>
                  </View>
                ))}
              </View>
            </BlurView>
          </Animated.View>
        )}

        {/* Skia Step Transition */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <SkiaStepTransition currentStep={currentStep} totalSteps={3} />
        </Animated.View>

        {/* Step Titles */}
        <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
          <Text className="text-center text-gray-600 dark:text-gray-400 font-dm-sans text-sm">
            {stepTitles[currentStep - 1]}
          </Text>
        </Animated.View>

        {/* Step Content */}
        <Animated.View entering={FadeInUp.delay(200)} className="flex-1">
          {renderCurrentStep()}
        </Animated.View>
      </ScrollView>

      {/* Navigation Footer with Skia Buttons */}
      <Animated.View entering={FadeInUp.delay(400)}>
        <BlurView intensity={20} tint="light" className="border-t border-gray-200/50">
          <View className="p-4">
            <View className="flex-row gap-3 items-center justify-center">
              {currentStep > 1 && (
                <SkiaAnimatedButton
                  title="Back"
                  onPress={prevStep}
                  variant="secondary"
                  icon="chevron-back"
                  width={100}
                  height={50}
                />
              )}
              
              {currentStep < 3 ? (
                <SkiaAnimatedButton
                  title="Continue"
                  onPress={nextStep}
                  disabled={!canProceedToNextStep()}
                  variant="primary"
                  icon="chevron-forward"
                  width={currentStep > 1 ? 150 : 200}
                  height={50}
                />
              ) : (
                <SkiaAnimatedButton
                  title={isLoading ? 'Submitting...' : 'Submit Report'}
                  onPress={onSubmit}
                  disabled={!canProceedToNextStep()}
                  loading={isLoading}
                  variant="success"
                  icon={!isLoading ? "checkmark-circle" : undefined}
                  width={currentStep > 1 ? 180 : 220}
                  height={50}
                />
              )}
            </View>
            
            {currentStep === 1 && onCancel && (
              <TouchableOpacity
                onPress={onCancel}
                className="mt-4 p-3"
              >
                <Text className="text-center text-gray-500 font-dm-sans">
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
};