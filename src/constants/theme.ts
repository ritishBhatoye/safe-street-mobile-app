/**
 * Safe Street App Theme
 * Color palette designed for safety and trust
 */

import { Platform } from 'react-native';

// Primary brand colors
const primaryLight = '#0091F5'; // Trust blue
const primaryDark = '#33A7F7'; // Lighter blue for dark mode

// Status colors for safety indicators
export const StatusColors = {
  safe: '#10B981', // Green - Safe zones
  caution: '#FFB900', // Amber - Caution areas
  danger: '#F50000', // Red - High risk areas
  info: '#0091F5', // Blue - Information
};

export const Colors = {
  light: {
    // Base colors
    text: '#0F172A',
    textSecondary: '#64748B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    border: '#E2E8F0',

    // Brand colors
    tint: primaryLight,
    primary: primaryLight,
    secondary: '#00AFAF',

    // Tab bar
    tabIconDefault: '#9CA3AF',
    tabIconSelected: primaryLight,
    tabBarBackground: '#FFFFFF',

    // Status colors
    success: StatusColors.safe,
    warning: StatusColors.caution,
    danger: StatusColors.danger,
    info: StatusColors.info,

    // UI elements
    card: '#FFFFFF',
    cardBorder: '#E5E7EB',
    input: '#F3F4F6',
    inputBorder: '#D1D5DB',
    disabled: '#E5E7EB',

    // Icons
    icon: '#6B7280',
    iconActive: primaryLight,
  },
  dark: {
    // Base colors
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    background: '#0F172A',
    surface: '#1E293B',
    border: '#334155',

    // Brand colors
    tint: primaryDark,
    primary: primaryDark,
    secondary: '#33BFBF',

    // Tab bar
    tabIconDefault: '#64748B',
    tabIconSelected: primaryDark,
    tabBarBackground: '#1E293B',

    // Status colors
    success: '#47C787',
    warning: '#FFC733',
    danger: '#F96666',
    info: '#66BDF9',

    // UI elements
    card: '#1E293B',
    cardBorder: '#334155',
    input: '#334155',
    inputBorder: '#475569',
    disabled: '#334155',

    // Icons
    icon: '#94A3B8',
    iconActive: primaryDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Spacing scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Border radius scale
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Shadow presets
export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
};
