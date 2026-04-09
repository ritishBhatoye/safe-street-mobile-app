import { authService } from "@/services/auth.service";
import { showToast } from "@/utils/toast";
import React, { useState } from "react";
import EmailInput from "./EmailInput";
import OtpInput from "./OtpInput";
import OtpSuccess from "./OtpSuccess";
import PasswordInput from "./PasswordInput";

type Step = "email" | "otp" | "password" | "success";

export default function ForgotPasswordOTPScreen() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (values: EmailTypes) => {
    setLoading(true);
    const result = await authService.sendPasswordResetOTP(values.email);

    if (result.error) {
      showToast.error("Failed", result.error.message || "Failed to send OTP");
      setLoading(false);
      return;
    }

    setEmail(values.email);
    setLoading(false);
    setStep("otp");
    showToast.success("OTP Sent!", "Check your email for the verification code");
  };

  const handleOtpSubmit = async (values: OtpTypes) => {
    setLoading(true);
    const otpCode = values.otp.join("");

    const result = await authService.verifyOTP(values.email, otpCode);

    if (result.error) {
      showToast.error("Failed", result.error.message || "Invalid OTP");
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep("password");
  };

  const handlePasswordSubmit = async (values: ResetPasswordTypes) => {
    setLoading(true);
    const result = await authService.resetPassword(values.password);

    if (result.error) {
      showToast.error("Failed", result.error.message || "Failed to reset password");
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep("success");
    showToast.success("Success!", "Your password has been reset");
  };

  if (step === "success") {
    return <OtpSuccess />;
  }

  if (step === "email") {
    return (
      <EmailInput loading={loading} onSubmit={handleEmailSubmit} initialValues={{ email: "" }} />
    );
  }

  if (step === "otp") {
    return (
      <OtpInput
        loading={loading}
        onSubmit={handleOtpSubmit}
        initialValues={{ email, otp: ["", "", "", "", "", ""] }}
      />
    );
  }

  if (step === "password") {
    return (
      <PasswordInput
        loading={loading}
        onSubmit={handlePasswordSubmit}
        initialValues={{ password: "", confirmPassword: "" }}
      />
    );
  }

  return null;
}
