import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, FileText, Link as LinkIcon, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { useResponsiveContext } from '../context/ResponsiveContext'

export default function MemoryCard({ memory, index, isArchiveMode, formatFileSize }) {
  const { shouldAnimate, isMobile, isTouch, hasHover } = useResponsiveContext()

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return <Clock className="w-3 h-3" />
      case 'uploaded':
      case 'pinned':
      case 'moderated':
        return <CheckCircle className="w-3 h-3" />
      case 'error':
      case 'rejected':
        return <AlertCircle className="w-3 h-3" />
      default:
        return <FileText className="w-3 h-3" />
    }
  }

  const getStatusClasses = (status) => {
    switch (status) {
      case 'uploading':
        return 'opacity-80 animate-pulse'
      case 'uploaded':
      case 'pinned':
      case 'moderated':
        return 'opacity-100'
      case 'error':
      case 'rejected':
        return 'opacity-70'
      default:
        return 'opacity-60'
    }
  }

  return (
    <motion.div
      className={`
        w-full max-w-full p-lg bg-vault-card rounded-lg border border-current motion-luxury
        relative overflow-hidden cursor-pointer hover-lift-strong
        sm:w-card-sm sm:p-xl
        lg:w-card-md
        ${isArchiveMode ? 'bg-archive-card text-archive-text' : ''}
        before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5
        before:bg-current before:scale-x-0 before:origin-left before:transition-transform
        before:duration-medium before:ease-luxury hover:before:scale-x-100
      `}
      initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldAnimate ? {
        duration: isMobile ? 0.4 : 0.6,
        delay: Math.min(index * (isMobile ? 0.05 : 0.1), 0.5),
        ease: [0.33, 1, 0.68, 1]
      } : {}}
      whileHover={hasHover && shouldAnimate ? { y: -12, scale: 1.02 } : {}}
      whileTap={isTouch ? { scale: 0.98 } : {}}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-md">
        <span className={`
          bg-transparent text-current border border-current px-sm py-xs rounded-xl
          text-[10px] font-semibold uppercase tracking-wider opacity-80
        `}>
          {memory.type}
        </span>

        <span className={`
          text-[10px] px-sm py-xs rounded-xl font-semibold uppercase tracking-wider
          border border-current bg-transparent relative overflow-hidden
          ${getStatusClasses(memory.status)}
          before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0
          before:bg-current before:opacity-10 before:transition-opacity before:duration-fast
          hover:before:opacity-20
        `}>
          <span className="flex items-center gap-1">
            {getStatusIcon(memory.status)}
            {memory.status}{memory.pinned ? ' 📌' : ''}
          </span>
        </span>
      </div>

      {/* Memory Note */}
      <div className={`
        my-md text-base leading-relaxed font-normal tracking-tight opacity-90
        before:content-['"'] before:text-xl before:opacity-40
        after:content-['"'] after:text-xl after:opacity-40
      `}>
        {memory.note}
      </div>

      {/* Error Display */}
      {memory.error && (
        <div className="my-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-600 dark:text-red-400">
          ❌ {memory.error}
        </div>
      )}

      {/* Metadata */}
      <div className={`
        flex justify-between items-center mt-lg pt-md border-t border-current
        text-[11px] opacity-70 uppercase tracking-wider font-medium
      `}>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(memory.timestamp).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {memory.fileName} ({formatFileSize(memory.fileSize)})
        </span>
      </div>

      {/* CID Link */}
      {memory.cid && (
        <motion.div
          className="mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <a
            href={`https://ipfs.io/ipfs/${memory.cid}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              inline-flex items-center gap-1 text-current no-underline font-mono text-[11px]
              font-semibold tracking-wider py-1.5 px-3 min-h-touch min-w-touch border border-current rounded
              motion-smooth hover:bg-current hover:text-vault-card hover:-translate-y-px
              active:scale-95 justify-center
              ${isArchiveMode ? 'hover:text-archive-card' : ''}
            `}
            title="View on IPFS"
          >
            <LinkIcon className="w-3 h-3" />
            {memory.cid.substring(0, 12)}...
          </a>

          {memory.proof && memory.proof.pinned && (
            <div className="text-[10px] text-green-600 dark:text-green-400 mt-1">
              Permanently preserved
            </div>
          )}
        </motion.div>
      )}

      {/* Visibility Indicator */}
      <div className="mt-2 text-[10px] opacity-60 uppercase tracking-widest">
        {memory.visibility === 'public' ? 'Public Memory' : 'Private Memory'}
      </div>
    </motion.div>
  )
}