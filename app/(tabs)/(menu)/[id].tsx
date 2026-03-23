import { getMenuById, getMenuCustomizations } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { useCartStore } from "@/store/cart.store";
import { Customization } from "@/type";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
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

// Maps the type string from Appwrite to a user-friendly label
const TYPE_LABELS: Record<string, string> = {
  syrup: "Syrups",
  extra: "Extras",
  size: "Size Upgrade",
};

export default function MenuDetail() {
  const { increaseQty, decreaseQty } = useCartStore();
  const router = useRouter();
  const id = useLocalSearchParams<{ id: string }>().id;

  const { data: menu } = useAppwrite({
    fn: ({ id }) => getMenuById(id),
    params: { id },
  });

  const { data: customizations } = useAppwrite({
    fn: ({ id }) => getMenuCustomizations(id),
    params: { id },
  });

  // Track selected customization IDs
  const [selectedCustomizationIds, setSelectedCustomizationIds] = useState<
    string[]
  >([]);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCartStore();

  const basePrice = menu?.price ?? 2500;

  const formatPrice = (p: number) => p.toLocaleString() + " Ks";

  // Group customizations by type
  const groupedCustomizations = useMemo(() => {
    if (!customizations) return {};
    return (customizations as unknown as Customization[]).reduce(
      (acc, item) => {
        const type = item.type ?? "other";
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
      },
      {} as Record<string, Customization[]>,
    );
  }, [customizations]);

  // Calculate extra cost from selected customizations
  const selectedCustomizations = useMemo(() => {
    if (!customizations) return [];
    return (customizations as unknown as Customization[]).filter((c) =>
      selectedCustomizationIds.includes(c.$id),
    );
  }, [customizations, selectedCustomizationIds]);

  const extraPrice = selectedCustomizations.reduce(
    (sum, c) => sum + c.price,
    0,
  );
  const totalUnitPrice = basePrice + extraPrice;

  const toggleCustomization = (item: Customization) => {
    const type = item.type;
    setSelectedCustomizationIds((prev) => {
      const isSelected = prev.includes(item.$id);

      if (isSelected) {
        // Deselect
        return prev.filter((id) => id !== item.$id);
      }

      // For "size" type — only allow one selection (radio-like)
      if (type === "size") {
        const sameTypeIds = (customizations as unknown as Customization[])
          .filter((c) => c.type === "size")
          .map((c) => c.$id);
        return [...prev.filter((id) => !sameTypeIds.includes(id)), item.$id];
      }

      // For other types — allow multi-select
      return [...prev, item.$id];
    });
  };

  const addToCartHandler = () => {
    if (!menu) return;

    const cartCustomizations = selectedCustomizations.map((c) => ({
      id: c.$id,
      name: c.name,
      price: c.price,
      type: c.type,
    }));

    addItem(
      {
        id: menu.$id,
        name: menu.name,
        image_url: menu.image_url,
        price: basePrice,
        customizations: cartCustomizations,
      },
      quantity,
    );

    router.push("/cart");
  };

  return (
    <View className="flex-1 bg-white-100">
      <StatusBar barStyle="dark-content" />

      {/* Hero Image Area */}
      <View className="h-80 bg-[#F0E6D8] relative overflow-hidden">
        <View className="absolute w-[110%] aspect-square rounded-full bg-[#E8D5C0] -top-1/4 -left-[5%]" />

        <TouchableOpacity
          onPress={() => router.push("/(menu)/menu")}
          className="absolute top-12 left-5 z-10 w-11 h-11 rounded-full bg-white items-center justify-center shadow-md"
        >
          <Text className="text-lg text-primary -mt-0.5">‹</Text>
        </TouchableOpacity>

        <TouchableOpacity className="absolute top-12 right-5 z-10 w-11 h-11 rounded-full bg-white items-center justify-center shadow-md">
          <Text className="text-lg text-white-200">♡</Text>
        </TouchableOpacity>

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

          {/* Customizations — grouped by type */}
          {Object.keys(groupedCustomizations).length > 0 &&
            Object.entries(groupedCustomizations).map(([type, items]) => (
              <View key={type} className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="font-quicksand-bold text-[15px] text-dark-100 tracking-wide">
                    {TYPE_LABELS[type] ?? type}
                  </Text>
                  <Text className="font-quicksand text-xs text-gray-100">
                    {type === "size" ? "Choose one" : "Optional"}
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-2.5">
                  {items.map((item) => {
                    const isSelected = selectedCustomizationIds.includes(
                      item.$id,
                    );
                    return (
                      <TouchableOpacity
                        key={item.$id}
                        onPress={() => toggleCustomization(item)}
                        className={`flex-row items-center gap-2 px-4 py-3 rounded-2xl border-2 ${
                          isSelected
                            ? "bg-primary border-primary"
                            : "bg-white border-[#E8D5C0]"
                        }`}
                      >
                        <Text
                          className={`font-quicksand-bold text-sm ${
                            isSelected ? "text-white-100" : "text-dark-100"
                          }`}
                        >
                          {item.name}
                        </Text>
                        <Text
                          className={`font-quicksand text-xs ${
                            isSelected
                              ? "text-white-100 opacity-80"
                              : "text-gray-100"
                          }`}
                        >
                          +{formatPrice(item.price)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

          {/* Divider (only if customizations exist) */}
          {Object.keys(groupedCustomizations).length > 0 && (
            <View className="h-px bg-[#E8D5C0] mb-6" />
          )}

          {/* Price Summary (shows extra cost when customizations selected) */}
          {selectedCustomizationIds.length > 0 && (
            <View className="bg-[#F9F3ED] rounded-2xl px-4 py-3 mb-4 flex-row justify-between items-center">
              <View>
                <Text className="font-quicksand text-xs text-gray-100 mb-0.5">
                  Total per item
                </Text>
                <Text className="font-quicksand-bold text-base text-dark-100">
                  {formatPrice(basePrice)}
                  <Text className="text-white-200">
                    {" "}
                    + {formatPrice(extraPrice)}
                  </Text>
                </Text>
              </View>
              <Text className="font-quicksand-bold text-xl text-primary">
                {formatPrice(totalUnitPrice)}
              </Text>
            </View>
          )}

          <View className="mb-5">
            <Text className="text-primary">
              {" "}
              Total Price : {formatPrice(totalUnitPrice * quantity)}
            </Text>
          </View>

          {/* Quantity + Add to Cart */}
          <View className="flex-row items-center gap-3.5 mb-9">
            {/* Quantity selector */}
            <View className="flex-row items-center bg-[#F0E6D8] rounded-[18px] h-14 px-2 gap-1">
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 items-center justify-center rounded-xl"
              >
                <Text className="text-lg text-primary font-quicksand-bold">
                  −
                </Text>
              </TouchableOpacity>
              <Text className="font-quicksand-bold text-base text-dark-100 w-6 text-center">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 items-center justify-center rounded-xl"
              >
                <Text className="text-lg text-primary font-quicksand-bold">
                  +
                </Text>
              </TouchableOpacity>
            </View>

            {/* Add to Cart Button */}
            <TouchableOpacity
              onPress={addToCartHandler}
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
