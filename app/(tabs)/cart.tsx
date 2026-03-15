import CustomButton from "@/components/auth/customButton";
import CartItem from "@/components/cart/cartItem";
import PaymentInfoStripe from "@/components/cart/paymentInfo";
import CustomHeader from "@/components/customHeader";
import { EmptyState } from "@/components/emptyState";
import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
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
          <CartItem item={item as unknown as CartItemType} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<CustomHeader title="Cart" />}
        ListEmptyComponent={<EmptyState />}
        contentContainerClassName="pb-28 pt-5 px-5"
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View className="gap-5">
              <View className="mt-6 border border-gray-200 p-5 p rounded-2xl">
                <Text className="h3-bold text-dark-100 mb-5">
                  Payment Summary
                </Text>
                <PaymentInfoStripe
                  label={`Total Items (${totalItems})`}
                  value={`Ks ${totalPrice.toFixed(2)}`}
                />
                <PaymentInfoStripe label={`Delivery Fee`} value={`Ks 1000`} />
                <PaymentInfoStripe
                  label={`Discount`}
                  value={`- Ks 500`}
                  valueStyle="!text-success"
                />
                <View className="border-t border-gray-300 my-2" />
                <PaymentInfoStripe
                  label={`Total`}
                  value={`Ks ${(totalPrice + 5 - 0.5).toFixed(2)}`}
                  labelStyle="base-bold !text-dark-100"
                  valueStyle="base-bold !text-dark-100 !text-right"
                />
              </View>
              <CustomButton title="Order Now" />
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
