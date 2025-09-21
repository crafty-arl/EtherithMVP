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

// Touch-first interaction patterns
export const touchPatterns = {
  // Touch targets
  touchTarget: {
    minimum: 'min-w-touch min-h-touch',
    comfortable: 'min-w-touch-lg min-h-touch-lg',
  },

  // Button patterns
  button: {
    primary: 'min-h-touch px-6 py-3 bg-black text-white rounded-md font-medium transition-all duration-200 active:scale-95 disabled:opacity-50',
    secondary: 'min-h-touch px-6 py-3 border border-current rounded-md font-medium transition-all duration-200 active:scale-95 disabled:opacity-50',
    icon: 'flex items-center justify-center min-w-touch min-h-touch rounded-md transition-all duration-200 active:scale-95',
  },

  // Card interactions
  card: {
    base: 'p-4 bg-vault-card rounded-lg border border-current transition-all duration-200',
    interactive: 'p-4 bg-vault-card rounded-lg border border-current transition-all duration-200 active:scale-98 cursor-pointer',
    touchFeedback: 'p-4 bg-vault-card rounded-lg border border-current transition-all duration-200 active:scale-98 active:bg-opacity-90 cursor-pointer',
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

// Form patterns optimized for mobile
export const formPatterns = {
  input: {
    base: 'w-full min-h-touch px-4 py-3 border border-current rounded-md bg-transparent text-current placeholder-current/60 transition-all duration-200 focus:ring-2 focus:ring-current focus:ring-opacity-20',
    search: 'w-full min-h-touch px-4 py-3 pl-10 border border-current rounded-md bg-transparent text-current placeholder-current/60 transition-all duration-200 focus:ring-2 focus:ring-current focus:ring-opacity-20',
  },
  label: {
    base: 'block text-sm font-medium mb-2',
    required: 'block text-sm font-medium mb-2 after:content-["*"] after:ml-1 after:text-red-500',
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

// Pre-built common patterns
export const commonPatterns = {
  // Full-screen mobile, contained desktop
  responsiveContainer: responsive.build({
    base: 'w-full min-h-screen-mobile px-content py-content',
    sm: 'px-content-sm py-content-sm',
    md: 'px-content-md py-content-md',
    lg: 'max-w-screen-lg mx-auto px-content-lg py-content-lg',
    xl: 'max-w-screen-xl px-content-xl py-content-xl',
  }),

  // Responsive card grid
  cardGrid: responsive.build({
    base: 'grid grid-cols-1 gap-card',
    sm: 'grid-cols-2 gap-card-sm',
    md: 'grid-cols-3 gap-card-md',
    lg: 'grid-cols-4 gap-card-lg',
  }),

  // Stack to horizontal
  stackToHorizontal: responsive.build({
    base: 'flex flex-col gap-4',
    md: 'flex-row items-center gap-6',
  }),
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
}