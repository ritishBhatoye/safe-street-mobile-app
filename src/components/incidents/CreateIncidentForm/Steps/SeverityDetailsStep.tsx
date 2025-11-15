import React from 'react';
import { useColorScheme , View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, FadeInLeft } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  SEVERITY_LABELS,
  SEVERITY_COLORS,
  SEVERITY_DESCRIPTIONS,
  IncidentSeverity 
} from '@/constants/incidents';

interface SeverityDetailsStepProps {
  selectedSeverity?: IncidentSeverity;
  title: string;
  onSeveritySelect: (severity: IncidentSeverity) => void;
  onTitleChange: (title: string) => void;
}

export const SeverityDetailsStep: React.FC<SeverityDetailsStepProps> = ({
  selectedSeverity,
  title,
  onSeveritySelect,
  onTitleChange,
}) => {
  const colorScheme = useColorScheme();

  return (
    <View className="flex-1">
      {/* Header */}
      <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
        <Text className="text-black dark:text-white font-dm-sans-bold text-2xl mb-2">
          How serious is it?
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 font-dm-sans text-base">
          Help us understand the severity and provide a brief title
        </Text>
      </Animated.View>

      {/* Severity Selection */}
      <Animated.View entering={FadeInDown.delay(300)} className="mb-8">
        <Text className="text-black dark:text-white font-dm-sans-medium text-lg mb-4">
          Severity Level
        </Text>
        
        <View className="gap-5">
          {Object.entries(SEVERITY_LABELS).map(([key, label], index) => (
            <Animated.View
              key={key}
              entering={FadeInLeft.delay(400 + index * 100)}
            >
              <TouchableOpacity
                onPress={() => onSeveritySelect(key as IncidentSeverity)}
                className={`p-4 rounded-2xl border-2 ${
                  selectedSeverity === key ? 'border-2' : 'border-gray-200 dark:border-gray-400'
                }`}
                style={{
                  borderColor: selectedSeverity === key 
                    ? SEVERITY_COLORS[key as keyof typeof SEVERITY_COLORS] 
                    : '#9ca3af',
                }}
              >
                {selectedSeverity === key && (
                  <LinearGradient
                    colors={[
                      `${SEVERITY_COLORS[key as keyof typeof SEVERITY_COLORS]}15`,
                      `${SEVERITY_COLORS[key as keyof typeof SEVERITY_COLORS]}05`
                    ]}
                    className="absolute inset-0 rounded-2xl"
                  />
                )}
                
                <View className="flex-row items-center relative">
                  <View className="flex-row items-center flex-1">
                    <View
                      className="w-5 h-5 rounded-full mr-4"
                      style={{ 
                        backgroundColor: SEVERITY_COLORS[key as keyof typeof SEVERITY_COLORS],
                        shadowColor: SEVERITY_COLORS[key as keyof typeof SEVERITY_COLORS],
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                    />
                    <View className="flex-1">
                      <Text className="font-dm-sans-bold text-base text-black dark:text-white">
                        {label}
                      </Text>
                      <Text className="text-gray-500 dark:text-gray-400 font-dm-sans text-sm mt-1">
                        {SEVERITY_DESCRIPTIONS[key as keyof typeof SEVERITY_DESCRIPTIONS]}
                      </Text>
                    </View>
                  </View>
                  
                  {selectedSeverity === key && (
                    <Animated.View entering={FadeInUp.springify()}>
                      <View 
                        className="w-8 h-8 rounded-full items-center justify-center"
                        style={{ backgroundColor: SEVERITY_COLORS[key as keyof typeof SEVERITY_COLORS] }}
                      >
                        <Ionicons name="checkmark" size={18} color="white" />
                      </View>
                    </Animated.View>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Title Input */}
      <Animated.View entering={FadeInDown.delay(800)} className="mb-6">
        <Text className="text-black dark:text-white font-dm-sans-medium text-lg mb-3">
          Brief Title
        </Text>
        
        <BlurView 
          intensity={20} 
          tint={colorScheme === 'dark' ? 'dark' : 'light'} 
          className="rounded-2xl overflow-hidden"
        >
          <View className="p-1">
            <TextInput
              className="p-4 text-black dark:text-white font-dm-sans text-base"
              placeholder="What happened in a few words..."
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={onTitleChange}
              style={{ 
                backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: 12,
              }}
              maxLength={100}
            />
          </View>
        </BlurView>
        
        <Text className="text-gray-400 font-dm-sans text-xs mt-2 text-right">
          {title.length}/100 characters
        </Text>
      </Animated.View>
    </View>
  );
};