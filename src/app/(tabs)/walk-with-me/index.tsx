import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useWalk } from '@/hooks/useWalk';
import * as Location from 'expo-location';

export default function StartWalkScreen() {
  const router = useRouter();
  const { createWalk, startWalk, activeWalk } = useWalk();
  
  const [destination, setDestination] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('30');
  const [watchers, setWatchers] = useState<Array<{ name: string; phone: string }>>([]);
  const [loading, setLoading] = useState(false);

  // If there's already an active walk, go to it
  React.useEffect(() => {
    if (activeWalk) {
      router.replace('/walk-with-me/active');
    }
  }, [activeWalk]);

  const handleAddWatcher = () => {
    Alert.prompt(
      'Add Watcher',
      'Enter name and phone number',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (text) => {
            if (text) {
              const [name, phone] = text.split(',');
              if (name && phone) {
                setWatchers([...watchers, { name: name.trim(), phone: phone.trim() }]);
              }
            }
          },
        },
      ],
      'plain-text',
      '',
      'default'
    );
  };

  const handleStartWalk = async () => {
    if (!destination.trim()) {
      Alert.alert('Error', 'Please enter a destination');
      return;
    }

    try {
      setLoading(true);

      // Get current location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Location permission required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // For demo, use current location + offset as destination
      // In production, you'd use a proper geocoding service
      const destLat = location.coords.latitude + 0.01;
      const destLng = location.coords.longitude + 0.01;

      // Create walk
      const walk = await createWalk({
        destination_address: destination,
        destination_lat: destLat,
        destination_lng: destLng,
        estimated_duration: parseInt(estimatedTime),
        watchers: watchers.map(w => ({
          watcher_name: w.name,
          watcher_phone: w.phone,
        })),
      });

      // Start walk with current location
      await startWalk({
        walk_id: walk.id,
        start_lat: location.coords.latitude,
        start_lng: location.coords.longitude,
        start_address: address[0]?.street || 'Current Location',
      });

      router.replace('/walk-with-me/active');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#3B82F6', '#2563EB']}
        className="pt-12 pb-6"
      >
        <SafeAreaView edges={['top']}>
          <View className="px-6">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-3xl font-dm-sans-bold text-white mb-2">
              Walk with Me
            </Text>
            <Text className="text-blue-100 font-dm-sans">
              Let trusted contacts watch your journey
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Destination */}
        <View className="mb-6">
          <Text className="text-gray-700 font-dm-sans-semibold mb-2">
            Where are you going?
          </Text>
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
            <Ionicons name="location" size={20} color="#3B82F6" />
            <TextInput
              className="flex-1 ml-3 font-dm-sans text-base"
              placeholder="Enter destination"
              value={destination}
              onChangeText={setDestination}
            />
          </View>
        </View>

        {/* Estimated Time */}
        <View className="mb-6">
          <Text className="text-gray-700 font-dm-sans-semibold mb-2">
            Estimated time (minutes)
          </Text>
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
            <Ionicons name="time" size={20} color="#3B82F6" />
            <TextInput
              className="flex-1 ml-3 font-dm-sans text-base"
              placeholder="30"
              value={estimatedTime}
              onChangeText={setEstimatedTime}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* Watchers */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-700 font-dm-sans-semibold">
              Trusted Watchers
            </Text>
            <TouchableOpacity onPress={handleAddWatcher}>
              <Text className="text-blue-500 font-dm-sans-semibold">+ Add</Text>
            </TouchableOpacity>
          </View>
          
          {watchers.length === 0 ? (
            <View className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <Text className="text-blue-600 font-dm-sans text-center">
                Add people who can watch your journey
              </Text>
            </View>
          ) : (
            watchers.map((watcher, index) => (
              <View
                key={index}
                className="bg-white rounded-xl p-4 mb-2 flex-row items-center justify-between border border-gray-200"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
                    <Ionicons name="person" size={20} color="#3B82F6" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-dm-sans-semibold text-gray-900">
                      {watcher.name}
                    </Text>
                    <Text className="font-dm-sans text-sm text-gray-500">
                      {watcher.phone}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setWatchers(watchers.filter((_, i) => i !== index))}
                >
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Safety Features */}
        <View className="bg-green-50 rounded-xl p-4 mb-6 border border-green-100">
          <Text className="font-dm-sans-bold text-green-900 mb-2">
            🛡️ Safety Features
          </Text>
          <View className="space-y-2">
            <Text className="font-dm-sans text-green-700">
              • Live location sharing
            </Text>
            <Text className="font-dm-sans text-green-700">
              • Auto-alerts if you stop
            </Text>
            <Text className="font-dm-sans text-green-700">
              • Route deviation detection
            </Text>
            <Text className="font-dm-sans text-green-700">
              • One-tap SOS button
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Start Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          onPress={handleStartWalk}
          disabled={loading}
          className="overflow-hidden rounded-xl"
        >
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            className="py-4 items-center"
          >
            <Text className="text-white font-dm-sans-bold text-lg">
              {loading ? 'Starting...' : 'Start Walking'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
