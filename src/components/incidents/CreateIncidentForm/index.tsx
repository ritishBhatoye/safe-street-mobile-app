import React from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { CreateIncidentRequest, IncidentType, IncidentSeverity } from '@/types/incidents';
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

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const coords = await LocationService.getCurrentPosition();
      const addressInfo = await LocationService.reverseGeocode(coords);
      
      setFormData(prev => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: addressInfo.address,
        city: addressInfo.city,
        state: addressInfo.state,
        country: addressInfo.country,
      }));
    } catch (error) {
      Alert.alert('Location Error', 'Failed to get current location');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const validationErrors = IncidentValidator.validateCreateIncident(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors.map(e => e.message));
      return;
    }

    try {
      await createIncident(formData as CreateIncidentRequest).unwrap();
      Alert.alert('Success', 'Incident reported successfully');
      onSuccess?.();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create incident');
    }
  };

  const animateStep = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      animateStep();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      animateStep();
    }
  };

  const renderStepIndicator = () => (
    <View className="flex-row items-center justify-center mb-6">
      {[1, 2, 3].map((step) => (
        <View key={step} className="flex-row items-center">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              step <= currentStep
                ? 'bg-blue-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <Text
              className={`font-dm-sans-bold text-sm ${
                step <= currentStep ? 'text-white' : 'text-gray-500'
              }`}
            >
              {step}
            </Text>
          </View>
          {step < 3 && (
            <View
              className={`w-8 h-0.5 mx-2 ${
                step < currentStep
                  ? 'bg-blue-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Incident Type Selection */}
      <View className="mb-6">
        <Text className="text-black dark:text-white font-dm-sans-bold text-lg mb-3">
          What happened?
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 font-dm-sans mb-4">
          Select the type of incident you want to report
        </Text>
        
        <View className="gap-5">
          {Object.entries(INCIDENT_TYPE_LABELS).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setFormData(prev => ({ ...prev, type: key as any }))}
              className={`p-4 rounded-2xl border-2 ${
                formData.type === key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                    formData.type === key
                      ? 'bg-blue-500'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <Ionicons
                    name={INCIDENT_TYPE_ICONS[key as keyof typeof INCIDENT_TYPE_ICONS] as any}
                    size={24}
                    color={formData.type === key ? 'white' : '#6B7280'}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`font-dm-sans-medium text-base ${
                      formData.type === key
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-black dark:text-white'
                    }`}
                  >
                    {label}
                  </Text>
                </View>
                {formData.type === key && (
                  <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Severity and Details */}
      <View className="mb-6">
        <Text className="text-black dark:text-white font-dm-sans-bold text-lg mb-3">
          How serious is it?
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 font-dm-sans mb-4">
          Help us understand the severity level
        </Text>
        
        <View className="gap-5 mb-6">
          {Object.entries(SEVERITY_LABELS).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setFormData(prev => ({ ...prev, severity: key as any }))}
              className={`p-4 rounded-2xl border-2 ${
                formData.severity === key
                  ? 'border-2 '
                  : 'border-gray-200 dark:border-gray-400'
              }`}
              style={{
                borderColor: formData.severity === key ? SEVERITY_COLORS[key as keyof typeof SEVERITY_COLORS] : '#9ca3af',
                backgroundColor: formData.severity === key ? `${SEVERITY_COLORS[key as keyof typeof SEVERITY_COLORS]}15` : colorScheme === 'dark' ? '#1F2937' : 'white',
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: SEVERITY_COLORS[key as keyof typeof SEVERITY_COLORS] }}
                />
                <View className="flex-1">
                  <Text className="font-dm-sans-medium text-base text-black dark:text-white">
                    {label}
                  </Text>
                </View>
                {formData.severity === key && (
                  <Ionicons 
                    name="checkmark-circle" 
                    size={24} 
                    color={SEVERITY_COLORS[key as keyof typeof SEVERITY_COLORS]} 
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Title Input */}
        <View className="mb-4">
          <Text className="text-black dark:text-white font-dm-sans-medium mb-2">
            Brief Title *
          </Text>
          <BlurView intensity={20} tint={colorScheme === 'dark' ? 'dark' : 'light'} className="rounded-2xl overflow-hidden">
            <TextInput
              className="p-4 text-black dark:text-white font-dm-sans"
              placeholder="What happened in a few words..."
              placeholderTextColor="#9CA3AF"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            />
          </BlurView>
        </View>
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Location and Description */}
      <View className="mb-6">
        <Text className="text-black dark:text-white font-dm-sans-bold text-lg mb-3">
          Where did this happen?
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 font-dm-sans mb-4">
          Add location and additional details
        </Text>

        {/* Location */}
        <View className="mb-4">
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl"
          >
            <TouchableOpacity
              onPress={handleGetCurrentLocation}
              disabled={isGettingLocation}
              className="flex-row items-center justify-center p-4"
            >
              <Ionicons 
                name={isGettingLocation ? "hourglass-outline" : "location-outline"} 
                size={24} 
                color="white" 
              />
              <Text className="text-white font-dm-sans-bold ml-3 text-base">
                {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          
          {formData.latitude && formData.longitude && (
            <BlurView intensity={20} tint={colorScheme === 'dark' ? 'dark' : 'light'} className="rounded-2xl mt-3 p-4">
              <View className="flex-row items-center">
                <Ionicons name="location" size={20} color="#10B981" />
                <Text className="text-black dark:text-white font-dm-sans ml-2 flex-1">
                  {formData.address || `${formData.latitude.toFixed(6)}, ${formData.longitude.toFixed(6)}`}
                </Text>
              </View>
            </BlurView>
          )}
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-black dark:text-white font-dm-sans-medium mb-2">
            Additional Details (Optional)
          </Text>
          <BlurView intensity={20} tint={colorScheme === 'dark' ? 'dark' : 'light'} className="rounded-2xl overflow-hidden">
            <TextInput
              className="p-4 text-black dark:text-white font-dm-sans min-h-[100px]"
              placeholder="Provide more details about what happened..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            />
          </BlurView>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Error Messages */}
        {errors.length > 0 && (
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
        )}

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="p-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700">
        <View className="flex-row gap-3">
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={prevStep}
              className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl"
            >
              <Text className="text-center text-gray-700 dark:text-gray-300 font-dm-sans-medium">
                Back
              </Text>
            </TouchableOpacity>
          )}
          
          {currentStep < 3 ? (
            <TouchableOpacity
              onPress={nextStep}
              disabled={
                (currentStep === 1 && !formData.type) ||
                (currentStep === 2 && (!formData.severity || !formData.title))
              }
              className={`flex-1 p-4 rounded-2xl ${
                (currentStep === 1 && !formData.type) ||
                (currentStep === 2 && (!formData.severity || !formData.title))
                  ? 'bg-gray-300 dark:bg-gray-700'
                  : 'bg-blue-500'
              }`}
            >
              <Text className="text-center text-white font-dm-sans-bold">
                Continue
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading || !formData.latitude || !formData.longitude}
              className={`flex-1 p-4 rounded-2xl ${
                isLoading || !formData.latitude || !formData.longitude
                  ? 'bg-gray-400'
                  : 'bg-green-500'
              }`}
            >
              <View className="flex-row items-center justify-center">
                {isLoading && (
                  <Ionicons name="hourglass-outline" size={20} color="white" />
                )}
                <Text className="text-center text-white font-dm-sans-bold ml-2">
                  {isLoading ? 'Submitting...' : 'Submit Report'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        
        {currentStep === 1 && (
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
    </View>
  );
};