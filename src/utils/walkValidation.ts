import * as Yup from 'yup';

export interface WalkFormValues {
  destination: string;
  estimatedTime: string;
  watchers: Array<{ name: string; phone: string }>;
}

export const initialWalkValues: WalkFormValues = {
  destination: '',
  estimatedTime: '30',
  watchers: [],
};

export const walkValidationSchema = Yup.object().shape({
  destination: Yup.string()
    .required('Destination is required')
    .min(3, 'Destination must be at least 3 characters'),
  estimatedTime: Yup.number()
    .required('Estimated time is required')
    .min(5, 'Minimum 5 minutes')
    .max(480, 'Maximum 8 hours'),
  watchers: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        phone: Yup.string().required(),
      })
    )
    .min(0, 'No watchers required')
    .max(5, 'Maximum 5 watchers allowed'),
});
