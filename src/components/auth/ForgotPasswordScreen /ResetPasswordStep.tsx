import { Button, Input } from "@/components/atoms";
import { resetPasswordSchema } from "@/utils/validations/authValidation";
import { Ionicons } from "@expo/vector-icons";
import { FormikProps, useFormik } from "formik";
import React from "react";
import { Pressable, View, Text, Keyboard } from "react-native";
interface ResetPasswordFormProps {
  showPassword: boolean;
  loading: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (values: ResetPasswordTypes) => void;
}

const ResetPasswordStep = ({
  showPassword,
  setShowPassword,
  loading,
  onSubmit,
}: ResetPasswordFormProps) => {
  const formik: FormikProps<ResetPasswordTypes> = useFormik<ResetPasswordTypes>({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: (values) => {
      Keyboard.dismiss();
      onSubmit(values);
    },
    enableReinitialize: true,
  });
  return (
    <>
      <Input
        label="New Password"
        placeholder="Enter new password"
        value={formik.values.password}
        // onValueChange={formik.handleChange("password")}
        secureTextEntry={!showPassword}
        variant="outline"
        className="mb-4"
        labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
        endContent={
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
          </Pressable>
        }
        error={formik.errors.password}
        onBlur={formik.handleBlur("password")}
        touched={formik.touched.password}
        onChangeText={formik.handleChange("password")}
      />

      <Input
        label="Confirm Password"
        placeholder="Re-enter password"
        value={formik.values.confirmPassword}
        // onValueChange={formik.handleChange("confirmPassword")}
        secureTextEntry={!showPassword}
        variant="outline"
        className="mb-6"
        labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
        error={formik.errors.confirmPassword}
        onBlur={formik.handleBlur("confirmPassword")}
        touched={formik.touched.confirmPassword}
        onChangeText={formik.handleChange("confirmPassword")}
      />

      <View className="mb-6 rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/20">
        <Text className="font-dm-sans text-sm leading-6 text-blue-700 dark:text-blue-300">
          Password must be at least 8 characters long
        </Text>
      </View>

      <Button
        title={loading ? "Resetting..." : "Reset Password"}
        onPress={() => formik.handleSubmit()}
        loading={loading}
        disabled={!formik.values.password || !formik.values.confirmPassword}
        className="mb-4"
      />
    </>
  );
};

export default ResetPasswordStep;
