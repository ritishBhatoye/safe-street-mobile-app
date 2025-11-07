import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ReportsEmptyStateProps {
  error: string | null;
  onRetry: () => void;
}

export const ReportsEmptyState: React.FC<ReportsEmptyStateProps> = ({ error, onRetry }) => {
  return (
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
        <TouchableOpacity onPress={onRetry} className="mt-4 rounded-2xl overflow-hidden">
          <LinearGradient colors={["#3b82f6", "#2563eb"]} className="px-6 py-3">
            <Text className="text-white font-dm-sans-bold">Try Again</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
      {!error && (
        <View className="mt-6 bg-blue-50 rounded-2xl p-4">
          <Text className="text-blue-900 font-dm-sans-bold text-sm mb-2">Setup Required</Text>
          <Text className="text-blue-700 font-dm-sans text-xs leading-5">
            1. Run CREATE_REPORTS_TABLE.sql in Supabase{"\n"}
            2. Run INSERT_MOCK_REPORTS.sql to add data{"\n"}
            3. Pull down to refresh
          </Text>
        </View>
      )}
    </View>
  );
};
