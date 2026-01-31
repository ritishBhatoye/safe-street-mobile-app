import { Button, Input } from "@/components/atoms";
import { emailSchema } from "@/utils/validations/authValidation";
import { FormikProps, useFormik } from "formik";
import React from "react";
import { View, Text, Keyboard } from "react-native";

interface EmailFormProps {
  initialValues: EmailTypes;
  loading: boolean;
  onSubmit: (values: EmailTypes) => void;
}

const EmailStep = ({ initialValues, loading, onSubmit }: EmailFormProps) => {
  const formik: FormikProps<EmailTypes> = useFormik<EmailTypes>({
    initialValues: initialValues,
    validationSchema: emailSchema,
    onSubmit: (values) => {
      Keyboard.dismiss();
      onSubmit(values);
    },
  });

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <>
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
        error={formik.errors.email}
        onBlur={formik.handleBlur("email")}
        touched={formik.touched.email}
      />

      <Button
        title={loading ? "Sending..." : "Send OTP"}
        onPress={handleSubmit}
        loading={loading}
        disabled={!formik.values.email || !formik.isValid}
        className="mb-4"
      />
    </>
  );
};

export default EmailStep;
