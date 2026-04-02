import { resetPasswordSchema } from "@/utils/validations/authValidation";
import { FormikProps, useFormik } from "formik";
import React from "react";
import { Keyboard } from "react-native";

const PasswordInput = ({ loading, initialValues, onSubmit }: ResetPasswordFormProps) => {
  const formik: FormikProps<ResetPasswordTypes> = useFormik({
    validationSchema: resetPasswordSchema,
    initialValues: initialValues || { password: "", confirmPassword: "" },
    onSubmit: (values) => {
      Keyboard.dismiss();
      onSubmit(values);
    },
  });
  return <View></View>;
};

export default PasswordInput;
