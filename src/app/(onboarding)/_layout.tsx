import { useAuth } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import { ActivityIndicator } from "react-native";

export default function OnboardingLayout() {
  const { user, loading } = useAuth();
  if (user || loading) {
    <ActivityIndicator />;
  } else {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    );
  }
}
