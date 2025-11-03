import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";

const GlassTabBarBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <BlurView
      intensity={10}
      tint="light"
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: 30,
          overflow: "hidden",
        },
      ]}
    />
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: 30,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.5)",
        },
      ]}
    />
  </View>
);

export default GlassTabBarBackground;
