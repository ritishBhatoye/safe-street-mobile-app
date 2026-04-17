import SignInForm from "@/components/forms/SignInForm";
import { authService } from "@/services/auth.service";
import { showToast } from "@/utils/toast";
import { router } from "expo-router";
import React, { useState } from "react";

const SignInScreen = () => {
  const [loading, setLoading] = useState(false);
  const handleSignIn = async (values: SignInFormType) => {
    setLoading(true);

    try {
      const { user, error } = await authService.signIn({
        email: values.email,
        password: values.password,
      });
      if (error) {
        showToast.error("Sign In Failed", error.message || "Failed to sign in");
        setLoading(false);
        return;
      }
      if (user) {
        showToast.success("Welcome Back!", "Successfully signed In");
        router.dismissTo("/(tabs)/home");
      }
    } catch (error) {
      showToast.error("Error", "An unexpected error occurred");
      setLoading(false);
    }
  };
  const handleSocialSignIn = async (provider: "google" | "apple") => {
    try {
      if (provider == "google") {
        const result = await authService.signInWithGoogle();
        if (result.error) {
          showToast.error(
            "Sign In Failed",
            result.error.message || "Failed to sign in with Google",
          );
        }
      } else if (provider == "apple") {
        const result = await authService.signInWithApple();
        if (result.error) {
          showToast.error("Sign In Failed", result.error.message || "Failed to sign in with Apple");
        }
      }
    } catch (error) {
      showToast.error("Error", "An unexpected error occurred");
    }
  };
  return (
    <SignInForm
      loading={loading}
      onSubmit={handleSignIn}
      handleOAuth={() => {
        void handleSocialSignIn;
      }}
    />
  );
};

export default SignInScreen;
