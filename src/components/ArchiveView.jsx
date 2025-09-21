import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Archive, Search, Clock, Globe, Filter, RefreshCw } from 'lucide-react'
import MemoryCard from './MemoryCard'
import { Button } from './ui'
import { useResponsiveContext } from '../context/ResponsiveContext'

export default function ArchiveView({ memories, onSearch, onRefresh, isArchiveMode = true }) {
  const { shouldAnimate, isMobile, prefersReducedMotion } = useResponsiveContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMemories, setFilteredMemories] = useState(memories || [])
  const [isLoading, setIsLoading] = useState(false)

  // Filter memories based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMemories(memories || [])
    } else {
      const filtered = (memories || []).filter(memory =>
        memory.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memory.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memory.type?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredMemories(filtered)
    }
  }, [searchTerm, memories])

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (onSearch && searchTerm.trim()) {
      setIsLoading(true)
      try {
        await onSearch(searchTerm.trim())
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsLoading(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error('Refresh error:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <motion.div
      className="space-y-8"
      initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={shouldAnimate ? {
        duration: isMobile ? 0.4 : 0.6
      } : {}}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Archive className="w-8 h-8" />
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Public Archive
          </h2>
        </div>
        <p className="text-lg opacity-70 mb-6">
          Discover {filteredMemories.length} preserved {filteredMemories.length === 1 ? 'memory' : 'memories'}
        </p>
      </div>

      {/* Search and Controls */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative w-full max-w-2xl mx-auto lg:max-w-full xl:max-w-full">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-60" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search memories, files, or types..."
              className="w-full pl-12 pr-4 py-3 border-2 border-current rounded-lg bg-transparent text-current placeholder-current placeholder-opacity-60 focus:ring-4 focus:ring-current focus:ring-opacity-20 focus:border-current focus:outline-none text-base min-h-touch"
            />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 p-0 opacity-60 hover:opacity-100"
              >
                ✕
              </Button>
            )}
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 disabled:opacity-50"
            >
              {isLoading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 min-h-touch"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 border border-current rounded-lg opacity-60">
            <Globe className="w-4 h-4" />
            Public Memories
          </div>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {filteredMemories.length > 0 ? (
          <motion.div
            key="memories"
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldAnimate ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`
              grid gap-6 w-full justify-items-center
              grid-cols-1 max-w-sm mx-auto
              sm:grid-cols-2 sm:gap-6 sm:max-w-2xl sm:justify-items-stretch
              md:grid-cols-3 md:gap-8 md:max-w-4xl
              lg:grid-cols-4 lg:gap-8 lg:max-w-6xl lg:justify-items-stretch
              xl:grid-cols-5 xl:gap-10 xl:max-w-7xl xl:justify-items-stretch
              2xl:grid-cols-6 2xl:gap-12 2xl:max-w-screen-2xl 2xl:justify-items-stretch
              transition-all duration-500 ease-luxury
            `}
            role="grid"
            aria-label={`Archive containing ${filteredMemories.length} ${filteredMemories.length === 1 ? 'memory' : 'memories'}`}
          >
            {filteredMemories.map((memory, index) => (
              <div key={memory.id} role="gridcell">
                <MemoryCard
                  memory={memory}
                  index={index}
                  isArchiveMode={isArchiveMode}
                  formatFileSize={formatFileSize}
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldAnimate ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
          >
            <Archive className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-display text-2xl font-bold mb-2">
              {searchTerm ? 'No matches found' : 'Archive is empty'}
            </h3>
            <p className="text-lg opacity-70 mb-6">
              {searchTerm
                ? `No memories match "${searchTerm}"`
                : 'No public memories available yet'
              }
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
                className="min-h-touch"
              >
                Clear Search
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}