export interface OnBoardingType {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  backgroundColor: string[];
  icon: string;
}

export const onboardingData: OnBoardingType[] = [
  {
    id: 1,
    title: 'Stay Safe Together',
    subtitle: 'Report and view safety incidents in your community in real-time. Join thousands making streets safer.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    backgroundColor: ['rgba(51, 153, 255, 0.9)', 'rgba(0, 128, 255, 0.95)'], // Primary blue
    icon: '🛡️',
  },
  {
    id: 2,
    title: 'Real-Time Alerts',
    subtitle: 'Get instant notifications about incidents near you and stay informed about your surroundings.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    backgroundColor: ['rgba(139, 92, 246, 0.9)', 'rgba(124, 58, 237, 0.95)'], // Tertiary purple
    icon: '🔔',
  },
  {
    id: 3,
    title: 'Community Powered',
    subtitle: 'Join a community of people working together to create safer neighborhoods for everyone.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    backgroundColor: ['rgba(0, 255, 245, 0.85)', 'rgba(0, 153, 147, 0.95)'], // Secondary teal
    icon: '🤝',
  },
];
