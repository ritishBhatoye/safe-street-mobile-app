import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  INCIDENT_TYPE_LABELS, 
  INCIDENT_TYPE_ICONS,
  IncidentType 
} from '@/constants/incidents';

interface IncidentTypeStepProps {
  selectedType?: IncidentType;
  onTypeSelect: (type: IncidentType) => void;
}

export const IncidentTypeStep: React.FC<IncidentTypeStepProps> = ({
  selectedType,
  onTypeSelect,
}) => {
  return (
    <View className="flex-1">
      {/* Header */}
      <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
        <Text className="text-black dark:text-white font-dm-sans-bold text-2xl mb-2">
          What happened?
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-base">
          Select the type of incident you want to report
        </Text>
      </Animated.View>

      {/* Incident Types Grid */}
      <View className="gap-5">
        {Object.entries(INCIDENT_TYPE_LABELS).map(([key, label], index) => (
          <Animated.View
            key={key}
            entering={FadeInDown.delay(300 + index * 100)}
          >
            <TouchableOpacity
              onPress={() => onTypeSelect(key as IncidentType)}
              className={`p-4 rounded-3xl border-2 ${
                selectedType === key
                  ? 'border-blue-500'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {selectedType === key ? (
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{position:'absolute',inset:0,borderRadius:24,opacity:0.1}}
                />
              ) : (
                <View className="absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl" />
              )}
              
              <View className="flex-row items-center relative">
                <View
                  className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${
                    selectedType === key
                      ? 'bg-blue-500'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <Ionicons
                    name={INCIDENT_TYPE_ICONS[key as keyof typeof INCIDENT_TYPE_ICONS] as any}
                    size={28}
                    color={selectedType === key ? 'white' : '#6B7280'}
                  />
                </View>
                
                <View className="flex-1">
                  <Text
                    className={`font-dm-sans-bold text-lg ${
                      selectedType === key
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-black dark:text-white'
                    }`}
                  >
                    {label}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 font-dm-sans text-sm mt-1">
                    Report {label.toLowerCase()} incident
                  </Text>
                </View>
                
                {selectedType === key && (
                  <Animated.View entering={FadeInUp.springify()}>
                    <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center">
                      <Ionicons name="checkmark" size={20} color="white" />
                    </View>
                  </Animated.View>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};