import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Report } from "@/services/reports.service";
import { router } from "expo-router";

interface ReportsHeaderProps {
  totalReports: number;
  reports: Report[];
  onFilterPress?: () => void;
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  totalReports,
  reports,
  onFilterPress,
  searchQuery = "",
  onSearchChange,
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchWidth] = useState(new Animated.Value(48));
  const criticalCount = reports.filter((r) => r.priority === "critical").length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;

  const toggleSearch = () => {
    const toValue = isSearchExpanded ? 48 : 300;
    
    Animated.spring(searchWidth, {
      toValue,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();

    setIsSearchExpanded(!isSearchExpanded);
    
    if (isSearchExpanded && searchQuery && onSearchChange) {
      onSearchChange("");
    }
  };

  return (
    <View className=" pt-4 pb-6">
      <View className="flex-row items-center justify-between mb-6">
       {!isSearchExpanded &&( <View className="flex-1">
          <Text className="text-4xl font-dm-sans-bold text-gray-900 mb-1">Reports</Text>
          <View className="flex-row items-center">
            <View className="bg-blue-500 rounded-full w-2 h-2 mr-2" />
            <Text className="text-sm font-dm-sans-medium text-gray-600">
              {totalReports} total reports
            </Text>
          </View>
        </View>)}
        
        <View className="flex-row gap-2">
          {/* Animated Search Bar */}
          <Animated.View 
            style={{ width: searchWidth }}
            className="rounded-2xl overflow-hidden"
          >
            <BlurView intensity={40} tint="prominent">
              <LinearGradient
                colors={["rgba(255, 255, 255, 0.9)", "rgba(249, 250, 251, 0.9)"]}
                className="flex-row items-center"
                style={{ padding: 12,flexDirection:'row-reverse',alignItems:'center' }}
              >
                <TouchableOpacity onPress={toggleSearch}>
                  <Ionicons 
                    name={isSearchExpanded ? "close" : "search"} 
                    size={24} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
                
                {isSearchExpanded && (
                  <TextInput
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    className="flex-1 ml-2 font-dm-sans text-base text-gray-700"
                    placeholderTextColor="#9CA3AF"
                    autoFocus
                  />
                )}
              </LinearGradient>
            </BlurView>
          </Animated.View>
                 <TouchableOpacity
            className="rounded-2xl overflow-hidden"
            onPress={()=>router.push('/(tabs)/reports/create-report')}
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
                <Ionicons name="add-outline" size={24} color="#ffffff" />
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
          {/* Filter Button */}
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
