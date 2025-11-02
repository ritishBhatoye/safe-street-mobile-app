import React, { useEffect, useRef, useState } from 'react';
import type { PanGestureHandler } from 'react-native';
// eslint-disable-next-line no-duplicate-imports
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Icon, Text } from '@/components/atoms';
import { SearchBar } from '@/components/elements';
import { ICONS } from '@/constants';
import type { LocationData } from 'types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.8;
const BOTTOM_SHEET_MIN_HEIGHT = 60;

interface LocationBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (location: LocationData) => void;
  currentLocation?: LocationData;
}

export const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  visible,
  onClose,
  onLocationSelect,
  currentLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [nearbyLocations, setNearbyLocations] = useState<LocationData[]>([]);

  const translateY = useRef(
    new Animated.Value(BOTTOM_SHEET_MAX_HEIGHT)
  ).current;
  const gestureHandler = useRef<PanGestureHandler>(null);

  // Search locations using Nominatim (OpenStreetMap) - Free API
  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setLocations([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=10&addressdetails=1&countrycodes=us`
      );
      const data = await response.json();

      const formattedLocations: LocationData[] = data.map(
        (item: unknown, index: number) => ({
          id: `search-${index}`,
          name: item.display_name.split(',')[0],
          address: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        })
      );

      setLocations(formattedLocations);
    } catch (error) {
      console.error('Error searching locations:', error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  // Get nearby locations (mock data for demo - in real app, use user's location)
  const getNearbyLocations = () => {
    const mockNearby: LocationData[] = [
      {
        id: 'nearby-1',
        name: 'Current Location',
        address: 'Use my current location',
        lat: 37.7749,
        lon: -122.4194,
        distance: '0 mi',
      },
      {
        id: 'nearby-2',
        name: 'Whole Foods Market',
        address: '1765 California St, San Francisco, CA',
        lat: 37.7849,
        lon: -122.4294,
        distance: '0.5 mi',
      },
      {
        id: 'nearby-3',
        name: 'Safeway',
        address: '2020 Market St, San Francisco, CA',
        lat: 37.7649,
        lon: -122.4094,
        distance: '0.8 mi',
      },
    ];
    setNearbyLocations(mockNearby);
  };

  useEffect(() => {
    if (visible) {
      getNearbyLocations();
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: BOTTOM_SHEET_MAX_HEIGHT,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocations(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLocationPress = (location: LocationData) => {
    onLocationSelect(location);
    onClose();
  };

  const renderLocationItem = (location: LocationData) => (
    <TouchableOpacity
      key={location.id}
      onPress={() => handleLocationPress(location)}
      className="flex-row items-center border-b border-gray-100 py-4"
    >
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
        <Icon
          name={location.id === 'nearby-1' ? ICONS.location : ICONS.store}
          size="small"
          color="#3B82F6"
        />
      </View>
      <View className="flex-1">
        <Text variant="body" weight="medium" className="mb-1">
          {location.name}
        </Text>
        <Text variant="caption" color="secondary" numberOfLines={2}>
          {location.address}
        </Text>
      </View>
      {location.distance && (
        <Text variant="caption" color="secondary" className="ml-2">
          {location.distance}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50">
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                transform: [{ translateY }],
              }}
              className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white"
            >
              {/* Handle */}
              <View className="items-center py-3">
                <View className="h-1 w-12 rounded-full bg-gray-300" />
              </View>

              {/* Header */}
              <View className="border-b border-gray-100 px-5 pb-4">
                <View className="mb-4 flex-row items-center justify-between">
                  <Text variant="heading" weight="bold">
                    Select Location
                  </Text>
                  <TouchableOpacity onPress={onClose}>
                    <Icon name={ICONS.close} size="medium" color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search for a location..."
                  onClear={() => setSearchQuery('')}
                />
              </View>

              {/* Content */}
              <ScrollView
                className="max-h-96 px-5"
                showsVerticalScrollIndicator={false}
              >
                {searchQuery.length === 0 ? (
                  <View>
                    <Text
                      variant="subheading"
                      weight="bold"
                      className="mb-3 mt-4"
                    >
                      Nearby Locations
                    </Text>
                    {nearbyLocations.map(renderLocationItem)}
                  </View>
                ) : (
                  <View>
                    <Text
                      variant="subheading"
                      weight="bold"
                      className="mb-3 mt-4"
                    >
                      Search Results
                    </Text>
                    {loading ? (
                      <View className="items-center py-8">
                        <Text variant="caption" color="secondary">
                          Searching...
                        </Text>
                      </View>
                    ) : locations.length > 0 ? (
                      locations.map(renderLocationItem)
                    ) : (
                      <View className="items-center py-8">
                        <Text variant="caption" color="secondary">
                          No locations found
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
