import Filter from "@/components/menu/filter";
import MenuCard from "@/components/menu/menuCard";
import MenuHeader from "@/components/menu/menuHeader";
import { images } from "@/constants";
import { getCategories, getMenu } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { Category, MenuItem } from "@/type";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, Image, Text, View } from "react-native";

function EmptyState({
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
export default function Search() {
  const { category, query } = useLocalSearchParams<{
    category: string;
    query: string;
  }>();

  const { data, refetch, loading } = useAppwrite({
    fn: getMenu,
    params: { category, query, limit: 6 },
  });

  const { data: categories } = useAppwrite({ fn: getCategories });

  useEffect(() => {
    refetch({ category, query, limit: 6 });
  }, [category, query]);

  return (
    <View className="bg-white flex-1">
      <FlatList
        data={data}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="gap-4 px-2 pb-32"
        renderItem={({ item }) => (
          <View>
            <MenuCard item={item as unknown as MenuItem} />
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="flex gap-5">
            <MenuHeader />
            <Filter categories={categories as unknown as Category[]} />
          </View>
        )}
        ListEmptyComponent={
          !loading ? <EmptyState query={query} category={category} /> : null
        }
      />
    </View>
  );
}
