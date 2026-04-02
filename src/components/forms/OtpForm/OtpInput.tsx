import { otpSchema } from "@/utils/validations/authValidation";
import { FormikProps, useFormik } from "formik";
import React from "react";

const OtpInput = ({ loading, onSubmit, initialValues }: OtpFormProps) => {
  const formik: FormikProps<OtpTypes> = useFormik<OtpTypes>({
    initialValues: initialValues || { otp: ["0", "0"], email: "" },
    validationSchema: otpSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });
  return <div>OtpInput</div>;
};

export default OtpInput;
