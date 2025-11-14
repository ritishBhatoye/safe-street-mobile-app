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
import { BlurView } from 'expo-blur';
import { Report } from '@/services/reports.service';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.90;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.68;

export default function ReportDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);

  const reports: Report[] = params.reports ? JSON.parse(params.reports as string) : [];
  const initialIndex = params.initialIndex ? parseInt(params.initialIndex as string) : 0;

  const [currentPage, setCurrentPage] = useState(initialIndex);
  const [isExpanded, setIsExpanded] = useState(false);

  // Animation
  const scale = useSharedValue(0.92);
  const radius = useSharedValue(28);

  const expandCard = () => {
    setIsExpanded(true);
    scale.value = withSpring(1, { damping: 15 });
    radius.value = withSpring(0, { damping: 15 });
  };

  const collapseCard = () => {
    setIsExpanded(false);
    scale.value = withSpring(0.92, { damping: 15 });
    radius.value = withSpring(28, { damping: 15 });
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderRadius: radius.value,
  }));

  if (reports.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <Text className="text-white">No reports found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Colors
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

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Dimmed Overlay when expanded */}
      {isExpanded && (
        <Animated.View
          className="absolute inset-0 bg-black/60 z-0"
          pointerEvents="none"
        />
      )}

      {/* Header */}
      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 z-20">
        <BlurView intensity={20} tint="dark" className="px-4 py-3">
          <View className="flex-row items-center justify-between">

            <TouchableOpacity
              onPress={() => (isExpanded ? collapseCard() : router.back())}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            >
              <Ionicons name={isExpanded ? "arrow-down" : "close"} size={20} color="#fff" />
            </TouchableOpacity>

            <Text className="text-white font-dm-sans-bold text-base">
              {currentPage + 1} / {reports.length}
            </Text>

            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
              <Ionicons name="ellipsis-horizontal" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </SafeAreaView>

      {/* PagerView */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={initialIndex}
        onPageSelected={(e) => {
          setCurrentPage(e.nativeEvent.position);
          collapseCard();
        }}
      >
        {reports.map((report) => (
          <View key={report.id} className="flex-1 items-center justify-center px-4">

            {/* Animated Report Card */}
            <Animated.View
              style={[
                {
                  width: isExpanded ? SCREEN_WIDTH : CARD_WIDTH,
                  height: isExpanded ? SCREEN_HEIGHT : CARD_HEIGHT,
                  overflow: 'hidden',
                },
                cardStyle,
              ]}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => (isExpanded ? collapseCard() : expandCard())}
                className="flex-1"
              >
                <LinearGradient
                  colors={['#1c1c1c', '#000000']}
                  className="flex-1"
                  style={{flex:1}}
                >
                  <ScrollView
                    contentContainerStyle={{ padding: 22 }}
                    scrollEnabled={isExpanded}
                    showsVerticalScrollIndicator={false}
                  >
                    {/* Priority Badge */}
                    <View
                      className="self-start px-4 py-2 rounded-full mb-4"
                      style={{ backgroundColor: `${getPriorityColor(report.priority)}20` }}
                    >
                      <Text className="font-dm-sans-bold text-xs uppercase" style={{ color: getPriorityColor(report.priority) }}>
                        {report.priority}
                      </Text>
                    </View>

                    {/* Title */}
                    <Text className="text-white font-dm-sans-bold text-2xl mb-4">
                      {report.title}
                    </Text>

                    {/* Location & Date */}
                    <View className="flex-row items-center gap-4 mb-6">
                      <View className="flex-row items-center">
                        <Ionicons name="location" size={14} color="#9ca3af" />
                        <Text className="text-gray-400 ml-1">{report.location}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="time" size={14} color="#9ca3af" />
                        <Text className="text-gray-400 ml-1">
                          {new Date(report.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>

                    {/* Description */}
                    <BlurView intensity={40} tint="dark" className="rounded-3xl p-4 mb-5">
                      <Text className="text-white/90">{report.description}</Text>
                    </BlurView>

                    {isExpanded && (
                      <>
                        {/* Status */}
                        <BlurView intensity={40} tint="dark" className="rounded-3xl p-4 mb-5">
                          <Text className="text-gray-400 text-xs uppercase mb-2">Status</Text>
                          <View className="flex-row items-center">
                            <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: getStatusColor(report.status) }} />
                            <Text className="text-white capitalize">{report.status}</Text>
                          </View>
                        </BlurView>

                        {/* Type */}
                        <BlurView intensity={40} tint="dark" className="rounded-3xl p-4 mb-5">
                          <Text className="text-gray-400 text-xs uppercase mb-2">Incident Type</Text>
                          <Text className="text-white capitalize">{report.type}</Text>
                        </BlurView>

                        {/* ID */}
                        <BlurView intensity={40} tint="dark" className="rounded-3xl p-4">
                          <Text className="text-gray-400 text-xs uppercase mb-2">Report ID</Text>
                          <Text className="text-white/80">#{report.id.slice(0, 8)}</Text>
                        </BlurView>
                      </>
                    )}
                  </ScrollView>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

          </View>
        ))}
      </PagerView>
    </View>
  );
}
