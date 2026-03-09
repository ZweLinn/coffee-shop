import { router } from "expo-router";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function SignIn() {
  return (
    <SafeAreaView>
      <Text>SignUo</Text>
      <Button title="Sign In" onPress={() => router.push("/(auth)/signIn")} />
    </SafeAreaView>
  );
}
