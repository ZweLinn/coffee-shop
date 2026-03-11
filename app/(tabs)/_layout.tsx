import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

// Animated tab bar icon with bounce + scale effect
function AnimatedTabIcon({
  focused,
  focusedName,
  unfocusedName,
  size = 22,
}: {
  focused: boolean;
  focusedName: keyof typeof Ionicons.glyphMap;
  unfocusedName: keyof typeof Ionicons.glyphMap;
  size?: number;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0.6)).current;

  useEffect(() => {
    if (focused) {
      // Bounce up animation on focus
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.25,
            useNativeDriver: true,
            tension: 200,
            friction: 8,
          }),
          Animated.spring(translateYAnim, {
            toValue: -4,
            useNativeDriver: true,
            tension: 200,
            friction: 8,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.1,
            useNativeDriver: true,
            tension: 200,
            friction: 8,
          }),
          Animated.spring(translateYAnim, {
            toValue: -2,
            useNativeDriver: true,
            tension: 200,
            friction: 8,
          }),
        ]),
      ]).start();
    } else {
      // Settle back down
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 10,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 200,
          friction: 10,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.55,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
        opacity: opacityAnim,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Pill indicator behind the icon */}
      {focused && (
        <Animated.View
          style={{
            position: "absolute",
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#5D4037",
            opacity: 0.1,
          }}
        />
      )}
      <Ionicons
        name={focused ? focusedName : unfocusedName}
        size={size}
        color="#5D4037"
      />
    </Animated.View>
  );
}

// Active dot indicator below label
function ActiveDot({ focused }: { focused: boolean }) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#5D4037",
        marginTop: 2,
        transform: [{ scale: scaleAnim }],
      }}
    />
  );
}

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Redirect href="/signIn" />;

  const tabs = [
    {
      name: "index",
      title: "Home",
      focused: "home-sharp" as keyof typeof Ionicons.glyphMap,
      unfocused: "home-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      name: "search",
      title: "Search",
      focused: "search" as keyof typeof Ionicons.glyphMap,
      unfocused: "search-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      name: "cart",
      title: "Cart",
      focused: "cart" as keyof typeof Ionicons.glyphMap,
      unfocused: "cart-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      name: "profile",
      title: "Profile",
      focused: "person" as keyof typeof Ionicons.glyphMap,
      unfocused: "person-outline" as keyof typeof Ionicons.glyphMap,
    },
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          borderRadius: 50,
          marginHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 8,
          height: 76,
          position: "absolute",
          bottom: 36,
          backgroundColor: "#FFFAF6",
          shadowColor: "#5D4037",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
          elevation: 10,
          borderWidth: 1,
          borderColor: "rgba(93, 64, 55, 0.07)",
        },
        tabBarShowLabel: true,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            headerShown: false,
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <AnimatedTabIcon
                focused={focused}
                focusedName={tab.focused}
                unfocusedName={tab.unfocused}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <View style={{ alignItems: "center" }}>
                <Animated.Text
                  style={{
                    fontSize: 10,
                    fontWeight: focused ? "700" : "500",
                    color: focused ? "#5D4037" : "#9A8C82",
                    fontFamily: focused ? "Quicksand-Bold" : "Quicksand-Medium",
                    letterSpacing: 0.2,
                  }}
                >
                  {tab.title}
                </Animated.Text>
                <ActiveDot focused={focused} />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
