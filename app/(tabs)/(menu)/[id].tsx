import { getMenuById, getMenuCustomizations } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { useCartStore } from "@/store/cart.store";
import { MenuItem } from "@/type";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const StarIcon = ({ filled }: { filled: boolean }) => (
  <Text
    className={filled ? "text-white-200 text-base" : "text-gray-100 text-base"}
  >
    ★
  </Text>
);

const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <View className="flex-row items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          filled={i <= fullStars || (i === fullStars + 1 && hasHalf)}
        />
      ))}
      <Text className="ml-1.5 text-gray-100 font-quicksand-medium text-sm">
        {rating.toFixed(1)}
      </Text>
    </View>
  );
};

export default function MenuDetail() {
  const router = useRouter();
  const id = useLocalSearchParams<{ id: string }>().id;

  const { data: menu } = useAppwrite({
    fn: ({ id }) => getMenuById(id),
    params: { id },
  });

  // Fetch customizations for this menu item
  const { data: customizations } = useAppwrite({
    fn: ({ id }) => getMenuCustomizations(id),
    params: { id },
  });

  console.log("cutomizations", customizations);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");

  const { addItem } = useCartStore();

  const sizes = ["S", "M", "L"];

  const basePrice = menu?.price ?? 2500;

  const formatPrice = (p: number) => p.toLocaleString() + " Ks";

  const addToCartHandler = (menu: MenuItem) => {
    addItem({
      id: menu?.$id ?? "",
      name: menu?.name,
      image_url: menu?.image_url,
      price: basePrice * quantity,
      customizations: [],
    });
    router.push("/cart");
  };

  return (
    <View className="flex-1 bg-white-100">
      <StatusBar barStyle="dark-content" />

      {/* Hero Image Area */}
      <View className="h-80 bg-[#F0E6D8] relative overflow-hidden">
        {/* Decorative circle */}
        <View className="absolute w-[110%] aspect-square rounded-full bg-[#E8D5C0] -top-1/4 -left-[5%]" />

        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.push("/(menu)/menu")}
          className="absolute top-12 left-5 z-10 w-11 h-11 rounded-full bg-white items-center justify-center shadow-md"
        >
          <Text className="text-lg text-primary -mt-0.5">‹</Text>
        </TouchableOpacity>

        {/* Wishlist button */}
        <TouchableOpacity className="absolute top-12 right-5 z-10 w-11 h-11 rounded-full bg-white items-center justify-center shadow-md">
          <Text className="text-lg text-white-200">♡</Text>
        </TouchableOpacity>

        {/* Coffee image */}
        {menu?.image_url ? (
          <Image
            source={{ uri: menu.image_url }}
            className="w-72 h-72 self-center mt-4"
            resizeMode="contain"
          />
        ) : (
          <View className="w-60 h-60 self-center mt-10 items-center justify-center">
            <Text className="text-8xl">☕</Text>
          </View>
        )}
      </View>

      {/* Content Card */}
      <View className="flex-1 bg-white-100 rounded-t-[28px] -mt-6 px-6 pt-7">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Name & Price Row */}
          <View className="flex-row justify-between items-start mb-2">
            <Text className="font-quicksand-bold text-2xl text-dark-100 flex-1 leading-8">
              {menu?.name ?? "Classic Americano"}
            </Text>
            <Text className="font-quicksand-bold text-[22px] text-white-200 ml-3">
              {formatPrice(basePrice)}
            </Text>
          </View>

          {/* Rating */}
          <View className="mb-4">
            <RatingStars rating={menu?.rating ?? 4.5} />
          </View>

          {/* Description */}
          <Text className="font-quicksand text-sm text-gray-100 leading-6 mb-6">
            {menu?.description ??
              "Bold espresso diluted with hot water for a clean, strong cup"}
          </Text>

          {/* Divider */}
          <View className="h-px bg-[#E8D5C0] mb-6" />

          {/* Size Selector */}
          <Text className="font-quicksand-bold text-[15px] text-dark-100 mb-3 tracking-wide">
            Size
          </Text>
          <View className="flex-row gap-2.5 mb-7">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  className={`w-14 h-14 rounded-2xl items-center justify-center border-2 ${
                    isSelected
                      ? "bg-primary border-primary shadow-md"
                      : "bg-white border-[#E8D5C0]"
                  }`}
                >
                  <Text
                    className={`font-quicksand-bold text-[15px] ${
                      isSelected ? "text-white-100" : "text-gray-100"
                    }`}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quantity & Add to Cart Row */}
          <View className="flex-row items-center gap-3.5 mb-9">
            {/* Add to Cart Button */}
            <TouchableOpacity
              onPress={() => addToCartHandler(menu as unknown as MenuItem)}
              className="flex-1 h-14 bg-primary rounded-[18px] flex-row items-center justify-center gap-2.5 shadow-lg"
            >
              <Text className="text-lg">☕</Text>
              <Text className="font-quicksand-bold text-white-100 text-[15px] tracking-wide">
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
