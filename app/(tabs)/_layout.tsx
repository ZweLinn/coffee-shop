import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Redirect href="/signIn" />;
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="home-sharp" size={20} color="black" />
            ) : (
              <Ionicons name="home-outline" size={20} color="black" />
            ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
            color: "#C47B2B",
          },
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
