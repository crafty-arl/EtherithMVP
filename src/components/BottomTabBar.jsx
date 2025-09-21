import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useResponsiveContext } from '../context/ResponsiveContext'
import { navigationPatterns, touchPatterns } from '../utils/mobileFirst'

/**
 * BottomTabBar - Mobile-first navigation component
 * Provides native mobile app-like bottom navigation
 */

const navItems = [
  {
    id: 'vault',
    label: 'Vault',
    icon: VaultIcon,
    ariaLabel: 'Navigate to Memory Vault'
  },
  {
    id: 'upload',
    label: 'Preserve',
    icon: UploadIcon,
    ariaLabel: 'Upload and preserve memories'
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: ArchiveIcon,
    ariaLabel: 'Browse public archive'
  },
  {
    id: 'profile',
    label: 'Identity',
    icon: ProfileIcon,
    ariaLabel: 'Manage your identity'
  },
  {
    id: 'settings',
    label: 'Protocol',
    icon: SettingsIcon,
    ariaLabel: 'Configure protocol settings'
  },
  {
    id: 'showcase',
    label: 'Demo',
    icon: ShowcaseIcon,
    ariaLabel: 'View UI showcase demo'
  }
]

// Icon Components - Mobile-optimized SVG icons
function VaultIcon({ isActive, className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={isActive ? "2.5" : "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10,9 9,9 8,9"/>
    </svg>
  )
}

function UploadIcon({ isActive, className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={isActive ? "2.5" : "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7,10 12,5 17,10"/>
      <line x1="12" y1="5" x2="12" y2="15"/>
    </svg>
  )
}

function ArchiveIcon({ isActive, className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={isActive ? "2.5" : "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="21,8 21,21 3,21 3,8"/>
      <rect x="1" y="3" width="22" height="5"/>
      <line x1="10" y1="12" x2="14" y2="12"/>
    </svg>
  )
}

function ProfileIcon({ isActive, className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={isActive ? "2.5" : "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function SettingsIcon({ isActive, className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={isActive ? "2.5" : "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v6m0 6v6"/>
      <path d="M23 12h-6m-6 0H1"/>
      <path d="M19.5 7.5L14 13l6-6z"/>
      <path d="M4.5 16.5L10 11l-6 6z"/>
    </svg>
  )
}

function ShowcaseIcon({ isActive, className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={isActive ? "2.5" : "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="3"/>
      <line x1="15" y1="1" x2="15" y2="3"/>
      <line x1="9" y1="21" x2="9" y2="23"/>
      <line x1="15" y1="21" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="22" y2="9"/>
      <line x1="20" y1="14" x2="22" y2="14"/>
      <line x1="1" y1="9" x2="3" y2="9"/>
      <line x1="1" y1="14" x2="3" y2="14"/>
    </svg>
  )
}

/**
 * TabButton - Individual tab button component
 */
function TabButton({
  item,
  isActive,
  onPress,
  isArchiveMode = false,
  shouldAnimate = true
}) {
  const { isTouch } = useResponsiveContext()
  const Icon = item.icon

  const handlePress = () => {
    // Haptic feedback for supported devices
    if (window.navigator?.vibrate) {
      window.navigator.vibrate(10)
    }
    onPress(item.id)
  }

  const tabVariants = {
    idle: {
      scale: 1,
      y: 0,
    },
    pressed: {
      scale: 0.95,
      y: 1,
    },
    active: {
      scale: 1,
      y: -2,
    }
  }

  const iconVariants = {
    idle: { scale: 1, opacity: 0.6 },
    active: { scale: 1.1, opacity: 1 },
  }

  const labelVariants = {
    idle: { opacity: 0.6, y: 0 },
    active: { opacity: 1, y: -1 },
  }

  return (
    <motion.button
      onClick={handlePress}
      onTap={handlePress}
      className={`
        ${navigationPatterns.bottomNav.item}
        relative outline-none focus:outline-none focus-visible:ring-4 focus-visible:ring-current focus-visible:ring-opacity-50 rounded-lg
        transition-all duration-200 motion-smooth min-h-touch min-w-touch
        ${isActive ? 'text-current scale-105' : 'text-current/70 hover:text-current hover:scale-105'}
        ${isArchiveMode ? 'text-white' : 'text-black'}
        hover:bg-current/10
      `}
      variants={shouldAnimate ? tabVariants : {}}
      initial="idle"
      animate={isActive ? "active" : "idle"}
      whileTap={isTouch ? "pressed" : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      aria-label={item.ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      id={`nav-tab-${item.id}`}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute -top-1 left-1/2 w-2 h-2 bg-current rounded-full"
          initial={{ scale: 0, x: "-50%" }}
          animate={{ scale: 1, x: "-50%" }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        />
      )}

      {/* Icon */}
      <motion.div
        variants={shouldAnimate ? iconVariants : {}}
        initial="idle"
        animate={isActive ? "active" : "idle"}
        transition={{ duration: 0.2 }}
      >
        <Icon isActive={isActive} className="w-6 h-6" />
      </motion.div>

      {/* Label */}
      <motion.span
        className={navigationPatterns.bottomNav.label}
        variants={shouldAnimate ? labelVariants : {}}
        initial="idle"
        animate={isActive ? "active" : "idle"}
        transition={{ duration: 0.2 }}
      >
        {item.label}
      </motion.span>
    </motion.button>
  )
}

/**
 * BottomTabBar Main Component
 */
export default function BottomTabBar({
  currentView,
  onViewChange,
  isArchiveMode = false,
  className = ""
}) {
  const { shouldAnimate, showBottomNav } = useResponsiveContext()
  const navRef = useRef(null)

  // Don't render on larger screens
  if (!showBottomNav) {
    return null
  }

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!navRef.current?.contains(event.target)) return

      const currentIndex = navItems.findIndex(item => item.id === currentView)
      let newIndex = currentIndex

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          newIndex = currentIndex > 0 ? currentIndex - 1 : navItems.length - 1
          break
        case 'ArrowRight':
          event.preventDefault()
          newIndex = currentIndex < navItems.length - 1 ? currentIndex + 1 : 0
          break
        case 'Home':
          event.preventDefault()
          newIndex = 0
          break
        case 'End':
          event.preventDefault()
          newIndex = navItems.length - 1
          break
        default:
          return
      }

      if (newIndex !== currentIndex) {
        onViewChange(navItems[newIndex].id)
        // Focus the new active tab
        setTimeout(() => {
          const newActiveButton = navRef.current?.querySelector(`[aria-selected="true"]`)
          newActiveButton?.focus()
        }, 50)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentView, onViewChange])

  const containerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05
      }
    }
  }

  return (
    <motion.nav
      ref={navRef}
      className={`
        ${navigationPatterns.bottomNav.container}
        ${isArchiveMode ? 'bg-archive-bg border-white' : 'bg-vault-bg border-black'}
        backdrop-blur-lg bg-opacity-95
        ${className}
      `}
      variants={shouldAnimate ? containerVariants : {}}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      role="tablist"
      aria-label="Main navigation"
      aria-describedby="nav-instructions"
    >
      {/* Safe area padding for devices with home indicator */}
      <div className="pb-safe-area">
        <div className={navigationPatterns.bottomNav.list}>
          {navItems.map((item) => (
            <TabButton
              key={item.id}
              item={item}
              isActive={currentView === item.id}
              onPress={onViewChange}
              isArchiveMode={isArchiveMode}
              shouldAnimate={shouldAnimate}
            />
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

/**
 * Hook for managing bottom tab bar state
 * Provides additional functionality like badges, notifications, etc.
 */
export function useBottomTabBar() {
  const { showBottomNav } = useResponsiveContext()

  const showBadge = (tabId, count = 1) => {
    // Implementation for showing notification badges
    console.log(`Show badge on ${tabId}: ${count}`)
  }

  const hideBadge = (tabId) => {
    // Implementation for hiding notification badges
    console.log(`Hide badge on ${tabId}`)
  }

  return {
    isVisible: showBottomNav,
    showBadge,
    hideBadge,
  }
}