import React, { useState, useMemo, useRef } from "react";
import { View, FlatList, RefreshControl, StatusBar, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ActionSheetRef } from "react-native-actions-sheet";
import { useRouter } from "expo-router";
import { useReports } from "@/hooks/useReports";
import { ReportCard } from "@/components/reports/ReportCard";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsEmptyState } from "@/components/reports/ReportsEmptyState";
import { ReportsFilterSheet, ReportFilters } from "@/components/reports/ReportsFilterSheet";
import { ReportsLoadingSkeleton } from "@/components/reports/ReportsLoadingSkeleton";
import { Incident } from "@/types/incidents";

const ITEMS_PER_PAGE = 10;

export default function ReportsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const filterSheetRef = useRef<ActionSheetRef>(null);
  const [filters, setFilters] = useState<ReportFilters>({
    status: [],
    severity: [],
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
        report.address?.toLowerCase().includes(query) ||
        report.city?.toLowerCase().includes(query) ||
        report.status?.toLowerCase().includes(query) ||
        report.severity?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter((report) => 
        filters.status.includes(report.status)
      );
    }
    
    // Apply severity filter
    if (filters.severity.length > 0) {
      filtered = filtered.filter((report) => 
        filters.severity.includes(report.severity)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (filters.sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (filters.sortBy === 'severity') {
        const severityOrder = { critical: 0, danger: 1, caution: 2, safe: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
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
      severity: [],
      sortBy: 'newest',
    });
  };

  const handleReportPress = (report: Incident) => {
    const reportIndex = filteredReports.findIndex((r) => r.id === report.id);
    router.push({
      pathname: '/(tabs)/reports/detail',
      params: {
        reports: JSON.stringify(filteredReports),
        initialIndex: reportIndex.toString(),
      },
    });
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
