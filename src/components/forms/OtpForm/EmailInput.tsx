import { FormikProps, useFormik } from "formik";
import React from "react";

const EmailInput = ({ loading, onSubmit, initialValues }: EmailFormProps) => {
  const formik: FormikProps<EmailTypes> = useFormik<EmailTypes>({
    initialValues: initialValues ?? { email: "" },
  });
  return <div>EmailInput</div>;
};

export default EmailInput;
