import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

const GlassTabBarBackground = () => (
  <BlurView
    intensity={40}
    tint="systemUltraThinMaterialLight"
    style={StyleSheet.absoluteFill}
  />
);

export default GlassTabBarBackground;
