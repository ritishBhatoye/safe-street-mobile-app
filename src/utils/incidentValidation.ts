import * as Yup from 'yup';
import { INCIDENT_TYPES, INCIDENT_SEVERITY } from '@/constants/incidents';

// Validation schema for the incident form
export const incidentValidationSchema = Yup.object().shape({
  // Step 1: Incident Type
  type: Yup.string()
    .oneOf(Object.values(INCIDENT_TYPES), 'Please select a valid incident type')
    .required('Incident type is required'),

  // Step 2: Severity and Title
  severity: Yup.string()
    .oneOf(Object.values(INCIDENT_SEVERITY), 'Please select a valid severity level')
    .required('Severity level is required'),
  
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),

  // Step 3: Location and Description
  latitude: Yup.number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude')
    .required('Location is required'),
  
  longitude: Yup.number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude')
    .required('Location is required'),

  description: Yup.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),

  address: Yup.string()
    .max(200, 'Address must be less than 200 characters')
    .optional(),

  city: Yup.string()
    .max(100, 'City must be less than 100 characters')
    .optional(),

  state: Yup.string()
    .max(100, 'State must be less than 100 characters')
    .optional(),

  country: Yup.string()
    .max(100, 'Country must be less than 100 characters')
    .optional(),

  photos: Yup.array()
    .of(Yup.string())
    .max(5, 'Maximum 5 photos allowed')
    .optional(),
});

// Step-specific validation schemas for progressive validation
export const step1ValidationSchema = Yup.object().shape({
  type: incidentValidationSchema.fields.type,
});

export const step2ValidationSchema = Yup.object().shape({
  type: incidentValidationSchema.fields.type,
  severity: incidentValidationSchema.fields.severity,
  title: incidentValidationSchema.fields.title,
});

export const step3ValidationSchema = incidentValidationSchema;

// Helper function to get validation schema for current step
export const getValidationSchemaForStep = (step: number) => {
  switch (step) {
    case 1:
      return step1ValidationSchema;
    case 2:
      return step2ValidationSchema;
    case 3:
      return step3ValidationSchema;
    default:
      return incidentValidationSchema;
  }
};

// Initial form values
export const initialIncidentValues = {
  type: '',
  severity: '',
  title: '',
  description: '',
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
  address: '',
  city: '',
  state: '',
  country: '',
  photos: [] as string[],
};

export type IncidentFormValues = typeof initialIncidentValues;