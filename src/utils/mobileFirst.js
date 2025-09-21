/**
 * Mobile-first utility classes and patterns
 * Provides consistent mobile-first styling patterns across components
 */

/**
 * Mobile-first responsive class patterns
 * These follow the principle of mobile-first design with progressive enhancement
 */

// Layout patterns - start mobile, enhance for larger screens
export const layoutPatterns = {
  // Container patterns
  container: {
    mobile: 'w-full px-content',
    enhanced: 'w-full px-content sm:px-content-sm md:px-content-md lg:px-content-lg xl:px-content-xl',
  },

  // Grid patterns
  cardGrid: {
    mobile: 'grid grid-cols-1 gap-card',
    enhanced: 'grid grid-cols-1 gap-card sm:grid-cols-2 sm:gap-card-sm md:grid-cols-3 md:gap-card-md lg:grid-cols-4 lg:gap-card-lg',
  },

  // Stack to sidebar layout
  stackToSidebar: {
    mobile: 'flex flex-col',
    enhanced: 'flex flex-col lg:grid lg:grid-cols-[280px_1fr]',
  },

  // Center content
  centerContent: {
    mobile: 'flex flex-col items-center justify-center min-h-screen-mobile p-content',
    enhanced: 'flex flex-col items-center justify-center min-h-screen p-content sm:p-content-sm md:p-content-md',
  },
}

// Navigation patterns
export const navigationPatterns = {
  // Bottom navigation for mobile
  bottomNav: {
    container: 'fixed bottom-0 left-0 right-0 z-bottom-nav bg-vault-bg border-t border-current lg:hidden',
    list: 'flex items-center justify-around h-nav-bar px-4',
    item: 'flex flex-col items-center justify-center min-w-touch min-h-touch p-2',
    label: 'text-xs mt-1 font-medium',
  },

  // Top app bar for mobile
  topBar: {
    container: 'flex items-center justify-between h-top-bar px-content bg-vault-bg border-b border-current lg:hidden',
    title: 'font-display text-lg font-bold truncate',
    actions: 'flex items-center gap-2',
  },

  // Side drawer for tablets
  sideDrawer: {
    overlay: 'fixed inset-0 z-overlay bg-black/50 backdrop-blur-sm md:hidden',
    drawer: 'fixed left-0 top-0 bottom-0 w-sidebar-sm z-modal bg-vault-bg border-r border-current transform transition-transform duration-300',
  },

  // Desktop sidebar
  sidebar: {
    container: 'hidden lg:flex lg:flex-col lg:w-sidebar-lg xl:w-sidebar-xl h-sidebar bg-vault-bg border-r border-current',
  },
}

