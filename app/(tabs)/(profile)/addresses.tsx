import { getOrderById } from "@/lib/appwrite";
import { Text, View } from "react-native";

export default async function WishList() {
  const item = await getOrderById("69c16781003427650221");
  console.log("item detail", item);
  return (
    <View>
      <Text>Address</Text>
    </View>
  );
}
