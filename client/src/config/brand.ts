/**
 * PathForward Myanmar Brand Configuration
 *
 * This file contains all brand-related constants including colors,
 * typography, logos, and brand messaging for consistent use across
 * the entire application.
 */

import logo from '@/media/logo.png';

// Brand Colors - PathForward Myanmar Color Palette
export const brandColors = {
  // Primary Brand Colors
  primary: {
    main: '#2F4156',      // Deep Blue - Main brand color
    light: '#567C8D',     // Medium Blue - Secondary shade
    lighter: '#6BB9F0',   // Sky Blue - Accent
    dark: '#243447',      // Dark Blue - For depth
    contrast: '#FFFFFF',  // White - For text on primary
  },

  // Secondary Colors
  secondary: {
    main: '#C8D9E6',      // Light Blue Gray
    light: '#E3EAF1',     // Very Light Blue
    dark: '#A8BDD0',      // Medium Blue Gray
  },

  // Background Colors
  background: {
    main: '#F5EFEB',      // Warm off-white
    white: '#FFFFFF',     // Pure white
    gray: '#F3F4F6',      // Light gray
  },

  // Accent Colors
  accent: {
    emerald: '#10B981',   // Success/Verified
    blue: '#3B82F6',      // Info/Links
    purple: '#8B5CF6',    // Premium/Special
    yellow: '#F59E0B',    // Warning/Pending
    red: '#EF4444',       // Error/Rejected
    orange: '#F97316',    // Highlight
    pink: '#EC4899',      // Freelancer accent
  },

  // Text Colors
  text: {
    primary: '#2F4156',   // Main text
    secondary: '#567C8D', // Secondary text
    muted: '#9CA3AF',     // Muted text
    light: '#D1D5DB',     // Very light text
    white: '#FFFFFF',     // White text
  },
} as const;

// Typography
export const brandTypography = {
  fonts: {
    // Use system fonts for optimal performance and readability
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
  },

  sizes: {
    // Using Tailwind-compatible scale
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },

  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

// Logo Assets
export const brandAssets = {
  logo: {
    default: logo,
    alt: 'PathForward Myanmar',
  },
} as const;

// Brand Messaging
export const brandMessaging = {
  name: 'PathForward Myanmar',
  tagline: 'Empowering Myanmar\'s Future',
  description: 'Connecting students, universities, companies, and freelancers to bridge the gap between education and employment.',

  mission: 'To empower Myanmar\'s workforce by creating seamless connections between education and employment opportunities.',

  values: [
    'Accessibility',
    'Innovation',
    'Community',
    'Growth',
    'Trust',
  ],
} as const;

// Gradient Combinations
export const brandGradients = {
  primary: `linear-gradient(135deg, ${brandColors.primary.main} 0%, ${brandColors.primary.light} 100%)`,
  blue: 'linear-gradient(135deg, #3B82F6 0%, #6BB9F0 100%)',
  purple: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  emerald: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
  sunset: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
  ocean: 'linear-gradient(135deg, #2F4156 0%, #6BB9F0 100%)',
} as const;

// Spacing Scale (matches Tailwind)
export const brandSpacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

// Border Radius
export const brandRadius = {
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// Shadows
export const brandShadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

// Animation Durations
export const brandAnimations = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;

// Breakpoints (matches Tailwind)
export const brandBreakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Export default brand config
export const brand = {
  colors: brandColors,
  typography: brandTypography,
  assets: brandAssets,
  messaging: brandMessaging,
  gradients: brandGradients,
  spacing: brandSpacing,
  radius: brandRadius,
  shadows: brandShadows,
  animations: brandAnimations,
  breakpoints: brandBreakpoints,
} as const;

export default brand;
