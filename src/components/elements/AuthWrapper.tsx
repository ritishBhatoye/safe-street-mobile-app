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

  // 🎯 Header height animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [260, 140],
    extrapolate: "clamp",
  });

  // 🎯 Fade text
  const textOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.3],
    extrapolate: "clamp",
  });

  // 🎯 Move icon
  const iconTranslate = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -30],
    extrapolate: "clamp",
  });

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* 🔥 Animated Header */}
      <Animated.View
        style={{
          height: headerHeight,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={gradColors}
          style={{
            flex: 1,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <SafeAreaView className="px-6">
            {/* Back Button */}
            <Pressable
              onPress={() => router.back()}
              className="mb-4 h-10 w-10 items-center justify-center rounded-full bg-white/20"
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>

            {/* Title */}
            <Animated.View style={{ opacity: textOpacity }}>
              <Text className="font-dm-sans-bold mb-2 text-4xl text-white">{title}</Text>
              <Text className="font-dm-sans text-lg text-white/80">{subTitle}</Text>
            </Animated.View>

            {/* Icon */}
            <Animated.View
              style={{
                alignItems: "center",
                transform: [{ translateY: iconTranslate }],
              }}
            >
              <View className="mt-4 h-20 w-20 items-center justify-center rounded-full bg-white/20">
                <Text style={{ fontSize: 40 }}>🛡️</Text>
              </View>
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>

      {/* 📱 Form Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Animated.ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
        >
          {children}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AuthWrapper;
