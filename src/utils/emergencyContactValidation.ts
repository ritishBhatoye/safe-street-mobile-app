import * as Yup from 'yup';

export interface EmergencyContactFormValues {
  name: string;
  phone: string;
  relationship: string;
  is_default: boolean;
}

export const initialEmergencyContactValues: EmergencyContactFormValues = {
  name: '',
  phone: '',
  relationship: '',
  is_default: false,
};

export const emergencyContactValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits'),
  relationship: Yup.string()
    .max(30, 'Relationship must be less than 30 characters'),
  is_default: Yup.boolean(),
});
