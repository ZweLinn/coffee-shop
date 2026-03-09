import { images } from "@/constants";

import { Slot } from "expo-router";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
} from "react-native";
export default function AuthLayout() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="bg-white h-full"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full">
          <Image
            source={images.authLogo}
            className="size-64 self-center mt-10"
            resizeMode="contain"
          />
        </View>
        <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
