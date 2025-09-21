import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react'

export default function DebugPanel({ debugInfo, isArchiveMode }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDebugInfo = (info) => {
    if (typeof info === 'string') {
      return info
    }
    return JSON.stringify(info, null, 2)
  }

  return (
    <motion.div
      className={`
        bg-transparent border border-current rounded-lg mt-3xl motion-luxury
        ${isArchiveMode ? 'border-white' : ''}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-xl flex items-center justify-between text-left motion-luxury hover:bg-current/5"
        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
      >
        <h3 className="font-display text-base font-bold tracking-tight flex items-center gap-3">
          <Terminal className="w-5 h-5" />
          System Status
        </h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Debug Info */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-hidden"
          >
            <div className="px-xl pb-xl">
              <pre className={`
                bg-black text-white p-md rounded-lg overflow-x-auto text-[11px]
                font-body leading-relaxed motion-luxury
                ${isArchiveMode ? 'bg-white text-black' : ''}
              `}>
                {formatDebugInfo(debugInfo)}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}