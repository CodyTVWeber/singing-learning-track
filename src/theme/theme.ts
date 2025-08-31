export const colors = {
  // Primary palette - inspired by kookaburra colors
  primary: '#2C5F7C', // Deep ocean blue (kookaburra's wing accents)
  primaryLight: '#4A90E2', // Bright sky blue
  primaryDark: '#1E3A5F', // Midnight blue
  
  // Secondary palette - warm earth tones
  secondary: '#E67E22', // Vibrant sunset orange (beak color)
  secondaryLight: '#F39C12', // Golden hour
  secondaryDark: '#D35400', // Deep orange
  
  // Accent colors - nature inspired
  accent: '#27AE60', // Forest green
  accentLight: '#2ECC71', // Fresh leaf green
  accentDark: '#229954', // Deep forest
  
  // Background colors
  background: '#FFF9F5', // Warm cream (softer)
  backgroundDark: '#F5EDE4', // Light sand
  surface: '#FFFFFF', // Pure white
  surfaceElevated: '#FCFCFC', // Slightly off-white
  
  // Text colors
  text: '#2C3E50', // Charcoal (softer than pure black)
  textLight: '#7F8C8D', // Soft gray
  textMuted: '#95A5A6', // Muted gray
  textOnPrimary: '#FFFFFF', // White text on primary
  textOnSecondary: '#FFFFFF', // White text on secondary
  
  // Semantic colors
  success: '#27AE60', // Emerald green
  successLight: '#2ECC71', // Light emerald
  warning: '#F39C12', // Amber
  warningLight: '#F1C40F', // Light amber
  error: '#E74C3C', // Coral red
  errorLight: '#E57373', // Light coral
  info: '#3498DB', // Info blue
  infoLight: '#5DADE2', // Light info
  
  // Special colors
  featherBrown: '#8B6F47', // Kookaburra feather brown
  featherCream: '#F5E6D3', // Kookaburra belly cream
  skyBlue: '#87CEEB', // Australian sky
  eucalyptusGreen: '#4A7C59', // Eucalyptus leaves
  sunsetPink: '#FFB6C1', // Australian sunset
  
  // Neutral grays
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
} as const;

export const spacing = {
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
  sunset: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.sunsetPink} 50%, ${colors.primaryLight} 100%)`,
  ocean: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 50%, ${colors.skyBlue} 100%)`,
  forest: `linear-gradient(135deg, ${colors.eucalyptusGreen} 0%, ${colors.accent} 50%, ${colors.accentLight} 100%)`,
  warm: `linear-gradient(135deg, ${colors.featherBrown} 0%, ${colors.secondary} 50%, ${colors.featherCream} 100%)`,
  soft: `linear-gradient(135deg, ${colors.background} 0%, ${colors.backgroundDark} 100%)`,
} as const;

export const blurs = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
} as const;