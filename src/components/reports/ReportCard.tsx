import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Report } from "@/services/reports.service";

interface ReportCardProps {
  item: Report;
  index: number;
  onPress?: (report: Report) => void;
}

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

const getTypeGradient = (type: Report["type"]): [string, string] => {
  switch (type) {
    case "incident":
      return ["#ef4444", "#dc2626"];
    case "hazard":
      return ["#f97316", "#ea580c"];
    case "maintenance":
      return ["#3b82f6", "#2563eb"];
    case "other":
      return ["#6b7280", "#4b5563"];
  }
};

const getPriorityGradient = (priority: Report["priority"]): [string, string] => {
  switch (priority) {
    case "critical":
      return ["#ef4444", "#dc2626"];
    case "high":
      return ["#f97316", "#ea580c"];
    case "medium":
      return ["#eab308", "#ca8a04"];
    case "low":
      return ["#22c55e", "#16a34a"];
  }
};

const getPriorityShadowColor = (priority: Report["priority"]) => {
  switch (priority) {
    case "critical":
      return "#ef4444";
    case "high":
      return "#f97316";
    case "medium":
      return "#eab308";
    case "low":
      return "#22c55e";
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

const getStatusBgColor = (status: Report["status"]) => {
  switch (status) {
    case "resolved":
      return "bg-green-100";
    case "in-progress":
      return "bg-blue-100";
    case "closed":
      return "bg-gray-100";
    case "pending":
      return "bg-yellow-100";
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

export const ReportCard: React.FC<ReportCardProps> = ({ item, index, onPress }) => {
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
      }}
    >
      <TouchableOpacity
        className="mb-4 rounded-3xl overflow-hidden"
        activeOpacity={0.9}
        onPress={() => onPress?.(item)}
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
                  colors={getTypeGradient(item.type)}
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
                colors={getPriorityGradient(item.priority)}
                className="px-3 py-1.5 rounded-full"
                style={{
                  shadowColor: getPriorityShadowColor(item.priority),
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
              <View className={`px-3 py-1 rounded-full ${getStatusBgColor(item.status)}`}>
                <Text className={`text-xs font-dm-sans-bold capitalize ${getStatusColor(item.status)}`}>
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
