import CustomButton from "@/components/auth/customButton";
import CartItem from "@/components/cart/cartItem";
import PaymentInfoStripe from "@/components/cart/paymentInfo";
import PaymentMethodSheet from "@/components/cart/paymentMethodSheet";

import CustomHeader from "@/components/customHeader";
import { EmptyState } from "@/components/emptyState";
import { createOrder } from "@/lib/appwrite";

import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { CartItemType, PaymentMethod } from "@/type";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Cart() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethod>("cash_on_delivery");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const DELIVERY_FEE = 1000;
  const DISCOUNT = 500;

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const grandTotal = totalPrice + DELIVERY_FEE - DISCOUNT;

  const handleOrderNow = () => {
    setError(null);
    setShowPaymentSheet(true); // open bottom sheet first
  };

  const handleConfirmOrder = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const result = await createOrder({
        userId: user.$id,
        items: items as CartItemType[],
        totalPrice: grandTotal,
        paymentMethod: selectedPayment,
        deliveryFee: DELIVERY_FEE,
        discount: DISCOUNT,
      });

      setOrderId(result.orderId);
      clearCart();
      setShowPaymentSheet(false);
      setShowSuccess(true);
    } catch (e) {
      setError("Failed to place order. Please try again.");
      setShowPaymentSheet(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    if (orderId) {
      router.push({
        pathname: "/(tabs)/(profile)/(orderDetail)/[id]" as const,
        params: { id: orderId },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1">
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
              {/* Error banner */}
              {error && (
                <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <Text className="text-red-600 text-sm">{error}</Text>
                </View>
              )}

              {/* Payment summary */}
              <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                <Text className="h3-bold text-dark-100 mb-5">
                  Payment Summary
                </Text>
                <PaymentInfoStripe
                  label={`Total Items (${totalItems})`}
                  value={`Ks ${totalPrice.toLocaleString()}`}
                />
                <PaymentInfoStripe
                  label="Delivery Fee"
                  value={`Ks ${DELIVERY_FEE.toLocaleString()}`}
                />
                <PaymentInfoStripe
                  label="Discount"
                  value={`- Ks ${DISCOUNT.toLocaleString()}`}
                  valueStyle="!text-success"
                />
                <View className="border-t border-gray-300 my-2" />
                <PaymentInfoStripe
                  label="Total"
                  value={`Ks ${grandTotal.toLocaleString()}`}
                  labelStyle="base-bold !text-dark-100"
                  valueStyle="base-bold !text-dark-100 !text-right"
                />
              </View>

              {/* Opens payment bottom sheet */}
              <CustomButton
                onPress={handleOrderNow}
                title="Order Now"
                isLoading={loading}
              />
            </View>
          )
        }
      />

      <PaymentMethodSheet
        visible={showPaymentSheet}
        selected={selectedPayment}
        grandTotal={grandTotal}
        onSelect={setSelectedPayment}
        onConfirm={handleConfirmOrder}
        onClose={() => setShowPaymentSheet(false)}
        isLoading={loading}
      />

      {/* ── Success modal ─────────────────────────────────────── */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full rounded-3xl p-8 items-center gap-4">
            <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-2">
              <Text style={{ fontSize: 36 }}>✓</Text>
            </View>

            <Text className="h2-bold text-dark-100 text-center">
              Order Placed!
            </Text>
            <Text className="base-regular text-gray-500 text-center">
              Your order has been received and is being prepared.
            </Text>

            <TouchableOpacity
              onPress={() => handleCloseSuccess()}
              className="w-full bg-primary rounded-2xl py-4 mt-2 items-center"
              activeOpacity={0.8}
            >
              <Text className="base-bold text-white">Order Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
