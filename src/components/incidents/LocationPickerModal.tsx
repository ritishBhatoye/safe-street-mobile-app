import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { BlurView } from 'expo-blur';
import { LocationService } from '@/utils/location';

interface LocationPickerModalProps {
  visible: boolean;
  initialLatitude?: number;
  initialLongitude?: number;
  onClose: () => void;
  onSelectLocation: (location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
  }) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  initialLatitude,
  initialLongitude,
  onClose,
  onSelectLocation,
}) => {
  const mapRef = useRef<MapView>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(
    initialLatitude && initialLongitude
      ? { latitude: initialLatitude, longitude: initialLongitude }
      : null
  );
  const [loading, setLoading] = useState(false);
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleGetCurrentLocation = async () => {
    try {
      setGettingCurrentLocation(true);
      const coords = await LocationService.getCurrentPosition();
      setSelectedLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      
      // Animate map to current location
      mapRef.current?.animateToRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setGettingCurrentLocation(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedLocation) return;

    try {
      setLoading(true);
      const addressInfo = await LocationService.reverseGeocode(selectedLocation);
      
      onSelectLocation({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        address: addressInfo.address || '',
        city: addressInfo.city || '',
        state: addressInfo.state || '',
        country: addressInfo.country || '',
      });
      
      onClose();
    } catch (error) {
      console.error('Error getting address:', error);
      // Still allow selection even if reverse geocoding fails
      onSelectLocation({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        address: `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`,
        city: '',
        state: '',
        country: '',
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Default to user's approximate location or a default location
  const defaultRegion = {
    latitude: initialLatitude || 31.5204, // Lahore, Pakistan
    longitude: initialLongitude || 74.3587,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white dark:bg-gray-900">
        {/* Header */}
        <View className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
            <View className="flex-1">
              <Text className="text-xl font-dm-sans-bold text-black dark:text-white">
                Pick Location
              </Text>
              <Text className="text-sm font-dm-sans text-gray-600 dark:text-gray-400 mt-1">
                Tap on the map to select incident location
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center ml-2"
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Map */}
        <View className="flex-1">
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            initialRegion={defaultRegion}
            onPress={handleMapPress}
            showsUserLocation
            showsMyLocationButton={false}
            showsCompass
            showsScale
          >
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                draggable
                onDragEnd={(e) => {
                  setSelectedLocation(e.nativeEvent.coordinate);
                }}
              >
                <View className="items-center">
                  <View className="w-12 h-12 rounded-full bg-red-500 items-center justify-center shadow-lg">
                    <Ionicons name="warning" size={24} color="white" />
                  </View>
                  <View className="w-1 h-8 bg-red-500" />
                  <View className="w-3 h-3 rounded-full bg-red-500" />
                </View>
              </Marker>
            )}
          </MapView>

          {/* Current Location Button */}
          <View className="absolute top-4 right-4">
            <TouchableOpacity
              onPress={handleGetCurrentLocation}
              disabled={gettingCurrentLocation}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 items-center justify-center shadow-lg"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              {gettingCurrentLocation ? (
                <ActivityIndicator size="small" color="#3B82F6" />
              ) : (
                <Ionicons name="locate" size={24} color="#3B82F6" />
              )}
            </TouchableOpacity>
          </View>

          {/* Info Card */}
          {!selectedLocation && (
            <View className="absolute bottom-24 left-4 right-4">
              <BlurView intensity={80} tint="light" className="rounded-2xl overflow-hidden">
                <View className="p-4 flex-row items-center bg-white/80 dark:bg-gray-800/80">
                  <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mr-3">
                    <Ionicons name="information-circle" size={20} color="#3B82F6" />
                  </View>
                  <Text className="flex-1 text-gray-900 dark:text-white font-dm-sans text-sm">
                    Tap anywhere on the map to mark the incident location
                  </Text>
                </View>
              </BlurView>
            </View>
          )}

          {/* Selected Location Info */}
          {selectedLocation && (
            <View className="absolute bottom-24 left-4 right-4">
              <BlurView intensity={80} tint="light" className="rounded-2xl overflow-hidden">
                <View className="p-4 bg-white/80 dark:bg-gray-800/80">
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center mr-2">
                      <Ionicons name="checkmark" size={16} color="#10B981" />
                    </View>
                    <Text className="text-gray-900 dark:text-white font-dm-sans-semibold text-sm">
                      Location Selected
                    </Text>
                  </View>
                  <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-xs">
                    {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-500 font-dm-sans text-xs mt-1">
                    Drag the marker to adjust position
                  </Text>
                </View>
              </BlurView>
            </View>
          )}
        </View>

        {/* Bottom Actions */}
        <View className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl py-4 active:opacity-80"
            >
              <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold text-center text-base">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!selectedLocation || loading}
              className={`flex-1 rounded-xl py-4 active:opacity-80 ${
                !selectedLocation || loading ? 'bg-gray-400' : 'bg-blue-500'
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-dm-sans-semibold text-center text-base">
                  Confirm Location
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
