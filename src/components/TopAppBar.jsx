import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useResponsiveContext } from '../context/ResponsiveContext'
import { navigationPatterns, touchPatterns } from '../utils/mobileFirst'

/**
 * TopAppBar - Mobile-first top navigation component
 * Provides native mobile app-like header with title and actions
 */

// Action Button Component
function ActionButton({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  variant = 'default',
  className = ""
}) {
  const { isTouch, shouldAnimate } = useResponsiveContext()

  const buttonVariants = {
    idle: { scale: 1, opacity: 0.8 },
    hover: { scale: 1.05, opacity: 1 },
    pressed: { scale: 0.95, opacity: 0.9 },
  }

  return (
    <motion.button
      onClick={onClick}
      className={`
        ${touchPatterns.button.icon}
        ${variant === 'primary' ? 'bg-current text-vault-bg' : ''}
        ${isActive ? 'opacity-100' : 'opacity-70'}
        hover:opacity-100 transition-opacity duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-opacity-50
        ${className}
      `}
      variants={shouldAnimate ? buttonVariants : {}}
      initial="idle"
      whileHover={!isTouch ? "hover" : undefined}
      whileTap="pressed"
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  )
}

// Connection Status Indicator
function ConnectionStatus({ status, className = "" }) {
  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500'
      case 'connecting': return 'bg-yellow-500 animate-pulse'
      case 'disconnected': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Connected'
      case 'connecting': return 'Connecting...'
      case 'disconnected': return 'Disconnected'
      default: return 'Unknown'
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`} role="status" aria-live="polite">
      <div
        className={`w-2 h-2 rounded-full ${getStatusColor()}`}
        aria-hidden="true"
      />
      <span className="text-xs font-medium sr-only sm:not-sr-only">
        {getStatusText()}
      </span>
    </div>
  )
}

// Menu Button (Hamburger)
function MenuButton({ onPress, isOpen = false }) {
  const { shouldAnimate } = useResponsiveContext()

  const lineVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 0, y: 0 },
  }

  const topLineVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 6 },
  }

  const bottomLineVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -45, y: -6 },
  }

  const middleLineVariants = {
    closed: { opacity: 1 },
    open: { opacity: 0 },
  }

  return (
    <ActionButton
      icon={() => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <motion.line
            x1="3" y1="6" x2="17" y2="6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            variants={shouldAnimate ? topLineVariants : {}}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          />
          <motion.line
            x1="3" y1="10" x2="17" y2="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            variants={shouldAnimate ? middleLineVariants : {}}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          />
          <motion.line
            x1="3" y1="14" x2="17" y2="14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            variants={shouldAnimate ? bottomLineVariants : {}}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          />
        </svg>
      )}
      onClick={onPress}
      label={isOpen ? "Close menu" : "Open menu"}
    />
  )
}

// Search Button
function SearchButton({ onPress, isActive = false }) {
  return (
    <ActionButton
      icon={() => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <circle cx="9" cy="9" r="7" strokeWidth="2"/>
          <path d="m13 13 7 7" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )}
      onClick={onPress}
      label="Search memories"
      isActive={isActive}
    />
  )
}

// Notification Button
function NotificationButton({ onPress, hasNotifications = false, count = 0 }) {
  return (
    <div className="relative">
      <ActionButton
        icon={() => (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="2"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2"/>
          </svg>
        )}
        onClick={onPress}
        label={`Notifications${hasNotifications ? ` (${count})` : ''}`}
        isActive={hasNotifications}
      />
      {hasNotifications && (
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          aria-label={`${count} unread notifications`}
        >
          {count > 9 ? '9+' : count}
        </motion.div>
      )}
    </div>
  )
}

/**
 * TopAppBar Main Component
 */
export default function TopAppBar({
  title = "Etherith",
  subtitle = "",
  connectionStatus = 'connected',
  onMenuPress,
  onSearchPress,
  onNotificationPress,
  showBackButton = false,
  onBackPress,
  actions = [],
  isArchiveMode = false,
  className = "",
  children
}) {
  const { showBottomNav, shouldAnimate } = useResponsiveContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasNotifications, setHasNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  // Don't render on larger screens where sidebar is shown
  if (!showBottomNav) {
    return null
  }

  const handleMenuPress = () => {
    setIsMenuOpen(!isMenuOpen)
    onMenuPress?.(!isMenuOpen)
  }

  const containerVariants = {
    hidden: { y: -60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  const titleVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.1, duration: 0.3 }
    }
  }

  return (
    <motion.header
      className={`
        ${navigationPatterns.topBar.container}
        ${isArchiveMode ? 'bg-archive-bg border-white text-white' : 'bg-vault-bg border-black text-black'}
        backdrop-blur-lg bg-opacity-95
        ${className}
      `}
      variants={shouldAnimate ? containerVariants : {}}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      role="banner"
    >
      {/* Safe area padding for devices with notches */}
      <div className="pt-safe-area">
        <div className={navigationPatterns.topBar.container.replace('lg:hidden', '')}>
          {/* Left Section */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {showBackButton ? (
              <ActionButton
                icon={() => (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                onClick={onBackPress}
                label="Go back"
              />
            ) : (
              <MenuButton onPress={handleMenuPress} isOpen={isMenuOpen} />
            )}

            {/* Title Section */}
            <motion.div
              className="flex-1 min-w-0"
              variants={shouldAnimate ? titleVariants : {}}
            >
              <h1 className={`${navigationPatterns.topBar.title} ${isArchiveMode ? 'text-white' : 'text-black'}`}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs opacity-70 truncate">
                  {subtitle}
                </p>
              )}
            </motion.div>
          </div>

          {/* Right Section */}
          <div className={`${navigationPatterns.topBar.actions} ${isArchiveMode ? 'text-white' : 'text-black'}`}>
            {/* Connection Status */}
            <ConnectionStatus status={connectionStatus} />

            {/* Action Buttons */}
            <SearchButton onPress={onSearchPress} />
            <NotificationButton
              onPress={onNotificationPress}
              hasNotifications={hasNotifications}
              count={notificationCount}
            />

            {/* Custom Actions */}
            {actions.map((action, index) => (
              <ActionButton
                key={index}
                icon={action.icon}
                onClick={action.onClick}
                label={action.label}
                variant={action.variant}
                isActive={action.isActive}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Optional children (like search bar, filters, etc.) */}
      <AnimatePresence>
        {children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-current/10 px-content py-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

/**
 * Hooks for managing TopAppBar state
 */

// Hook for managing notifications
export function useTopAppBarNotifications() {
  const [notifications, setNotifications] = useState([])

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }])
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return {
    notifications,
    count: notifications.length,
    hasNotifications: notifications.length > 0,
    addNotification,
    removeNotification,
    clearAllNotifications,
  }
}

// Hook for managing top app bar visibility during scroll
export function useTopAppBarScroll(threshold = 50) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < threshold) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY - threshold) {
        // Scrolling up
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, threshold])

  return isVisible
}