import { signInSchema } from "@/utils/validations/authValidation";
import { FormikProps, useFormik } from "formik";
import React from "react";
import { Keyboard, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Button, Divider, Input } from "../atoms";
import OAuthAction from "../auth/SignInForm/OAuthAction";
import { router } from "expo-router";
import AuthWrapper from "../elements/AuthWrapper";
import TouchCTA from "../elements/TouchCTA";
import { useOAuth } from "@/hooks/useOAuth";

const SignInForm = ({ initialValues, onSubmit, loading }: SignInFormProps) => {
  const { signInWithGoogle } = useOAuth();

  const formik: FormikProps<SignInFormType> = useFormik<SignInFormType>({
    initialValues: initialValues || { email: "", password: "" },
    validationSchema: signInSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      Keyboard.dismiss();
      onSubmit(values);
    },
  });

  const handleOAuth = async (provider: "google") => {
    await signInWithGoogle();
  };

  return (
    <AuthWrapper
      title={"Welcome Back"}
      subTitle={"Sign in to stay safe and connected"}
      gradColors={["#3399FF", "#0080FF"]}
    >
      <ScrollView>
        <View>
          <Input
            isRequired
            label="Email"
            placeholder="your.email@example.com"
            value={formik.values.email}
            onValueChange={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            error={formik.touched.email ? formik.errors.email : undefined}
            touched={formik.touched.email}
            keyboardType="email-address"
            variant="outline"
            className="mb-4"
            labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
          />

          <Input
            isRequired
            label="Password"
            placeholder="Enter your password"
            value={formik.values.password}
            onValueChange={formik.handleChange("password")}
            onBlur={formik.handleBlur("password")}
            error={formik.touched.password ? formik.errors.password : undefined}
            touched={formik.touched.password}
            isPassword
            variant="outline"
            className="mb-2"
            labelClassName="font-dm-sans-medium text-gray-700 dark:text-gray-300"
          />
          <TouchCTA
            className="mb-6 self-end"
            title={"Forgot Password?"}
            onPress={() => router.push("/(auth)/forgot-password")}
          />
          <Button
            title={loading ? "Signing In..." : "Sign In"}
            onPress={() => formik.handleSubmit()}
            loading={loading}
            disabled={!formik.values.email || !formik.values.password || !formik.errors}
            className="mb-6"
          />
        </View>
        {/* Divider */}
        <View className="mb-6 flex-row items-center gap-4">
          <Divider className="flex-1" />
          <Text className="font-dm-sans text-sm text-gray-500 dark:text-gray-400">
            Or continue with
          </Text>
          <Divider className="flex-1" />
        </View>

        {/* Social Sign In */}
        <OAuthAction handlePress={handleOAuth} />
        {/* Sign Up Link */}
        <View className="flex-row items-center justify-center gap-1">
          <Text className="font-dm-sans text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("./register")}>
            <Text className="font-dm-sans-bold text-primary-500">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AuthWrapper>
  );
};

export default SignInForm;