// Touch-first interaction patterns - Enhanced for accessibility
export const touchPatterns = {
  // Touch targets - WCAG compliant sizes
  touchTarget: {
    minimum: 'min-w-touch min-h-touch',
    comfortable: 'min-w-touch-lg min-h-touch-lg',
    spacious: 'min-w-touch-xl min-h-touch-xl',
  },

  // Button patterns - Enhanced accessibility
  button: {
    primary: 'min-h-touch px-6 py-3 bg-black text-white rounded-lg font-semibold text-base transition-all duration-200 active:scale-95 disabled:opacity-60 focus:ring-4 focus:ring-black focus:ring-opacity-50',
    secondary: 'min-h-touch px-6 py-3 border-2 border-current rounded-lg font-semibold text-base transition-all duration-200 active:scale-95 disabled:opacity-60 focus:ring-4 focus:ring-current focus:ring-opacity-50',
    ghost: 'min-h-touch px-4 py-3 rounded-lg font-medium text-base transition-all duration-200 active:scale-95 hover:bg-current hover:bg-opacity-10 focus:ring-4 focus:ring-current focus:ring-opacity-50',
    icon: 'flex items-center justify-center min-w-touch min-h-touch rounded-lg transition-all duration-200 active:scale-95 focus:ring-4 focus:ring-current focus:ring-opacity-50',
    iconLarge: 'flex items-center justify-center min-w-touch-lg min-h-touch-lg rounded-lg transition-all duration-200 active:scale-95 focus:ring-4 focus:ring-current focus:ring-opacity-50',
  },

  // Card interactions - Enhanced feedback with z-index
  card: {
    base: 'p-4 bg-vault-card rounded-lg border-2 border-current transition-all duration-200 z-card',
    interactive: 'p-4 bg-vault-card rounded-lg border-2 border-current transition-all duration-200 active:scale-98 cursor-pointer hover:shadow-lg focus:ring-4 focus:ring-current focus:ring-opacity-20 z-card hover:z-card-hover',
    touchFeedback: 'p-4 bg-vault-card rounded-lg border-2 border-current transition-all duration-200 active:scale-98 active:bg-opacity-90 cursor-pointer hover:shadow-lg focus:ring-4 focus:ring-current focus:ring-opacity-20 z-card hover:z-card-hover',
    memory: 'p-6 bg-vault-card rounded-xl border-2 border-current transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-98 cursor-pointer focus:ring-4 focus:ring-current focus:ring-opacity-20 z-card hover:z-card-hover',
  },

  // Gesture feedback
  gestures: {
    pressDown: 'transform transition-transform duration-75 active:scale-95',
    scaleUp: 'transform transition-transform duration-200 hover:scale-105 active:scale-95',
    lift: 'transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-98',
  },
}

// Typography patterns with mobile-first scaling
export const typographyPatterns = {
  heading: {
    h1: 'font-display text-2xl font-black leading-tight sm:text-3xl md:text-4xl lg:text-5xl',
    h2: 'font-display text-xl font-bold leading-tight sm:text-2xl md:text-3xl lg:text-4xl',
    h3: 'font-display text-lg font-bold leading-tight sm:text-xl md:text-2xl lg:text-3xl',
    h4: 'font-display text-base font-bold leading-tight sm:text-lg md:text-xl',
  },
  body: {
    large: 'text-base leading-relaxed sm:text-lg',
    regular: 'text-sm leading-relaxed sm:text-base',
    small: 'text-xs leading-relaxed sm:text-sm',
  },
}

// Form patterns optimized for mobile - Enhanced accessibility
export const formPatterns = {
  input: {
    base: 'w-full min-h-touch px-4 py-3 border-2 border-current rounded-lg bg-transparent text-current transition-all duration-200 focus:ring-4 focus:ring-current focus:ring-opacity-20 focus:border-current text-base',
    search: 'w-full min-h-touch px-4 py-3 pl-12 border-2 border-current rounded-lg bg-transparent text-current transition-all duration-200 focus:ring-4 focus:ring-current focus:ring-opacity-20 focus:border-current text-base',
    textarea: 'w-full min-h-[120px] px-4 py-3 border-2 border-current rounded-lg bg-transparent text-current transition-all duration-200 focus:ring-4 focus:ring-current focus:ring-opacity-20 focus:border-current text-base resize-none',
    select: 'w-full min-h-touch px-4 py-3 border-2 border-current rounded-lg bg-transparent text-current transition-all duration-200 focus:ring-4 focus:ring-current focus:ring-opacity-20 focus:border-current text-base appearance-none',
    error: 'border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:ring-green-500',
  },
  label: {
    base: 'block text-base font-semibold mb-2 text-current',
    required: 'block text-base font-semibold mb-2 text-current after:content-["*"] after:ml-1 after:text-current after:font-bold',
    helper: 'block text-sm text-current/70 mb-2',
    error: 'block text-sm text-red-600 mt-1',
    success: 'block text-sm text-green-600 mt-1',
  },
  fieldset: {
    base: 'border-2 border-current rounded-lg p-4 mb-4',
    legend: 'text-base font-semibold px-2 text-current',
  },
}

