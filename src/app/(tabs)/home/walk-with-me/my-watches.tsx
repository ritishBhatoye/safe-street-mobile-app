import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';

interface WalkData {
  id: string;
  destination_address: string;
  status: string;
  started_at: string;
  user_id: string;
}

interface WatchedWalk {
  id: string;
  walk: WalkData | WalkData[];
}

export default function MyWatchesScreen() {
  const router = useRouter();
  const [watches, setWatches] = useState<WatchedWalk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatches();
  }, []);

  const loadWatches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get walks where user is a watcher
      const { data, error } = await supabase
        .from('walk_watchers')
        .select(`
          id,
          walk:walks (
            id,
            destination_address,
            status,
            started_at,
            user_id
          )
        `)
        .eq('watcher_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWatches(data || []);
    } catch (error) {
      console.error('Error loading watches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#3B82F6';
      case 'alert': return '#EF4444';
      case 'completed': return '#22C55E';
      default: return '#9CA3AF';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Walking';
      case 'alert': return 'Alert!';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'My Watches',
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['bottom']}>
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Info Banner */}
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4 mt-2">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text className="flex-1 ml-2 text-blue-900 dark:text-blue-100 font-dm-sans text-sm">
                These are walks where you&apos;ve been added as a trusted watcher
              </Text>
            </View>
          </View>

          {/* Loading */}
          {loading && (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          )}

          {/* Empty State */}
          {!loading && watches.length === 0 && (
            <View className="bg-white dark:bg-gray-800 rounded-xl p-8 items-center mt-4">
              <View className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center mb-4">
                <Ionicons name="eye-outline" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-gray-900 dark:text-white font-dm-sans-bold text-lg mb-2">
                No Watches Yet
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-center">
                You&apos;ll see walks here when someone adds you as a watcher
              </Text>
            </View>
          )}

          {/* Watches List */}
          {!loading && watches.length > 0 && (
            <View className="space-y-2">
              {watches.map((watch, index) => {
                const walk = Array.isArray(watch.walk) ? watch.walk[0] : watch.walk;
                if (!walk) return null;

                const timeAgo = walk.started_at
                  ? Math.floor((Date.now() - new Date(walk.started_at).getTime()) / 60000)
                  : 0;

                return (
                  <Animated.View
                    key={watch.id}
                    entering={FadeInDown.delay(index * 50).springify()}
                  >
                    <TouchableOpacity
                      onPress={() => router.push(`/(tabs)/home/walk-with-me/watch/${walk.id}`)}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 active:opacity-80"
                    >
                      <View className="flex-row items-center mb-3">
                        <View
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: getStatusColor(walk.status) }}
                        />
                        <Text className="text-gray-900 dark:text-white font-dm-sans-semibold flex-1">
                          {getStatusText(walk.status)}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                      </View>

                      <View className="flex-row items-start mb-2">
                        <Ionicons name="location" size={16} color="#3B82F6" />
                        <Text className="flex-1 text-gray-700 dark:text-gray-300 font-dm-sans ml-2">
                          {walk.destination_address}
                        </Text>
                      </View>

                      {walk.status === 'active' && (
                        <View className="flex-row items-center">
                          <Ionicons name="time" size={14} color="#9CA3AF" />
                          <Text className="text-sm text-gray-500 dark:text-gray-400 font-dm-sans ml-1">
                            {timeAgo} minutes ago
                          </Text>
                        </View>
                      )}

                      {walk.status === 'alert' && (
                        <View className="mt-2 bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                          <View className="flex-row items-center">
                            <Ionicons name="warning" size={14} color="#EF4444" />
                            <Text className="text-red-600 dark:text-red-400 font-dm-sans-semibold text-sm ml-1">
                              Alert triggered - Check now!
                            </Text>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          )}

          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
