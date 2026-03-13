import { View } from "react-native";
import CarouselBanner from "./carouselBanner";
import Searchbar from "./searchbar";

export default function MenuHeader() {
  return (
    <View className="mt-20">
      <Searchbar />
      <CarouselBanner />
    </View>
  );
}
