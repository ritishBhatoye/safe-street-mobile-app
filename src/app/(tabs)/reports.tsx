import React, { useState, useMemo, useRef } from "react";
import { View, FlatList, RefreshControl, StatusBar, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ActionSheetRef } from "react-native-actions-sheet";
import { useReports } from "@/hooks/useReports";
import { ReportCard } from "@/components/reports/ReportCard";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsEmptyState } from "@/components/reports/ReportsEmptyState";
import { ReportsFilterSheet, ReportFilters } from "@/components/reports/ReportsFilterSheet";
import { ReportsLoadingSkeleton } from "@/components/reports/ReportsLoadingSkeleton";
import { Report } from "@/services/reports.service";

const ITEMS_PER_PAGE = 10;

export default function ReportsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const filterSheetRef = useRef<ActionSheetRef>(null);
  const [filters, setFilters] = useState<ReportFilters>({
    status: [],
    priority: [],
    sortBy: 'newest',
  });
  
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

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    let filtered = [...reports];
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((report) => 
        report.title?.toLowerCase().includes(query) ||
        report.description?.toLowerCase().includes(query) ||
        report.type?.toLowerCase().includes(query) ||
        report.location?.toLowerCase().includes(query) ||
        report.status?.toLowerCase().includes(query) ||
        report.priority?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter((report) => 
        filters.status.includes(report.status)
      );
    }
    
    // Apply priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter((report) => 
        filters.priority.includes(report.priority)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (filters.sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (filters.sortBy === 'priority') {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });
    
    return filtered;
  }, [reports, searchQuery, filters]);

  const handleFilterPress = () => {
    filterSheetRef.current?.show();
  };

  const handleResetFilters = () => {
    setFilters({
      status: [],
      priority: [],
      sortBy: 'newest',
    });
  };

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
          style={{flex:1}}
      
        >
          <SafeAreaView className="flex-1" edges={["top"]}>
            <StatusBar barStyle="dark-content" />
            <ReportsLoadingSkeleton />
          </SafeAreaView>
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
            data={filteredReports}
            renderItem={({ item, index }) => (
              <ReportCard item={item} index={index} onPress={handleReportPress} />
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <ReportsHeader 
                totalReports={totalReports} 
                reports={reports}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onFilterPress={handleFilterPress}
              />
            }
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
                searchQuery.trim() ? (
                  <View className="py-12 items-center">
                    <Text className="text-gray-500 font-dm-sans-bold text-lg mb-2">No results found</Text>
                    <Text className="text-gray-400 font-dm-sans text-sm">Try a different search term</Text>
                  </View>
                ) : (
                  <ReportsEmptyState error={error} onRetry={onRefresh} />
                )
              ) : null
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
          />

          {/* Filter Sheet */}
          <ReportsFilterSheet
            sheetRef={filterSheetRef}
            filters={filters}
            onFiltersChange={setFilters}
            onReset={handleResetFilters}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
