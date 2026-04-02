import { Button, Input } from "@/components/atoms";
import AuthWrapper from "@/components/elements/AuthWrapper";
import { resetPasswordSchema } from "@/utils/validations/authValidation";
import { FormikProps, useFormik } from "formik";
import React from "react";
import { Keyboard, View, Text, ScrollView } from "react-native";

const PasswordInput = ({ loading, initialValues, onSubmit }: ResetPasswordFormProps) => {
  const formik: FormikProps<ResetPasswordTypes> = useFormik({
    validationSchema: resetPasswordSchema,
    initialValues: initialValues || { password: "", confirmPassword: "" },
    onSubmit: (values) => {
      Keyboard.dismiss();
      onSubmit(values);
    },
  });
  return (
    <AuthWrapper
      gradColors={["#F59E0B", "#D97706"]}
      title={"New Password"}
      subTitle={"Create a strong password"}
      icon="🔒"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Input
          isPassword
          label="New Password"
          placeholder="Enter new password"
          value={formik.values.password}
          onValueChange={formik.handleChange("password")}
          secureTextEntry={true}
          variant="outline"
          className="mb-4"
          labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
          //   endContent={
          //     <Pressable onPress={() => setShowPassword(!showPassword)}>
          //       <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
          //     </Pressable>
          //   }
        />

        <Input
          label="Confirm Password"
          placeholder="Re-enter password"
          value={formik.values.confirmPassword}
          onValueChange={formik.handleChange("confirmPassword")}
          //   secureTextEntry={!showPassword}
          isPassword
          variant="outline"
          className="mb-6"
          labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
        />

        <View className="mb-6 rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/20">
          <Text className="font-dm-sans text-sm leading-6 text-blue-700 dark:text-blue-300">
            Password must be at least 8 characters long
          </Text>
        </View>

        <Button
          title={loading ? "Resetting..." : "Reset Password"}
          //   onPress={handleResetPassword}
          onPress={formik.handleChange}
          loading={loading}
          disabled={!formik.values.password || !formik.values.confirmPassword}
          className="mb-4"
        />
      </ScrollView>
    </AuthWrapper>
  );
};

export default PasswordInput;
