import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const MENU_ITEMS = [
  {
    icon: "bag-outline",
    label: "My Orders",
    subtitle: "Track & view your orders",
  },
  {
    icon: "heart-outline",
    label: "Wishlist",
    subtitle: "Items you've saved",
  },
  {
    icon: "card-outline",
    label: "Payment Methods",
    subtitle: "Manage your cards",
  },
  {
    icon: "location-outline",
    label: "Saved Addresses",
    subtitle: "Manage delivery locations",
  },
  {
    icon: "notifications-outline",
    label: "Notifications",
    subtitle: "Alerts & preferences",
  },
  {
    icon: "settings-outline",
    label: "Settings",
    subtitle: "App preferences",
  },
];

export default function Profile() {
  const { user } = useAuthStore();

  const joinedDate = user?.$createdAt
    ? new Date(user.$createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <ScrollView
      className="flex-1 bg-white-100"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="bg-primary px-6 pt-14 pb-20 relative overflow-hidden">
        {/* Decorative circles */}
        <View className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white opacity-5" />
        <View className="absolute top-8 -right-4 w-24 h-24 rounded-full bg-white opacity-5" />

        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white font-quicksand-bold text-xl tracking-wide">
            My Profile
          </Text>
          <TouchableOpacity className="w-9 h-9 rounded-full bg-white/10 items-center justify-center">
            <Ionicons name="pencil-outline" size={16} color="#FAF6F1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Avatar Card — overlapping header */}
      <View className="mx-5 -mt-14 bg-white rounded-3xl shadow-md px-5 py-5 flex-row items-center gap-4">
        <View className="relative">
          <View className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white-100">
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-primary/10 items-center justify-center">
                <Text className="text-primary font-quicksand-bold text-2xl">
                  {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                </Text>
              </View>
            )}
          </View>
          {/* Online dot */}
          <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-white" />
        </View>

        <View className="flex-1">
          <Text className="text-dark-100 font-quicksand-bold text-xl capitalize leading-tight">
            {user?.name ?? "Guest"}
          </Text>
          <Text
            className="text-gray-100 font-quicksand text-sm mt-0.5"
            numberOfLines={1}
          >
            {user?.email ?? "—"}
          </Text>
          {joinedDate && (
            <View className="flex-row items-center mt-1.5 gap-1">
              <Ionicons name="calendar-outline" size={11} color="#9A8C82" />
              <Text className="text-gray-100 font-quicksand text-xs">
                Member since {joinedDate}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Stats Row */}
      <View className="mx-5 mt-4 flex-row gap-3">
        {[
          { label: "Orders", value: "12" },
          { label: "Wishlist", value: "5" },
          { label: "Reviews", value: "3" },
        ].map((stat) => (
          <View
            key={stat.label}
            className="flex-1 bg-white rounded-2xl py-4 items-center shadow-sm"
          >
            <Text className="text-primary font-quicksand-bold text-2xl">
              {stat.value}
            </Text>
            <Text className="text-gray-100 font-quicksand text-xs mt-0.5">
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Menu Items */}
      <View className="mx-5 mt-4 bg-white rounded-3xl overflow-hidden shadow-sm mb-4">
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            className={`flex-row items-center px-5 py-4 ${
              index !== MENU_ITEMS.length - 1 ? "border-b border-white-100" : ""
            }`}
            activeOpacity={0.7}
          >
            {/* Icon bubble */}
            <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mr-4">
              <Ionicons name={item.icon as any} size={18} color="#5D4037" />
            </View>

            <View className="flex-1">
              <Text className="text-dark-100 font-quicksand-semibold text-sm">
                {item.label}
              </Text>
              <Text className="text-gray-100 font-quicksand text-xs mt-0.5">
                {item.subtitle}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={16} color="#9A8C82" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <View className="mx-5 mb-10">
        <TouchableOpacity
          className="bg-white border border-error/20 rounded-2xl py-4 flex-row items-center justify-center gap-2 shadow-sm"
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#D94F3D" />
          <Text className="text-error font-quicksand-semibold text-sm">
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
