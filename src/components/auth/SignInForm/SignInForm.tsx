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
    } catch (err) {
      showToast.error("Error", "An unexpected error occurred");
      setLoading(false);
    }
  };

  return <SignInForm loading={loading} onSubmit={handleSignIn} />;
};

export default SignInScreen;
