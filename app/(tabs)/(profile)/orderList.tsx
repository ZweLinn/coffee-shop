import { EmptyState } from "@/components/emptyState";
import OrderCard, { OrderDocument } from "@/components/order/orderCard";

import { getOrders } from "@/lib/appwrite";
import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OrderList() {
  const { user } = useAuthStore();

  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (isRefresh = false) => {
    // Wait until user is available
    if (!user?.$id) {
      setLoading(false);
      return;
    }

    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);

    try {
      const docs = await getOrders(user.$id);
      console.log("docs", docs);

      // Appwrite documents already have $id — cast directly, no extra wrapping
      setOrders(docs as unknown as OrderDocument[]);
    } catch (e) {
      setError("Failed to load orders. Pull down to retry.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Re-run when user becomes available (handles cold start)
  useEffect(() => {
    fetchOrders();
  }, [user?.$id]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={orders}
        // $id is always present on Appwrite documents — safe to use as key
        keyExtractor={(item) => item.$id}
        contentContainerClassName="px-5 pt-5 pb-28 bg-white-100"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchOrders(true)}
          />
        }
        ListHeaderComponent={
          <View className="mb-5 ">
            <SafeAreaView edges={["top"]}>
              <View className="flex-row gap-3 ">
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/(profile)/profile")}
                  className="w-10 h-10 rounded-full bg-[#F0E6D8] items-center justify-center"
                >
                  <Text className="text-lg text-primary -mt-0.5">‹</Text>
                </TouchableOpacity>
                <View className="flex-1">
                  <Text className="font-quicksand-bold text-xl text-dark-100">
                    Order History
                  </Text>
                </View>
              </View>
            </SafeAreaView>
            {error && (
              <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-3">
                <Text className="text-red-600 text-sm">{error}</Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={!error ? <EmptyState /> : null}
        renderItem={({ item }) => {
          const itemCount = Array.isArray(item.items) ? item.items.length : 0;
          const paymentMethod = item.payment?.method ?? undefined;

          return (
            <OrderCard
              order={item}
              itemCount={itemCount}
              paymentMethod={paymentMethod}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/(profile)/(orderDetail)/[id]" as const,
                  params: { id: item.$id },
                })
              }
            />
          );
        }}
      />
    </SafeAreaView>
  );
}
