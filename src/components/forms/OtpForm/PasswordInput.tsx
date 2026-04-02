import { resetPasswordSchema } from "@/utils/validations/authValidation";
import { FormikProps, useFormik } from "formik";
import React from "react";

const PasswordInput = ({ loading, initialValues, onSubmit }: ResetPasswordFormProps) => {
  const formik: FormikProps<ResetPasswordTypes> = useFormik({
    validationSchema: resetPasswordSchema,
    initialValues: initialValues ?? { password: "" },
  });
  return <View></View>;
};

export default PasswordInput;
