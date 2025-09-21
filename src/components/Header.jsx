import React from 'react'
import { motion } from 'framer-motion'

export default function Header({ title, subtitle, connectionStatus, syncStatus }) {
  const getSyncStatusClasses = (status) => {
    switch (status) {
      case 'synced':
        return 'animate-pulse-subtle'
      case 'syncing':
      case 'uploading':
        return 'animate-pulse'
      case 'error':
        return 'opacity-30'
      default:
        return 'opacity-70'
    }
  }

  const getSyncStatusText = (status) => {
    switch (status) {
      case 'synced':
        return 'Synced'
      case 'syncing':
      case 'uploading':
        return 'Syncing'
      case 'error':
        return 'Error'
      default:
        return 'Unknown'
    }
  }

  return (
    <header className={`
      h-header px-content border-b border-current flex justify-between items-center
      motion-luxury relative flex-shrink-0
      mobile:h-header-mobile mobile:px-content-mobile tablet:px-content-tablet
      after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px
      after:bg-gradient-to-r after:from-transparent after:via-current after:to-transparent after:opacity-30
    `}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      >
        <h2 className="font-display text-[42px] font-black tracking-tight leading-none m-0 mobile:text-[32px]">
          {title}
        </h2>
        <p className="text-sm font-medium tracking-wider uppercase mt-xs opacity-80">
          {subtitle}
        </p>
      </motion.div>

      <motion.div
        className="flex items-center gap-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: 0.1 }}
      >
        {/* Connection Status */}
        <span className="inline-flex items-center gap-xs text-[10px] font-semibold uppercase tracking-wider opacity-70">
          <span className="w-1 h-1 rounded-full bg-current animate-pulse-subtle"></span>
          <span>{connectionStatus}</span>
        </span>

        {/* Sync Status */}
        <span className="inline-flex items-center gap-xs text-[10px] font-semibold uppercase tracking-wider opacity-70">
          <span className={`w-1 h-1 rounded-full bg-current motion-smooth ${getSyncStatusClasses(syncStatus)}`}></span>
          <span>{getSyncStatusText(syncStatus)}</span>
        </span>
      </motion.div>
    </header>
  )
}