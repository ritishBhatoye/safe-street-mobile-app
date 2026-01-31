type Step = "email" | "otp" | "password" | "success";

interface ResetPasswordTypes {
  password: string;
  confirmPassword: string;
}
