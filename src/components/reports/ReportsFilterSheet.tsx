import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ActionSheet } from '@/components/elements';
import { ActionSheetRef } from 'react-native-actions-sheet';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export interface ReportFilters {
  status: string[];
  priority: string[];
  sortBy: 'newest' | 'oldest' | 'priority';
}

interface ReportsFilterSheetProps {
  sheetRef: React.RefObject<ActionSheetRef | null>;
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: '#f59e0b', icon: 'time' },
  { value: 'investigating', label: 'Investigating', color: '#3b82f6', icon: 'search' },
  { value: 'resolved', label: 'Resolved', color: '#22c55e', icon: 'checkmark-circle' },
  { value: 'closed', label: 'Closed', color: '#6b7280', icon: 'close-circle' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#f97316' },
  { value: 'critical', label: 'Critical', color: '#ef4444' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', icon: 'arrow-down' },
  { value: 'oldest', label: 'Oldest First', icon: 'arrow-up' },
  { value: 'priority', label: 'Priority', icon: 'alert-circle' },
] as const;

export const ReportsFilterSheet: React.FC<ReportsFilterSheetProps> = ({
  sheetRef,
  filters,
  onFiltersChange,
  onReset,
}) => {
  const toggleStatus = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatuses });
  };

  const togglePriority = (priority: string) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];
    onFiltersChange({ ...filters, priority: newPriorities });
  };

  const setSortBy = (sortBy: 'newest' | 'oldest' | 'priority') => {
    onFiltersChange({ ...filters, sortBy });
  };

  const activeFiltersCount =
    filters.status.length + filters.priority.length + (filters.sortBy !== 'newest' ? 1 : 0);

  return (
    <ActionSheet
      ref={sheetRef}
      title="Filter Reports"
      subtitle={`${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} active`}
      headerGradient={['rgba(59, 130, 246, 0.1)', 'rgba(147, 51, 234, 0.1)']}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
        {/* Status Filter */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'DMSans-Bold',
              color: '#111827',
              marginBottom: 12,
            }}
          >
            Status
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {STATUS_OPTIONS.map((option) => {
              const isSelected = filters.status.includes(option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => toggleStatus(option.value)}
                  style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: isSelected ? option.color : '#e5e7eb',
                  }}
                >
                  <LinearGradient
                    colors={
                      isSelected
                        ? [`${option.color}20`, `${option.color}10`]
                        : ['#ffffff', '#f9fafb']
                    }
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      gap: 6,
                    }}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={18}
                      color={isSelected ? option.color : '#6b7280'}
                    />
                    <Text
                      style={{
                        fontFamily: isSelected ? 'DMSans-Bold' : 'DMSans-Medium',
                        fontSize: 14,
                        color: isSelected ? option.color : '#6b7280',
                      }}
                    >
                      {option.label}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Priority Filter */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'DMSans-Bold',
              color: '#111827',
              marginBottom: 12,
            }}
          >
            Priority
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {PRIORITY_OPTIONS.map((option) => {
              const isSelected = filters.priority.includes(option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => togglePriority(option.value)}
                  style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: isSelected ? option.color : '#e5e7eb',
                  }}
                >
                  <LinearGradient
                    colors={
                      isSelected
                        ? [`${option.color}20`, `${option.color}10`]
                        : ['#ffffff', '#f9fafb']
                    }
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: isSelected ? 'DMSans-Bold' : 'DMSans-Medium',
                        fontSize: 14,
                        color: isSelected ? option.color : '#6b7280',
                      }}
                    >
                      {option.label}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Sort By */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'DMSans-Bold',
              color: '#111827',
              marginBottom: 12,
            }}
          >
            Sort By
          </Text>
          <View style={{ gap: 8 }}>
            {SORT_OPTIONS.map((option) => {
              const isSelected = filters.sortBy === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSortBy(option.value)}
                  style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: isSelected ? '#3b82f6' : '#e5e7eb',
                  }}
                >
                  <LinearGradient
                    colors={
                      isSelected
                        ? ['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.1)']
                        : ['#ffffff', '#f9fafb']
                    }
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      gap: 10,
                    }}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={20}
                      color={isSelected ? '#3b82f6' : '#6b7280'}
                    />
                    <Text
                      style={{
                        fontFamily: isSelected ? 'DMSans-Bold' : 'DMSans-Medium',
                        fontSize: 15,
                        color: isSelected ? '#3b82f6' : '#6b7280',
                        flex: 1,
                      }}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 16 }}>
          <TouchableOpacity
            onPress={onReset}
            style={{
              flex: 1,
              borderRadius: 12,
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: '#e5e7eb',
            }}
          >
            <View
              style={{
                backgroundColor: '#ffffff',
                paddingVertical: 14,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'DMSans-Bold',
                  fontSize: 15,
                  color: '#6b7280',
                }}
              >
                Reset
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => sheetRef.current?.hide()}
            style={{
              flex: 1,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={{
                paddingVertical: 14,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'DMSans-Bold',
                  fontSize: 15,
                  color: '#ffffff',
                }}
              >
                Apply Filters
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ActionSheet>
  );
};
