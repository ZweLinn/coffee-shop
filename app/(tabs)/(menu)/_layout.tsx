import { Stack } from "expo-router";

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="menu"
        options={{ title: "Menu", headerShown: false }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Custom Menu", headerShown: false }}
      />
    </Stack>
  );
}
