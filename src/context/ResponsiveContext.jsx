import React, { createContext, useContext, useEffect, useState } from 'react'
import { useResponsive } from '../hooks/useResponsive'

/**
 * ResponsiveContext - Provides responsive state throughout the app
 * Centralizes screen size and device capability detection
 */

const ResponsiveContext = createContext(null)

/**
 * ResponsiveProvider - Context provider for responsive state
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export function ResponsiveProvider({ children }) {
  const responsiveState = useResponsive()
  const [isHydrated, setIsHydrated] = useState(false)

  // Handle SSR hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Don't render until hydrated to prevent layout shifts
  if (!isHydrated) {
    return (
      <ResponsiveContext.Provider value={{
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        isTouch: true,
        hasHover: false,
        showBottomNav: true,
        showSideDrawer: false,
        showSidebar: false,
        shouldAnimate: true,
        prefersReducedMotion: false,
        width: 375, // Default mobile width
        height: 667, // Default mobile height
        sm: false,
        md: false,
        lg: false,
        xl: false,
        '2xl': false,
      }}>
        {children}
      </ResponsiveContext.Provider>
    )
  }

  return (
    <ResponsiveContext.Provider value={responsiveState}>
      {children}
    </ResponsiveContext.Provider>
  )
}

/**
 * useResponsiveContext - Hook to access responsive context
 * @returns {object} - Current responsive state
 */
export function useResponsiveContext() {
  const context = useContext(ResponsiveContext)

  if (!context) {
    throw new Error('useResponsiveContext must be used within a ResponsiveProvider')
  }

  return context
}

/**
 * withResponsive - HOC to inject responsive props
 * @param {React.Component} Component - Component to wrap
 * @returns {React.Component} - Enhanced component with responsive props
 */
export function withResponsive(Component) {
  return function ResponsiveComponent(props) {
    const responsive = useResponsiveContext()
    return <Component {...props} responsive={responsive} />
  }
}

/**
 * ResponsiveDebugger - Development component to visualize responsive state
 * Only renders in development mode
 */
export function ResponsiveDebugger() {
  const responsive = useResponsiveContext()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-modal bg-black text-white p-3 rounded-lg text-xs font-mono lg:hidden">
      <div className="font-bold mb-2">Responsive Debug</div>
      <div>Width: {responsive.width}px</div>
      <div>Height: {responsive.height}px</div>
      <div>Mobile: {responsive.isMobile ? '✓' : '✗'}</div>
      <div>Tablet: {responsive.isTablet ? '✓' : '✗'}</div>
      <div>Desktop: {responsive.isDesktop ? '✓' : '✗'}</div>
      <div>Touch: {responsive.isTouch ? '✓' : '✗'}</div>
      <div>Hover: {responsive.hasHover ? '✓' : '✗'}</div>
      <div>Orientation: {responsive.orientation}</div>
      <div className="mt-2 pt-2 border-t border-white/20">
        <div>Bottom Nav: {responsive.showBottomNav ? '✓' : '✗'}</div>
        <div>Side Drawer: {responsive.showSideDrawer ? '✓' : '✗'}</div>
        <div>Sidebar: {responsive.showSidebar ? '✓' : '✗'}</div>
      </div>
    </div>
  )
}

/**
 * Responsive utility components
 */

/**
 * ShowOn - Conditionally render children based on screen size
 * @param {object} props - Component props
 * @param {boolean} props.mobile - Show on mobile
 * @param {boolean} props.tablet - Show on tablet
 * @param {boolean} props.desktop - Show on desktop
 * @param {ReactNode} props.children - Content to conditionally show
 */
export function ShowOn({ mobile, tablet, desktop, children }) {
  const { isMobile, isTablet, isDesktop } = useResponsiveContext()

  const shouldShow =
    (mobile && isMobile) ||
    (tablet && isTablet) ||
    (desktop && isDesktop)

  if (!shouldShow) return null

  return children
}

/**
 * HideOn - Conditionally hide children based on screen size
 * @param {object} props - Component props
 * @param {boolean} props.mobile - Hide on mobile
 * @param {boolean} props.tablet - Hide on tablet
 * @param {boolean} props.desktop - Hide on desktop
 * @param {ReactNode} props.children - Content to conditionally hide
 */
export function HideOn({ mobile, tablet, desktop, children }) {
  const { isMobile, isTablet, isDesktop } = useResponsiveContext()

  const shouldHide =
    (mobile && isMobile) ||
    (tablet && isTablet) ||
    (desktop && isDesktop)

  if (shouldHide) return null

  return children
}

/**
 * TouchOnly - Show content only on touch devices
 */
export function TouchOnly({ children }) {
  const { isTouch } = useResponsiveContext()
  return isTouch ? children : null
}

/**
 * HoverOnly - Show content only on hover-capable devices
 */
export function HoverOnly({ children }) {
  const { hasHover } = useResponsiveContext()
  return hasHover ? children : null
}

/**
 * MotionSafe - Conditionally apply motion based on user preferences
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Content with animations
 * @param {ReactNode} props.fallback - Static fallback content
 */
export function MotionSafe({ children, fallback = null }) {
  const { shouldAnimate } = useResponsiveContext()
  return shouldAnimate ? children : fallback
}

export default ResponsiveContext