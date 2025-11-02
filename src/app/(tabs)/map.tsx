import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setIsLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(location);
      } catch (error) {
        console.error("Error getting location:", error);
        setErrorMsg("Unable to get your location");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Default to India (New Delhi) if no location yet
  const initialRegion = {
    latitude: location?.coords.latitude || 28.6139,
    longitude: location?.coords.longitude || 77.2090,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="location" size={64} color="#3B82F6" />
          <Text className="text-gray-900 font-dm-sans-bold text-xl mt-4 text-center">
            Getting Your Location
          </Text>
          <Text className="text-gray-600 font-dm-sans text-center mt-2">
            Please wait...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="location-outline" size={64} color="#EF4444" />
          <Text className="text-gray-900 font-dm-sans-bold text-xl mt-4 text-center">
            Location Access Required
          </Text>
          <Text className="text-gray-600 font-dm-sans text-center mt-2">
            {errorMsg}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1">
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        region={initialRegion}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
      >
        {/* Example marker - you'll add incident markers here later */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            description="Your current location"
          >
            <View className="bg-blue-500 w-10 h-10 rounded-full items-center justify-center border-2 border-white">
              <Ionicons name="person" size={20} color="white" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Floating header */}
      <SafeAreaView className="absolute top-0 left-0 right-0" edges={["top"]}>
        <View className="bg-white/95 backdrop-blur-sm mx-4 mt-4 rounded-2xl px-4 py-3 shadow-lg">
          <Text className="text-gray-900 font-dm-sans-bold text-lg">
            SafeStreet Map
          </Text>
          <Text className="text-gray-600 font-dm-sans text-sm">
            View incidents in your area
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
