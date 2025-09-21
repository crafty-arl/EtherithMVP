import React, { useState, useEffect } from 'react'
import { useResponsiveContext } from '../context/ResponsiveContext'

/**
 * ViewportDebugger - Development component to debug viewport issues
 * Only renders in development mode
 */
export default function ViewportDebugger() {
  const [viewportInfo, setViewportInfo] = useState({
    width: 0,
    height: 0,
    devicePixelRatio: 1,
    orientation: 'portrait'
  })

  const responsive = useResponsiveContext()

  useEffect(() => {
    const updateViewportInfo = () => {
      setViewportInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      })
    }

    updateViewportInfo()
    window.addEventListener('resize', updateViewportInfo)
    window.addEventListener('orientationchange', updateViewportInfo)

    return () => {
      window.removeEventListener('resize', updateViewportInfo)
      window.removeEventListener('orientationchange', updateViewportInfo)
    }
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-modal bg-black text-white p-3 rounded-lg text-xs font-mono max-w-xs">
      <div className="font-bold mb-2 text-green-400">Viewport Debug</div>
      
      <div className="space-y-1">
        <div>Viewport: {viewportInfo.width}×{viewportInfo.height}</div>
        <div>DPR: {viewportInfo.devicePixelRatio}</div>
        <div>Orientation: {viewportInfo.orientation}</div>
        
        <div className="border-t border-white/20 pt-2 mt-2">
          <div className="font-semibold text-blue-400">Responsive State:</div>
          <div>Mobile: {responsive.isMobile ? '✓' : '✗'}</div>
          <div>Tablet: {responsive.isTablet ? '✓' : '✗'}</div>
          <div>Desktop: {responsive.isDesktop ? '✓' : '✗'}</div>
          <div>Touch: {responsive.isTouch ? '✓' : '✗'}</div>
          <div>Hover: {responsive.hasHover ? '✓' : '✗'}</div>
        </div>

        <div className="border-t border-white/20 pt-2 mt-2">
          <div className="font-semibold text-yellow-400">Layout:</div>
          <div>Bottom Nav: {responsive.showBottomNav ? '✓' : '✗'}</div>
          <div>Side Drawer: {responsive.showSideDrawer ? '✓' : '✗'}</div>
          <div>Sidebar: {responsive.showSidebar ? '✓' : '✗'}</div>
        </div>

        <div className="border-t border-white/20 pt-2 mt-2">
          <div className="font-semibold text-purple-400">Breakpoints:</div>
          <div>sm: {responsive.sm ? '✓' : '✗'}</div>
          <div>md: {responsive.md ? '✓' : '✗'}</div>
          <div>lg: {responsive.lg ? '✓' : '✗'}</div>
          <div>xl: {responsive.xl ? '✓' : '✗'}</div>
          <div>2xl: {responsive['2xl'] ? '✓' : '✗'}</div>
        </div>
      </div>
    </div>
  )
}
