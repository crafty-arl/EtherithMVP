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
        // Fixed layout dimensions
        'sidebar': '220px',
        'sidebar-mobile': '100vw',
        'card': '280px',
        'card-tablet': '260px',
        'card-mobile': 'calc(100vw - 48px)',
      },
      height: {
        'sidebar-mobile': '60px',
        'header': '80px',
        'header-mobile': '70px',
      },
      padding: {
        'content': '40px',
        'content-tablet': '32px',
        'content-mobile': '24px',
      },
      gap: {
        'card': '24px',
        'card-tablet': '20px',
        'card-mobile': '16px',
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
        'mobile': '768px',
        'tablet': '1024px',
        'desktop': '1440px',
      }
    },
  },
  plugins: [],
}