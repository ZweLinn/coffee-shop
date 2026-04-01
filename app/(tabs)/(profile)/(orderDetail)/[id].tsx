import { getOrderById } from "@/lib/appwrite";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  $id: string;
  menuName: string;
  quantity: number;
  basePrice: number;
  itemTotal: number;
  customizations: string; // JSON string
}

interface Payment {
  $id: string;
  amount: number;
  method: string;
  status: string;
}

interface Order {
  $id: string;
  $createdAt: string;
  status: string;
  totalPrice: number;
  deliveryFee: number;
  discount: number;
  note: string;
  items: OrderItem[];
  payment: Payment;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatPrice = (p: number) => p.toLocaleString() + " Ks";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_CONFIG: Record<
  string,
  { label: string; emoji: string; bg: string; text: string; bar: string }
> = {
  pending: {
    label: "Pending",
    emoji: "⏳",
    bg: "bg-[#FFF8EE]",
    text: "text-[#C47B2B]",
    bar: "bg-[#C47B2B]",
  },
  preparing: {
    label: "Preparing",
    emoji: "☕",
    bg: "bg-[#F0EBF8]",
    text: "text-[#7C4DCA]",
    bar: "bg-[#7C4DCA]",
  },
  ready: {
    label: "Ready",
    emoji: "✅",
    bg: "bg-[#EEF8F1]",
    text: "text-[#4A7C59]",
    bar: "bg-[#4A7C59]",
  },
  delivered: {
    label: "Delivered",
    emoji: "🎉",
    bg: "bg-[#EEF8F1]",
    text: "text-[#4A7C59]",
    bar: "bg-[#4A7C59]",
  },
  cancelled: {
    label: "Cancelled",
    emoji: "✕",
    bg: "bg-[#FEF0EE]",
    text: "text-error",
    bar: "bg-error",
  },
};

const PAYMENT_LABELS: Record<string, string> = {
  cash_on_delivery: "Cash on Delivery",
  card: "Credit / Debit Card",
  wallet: "Digital Wallet",
};

const STEPS = ["pending", "preparing", "ready", "delivered"];

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View
    className={`bg-white rounded-2xl mx-5 mb-4 px-5 py-4 shadow-sm border border-[#F0E6D8] ${className}`}
  >
    {children}
  </View>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Text className="font-quicksand-bold text-[13px] uppercase tracking-widest text-gray-100 mb-3">
    {title}
  </Text>
);

const Divider = () => <View className="h-px bg-[#F0E6D8] my-3" />;

const Row = ({
  label,
  value,
  bold,
  accent,
  large,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
  large?: boolean;
}) => (
  <View className="flex-row justify-between items-center py-0.5">
    <Text
      className={`font-quicksand text-sm ${bold ? "font-quicksand-bold text-dark-100" : "text-gray-100"} ${large ? "text-base" : ""}`}
    >
      {label}
    </Text>
    <Text
      className={`${bold ? "font-quicksand-bold" : "font-quicksand-medium"} text-sm ${accent ? "text-white-200" : "text-dark-100"} ${large ? "text-base" : ""}`}
    >
      {value}
    </Text>
  </View>
);

// ─── Status Progress Bar ───────────────────────────────────────────────────────

