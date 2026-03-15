import PaymentInfoStripe from "@/components/cart/paymentInfo";
import { EmptyState } from "@/components/emptyState";
import { useCartStore } from "@/store/cart.store";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Cart() {
  const { items, getTotalItems, getTotalPrice } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  return (
    <SafeAreaView>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View>
            <Text>Items</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState />}
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View className="gap-5">
              <View className="mt-5 border border-primary">
                <Text>Payment Summary</Text>
              </View>
              <PaymentInfoStripe
                label={`Total Items (${totalItems})`}
                value={`$${totalPrice.toFixed(2)}`}
              />
              <PaymentInfoStripe label={`Delivery Fee`} value={`$5.00`} />
              <PaymentInfoStripe
                label={`Discount`}
                value={`- $0.50`}
                valueStyle="!text-success"
              />
              <View className="border-t border-gray-300 my-2" />
              <PaymentInfoStripe
                label={`Total`}
                value={`$${(totalPrice + 5 - 0.5).toFixed(2)}`}
                labelStyle="base-bold !text-dark-100"
                valueStyle="base-bold !text-dark-100 !text-right"
              />
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