// Animation patterns with reduced motion support
export const animationPatterns = {
  // Entry animations
  fadeIn: {
    base: 'opacity-0 translate-y-4',
    animate: 'opacity-100 translate-y-0',
    transition: 'transition-all duration-300 ease-out',
  },

  // Gesture feedback
  pressDown: 'transform transition-transform duration-75 active:scale-95',
  scaleUp: 'transform transition-transform duration-200 hover:scale-105 active:scale-95',

  // Loading states
  pulse: 'animate-pulse',
  spin: 'animate-spin',
}

// Utility functions for building responsive classes
export const responsive = {
  /**
   * Build responsive class string from mobile-first object
   * @param {object} classes - Object with breakpoint keys and class values
   * @returns {string} - Complete responsive class string
   */
  build: (classes) => {
    const breakpoints = ['base', 'sm', 'md', 'lg', 'xl', '2xl']
    return breakpoints
      .filter(bp => classes[bp])
      .map(bp => bp === 'base' ? classes[bp] : `${bp}:${classes[bp]}`)
      .join(' ')
  },

  /**
   * Create mobile-first spacing classes
   * @param {string} property - CSS property (p, m, px, py, etc.)
   * @param {object} values - Spacing values for each breakpoint
   * @returns {string} - Responsive spacing classes
   */
  spacing: (property, values) => {
    return responsive.build(
      Object.keys(values).reduce((acc, bp) => {
        acc[bp] = `${property}-${values[bp]}`
        return acc
      }, {})
    )
  },

  /**
   * Create responsive grid classes
   * @param {object} cols - Number of columns for each breakpoint
   * @returns {string} - Responsive grid classes
   */
  grid: (cols) => {
    return responsive.build(
      Object.keys(cols).reduce((acc, bp) => {
        acc[bp] = `grid-cols-${cols[bp]}`
        return acc
      }, {})
    )
  },
}

