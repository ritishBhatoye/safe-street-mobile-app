import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCreateIncidentMutation } from '@/store/api/incidentsApi';
import { CreateIncidentRequest } from '@/types/incidents';
import { 
  INCIDENT_TYPES, 
  INCIDENT_SEVERITY, 
  INCIDENT_TYPE_LABELS, 
  SEVERITY_LABELS,
  SEVERITY_COLORS 
} from '@/constants/incidents';
import { IncidentValidator } from '@/utils/validation';
import { LocationService } from '@/utils/location';

interface CreateIncidentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateIncidentForm: React.FC<CreateIncidentFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [createIncident, { isLoading }] = useCreateIncidentMutation();
  
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

  const [errors, setErrors] = useState<string[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

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

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black p-4">
      <Text className="text-2xl font-dm-sans-bold text-black dark:text-white mb-6">
        Report Incident
      </Text>

      {/* Error Messages */}
      {errors.length > 0 && (
        <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
          {errors.map((error, index) => (
            <Text key={index} className="text-red-600 dark:text-red-400 text-sm">
              • {error}
            </Text>
          ))}
        </View>
      )}

      {/* Title */}
      <View className="mb-4">
        <Text className="text-black dark:text-white font-dm-sans-medium mb-2">
          Title *
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-black dark:text-white bg-white dark:bg-gray-800"
          placeholder="Brief description of the incident"
          placeholderTextColor="#9CA3AF"
          value={formData.title}
          onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
        />
      </View>

      {/* Incident Type */}
      <View className="mb-4">
        <Text className="text-black dark:text-white font-dm-sans-medium mb-2">
          Incident Type *
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {Object.entries(INCIDENT_TYPE_LABELS).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                onPress={() => setFormData(prev => ({ ...prev, type: key as any }))}
                className={`px-4 py-2 rounded-full border ${
                  formData.type === key
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                }`}
              >
                <Text
                  className={`text-sm ${
                    formData.type === key
                      ? 'text-white'
                      : 'text-black dark:text-white'
                  }`}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Severity */}
      <View className="mb-4">
        <Text className="text-black dark:text-white font-dm-sans-medium mb-2">
          Severity Level *
        </Text>
        <View className="flex-row gap-2">
          {Object.entries(SEVERITY_LABELS).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setFormData(prev => ({ ...prev, severity: key as any }))}
              className={`flex-1 px-4 py-3 rounded-lg border ${
                formData.severity === key
                  ? 'border-2'
                  : 'border border-gray-300 dark:border-gray-600'
              }`}
              style={{
                borderColor: formData.severity === key ? SEVERITY_COLORS[key as keyof typeof SEVERITY_COLORS] : undefined,
                backgroundColor: formData.severity === key ? `${SEVERITY_COLORS[key as keyof typeof SEVERITY_COLORS]}20` : undefined,
              }}
            >
              <Text
                className={`text-center text-sm font-dm-sans-medium ${
                  formData.severity === key
                    ? 'text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Location */}
      <View className="mb-4">
        <Text className="text-black dark:text-white font-dm-sans-medium mb-2">
          Location *
        </Text>
        <TouchableOpacity
          onPress={handleGetCurrentLocation}
          disabled={isGettingLocation}
          className="flex-row items-center justify-center p-3 bg-blue-500 rounded-lg mb-2"
        >
          <Ionicons 
            name={isGettingLocation ? "hourglass-outline" : "location-outline"} 
            size={20} 
            color="white" 
          />
          <Text className="text-white font-dm-sans-medium ml-2">
            {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
          </Text>
        </TouchableOpacity>
        
        {formData.latitude && formData.longitude && (
          <Text className="text-gray-600 dark:text-gray-400 text-sm">
            📍 {formData.address || `${formData.latitude.toFixed(6)}, ${formData.longitude.toFixed(6)}`}
          </Text>
        )}
      </View>

      {/* Description */}
      <View className="mb-6">
        <Text className="text-black dark:text-white font-dm-sans-medium mb-2">
          Description
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-black dark:text-white bg-white dark:bg-gray-800"
          placeholder="Provide more details about the incident..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
        />
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={onCancel}
          className="flex-1 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg"
        >
          <Text className="text-center text-gray-700 dark:text-gray-300 font-dm-sans-medium">
            Cancel
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`flex-1 p-4 rounded-lg ${
            isLoading ? 'bg-gray-400' : 'bg-blue-500'
          }`}
        >
          <Text className="text-center text-white font-dm-sans-medium">
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};