import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    image: require("@/assets/images/Promotion-1.png"),
  },
  {
    id: "2",
    image: require("@/assets/images/Promotion-2.png"),
  },
];

export default function CarouselBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH }}>
            <Image
              source={item.image}
              className="w-full h-40  rounded-2xl"
              resizeMode="contain"
            />
          </View>
        )}
      />

      {/* Dots */}
      <View className="flex-row justify-center mt-3 gap-1.5">
        {SLIDES.map((_, i) => (
          <View
            key={i}
            className={`rounded-full ${
              i === activeIndex
                ? "w-2.5 h-2.5 bg-[#4A2C1A]"
                : "w-2 h-2 bg-[#C8B4A8]"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
