import { Button, Input } from "@/components/atoms";
import AuthWrapper from "@/components/elements/AuthWrapper";
import { emailSchema } from "@/utils/validations/authValidation";
import { FormikProps, useFormik } from "formik";
import React from "react";
import { Keyboard, ScrollView, View, Text } from "react-native";

const EmailInput = ({ loading, onSubmit, initialValues }: EmailFormProps) => {
  const formik: FormikProps<EmailTypes> = useFormik<EmailTypes>({
    initialValues: initialValues || { email: "" },
    validationSchema: emailSchema,
    onSubmit: (values) => {
      Keyboard.dismiss();
      onSubmit(values);
    },
  });
  return (
    <AuthWrapper
      icon={"🔑"}
      title={"Forgot Password?"}
      subTitle={"We'll send you a verification code"}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 rounded-2xl bg-warning-50 p-4 dark:bg-warning-900/20">
          <Text className="font-dm-sans text-sm leading-6 text-warning-700 dark:text-warning-300">
            Enter your email and we&apos;ll send you a 6-digit verification code.
          </Text>
        </View>

        <Input
          label="Email Address"
          placeholder="your.email@example.com"
          value={formik.values.email}
          onValueChange={formik.handleChange("email")}
          keyboardType="email-address"
          autoCapitalize="none"
          variant="outline"
          className="mb-6"
          labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
        />

        <Button
          title={loading ? "Sending..." : "Send OTP"}
          onPress={handleSendOTP}
          loading={loading}
          disabled={!email}
          className="mb-4"
        />
      </ScrollView>
    </AuthWrapper>
  );
};

export default EmailInput;
