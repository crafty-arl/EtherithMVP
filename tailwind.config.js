/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index-react.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pure monochrome palette
        black: '#000000',
        white: '#FFFFFF',

        // Custom semantic colors
        vault: {
          bg: '#FFFFFF',
          card: '#000000',
          text: '#000000',
        },
        archive: {
          bg: '#000000',
          card: '#FFFFFF',
          text: '#FFFFFF',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
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
        'safe-area': 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
      minHeight: {
        // Touch target minimums (WCAG compliance)
        'touch': '44px',              // Minimum touch target
        'touch-lg': '48px',           // Large touch target
        'screen-mobile': '100vh',     // Full mobile viewport
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
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
        // Mobile-first layering system
        'bottom-nav': '50',           // Bottom navigation
        'top-bar': '40',              // Top app bar
        'overlay': '60',              // Modal overlays
        'toast': '70',                // Toast notifications
        'modal': '80',                // Modal dialogs
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
        'sm': '640px',    // Small tablets and large mobile
        'md': '768px',    // Tablets portrait
        'lg': '1024px',   // Small desktops / tablets landscape
        'xl': '1280px',   // Large desktops
        '2xl': '1536px',  // Extra large screens
      }
    },
  },
  plugins: [],
}