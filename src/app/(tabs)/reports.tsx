import React from "react";
import { View, FlatList, RefreshControl, StatusBar, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useReports } from "@/hooks/useReports";
import { ReportCard } from "@/components/reports/ReportCard";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsEmptyState } from "@/components/reports/ReportsEmptyState";
import { Report } from "@/services/reports.service";

const ITEMS_PER_PAGE = 10;

export default function ReportsScreen() {
  const {
    reports,
    totalReports,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    onRefresh,
    loadMore,
  } = useReports(ITEMS_PER_PAGE);

  const handleReportPress = (report: Report) => {
    console.log("Report pressed:", report.id);
    // TODO: Navigate to report details
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="small" color="#3b82f6" />
        <Text className="text-gray-500 font-dm-sans text-sm mt-2">Loading more...</Text>
      </View>
    );
  };

  const renderEndMessage = () => {
    if (loading || loadingMore || hasMore || reports.length === 0) return null;
    
    return (
      <View className="py-6 items-center">
        <Text className="text-gray-400 font-dm-sans text-sm">You&apos;ve reached the end</Text>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1">
        <LinearGradient
          colors={["#eff6ff", "#faf5ff", "#f5f3ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1 items-center justify-center"
        >
          <View className="items-center">
            <View className="bg-white/80 rounded-full p-6 mb-4">
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
            <Text className="text-gray-700 font-dm-sans-bold text-lg">Loading reports...</Text>
            <Text className="text-gray-500 font-dm-sans text-sm mt-2">Please wait</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#eff6ff", "#faf5ff", "#f5f3ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{flex:1}}
        className="flex-1"
      >
        <SafeAreaView className="flex-1" edges={["top"]}>
          <StatusBar barStyle="dark-content" />

          <FlatList
            data={reports}
            renderItem={({ item, index }) => (
              <ReportCard item={item} index={index} onPress={handleReportPress} />
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<ReportsHeader totalReports={totalReports} reports={reports} />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#3b82f6"
                colors={["#3b82f6"]}
              />
            }
            ListFooterComponent={
              <>
                {renderFooter()}
                {renderEndMessage()}
              </>
            }
            ListEmptyComponent={
              !loading ? (
                <ReportsEmptyState error={error} onRetry={onRefresh} />
              ) : null
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
