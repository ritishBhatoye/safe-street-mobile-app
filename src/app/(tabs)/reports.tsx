import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { reportsService, Report } from "@/services/reports.service";

const ITEMS_PER_PAGE = 10;

export default function ReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportsService.getReports(page, ITEMS_PER_PAGE);
      setReports(response.reports);
      setTotalPages(response.totalPages);
      setTotalReports(response.total);
      setCurrentPage(page);
    } catch (err: any) {
      console.error("Error fetching reports:", err);
      const errorMessage = err?.message || "Failed to load reports";
      setError(errorMessage);
      // Set empty state on error
      setReports([]);
      setTotalPages(1);
      setTotalReports(0);
      setCurrentPage(1);
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

  const ReportCard = ({ item, index }: { item: Report; index: number }) => {
    const scaleAnim = React.useRef(new Animated.Value(0)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          delay: index * 50,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          delay: index * 50,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, [scaleAnim, fadeAnim, index]);

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
          flex: 1,
        }}
      >
        <TouchableOpacity
          className="mb-4 rounded-3xl overflow-hidden"
          activeOpacity={0.9}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <BlurView intensity={20} tint="light" className="overflow-hidden">
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.7)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-5"
            >
              {/* Header */}
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-row items-center flex-1">
                  <LinearGradient
                    colors={
                      item.type === "incident"
                        ? ["#ef4444", "#dc2626"]
                        : item.type === "hazard"
                          ? ["#f97316", "#ea580c"]
                          : item.type === "maintenance"
                            ? ["#3b82f6", "#2563eb"]
                            : ["#6b7280", "#4b5563"]
                    }
                    className="rounded-2xl p-3 mr-3"
                    style={{
                      shadowColor: getTypeIconColor(item.type),
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <Ionicons name={getTypeIcon(item.type) as any} size={22} color="#ffffff" />
                  </LinearGradient>
                  <View className="flex-1">
                    <Text className="text-base font-dm-sans-bold text-gray-900 mb-1">
                      {item.title}
                    </Text>
                    <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={12} color="#9ca3af" />
                      <Text className="text-xs text-gray-500 font-dm-sans ml-1">
                        {formatDate(item.created_at)}
                      </Text>
                    </View>
                  </View>
                </View>
                <LinearGradient
                  colors={
                    item.priority === "critical"
                      ? ["#ef4444", "#dc2626"]
                      : item.priority === "high"
                        ? ["#f97316", "#ea580c"]
                        : item.priority === "medium"
                          ? ["#eab308", "#ca8a04"]
                          : ["#22c55e", "#16a34a"]
                  }
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    shadowColor:
                      item.priority === "critical"
                        ? "#ef4444"
                        : item.priority === "high"
                          ? "#f97316"
                          : item.priority === "medium"
                            ? "#eab308"
                            : "#22c55e",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Text className="text-xs font-dm-sans-bold text-white capitalize">
                    {item.priority}
                  </Text>
                </LinearGradient>
              </View>

              {/* Description */}
              <Text className="text-sm text-gray-700 font-dm-sans mb-4 leading-5" numberOfLines={2}>
                {item.description}
              </Text>

              {/* Footer */}
              <View className="flex-row items-center justify-between pt-3 border-t border-gray-200/50">
                <View className="flex-row items-center flex-1">
                  <View className="bg-blue-50 rounded-full p-1.5 mr-2">
                    <Ionicons name="location" size={12} color="#3b82f6" />
                  </View>
                  <Text className="text-xs text-gray-600 font-dm-sans flex-1" numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${
                    item.status === "resolved"
                      ? "bg-green-100"
                      : item.status === "in-progress"
                        ? "bg-blue-100"
                        : item.status === "closed"
                          ? "bg-gray-100"
                          : "bg-yellow-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-dm-sans-bold capitalize ${getStatusColor(
                      item.status,
                    )}`}
                  >
                    {item.status.replace("-", " ")}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1">
        <LinearGradient
          colors={["#eff6ff", "#faf5ff", "#f5f3ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{flex:1,justifyContent:'center',alignItems:'center'}}

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

  const renderReport = ({ item, index }: { item: Report; index: number }) => (
    <ReportCard item={item} index={index} />
  );

  const renderPagination = () => (
    <View className="mb-4 rounded-3xl overflow-hidden">
      <BlurView intensity={30} tint="light">
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.85)"]}
          className="flex-row items-center justify-between px-5 py-4"
        >
          <TouchableOpacity
            onPress={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
            style={{
              shadowColor: currentPage === 1 || loading ? "transparent" : "#3b82f6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <LinearGradient
              colors={
                currentPage === 1 || loading ? ["#f3f4f6", "#e5e7eb"] : ["#3b82f6", "#2563eb"]
              }
              className="flex-row items-center px-5 py-3 rounded-2xl"
            >
              <Ionicons
                name="chevron-back"
                size={18}
                color={currentPage === 1 || loading ? "#9ca3af" : "#ffffff"}
              />
              <Text
                className={`ml-2 font-dm-sans-bold ${
                  currentPage === 1 || loading ? "text-gray-400" : "text-white"
                }`}
              >
                Prev
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View className="bg-white/60 px-4 py-2 rounded-2xl">
            <Text className="text-sm font-dm-sans-bold text-gray-800">
              {currentPage} / {totalPages}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || loading}
            style={{
              shadowColor: currentPage === totalPages || loading ? "transparent" : "#3b82f6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <LinearGradient
              colors={
                currentPage === totalPages || loading
                  ? ["#f3f4f6", "#e5e7eb"]
                  : ["#3b82f6", "#2563eb"]
              }
              className="flex-row items-center px-5 py-3 rounded-2xl"
            >
              <Text
                className={`mr-2 font-dm-sans-bold ${
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
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </BlurView>
    </View>
  );

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

          {/* Header */}
          <View className="px-6 pt-4 pb-6">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-4xl font-dm-sans-bold text-gray-900 mb-1">Reports</Text>
                <View className="flex-row items-center">
                  <View className="bg-blue-500 rounded-full w-2 h-2 mr-2" />
                  <Text className="text-sm font-dm-sans-medium text-gray-600">
                    {totalReports} total reports
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="rounded-2xl overflow-hidden"
                style={{
                  shadowColor: "#3b82f6",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <BlurView intensity={40} tint="light">
                  <LinearGradient
                    colors={["rgba(59, 130, 246, 0.9)", "rgba(37, 99, 235, 0.9)"]}
                    className="p-3"
                  >
                    <Ionicons name="filter" size={24} color="#ffffff" />
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 rounded-2xl overflow-hidden">
                <BlurView intensity={30} tint="light">
                  <LinearGradient
                    colors={["rgba(239, 68, 68, 0.15)", "rgba(220, 38, 38, 0.1)"]}
                    className="p-4"
                  >
                    <Ionicons name="alert-circle" size={20} color="#ef4444" />
                    <Text className="text-2xl font-dm-sans-bold text-gray-900 mt-2">
                      {reports.filter((r) => r.priority === "critical").length}
                    </Text>
                    <Text className="text-xs font-dm-sans text-gray-600">Critical</Text>
                  </LinearGradient>
                </BlurView>
              </View>
              <View className="flex-1 rounded-2xl overflow-hidden">
                <BlurView intensity={30} tint="light">
                  <LinearGradient
                    colors={["rgba(34, 197, 94, 0.15)", "rgba(22, 163, 74, 0.1)"]}
                    className="p-4"
                  >
                    <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                    <Text className="text-2xl font-dm-sans-bold text-gray-900 mt-2">
                      {reports.filter((r) => r.status === "resolved").length}
                    </Text>
                    <Text className="text-xs font-dm-sans text-gray-600">Resolved</Text>
                  </LinearGradient>
                </BlurView>
              </View>
            </View>
          </View>

          {/* Reports List */}
          <FlatList
            data={reports}
            renderItem={renderReport}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
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
                <View className="items-center justify-center py-20 px-6">
                  <View className="bg-white/60 rounded-full p-8 mb-4">
                    <Ionicons
                      name={error ? "alert-circle-outline" : "document-text-outline"}
                      size={64}
                      color={error ? "#ef4444" : "#d1d5db"}
                    />
                  </View>
                  <Text className="text-gray-700 font-dm-sans-bold text-lg text-center">
                    {error ? "Error Loading Reports" : "No reports found"}
                  </Text>
                  <Text className="text-gray-500 font-dm-sans text-sm mt-2 text-center">
                    {error || "Pull down to refresh"}
                  </Text>
                  {error && (
                    <TouchableOpacity
                      onPress={() => fetchReports(1)}
                      className="mt-4 rounded-2xl overflow-hidden"
                    >
                      <LinearGradient colors={["#3b82f6", "#2563eb"]} className="px-6 py-3">
                        <Text className="text-white font-dm-sans-bold">Try Again</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                  {!error && (
                    <View className="mt-6 bg-blue-50 rounded-2xl p-4">
                      <Text className="text-blue-900 font-dm-sans-bold text-sm mb-2">
                        Setup Required
                      </Text>
                      <Text className="text-blue-700 font-dm-sans text-xs leading-5">
                        1. Run CREATE_REPORTS_TABLE.sql in Supabase{"\n"}
                        2. Run INSERT_MOCK_REPORTS.sql to add data{"\n"}
                        3. Pull down to refresh
                      </Text>
                    </View>
                  )}
                </View>
              ) : null
            }
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
