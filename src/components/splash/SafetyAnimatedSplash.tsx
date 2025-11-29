import React, { useEffect } from "react";
import { View, Text, StatusBar, useColorScheme } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface SafetyAnimatedSplashProps {
  onAnimationComplete: () => void;
}

export const SafetyAnimatedSplash: React.FC<SafetyAnimatedSplashProps> = ({
  onAnimationComplete,
}) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  // Animation values
  const shieldScale = useSharedValue(0);
  const shieldGlow = useSharedValue(0.3);
  const logoScale = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(30);
  const taglineOpacity = useSharedValue(0);
  const finalFade = useSharedValue(1);

  useEffect(() => {
    // Shield animation
    shieldScale.value = withSpring(1, { damping: 12, stiffness: 100 });

    // Logo animation (delayed)
    setTimeout(() => {
      logoScale.value = withSequence(
        withTiming(1.2, { duration: 400, easing: Easing.back(1.5) }),
        withTiming(1, { duration: 200 }),
      );
      logoRotation.value = withTiming(360, { duration: 800, easing: Easing.out(Easing.quad) });
    }, 500);

    // Text animation
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 600 });
      textTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.2)) });
    }, 1200);

    // Tagline animation
    setTimeout(() => {
      taglineOpacity.value = withTiming(1, { duration: 500 });
    }, 1800);

    // Final fade out
    setTimeout(() => {
      finalFade.value = withTiming(0, { duration: 600 }, () => {
        "worklet";
        // Use setTimeout to call the callback on JS thread
        setTimeout(() => onAnimationComplete(), 0);
      });
    }, 3500);
  }, [
    onAnimationComplete,
    shieldScale,
    logoScale,
    logoRotation,
    textOpacity,
    textTranslateY,
    taglineOpacity,
    finalFade,
  ]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: finalFade.value,
  }));

  const shieldStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shieldScale.value }],
    opacity: shieldGlow.value * 0.8 + 0.2,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }, { rotate: `${logoRotation.value}deg` }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <Animated.View style={[{ flex: 1 }, containerStyle]}>
      <StatusBar
        barStyle={isLight ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={
          isLight
            ? ["#F0F9FF", "#E0F2FE", "#BAE6FD"] // Light blue gradient
            : ["#0f0f23", "#1a1a2e", "#16213e"] // Dark gradient
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 }}
        >
          {/* Shield Background */}
          <Animated.View
            style={[
              shieldStyle,
              {
                position: "absolute",
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: isLight ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.1)",
              },
            ]}
          />

          {/* Logo Icon */}
          <Animated.View style={logoStyle}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#3B82F6",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#3B82F6",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: isLight ? 0.3 : 0.4,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <Ionicons name="shield-checkmark" size={40} color="white" />
            </View>
          </Animated.View>

          {/* App Name */}
          <Animated.View style={[textStyle, { marginTop: 40 }]}>
            <Text
              style={{
                fontSize: 36,
                fontFamily: "dm-sans-bold",
                color: isLight ? "#0C4A6E" : "white",
                textAlign: "center",
                letterSpacing: 2,
                textShadowColor: isLight ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.5)",
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 8,
              }}
            >
              SafeStreet
            </Text>
          </Animated.View>

          {/* Tagline */}
          <Animated.View style={[taglineStyle, { marginTop: 16 }]}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "dm-sans",
                color: isLight ? "rgba(12, 74, 110, 0.8)" : "rgba(255, 255, 255, 0.8)",
                textAlign: "center",
                letterSpacing: 1,
              }}
            >
              Keeping Communities Safe Together
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};
