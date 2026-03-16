import { useAuthStore } from "@/store/auth.store";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface SuccessModalProps {
  visible: boolean;
  type: "signIn" | "signUp";
}

export default function SuccessModal({ visible, type }: SuccessModalProps) {
  const isSignUp = type === "signUp";

  const { fetchAuthenticatedUser } = useAuthStore();
  const handleGoHome = () => {
    fetchAuthenticatedUser();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-8 w-full items-center gap-4">
          {/* Icon circle */}
          <View className="w-20 h-20 rounded-full bg-primary/10 justify-center items-center mb-2">
            <Text className="text-4xl">☕</Text>
          </View>

          {/* Title */}
          <Text className="h2-bold text-dark-100 text-center">
            {isSignUp ? "Welcome aboard!" : "Welcome back!"}
          </Text>

          {/* Subtitle */}
          <Text className="base-regular text-gray-100 text-center">
            {isSignUp
              ? "Your account has been created successfully. Enjoy your coffee!"
              : "You've signed in successfully. Ready for your next brew?"}
          </Text>

          {/* Go to Home button */}
          <TouchableOpacity
            onPress={handleGoHome}
            className="bg-primary w-full py-4 rounded-xl mt-2 items-center"
          >
            <Text className="base-bold text-white">Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
