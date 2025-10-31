/**
 * Safe Street App Theme
 * Comprehensive color system with primary, secondary, tertiary, and semantic colors
 */

import { Platform } from 'react-native';

/**
 * PRIMARY COLORS - Trust & Safety (Blue)
 * Use for: Main brand elements, primary actions, key UI components
 */
export const Primary = {
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
};

/**
 * SECONDARY COLORS - Calm & Reliable (Teal/Cyan)
 * Use for: Secondary actions, supporting elements, complementary UI
 */
export const Secondary = {
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
};

/**
 * TERTIARY COLORS - Energy & Action (Purple/Violet)
 * Use for: Highlights, special features, premium content
 */
export const Tertiary = {
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
};

/**
 * ACCENT COLORS - Highlight & Focus (Orange)
 * Use for: Call-to-action, important notifications, focus states
 */
export const Accent = {
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
};

/**
 * SUCCESS COLORS - Safe & Positive (Green)
 * Use for: Success messages, safe zones, positive feedback
 */
export const Success = {
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
};

/**
 * WARNING COLORS - Caution & Alert (Amber/Yellow)
 * Use for: Warning messages, caution areas, important notices
 */
export const Warning = {
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
};

/**
 * DANGER COLORS - Risk & Critical (Red)
 * Use for: Error messages, danger zones, critical alerts
 */
export const Danger = {
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
};

/**
 * INFO COLORS - Information & Guidance (Light Blue)
 * Use for: Informational messages, tips, guidance
 */
export const Info = {
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
};

/**
 * NEUTRAL COLORS - UI Elements & Text (Gray)
 * Use for: Text, borders, backgrounds, disabled states
 */
export const Neutral = {
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
};

/**
 * SEMANTIC COLORS - Specific use cases
 */
export const Semantic = {
  // Safety levels
  safe: Success[500],
  caution: Warning[500],
  risk: Danger[500],
  critical: Danger[600],

  // Status indicators
  online: Success[500],
  offline: Neutral[400],
  busy: Warning[500],
  away: Accent[500],

  // Feedback
  like: Danger[500],
  favorite: Warning[500],
  verified: Info[500],
  premium: Tertiary[500],
};

/**
 * THEME COLORS - Light and Dark mode configurations
 */
export const Colors = {
  light: {
    // Primary brand
    primary: Primary[500],
    primaryHover: Primary[600],
    primaryActive: Primary[700],
    primaryDisabled: Primary[200],

    // Secondary
    secondary: Secondary[500],
    secondaryHover: Secondary[600],
    secondaryActive: Secondary[700],
    secondaryDisabled: Secondary[200],

    // Tertiary
    tertiary: Tertiary[500],
    tertiaryHover: Tertiary[600],
    tertiaryActive: Tertiary[700],
    tertiaryDisabled: Tertiary[200],

    // Accent
    accent: Accent[500],
    accentHover: Accent[600],
    accentActive: Accent[700],

    // Status
    success: Success[500],
    warning: Warning[500],
    danger: Danger[500],
    info: Info[500],

    // Text
    text: Neutral[900],
    textSecondary: Neutral[600],
    textTertiary: Neutral[500],
    textDisabled: Neutral[400],
    textInverse: '#FFFFFF',

    // Background
    background: '#FFFFFF',
    backgroundSecondary: Neutral[50],
    backgroundTertiary: Neutral[100],

    // Surface
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceOverlay: 'rgba(0, 0, 0, 0.5)',

    // Border
    border: Neutral[200],
    borderSecondary: Neutral[300],
    borderFocus: Primary[500],
    borderError: Danger[500],

    // Tab bar
    tint: Primary[500],
    tabIconDefault: Neutral[400],
    tabIconSelected: Primary[500],
    tabBarBackground: '#FFFFFF',

    // Card
    card: '#FFFFFF',
    cardBorder: Neutral[200],
    cardShadow: 'rgba(0, 0, 0, 0.08)',

    // Input
    input: Neutral[100],
    inputBorder: Neutral[300],
    inputFocus: Primary[500],
    inputError: Danger[500],
    inputDisabled: Neutral[100],

    // Icon
    icon: Neutral[600],
    iconActive: Primary[500],
    iconDisabled: Neutral[400],

    // Semantic
    ...Semantic,
  },
  dark: {
    // Primary brand
    primary: Primary[400],
    primaryHover: Primary[300],
    primaryActive: Primary[200],
    primaryDisabled: Primary[800],

    // Secondary
    secondary: Secondary[400],
    secondaryHover: Secondary[300],
    secondaryActive: Secondary[200],
    secondaryDisabled: Secondary[800],

    // Tertiary
    tertiary: Tertiary[400],
    tertiaryHover: Tertiary[300],
    tertiaryActive: Tertiary[200],
    tertiaryDisabled: Tertiary[800],

    // Accent
    accent: Accent[400],
    accentHover: Accent[300],
    accentActive: Accent[200],

    // Status
    success: Success[400],
    warning: Warning[400],
    danger: Danger[400],
    info: Info[400],

    // Text
    text: Neutral[50],
    textSecondary: Neutral[300],
    textTertiary: Neutral[400],
    textDisabled: Neutral[600],
    textInverse: Neutral[900],

    // Background
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    backgroundTertiary: '#334155',

    // Surface
    surface: '#1E293B',
    surfaceElevated: '#334155',
    surfaceOverlay: 'rgba(0, 0, 0, 0.7)',

    // Border
    border: '#334155',
    borderSecondary: '#475569',
    borderFocus: Primary[400],
    borderError: Danger[400],

    // Tab bar
    tint: Primary[400],
    tabIconDefault: Neutral[500],
    tabIconSelected: Primary[400],
    tabBarBackground: '#1E293B',

    // Card
    card: '#1E293B',
    cardBorder: '#334155',
    cardShadow: 'rgba(0, 0, 0, 0.3)',

    // Input
    input: '#334155',
    inputBorder: '#475569',
    inputFocus: Primary[400],
    inputError: Danger[400],
    inputDisabled: '#334155',

    // Icon
    icon: Neutral[400],
    iconActive: Primary[400],
    iconDisabled: Neutral[600],

    // Semantic (adjusted for dark mode)
    safe: Success[400],
    caution: Warning[400],
    risk: Danger[400],
    critical: Danger[500],
    online: Success[400],
    offline: Neutral[500],
    busy: Warning[400],
    away: Accent[400],
    like: Danger[400],
    favorite: Warning[400],
    verified: Info[400],
    premium: Tertiary[400],
  },
};

/**
 * FONT FAMILIES
 */
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
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

/**
 * SPACING SCALE
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};

/**
 * BORDER RADIUS SCALE
 */
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

/**
 * SHADOW PRESETS
 */
export const Shadows = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
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
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 12,
  },
};

/**
 * TYPOGRAPHY SCALE
 */
export const Typography = {
  '2xs': { fontSize: 10, lineHeight: 12 },
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 28 },
  '2xl': { fontSize: 24, lineHeight: 32 },
  '3xl': { fontSize: 30, lineHeight: 36 },
  '4xl': { fontSize: 36, lineHeight: 40 },
  '5xl': { fontSize: 48, lineHeight: 1 },
};
