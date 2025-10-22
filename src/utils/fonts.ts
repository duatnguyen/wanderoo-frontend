/**
 * Font utilities for consistent typography across the application
 * 
 * This file provides utility functions and constants for managing fonts
 * in a professional and maintainable way.
 */

// Font family constants - Self-hosted Montserrat
export const FONT_FAMILIES = {
  primary: 'Montserrat',
  fallback: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: '"Fira Code", "JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
} as const;

// Font loading status for self-hosted fonts
export const FONT_LOADING_STATUS = {
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
} as const;

// Font weight constants
export const FONT_WEIGHTS = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

// Font size constants (in rem)
export const FONT_SIZES = {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px
  lg: '1.125rem',    // 18px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px
} as const;

// Line height constants
export const LINE_HEIGHTS = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// Typography presets for common use cases
export const TYPOGRAPHY_PRESETS = {
  // Headings
  h1: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES['4xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.tight,
  },
  h2: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.tight,
  },
  h3: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.snug,
  },
  h4: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.snug,
  },
  h5: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
  },
  h6: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
  },
  
  // Body text
  body: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.normal,
  },
  bodySmall: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.normal,
  },
  
  // UI elements
  button: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.none,
  },
  caption: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.normal,
  },
  label: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
  },
} as const;

// Utility function to get font family string
export const getFontFamily = (family: keyof typeof FONT_FAMILIES = 'primary'): string => {
  return `${FONT_FAMILIES[family]}, ${FONT_FAMILIES.fallback}`;
};

// Utility function to get complete font style object
export const getFontStyle = (
  size: keyof typeof FONT_SIZES = 'base',
  weight: keyof typeof FONT_WEIGHTS = 'normal',
  lineHeight: keyof typeof LINE_HEIGHTS = 'normal'
) => ({
  fontFamily: getFontFamily(),
  fontSize: FONT_SIZES[size],
  fontWeight: FONT_WEIGHTS[weight],
  lineHeight: LINE_HEIGHTS[lineHeight],
});

// CSS custom properties for fonts
export const FONT_CSS_VARS = `
  :root {
    --font-primary: ${FONT_FAMILIES.primary};
    --font-fallback: ${FONT_FAMILIES.fallback};
    --font-mono: ${FONT_FAMILIES.mono};
  }
` as const;
