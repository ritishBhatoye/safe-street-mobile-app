/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary - Trust & Safety (Blue tones)
        primary: {
          50: '#E6F4FE',
          100: '#CCE9FD',
          200: '#99D3FB',
          300: '#66BDF9',
          400: '#33A7F7',
          500: '#0091F5', // Main brand color
          600: '#0074C4',
          700: '#005793',
          800: '#003A62',
          900: '#001D31',
        },
        // Secondary - Calm & Reliable (Teal)
        secondary: {
          50: '#E6F7F7',
          100: '#CCEFEF',
          200: '#99DFDF',
          300: '#66CFCF',
          400: '#33BFBF',
          500: '#00AFAF',
          600: '#008C8C',
          700: '#006969',
          800: '#004646',
          900: '#002323',
        },
        // Success - Safe zones (Green)
        success: {
          50: '#E8F8F0',
          100: '#D1F1E1',
          200: '#A3E3C3',
          300: '#75D5A5',
          400: '#47C787',
          500: '#10B981', // Safe indicator
          600: '#0D9468',
          700: '#0A6F4E',
          800: '#074A34',
          900: '#03251A',
        },
        // Warning - Caution areas (Amber)
        warning: {
          50: '#FFF8E6',
          100: '#FFF1CC',
          200: '#FFE399',
          300: '#FFD566',
          400: '#FFC733',
          500: '#FFB900', // Caution indicator
          600: '#CC9400',
          700: '#996F00',
          800: '#664A00',
          900: '#332500',
        },
        // Danger - High risk (Red)
        danger: {
          50: '#FEE6E6',
          100: '#FDCCCC',
          200: '#FB9999',
          300: '#F96666',
          400: '#F73333',
          500: '#F50000', // Danger indicator
          600: '#C40000',
          700: '#930000',
          800: '#620000',
          900: '#310000',
        },
        // Neutral - UI elements
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Dark mode specific
        dark: {
          bg: '#0F172A',
          surface: '#1E293B',
          border: '#334155',
          text: '#F1F5F9',
          'text-secondary': '#94A3B8',
        },
        // Light mode specific
        light: {
          bg: '#FFFFFF',
          surface: '#F8FAFC',
          border: '#E2E8F0',
          text: '#0F172A',
          'text-secondary': '#64748B',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
};
