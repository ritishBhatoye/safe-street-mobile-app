import { Tabs } from "expo-router";
import React from "react";
import { Animated, Text, View, Platform } from "react-native";
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

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1 : 0.9,
        useNativeDriver: true,
        friction: 8,
        tension: 100,
      }),
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, scaleAnim, opacityAnim]);

  return (
    <View className="items-center justify-center py-2">
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
        className="items-center"
      >
        {focused ? (
          <View className="items-center justify-center bg-blue-500 rounded-full w-12 h-12 shadow-lg">
            <Ionicons name={iconName as any} size={26} color="#ffffff" />
          </View>
        ) : (
          <Ionicons name={iconName as any} size={24} color="#9ca3af" />
        )}
        <Text
          className={`text-[10px] w-full mt-1 font-dm-sans-medium ${
            focused ? "text-blue-600" : "text-gray-400"
          }`}
        >
          {title}
        </Text>
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
          paddingTop:15,
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
        name="index"
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
