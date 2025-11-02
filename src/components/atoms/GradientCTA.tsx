import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity } from "react-native";

export default function GradientCTA({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={["#E50914", "#111111"]} // Netflix Red → Deep Black
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 16,
          paddingVertical: 12,
          paddingHorizontal: 24,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#E50914",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8, // Android shadow
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
