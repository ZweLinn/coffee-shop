import { Text, TouchableOpacity, View } from "react-native";
import { Models } from "react-native-appwrite";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus = "pending" | "preparing" | "completed" | "cancelled";

export interface PaymentDocument extends Models.Document {
  method: string;
  status: string;
  amount: number;
}

export interface OrderItemDocument extends Models.Document {
  menuName: string;
  quantity: number;
  basePrice: number;
  customizations: string;
  itemTotal: number;
}

export interface OrderDocument extends Models.Document {
  userId: string;
  status: OrderStatus;
  totalPrice: number;
  deliveryFee: number;
  discount: number;
  note?: string;
  items?: OrderItemDocument[];
  payment?: PaymentDocument | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700" },
  preparing: { label: "Preparing", bg: "bg-blue-100", text: "text-blue-700" },
  completed: { label: "Completed", bg: "bg-green-100", text: "text-green-700" },
  cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-600" },
};

const PAYMENT_LABEL: Record<string, string> = {
  cash_on_delivery: "Cash on delivery",
  qr_code: "QR / PromptPay",
  credit_card: "Credit card",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    "  " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

function shortId(id: string) {
  return "#" + id.slice(-8).toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────────

interface OrderCardProps {
  order: OrderDocument;
  itemCount: number;
  paymentMethod?: string;
  onPress?: () => void;
}

export default function OrderCard({
  order,
  itemCount,
  paymentMethod,
  onPress,
}: OrderCardProps) {
  // Guard: if order is somehow undefined, render nothing
  if (!order) return null;

  const status = order.status ?? "pending";
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="bg-white border border-gray-200 rounded-2xl p-4 mb-3"
    >
      {/* Top row: short ID + status badge */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="paragraph-semibold text-dark-100">
          {shortId(order.$id)}
        </Text>
        <View className={`px-3 py-1 rounded-full ${statusCfg.bg}`}>
          <Text className={`small-semibold ${statusCfg.text}`}>
            {statusCfg.label}
          </Text>
        </View>
      </View>

      <View className="border-t border-gray-100 mb-3" />

      {/* Info rows */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="small-regular text-gray-400">Date</Text>
          <Text className="small-semibold text-dark-100">
            {formatDate(order.$createdAt)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="small-regular text-gray-400">Items</Text>
          <Text className="small-semibold text-dark-100">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="small-regular text-gray-400">Payment</Text>
          <Text className="small-semibold text-dark-100">
            {paymentMethod
              ? (PAYMENT_LABEL[paymentMethod] ?? paymentMethod)
              : "—"}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="small-regular text-gray-400">Total</Text>
          <Text className="paragraph-semibold text-dark-100">
            Ks {(order.totalPrice ?? 0).toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
