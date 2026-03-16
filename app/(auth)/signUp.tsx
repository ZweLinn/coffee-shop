import CustomButton from "@/components/auth/customButton";
import CustomInput from "@/components/auth/customInput";
import SuccessModal from "@/components/auth/successModel";
import { createUser } from "@/lib/appwrite";
import { useAuthStore } from "@/store/auth.store";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function SignInPage() {
  const [isSumbmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { fetchAuthenticatedUser } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onSubmitHandler = async () => {
    const { name, email, password, confirmPassword } = form;
    if (!email || !password) {
      return Alert.alert("Please enter email and password");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Password doesn't match");
    }
    setIsSubmitting(true);

    try {
      await createUser({ email, password, name, confirmPassword });
      setShowSuccess(true);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  {
    if (showSuccess) {
      return <SuccessModal visible={showSuccess} type="signUp" />;
    }
  }

  return (
    <SafeAreaView className="bg-white p-5">
      <CustomInput
        label={"Name"}
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        placeholder="Enter your Name"
      />
      <CustomInput
        label={"Email"}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        value={form.email}
        placeholder="Enter your email"
      />
      <CustomInput
        label={"Password"}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        value={form.password}
        placeholder="Enter your password"
        secureTextEntry={true}
      />
      <CustomInput
        label={"Confirm Password"}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, confirmPassword: text }))
        }
        value={form.confirmPassword}
        placeholder="Enter your password"
        secureTextEntry={true}
      />
      <CustomButton
        title={"Sign Up"}
        onPress={onSubmitHandler}
        isLoading={isSumbmitting}
      />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Already have an account?
        </Text>
        <Link href="/(auth)/signIn" className="base-bold text-primary">
          Sign In
        </Link>
      </View>
    </SafeAreaView>
  );
}
