import { images, offers } from "@/constants";
import { useRef } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";

const HeroCard = ({ item }: { item: (typeof offers)[0] }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 20,
    }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }] }}
      className="rounded-3xl overflow-hidden mb-4"
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: "#ffffff20" }}
        style={{ backgroundColor: item.color }}
        className="h-56 flex-row items-end relative overflow-hidden"
      >
        {/* Decorative blobs */}
        <View
          className="absolute w-64 h-64 rounded-full opacity-20"
          style={{ backgroundColor: "#fff", bottom: -40, right: -30 }}
        />
        <View
          className="absolute w-36 h-36 rounded-full opacity-10"
          style={{ backgroundColor: "#fff", top: -20, right: 80 }}
        />

        {/* Coffee image */}
        <View className="absolute right-0 bottom-0 w-52 h-52">
          <Image
            source={item.image}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>

        {/* Text content */}
        <View className="p-6 pb-7 flex-1">
          <View className="bg-white/20 px-3 py-1 rounded-full self-start mb-3">
            <Text className="text-white/90 font-quicksand-semibold text-[10px] tracking-widest uppercase">
              Today&apos;s Pick
            </Text>
          </View>
          <Text
            className="font-quicksand-bold text-white text-2xl leading-tight mb-4"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <View className="flex-row items-center gap-x-2 bg-white/20 px-4 py-2 rounded-full self-start">
            <Text className="text-white font-quicksand-bold text-xs">
              Order now
            </Text>
            <Image
              source={images.arrowRight}
              className="w-3 h-3"
              resizeMode="contain"
              tintColor="#ffffff"
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default HeroCard;
