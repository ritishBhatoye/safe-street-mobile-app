import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShimmerEffect } from '@/components/atoms/ShimmerEffect';

export const HomeLoadingSkeleton = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <ShimmerEffect>
            <View className="bg-gray-400 h-9 w-40 rounded-lg mb-2" />
          </ShimmerEffect>
          <ShimmerEffect>
            <View className="bg-gray-300 h-5 w-48 rounded-md" />
          </ShimmerEffect>
        </View>

        <View className="gap-6 px-6">
          {/* Hero Safety Snapshot Skeleton */}
          <ShimmerEffect>
            <View className="bg-white dark:bg-gray-800 rounded-3xl p-6">
              <View className="items-center mb-4">
                <View className="bg-gray-400 h-32 w-32 rounded-full mb-4" />
                <View className="bg-gray-400 h-8 w-24 rounded-lg mb-2" />
                <View className="bg-gray-300 h-4 w-32 rounded-md" />
              </View>
              <View className="flex-row justify-around pt-4 border-t border-gray-200">
                <View className="items-center">
                  <View className="bg-gray-400 h-6 w-12 rounded-md mb-1" />
                  <View className="bg-gray-300 h-3 w-16 rounded-md" />
                </View>
                <View className="items-center">
                  <View className="bg-gray-400 h-6 w-12 rounded-md mb-1" />
                  <View className="bg-gray-300 h-3 w-16 rounded-md" />
                </View>
                <View className="items-center">
                  <View className="bg-gray-400 h-6 w-12 rounded-md mb-1" />
                  <View className="bg-gray-300 h-3 w-16 rounded-md" />
                </View>
              </View>
            </View>
          </ShimmerEffect>

          {/* Quick Actions Skeleton */}
          <View>
            <ShimmerEffect>
              <View className="bg-gray-400 h-6 w-32 rounded-md mb-3" />
            </ShimmerEffect>
            <View className="flex-row gap-3">
              {[1, 2, 3, 4].map((i) => (
                <ShimmerEffect key={i}>
                  <View className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-4 items-center">
                    <View className="bg-gray-400 h-12 w-12 rounded-full mb-2" />
                    <View className="bg-gray-300 h-3 w-16 rounded-md" />
                  </View>
                </ShimmerEffect>
              ))}
            </View>
          </View>

          {/* Recent Incidents Skeleton */}
          <View>
            <ShimmerEffect>
              <View className="bg-gray-400 h-6 w-48 rounded-md mb-3" />
            </ShimmerEffect>
            {[1, 2, 3].map((i) => (
              <ShimmerEffect key={i}>
                <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3">
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <View className="bg-gray-400 h-5 w-3/4 rounded-md mb-2" />
                      <View className="bg-gray-300 h-3 w-1/2 rounded-md" />
                    </View>
                    <View className="bg-gray-400 h-6 w-16 rounded-full" />
                  </View>
                  <View className="bg-gray-300 h-3 w-full rounded-md mb-1" />
                  <View className="bg-gray-300 h-3 w-5/6 rounded-md" />
                </View>
              </ShimmerEffect>
            ))}
          </View>

          {/* Map Preview Skeleton */}
          <ShimmerEffect>
            <View className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden">
              <View className="bg-gray-400 h-48 w-full" />
              <View className="p-4">
                <View className="bg-gray-400 h-5 w-32 rounded-md mb-2" />
                <View className="bg-gray-300 h-3 w-48 rounded-md" />
              </View>
            </View>
          </ShimmerEffect>

          {/* Emergency Card Skeleton */}
          <ShimmerEffect>
            <View className="bg-red-50 dark:bg-red-900/20 rounded-3xl p-6">
              <View className="flex-row items-center mb-3">
                <View className="bg-gray-400 h-12 w-12 rounded-full mr-3" />
                <View className="flex-1">
                  <View className="bg-gray-400 h-5 w-32 rounded-md mb-2" />
                  <View className="bg-gray-300 h-3 w-48 rounded-md" />
                </View>
              </View>
              <View className="bg-gray-400 h-12 w-full rounded-xl" />
            </View>
          </ShimmerEffect>

          {/* Safety Tips Skeleton */}
          <View>
            <ShimmerEffect>
              <View className="bg-gray-400 h-6 w-32 rounded-md mb-3" />
            </ShimmerEffect>
            {[1, 2].map((i) => (
              <ShimmerEffect key={i}>
                <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3">
                  <View className="bg-gray-400 h-5 w-3/4 rounded-md mb-2" />
                  <View className="bg-gray-300 h-3 w-full rounded-md mb-1" />
                  <View className="bg-gray-300 h-3 w-5/6 rounded-md" />
                </View>
              </ShimmerEffect>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
