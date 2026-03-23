import { PaymentMethod } from "@/type";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface PaymentOption {
  method: PaymentMethod;
  label: string;
  description: string;
  icon: string; // emoji as simple icon
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    method: "cash_on_delivery",
    label: "Cash on delivery",
    description: "Pay when your order arrives",
    icon: "💵",
  },
  // Add more later e.g. { method: "qr_code", label: "QR / PromptPay", ... }
];

interface PaymentMethodSheetProps {
  visible: boolean;
  selected: PaymentMethod;
  grandTotal: number;
  onSelect: (method: PaymentMethod) => void;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

const PaymentMethodSheet = ({
  visible,
  selected,
  grandTotal,
  onSelect,
  onConfirm,
  onClose,
  isLoading = false,
}: PaymentMethodSheetProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        className="flex-1 bg-black/40"
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Sheet */}
      <View className="bg-white rounded-t-3xl px-6 pt-5 pb-10">
        {/* Handle */}
        <View className="w-10 h-1 rounded-full bg-gray-300 self-center mb-6" />

        <Text className="h3-bold text-dark-100 mb-1">Payment method</Text>
        <Text className="base-regular text-gray-400 mb-6">
          Choose how you&apos;d like to pay
        </Text>

        {/* Options */}
        {PAYMENT_OPTIONS.map((option) => {
          const isSelected = selected === option.method;
          return (
            <TouchableOpacity
              key={option.method}
              onPress={() => onSelect(option.method)}
              activeOpacity={0.8}
              className={`flex-row items-center p-4 rounded-2xl mb-3 border ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Icon */}
              <View className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center mr-4">
                <Text style={{ fontSize: 22 }}>{option.icon}</Text>
              </View>

              {/* Label */}
              <View className="flex-1">
                <Text className="paragraph-semibold text-dark-100">
                  {option.label}
                </Text>
                <Text className="small-regular text-gray-400">
                  {option.description}
                </Text>
              </View>

              {/* Radio indicator */}
              <View
                className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                  isSelected ? "border-primary" : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Total + confirm */}
        <View className="flex-row items-center justify-between mt-4 mb-5">
          <Text className="base-regular text-gray-500">Total</Text>
          <Text className="h3-bold text-dark-100">
            Ks {grandTotal.toLocaleString()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onConfirm}
          disabled={isLoading}
          activeOpacity={0.8}
          className="custom-btn items-center"
        >
          {isLoading ? (
            <Text className="text-white-100 paragraph-semibold">
              Placing order...
            </Text>
          ) : (
            <Text className="text-white-100 paragraph-semibold">
              Confirm order
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default PaymentMethodSheet;
