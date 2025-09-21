import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, useWallet } from '@crossmint/client-sdk-react-ui'
import { useEtherith } from './hooks/useEtherith'
import { ResponsiveProvider, useResponsiveContext } from './context/ResponsiveContext'
import AdaptiveNavigation from './components/AdaptiveNavigation'
import VaultView from './components/VaultView'
import UploadView from './components/UploadView'
import ArchiveView from './components/ArchiveView'
import ProfileView from './components/ProfileView'
import SettingsView from './components/SettingsView'
import DebugPanel from './components/DebugPanel'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import WalletFAB from './components/WalletFAB'
import WalletOnboarding from './components/WalletOnboarding'
import { UIShowcase } from './components/enhanced'
import { commonPatterns } from './utils/mobileFirst'
import ViewportDebugger from './components/ViewportDebugger'

const views = {
  vault: { title: 'Vault', subtitle: 'Preserve what matters', component: VaultView },
  upload: { title: 'Preserve', subtitle: 'Every memory, proofed forever', component: UploadView },
  archive: { title: 'Archive', subtitle: 'Safe. Private. Immutable.', component: ArchiveView },
  profile: { title: 'Identity', subtitle: 'Your digital signature', component: ProfileView },
  settings: { title: 'Protocol', subtitle: 'Configure preservation', component: SettingsView },
  showcase: { title: 'UI Demo', subtitle: 'Enhanced component system', component: UIShowcase }
}

/**
 * AppContent - Main application content (inside ResponsiveProvider)
 */
function AppContent() {
  const [currentView, setCurrentView] = useState('vault')
  const [isArchiveMode, setIsArchiveMode] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { showSidebar, showBottomNav, shouldAnimate, isMobile } = useResponsiveContext()

  // Crossmint authentication state
  const { jwt } = useAuth()
  const { wallet } = useWallet()
  const isAuthenticated = !!(jwt && wallet)

  const {
    isInitialized,
    user,
    memories,
    publicMemories,
    connectionStatus,
    syncStatus,
    debugInfo,
    uploadMemory,
    loadMemories,
    loadPublicArchive,
    searchArchive
  } = useEtherith(wallet)

  // Check if onboarding should be shown
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      const hasSeenOnboarding = localStorage.getItem('etherith-onboarding-seen')
      if (!hasSeenOnboarding) {
        // Small delay to let the app initialize
        const timer = setTimeout(() => {
          setShowOnboarding(true)
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [isInitialized, isAuthenticated])

  // Handle view switching
  const switchView = (viewName) => {
    setCurrentView(viewName)
    setIsArchiveMode(viewName === 'archive')

    // Load view-specific data
    if (viewName === 'archive') {
      loadPublicArchive()
    }
  }

  // Listen for custom view switch events
  useEffect(() => {
    const handleViewSwitch = (event) => {
      switchView(event.detail)
    }

    window.addEventListener('switch-view', handleViewSwitch)
    return () => window.removeEventListener('switch-view', handleViewSwitch)
  }, [loadPublicArchive])

  // Get current view data
  const currentViewData = views[currentView] || views.vault
  const ViewComponent = currentViewData.component

  // Enhanced page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -30, scale: 1.02 }
  }

  const pageTransition = {
    type: 'tween',
    ease: [0.33, 1, 0.68, 1], // luxury easing
    duration: 0.8
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen-mobile lg:min-h-screen bg-vault-bg flex items-center justify-center p-content">
        <div className="text-center max-w-sm">
          <motion.div
            className="w-20 h-20 border-4 border-current border-t-transparent rounded-full mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-current mb-3">
            Initializing Etherith...
          </h2>
          <p className="text-base sm:text-lg text-current/70 mb-4">
            Loading memory vault systems
          </p>
          <div className="flex justify-center space-x-1">
            <motion.div
              className="w-2 h-2 bg-current rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-current rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-current rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`
      min-h-screen-mobile lg:min-h-screen transition-all duration-slow ease-luxury
      ${isArchiveMode ? 'archive-mode' : 'bg-vault-bg text-vault-text'}
      ${showSidebar ? 'lg:flex lg:flex-row' : ''}
    `}>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Adaptive Navigation System */}
      <AdaptiveNavigation
        currentView={currentView}
        onViewChange={switchView}
        isArchiveMode={isArchiveMode}
        connectionStatus={connectionStatus}
        onSearchPress={() => console.log('Search pressed')}
        onNotificationPress={() => console.log('Notifications pressed')}
        showWalletWidget={true}
      />

      {/* Main Content Layout - Fixed Desktop Layout */}
      <div className={`
        ${showBottomNav ? 'pb-nav-bar' : ''}
        ${showBottomNav ? 'pt-top-bar' : ''}
        ${showSidebar ? 'lg:flex-1 lg:min-h-screen' : ''}
        transition-all duration-500 ease-luxury
        ${!showSidebar ? commonPatterns.responsiveContainer : 'w-full'}
      `}>

        {/* Main Content Area - Fixed Desktop Layout */}
        <main
          id="main-content"
          className={`
            flex flex-col min-h-screen-safe
            ${showSidebar ? 'lg:flex-1 lg:min-h-screen lg:w-full lg:bg-vault-bg' : ''}
            bg-vault-bg transition-all duration-500 ease-luxury
            ${showSidebar ? 'lg:shadow-inner' : ''}
          `}
          role="main"
          aria-label="Main content area"
        >

          {/* Content Container - Fixed Desktop Centering */}
          <div className={`
            flex-1 p-content sm:p-content-sm md:p-content-md lg:p-content-lg xl:p-content-xl
            ${showSidebar ? 'lg:overflow-y-auto lg:h-screen lg:scrollbar-thin lg:w-full' : ''}
            scrollbar-thin relative max-w-full
            ${!showSidebar ? 'lg:max-w-7xl lg:mx-auto xl:max-w-8xl 2xl:max-w-screen-2xl' : ''}
            ${showSidebar ? 'lg:flex lg:flex-col lg:justify-start lg:items-stretch' : ''}
            transition-all duration-500 ease-luxury
          `}>

            {/* Page Content with Animations */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={shouldAnimate ? "initial" : "in"}
                animate="in"
                exit={shouldAnimate ? "out" : "in"}
                variants={pageVariants}
                transition={shouldAnimate ? pageTransition : { duration: 0 }}
                className="h-full"
              >
                <ViewComponent
                  memories={currentView === 'archive' ? publicMemories : memories}
                  user={user}
                  isAuthenticated={isAuthenticated}
                  onUpload={uploadMemory}
                  onSearch={searchArchive}
                  onRefresh={currentView === 'archive' ? loadPublicArchive : loadMemories}
                  isArchiveMode={isArchiveMode}
                />
              </motion.div>
            </AnimatePresence>

            {/* Debug Panel */}
            <DebugPanel debugInfo={debugInfo} isArchiveMode={isArchiveMode} />
          </div>
        </main>
      </div>

      {/* Mobile Wallet FAB - Provides prominent wallet access */}
      {isMobile && (
        <WalletFAB
          variant="smart"
          position="bottom-right"
          offset="nav-aware"
        />
      )}

      {/* Wallet Onboarding - Auto-shows for new users */}
      <WalletOnboarding
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        autoShow={true}
      />

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Viewport Debugger - Development only */}
      <ViewportDebugger />
    </div>
  )
}

/**
 * App - Main application component with ResponsiveProvider
 */
function App() {
  return (
    <ResponsiveProvider>
      <AppContent />
    </ResponsiveProvider>
  )
}

export default App