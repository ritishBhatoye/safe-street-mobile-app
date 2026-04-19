import React from "react";
import { ScrollView, RefreshControl, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useHomeData } from "@/hooks/useHomeData";
import {
  CommunityActivityPulse,
  ContributeCTA,
  EmergencyCard,
  HeroSafetySnapshot,
  HomeLoadingSkeleton,
  HotspotsNearYou,
  MiniMapPreview,
  QuickActions,
  RecentIncidentsNearby,
  SafetyTips,
  UserImpactTeaser,
} from "@/components/home";
import { ErrorState } from "@/components/elements";

export default function HomeScreen() {
  const router = useRouter();
  const {
    safetyScore,
    nearbyIncidents,
    hotspots,
    communityActivity,
    userLocation,
    loading,
    refreshing,
    error,
    onRefresh,
  } = useHomeData();

  if (loading) {
    return <HomeLoadingSkeleton />;
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <ErrorState title="Unable to Load Dashboard" message={error} onRetry={onRefresh} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3399FF"
            colors={["#3399FF"]}
          />
        }
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-3xl font-dm-sans-bold text-gray-900 dark:text-white mb-1">
            Safe Street
          </Text>
          <Text className="text-base font-dm-sans text-gray-600 dark:text-gray-400">
            Your safety dashboard
          </Text>
        </View>

        <View className="gap-6 px-6">
          {/* Hero Safety Snapshot */}
          {safetyScore && <HeroSafetySnapshot safetyScore={safetyScore} />}

          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Incidents Nearby */}
          <RecentIncidentsNearby incidents={nearbyIncidents} />

          {/* Hotspots Near You */}
          {hotspots.length > 0 && <HotspotsNearYou hotspots={hotspots} />}

          {/* Community Activity Pulse */}
          {communityActivity && <CommunityActivityPulse activity={communityActivity} />}

          {/* Mini Map Preview */}
          <MiniMapPreview
            userLocation={userLocation}
            incidents={nearbyIncidents}
            onPress={() => router.push("/(tabs)/map")}
          />

          {/* Emergency Card */}
          <EmergencyCard />

          {/* Contribute CTA */}
          <ContributeCTA />

          {/* Safety Tips */}
          <SafetyTips />

          {/* User Impact Teaser */}
          <UserImpactTeaser />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
