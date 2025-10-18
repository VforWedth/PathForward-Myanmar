# PathForward Myanmar Branding Guide

## Overview

This document outlines the comprehensive brand identity system for PathForward Myanmar, including colors, typography, components, and usage guidelines.

## Brand Identity

### Mission
To empower Myanmar's workforce by creating seamless connections between education and employment opportunities.

### Tagline
"Empowering Myanmar's Future"

### Core Values
- **Accessibility** - Making opportunities available to everyone
- **Innovation** - Leveraging technology for better connections
- **Community** - Building strong networks
- **Growth** - Supporting continuous development
- **Trust** - Maintaining reliability and integrity

## Color Palette

### Primary Colors
```css
--brand-primary: #2F4156        /* Deep Blue - Main brand color */
--brand-primary-light: #567C8D  /* Medium Blue - Secondary shade */
--brand-primary-lighter: #6BB9F0 /* Sky Blue - Accent */
--brand-primary-dark: #243447    /* Dark Blue - For depth */
```

### Secondary Colors
```css
--brand-secondary: #C8D9E6      /* Light Blue Gray */
--brand-secondary-light: #E3EAF1 /* Very Light Blue */
--brand-secondary-dark: #A8BDD0  /* Medium Blue Gray */
```

### Background Colors
```css
--brand-bg-main: #F5EFEB        /* Warm off-white */
--brand-bg-white: #FFFFFF       /* Pure white */
--brand-bg-gray: #F3F4F6        /* Light gray */
```

