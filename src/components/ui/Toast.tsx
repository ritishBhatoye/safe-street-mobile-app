import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <View className="mx-4 w-11/12 flex-row items-center rounded-2xl bg-success-500 p-4 shadow-lg">
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/20">
        <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
      </View>
      <View className="flex-1">
        {text1 && (
          <Text className="font-dm-sans-bold mb-1 text-base text-white">{text1}</Text>
        )}
        {text2 && (
          <Text className="font-dm-sans text-sm text-white/90">{text2}</Text>
        )}
      </View>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View className="mx-4 w-11/12 flex-row items-center rounded-2xl bg-danger-500 p-4 shadow-lg">
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/20">
        <Ionicons name="close-circle" size={24} color="#FFFFFF" />
      </View>
      <View className="flex-1">
        {text1 && (
          <Text className="font-dm-sans-bold mb-1 text-base text-white">{text1}</Text>
        )}
        {text2 && (
          <Text className="font-dm-sans text-sm text-white/90">{text2}</Text>
        )}
      </View>
    </View>
  ),

  info: ({ text1, text2 }) => (
    <View className="mx-4 w-11/12 flex-row items-center rounded-2xl bg-info-500 p-4 shadow-lg">
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/20">
        <Ionicons name="information-circle" size={24} color="#FFFFFF" />
      </View>
      <View className="flex-1">
        {text1 && (
          <Text className="font-dm-sans-bold mb-1 text-base text-white">{text1}</Text>
        )}
        {text2 && (
          <Text className="font-dm-sans text-sm text-white/90">{text2}</Text>
        )}
      </View>
    </View>
  ),

  warning: ({ text1, text2 }) => (
    <View className="mx-4 w-11/12 flex-row items-center rounded-2xl bg-warning-500 p-4 shadow-lg">
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/20">
        <Ionicons name="warning" size={24} color="#FFFFFF" />
      </View>
      <View className="flex-1">
        {text1 && (
          <Text className="font-dm-sans-bold mb-1 text-base text-white">{text1}</Text>
        )}
        {text2 && (
          <Text className="font-dm-sans text-sm text-white/90">{text2}</Text>
        )}
      </View>
    </View>
  ),
};
