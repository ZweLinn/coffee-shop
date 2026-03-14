import { View } from "react-native";
import CarouselBanner from "./carouselBanner";
import Searchbar from "./searchbar";

export default function MenuHeader() {
  return (
    <View className="mt-12">
      <View className="mb-5 px-2 flex-row justify-between items-center">
        <Searchbar />
      </View>
      <CarouselBanner />
    </View>
  );
}
