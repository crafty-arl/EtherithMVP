import React from 'react'
import { motion } from 'framer-motion'
import { Upload, Calendar, FileText, Link as LinkIcon } from 'lucide-react'
import MemoryCard from './MemoryCard'
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
        className="flex items-center justify-center min-h-[60vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      >
        <div className="text-center opacity-70 max-w-md">
          <motion.div
            className="text-6xl mb-8 opacity-50"
            animate={shouldAnimate ? { y: [-5, 5, -5] } : {}}
            transition={shouldAnimate ? {
              duration: isMobile ? 6 : 4,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          >
            ⬆
          </motion.div>
          <h3 className="font-display text-3xl font-bold mb-4 tracking-tight">
            Your vault awaits
          </h3>
          <p className="text-base opacity-80 mb-2">
            Preserve your first memory to begin
          </p>
          <p className="text-sm opacity-60">
            <small>Every memory, proofed forever</small>
          </p>
          <motion.button
            onClick={() => window.dispatchEvent(new CustomEvent('switch-view', { detail: 'upload' }))}
            className={`
              mt-10 px-6 py-3 min-h-touch min-w-touch border border-current rounded-xl cursor-pointer font-semibold
              text-sm tracking-wider uppercase bg-transparent motion-luxury btn-hover
              hover:bg-current hover:text-vault-bg active:scale-95
              ${isArchiveMode ? 'hover:text-archive-bg' : ''}
            `}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Begin Preserving
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="space-y-xl"
      initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={shouldAnimate ? {
        duration: isMobile ? 0.4 : 0.6
      } : {}}
    >
      {/* Grid Container */}
      <div className={`
        grid grid-cols-1 gap-card justify-center mt-xl
        sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] sm:gap-card-sm sm:justify-start
        lg:grid-cols-[repeat(auto-fill,280px)] lg:gap-card-md
      `}>
        {memories.map((memory, index) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
            index={index}
            isArchiveMode={isArchiveMode}
            formatFileSize={formatFileSize}
          />
        ))}
      </div>
    </motion.div>
  )
}