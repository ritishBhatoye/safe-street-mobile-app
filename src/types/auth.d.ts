type Step = "email" | "otp" | "password" | "success";

interface ResetPasswordTypes {
  password: string;
  confirmPassword: string;
}

interface EmailTypes {
  email: string;
}

interface OtpTypes {
  email: string;
  otp: string[];
}

interface FormSubmissionProps<T> {
  loading: boolean;
  onSubmit: (values: T, actions?: ResetFormType) => void;
  initialValues?: T;
  isFetchingData?: boolean;
}

interface SignInFormType {
  email: string;
  password: string;
}

// Form Props Types
type MultiFactorFormProps = FormSubmissionProps<MultiFactorFormTypes>;
type SignInFormProps = FormSubmissionProps<SignInFormType>;
type OtpFormProps = FormSubmissionProps<OtpTypes>;
type EmailFormProps = FormSubmissionProps<EmailTypes>;
