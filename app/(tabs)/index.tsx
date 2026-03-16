import CartButton from "@/components/cartButton";
import HeroCard from "@/components/heroCard";
import { images, offers } from "@/constants";
import React, { useRef } from "react";
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SmallCard = ({ item }: { item: (typeof offers)[0] }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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

export default function Index() {
  const hero = offers[0];
  const rest = offers.slice(1);

  // Pair remaining items into rows of 2
  const rows: (typeof offers)[] = [];
  for (let i = 0; i < rest.length; i += 2) {
    rows.push(rest.slice(i, i + 2));
  }

  return (
    <SafeAreaView className="flex-1 bg-white-100">
      <FlatList
        data={rows}
        keyExtractor={(_, i) => i.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-28 px-5"
        renderItem={({ item: row }) => (
          <View className="flex-row gap-x-3 mb-4">
            {row.map((item) => (
              <SmallCard key={item.id} item={item} />
            ))}
            {/* Fill empty slot if odd number */}
            {row.length === 1 && <View style={{ flex: 1 }} />}
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="mb-1">
            {/* Greeting */}
            <View className="mb-5 flex-row items-center justify-between">
              <View>
                <Text className="font-quicksand text-gray-100 text-sm">
                  Good morning ☀️
                </Text>
                <Text className="font-quicksand-bold text-dark-100 text-2xl leading-tight mt-0.5">
                  What would you{"\n"}like to drink?
                </Text>
              </View>
              <CartButton />
            </View>

            {/* Hero section label */}
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-quicksand-bold text-dark-100 text-base">
                Today&apos;s Special
              </Text>
            </View>

            {/* Hero card */}
            <HeroCard item={hero} />

            {/* Small cards section label */}
            <View className="flex-row items-center justify-between mb-3 mt-1">
              <Text className="font-quicksand-bold text-dark-100 text-base">
                Our Top Drinks
              </Text>
              <TouchableOpacity>
                <Text className="font-quicksand-medium text-primary text-sm">
                  See all
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
