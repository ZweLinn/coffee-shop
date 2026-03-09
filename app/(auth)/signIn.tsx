import { router } from "expo-router";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function SignIn() {
  return (
    <SafeAreaView>
      <Text>SignIn</Text>
      <Button title="Sign Up" onPress={() => router.push("/(auth)/signUp")} />
    </SafeAreaView>
  );
}
