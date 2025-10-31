import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';

const PERMISSIONS = [
  {
    id: 1,
    icon: '📍',
    title: 'Location Access',
    description: 'See incidents near you and report from your current location',
    required: true,
    color: 'bg-primary-50 dark:bg-primary-900/30',
    iconBg: 'bg-primary-100 dark:bg-primary-800/50',
  },
  {
    id: 2,
    icon: '🔔',
    title: 'Notifications',
    description: 'Get real-time alerts about safety incidents in your area',
    required: false,
    color: 'bg-tertiary-50 dark:bg-tertiary-900/30',
    iconBg: 'bg-tertiary-100 dark:bg-tertiary-800/50',
  },
  {
    id: 3,
    icon: '📷',
    title: 'Camera & Photos',
    description: 'Add photos to your incident reports for better context',
    required: false,
    color: 'bg-secondary-50 dark:bg-secondary-900/30',
    iconBg: 'bg-secondary-100 dark:bg-secondary-800/50',
  },
];

export default function PermissionsScreen() {
  const animatedValues = useRef(
    PERMISSIONS.map(() => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
    }))
  ).current;

  const handlePermissionPress = (index: number) => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(animatedValues[index].scale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[index].opacity, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(animatedValues[index].scale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[index].opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Here you would request the actual permission
    // For now, just simulate it
    setTimeout(() => {
      // Request permission logic here
    }, 300);
  };

  const handleContinue = () => {
    router.replace('/(auth)/sign-in');
  };

  const handleSkip = () => {
    router.replace('/(auth)/sign-in');
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="dark-content" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8 px-6 pt-16">
          <Text className="mb-3 text-4xl font-bold text-gray-900 dark:text-white">
            Enable Permissions
          </Text>
          <Text className="text-lg leading-7 text-gray-600 dark:text-gray-400">
            To provide you with the best experience, we need a few permissions
          </Text>
        </View>

        {/* Permission Cards */}
        <View className="mb-8 px-6">
          {PERMISSIONS.map((permission, index) => (
            <Animated.View
              key={permission.id}
              style={{
                transform: [{ scale: animatedValues[index].scale }],
                opacity: animatedValues[index].opacity,
              }}
              className="mb-4"
            >
              <Pressable
                onPress={() => handlePermissionPress(index)}
                className={`rounded-3xl border border-gray-200 p-6 shadow-sm dark:border-gray-700 ${permission.color}`}
              >
                <View className="flex-row items-start">
                  <View
                    className={`mr-4 h-16 w-16 items-center justify-center rounded-2xl ${permission.iconBg}`}
                  >
                    <Text style={{ fontSize: 32 }}>{permission.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="mb-2 flex-row items-center">
                      <Text className="flex-1 text-xl font-bold text-gray-900 dark:text-white">
                        {permission.title}
                      </Text>
                      {permission.required && (
                        <View className="rounded-full bg-primary-500 px-3 py-1">
                          <Text className="text-xs font-semibold text-white">
                            Required
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-base leading-6 text-gray-600 dark:text-gray-400">
                      {permission.description}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* Info Box */}
        <View className="mx-6 mb-8 rounded-2xl bg-primary-50 p-5 dark:bg-primary-900/20">
          <Text className="mb-2 text-base font-semibold text-primary-700 dark:text-primary-300">
            🔒 Your Privacy Matters
          </Text>
          <Text className="text-sm leading-5 text-primary-600 dark:text-primary-400">
            We only use these permissions to enhance your experience. You can change them
            anytime in your device settings.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View className="border-t border-gray-200 bg-white px-6 pb-8 pt-4 dark:border-gray-700 dark:bg-gray-900">
        <Pressable
          onPress={handleContinue}
          className="mb-3 w-full rounded-2xl bg-primary-500 px-8 py-4 shadow-lg active:bg-primary-600"
        >
          <Text className="text-center text-lg font-semibold text-white">Continue</Text>
        </Pressable>

        <Pressable onPress={handleSkip} className="py-3">
          <Text className="text-center text-base font-medium text-gray-600 dark:text-gray-400">
            Skip for now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
