import React from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { CreateIncidentRequest } from '@/types/incidents';
import { IncidentType, IncidentSeverity } from '@/constants/incidents';
import { StepIndicator } from './StepIndicator';
import { IncidentTypeStep } from './IncidentTypeStep';
import { SeverityDetailsStep } from './SeverityDetailsStep';
import { LocationDescriptionStep } from './LocationDescriptionStep';

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
      {/* Background Gradient */}
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

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

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={3}
          stepTitles={stepTitles}
        />

        {/* Step Content */}
        <Animated.View entering={FadeInUp.delay(200)} className="flex-1">
          {renderCurrentStep()}
        </Animated.View>
      </ScrollView>

      {/* Navigation Footer */}
      <Animated.View entering={FadeInUp.delay(400)}>
        <BlurView intensity={20} tint="light" className="border-t border-gray-200/50">
          <View className="p-4">
            <View className="flex-row gap-3">
              {currentStep > 1 && (
                <TouchableOpacity
                  onPress={prevStep}
                  className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl"
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons name="chevron-back" size={20} color="#6B7280" />
                    <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-medium ml-1">
                      Back
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              
              {currentStep < 3 ? (
                <TouchableOpacity
                  onPress={nextStep}
                  disabled={!canProceedToNextStep()}
                  className={`flex-1 p-4 rounded-2xl ${
                    !canProceedToNextStep()
                      ? 'bg-gray-300 dark:bg-gray-700'
                      : ''
                  }`}
                >
                  {canProceedToNextStep() ? (
                    <LinearGradient
                      colors={['#3B82F6', '#1D4ED8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="absolute inset-0 rounded-2xl"
                    />
                  ) : null}
                  <View className="flex-row items-center justify-center">
                    <Text className="text-white font-dm-sans-bold mr-1">
                      Continue
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={onSubmit}
                  disabled={isLoading || !canProceedToNextStep()}
                  className={`flex-1 p-4 rounded-2xl ${
                    isLoading || !canProceedToNextStep()
                      ? 'bg-gray-400'
                      : ''
                  }`}
                >
                  {!isLoading && canProceedToNextStep() ? (
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="absolute inset-0 rounded-2xl"
                    />
                  ) : null}
                  <View className="flex-row items-center justify-center">
                    {isLoading && (
                      <Ionicons name="hourglass-outline" size={20} color="white" />
                    )}
                    <Text className="text-white font-dm-sans-bold ml-2">
                      {isLoading ? 'Submitting...' : 'Submit Report'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            
            {currentStep === 1 && onCancel && (
              <TouchableOpacity
                onPress={onCancel}
                className="mt-3 p-3"
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