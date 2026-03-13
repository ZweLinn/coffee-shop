import MenuCard from "@/components/menu/menuCard";
import { getCategories, getMenu } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { MenuItem } from "@/type";
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
    params: {
      category,
      query,
      limit: 6,
    },
  });

  const { data: categories } = useAppwrite({
    fn: getCategories,
  });

  useEffect(() => {
    refetch({ category, query, limit: 6 });
  }, [category, query]);
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="gap-4 px-2 pb-32"
        renderItem={({ item, index }) => {
          return (
            <View>
              <MenuCard item={item as unknown as MenuItem} />
            </View>
          );
        }}
        ListHeaderComponent={() => <View></View>}
      />
    </View>
  );
}
