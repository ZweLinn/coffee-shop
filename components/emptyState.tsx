import { images } from "@/constants";
import { Image, Text, View } from "react-native";

export function EmptyState({
  query,
  category,
}: {
  query?: string;
  category?: string;
}) {
  const message = query
    ? `No drinks found for "${query}"${category ? ` in ${category}` : ""}`
    : category
      ? `Nothing in "${category}" right now`
      : "No drinks available";

  return (
    <View className="flex-1 items-center justify-center px-6 py-16 ">
      <Image
        source={images.emptyStateLogo}
        className="w-32 h-32"
        resizeMode="contain"
      />

      <View className="items-center gap-1.5 max-w-xs">
        <Text className="text-base font-semibold text-gray-900 text-center">
          No drinks found
        </Text>
        <Text className="text-sm text-gray-400 text-center leading-5">
          {message}. Try a different keyword or explore another category.
        </Text>
      </View>
    </View>
  );
}
