import { router } from "expo-router";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@/components/atoms/Button";

export const AuthActionButtons = () => {
  const markOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  const handleGetStarted = async () => {
    await markOnboardingComplete();
    router.push("./permissions");
  };

  const handleLogin = async () => {
    await markOnboardingComplete();
    router.push("/(auth)/sign-in");
  };

  return (
    <View className="w-full gap-4 px-6">
      <Button
        title="Get Started"
        variant="primary"
        size="large"
        onPress={handleGetStarted}
        className="w-full shadow-lg"
      />
      <Button
        title="Already have an account? Log In"
        variant="outline"
        size="large"
        onPress={handleLogin}
        className="w-full"
      />
    </View>
  );
};
