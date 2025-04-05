import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { HapticTab } from "../../components/HapticTab";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { theme } from "../../constants/theme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary.DEFAULT,
        tabBarInactiveTintColor: theme.neutral[400],
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          ...Platform.select({
            ios: {
              shadowOpacity: 0.1,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: -5 },
              shadowColor: "#000",
              elevation: 5,
              backgroundColor:
                colorScheme === "dark" ? theme.neutral[900] : "#fff",
              borderTopColor:
                colorScheme === "dark"
                  ? theme.neutral[800]
                  : theme.neutral[200],
            },
            android: {
              elevation: 5,
              backgroundColor:
                colorScheme === "dark" ? theme.neutral[900] : "#fff",
              borderTopColor:
                colorScheme === "dark"
                  ? theme.neutral[800]
                  : theme.neutral[200],
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "레시피",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journals"
        options={{
          title: "양조일지",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="beer-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "시음회",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "마이",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
