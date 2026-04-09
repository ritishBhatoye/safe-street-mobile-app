import { Button } from "@/components/atoms";
import AuthWrapper from "@/components/elements/AuthWrapper";
import { router } from "expo-router";
import React from "react";

const OtpSuccess = () => {
  return (
    <AuthWrapper
      gradColors={["#22C55E", "#16A34A"]}
      title={"Password Reset!"}
      subTitle={
        "Your password has been successfully reset.You can now sign in with your new password."
      }
    >
      <Button
        title="Back to Sign In"
        onPress={() => router.dismissTo("/(auth)/sign-in")}
        variant="secondary"
        className="w-full bg-white"
      />
    </AuthWrapper>
  );
};

export default OtpSuccess;
