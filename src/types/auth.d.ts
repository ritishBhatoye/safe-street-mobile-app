type Step = "email" | "otp" | "password" | "success";

interface ResetPasswordTypes {
  password: string;
  confirmPassword: string;
}

interface EmailTypes {
  email: string;
}

interface OtpTypes {
  otp: string[];
}
