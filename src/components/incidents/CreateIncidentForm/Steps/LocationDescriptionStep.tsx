import React from 'react';
import { useColorScheme , View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface LocationDescriptionStepProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  description: string;
  isGettingLocation: boolean;
  onGetLocation: () => void;
  onPickOnMap: () => void;
  onDescriptionChange: (description: string) => void;
  locationError?: string;
  descriptionError?: string;
}

export const LocationDescriptionStep: React.FC<LocationDescriptionStepProps> = ({
  latitude,
  longitude,
  address,
  description,
  isGettingLocation,
  onGetLocation,
  onPickOnMap,
  onDescriptionChange,
  locationError,
  descriptionError,
}) => {
  const colorScheme = useColorScheme();
  const hasLocation = latitude && longitude;

  return (
    <View className="flex-1">
      {/* Header */}
      <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
        <Text className="text-black dark:text-white font-dm-sans-bold text-2xl mb-2">
          Where did this happen?
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-base">
          Add location and provide additional details about the incident
        </Text>
      </Animated.View>

      {/* Location Section */}
      <Animated.View entering={FadeInDown.delay(300)} className="mb-8">
        <Text className="text-black dark:text-white font-dm-sans-medium text-lg mb-4">
          Location
        </Text>
        
        {/* Location Buttons */}
        <View className="flex-row space-x-3 mb-3">
          {/* Current Location Button */}
          <View className="flex-1">
            <LinearGradient
              colors={hasLocation ? ['#10B981', '#059669'] : ['#3B82F6', '#1D4ED8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl"
              style={{
                shadowColor: hasLocation ? '#10B981' : '#3B82F6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <TouchableOpacity
                onPress={onGetLocation}
                disabled={isGettingLocation}
                className="flex-row items-center justify-center p-4"
              >
                <Animated.View
                  style={{
                    transform: [{ 
                      rotate: isGettingLocation ? '360deg' : '0deg' 
                    }]
                  }}
                >
                  <Ionicons 
                    name={
                      hasLocation 
                        ? "checkmark-circle" 
                        : isGettingLocation 
                          ? "hourglass-outline" 
                          : "location-outline"
                    } 
                    size={24} 
                    color="white" 
                  />
                </Animated.View>
                <Text className="text-white font-dm-sans-bold ml-2 text-sm">
                  {hasLocation 
                    ? 'Current' 
                    : isGettingLocation 
                      ? 'Getting...' 
                      : 'Current'
                  }
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Pick on Map Button */}
          <View className="flex-1">
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl"
              style={{
                shadowColor: '#8B5CF6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <TouchableOpacity
                onPress={onPickOnMap}
                className="flex-row items-center justify-center p-4"
              >
                <Ionicons name="map-outline" size={24} color="white" />
                <Text className="text-white font-dm-sans-bold ml-2 text-sm">
                  Pick on Map
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
        
        {/* Location Display */}
        {hasLocation && (
          <Animated.View entering={FadeInRight.delay(100)}>
            <BlurView 
              intensity={20} 
              tint={colorScheme === 'dark' ? 'dark' : 'light'} 
              className="rounded-2xl mt-4 overflow-hidden"
            >
              <View className="p-4 flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-green-500 items-center justify-center mr-3">
                  <Ionicons name="location" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-black dark:text-white font-dm-sans-medium text-sm">
                    Location Confirmed
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-xs mt-1">
                    {address || `${latitude?.toFixed(6)}, ${longitude?.toFixed(6)}`}
                  </Text>
                </View>
                <View className="w-2 h-2 rounded-full bg-green-500" />
              </View>
            </BlurView>
          </Animated.View>
        )}
      </Animated.View>

      {/* Description Section */}
      <Animated.View entering={FadeInDown.delay(600)} className="mb-6">
        <Text className="text-black dark:text-white font-dm-sans-medium text-lg mb-3">
          Additional Details
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 font-dm-sans text-sm mb-4">
          Optional: Provide more context about what happened
        </Text>
        
        <BlurView 
          intensity={20} 
          tint={colorScheme === 'dark' ? 'dark' : 'light'} 
          className="rounded-2xl overflow-hidden"
        >
          <View className="p-1">
            <TextInput
              className="p-4 text-black dark:text-white font-dm-sans text-base min-h-[120px]"
              placeholder="Describe what happened, when it occurred, who was involved, and any other relevant details..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={onDescriptionChange}
              style={{ 
                backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: 12,
              }}
              maxLength={1000}
            />
          </View>
        </BlurView>
        
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-gray-400 font-dm-sans text-xs">
            {description.length}/1000 characters
          </Text>
          {descriptionError && (
            <Text className="text-red-500 font-dm-sans text-xs">
              {descriptionError}
            </Text>
          )}
        </View>
      </Animated.View>

      {/* Location Error Display */}
      {locationError && (
        <Animated.View entering={FadeInUp.delay(600)}>
          <View className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl">
            <View className="flex-row items-center">
              <Ionicons name="warning" size={16} color="#EF4444" />
              <Text className="text-red-600 dark:text-red-400 font-dm-sans text-sm ml-2">
                {locationError}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Safety Tips */}
      <Animated.View entering={FadeInUp.delay(800)}>
        <BlurView 
          intensity={10} 
          tint={colorScheme === 'dark' ? 'dark' : 'light'} 
          className="rounded-2xl overflow-hidden"
        >
          <View className="p-4 flex-row items-start">
            <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center mr-3 mt-1">
              <Ionicons name="information" size={16} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-black dark:text-white font-dm-sans-medium text-sm mb-1">
                Safety Reminder
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-xs leading-4">
                Your report helps keep the community safe. All reports are reviewed and may be shared with local authorities if necessary.
              </Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
};