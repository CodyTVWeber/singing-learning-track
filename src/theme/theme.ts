export const colors = {
  primary: '#8B6952', // Warm brown
  secondary: '#6FA8DC', // Sky blue
  background: '#FAF7F2', // Light cream
  surface: '#FFFFFF', // White
  darkBrown: '#5D4037',
  text: '#3E2723',
  textLight: '#6D4C41',
  success: '#7CB342',
  warning: '#FFB74D',
  error: '#E57373',
  featherLight: '#D7CCC8',
  skyLight: '#BBDEFB',
  earthTone: '#A1887F',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  round: '50%',
} as const;

export const fontSize = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px',
} as const;

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out',
} as const;

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
} as const;