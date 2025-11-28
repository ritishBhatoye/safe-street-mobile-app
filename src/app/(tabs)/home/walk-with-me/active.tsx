import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { useWalk } from '@/hooks/useWalk';
import { useLocationTracking } from '@/hooks/useLocationTracking';

export default function ActiveWalkScreen() {
  const router = useRouter();
  const { activeWalk, completeWalk, cancelWalk, createAlert } = useWalk();
  const { currentLocation } = useLocationTracking(activeWalk?.id || null, true);

  if (!activeWalk) {
    router.replace('/(tabs)/home/walk-with-me');
    return null;
  }

  const handleComplete = () => {
    Alert.alert(
      'Arrived Safely?',
      'Mark this walk as completed',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: "Yes, I'm Safe",
          onPress: async () => {
            await completeWalk(activeWalk.id);
            Alert.alert('Success', 'Walk completed! Stay safe.');
            router.replace('/(tabs)/home');
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Walk?',
      'This will stop sharing your location',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            await cancelWalk(activeWalk.id);
            router.replace('/(tabs)/home');
          },
        },
      ]
    );
  };

  const handleSOS = () => {
    Alert.alert(
      '🚨 Emergency SOS',
      'This will alert all watchers and emergency contacts',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send SOS',
          style: 'destructive',
          onPress: async () => {
            await createAlert(activeWalk.id, 'sos', 'Emergency SOS triggered by user');
            Alert.alert('SOS Sent', 'Your watchers have been notified');
          },
        },
      ]
    );
  };

  const timeElapsed = activeWalk.started_at
    ? Math.floor((Date.now() - new Date(activeWalk.started_at).getTime()) / 60000)
    : 0;

  return (
    <View className="flex-1">
      {/* Map */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: currentLocation?.latitude || activeWalk.start_lat || 0,
          longitude: currentLocation?.longitude || activeWalk.start_lng || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        {/* Destination Marker */}
        <Marker
          coordinate={{
            latitude: activeWalk.destination_lat,
            longitude: activeWalk.destination_lng,
          }}
          title="Destination"
        >
          <View className="bg-green-500 w-12 h-12 rounded-full items-center justify-center border-2 border-white">
            <Ionicons name="flag" size={24} color="white" />
          </View>
        </Marker>

        {/* Route Line */}
        {currentLocation && (
          <Polyline
            coordinates={[
              {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              },
              {
                latitude: activeWalk.destination_lat,
                longitude: activeWalk.destination_lng,
              },
            ]}
            strokeColor="#3B82F6"
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />
        )}
      </MapView>

      {/* Top Info Card */}
      <SafeAreaView className="absolute top-0 left-0 right-0" edges={['top']}>
        <View className="mx-4 mt-4 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-dm-sans-bold text-gray-900">
              Walking to
            </Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              <Text className="text-sm font-dm-sans text-gray-600">
                {timeElapsed} min
              </Text>
            </View>
          </View>
          <Text className="text-gray-600 font-dm-sans">
            {activeWalk.destination_address}
          </Text>
          {activeWalk.estimated_duration && (
            <Text className="text-sm text-gray-500 font-dm-sans mt-1">
              ETA: {activeWalk.estimated_duration} minutes
            </Text>
          )}
        </View>
      </SafeAreaView>

      {/* Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 pb-8 px-4">
        {/* Test Watcher View Button (Development) */}
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/home/walk-with-me/watch/${activeWalk.id}`)}
          className="mb-2 bg-purple-500/95 backdrop-blur rounded-xl py-2 items-center"
        >
          <View className="flex-row items-center">
            <Ionicons name="eye" size={16} color="white" />
            <Text className="text-white font-dm-sans text-sm ml-2">
              View as Watcher (Test)
            </Text>
          </View>
        </TouchableOpacity>

        {/* SOS Button */}
        <TouchableOpacity
          onPress={handleSOS}
          className="mb-4 overflow-hidden rounded-full"
        >
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            className="py-4 items-center flex-row justify-center"
          >
            <Ionicons name="warning" size={24} color="white" />
            <Text className="text-white font-dm-sans-bold text-lg ml-2">
              EMERGENCY SOS
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleCancel}
            className="flex-1 bg-white/95 backdrop-blur rounded-xl py-3 items-center"
          >
            <Text className="text-gray-700 font-dm-sans-semibold">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleComplete}
            className="flex-1 overflow-hidden rounded-xl"
          >
            <LinearGradient
              colors={['#22C55E', '#16A34A']}
              className="py-3 items-center"
            >
              <Text className="text-white font-dm-sans-semibold">I&apos;m Safe</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
