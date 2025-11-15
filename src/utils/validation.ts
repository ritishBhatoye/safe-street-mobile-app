import { CreateIncidentRequest } from '@/types/incidents';
import { INCIDENT_TYPES, INCIDENT_SEVERITY } from '@/constants/incidents';

export interface ValidationError {
  field: string;
  message: string;
}

export class IncidentValidator {
  static validateCreateIncident(data: Partial<CreateIncidentRequest>): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required fields
    if (!data.title || data.title.trim().length === 0) {
      errors.push({
        field: 'title',
        message: 'Title is required',
      });
    } else if (data.title.trim().length < 3) {
      errors.push({
        field: 'title',
        message: 'Title must be at least 3 characters long',
      });
    } else if (data.title.trim().length > 100) {
      errors.push({
        field: 'title',
        message: 'Title must be less than 100 characters',
      });
    }

    if (!data.type) {
      errors.push({
        field: 'type',
        message: 'Incident type is required',
      });
    } else if (!Object.values(INCIDENT_TYPES).includes(data.type as any)) {
      errors.push({
        field: 'type',
        message: 'Invalid incident type',
      });
    }

    if (!data.severity) {
      errors.push({
        field: 'severity',
        message: 'Severity level is required',
      });
    } else if (!Object.values(INCIDENT_SEVERITY).includes(data.severity as any)) {
      errors.push({
        field: 'severity',
        message: 'Invalid severity level',
      });
    }

    if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
      errors.push({
        field: 'location',
        message: 'Location is required',
      });
    } else {
      // Validate coordinates
      if (data.latitude < -90 || data.latitude > 90) {
        errors.push({
          field: 'latitude',
          message: 'Invalid latitude',
        });
      }
      if (data.longitude < -180 || data.longitude > 180) {
        errors.push({
          field: 'longitude',
          message: 'Invalid longitude',
        });
      }
    }

    // Optional fields validation
    if (data.description && data.description.length > 1000) {
      errors.push({
        field: 'description',
        message: 'Description must be less than 1000 characters',
      });
    }

    if (data.address && data.address.length > 200) {
      errors.push({
        field: 'address',
        message: 'Address must be less than 200 characters',
      });
    }

    if (data.city && data.city.length > 100) {
      errors.push({
        field: 'city',
        message: 'City must be less than 100 characters',
      });
    }

    if (data.state && data.state.length > 100) {
      errors.push({
        field: 'state',
        message: 'State must be less than 100 characters',
      });
    }

    if (data.country && data.country.length > 100) {
      errors.push({
        field: 'country',
        message: 'Country must be less than 100 characters',
      });
    }

    if (data.photos && data.photos.length > 5) {
      errors.push({
        field: 'photos',
        message: 'Maximum 5 photos allowed',
      });
    }

    return errors;
  }

  static getFieldError(errors: ValidationError[], field: string): string | undefined {
    const error = errors.find(e => e.field === field);
    return error?.message;
  }

  static hasErrors(errors: ValidationError[]): boolean {
    return errors.length > 0;
  }

  static formatErrorMessage(errors: ValidationError[]): string {
    if (errors.length === 0) return '';
    if (errors.length === 1) return errors[0].message;
    return `${errors.length} validation errors found`;
  }
}

// Form validation helpers
export const validateRequired = (value: any, fieldName: string): string | undefined => {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return `${fieldName} is required`;
  }
  return undefined;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | undefined => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return undefined;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | undefined => {
  if (value && value.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  return undefined;
};

export const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return undefined;
};

export const validatePhone = (phone: string): string | undefined => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  if (phone && !phoneRegex.test(phone)) {
    return 'Invalid phone number format';
  }
  return undefined;
};