// Pre-built common patterns - Enhanced for accessibility
export const commonPatterns = {
  // Full-screen mobile, contained desktop - Safe area aware
  responsiveContainer: responsive.build({
    base: 'w-full min-h-screen-mobile px-content py-content pt-safe-top pb-safe-bottom',
    sm: 'px-content-sm py-content-sm',
    md: 'px-content-md py-content-md',
    lg: 'w-full px-content-lg py-content-lg max-w-7xl mx-auto',
    xl: 'w-full px-content-xl py-content-xl max-w-8xl mx-auto',
    '2xl': 'w-full px-content-xl py-content-xl max-w-screen-2xl mx-auto',
  }),

  // Enhanced responsive card grid with proper desktop centering
  cardGrid: responsive.build({
    base: 'grid grid-cols-1 gap-6 justify-items-center max-w-sm mx-auto',
    sm: 'grid-cols-2 gap-6 justify-items-stretch max-w-2xl mx-auto',
    md: 'grid-cols-3 gap-8 max-w-4xl mx-auto',
    lg: 'grid-cols-4 gap-8 max-w-6xl mx-auto justify-items-stretch',
    xl: 'grid-cols-5 gap-10 max-w-7xl mx-auto justify-items-stretch',
    '2xl': 'grid-cols-6 gap-12 max-w-screen-2xl mx-auto justify-items-stretch',
  }),

  // Memory card grid (optimized for memory cards) - Enhanced desktop centering
  memoryGrid: responsive.build({
    base: 'grid grid-cols-1 gap-6 justify-items-center max-w-sm mx-auto',
    sm: 'grid-cols-2 gap-6 justify-items-stretch max-w-2xl mx-auto',
    md: 'grid-cols-3 gap-8 max-w-4xl mx-auto',
    lg: 'grid-cols-4 gap-8 max-w-6xl mx-auto justify-items-stretch',
    xl: 'grid-cols-5 gap-10 max-w-7xl mx-auto justify-items-stretch',
    '2xl': 'grid-cols-6 gap-12 max-w-screen-2xl mx-auto justify-items-stretch',
  }),

  // Stack to horizontal - Better mobile handling
  stackToHorizontal: responsive.build({
    base: 'flex flex-col gap-4 items-stretch',
    sm: 'gap-6',
    md: 'flex-row items-center gap-6',
  }),

  // Responsive text sizing - WCAG compliant
  responsiveText: responsive.build({
    base: 'text-base leading-relaxed', // Minimum 16px for mobile
    sm: 'text-lg leading-relaxed',
    md: 'text-xl leading-relaxed',
    lg: 'text-2xl leading-relaxed',
  }),

  // Responsive spacing - Enhanced mobile comfort
  responsiveSpacing: responsive.build({
    base: 'p-content',
    sm: 'p-content-sm',
    md: 'p-content-md',
    lg: 'p-content-lg',
    xl: 'p-content-xl',
  }),

  // Mobile-first button sizing - Touch-friendly
  responsiveButton: responsive.build({
    base: 'px-6 py-3 text-base min-h-touch', // WCAG compliant
    sm: 'px-8 py-4 text-lg min-h-touch-lg',
    md: 'px-10 py-5 text-xl',
  }),

  // Navigation patterns
  responsiveNavigation: {
    mobile: 'fixed bottom-0 left-0 right-0 z-50 bg-vault-bg border-t-2 border-current',
    tablet: 'fixed top-0 left-0 right-0 z-40 bg-vault-bg border-b-2 border-current',
    desktop: 'fixed left-0 top-0 bottom-0 z-30 bg-vault-bg border-r-2 border-current',
  },

  // Content areas with navigation awareness
  contentWithNav: {
    mobile: 'pt-nav-top pb-nav-bottom px-content',
    tablet: 'pt-nav-top px-content',
    desktop: 'pl-sidebar px-content',
  },

  // Accessible focus management
  focusManagement: {
    skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-current text-vault-bg px-4 py-2 rounded-lg font-semibold',
    focusContainer: 'focus-within:ring-4 focus-within:ring-current focus-within:ring-opacity-20',
  },
}

// Accessibility utilities
export const accessibilityPatterns = {
  // ARIA patterns
  aria: {
    button: 'role="button" tabindex="0"',
    heading: (level) => `role="heading" aria-level="${level}"`,
    navigation: 'role="navigation" aria-label="Main navigation"',
    main: 'role="main"',
    banner: 'role="banner"',
    contentinfo: 'role="contentinfo"',
  },

  // Screen reader utilities
  screenReader: {
    only: 'sr-only',
    focusable: 'sr-only focus:not-sr-only',
    description: 'text-sm text-current/70',
  },

  // High contrast mode support
  highContrast: {
    border: 'border-2 border-current',
    outline: 'outline-2 outline-current',
    background: 'bg-current text-vault-bg',
  },

  // Reduced motion patterns
  reducedMotion: {
    respectPreference: 'motion-reduce:transition-none motion-reduce:animate-none',
    essential: 'motion-reduce:transition-opacity motion-reduce:duration-200',
  },
}

// Color contrast utilities for monochrome theme
export const contrastPatterns = {
  // Ensure WCAG AA compliance
  text: {
    primary: 'text-current', // Black on white / White on black = 21:1
    secondary: 'text-current/80', // ~16.8:1 ratio
    muted: 'text-current/70', // ~14.7:1 ratio (still AA compliant)
    subtle: 'text-current/60', // ~12.6:1 ratio (borderline, use carefully)
  },

  background: {
    primary: 'bg-vault-bg',
    card: 'bg-vault-card',
    overlay: 'bg-current/10',
    hover: 'hover:bg-current/5',
  },
}

export default {
  layoutPatterns,
  navigationPatterns,
  touchPatterns,
  typographyPatterns,
  formPatterns,
  animationPatterns,
  responsive,
  commonPatterns,
  accessibilityPatterns,
  contrastPatterns,
}