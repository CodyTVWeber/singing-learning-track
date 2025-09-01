export const colors = {
  // Primary palette - Kookaburra feather browns
  primary: '#8B7355', // Main kookaburra brown (medium tan-brown)
  primaryLight: '#A68B68', // Light tan-brown
  primaryDark: '#6B5843', // Darker brown
  
  // Secondary palette - Kookaburra accent colors
  secondary: '#4B708B', // Kookaburra blue (wing accents)
  secondaryLight: '#6B8CAB', // Lighter blue
  secondaryDark: '#3B5A7B', // Deeper blue
  
  // Accent colors - Beak and special features
  accent: '#3C3C3C', // Dark beak color (charcoal)
  accentLight: '#5C5C5C', // Lighter beak
  accentDark: '#2C2C2C', // Very dark beak
  
  // Background colors - Inspired by kookaburra's habitat
  background: '#FAF6F2', // Very light cream (kookaburra belly)
  backgroundDark: '#F2E8DD', // Light tan
  surface: '#FFFFFF', // Pure white
  surfaceElevated: '#FDFBF8', // Slightly warm white
  
  // Text colors
  text: '#3C3C3C', // Dark charcoal (matching beak)
  textLight: '#6B5843', // Brown text
  textMuted: '#8B7355', // Muted brown
  textOnPrimary: '#FAF6F2', // Very light cream on primary
  textOnSecondary: '#FAF6F2', // Very light cream on secondary
  
  // Semantic colors - Nature inspired but subtle
  success: '#7B8B4B', // Eucalyptus green
  successLight: '#9BAB6B', // Light eucalyptus
  warning: '#D4824B', // Subtle orange (tiny bit as requested)
  warningLight: '#E4926B', // Light orange
  error: '#AB6B4B', // Reddish brown
  errorLight: '#CB8B6B', // Light reddish brown
  info: '#4B708B', // Info blue (same as secondary)
  infoLight: '#6B8CAB', // Light info
  
  // Kookaburra-specific colors
  featherBrown: '#6B5843', // Dark feather brown
  featherMedium: '#8B7355', // Medium feather brown
  featherLight: '#D4C4B0', // Light feather cream
  beakDark: '#2C2C2C', // Dark beak
  beakLight: '#4C4C4C', // Light beak shade
  wingBlue: '#4B708B', // Wing accent blue
  bellyCreamy: '#E8DDD0', // Belly cream color
  eyeRing: '#F0E6D8', // Light ring around eye
  
  // Neutral grays (warmer tones)
  gray50: '#FAFAF8',
  gray100: '#F5F5F0',
  gray200: '#EEEEE8',
  gray300: '#E0E0D8',
  gray400: '#BDBDB0',
  gray500: '#9E9E90',
  gray600: '#757568',
  gray700: '#616155',
  gray800: '#424238',
  gray900: '#212118',
} as const;

export const spacing = {
  xxxs: '1px',
  xxs: '2px',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
  huge: '96px',
} as const;

export const borderRadius = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '20px',
  xxl: '28px',
  round: '50%',
  pill: '9999px',
} as const;

export const fontSize = {
  xxs: '10px',
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px',
  huge: '64px',
} as const;

export const fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
  xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  colored: '0 10px 40px -10px',
  glow: '0 0 20px rgba(74, 144, 226, 0.3)',
} as const;

export const transitions = {
  instant: '100ms ease-out',
  fast: '200ms ease-out',
  normal: '300ms ease-out',
  slow: '500ms ease-out',
  slower: '800ms ease-out',
  spring: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  bounce: '600ms cubic-bezier(0.68, -0.55, 0.265, 1.35)',
  smooth: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
  ultrawide: '1440px',
} as const;

export const animations = {
  fadeIn: 'fadeIn 0.3s ease-out',
  slideIn: 'slideIn 0.4s ease-out',
  slideUp: 'slideUp 0.3s ease-out',
  scaleIn: 'scaleIn 0.3s ease-out',
  float: 'float 3s ease-in-out infinite',
  pulse: 'pulse 2s ease-in-out infinite',
  wiggle: 'wiggle 1s ease-in-out infinite',
  bounce: 'bounce 1s ease-in-out infinite',
} as const;

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
  secondary: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryLight} 100%)`,
  feather: `linear-gradient(135deg, ${colors.featherBrown} 0%, ${colors.featherMedium} 50%, ${colors.featherLight} 100%)`,
  wing: `linear-gradient(135deg, ${colors.wingBlue} 0%, ${colors.secondaryLight} 100%)`,
  beak: `linear-gradient(135deg, ${colors.beakDark} 0%, ${colors.beakLight} 100%)`,
  warm: `linear-gradient(135deg, ${colors.featherLight} 0%, ${colors.bellyCreamy} 50%, ${colors.background} 100%)`,
  soft: `linear-gradient(135deg, ${colors.background} 0%, ${colors.backgroundDark} 100%)`,
  sunset: `linear-gradient(135deg, ${colors.warning} 0%, ${colors.warningLight} 50%, ${colors.featherLight} 100%)`,
  forest: `linear-gradient(135deg, ${colors.success} 0%, ${colors.successLight} 100%)`,
} as const;

export const blurs = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
} as const;