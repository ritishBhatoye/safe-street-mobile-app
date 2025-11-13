import React from 'react';
import { View } from 'react-native';
import { ShimmerEffect } from '@/components/atoms/ShimmerEffect';

export const ReportsLoadingSkeleton = () => {
  return (
    <View className="px-4">
      {/* Header Skeleton */}
      <View className="pt-4 pb-6">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <ShimmerEffect>
              <View className="bg-gray-400 h-10 w-32 rounded-lg mb-2" />
            </ShimmerEffect>
            <ShimmerEffect>
              <View className="bg-gray-300 h-4 w-40 rounded-md" />
            </ShimmerEffect>
          </View>
          
          <View className="flex-row gap-2">
            <ShimmerEffect>
              <View className="bg-gray-400 h-12 w-12 rounded-2xl" />
            </ShimmerEffect>
            <ShimmerEffect>
              <View className="bg-gray-400 h-12 w-12 rounded-2xl" />
            </ShimmerEffect>
          </View>
        </View>

        {/* Stats Cards Skeleton */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <ShimmerEffect>
              <View className="bg-white rounded-2xl p-5">
                <View className="bg-gray-400 h-5 w-5 rounded-full mb-2" />
                <View className="bg-gray-400 h-8 w-12 rounded-md mb-1" />
                <View className="bg-gray-300 h-3 w-16 rounded-md" />
              </View>
            </ShimmerEffect>
          </View>
          <View className="flex-1">
            <ShimmerEffect>
              <View className="bg-white rounded-2xl p-5">
                <View className="bg-gray-400 h-5 w-5 rounded-full mb-2" />
                <View className="bg-gray-400 h-8 w-12 rounded-md mb-1" />
                <View className="bg-gray-300 h-3 w-16 rounded-md" />
              </View>
            </ShimmerEffect>
          </View>
        </View>
      </View>

      {/* Report Cards Skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <View key={i} className="mb-4">
          <ShimmerEffect>
            <View className="bg-white rounded-3xl p-5">
              {/* Header */}
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <View className="bg-gray-400 h-6 w-3/4 rounded-md mb-2" />
                  <View className="flex-row items-center gap-2">
                    <View className="bg-gray-300 h-4 w-4 rounded-full" />
                    <View className="bg-gray-300 h-3 w-32 rounded-md" />
                  </View>
                </View>
                <View className="bg-gray-400 h-8 w-20 rounded-full" />
              </View>

              {/* Description */}
              <View className="mb-3">
                <View className="bg-gray-300 h-3 w-full rounded-md mb-1" />
                <View className="bg-gray-300 h-3 w-5/6 rounded-md" />
              </View>

              {/* Footer */}
              <View className="flex-row items-center justify-between pt-3 border-t border-gray-200">
                <View className="flex-row items-center gap-2">
                  <View className="bg-gray-400 h-6 w-16 rounded-full" />
                  <View className="bg-gray-400 h-6 w-20 rounded-full" />
                </View>
                <View className="bg-gray-300 h-3 w-24 rounded-md" />
              </View>
            </View>
          </ShimmerEffect>
        </View>
      ))}
    </View>
  );
};
