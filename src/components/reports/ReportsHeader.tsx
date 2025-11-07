import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Report } from "@/services/reports.service";

interface ReportsHeaderProps {
  totalReports: number;
  reports: Report[];
  onFilterPress?: () => void;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  totalReports,
  reports,
  onFilterPress,
}) => {
  const criticalCount = reports.filter((r) => r.priority === "critical").length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;

  return (
    <View className=" pt-4 pb-6">
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
          onPress={onFilterPress}
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
              colors={["rgba(59, 130, 246, 0.9)", "rgba(37, 99, 235, 0.9)","rgba(37, 99, 255, 0.4)"]}
              style={{padding:12}}
            >
              <Ionicons name="filter" size={24} color="#ffffff" />
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View className="flex-row gap-3 mb-4 justify-around">
        <View className="flex-1 rounded-2xl overflow-hidden">
          <BlurView intensity={100} tint="prominent">
            <LinearGradient
              colors={["rgba(239, 68, 68, 0.15)", "rgba(220, 38, 38, 0.1)"]}
              style={{padding:20}}
            >
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text className="text-2xl font-dm-sans-bold text-gray-900 mt-2">
                {criticalCount}
              </Text>
              <Text className="text-xs font-dm-sans text-gray-600">Critical</Text>
            </LinearGradient>
          </BlurView>
        </View>
        <View className="flex-1 rounded-2xl overflow-hidden">
          <BlurView intensity={30} tint="light">
            <LinearGradient
              colors={["rgba(34, 197, 94, 0.15)", "rgba(22, 163, 74, 0.1)"]}
           style={{padding:20}}
            >
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              <Text className="text-2xl font-dm-sans-bold text-gray-900 mt-2">
                {resolvedCount}
              </Text>
              <Text className="text-xs font-dm-sans text-gray-600">Resolved</Text>
            </LinearGradient>
          </BlurView>
        </View>
      </View>
    </View>
  );
};
