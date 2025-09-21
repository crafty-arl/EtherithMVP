import React from 'react'
import { motion } from 'framer-motion'
import { Upload, Calendar, FileText, Link as LinkIcon } from 'lucide-react'
import MemoryCard from './MemoryCard'
import { Button } from './ui'
import { useResponsiveContext } from '../context/ResponsiveContext'

export default function VaultView({ memories, onRefresh, isArchiveMode }) {
  const { shouldAnimate, isMobile, prefersReducedMotion } = useResponsiveContext()

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (memories.length === 0) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-[60vh] p-8 w-full max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      >
        <div className="text-center max-w-md">
          <motion.div
            className="text-8xl mb-8 opacity-50"
            animate={shouldAnimate ? { y: [-5, 5, -5] } : {}}
            transition={shouldAnimate ? {
              duration: isMobile ? 6 : 4,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          >
            ⬆
          </motion.div>
          <h3 className="font-display text-4xl font-bold mb-4 tracking-tight">
            Your vault awaits
          </h3>
          <p className="text-lg opacity-80 mb-2">
            Preserve your first memory to begin
          </p>
          <p className="text-sm opacity-60 mb-8">
            Every memory, proofed forever
          </p>
          <Button
            onClick={() => window.dispatchEvent(new CustomEvent('switch-view', { detail: 'upload' }))}
            size="lg"
            className="px-8 py-4 text-lg"
            asChild
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Begin Preserving
            </motion.button>
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="space-y-8 w-full"
      initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={shouldAnimate ? {
        duration: isMobile ? 0.4 : 0.6
      } : {}}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-bold mb-2 tracking-tight">
          Memory Vault
        </h2>
        <p className="text-lg opacity-70">
          {memories.length} {memories.length === 1 ? 'memory' : 'memories'} preserved
        </p>
      </div>

      {/* Grid Container - Fixed Desktop Layout */}
      <div
        className={`
          grid gap-6 w-full
          grid-cols-1 max-w-sm mx-auto justify-items-center
          sm:grid-cols-2 sm:gap-6 sm:max-w-2xl sm:justify-items-stretch
          md:grid-cols-3 md:gap-8 md:max-w-4xl
          lg:grid-cols-4 lg:gap-8 lg:max-w-6xl lg:justify-items-stretch
          xl:grid-cols-5 xl:gap-10 xl:max-w-7xl xl:justify-items-stretch
          2xl:grid-cols-6 2xl:gap-12 2xl:max-w-screen-2xl 2xl:justify-items-stretch
          transition-all duration-500 ease-luxury
        `}
        role="grid"
        aria-label={`Memory vault containing ${memories.length} ${memories.length === 1 ? 'memory' : 'memories'}`}
      >
        {memories.map((memory, index) => (
          <div key={memory.id} role="gridcell">
            <MemoryCard
              memory={memory}
              index={index}
              isArchiveMode={isArchiveMode}
              formatFileSize={formatFileSize}
            />
          </div>
        ))}
      </div>
    </motion.div>
  )
}