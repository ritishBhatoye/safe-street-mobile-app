import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/utils/toast";

export default function AuthCallback() {
  const params = useLocalSearchParams();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const { access_token, refresh_token, error } = params;

      if (error) {
        showToast.error("Error", error as string);
        router.replace("/(auth)/sign-in");
        return;
      }

      if (access_token && refresh_token) {
        await supabase.auth.setSession({
          access_token: access_token as string,
          refresh_token: refresh_token as string,
        });

        showToast.success("Success", "Signed in successfully");
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/sign-in");
      }
    } catch (error) {
      console.error("Callback error:", error);
      router.replace("/(auth)/sign-in");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="mt-4 font-dm-sans text-gray-600 dark:text-gray-400">
        Completing sign in...
      </Text>
    </View>
  );
}
