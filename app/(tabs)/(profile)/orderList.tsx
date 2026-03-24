import CustomHeader from "@/components/customHeader";
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
        contentContainerClassName="px-5 pt-5 pb-28"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchOrders(true)}
          />
        }
        ListHeaderComponent={
          <View className="mb-5">
            <CustomHeader title="My Orders" />
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
              onPress={() => router.push(`/orders/${item.$id}`)} // adjust route
            />
          );
        }}
      />
    </SafeAreaView>
  );
}
