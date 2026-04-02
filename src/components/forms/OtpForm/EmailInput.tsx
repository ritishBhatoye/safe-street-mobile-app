import { emailSchema } from "@/utils/validations/authValidation";
import { FormikProps, useFormik } from "formik";
import React from "react";
import { Keyboard } from "react-native";

const EmailInput = ({ loading, onSubmit, initialValues }: EmailFormProps) => {
  const formik: FormikProps<EmailTypes> = useFormik<EmailFormProps>({
    initialValues: initialValues || { email: "" },
    validationSchema: emailSchema,
    onSubmit: (values) => {
      Keyboard.dismiss();
      onSubmit(values);
    },
  });
  return <div>EmailInput</div>;
};

export default EmailInput;
