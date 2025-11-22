import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Formik } from 'formik';
import { useWalk } from '@/hooks/useWalk';
import { SelectWatchersSheet, SelectWatchersSheetRef } from '@/components/walk/SelectWatchersSheet';
import { initialWalkValues, walkValidationSchema, WalkFormValues } from '@/utils/walkValidation';
import * as Location from 'expo-location';

export default function StartWalkScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const watcherSheetRef = useRef<SelectWatchersSheetRef>(null);
  const formikRef = useRef<any>(null);
  const { createWalk, startWalk, activeWalk } = useWalk();
  
  const [loading, setLoading] = useState(false);

  // If there's already an active walk, go to it
  React.useEffect(() => {
    if (activeWalk) {
      router.replace('/(tabs)/home/walk-with-me/active');
    }
  }, [activeWalk, router]);

  const handleAddWatcher = () => {
    watcherSheetRef.current?.show();
  };

  const handleSelectWatcher = (
    watcher: { name: string; phone: string },
    setFieldValue: (field: string, value: any) => void,
    watchers: { name: string; phone: string }[]
  ) => {
    // Check if already added
    const exists = watchers.some(w => w.phone === watcher.phone);
    if (exists) {
      Alert.alert('Already Added', 'This person is already in your watchers list');
      return;
    }
    setFieldValue('watchers', [...watchers, watcher]);
  };

  const handleRemoveWatcher = (
    index: number,
    setFieldValue: (field: string, value: any) => void,
    watchers: { name: string; phone: string }[]
  ) => {
    setFieldValue('watchers', watchers.filter((_, i) => i !== index));
  };

  const handleStartWalk = async (values: WalkFormValues) => {
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
        destination_address: values.destination,
        destination_lat: destLat,
        destination_lng: destLng,
        estimated_duration: parseInt(values.estimatedTime),
        watchers: values.watchers.map(w => ({
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

      router.replace('/(tabs)/home/walk-with-me/active');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View 
      style={{
        flex: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
      }}
    >
      <BlurView 
        intensity={20} 
        tint={colorScheme === 'dark' ? 'dark' : 'light'} 
        className="flex-1"
      >
        {/* Handle Bar */}
        <View className="items-center py-4">
          <View className="w-12 h-1 bg-gray-400 dark:bg-gray-600 rounded-full" />
        </View>
        
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-4">
          <View>
            <Text className="text-2xl font-dm-sans-bold text-black dark:text-white">
              Walk with Me
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-sm mt-1">
              Let trusted contacts watch your journey
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center"
          >
            <Ionicons name="close" size={20} color={colorScheme === 'dark' ? '#fff' : '#666'} />
          </TouchableOpacity>
        </View>

        <Formik
          innerRef={formikRef}
          initialValues={initialWalkValues}
          validationSchema={walkValidationSchema}
          onSubmit={handleStartWalk}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {(formikProps) => {
            // Store formik reference for use outside render
            formikRef.current = formikProps;
            return (
            <>
              <ScrollView 
                className="flex-1 px-6" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
              >
                {/* Destination */}
                <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-5">
                  <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold mb-2">
                    Where are you going?
                  </Text>
                  <View className="flex-row items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                    <View className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 items-center justify-center">
                      <Ionicons name="location" size={20} color="#3B82F6" />
                    </View>
                    <TextInput
                      className="flex-1 ml-3 font-dm-sans text-base text-gray-900 dark:text-white"
                      placeholder="Enter destination"
                      placeholderTextColor="#9CA3AF"
                      value={formikProps.values.destination}
                      onChangeText={formikProps.handleChange('destination')}
                      onBlur={formikProps.handleBlur('destination')}
                    />
                  </View>
                  {formikProps.touched.destination && formikProps.errors.destination && (
                    <Text className="text-red-500 text-sm font-dm-sans mt-1">
                      {formikProps.errors.destination}
                    </Text>
                  )}
                </Animated.View>

                {/* Estimated Time */}
                <Animated.View entering={FadeInDown.delay(200).springify()} className="mb-5">
                  <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold mb-2">
                    Estimated time (minutes)
                  </Text>
                  <View className="flex-row items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                    <View className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 items-center justify-center">
                      <Ionicons name="time" size={20} color="#3B82F6" />
                    </View>
                    <TextInput
                      className="flex-1 ml-3 font-dm-sans text-base text-gray-900 dark:text-white"
                      placeholder="30"
                      placeholderTextColor="#9CA3AF"
                      value={formikProps.values.estimatedTime}
                      onChangeText={formikProps.handleChange('estimatedTime')}
                      onBlur={formikProps.handleBlur('estimatedTime')}
                      keyboardType="number-pad"
                    />
                  </View>
                  {formikProps.touched.estimatedTime && formikProps.errors.estimatedTime && (
                    <Text className="text-red-500 text-sm font-dm-sans mt-1">
                      {formikProps.errors.estimatedTime}
                    </Text>
                  )}
                </Animated.View>

                {/* Watchers */}
                <Animated.View entering={FadeInDown.delay(300).springify()} className="mb-5">
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-gray-700 dark:text-gray-300 font-dm-sans-semibold">
                      Trusted Watchers
                    </Text>
                    <TouchableOpacity 
                      onPress={handleAddWatcher}
                      className="bg-blue-500 px-4 py-2 rounded-full active:opacity-80"
                    >
                      <Text className="text-white font-dm-sans-semibold">+ Add</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {formikProps.values.watchers.length === 0 ? (
                    <View className="bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                      <View className="items-center">
                        <View className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 items-center justify-center mb-3">
                          <Ionicons name="people" size={32} color="#3B82F6" />
                        </View>
                        <Text className="text-blue-900 dark:text-blue-100 font-dm-sans-semibold text-center mb-1">
                          No watchers yet
                        </Text>
                        <Text className="text-blue-600 dark:text-blue-300 font-dm-sans text-center text-sm">
                          Add people who can watch your journey
                        </Text>
                      </View>
                    </View>
                  ) : (
                    formikProps.values.watchers.map((watcher, index) => (
                      <Animated.View
                        key={index}
                        entering={FadeInDown.delay(index * 100).springify()}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-4 mb-3 flex-row items-center justify-between border border-gray-200 dark:border-gray-700"
                      >
                        <View className="flex-row items-center flex-1">
                          <LinearGradient
                            colors={['#3B82F6', '#2563EB']}
                            className="w-12 h-12 rounded-full items-center justify-center"
                          >
                            <Ionicons name="person" size={24} color="white" />
                          </LinearGradient>
                          <View className="ml-3 flex-1">
                            <Text className="font-dm-sans-bold text-gray-900 dark:text-white">
                              {watcher.name}
                            </Text>
                            <Text className="font-dm-sans text-sm text-gray-500 dark:text-gray-400">
                              {watcher.phone}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveWatcher(index, formikProps.setFieldValue, formikProps.values.watchers)}
                          className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 items-center justify-center"
                        >
                          <Ionicons name="close" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      </Animated.View>
                    ))
                  )}
                  {formikProps.touched.watchers && formikProps.errors.watchers && typeof formikProps.errors.watchers === 'string' && (
                    <Text className="text-red-500 text-sm font-dm-sans mt-1">
                      {formikProps.errors.watchers}
                    </Text>
                  )}
                </Animated.View>

                {/* Safety Features */}
                <Animated.View entering={FadeInDown.delay(400).springify()} className="mb-5">
                  <View className="bg-green-50/80 dark:bg-green-900/20 backdrop-blur rounded-2xl p-5 border border-green-200 dark:border-green-800">
                    <View className="flex-row items-center mb-3">
                      <View className="w-10 h-10 rounded-full bg-green-500 items-center justify-center">
                        <Ionicons name="shield-checkmark" size={20} color="white" />
                      </View>
                      <Text className="font-dm-sans-bold text-green-900 dark:text-green-100 text-lg ml-3">
                        Safety Features
                      </Text>
                    </View>
                    {[
                      { icon: 'radio-button-on', text: 'Live location sharing' },
                      { icon: 'notifications', text: 'Auto-alerts if you stop' },
                      { icon: 'navigate', text: 'Route deviation detection' },
                      { icon: 'warning', text: 'One-tap SOS button' },
                    ].map((feature, index) => (
                      <View key={index} className="flex-row items-center py-1.5">
                        <Ionicons name={feature.icon as any} size={16} color="#22C55E" />
                        <Text className="font-dm-sans text-green-800 dark:text-green-200 ml-2">
                          {feature.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Animated.View>
              </ScrollView>

              {/* Start Button */}
              <View className="absolute bottom-0 left-0 right-0 px-6 pb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-t border-gray-200 dark:border-gray-700">
                <Animated.View entering={FadeInUp.delay(500).springify()}>
                  <TouchableOpacity
                    onPress={() => formikProps.handleSubmit()}
                    disabled={loading || !formikProps.isValid}
                    className="overflow-hidden rounded-2xl shadow-lg"
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#3B82F6', '#2563EB', '#1D4ED8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="py-5 items-center flex-row justify-center"
                    >
                      <Ionicons name="walk" size={24} color="white" />
                      <Text className="text-white font-dm-sans-bold text-lg ml-2">
                        {loading ? 'Starting Walk...' : 'Start Walking'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>

              {/* Watcher Selection Sheet */}
              <SelectWatchersSheet
                ref={watcherSheetRef}
                onSelectWatcher={(watcher) => {
                  if (formikRef.current) {
                    handleSelectWatcher(watcher, formikRef.current.setFieldValue, formikRef.current.values.watchers);
                  }
                }}
              />
            </>
            );
          }}
        </Formik>
      </BlurView>
    </View>
  );
}