### Accent Colors
- **Emerald** (#10B981) - Success, verified status
- **Blue** (#3B82F6) - Information, links
- **Purple** (#8B5CF6) - Premium features
- **Yellow** (#F59E0B) - Warnings, pending items
- **Red** (#EF4444) - Errors, rejections
- **Orange** (#F97316) - Highlights
- **Pink** (#EC4899) - Freelancer accent

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Font Weights
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

### Size Scale
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)
- 5xl: 3rem (48px)
- 6xl: 3.75rem (60px)
- 7xl: 4.5rem (72px)

## Logo Usage

### Logo Component
```tsx
import { Logo } from '@/components/brand/Logo';

// Full logo with text
<Logo size="md" showText={true} linkTo="/" />

// Icon only
<Logo size="lg" showText={false} />

// Logo sizes: 'sm' | 'md' | 'lg' | 'xl'
```

### Logo Sizes
- **sm**: 32x32px
- **md**: 40x40px (default)
- **lg**: 48x48px
- **xl**: 64x64px

### Spacing
- Maintain minimum clear space of 16px around the logo
- Don't distort, rotate, or modify the logo
- Use on light backgrounds or with appropriate contrast

## Brand Components

### Available Components

#### 1. Logo Component
```tsx
import { Logo, LogoIcon } from '@/components/brand';

<Logo size="md" showText={true} linkTo="/" />
<LogoIcon size="sm" />
```

#### 2. Footer Component
```tsx
import { Footer, CompactFooter } from '@/components/brand';

// Full footer for landing pages
<Footer />

// Compact footer for dashboards
<CompactFooter />
```

### Using Brand Configuration
```tsx
import { brand, brandColors, brandMessaging } from '@/config/brand';

// Access colors
const primaryColor = brandColors.primary.main;

// Access messaging
const tagline = brandMessaging.tagline;

// Access gradients
const gradient = brand.gradients.primary;
```

## CSS Variables

All brand colors are available as CSS variables:

```css
/* Primary Colors */
var(--brand-primary)
var(--brand-primary-light)
var(--brand-primary-lighter)
var(--brand-primary-dark)

/* Secondary Colors */
var(--brand-secondary)
var(--brand-secondary-light)
var(--brand-secondary-dark)

/* Backgrounds */
var(--brand-bg-main)
var(--brand-bg-white)
var(--brand-bg-gray)

/* Text Colors */
var(--brand-text-primary)
var(--brand-text-secondary)
var(--brand-text-muted)
```

## Gradient Combinations

### Primary Gradient
```css
background: linear-gradient(135deg, #2F4156 0%, #567C8D 100%);
```

### Blue Gradient
```css
background: linear-gradient(135deg, #3B82F6 0%, #6BB9F0 100%);
```

### Ocean Gradient
```css
background: linear-gradient(135deg, #2F4156 0%, #6BB9F0 100%);
```

## Usage Examples

### Button Styles
```tsx
// Primary Button
<button className="px-6 py-2 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white rounded-lg">
  Get Started
</button>

// Secondary Button
<button className="px-6 py-2 text-[var(--brand-primary)] border-2 border-[var(--brand-primary)] rounded-lg hover:bg-[var(--brand-secondary)]">
  Learn More
</button>
```

### Text Gradients
```tsx
<h1 className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-lighter)] text-transparent bg-clip-text">
  PathForward Myanmar
</h1>
```

### Card Styles
```tsx
<div className="bg-white rounded-2xl border border-[var(--brand-secondary)] shadow-lg p-6">
  <h3 className="text-[var(--brand-text-primary)] font-bold mb-2">Card Title</h3>
  <p className="text-[var(--brand-text-secondary)]">Card content</p>
</div>
```

## Accessibility Guidelines

### Color Contrast
- Ensure text has minimum 4.5:1 contrast ratio against backgrounds
- Primary blue (#2F4156) on white background: ✓ Passes WCAG AA
- White text on primary blue: ✓ Passes WCAG AA

### Text Sizes
- Minimum body text: 16px (1rem)
- Minimum touch target: 44x44px
- Maximum line length: 75 characters

### Focus States
- All interactive elements must have visible focus indicators
- Use `focus:ring-2 focus:ring-[var(--brand-primary)]` classes

## File Structure

```
client/src/
├── config/
│   └── brand.ts              # Brand configuration
├── components/
│   └── brand/
│       ├── Logo.tsx          # Logo component
│       ├── Footer.tsx        # Footer components
│       └── index.ts          # Exports
├── media/
│   └── logo.png              # Brand logo
└── app/
    └── globals.css           # CSS variables
```

## Brand Assets

### Logo
- Location: `client/src/media/logo.png`
- Format: PNG with transparency
- Usage: Import via `@/media/logo.png`

### Exports
```tsx
// Centralized imports
import { Logo, LogoIcon, Footer, CompactFooter } from '@/components/brand';
import { brand, brandColors, brandMessaging } from '@/config/brand';
```

## Implementation Checklist

### Pages Updated
- ✅ Landing page (`/`)
- ✅ Login page (`/login`)
- ✅ FAQ page (`/faq`)
- ✅ Freelancer dashboard
- ✅ Student dashboard
- ✅ Company dashboard
- ✅ University dashboard
- ✅ Admin dashboard

### Components Created
- ✅ Logo component with multiple sizes
- ✅ Footer component (full and compact versions)
- ✅ Brand configuration file
- ✅ CSS variable system

### Navigation Updates
- ✅ All pages use consistent Logo component
- ✅ Brand colors applied to CTAs
- ✅ Consistent navigation styling

## Best Practices

1. **Always use brand components** instead of hardcoding logos or footers
2. **Use CSS variables** for colors to maintain consistency
3. **Import from centralized location** (`@/components/brand` or `@/config/brand`)
4. **Maintain spacing** around brand elements
5. **Test accessibility** of color combinations
6. **Keep messaging consistent** using `brandMessaging` constants

## Support

For questions about brand usage or to request new brand components, please refer to:
- Brand configuration: `client/src/config/brand.ts`
- Component documentation: This file (BRANDING.md)
- Design system: Global CSS variables in `globals.css`

---

**Last Updated**: 2025
**Version**: 1.0.0
**Maintained by**: PathForward Myanmar Development Team
