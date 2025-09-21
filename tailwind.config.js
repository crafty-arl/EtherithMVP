/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index-react.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Pure monochrome palette
        black: '#000000',
        white: '#FFFFFF',

        // CSS custom property based theme colors
        'color-bg': 'var(--color-bg)',
        'color-text': 'var(--color-text)',
        'color-card': 'var(--color-card)',
        'color-border': 'var(--color-border)',
        'color-accent': 'var(--color-accent)',

        // Legacy support - gradually migrate to CSS custom properties
        vault: {
          bg: 'var(--color-bg, #FFFFFF)',
          card: 'var(--color-card, #000000)',
          text: 'var(--color-text, #000000)',
        },
        archive: {
          bg: 'var(--color-bg, #000000)',
          card: 'var(--color-card, #FFFFFF)',
          text: 'var(--color-text, #FFFFFF)',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Mobile-optimized font sizes
        '16': '16px',                 // Prevent iOS zoom on form inputs
        // Enhanced responsive text sizes
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '1' }],
        '6xl': ['60px', { lineHeight: '1' }],
      },
      spacing: {
        // Fixed spacing scale - compact
        'xs': '6px',
        'sm': '12px',
        'md': '18px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '60px',
        '4xl': '80px',
      },
      width: {
        // Mobile-first responsive dimensions
        'sidebar': '100vw',           // Mobile: full width (bottom nav)
        'sidebar-sm': '280px',        // Small: drawer width
        'sidebar-lg': '220px',        // Large: traditional sidebar
        'sidebar-xl': '280px',        // XL: expanded sidebar
        'card': 'calc(100vw - 48px)', // Mobile: full width with padding
        'card-sm': '320px',           // Small: optimal card width
        'card-md': '280px',           // Medium: grid-friendly width
        'card-lg': '260px',           // Large: compact grid width
      },
      height: {
        // Mobile-first navigation heights
        'nav-bar': '60px',            // Mobile: bottom navigation
        'top-bar': '56px',            // Mobile: top app bar
        'header': '64px',             // Mobile: main header
        'header-md': '72px',          // Medium: expanded header
        'header-lg': '80px',          // Large: desktop header
        'sidebar': '100vh',           // Sidebar full height (when used)
      },
      padding: {
        // Mobile-first content padding
        'content': '16px',            // Mobile: tight padding
        'content-sm': '24px',         // Small: comfortable padding
        'content-md': '32px',         // Medium: spacious padding
        'content-lg': '40px',         // Large: desktop padding
        'content-xl': '48px',         // XL: luxurious padding
        // Safe area support for mobile devices
        'safe-top': 'env(safe-area-inset-top)',
        'safe-right': 'env(safe-area-inset-right)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-area': 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
        // Navigation-aware padding
        'nav-top': '56px',            // Mobile top bar height
        'nav-bottom': '60px',         // Mobile bottom nav height
        'nav-both': '56px 16px 60px 16px', // Both top and bottom
      },
      minHeight: {
        // Touch target minimums (WCAG compliance)
        'touch': '44px',              // Minimum touch target
        'touch-lg': '48px',           // Large touch target
        'touch-xl': '52px',           // Extra large touch target
        'screen-mobile': '100vh',     // Full mobile viewport
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        'content-mobile': 'calc(100vh - 60px - 56px)', // Mobile with nav bars
        'content-tablet': 'calc(100vh - 72px)',         // Tablet with top bar
        'content-desktop': '100vh',                     // Desktop full height
      },
      minWidth: {
        // Touch target minimums
        'touch': '44px',              // Minimum touch target
        'touch-lg': '48px',           // Large touch target
      },
      gap: {
        // Mobile-first gap system
        'card': '16px',               // Mobile: tight card spacing
        'card-sm': '20px',            // Small: comfortable spacing
        'card-md': '24px',            // Medium: spacious spacing
        'card-lg': '28px',            // Large: generous spacing
        'nav': '12px',                // Navigation item spacing
        'nav-sm': '16px',             // Small nav spacing
        'grid': '16px',               // Mobile: grid gap
        'grid-sm': '20px',            // Small: grid gap
        'grid-md': '24px',            // Medium: grid gap
        'grid-lg': '32px',            // Large: grid gap
      },
      zIndex: {
        // ENHANCED: Mobile-first layering system with card support
        'card': '10',                 // Cards above background
        'card-hover': '20',           // Hovered cards above others
        'nav-item': '30',             // Navigation items
        'top-bar': '40',              // Top app bar
        'bottom-nav': '50',           // Bottom navigation
        'overlay': '60',              // Modal overlays
        'toast': '70',                // Toast notifications
        'modal': '80',                // Modal dialogs
        'dropdown': '90',             // Dropdown menus
        'tooltip': '100',             // Tooltips (highest UI layer)
      },
      backdropBlur: {
        'ios': '20px',                // iOS-style blur
      },
      borderRadius: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.33, 1, 0.68, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'fast': '200ms',
        'medium': '400ms',
        'slow': '600ms',
      },
      scale: {
        // Touch feedback scales
        'touch': '0.95',              // Standard touch feedback
        'touch-sm': '0.98',           // Subtle touch feedback
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      screens: {
        // Mobile-first responsive breakpoints
        'xs': '480px',    // Large mobile phones
        'sm': '640px',    // Small tablets and large mobile
        'md': '768px',    // Tablets portrait
        'lg': '1024px',   // Small desktops / tablets landscape
        'xl': '1280px',   // Large desktops
        '2xl': '1536px',  // Extra large screens
        // Utility breakpoints
        'mobile': { 'max': '639px' },     // Mobile only
        'tablet': { 'min': '640px', 'max': '1023px' }, // Tablet only
        'desktop': { 'min': '1024px' },   // Desktop and up
        // Feature-based breakpoints
        'short': { 'raw': '(max-height: 600px)' },
        'tall': { 'raw': '(min-height: 800px)' },
        'touch': { 'raw': '(pointer: coarse)' },
        'mouse': { 'raw': '(pointer: fine)' },
        'hover-capable': { 'raw': '(hover: hover)' },
      }
    },
  },
  plugins: [],
}