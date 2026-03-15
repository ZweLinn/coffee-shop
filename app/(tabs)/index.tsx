import CartButton from "@/components/cartButton";
import { images, offers } from "@/constants";
import cn from "clsx";
import React, { Fragment, useRef } from "react";
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

const OfferCard = ({
  item,
  index,
}: {
  item: (typeof offers)[0];
  index: number;
}) => {
  const isEven = index % 2 === 0;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }] }}
      className="mb-4 rounded-3xl overflow-hidden"
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: "#ffffff30" }}
        style={{ backgroundColor: item.color }}
        className="h-44 flex-row items-center relative overflow-hidden"
      >
        {({ pressed }) => (
          <Fragment>
            {/* Decorative circle blob — follows the image */}
            <View
              className={cn(
                "absolute w-56 h-56 rounded-full opacity-20",
                isEven ? "-right-10 -bottom-10" : "-left-10 -bottom-10",
              )}
              style={{ backgroundColor: "#ffffff" }}
            />
            <View
              className={cn(
                "absolute w-32 h-32 rounded-full opacity-10",
                isEven ? "right-24 -top-8" : "left-24 -top-8",
              )}
              style={{ backgroundColor: "#ffffff" }}
            />

            {/* Image — right side on even */}
            {isEven && (
              <View className="h-full w-[48%] items-center justify-end pt-2">
                <Image
                  source={item.image}
                  className="w-full h-40"
                  resizeMode="contain"
                />
              </View>
            )}

            {/* Text side */}
            <View
              className={cn(
                "flex-1 justify-center gap-y-3",
                isEven ? "items-start pl-6 pr-2" : "items-start pl-2 pr-6",
              )}
            >
              {/* Label tag */}
              <View className="bg-white/20 px-2.5 py-1 rounded-full self-start">
                <Text className="text-white/80 font-quicksand-medium text-[10px] tracking-widest uppercase">
                  Featured
                </Text>
              </View>

              <Text
                className="font-quicksand-bold text-white text-xl leading-tight"
                numberOfLines={2}
              >
                {item.title}
              </Text>

              {/* CTA row */}
              <View className="flex-row items-center gap-x-1.5 bg-white/20 px-3 py-1.5 rounded-full self-start">
                <Text className="text-white font-quicksand-semibold text-xs">
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

            {/* Image — left side on odd */}
            {!isEven && (
              <View className="h-full w-[48%] items-center justify-end pt-2">
                <Image
                  source={item.image}
                  className="w-full h-40"
                  resizeMode="contain"
                />
              </View>
            )}
          </Fragment>
        )}
      </Pressable>
    </Animated.View>
  );
};

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white-100">
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <OfferCard item={item} index={index} />
        )}
        contentContainerClassName="pb-28 px-5"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className="mb-5">
            {/* Greeting */}
            <View className="mb-6 flex-row items-center justify-between">
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
            {/* Section title */}
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-quicksand-bold text-dark-100 text-base">
                Today&apos;s Specials
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
