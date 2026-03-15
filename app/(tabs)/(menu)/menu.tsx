import { EmptyState } from "@/components/emptyState";
import Filter from "@/components/menu/filter";
import MenuCard from "@/components/menu/menuCard";
import MenuHeader from "@/components/menu/menuHeader";
import { getCategories, getMenu } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { Category, MenuItem } from "@/type";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, View } from "react-native";

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
