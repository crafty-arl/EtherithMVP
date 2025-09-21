import { useState, useEffect } from 'react'

/**
 * Mobile-first responsive hook system
 * Provides screen size detection and responsive state management
 */

// Mobile-first breakpoints matching tailwind.config.js
const BREAKPOINTS = {
  sm: 640,   // Small tablets and large mobile
  md: 768,   // Tablets portrait
  lg: 1024,  // Small desktops / tablets landscape
  xl: 1280,  // Large desktops
  '2xl': 1536, // Extra large screens
}

/**
 * useMediaQuery - Custom hook for responsive media queries
 * @param {string} query - CSS media query string
 * @returns {boolean} - Whether the query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    // Set initial state
    setMatches(mediaQuery.matches)

    // Listen for changes
    const handleChange = (event) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

/**
 * useBreakpoint - Hook for specific breakpoint detection
 * @param {string} breakpoint - Breakpoint name (sm, md, lg, xl, 2xl)
 * @returns {boolean} - Whether screen is at or above breakpoint
 */
export function useBreakpoint(breakpoint) {
  const minWidth = BREAKPOINTS[breakpoint]
  return useMediaQuery(`(min-width: ${minWidth}px)`)
}

/**
 * useScreenSize - Comprehensive screen size information
 * @returns {object} - Screen size state and helper booleans
 */
export function useScreenSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { width } = windowSize

  return {
    ...windowSize,
    // Mobile-first responsive states
    isMobile: width < BREAKPOINTS.sm,
    isTabletSmall: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
    isDesktopLarge: width >= BREAKPOINTS.xl,

    // Convenience groupings
    isMobileOrTablet: width < BREAKPOINTS.lg,
    isTabletOrDesktop: width >= BREAKPOINTS.md,

    // Breakpoint states
    sm: width >= BREAKPOINTS.sm,
    md: width >= BREAKPOINTS.md,
    lg: width >= BREAKPOINTS.lg,
    xl: width >= BREAKPOINTS.xl,
    '2xl': width >= BREAKPOINTS['2xl'],
  }
}

/**
 * useTouch - Detects touch-capable devices
 * @returns {boolean} - Whether device supports touch
 */
export function useTouch() {
  return useMediaQuery('(pointer: coarse)')
}

/**
 * useHover - Detects hover-capable devices
 * @returns {boolean} - Whether device supports hover
 */
export function useHover() {
  return useMediaQuery('(hover: hover)')
}

/**
 * useOrientation - Device orientation detection
 * @returns {string} - 'portrait' or 'landscape'
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState(
    typeof window !== 'undefined' && window.innerHeight > window.innerWidth
      ? 'portrait'
      : 'landscape'
  )

  useEffect(() => {
    function handleOrientationChange() {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    window.addEventListener('resize', handleOrientationChange)
    return () => window.removeEventListener('resize', handleOrientationChange)
  }, [])

  return orientation
}

/**
 * useReducedMotion - Respects user's motion preferences
 * @returns {boolean} - Whether user prefers reduced motion
 */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * useResponsive - Comprehensive responsive hook
 * Combines all responsive utilities into one hook
 * @returns {object} - Complete responsive state
 */
export function useResponsive() {
  const screenSize = useScreenSize()
  const isTouch = useTouch()
  const hasHover = useHover()
  const orientation = useOrientation()
  const prefersReducedMotion = useReducedMotion()

  return {
    ...screenSize,
    isTouch,
    hasHover,
    orientation,
    prefersReducedMotion,

    // Layout helpers
    showBottomNav: screenSize.isMobile,
    showSideDrawer: screenSize.isTablet,
    showSidebar: screenSize.isDesktop || screenSize.isDesktopLarge,

    // Touch target helpers
    touchTargetSize: isTouch ? 'touch-lg' : 'touch',

    // Animation helpers
    shouldAnimate: !prefersReducedMotion,
    
    // Desktop-specific helpers
    isDesktopMode: screenSize.isDesktop || screenSize.isDesktopLarge,
    desktopOptimized: screenSize.isDesktop || screenSize.isDesktopLarge,
    enhancedInteractions: hasHover && !isTouch,
  }
}

// CSS-in-JS media query helpers
export const mediaQueries = {
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']}px)`,

  mobile: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,

  touch: '(pointer: coarse)',
  hover: '(hover: hover)',
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
}

export default useResponsive