import { Button } from "@/components/atoms";
import { formatOTPTimer } from "@/utils/handlers";
import { otpSchema } from "@/utils/validations/authValidation";
import { FormikProps, useFormik } from "formik";
import React from "react";
import { View, Text, TextInput, Pressable, Keyboard } from "react-native";

interface OtpFormProps {
  initialValues: OtpTypes;
  timer: number;
  otpRefs: React.RefObject<(TextInput | null)[]>;
  loading: boolean;
  onSubmit: (values: OtpTypes) => void;
  handleResendOTP: () => Promise<void>;
}

const OtpStep = ({
  timer,
  otpRefs,
  handleResendOTP,
  loading,
  initialValues,
  onSubmit,
}: OtpFormProps) => {
  const formik: FormikProps<OtpTypes> = useFormik<OtpTypes>({
    initialValues: initialValues,
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

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <>
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

        {/* Timer and Resend Button */}
        <View className="mt-6 items-center">
          {timer > 0 ? (
            <>
              <Text className="font-dm-sans text-sm text-gray-500 dark:text-gray-400">
                Resend OTP in
              </Text>
              <Text className="font-dm-sans-bold mt-1 text-xl text-primary-500">
                {formatOTPTimer(timer)}
              </Text>
            </>
          ) : (
            <Pressable
              onPress={handleResendOTP}
              disabled={loading}
              className="rounded-xl bg-primary-500 px-6 py-3"
            >
              <Text className="font-dm-sans-semibold text-white">
                {loading ? "Sending..." : "Resend OTP"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <Button
        title="Verify & Continue"
        onPress={handleSubmit}
        disabled={formik.values.otp.join("").length !== 6}
        className="mb-4"
      />
    </>
  );
};

export default OtpStep;
