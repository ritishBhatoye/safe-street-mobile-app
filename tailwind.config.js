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
        // PRIMARY - Trust & Safety (Blue) - Main brand color
        primary: {
          50: '#EBF5FF',
          100: '#D6EBFF',
          200: '#ADD6FF',
          300: '#85C2FF',
          400: '#5CADFF',
          500: '#3399FF', // Main primary
          600: '#0080FF',
          700: '#0066CC',
          800: '#004D99',
          900: '#003366',
          950: '#001A33',
        },
        // SECONDARY - Calm & Reliable (Teal/Cyan)
        secondary: {
          50: '#E6FFFE',
          100: '#CCFFFD',
          200: '#99FFFB',
          300: '#66FFF9',
          400: '#33FFF7',
          500: '#00FFF5', // Main secondary
          600: '#00CCC4',
          700: '#009993',
          800: '#006662',
          900: '#003331',
          950: '#001A19',
        },
        // TERTIARY - Energy & Action (Purple/Violet)
        tertiary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6', // Main tertiary
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        // ACCENT - Highlight & Focus (Orange)
        accent: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316', // Main accent
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },
        // SUCCESS - Safe & Positive (Green)
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E', // Main success
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
        },
        // WARNING - Caution & Alert (Amber/Yellow)
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Main warning
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        // DANGER/ERROR - Risk & Critical (Red)
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444', // Main danger
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        // INFO - Information & Guidance (Light Blue)
        info: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9', // Main info
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          950: '#082F49',
        },
        // NEUTRAL - UI Elements & Text (Gray)
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
        // SURFACE - Backgrounds & Cards
        surface: {
          light: {
            primary: '#FFFFFF',
            secondary: '#F9FAFB',
            tertiary: '#F3F4F6',
            elevated: '#FFFFFF',
            overlay: 'rgba(0, 0, 0, 0.5)',
          },
          dark: {
            primary: '#0F172A',
            secondary: '#1E293B',
            tertiary: '#334155',
            elevated: '#1E293B',
            overlay: 'rgba(0, 0, 0, 0.7)',
          },
        },
        // TEXT - Typography colors
        text: {
          light: {
            primary: '#0F172A',
            secondary: '#475569',
            tertiary: '#64748B',
            disabled: '#94A3B8',
            inverse: '#FFFFFF',
          },
          dark: {
            primary: '#F8FAFC',
            secondary: '#CBD5E1',
            tertiary: '#94A3B8',
            disabled: '#64748B',
            inverse: '#0F172A',
          },
        },
        // BORDER - Dividers & Outlines
        border: {
          light: {
            primary: '#E2E8F0',
            secondary: '#CBD5E1',
            focus: '#3399FF',
            error: '#EF4444',
          },
          dark: {
            primary: '#334155',
            secondary: '#475569',
            focus: '#5CADFF',
            error: '#F87171',
          },
        },
        // SEMANTIC - Specific use cases
        semantic: {
          // Safety levels
          safe: '#22C55E',
          caution: '#F59E0B',
          risk: '#EF4444',
          critical: '#DC2626',
          
          // Status
          online: '#22C55E',
          offline: '#94A3B8',
          busy: '#F59E0B',
          away: '#F97316',
          
          // Feedback
          like: '#EF4444',
          favorite: '#F59E0B',
          verified: '#0EA5E9',
          premium: '#8B5CF6',
        },
      },
      fontFamily: {
        // DM Sans - Primary font family
        'dm-sans': ['dm-sans', 'system-ui', 'sans-serif'],
        'dm-sans-thin': ['dm-sans-thin', 'dm-sans', 'sans-serif'],
        'dm-sans-extralight': ['dm-sans-extralight', 'dm-sans', 'sans-serif'],
        'dm-sans-light': ['dm-sans-light', 'dm-sans', 'sans-serif'],
        'dm-sans-medium': ['dm-sans-medium', 'dm-sans', 'sans-serif'],
        'dm-sans-semibold': ['dm-sans-semibold', 'dm-sans', 'sans-serif'],
        'dm-sans-bold': ['dm-sans-bold', 'dm-sans', 'sans-serif'],
        'dm-sans-extrabold': ['dm-sans-extrabold', 'dm-sans', 'sans-serif'],
        'dm-sans-black': ['dm-sans-black', 'dm-sans', 'sans-serif'],
        
        // Default fallbacks
        sans: ['dm-sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['dm-sans-bold', 'dm-sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.16)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
