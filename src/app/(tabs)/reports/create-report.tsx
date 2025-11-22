import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Formik } from 'formik';
import { CreateIncidentForm } from '@/components/incidents/CreateIncidentForm';
import { useCreateIncidentMutation } from '@/store/api/incidentsApi';
import { CreateIncidentRequest } from '@/types/incidents';
import { LocationService } from '@/utils/location';
import { 
  initialIncidentValues, 
  incidentValidationSchema, 
  getValidationSchemaForStep,
  IncidentFormValues 
} from '@/utils/incidentValidation';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CreateReportScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [createIncident, { isLoading }] = useCreateIncidentMutation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Handlers
  const handleGetCurrentLocation = async (setFieldValue: (field: string, value: any) => void) => {
    setIsGettingLocation(true);
    try {
      const coords = await LocationService.getCurrentPosition();
      const addressInfo = await LocationService.reverseGeocode(coords);
      
      // Update Formik values
      setFieldValue('latitude', coords.latitude);
      setFieldValue('longitude', coords.longitude);
      setFieldValue('address', addressInfo.address || '');
      setFieldValue('city', addressInfo.city || '');
      setFieldValue('state', addressInfo.state || '');
      setFieldValue('country', addressInfo.country || '');
    } catch (err) {
      Alert.alert('Location Error', 'Failed to get current location');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async (values: IncidentFormValues) => {
    try {
      // Convert form values to CreateIncidentRequest format
      const incidentData: CreateIncidentRequest = {
        type: values.type as any,
        severity: values.severity as any,
        title: values.title,
        description: values.description,
        latitude: values.latitude!,
        longitude: values.longitude!,
        address: values.address,
        city: values.city,
        state: values.state,
        country: values.country,
        photos: values.photos,
      };

      await createIncident(incidentData).unwrap();
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

  // Step validation helper
  const validateCurrentStep = async (values: IncidentFormValues, step: number) => {
    try {
      const schema = getValidationSchemaForStep(step);
      await schema.validate(values, { abortEarly: false });
      return true;
    } catch (err: any) {
      return false;
    }
  };

  return (
      <View 
        style={{
          flex: 1,
      
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
          <>
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

            {/* Formik Form */}
            <Formik
              initialValues={initialIncidentValues}
              validationSchema={incidentValidationSchema}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {(formikProps) => (
                <CreateIncidentForm 
                  formikProps={formikProps}
                  currentStep={currentStep}
                  onStepChange={setCurrentStep}
                  onCancel={handleCancel}
                  isLoading={isLoading}
                  isGettingLocation={isGettingLocation}
                  onGetLocation={() => handleGetCurrentLocation(formikProps.setFieldValue)}
                  validateCurrentStep={(step) => validateCurrentStep(formikProps.values, step)}
                />
              )}
            </Formik>
          </>
        </BlurView>
      </View>
    
  );
};

export default CreateReportScreen;