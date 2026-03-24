import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="orderList" options={{ headerShown: false }} />
      <Stack.Screen name="wishlist" options={{ title: "Wishlist" }} />
      <Stack.Screen
        name="payment-methods"
        options={{ title: "Payment Methods" }}
      />
      <Stack.Screen name="addresses" options={{ title: "Saved Addresses" }} />
      <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}
