import { useColorScheme } from "@/hooks/use-color-scheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { AuthProvider } from "@/contexts/AuthContext";
import { toastConfig } from "@/components/ui/Toast";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import "../global.css";

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  
  // Protect routes based on auth state
  useProtectedRoute();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(screens)" />
      </Stack>
      <StatusBar style="auto" />
      <Toast config={toastConfig} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // DM Sans
    'dm-sans-black': require('../../assets/fonts/DM_Sans/static/DMSans-Black.ttf'),
    'dm-sans-black-italic': require('../../assets/fonts/DM_Sans/static/DMSans-BlackItalic.ttf'),
    'dm-sans-bold': require('../../assets/fonts/DM_Sans/static/DMSans-Bold.ttf'),
    'dm-sans-bold-italic': require('../../assets/fonts/DM_Sans/static/DMSans-BoldItalic.ttf'),
    'dm-sans-extrabold': require('../../assets/fonts/DM_Sans/static/DMSans-ExtraBold.ttf'),
    'dm-sans-extrabold-italic': require('../../assets/fonts/DM_Sans/static/DMSans-ExtraBoldItalic.ttf'),
    'dm-sans-extralight': require('../../assets/fonts/DM_Sans/static/DMSans-ExtraLight.ttf'),
    'dm-sans-extralight-italic': require('../../assets/fonts/DM_Sans/static/DMSans-ExtraLightItalic.ttf'),
    'dm-sans-italic': require('../../assets/fonts/DM_Sans/static/DMSans-Italic.ttf'),
    'dm-sans-light': require('../../assets/fonts/DM_Sans/static/DMSans-Light.ttf'),
    'dm-sans-light-italic': require('../../assets/fonts/DM_Sans/static/DMSans-LightItalic.ttf'),
    'dm-sans-medium': require('../../assets/fonts/DM_Sans/static/DMSans-Medium.ttf'),
    'dm-sans-medium-italic': require('../../assets/fonts/DM_Sans/static/DMSans-MediumItalic.ttf'),
    'dm-sans': require('../../assets/fonts/DM_Sans/static/DMSans-Regular.ttf'),
    'dm-sans-semibold': require('../../assets/fonts/DM_Sans/static/DMSans-SemiBold.ttf'),
    'dm-sans-semibold-italic': require('../../assets/fonts/DM_Sans/static/DMSans-SemiBoldItalic.ttf'),
    'dm-sans-thin': require('../../assets/fonts/DM_Sans/static/DMSans-Thin.ttf'),
    'dm-sans-thin-italic': require('../../assets/fonts/DM_Sans/static/DMSans-ThinItalic.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
