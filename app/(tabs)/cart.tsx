import { images } from "@/constants";

import { Image, Text, View } from "react-native";

export default function Cart() {
  return (
    <View className="h-full">
      <Text>Cart</Text>
      <Image source={images.authLogo} resizeMode="contain" />
    </View>
  );
}
