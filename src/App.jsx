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
import { commonPatterns } from './utils/mobileFirst'

const views = {
  vault: { title: 'Vault', subtitle: 'Preserve what matters', component: VaultView },
  upload: { title: 'Preserve', subtitle: 'Every memory, proofed forever', component: UploadView },
  archive: { title: 'Archive', subtitle: 'Safe. Private. Immutable.', component: ArchiveView },
  profile: { title: 'Identity', subtitle: 'Your digital signature', component: ProfileView },
  settings: { title: 'Protocol', subtitle: 'Configure preservation', component: SettingsView }
}

/**
 * AppContent - Main application content (inside ResponsiveProvider)
 */
function AppContent() {
  const [currentView, setCurrentView] = useState('vault')
  const [isArchiveMode, setIsArchiveMode] = useState(false)
  const { showSidebar, showBottomNav, shouldAnimate } = useResponsiveContext()

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

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  }

  const pageTransition = {
    type: 'tween',
    ease: [0.33, 1, 0.68, 1], // luxury easing
    duration: 0.6
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen-mobile lg:min-h-screen bg-white flex items-center justify-center p-content">
        <div className="text-center max-w-sm">
          <motion.div
            className="w-16 h-16 border-2 border-black border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-xl sm:text-2xl font-display font-bold text-black mb-2">
            Initializing Etherith...
          </h2>
          <p className="text-sm sm:text-base text-black/70">
            Loading memory vault systems
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`
      min-h-screen-mobile lg:min-h-screen transition-all duration-slow ease-luxury
      ${isArchiveMode ? 'archive-mode' : 'bg-vault-bg text-vault-text'}
    `}>
      {/* Adaptive Navigation System */}
      <AdaptiveNavigation
        currentView={currentView}
        onViewChange={switchView}
        isArchiveMode={isArchiveMode}
        connectionStatus={connectionStatus}
        onSearchPress={() => console.log('Search pressed')}
        onNotificationPress={() => console.log('Notifications pressed')}
      />

      {/* Main Content Layout - Mobile First */}
      <div className={`
        ${commonPatterns.responsiveContainer}
        ${showBottomNav ? 'pb-nav-bar' : ''}
        ${showBottomNav ? 'pt-top-bar' : ''}
        ${showSidebar ? 'lg:grid lg:grid-cols-[var(--sidebar-width)_1fr] lg:pt-0' : ''}
        transition-all duration-300 ease-out
      `}>

        {/* Main Content Area */}
        <main className={`
          flex flex-col min-h-screen-safe
          ${showSidebar ? 'lg:overflow-hidden' : ''}
          bg-vault-bg transition-all duration-slow ease-luxury
        `}>

          {/* Content Container */}
          <div className={`
            flex-1 p-content sm:p-content-sm md:p-content-md lg:p-content-lg
            ${showSidebar ? 'lg:overflow-y-auto lg:h-screen' : ''}
            scrollbar-thin relative
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