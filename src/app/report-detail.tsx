import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Report } from '@/services/reports.service';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.75;

export default function ReportDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);
  
  const reports: Report[] = params.reports ? JSON.parse(params.reports as string) : [];
  const initialIndex = params.initialIndex ? parseInt(params.initialIndex as string) : 0;
  
  const [currentPage, setCurrentPage] = useState(initialIndex);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(40);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return '#22c55e';
      case 'investigating': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    scale.value = withSpring(isExpanded ? 0.9 : 1, { damping: 15 });
    translateY.value = withSpring(isExpanded ? 40 : 0, { damping: 15 });
  };

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  if (reports.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <Text className="text-white">No reports found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 z-20">
        <View className="px-4 py-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
            >
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <Text className="text-white font-dm-sans-bold text-base">
              {currentPage + 1} / {reports.length}
            </Text>
            
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
              <Ionicons name="share-social" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Page Indicators */}
      <View className="absolute top-24 left-0 right-0 z-20 flex-row px-6 gap-1">
        {reports.map((_, index) => (
          <View
            key={index}
            className="flex-1 h-1 rounded-full overflow-hidden bg-white/20"
          >
            {index === currentPage && (
              <View className="h-full bg-white rounded-full" />
            )}
          </View>
        ))}
      </View>

      {/* PagerView with Animated Cards */}
      <View className="flex-1 justify-center">
        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={initialIndex}
          onPageSelected={(e) => {
            setCurrentPage(e.nativeEvent.position);
            setIsExpanded(false);
            scale.value = withSpring(0.9, { damping: 15 });
            translateY.value = withSpring(40, { damping: 15 });
          }}
        >
          {reports.map((report) => (
            <View key={report.id} className="flex-1 items-center justify-center">
              <Animated.View
                style={[
                  {
                    width: CARD_WIDTH,
                    height: isExpanded ? SCREEN_HEIGHT : CARD_HEIGHT,
                    borderRadius: isExpanded ? 0 : 32,
                    overflow: 'hidden',
                  },
                  cardAnimatedStyle,
                ]}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={toggleExpand}
                  style={{ flex: 1 }}
                >
                  <LinearGradient
                    colors={['#1a1a1a', '#0a0a0a']}
                    className="flex-1"
                  >
                    <ScrollView
                      className="flex-1"
                      contentContainerStyle={{ padding: 24 }}
                      showsVerticalScrollIndicator={false}
                      scrollEnabled={isExpanded}
                    >
                      {/* Priority Badge */}
                      <View className="mb-4">
                        <View
                          className="self-start px-4 py-2 rounded-full"
                          style={{ backgroundColor: `${getPriorityColor(report.priority)}20` }}
                        >
                          <Text
                            className="font-dm-sans-bold text-xs uppercase"
                            style={{ color: getPriorityColor(report.priority) }}
                          >
                            {report.priority}
                          </Text>
                        </View>
                      </View>

                      {/* Title */}
                      <Text className="text-white font-dm-sans-bold text-2xl mb-3">
                        {report.title}
                      </Text>

                      {/* Meta Info */}
                      <View className="flex-row items-center mb-4 gap-3">
                        <View className="flex-row items-center">
                          <Ionicons name="location" size={14} color="#9ca3af" />
                          <Text className="text-gray-400 font-dm-sans text-xs ml-1">
                            {report.location}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons name="time" size={14} color="#9ca3af" />
                          <Text className="text-gray-400 font-dm-sans text-xs ml-1">
                            {new Date(report.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>

                      {/* Description */}
                      <View className="bg-white/5 rounded-2xl p-4 mb-4">
                        <Text className="text-white/90 font-dm-sans text-sm leading-5">
                          {report.description}
                        </Text>
                      </View>

                      {isExpanded && (
                        <>
                          {/* Status */}
                          <View className="bg-white/5 rounded-2xl p-4 mb-4">
                            <Text className="text-gray-400 font-dm-sans-bold text-xs uppercase mb-2">
                              Status
                            </Text>
                            <View className="flex-row items-center">
                              <View
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: getStatusColor(report.status) }}
                              />
                              <Text className="text-white font-dm-sans-bold capitalize">
                                {report.status}
                              </Text>
                            </View>
                          </View>

                          {/* Type */}
                          <View className="bg-white/5 rounded-2xl p-4 mb-4">
                            <Text className="text-gray-400 font-dm-sans-bold text-xs uppercase mb-2">
                              Incident Type
                            </Text>
                            <Text className="text-white font-dm-sans-bold capitalize">
                              {report.type}
                            </Text>
                          </View>

                          {/* Report ID */}
                          <View className="bg-white/5 rounded-2xl p-4">
                            <Text className="text-gray-400 font-dm-sans-bold text-xs uppercase mb-2">
                              Report ID
                            </Text>
                            <Text className="text-white/70 font-dm-sans text-sm">
                              #{report.id.slice(0, 8)}
                            </Text>
                          </View>
                        </>
                      )}

                      {!isExpanded && (
                        <View className="items-center mt-4">
                          <Text className="text-gray-500 font-dm-sans text-xs">
                            Tap to expand
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          ))}
        </PagerView>
      </View>

      {/* Navigation Hints */}
      {!isExpanded && (
        <>
          {currentPage > 0 && (
            <View className="absolute left-4 top-1/2 -translate-y-6 z-10">
              <TouchableOpacity
                onPress={() => pagerRef.current?.setPage(currentPage - 1)}
                className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
              >
                <Ionicons name="chevron-back" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          )}
          
          {currentPage < reports.length - 1 && (
            <View className="absolute right-4 top-1/2 -translate-y-6 z-10">
              <TouchableOpacity
                onPress={() => pagerRef.current?.setPage(currentPage + 1)}
                className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
              >
                <Ionicons name="chevron-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}