const StatusProgress = ({ status }: { status: string }) => {
  const currentIndex = STEPS.indexOf(status);
  if (currentIndex === -1 || status === "cancelled") return null;

  return (
    <View className="flex-row items-center justify-between mt-1">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === STEPS.length - 1;
        return (
          <View key={step} className="flex-row items-center flex-1">
            {/* Dot */}
            <View
              className={`w-3 h-3 rounded-full ${done ? "bg-primary" : "bg-[#E8D5C0]"}`}
            />
            {/* Line */}
            {!isLast && (
              <View className="flex-1 h-0.5 mx-0.5">
                <View
                  className={`h-full ${i < currentIndex ? "bg-primary" : "bg-[#E8D5C0]"}`}
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

// ─── Order Item Card ──────────────────────────────────────────────────────────

const OrderItemCard = ({ item }: { item: OrderItem }) => {
  let customizations: { name: string; price: number }[] = [];
  try {
    customizations = JSON.parse(item.customizations);
  } catch {
    /* empty */
  }

  return (
    <View className="py-3">
      <View className="flex-row justify-between items-start">
        {/* Left: qty badge + name */}
        <View className="flex-row items-start gap-3 flex-1">
          <View className="w-8 h-8 rounded-xl bg-[#F0E6D8] items-center justify-center mt-0.5">
            <Text className="font-quicksand-bold text-sm text-primary">
              {item.quantity}×
            </Text>
          </View>
          <View className="flex-1">
            <Text className="font-quicksand-bold text-[15px] text-dark-100 leading-5">
              {item.menuName}
            </Text>
            {customizations.length > 0 && (
              <View className="flex-row flex-wrap gap-1.5 mt-1.5">
                {customizations.map((c, i) => (
                  <View key={i} className="bg-[#F9F3ED] px-2 py-0.5 rounded-lg">
                    <Text className="font-quicksand text-xs text-gray-100">
                      {c.name} +{formatPrice(c.price)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            <Text className="font-quicksand text-xs text-gray-100 mt-1">
              Base: {formatPrice(item.basePrice)}
            </Text>
          </View>
        </View>

        {/* Right: item total */}
        <Text className="font-quicksand-bold text-[15px] text-dark-100 ml-2">
          {formatPrice(item.itemTotal)}
        </Text>
      </View>
    </View>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function OrderDetail() {
  const id = useLocalSearchParams<{ id: string }>().id;
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then((data: any) => setOrder(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white-100">
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#5D4037" />
        <Text className="font-quicksand text-gray-100 mt-3">
          Loading order…
        </Text>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white-100">
        <Text className="text-5xl mb-4">☕</Text>
        <Text className="font-quicksand-bold text-dark-100 text-lg">
          Order not found
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="font-quicksand text-primary">← Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG["pending"];
  const subtotal = order.totalPrice - order.deliveryFee + order.discount;

  return (
    <View className="flex-1 bg-white-100">
      <StatusBar barStyle="dark-content" />

      {/* ── Header ── */}
      <SafeAreaView edges={["top"]} className="bg-white-100">
        <View className="flex-row items-center px-5 pt-2 pb-4 gap-3">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/(profile)/orderList")}
            className="w-10 h-10 rounded-full bg-[#F0E6D8] items-center justify-center"
          >
            <Text className="text-lg text-primary -mt-0.5">‹</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="font-quicksand-bold text-xl text-dark-100">
              Order Detail
            </Text>
            <Text className="font-quicksand text-xs text-gray-100">
              #{order.$id.slice(-8).toUpperCase()}
            </Text>
          </View>
          {/* Status pill */}
          <View
            className={`px-3 py-1.5 rounded-full flex-row items-center gap-1 ${statusCfg.bg}`}
          >
            <Text className="text-xs">{statusCfg.emoji}</Text>
            <Text className={`font-quicksand-bold text-xs ${statusCfg.text}`}>
              {statusCfg.label}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ── Order Status Progress ── */}
        {order.status !== "cancelled" && (
          <SectionCard>
            <SectionTitle title="Order Progress" />
            <StatusProgress status={order.status} />
            <View className="flex-row justify-between mt-2">
              {STEPS.map((s) => (
                <Text
                  key={s}
                  className={`font-quicksand text-[10px] capitalize ${
                    s === order.status
                      ? "text-primary font-quicksand-bold"
                      : "text-gray-100"
                  }`}
                >
                  {s}
                </Text>
              ))}
            </View>
          </SectionCard>
        )}

        {/* ── Date & Order ID ── */}
        <SectionCard>
          <SectionTitle title="Order Info" />
          <Row
            label="Order ID"
            value={"#" + order.$id.slice(-8).toUpperCase()}
          />
          <Row label="Placed on" value={formatDate(order.$createdAt)} />
        </SectionCard>

        {/* ── Items ── */}
        <SectionCard>
          <SectionTitle title={`Items (${order.items.length})`} />
          {order.items.map((item, i) => (
            <View key={item.$id}>
              <OrderItemCard item={item} />
              {i < order.items.length - 1 && <Divider />}
            </View>
          ))}
        </SectionCard>

        {/* ── Price Summary ── */}
        <SectionCard>
          <SectionTitle title="Price Summary" />
          <Row label="Subtotal" value={formatPrice(subtotal)} />
          <Row label="Delivery Fee" value={formatPrice(order.deliveryFee)} />
          {order.discount > 0 && (
            <Row
              label="Discount"
              value={"−" + formatPrice(order.discount)}
              accent
            />
          )}
          <Divider />
          <Row label="Total" value={formatPrice(order.totalPrice)} bold large />
        </SectionCard>

        {/* ── Payment ── */}
        <SectionCard>
          <SectionTitle title="Payment" />
          <Row
            label="Method"
            value={PAYMENT_LABELS[order.payment.method] ?? order.payment.method}
          />
          <Row label="Amount" value={formatPrice(order.payment.amount)} />
          <View className="flex-row justify-between items-center py-0.5 mt-0.5">
            <Text className="font-quicksand text-sm text-gray-100">Status</Text>
            <View
              className={`px-2.5 py-1 rounded-full ${
                order.payment.status === "paid"
                  ? "bg-[#EEF8F1]"
                  : "bg-[#FFF8EE]"
              }`}
            >
              <Text
                className={`font-quicksand-bold text-xs capitalize ${
                  order.payment.status === "paid"
                    ? "text-success"
                    : "text-[#C47B2B]"
                }`}
              >
                {order.payment.status}
              </Text>
            </View>
          </View>
        </SectionCard>

        {/* ── Note ── */}
        {!!order.note && (
          <SectionCard>
            <SectionTitle title="Note" />
            <Text className="font-quicksand text-sm text-dark-100 leading-5">
              {order.note}
            </Text>
          </SectionCard>
        )}

        {/* ── CTA for pending orders ── */}
        {order.status === "pending" && (
          <View className="mx-5 mt-1">
            <TouchableOpacity className="h-14 bg-error rounded-[18px] items-center justify-center">
              <Text className="font-quicksand-bold text-white text-[15px]">
                Cancel Order
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
