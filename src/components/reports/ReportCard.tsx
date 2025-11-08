import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

const getTypeColor = (type: Report["type"]) => {
  switch (type) {
    case "incident":
      return "bg-red-500";
    case "hazard":
      return "bg-orange-500";
    case "maintenance":
      return "bg-blue-500";
    case "other":
      return "bg-gray-500";
  }
};

const getPriorityColor = (priority: Report["priority"]) => {
  switch (priority) {
    case "critical":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
  }
};

const getStatusColor = (status: Report["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "in-progress":
      return "bg-blue-100 text-blue-700";
    case "resolved":
      return "bg-green-100 text-green-700";
    case "closed":
      return "bg-gray-100 text-gray-700";
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
        className="mb-4 bg-white rounded-2xl shadow-md p-4 border border-gray-100"
        activeOpacity={0.8}
        onPress={() => onPress?.(item)}
      >
        {/* Header with type and priority */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-row items-center flex-1">
            <View className={`rounded-xl p-2 mr-3 ${getTypeColor(item.type)}`}>
              <Ionicons 
                name={getTypeIcon(item.type) as any} 
                size={20} 
                color="white" 
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900 mb-1">
                {item.title}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={12} color="#9ca3af" />
                <Text className="text-xs text-gray-500 ml-1">
                  {formatDate(item.created_at)}
                </Text>
              </View>
            </View>
          </View>
          <View className={`px-3 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
            <Text className="text-xs font-bold text-white capitalize">
              {item.priority}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text className="text-sm text-gray-700 mb-3" numberOfLines={2}>
          {item.description}
        </Text>

        {/* Footer with location and status */}
        <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
          <View className="flex-row items-center flex-1">
            <Ionicons name="location" size={14} color="#6b7280" />
            <Text className="text-xs text-gray-600 ml-1 flex-1" numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
            <Text className="text-xs font-medium capitalize">
              {item.status.replace("-", " ")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};