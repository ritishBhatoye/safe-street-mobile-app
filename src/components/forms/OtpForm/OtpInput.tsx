import { Button } from "@/components/atoms";
import { otpSchema } from "@/utils/validations/authValidation";
import { FormikProps, useFormik } from "formik";
import React, { useRef } from "react";
import { View, Text, TextInput, Keyboard } from "react-native";

const OtpInput = ({ loading, onSubmit, initialValues }: OtpFormProps) => {
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const formik: FormikProps<OtpTypes> = useFormik<OtpTypes>({
    initialValues: initialValues || { otp: ["", "", "", "", "", ""], email: "" },
    validationSchema: otpSchema,
    onSubmit: (values) => {
      Keyboard.dismiss();
      onSubmit(values);
    },
  });

  // Handle OTP input
  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split("");
      const newOtp = [...formik.values.otp];
      pastedCode.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      formik.setFieldValue("otp", newOtp);
      otpRefs.current?.[5]?.focus();
      return;
    }

    const newOtp = [...formik.values.otp];
    newOtp[index] = value;
    formik.setFieldValue("otp", newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current?.[index + 1]?.focus();
    }
  };

  // Handle OTP backspace
  const handleOTPKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !formik.values.otp[index] && index > 0) {
      otpRefs.current?.[index - 1]?.focus();
    }
  };

  return (
    <View>
      <View className="mb-8">
        <Text className="font-dm-sans-medium mb-4 text-center text-gray-700 dark:text-gray-300">
          Enter the 6-digit code
        </Text>

        <View className="flex-row justify-between gap-2">
          {formik.values.otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (otpRefs.current) {
                  otpRefs.current[index] = ref;
                }
              }}
              value={digit}
              onChangeText={(value) => handleOTPChange(index, value)}
              onKeyPress={({ nativeEvent }) => handleOTPKeyPress(index, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              className="h-14 flex-1 rounded-xl border-2 border-gray-300 bg-white text-center text-2xl font-dm-sans-bold text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              style={{ minWidth: 45 }}
            />
          ))}
        </View>
      </View>

      <Button
        title="Verify & Continue"
        onPress={() => formik.handleSubmit()}
        loading={loading}
        disabled={formik.values.otp.join("").length !== 6}
        className="mb-4"
      />
    </View>
  );
};

export default OtpInput;
