import { otpSchema } from "@/utils/validations/authValidation";
import { FormikProps, useFormik } from "formik";
import React from "react";

const OtpInput = ({ loading, onSubmit, initialValues }: OtpFormProps) => {
  const formik: FormikProps<OtpTypes> = useFormik<OtpTypes>({
    validationSchema: otpSchema,
    initialValues: initialValues || { otp: 0, email: "" },
  });
  return <div>OtpInput</div>;
};

export default OtpInput;
