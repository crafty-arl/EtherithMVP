import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, useWallet } from '@crossmint/client-sdk-react-ui'
import { useResponsiveContext } from '../context/ResponsiveContext'
import { navigationPatterns, touchPatterns } from '../utils/mobileFirst'
import { WalletConnect } from './WalletConnect'
import BottomTabBar from './BottomTabBar'
import TopAppBar from './TopAppBar'

/**
 * AdaptiveNavigation - Mobile-first responsive navigation system
 * Provides different navigation patterns based on screen size:
 * - Mobile: BottomTabBar + TopAppBar
 * - Tablet: Side Drawer + TopAppBar
 * - Desktop: Traditional Sidebar
 */

const navItems = [
  { id: 'vault', label: 'Vault' },
  { id: 'upload', label: 'Preserve' },
  { id: 'archive', label: 'Archive' },
  { id: 'profile', label: 'Identity' },
  { id: 'settings', label: 'Protocol' }
]

/**
 * SideDrawer - Tablet navigation component
 */
function SideDrawer({
  isOpen,
  onClose,
  currentView,
  onViewChange,
  isArchiveMode = false
}) {
  const { shouldAnimate } = useResponsiveContext()
  const { jwt } = useAuth()
  const { wallet } = useWallet()
  const isAuthenticated = !!(jwt && wallet)

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const drawerVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0 }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className={navigationPatterns.sideDrawer.overlay}
            variants={shouldAnimate ? overlayVariants : {}}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.nav
            className={`
              ${navigationPatterns.sideDrawer.drawer}
              ${isArchiveMode ? 'bg-archive-bg border-white text-white' : 'bg-vault-bg border-black text-black'}
            `}
            variants={shouldAnimate ? drawerVariants : {}}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="p-content-sm border-b border-current/20">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-xl font-black tracking-tight">
                    Etherith
                  </h1>
                  <p className="text-xs font-medium tracking-wider uppercase opacity-80">
                    Immutable by design
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={touchPatterns.button.icon}
                  aria-label="Close navigation"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M15 5L5 15M5 5l10 10" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 py-content-sm">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id)
                    onClose()
                  }}
                  className={`
                    w-full text-left px-content-sm py-3 font-medium text-base tracking-tight
                    transition-all duration-200 relative border-l-[3px] border-transparent
                    ${currentView === item.id
                      ? 'opacity-100 font-semibold border-current bg-current/5'
                      : 'opacity-70 hover:opacity-100 hover:bg-current/5'
                    }
                  `}
                  whileHover={{ x: 8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* Wallet Connect */}
            <div className="p-content-sm border-t border-current/20">
              <WalletConnect />
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * DesktopSidebar - Traditional desktop navigation
 */
function DesktopSidebar({
  currentView,
  onViewChange,
  isArchiveMode = false,
  isCollapsed = false,
  onToggleCollapse
}) {
  const { shouldAnimate } = useResponsiveContext()
  const { jwt } = useAuth()
  const { wallet } = useWallet()
  const isAuthenticated = !!(jwt && wallet)

  return (
    <nav className={`
      ${navigationPatterns.sidebar.container}
      ${isCollapsed ? 'w-16' : 'lg:w-sidebar-lg xl:w-sidebar-xl'}
      ${isArchiveMode ? 'bg-archive-bg border-white text-white' : 'bg-vault-bg border-black text-black'}
      transition-all duration-300 ease-out
    `}>
      {/* Logo & Toggle */}
      <motion.div
        className={`
          ${isCollapsed ? 'p-4' : 'p-content-lg pb-content'}
          text-left border-b border-current/20 relative cursor-pointer
          transition-all duration-300 ease-out
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between">
          <div className={isCollapsed ? 'hidden' : 'block'}>
            <h1 className="font-display text-2xl font-black tracking-tight mb-2">
              Etherith
            </h1>
            <p className="text-xs font-medium tracking-wider uppercase opacity-80">
              Immutable by design
            </p>
          </div>

          {/* Collapsed Logo */}
          {isCollapsed && (
            <div className="w-full text-center">
              <h1 className="font-display text-xl font-black tracking-tight">
                E
              </h1>
            </div>
          )}

          {/* Toggle Button */}
          {!isCollapsed && (
            <motion.button
              onClick={onToggleCollapse}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-current/10 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle sidebar"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Navigation Menu */}
      <div className="flex-1 py-content">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            title={isCollapsed ? item.label : undefined}
            className={`
              w-full text-left ${isCollapsed ? 'px-2 py-3' : 'px-content-lg py-3'}
              font-medium text-base tracking-tight transition-all duration-200
              relative border-l-[3px] border-transparent
              ${currentView === item.id
                ? 'opacity-100 font-semibold border-current bg-current/5'
                : 'opacity-70 hover:opacity-100 hover:bg-current/5'
              }
            `}
            whileHover={{ x: currentView === item.id || isCollapsed ? 0 : 8 }}
            whileTap={{ scale: 0.98 }}
          >
            {isCollapsed ? (
              <div className="text-center text-xs font-bold">
                {item.label.charAt(0)}
              </div>
            ) : (
              item.label
            )}
          </motion.button>
        ))}
      </div>

      {/* Wallet Connect Section */}
      <div className={`
        ${isCollapsed ? 'p-2' : 'p-content-lg'}
        border-t border-current/20 transition-all duration-300 ease-out
      `}>
        {!isCollapsed && <WalletConnect />}
      </div>

      {/* Collapsed Expand Button */}
      {isCollapsed && (
        <div className="p-2 border-t border-current/20">
          <motion.button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center h-10 rounded-lg hover:bg-current/10 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Expand sidebar"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-180"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </motion.button>
        </div>
      )}
    </nav>
  )
}

/**
 * AdaptiveNavigation Main Component
 */
export default function AdaptiveNavigation({
  currentView,
  onViewChange,
  isArchiveMode = false,
  connectionStatus = 'connected',
  onSearchPress,
  onNotificationPress
}) {
  const {
    showBottomNav,
    showSideDrawer,
    showSidebar,
    isMobile,
    isTablet,
    isDesktop
  } = useResponsiveContext()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleMenuPress = (isOpen) => {
    setIsDrawerOpen(isOpen)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
  }

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  // Get current view title and subtitle
  const getCurrentViewInfo = () => {
    const viewInfo = {
      vault: { title: 'Memory Vault', subtitle: 'Your preserved memories' },
      upload: { title: 'Preserve', subtitle: 'Save memories forever' },
      archive: { title: 'Public Archive', subtitle: 'Explore community memories' },
      profile: { title: 'Identity', subtitle: 'Your digital identity' },
      settings: { title: 'Protocol', subtitle: 'Configure settings' }
    }
    return viewInfo[currentView] || { title: 'Etherith', subtitle: '' }
  }

  const { title, subtitle } = getCurrentViewInfo()

  return (
    <>
      {/* Mobile Navigation: TopAppBar + BottomTabBar */}
      {showBottomNav && (
        <>
          <TopAppBar
            title={title}
            subtitle={subtitle}
            connectionStatus={connectionStatus}
            onSearchPress={onSearchPress}
            onNotificationPress={onNotificationPress}
            isArchiveMode={isArchiveMode}
          />
          <BottomTabBar
            currentView={currentView}
            onViewChange={onViewChange}
            isArchiveMode={isArchiveMode}
          />
        </>
      )}

      {/* Tablet Navigation: TopAppBar + SideDrawer */}
      {showSideDrawer && (
        <>
          <TopAppBar
            title={title}
            subtitle={subtitle}
            connectionStatus={connectionStatus}
            onMenuPress={handleMenuPress}
            onSearchPress={onSearchPress}
            onNotificationPress={onNotificationPress}
            isArchiveMode={isArchiveMode}
          />
          <SideDrawer
            isOpen={isDrawerOpen}
            onClose={handleDrawerClose}
            currentView={currentView}
            onViewChange={onViewChange}
            isArchiveMode={isArchiveMode}
          />
        </>
      )}

      {/* Desktop Navigation: Traditional Sidebar */}
      {showSidebar && (
        <DesktopSidebar
          currentView={currentView}
          onViewChange={onViewChange}
          isArchiveMode={isArchiveMode}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      )}
    </>
  )
}

/**
 * Hook for managing adaptive navigation state
 */
export function useAdaptiveNavigation() {
  const { showBottomNav, showSideDrawer, showSidebar } = useResponsiveContext()

  return {
    isMobileNavigation: showBottomNav,
    isTabletNavigation: showSideDrawer,
    isDesktopNavigation: showSidebar,
    navigationMode: showBottomNav ? 'mobile' : showSideDrawer ? 'tablet' : 'desktop'
  }
}