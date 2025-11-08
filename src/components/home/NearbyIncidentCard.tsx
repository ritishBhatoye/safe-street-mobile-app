import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NearbyIncidentCardProps {
  incident: NearbyIncidentType;
  onPress?: () => void;
}

export const NearbyIncidentCard: React.FC<NearbyIncidentCardProps> = ({ incident, onPress }) => {
  const getTypeIcon = () => {
    switch (incident.type) {
      case "incident":
        return "alert-circle";
      case "hazard":
        return "warning";
      case "maintenance":
        return "construct";
      default:
        return "document-text";
    }
  };

  const getPriorityColor = () => {
    switch (incident.priority) {
      case "critical":
        return "#EF4444";
      case "high":
        return "#F97316";
      case "medium":
        return "#F59E0B";
      default:
        return "#22C55E";
    }
  };

  const getTimeAgo = () => {
    const now = new Date();
    const created = new Date(incident.created_at);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Pressable
      onPress={onPress}
      className="w-64 bg-white dark:bg-gray-800 rounded-2xl p-4 mr-3 shadow-sm border border-gray-100 dark:border-gray-700"
      style={{ elevation: 2 }}
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${getPriorityColor()}20` }}
        >
          <Ionicons name={getTypeIcon()} size={20} color={getPriorityColor()} />
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="location" size={12} color="#9CA3AF" />
          <Text className="text-xs font-dm-sans-medium text-gray-500 dark:text-gray-400">
            {incident.distance?.toFixed(1)} km
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text className="text-base font-dm-sans-semibold text-gray-900 dark:text-white mb-2" numberOfLines={2}>
        {incident.title}
      </Text>

      {/* Footer */}
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-dm-sans text-gray-500 dark:text-gray-400">
          {getTimeAgo()}
        </Text>
        <View
          className="px-2 py-1 rounded-full"
          style={{ backgroundColor: `${getPriorityColor()}20` }}
        >
          <Text className="text-xs font-dm-sans-semibold" style={{ color: getPriorityColor() }}>
            {incident.priority}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
