import CustomButton from "@/components/auth/customButton";
import CustomInput from "@/components/auth/customInput";
import SuccessModal from "@/components/auth/successModel";
import { SignIn } from "@/lib/appwrite";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInPage() {
  const [isSumbmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmitHandler = async () => {
    const { email, password } = form;
    if (!email || !password) {
      return Alert.alert("Please enter email and password");
    }
    setIsSubmitting(true);

    try {
      await SignIn({ email, password });
      setShowSuccess(true);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  {
    if (showSuccess) {
      return <SuccessModal visible={showSuccess} type="signIn" />;
    }
  }
  return (
    <SafeAreaView className="bg-white p-5">
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
      <CustomButton
        title={"Login"}
        onPress={onSubmitHandler}
        isLoading={isSumbmitting}
      />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Don&apos;t have an account?
        </Text>
        <Link href="/(auth)/signUp" className="base-bold text-primary">
          Sign Up
        </Link>
      </View>
    </SafeAreaView>
  );
}
