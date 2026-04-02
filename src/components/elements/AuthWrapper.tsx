import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Pressable,
  StatusBar,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const AuthWrapper = ({
  title = "Welcome Back",
  subTitle = "Sign in to stay safe and connected",
  children,
  gradColors = ["#3399FF", "#0080FF"],
}: {
  title: string;
  subTitle: string;
  gradColors?: [string, string, ...string[]];
  children: React.ReactNode;
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Animated header height
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  // Animated title opacity (fade out on scroll)
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  // Animated subtitle opacity
  const subtitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 3],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Animated icon scale
  const iconScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5],
    extrapolate: "clamp",
  });

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Animated Header */}
      <Animated.View style={{ height: headerHeight, overflow: "hidden" }}>
        <LinearGradient
          colors={gradColors}
          className="h-full"
          style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
        >
          <SafeAreaView className="h-full px-6 justify-between pb-8">
            {/* Back Button */}
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/20 self-start"
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>

            {/* Title Section */}
            <Animated.View style={{ opacity: titleOpacity }}>
              <Text className="font-dm-sans-bold mb-2 text-4xl text-white">{title}</Text>
              <Animated.Text
                style={{ opacity: subtitleOpacity }}
                className="font-dm-sans text-lg text-white/80"
              >
                {subTitle}
              </Animated.Text>
            </Animated.View>

            {/* Shield Icon */}
            <Animated.View style={{ transform: [{ scale: iconScale }] }} className="items-center">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-white/20">
                <Text style={{ fontSize: 40 }}>🛡️</Text>
              </View>
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>

      {/* Scrollable Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Animated.ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AuthWrapper;
