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
              <WalletConnect variant="compact" />
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * DesktopSidebar - Enhanced traditional desktop navigation
 */
function DesktopSidebar({
  currentView,
  onViewChange,
  isArchiveMode = false,
  isCollapsed = false,
  onToggleCollapse
}) {
  const { shouldAnimate, isDesktop } = useResponsiveContext()
  const { jwt } = useAuth()
  const { wallet } = useWallet()
  const isAuthenticated = !!(jwt && wallet)

  return (
    <motion.nav 
      className={`
        ${navigationPatterns.sidebar.container}
        ${isCollapsed ? 'w-16' : 'lg:w-sidebar-lg xl:w-sidebar-xl'}
        ${isArchiveMode ? 'bg-archive-bg border-white text-white' : 'bg-vault-bg border-black text-black'}
        transition-all duration-500 ease-luxury
        shadow-lg backdrop-blur-sm
        ${isCollapsed ? 'shadow-xl' : 'shadow-2xl'}
        desktop-sidebar
      `}
      initial={false}
      animate={{ 
        width: isCollapsed ? 64 : (isDesktop ? 280 : 240),
        boxShadow: isCollapsed 
          ? '0 10px 25px rgba(0, 0, 0, 0.1)' 
          : '0 20px 40px rgba(0, 0, 0, 0.15)'
      }}
      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
    >
      {/* Logo & Toggle - Enhanced */}
      <motion.div
        className={`
          ${isCollapsed ? 'p-4' : 'p-content-lg pb-content'}
          text-left border-b border-current/20 relative cursor-pointer
          transition-all duration-500 ease-luxury
          hover:bg-current/5
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center justify-between">
          <motion.div 
            className={isCollapsed ? 'hidden' : 'block'}
            initial={false}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="font-display text-2xl font-black tracking-tight mb-2">
              Etherith
            </h1>
            <p className="text-xs font-medium tracking-wider uppercase opacity-80">
              Immutable by design
            </p>
          </motion.div>

          {/* Collapsed Logo - Enhanced */}
          {isCollapsed && (
            <motion.div 
              className="w-full text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-display text-xl font-black tracking-tight">
                E
              </h1>
            </motion.div>
          )}

          {/* Toggle Button - Enhanced */}
          {!isCollapsed && (
            <motion.button
              onClick={onToggleCollapse}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-current/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Collapse sidebar"
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

      {/* Navigation Menu - Enhanced */}
      <div className="flex-1 py-content space-y-1">
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            title={isCollapsed ? item.label : undefined}
            className={`
              nav-item w-full text-left ${isCollapsed ? 'px-2 py-3' : 'px-content-lg py-3'}
              ${currentView === item.id ? 'nav-item-active' : ''}
              group relative overflow-hidden
            `}
            whileHover={{ 
              x: currentView === item.id || isCollapsed ? 0 : 8,
              scale: 1.02
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            {/* Hover background effect */}
            <motion.div
              className="absolute inset-0 bg-current/5 rounded-lg"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Content */}
            <div className="relative z-10 flex items-center gap-3">
              {isCollapsed ? (
                <div className="text-center text-xs font-bold w-full">
                  {item.label.charAt(0)}
                </div>
              ) : (
                <>
                  <span className="font-medium text-base tracking-wide">
                    {item.label}
                  </span>
                  {/* Active indicator */}
                  {currentView === item.id && (
                    <motion.div
                      className="w-2 h-2 bg-current rounded-full ml-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    />
                  )}
                </>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Wallet Connect Section - Enhanced */}
      <motion.div 
        className={`
          ${isCollapsed ? 'p-2' : 'p-content-lg'}
          border-t border-current/20 transition-all duration-500 ease-luxury
        `}
        initial={false}
        animate={{ opacity: isCollapsed ? 0.7 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <WalletConnect variant="compact" />
          </motion.div>
        )}
      </motion.div>

      {/* Collapsed Expand Button - Enhanced */}
      {isCollapsed && (
        <motion.div 
          className="p-2 border-t border-current/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <motion.button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center h-10 rounded-lg hover:bg-current/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50"
            whileHover={{ scale: 1.05, rotate: -5 }}
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
              className="rotate-180 transition-transform duration-300"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </motion.button>
        </motion.div>
      )}
    </motion.nav>
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
  onNotificationPress,
  showWalletWidget = true
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
            showWalletWidget={showWalletWidget}
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
            showWalletWidget={showWalletWidget}
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