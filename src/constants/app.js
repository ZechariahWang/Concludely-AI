export const DATABASE_ID = '68aa6b3b002b82a435cb';
export const USERS_COLLECTION_ID = 'users';
export const JOURNALS_COLLECTION_ID = 'journals';
export const BUCKET_ID = 'profile-pictures';
export const PROJECT_ID = '68aa6487001bd857be83';
export const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';

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
    primary: '#6366F1',          // Modern indigo
    primaryLight: '#8B5CF6',     // Purple accent
    secondary: '#10B981',        // Emerald green
    background: '#FFFFFF',
    surface: '#F8FAFC',          // Light gray surface
    surfaceElevated: '#FFFFFF',
    text: '#1E293B',             // Dark slate
    textSecondary: '#64748B',    // Medium slate
    textMuted: '#94A3B8',        // Light slate
    border: '#E2E8F0',           // Very light slate
    borderLight: '#F1F5F9',      // Almost white
    success: '#10B981',          // Emerald
    warning: '#F59E0B',          // Amber
    error: '#EF4444',            // Red
    shadow: 'rgba(0, 0, 0, 0.05)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    primary: '#8B5CF6',          // Purple
    primaryLight: '#A78BFA',     // Light purple
    secondary: '#10B981',        // Emerald green
    background: '#0F172A',       // Dark slate
    surface: '#1E293B',          // Lighter dark slate
    surfaceElevated: '#334155',  // Medium slate
    text: '#F8FAFC',             // Light text
    textSecondary: '#CBD5E1',    // Medium light text
    textMuted: '#94A3B8',        // Muted text
    border: '#334155',           // Dark border
    borderLight: '#475569',      // Lighter dark border
    success: '#10B981',          // Emerald
    warning: '#F59E0B',          // Amber
    error: '#EF4444',            // Red
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};