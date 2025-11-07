import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

interface ReportsPaginationProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export const ReportsPagination: React.FC<ReportsPaginationProps> = ({
  currentPage,
  totalPages,
  loading,
  onPageChange,
}) => {
  const canGoPrev = currentPage > 1 && !loading;
  const canGoNext = currentPage < totalPages && !loading;

  return (
    <View className="mb-4 rounded-3xl overflow-hidden">
      <BlurView intensity={30} tint="light">
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.85)"]}
          className="flex-row items-center justify-between px-5 py-4"
        >
          <TouchableOpacity
            onPress={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrev}
            style={{
              shadowColor: canGoPrev ? "#3b82f6" : "transparent",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <LinearGradient
              colors={canGoPrev ? ["#3b82f6", "#2563eb"] : ["#f3f4f6", "#e5e7eb"]}
              className="flex-row items-center px-5 py-3 rounded-2xl"
            >
              <Ionicons name="chevron-back" size={18} color={canGoPrev ? "#ffffff" : "#9ca3af"} />
              <Text
                className={`ml-2 font-dm-sans-bold ${canGoPrev ? "text-white" : "text-gray-400"}`}
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
            onPress={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            style={{
              shadowColor: canGoNext ? "#3b82f6" : "transparent",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <LinearGradient
              colors={canGoNext ? ["#3b82f6", "#2563eb"] : ["#f3f4f6", "#e5e7eb"]}
              className="flex-row items-center px-5 py-3 rounded-2xl"
            >
              <Text
                className={`mr-2 font-dm-sans-bold ${canGoNext ? "text-white" : "text-gray-400"}`}
              >
                Next
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={canGoNext ? "#ffffff" : "#9ca3af"}
              />
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </BlurView>
    </View>
  );
};
