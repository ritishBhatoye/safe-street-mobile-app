import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { reportsService, Report } from "@/services/reports.service";

const ITEMS_PER_PAGE = 10;

export default function ReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const response = await reportsService.getReports(page, ITEMS_PER_PAGE);
      setReports(response.reports);
      setTotalPages(response.totalPages);
      setTotalReports(response.total);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReports(currentPage);
    setRefreshing(false);
  }, [currentPage, fetchReports]);

  const handlePageChange = useCallback(
    async (newPage: number) => {
      await fetchReports(newPage);
    },
    [fetchReports],
  );

  const getTypeIcon = (type: Report["type"]) => {
    switch (type) {
      case "incident":
        return "alert-circle";
      case "hazard":
        return "warning";
      case "maintenance":
        return "construct";
      case "other":
        return "document-text";
    }
  };

  const getTypeColor = (type: Report["type"]) => {
    switch (type) {
      case "incident":
        return "bg-red-100";
      case "hazard":
        return "bg-orange-100";
      case "maintenance":
        return "bg-blue-100";
      case "other":
        return "bg-gray-100";
    }
  };

  const getTypeIconColor = (type: Report["type"]) => {
    switch (type) {
      case "incident":
        return "#ef4444";
      case "hazard":
        return "#f97316";
      case "maintenance":
        return "#3b82f6";
      case "other":
        return "#6b7280";
    }
  };

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "in-progress":
        return "text-blue-600";
      case "resolved":
        return "text-green-600";
      case "closed":
        return "text-gray-600";
    }
  };

  const getPriorityBadge = (priority: Report["priority"]) => {
    const colors = {
      low: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-orange-100 text-orange-700",
      critical: "bg-red-100 text-red-700",
    };
    return colors[priority];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 font-dm-sans mt-4">Loading reports...</Text>
      </SafeAreaView>
    );
  }

  const renderReport = ({ item }: { item: Report }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View className={`${getTypeColor(item.type)} rounded-full p-2 mr-3`}>
            <Ionicons
              name={getTypeIcon(item.type) as any}
              size={20}
              color={getTypeIconColor(item.type)}
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-dm-sans-bold text-gray-900 mb-1">{item.title}</Text>
            <Text className="text-xs text-gray-500 font-dm-sans">
              {formatDate(item.created_at)}
            </Text>
          </View>
        </View>
        <View className={`px-2 py-1 rounded-full ${getPriorityBadge(item.priority)}`}>
          <Text className="text-xs font-dm-sans-medium capitalize">{item.priority}</Text>
        </View>
      </View>

      <Text className="text-sm text-gray-600 font-dm-sans mb-3" numberOfLines={2}>
        {item.description}
      </Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={14} color="#6b7280" />
          <Text className="text-xs text-gray-500 font-dm-sans ml-1" numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <Text className={`text-xs font-dm-sans-medium capitalize ${getStatusColor(item.status)}`}>
          {item.status.replace("-", " ")}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPagination = () => (
    <View className="flex-row items-center justify-between px-4 py-4 bg-white rounded-2xl mb-4">
      <TouchableOpacity
        onPress={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || loading}
        className={`flex-row items-center px-4 py-2 rounded-xl ${
          currentPage === 1 || loading ? "bg-gray-100" : "bg-blue-500"
        }`}
      >
        <Ionicons
          name="chevron-back"
          size={18}
          color={currentPage === 1 || loading ? "#9ca3af" : "#ffffff"}
        />
        <Text
          className={`ml-1 font-dm-sans-medium ${
            currentPage === 1 || loading ? "text-gray-400" : "text-white"
          }`}
        >
          Previous
        </Text>
      </TouchableOpacity>

      <View className="flex-row items-center">
        <Text className="text-sm font-dm-sans-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || loading}
        className={`flex-row items-center px-4 py-2 rounded-xl ${
          currentPage === totalPages || loading ? "bg-gray-100" : "bg-blue-500"
        }`}
      >
        <Text
          className={`mr-1 font-dm-sans-medium ${
            currentPage === totalPages || loading ? "text-gray-400" : "text-white"
          }`}
        >
          Next
        </Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={currentPage === totalPages || loading ? "#9ca3af" : "#ffffff"}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <LinearGradient
        colors={["#3b82f6", "#2563eb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 py-6 rounded-b-3xl"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-dm-sans-bold text-white mb-1">Reports</Text>
            <Text className="text-sm font-dm-sans text-blue-100">{totalReports} total reports</Text>
          </View>
          <TouchableOpacity className="bg-white/20 rounded-full p-3">
            <Ionicons name="filter" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Reports List */}
      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
          />
        }
        ListFooterComponent={reports.length > 0 ? renderPagination : null}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="document-text-outline" size={64} color="#d1d5db" />
              <Text className="text-gray-500 font-dm-sans-medium mt-4">No reports found</Text>
              <Text className="text-gray-400 font-dm-sans text-sm mt-2">Pull down to refresh</Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
