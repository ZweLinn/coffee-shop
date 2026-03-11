import { Image, Text, View } from "react-native";

export default function Cart() {
  return (
    <View className="h-full">
      <Text>Cart</Text>
      <Image
        source={{ uri: "https://zwe-clipcast.b-cdn.net/coffee/coffee-4.png" }}
        resizeMode="contain"
        style={{ width: 300, height: 300 }}
      />
    </View>
  );
}
