import CartButton from "@/components/cartButton";
import HeroCard from "@/components/heroCard";
import SmallCard from "@/components/smallCard";
import { offers } from "@/constants";
import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
