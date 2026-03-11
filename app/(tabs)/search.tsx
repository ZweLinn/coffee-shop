import seed from "@/lib/seed";
import { Button, Text, View } from "react-native";

export default function Search() {
  return (
    <View>
      <Text>Cart</Text>
      <Button
        title="seed"
        onPress={() =>
          seed().catch((errror) => console.log(errror, "seeding fail"))
        }
      />
    </View>
  );
}
