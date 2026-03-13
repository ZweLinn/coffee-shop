import { MenuItem } from "@/type";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function MenuCard({
  item: { name, image_url, price, rating, description, original_price },
}: {
  item: MenuItem & { description?: string; original_price?: number };
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className="flex-row items-center bg-white px-6 py-4  rounded-lg border-gray-100"
    >
      {/* Left: Image with rating */}
      <View className="items-center mr-4 self-center">
        <Image
          source={{ uri: image_url }}
          className="w-20 h-20 rounded-full bg-gray-100"
          resizeMode="cover"
        />
        <View className="flex-row items-center mt-1 gap-1">
          <Text className="text-yellow-400 text-lg">★</Text>
          <Text className="text-xs text-gray-600 font-medium">{rating}</Text>
        </View>
      </View>

      {/* Middle: Name + Description */}
      <View className="flex-1 self-start pt-3">
        <Text className="text-base font-semibold text-gray-900 mb-0.5">
          {name}
        </Text>
        {description ? (
          <Text className="text-xs text-gray-500 leading-4" numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </View>

      {/* Right: Price */}
      <View className="items-end ml-3 self-start pt-3.5">
        <Text className="text-sm font-semibold text-gray-900">
          {price?.toLocaleString("id-ID")} Ks
        </Text>
        {original_price ? (
          <Text className="text-xs text-gray-400 line-through mt-0.5">
            {original_price?.toLocaleString("id-ID")} Ks
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
