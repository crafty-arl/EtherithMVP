import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, FileText, Link as LinkIcon, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { useResponsiveContext } from '../context/ResponsiveContext'
import { StatusBadge, TypeBadge, VisibilityBadge, Button } from './ui'

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
        memory-card w-full max-w-full
        ${isArchiveMode ? 'bg-archive-card text-archive-text' : ''}
        group relative overflow-hidden
        transition-all duration-500 ease-luxury
        hover:shadow-2xl hover:z-20
        ${hasHover ? 'hover:scale-105' : ''}
      `}
      initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldAnimate ? {
        duration: isMobile ? 0.4 : 0.6,
        delay: Math.min(index * (isMobile ? 0.05 : 0.1), 0.5),
        ease: [0.33, 1, 0.68, 1]
      } : {}}
      whileHover={hasHover && shouldAnimate ? { 
        y: -12, 
        scale: 1.02,
        transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] }
      } : {}}
      whileTap={isTouch ? { scale: 0.98 } : {}}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <TypeBadge type={memory.type} size="sm" />
          {memory.visibility === 'public' && (
            <VisibilityBadge visibility="public" size="sm" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge
            status={memory.status}
            className={`
              text-xs ${getStatusClasses(memory.status)}
              hover:scale-105 motion-smooth
            `}
          />
          {memory.pinned && <span className="text-lg">📌</span>}
        </div>
      </div>

      {/* Memory Note - Enhanced for desktop */}
      <div className="mb-4">
        <blockquote className="text-base leading-relaxed font-normal tracking-tight opacity-90 italic group-hover:opacity-100 transition-opacity duration-300">
          "{memory.note}"
        </blockquote>
      </div>

      {/* Error Display */}
      {memory.error && (
        <StatusBadge
          status="error"
          className="w-full mb-4 p-3 justify-start"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          {memory.error}
        </StatusBadge>
      )}

      {/* Metadata */}
      <div className="mt-4 pt-4 border-t border-current/20">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs opacity-70">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(memory.timestamp).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {formatFileSize(memory.fileSize)}
            </span>
          </div>
          <div className="text-xs font-mono opacity-60">
            {memory.fileName}
          </div>
        </div>
      </div>

      {/* CID Link */}
      {memory.cid && (
        <motion.div
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center font-mono text-xs group-hover:bg-current/10 transition-all duration-300 hover:scale-105"
            asChild
          >
            <a
              href={`https://ipfs.io/ipfs/${memory.cid}`}
              target="_blank"
              rel="noopener noreferrer"
              title="View on IPFS"
              className="focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50 rounded-lg"
            >
              <LinkIcon className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
              <span className="truncate max-w-[120px]">
                {memory.cid.substring(0, 12)}...
              </span>
            </a>
          </Button>

          {memory.proof && memory.proof.pinned && (
            <StatusBadge
              status="uploaded"
              className="w-full mt-2 justify-center"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Permanently preserved
            </StatusBadge>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}