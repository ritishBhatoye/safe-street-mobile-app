import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { Incident } from "@/types/incidents";

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loadingIncidents, setLoadingIncidents] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status} = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setIsLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(location);
        
        // Load incidents near user location
        await loadNearbyIncidents(location.coords.latitude, location.coords.longitude);
      } catch (err) {
        setErrorMsg("Unable to get your location");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const loadNearbyIncidents = async (lat: number, lng: number) => {
    setLoadingIncidents(true);
    try {
      // Get incidents within 50km radius
      const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .eq("status", "active")
        .limit(100);

      if (error) throw error;

      const mappedIncidents: Incident[] = (data || []).map((item: any) => {
        let latitude = lat;
        let longitude = lng;

        if (item.location) {
          if (typeof item.location === 'string') {
            const match = item.location.match(/POINT\(([^ ]+) ([^ ]+)\)/);
            if (match) {
              longitude = parseFloat(match[1]);
              latitude = parseFloat(match[2]);
            }
          } else if (item.location.coordinates) {
            longitude = item.location.coordinates[0];
            latitude = item.location.coordinates[1];
          }
        }

        return {
          id: item.id,
          type: item.type,
          severity: item.severity,
          title: item.title,
          description: item.description,
          location: { latitude, longitude },
          address: item.address,
          city: item.city,
          state: item.state,
          country: item.country,
          photos: item.photos || [],
          reported_by: item.reported_by,
          status: item.status,
          confirmed_count: item.confirmed_count || 0,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      });

      setIncidents(mappedIncidents);
    } catch (error) {
      console.error("Error loading incidents:", error);
    } finally {
      setLoadingIncidents(false);
    }
  };

  // Default to Punjab, India if no location yet
  const initialRegion: Region = {
    latitude: location?.coords.latitude || 30.7333,
    longitude: location?.coords.longitude || 76.7794,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  const getMarkerColor = (severity: string) => {
    switch (severity) {
      case "critical": return "#EF4444";
      case "danger": return "#F97316";
      case "caution": return "#EAB308";
      case "safe": return "#22C55E";
      default: return "#6B7280";
    }
  };

  const recenterMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
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
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        showsScale
        zoomEnabled
        scrollEnabled
        pitchEnabled
        rotateEnabled
      >
        {/* Incident Markers */}
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            coordinate={{
              latitude: incident.location.latitude,
              longitude: incident.location.longitude,
            }}
            title={incident.title}
            description={`${incident.severity} - ${incident.city || 'Unknown location'}`}
          >
            <View style={{ alignItems: 'center' }}>
              <View 
                style={{
                  backgroundColor: getMarkerColor(incident.severity),
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: 'white',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                  elevation: 5,
                }}
              >
                <Ionicons name="alert-circle" size={18} color="white" />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Floating header */}
      <SafeAreaView className="absolute top-0 left-0 right-0" edges={["top"]}>
        <View className="bg-white/95 backdrop-blur-sm mx-4 mt-4 rounded-2xl px-4 py-3 shadow-lg">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-900 font-dm-sans-bold text-lg">
                SafeStreet Map
              </Text>
              <Text className="text-gray-600 font-dm-sans text-sm">
                {incidents.length} active incidents
              </Text>
            </View>
            {loadingIncidents && (
              <ActivityIndicator size="small" color="#3B82F6" />
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Recenter Button */}
      {location && (
        <View className="absolute bottom-24 right-4">
          <TouchableOpacity
            onPress={recenterMap}
            className="bg-white rounded-full p-3 shadow-lg"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Ionicons name="locate" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
