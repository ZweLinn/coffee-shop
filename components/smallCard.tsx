import { images, offers } from "@/constants";
import { router } from "expo-router";
import { useRef } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";

const SmallCard = ({ item }: { item: (typeof offers)[0] }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    router.push({
      pathname: "/(tabs)/(menu)/[id]" as const,
      params: { id: item.id },
    });
  };
  const handlePressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }], flex: 1 }}
      className="rounded-2xl overflow-hidden"
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: "#ffffff20" }}
        style={{ backgroundColor: item.color }}
        className="h-44 relative overflow-hidden p-4"
      >
        {/* Decorative blobs */}
        <View
          className="absolute w-32 h-32 rounded-full opacity-20"
          style={{ backgroundColor: "#fff", bottom: -20, right: -20 }}
        />
        <View
          className="absolute w-16 h-16 rounded-full opacity-10"
          style={{ backgroundColor: "#fff", top: -10, left: 30 }}
        />

        {/* Coffee image */}
        <View className="absolute bottom-0 right-0 w-28 h-28">
          <Image
            source={item.image}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>

        {/* Text */}
        <View className="bg-white/20 px-2 py-0.5 rounded-full self-start mb-2">
          <Text className="text-white/80 font-quicksand-medium text-[9px] tracking-widest uppercase">
            Featured
          </Text>
        </View>
        <Text
          className="font-quicksand-bold text-white text-sm leading-tight"
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {/* Arrow button */}
        <View className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white/20 items-center justify-center">
          <Image
            source={images.arrowRight}
            className="w-3 h-3"
            resizeMode="contain"
            tintColor="#ffffff"
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default SmallCard;
