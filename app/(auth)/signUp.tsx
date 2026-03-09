import CustomButton from "@/components/auth/customButton";
import CustomInput from "@/components/auth/customInput";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function SignIn() {
  const [isSumbmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onSubmitHandler = async () => {
    if (!form.email || !form.password) {
      return Alert.alert("Please enter email and password");
    }
    setIsSubmitting(true);

    try {
      //call app write

      Alert.alert("User Sign In successfully");
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <CustomButton title={"Sign Up"} onPress={onSubmitHandler} />

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
