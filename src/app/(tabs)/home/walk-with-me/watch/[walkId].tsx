import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useWalkWatcher } from '@/hooks/useWalkWatcher';
import { formatDistanceToNow } from 'date-fns';

export default function WatchWalkScreen() {
  const router = useRouter();
  const { walkId } = useLocalSearchParams<{ walkId: string }>();
  const { walk, liveLocation, alerts, loading, error } = useWalkWatcher(walkId);
  const [mapReady, setMapReady] = useState(false);

  if (loading) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 dark:text-gray-400 font-dm-sans mt-4">
          Loading walk details...
        </Text>
      </View>
    );
  }

  if (error || !walk) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900 items-center justify-center px-6">
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text className="text-gray-900 dark:text-white font-dm-sans-bold text-xl mt-4 text-center">
          Walk Not Found
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-center mt-2">
          {error || 'This walk may have been completed or cancelled'}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-blue-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-dm-sans-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentLat = liveLocation?.latitude || walk.last_lat || walk.start_lat || 0;
  const currentLng = liveLocation?.longitude || walk.last_lng || walk.start_lng || 0;

  const timeElapsed = walk.started_at
    ? Math.floor((Date.now() - new Date(walk.started_at).getTime()) / 60000)
    : 0;

  const isActive = walk.status === 'active';
  const isAlert = walk.status === 'alert';
  const isCompleted = walk.status === 'completed';

  const getStatusColor = () => {
    if (isCompleted) return '#22C55E';
    if (isAlert) return '#EF4444';
    return '#3B82F6';
  };

  const getStatusText = () => {
    if (isCompleted) return 'Arrived Safely';
    if (isAlert) return 'Alert!';
    return 'Walking';
  };

  return (
    <View className="flex-1">
      {/* Map */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: currentLat,
          longitude: currentLng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        onMapReady={() => setMapReady(true)}
      >
        {/* Current Location Marker */}
        {(liveLocation || walk.last_lat) && (
          <>
            <Marker
              coordinate={{
                latitude: currentLat,
                longitude: currentLng,
              }}
              title="Current Location"
            >
              <View className="items-center">
                <LinearGradient
                  colors={isAlert ? ['#EF4444', '#DC2626'] : ['#3B82F6', '#2563EB']}
                  className="w-14 h-14 rounded-full items-center justify-center border-4 border-white shadow-lg"
                >
                  <Ionicons name="person" size={28} color="white" />
                </LinearGradient>
              </View>
            </Marker>

            {/* Accuracy Circle */}
            {liveLocation?.accuracy && (
              <Circle
                center={{
                  latitude: currentLat,
                  longitude: currentLng,
                }}
                radius={liveLocation.accuracy}
                fillColor="rgba(59, 130, 246, 0.1)"
                strokeColor="rgba(59, 130, 246, 0.3)"
                strokeWidth={1}
              />
            )}
          </>
        )}

        {/* Destination Marker */}
        <Marker
          coordinate={{
            latitude: walk.destination_lat,
            longitude: walk.destination_lng,
          }}
          title="Destination"
          description={walk.destination_address}
        >
          <View className="items-center">
            <View className="w-12 h-12 rounded-full bg-green-500 items-center justify-center border-4 border-white shadow-lg">
              <Ionicons name="flag" size={24} color="white" />
            </View>
          </View>
        </Marker>

        {/* Route Line */}
        {(liveLocation || walk.last_lat) && (
          <Polyline
            coordinates={[
              {
                latitude: currentLat,
                longitude: currentLng,
              },
              {
                latitude: walk.destination_lat,
                longitude: walk.destination_lng,
              },
            ]}
            strokeColor={getStatusColor()}
            strokeWidth={3}
            lineDashPattern={[10, 5]}
          />
        )}
      </MapView>

      {/* Top Status Card */}
      <SafeAreaView className="absolute top-0 left-0 right-0" edges={['top']}>
        <Animated.View entering={FadeInDown.delay(200)} className="mx-4 mt-4">
          <View className="bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-2xl p-4 shadow-lg">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center flex-1">
                <View
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getStatusColor() }}
                />
                <Text className="text-lg font-dm-sans-bold text-gray-900 dark:text-white">
                  {getStatusText()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Destination */}
            <View className="flex-row items-start mb-2">
              <Ionicons name="location" size={16} color="#3B82F6" />
              <Text className="flex-1 text-gray-700 dark:text-gray-300 font-dm-sans ml-2">
                {walk.destination_address}
              </Text>
            </View>

            {/* Time Info */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="time" size={16} color="#9CA3AF" />
                <Text className="text-sm text-gray-600 dark:text-gray-400 font-dm-sans ml-1">
                  {timeElapsed} min elapsed
                </Text>
              </View>
              {walk.estimated_duration && (
                <Text className="text-sm text-gray-500 dark:text-gray-500 font-dm-sans">
                  ETA: {walk.estimated_duration} min
                </Text>
              )}
            </View>

            {/* Last Update */}
            {walk.last_location_update && (
              <View className="flex-row items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Ionicons name="radio-button-on" size={12} color="#22C55E" />
                <Text className="text-xs text-gray-500 dark:text-gray-500 font-dm-sans ml-1">
                  Updated {formatDistanceToNow(new Date(walk.last_location_update), { addSuffix: true })}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </SafeAreaView>

      {/* Alerts */}
      {alerts.length > 0 && (
        <View className="absolute top-32 left-0 right-0 px-4">
          {alerts.slice(0, 2).map((alert, index) => (
            <Animated.View
              key={alert.id}
              entering={FadeInDown.delay(300 + index * 100)}
              className="mb-2"
            >
              <View className="bg-red-500/95 backdrop-blur rounded-xl p-4 shadow-lg">
                <View className="flex-row items-center">
                  <Ionicons name="warning" size={20} color="white" />
                  <Text className="flex-1 text-white font-dm-sans-semibold ml-2">
                    {alert.message}
                  </Text>
                </View>
                <Text className="text-white/80 font-dm-sans text-xs mt-1">
                  {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>
      )}

      {/* Bottom Actions */}
      {isActive && (
        <View className="absolute bottom-0 left-0 right-0 pb-8 px-4">
          <Animated.View entering={FadeInUp.delay(400)}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Contact Walker',
                  'Call or message the person?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Call', onPress: () => {/* Implement call */} },
                    { text: 'Message', onPress: () => {/* Implement message */} },
                  ]
                );
              }}
              className="overflow-hidden rounded-xl shadow-lg"
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                className="py-4 items-center flex-row justify-center"
              >
                <Ionicons name="call" size={20} color="white" />
                <Text className="text-white font-dm-sans-semibold text-base ml-2">
                  Contact Walker
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* Completed Message */}
      {isCompleted && (
        <View className="absolute bottom-0 left-0 right-0 pb-8 px-4">
          <Animated.View entering={FadeInUp.delay(400)}>
            <View className="bg-green-500/95 backdrop-blur rounded-xl p-4 shadow-lg">
              <View className="flex-row items-center justify-center">
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text className="text-white font-dm-sans-bold text-lg ml-2">
                  Arrived Safely!
                </Text>
              </View>
              {walk.completed_at && (
                <Text className="text-white/80 font-dm-sans text-sm text-center mt-1">
                  Completed {formatDistanceToNow(new Date(walk.completed_at), { addSuffix: true })}
                </Text>
              )}
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}
