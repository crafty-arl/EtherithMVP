import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEtherith } from './hooks/useEtherith'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import VaultView from './components/VaultView'
import UploadView from './components/UploadView'
import ArchiveView from './components/ArchiveView'
import ProfileView from './components/ProfileView'
import SettingsView from './components/SettingsView'
import DebugPanel from './components/DebugPanel'

const views = {
  vault: { title: 'Vault', subtitle: 'Preserve what matters', component: VaultView },
  upload: { title: 'Preserve', subtitle: 'Every memory, proofed forever', component: UploadView },
  archive: { title: 'Archive', subtitle: 'Safe. Private. Immutable.', component: ArchiveView },
  profile: { title: 'Identity', subtitle: 'Your digital signature', component: ProfileView },
  settings: { title: 'Protocol', subtitle: 'Configure preservation', component: SettingsView }
}

function App() {
  const [currentView, setCurrentView] = useState('vault')
  const [isArchiveMode, setIsArchiveMode] = useState(false)

  const {
    isInitialized,
    user,
    memories,
    publicMemories,
    connectionStatus,
    syncStatus,
    debugInfo,
    isAuthenticated,
    loginWithDiscord,
    logout,
    uploadMemory,
    loadMemories,
    loadPublicArchive,
    searchArchive
  } = useEtherith()

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-display font-bold text-black">Initializing Etherith...</h2>
          <p className="text-sm text-black/70 mt-2">Loading memory vault systems</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-slow ease-luxury ${
      isArchiveMode ? 'archive-mode' : 'bg-vault-bg text-vault-text'
    }`}>
      <div className="grid grid-cols-[220px_1fr] h-screen w-screen overflow-hidden fixed top-0 left-0 mobile:grid-cols-1 mobile:grid-rows-[60px_1fr]">

        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onViewChange={switchView}
          user={user}
          isAuthenticated={isAuthenticated}
          onLogin={loginWithDiscord}
          onLogout={logout}
          isArchiveMode={isArchiveMode}
        />

        {/* Main Content Area */}
        <main className="flex flex-col overflow-hidden bg-vault-bg transition-all duration-slow ease-luxury">
          <Header
            title={currentViewData.title}
            subtitle={currentViewData.subtitle}
            connectionStatus={connectionStatus}
            syncStatus={syncStatus}
          />

          <div className="flex-1 p-content overflow-y-auto scrollbar-thin relative h-[calc(100vh-80px)] mobile:h-[calc(100vh-60px-70px)] mobile:p-content-mobile tablet:p-content-tablet">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
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

export default App