import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { CreateIncidentForm } from '@/components/incidents/CreateIncidentForm';
import { useCreateIncidentMutation } from '@/store/api/incidentsApi';
import { CreateIncidentRequest } from '@/types/incidents';
import { IncidentValidator } from '@/utils/validation';
import { LocationService } from '@/utils/location';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CreateReportScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [createIncident, { isLoading }] = useCreateIncidentMutation();

  // Form State
  const [formData, setFormData] = useState<Partial<CreateIncidentRequest>>({
    type: undefined,
    severity: undefined,
    title: '',
    description: '',
    latitude: undefined,
    longitude: undefined,
    address: '',
    city: '',
    state: '',
    country: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Handlers
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
    // Clear previous errors
    setErrors([]);
    
    // Validate form
    const validationErrors = IncidentValidator.validateCreateIncident(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors.map(e => e.message));
      return;
    }

    try {
      await createIncident(formData as CreateIncidentRequest).unwrap();
      Alert.alert('Success', 'Incident reported successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create incident');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Report',
      'Are you sure you want to cancel? Your progress will be lost.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        { text: 'Cancel Report', style: 'destructive', onPress: () => router.back() }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Background Gradient */}
      <LinearGradient
        colors={colorScheme === 'dark' 
          ? ['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)'] 
          : ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)']
        }
        className="absolute inset-0"
      />

     
      {/* Modal Content */}
      <View 
        style={{
          flex: 1,
          maxHeight: SCREEN_HEIGHT * 0.85,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          overflow: 'hidden',
        }}
      >
        <BlurView 
          intensity={20} 
          tint={colorScheme === 'dark' ? 'dark' : 'light'} 
          className="flex-1"
        >
          <SafeAreaView style={{ flex: 1 }}>
            {/* Handle Bar */}
            <View className="items-center py-4">
              <View className="w-12 h-1 bg-gray-400 dark:bg-gray-600 rounded-full" />
            </View>
            
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pb-4">
              <View>
                <Text className="text-2xl font-dm-sans-bold text-black dark:text-white">
                  Report Incident
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-sm mt-1">
                  Help keep your community safe
                </Text>
              </View>
              <TouchableOpacity 
                onPress={handleCancel}
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center"
              >
                <Ionicons name="close" size={20} color={colorScheme === 'dark' ? '#fff' : '#666'} />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <CreateIncidentForm 
              formData={formData}
              onFormDataChange={setFormData}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
              isGettingLocation={isGettingLocation}
              errors={errors}
              onGetLocation={handleGetCurrentLocation}
            />
          </SafeAreaView>
        </BlurView>
      </View>
    </View>
  );
};

export default CreateReportScreen;