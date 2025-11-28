import { Tabs } from "expo-router";
import React from "react";
import { Animated, View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GlassTabBarBackground from "@/components/atoms/GlassTabBarBackground";

interface TabBarIconProps {
  focused: boolean;
  iconName: string;
  title: string;
}

const TabBarIcon = ({ focused, iconName, title }: TabBarIconProps) => {
  const scaleAnim = React.useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  const opacityAnim = React.useRef(new Animated.Value(focused ? 1 : 0.6)).current;
  const bgScaleAnim = React.useRef(new Animated.Value(focused ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1 : 0.9,
        useNativeDriver: true,
        friction: 10,
        tension: 80,
      }),
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0.6,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(bgScaleAnim, {
        toValue: focused ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 60,
      }),
    ]).start();
  }, [focused, scaleAnim, opacityAnim, bgScaleAnim]);

  return (
    <View className="items-center justify-center py-2">
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
        className="items-center"
      >
        <View className="items-center justify-center w-10 h-10 relative">
          <Animated.View
            style={{
              transform: [{ scale: bgScaleAnim }],
              opacity: bgScaleAnim,
            }}
            className="absolute items-center justify-center bg-blue-500 rounded-full w-10 h-10 shadow-lg"
          />
          <Ionicons name={iconName as any} size={22} color={focused ? "#ffffff" : "#9ca3af"} />
        </View>
        <Animated.Text
          style={{
            opacity: opacityAnim,
          }}
          className={`text-[10px] w-full mt-1 font-dm-sans-medium ${
            focused ? "text-blue-600" : "text-gray-400"
          }`}
        >
          {title}
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarBackground: () => <GlassTabBarBackground />,
        tabBarStyle: {
          position: "absolute",
          bottom: 30,
          left: 20,
          right: 20,
          height: 70,
          borderRadius: 30,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          marginHorizontal: 20,
          paddingTop: 15,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 25,
              shadowOffset: { width: 0, height: 10 },
            },
            android: {
              elevation: 20,
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Home" iconName="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ focused }) => <TabBarIcon title="Map" iconName="map" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Reports" iconName="document-text" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Profile" iconName="person" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
