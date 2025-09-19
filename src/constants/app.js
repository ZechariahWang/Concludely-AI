// Configuration constants are now imported from appwrite config which uses environment variables
// These exports remain for backwards compatibility but should use the config object instead

export const MOODS = [
  { value: 'happy', label: 'Happy', emoji: '😊' },
  { value: 'sad', label: 'Sad', emoji: '😢' },
  { value: 'excited', label: 'Excited', emoji: '🎉' },
  { value: 'calm', label: 'Calm', emoji: '😌' },
  { value: 'anxious', label: 'Anxious', emoji: '😰' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
];

export const THEMES = {
  light: {
    // shadcn-inspired color palette
    background: '#FFFFFF',
    foreground: '#020817',
    card: '#FFFFFF',
    cardForeground: '#020817',
    popover: '#FFFFFF',
    popoverForeground: '#020817',
    primary: '#0F172A',
    primaryForeground: '#F8FAFC',
    secondary: '#F1F5F9',
    secondaryForeground: '#0F172A',
    muted: '#F1F5F9',
    mutedForeground: '#64748B',
    accent: '#F1F5F9',
    accentForeground: '#0F172A',
    destructive: '#EF4444',
    destructiveForeground: '#F8FAFC',
    border: '#E2E8F0',
    input: '#E2E8F0',
    ring: '#0F172A',
    // Additional semantic colors
    success: '#22C55E',
    warning: '#F59E0B',
    info: '#3B82F6',
    // Surface variations
    surface: '#F8FAFC',
    surfaceElevated: '#FFFFFF',
    // Shadow
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowSoft: 'rgba(0, 0, 0, 0.05)',
  },
  dark: {
    background: '#020817',
    foreground: '#F8FAFC',
    card: '#020817',
    cardForeground: '#F8FAFC',
    popover: '#020817',
    popoverForeground: '#F8FAFC',
    primary: '#F8FAFC',
    primaryForeground: '#0F172A',
    secondary: '#1E293B',
    secondaryForeground: '#F8FAFC',
    muted: '#1E293B',
    mutedForeground: '#94A3B8',
    accent: '#1E293B',
    accentForeground: '#F8FAFC',
    destructive: '#7F1D1D',
    destructiveForeground: '#F8FAFC',
    border: '#1E293B',
    input: '#1E293B',
    ring: '#CBD5E1',
    // Additional semantic colors
    success: '#16A34A',
    warning: '#D97706',
    info: '#2563EB',
    // Surface variations
    surface: '#0F172A',
    surfaceElevated: '#1E293B',
    // Shadow
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowSoft: 'rgba(0, 0, 0, 0.15)',
  },
};

export const TYPOGRAPHY = {
  // Display
  display: { fontSize: 36, fontWeight: '800', lineHeight: 44, letterSpacing: -0.02 },
  // Headings
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40, letterSpacing: -0.02 },
  h2: { fontSize: 24, fontWeight: '600', lineHeight: 32, letterSpacing: -0.01 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28, letterSpacing: -0.01 },
  h4: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  // Body text
  large: { fontSize: 18, fontWeight: '400', lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
  small: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  muted: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  // Utility
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  label: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  // Code
  code: { fontSize: 14, fontWeight: '400', lineHeight: 20, fontFamily: 'monospace' },
};

export const SPACING = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  // Legacy aliases
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  none: 0,
  sm: 2,
  DEFAULT: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};