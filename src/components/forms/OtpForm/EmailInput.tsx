import AuthWrapper from "@/components/elements/AuthWrapper";
import { emailSchema } from "@/utils/validations/authValidation";
import { FormikProps, useFormik } from "formik";
import React from "react";
import { Keyboard } from "react-native";

const EmailInput = ({ loading, onSubmit, initialValues }: EmailFormProps) => {
  const formik: FormikProps<EmailTypes> = useFormik<EmailTypes>({
    initialValues: initialValues || { email: "" },
    validationSchema: emailSchema,
    onSubmit: (values) => {
      Keyboard.dismiss();
      onSubmit(values);
    },
  });
  return (
    <AuthWrapper
      title={"Forgot Password?"}
      subTitle={"We'll send you a verification code"}
    ></AuthWrapper>
  );
};

export default EmailInput;
