import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Archive, Users } from 'lucide-react'
import MemoryCard from './MemoryCard'

export default function ArchiveView({ memories, onSearch, isArchiveMode }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value
    setSearchTerm(value)

    // Debounced search
    clearTimeout(window.archiveSearchTimeout)
    window.archiveSearchTimeout = setTimeout(() => {
      onSearch(value.toLowerCase().trim())
    }, 300)
  }, [onSearch])

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getUserDisplayName = (userId) => {
    // For now, show partial ID
    return userId.substring(0, 8) + '...'
  }

  if (memories.length === 0 && !searchTerm) {
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
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            ⬇
          </motion.div>
          <h3 className="font-display text-3xl font-bold mb-4 tracking-tight">
            Archive is quiet
          </h3>
          <p className="text-base opacity-80 mb-2">
            No public memories yet
          </p>
          <p className="text-sm opacity-60">
            <small>Share your first public memory</small>
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="space-y-3xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Search Section */}
      <motion.div
        className="mb-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      >
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-current/50">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search memories..."
            className={`
              w-full pl-14 pr-6 py-5 bg-transparent border-2 border-current/20 rounded-2xl
              text-current text-base font-medium tracking-tight motion-luxury focus-luxury
              placeholder:opacity-50
              ${isArchiveMode ? 'border-white/20' : ''}
            `}
          />
        </div>
      </motion.div>

      {/* Results Count */}
      {searchTerm && (
        <motion.div
          className="text-center text-sm opacity-70 uppercase tracking-wider font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {memories.length} memories found
        </motion.div>
      )}

      {/* Grid Container */}
      {memories.length > 0 ? (
        <div className={`
          grid grid-cols-[repeat(auto-fill,280px)] gap-card justify-start
          tablet:grid-cols-[repeat(auto-fill,260px)] tablet:gap-card-tablet
          mobile:grid-cols-1 mobile:gap-card-mobile mobile:justify-center
        `}>
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.33, 1, 0.68, 1]
              }}
            >
              {/* Enhanced Memory Card for Archive */}
              <div className={`
                w-card bg-vault-card rounded-lg p-xl border border-current motion-luxury
                relative overflow-hidden cursor-pointer hover-lift-strong
                tablet:w-card-tablet mobile:w-card-mobile mobile:max-w-full mobile:p-lg
                ${isArchiveMode ? 'bg-archive-card text-archive-text' : ''}
                before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5
                before:bg-current before:scale-x-0 before:origin-left before:transition-transform
                before:duration-medium before:ease-luxury hover:before:scale-x-100
              `}>
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
                    border border-current bg-transparent opacity-100 flex items-center gap-1
                  `}>
                    ✅ Moderated
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

                {/* Metadata */}
                <div className={`
                  flex justify-between items-center mt-lg pt-md border-t border-current
                  text-[11px] opacity-70 uppercase tracking-wider font-medium
                `}>
                  <span>{new Date(memory.timestamp).toLocaleDateString()}</span>
                  <span>{memory.fileName} ({formatFileSize(memory.fileSize)})</span>
                </div>

                {/* CID Link */}
                {memory.cid && (
                  <div className="mt-3">
                    <a
                      href={`https://ipfs.io/ipfs/${memory.cid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        inline-block text-current no-underline font-mono text-[11px]
                        font-semibold tracking-wider py-1.5 px-3 border border-current rounded
                        motion-smooth hover:bg-current hover:text-vault-card hover:-translate-y-px
                        ${isArchiveMode ? 'hover:text-archive-card' : ''}
                      `}
                      title="View on IPFS"
                    >
                      {memory.cid.substring(0, 12)}...
                    </a>
                    <div className="text-[10px] text-green-600 dark:text-green-400 mt-1">
                      Permanently preserved
                    </div>
                  </div>
                )}

                {/* Public Memory Footer */}
                <div className="mt-3 pt-3 border-t border-current/20 flex justify-between items-center">
                  <div className="text-xs opacity-70 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Shared by {getUserDisplayName(memory.userId)}
                  </div>
                  <div className="text-[10px] opacity-60 uppercase tracking-widest">
                    Public Memory
                  </div>
                </div>

                {/* AI Verification Badge */}
                {memory.moderation && memory.moderation.confidence && (
                  <div className="mt-2 text-[10px] opacity-50 uppercase tracking-widest">
                    AI Verified • {Math.round(memory.moderation.confidence * 100)}% Confidence
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : searchTerm ? (
        <motion.div
          className="text-center opacity-70 mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Archive className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="font-display text-xl font-bold mb-2">No memories found</h3>
          <p className="text-sm opacity-80">Try a different search term</p>
        </motion.div>
      ) : null}
    </motion.div>
  )
}