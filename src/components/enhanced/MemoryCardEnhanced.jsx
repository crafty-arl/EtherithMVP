import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, FileText, Link as LinkIcon } from 'lucide-react'
import { useResponsiveContext } from '../../context/ResponsiveContext'
import {
  MemoryCard,
  CardContent,
  CardFooter,
  StatusBadge,
  TypeBadge,
  VisibilityBadge,
  Button,
  Separator
} from '../ui'

/**
 * Enhanced Memory Card Component
 *
 * Upgraded version using shadcn/ui components while maintaining:
 * - All existing functionality
 * - Monochrome design system
 * - Accessibility features
 * - Responsive behavior
 * - Animation patterns
 */
export default function MemoryCardEnhanced({ memory, index, isArchiveMode, formatFileSize }) {
  const { shouldAnimate, isMobile, isTouch, hasHover } = useResponsiveContext()

  const getStatusClasses = (status) => {
    switch (status) {
      case 'uploading':
        return 'opacity-80'
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
      className={`w-full max-w-full ${getStatusClasses(memory.status)}`}
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
      <MemoryCard className={isArchiveMode ? 'bg-archive-card text-archive-text' : ''}>
        <CardContent className="p-6">
          {/* Header with badges */}
          <div className="flex justify-between items-start mb-4 gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadge type={memory.type} />
              {memory.visibility === 'public' && (
                <VisibilityBadge visibility="public" />
              )}
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge
                status={memory.status}
                className={`
                  ${getStatusClasses(memory.status)}
                  hover:scale-105 motion-smooth
                `}
              />
              {memory.pinned && (
                <div className="text-lg" role="img" aria-label="Pinned">
                  📌
                </div>
              )}
            </div>
          </div>

          {/* Memory Note */}
          <div className="mb-4">
            <blockquote className="text-base leading-relaxed font-normal tracking-tight opacity-90 italic">
              "{memory.note}"
            </blockquote>
          </div>

          {/* Error Display */}
          {memory.error && (
            <StatusBadge
              status="error"
              className="w-full mb-4 p-3 justify-start"
            >
              {memory.error}
            </StatusBadge>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-2 flex-col space-y-4">
          {/* Metadata */}
          <div className="w-full">
            <Separator className="mb-4" />
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
              <div className="text-xs font-mono opacity-60 truncate max-w-[200px]">
                {memory.fileName}
              </div>
            </div>
          </div>

          {/* CID Link */}
          {memory.cid && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center font-mono text-xs"
                asChild
              >
                <a
                  href={`https://ipfs.io/ipfs/${memory.cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View on IPFS"
                >
                  <LinkIcon className="w-3 h-3" />
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
                  Permanently preserved
                </StatusBadge>
              )}
            </motion.div>
          )}
        </CardFooter>
      </MemoryCard>
    </motion.div>
  )
}