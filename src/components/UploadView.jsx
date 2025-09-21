import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Radio, CheckCircle, Loader2 } from 'lucide-react'
import EnhancedTextarea from './EnhancedTextarea'
import { Button } from './ui'

export default function UploadView({ onUpload, isArchiveMode }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [memoryNote, setMemoryNote] = useState('')
  const [visibility, setVisibility] = useState('private')
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = useCallback((files) => {
    setSelectedFiles(Array.from(files))
    console.log('📁 Files selected:', files.length)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileSelect(files)
  }, [handleFileSelect])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || [])
    handleFileSelect(files)
  }

  const handleNoteChange = (e) => {
    setMemoryNote(e.target.value)
  }

  const isUploadReady = selectedFiles.length > 0 && memoryNote.trim().length >= 10

  const handleUpload = async () => {
    if (!isUploadReady || isUploading) return

    try {
      setIsUploading(true)
      await onUpload(selectedFiles, memoryNote, visibility)

      // Reset form
      setSelectedFiles([])
      setMemoryNote('')
      setVisibility('private')

      // Switch to vault view
      window.dispatchEvent(new CustomEvent('switch-view', { detail: 'vault' }))
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto space-y-8 lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
    >
      {/* Upload Section */}
      <motion.div
        className={`
          card-elevated text-center cursor-pointer relative overflow-hidden
          ${isDragOver ? 'border-solid bg-current text-vault-bg scale-[1.02]' : ''}
          ${isArchiveMode ? 'bg-archive-card text-archive-text' : ''}
          ${isDragOver && isArchiveMode ? 'text-archive-bg' : ''}
          p-8 sm:p-12
          before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5
          before:bg-current before:scale-x-0 before:origin-left before:transition-transform
          before:duration-medium before:ease-luxury hover:before:scale-x-100
        `}
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ y: -8, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="w-20 h-20 mx-auto mb-6 bg-transparent border-2 border-current rounded-2xl flex items-center justify-center text-3xl motion-luxury relative sm:w-24 sm:h-24 sm:text-4xl"
          whileHover={{ scale: 1.05, rotate: 2 }}
        >
          <Upload />
        </motion.div>

        <h3 className="font-display text-2xl font-bold mb-2 tracking-tight">
          Preserve Memory
        </h3>
        <p className="text-base font-medium opacity-80 mb-2 tracking-wide">
          Every memory, proofed forever
        </p>
        <div className="text-sm font-medium opacity-60 uppercase tracking-widest">
          Images • Videos • Audio • Documents • Text
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="sr-only"
          id="file-upload-input"
          aria-label="Select files to upload"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        />

        {/* Selected Files Preview */}
        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              className="mt-6 p-4 bg-current/10 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Selected Files ({selectedFiles.length})
              </h4>
              <div className="space-y-2 text-sm">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-current/5 rounded">
                    <span className="truncate font-medium">{file.name}</span>
                    <span className="opacity-70 text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Memory Note */}
      <motion.div
        className="w-full max-w-2xl mx-auto lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="card p-6">
          <label
            htmlFor="memory-note-input"
            className="block font-semibold text-lg mb-4 tracking-tight label-required"
          >
            Why does this matter?
            <span className="sr-only"> (required)</span>
          </label>
          <EnhancedTextarea
            id="memory-note-input"
            value={memoryNote}
            onChange={handleNoteChange}
            placeholder="Describe the significance of this memory..."
            maxLength={300}
            minLength={10}
            required
            isArchiveMode={isArchiveMode}
            aria-label="Memory significance description"
            className="textarea-primary"
          />
          <div className="mt-2 text-xs opacity-60 text-right">
            {memoryNote.length}/300 characters
          </div>
        </div>
      </motion.div>

      {/* Upload Controls */}
      <motion.div
        className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* Visibility Controls */}
        <fieldset className="card p-4">
          <legend className="text-base font-semibold mb-4 text-center w-full">Visibility</legend>
          <div className="flex gap-6 justify-center" role="radiogroup" aria-labelledby="visibility-legend">
            <label className="flex items-center gap-3 cursor-pointer min-h-touch">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={visibility === 'private'}
                onChange={(e) => setVisibility(e.target.value)}
                className="sr-only"
                id="visibility-private"
              />
              <div className={`
                w-6 h-6 border-2 border-current rounded-full bg-transparent cursor-pointer
                flex items-center justify-center motion-smooth min-w-touch min-h-touch
                focus-within:ring-4 focus-within:ring-current focus-within:ring-opacity-50
                ${visibility === 'private' ? 'after:content-[""] after:w-3 after:h-3 after:bg-current after:rounded-full' : ''}
              `} />
              <span className="text-base font-semibold uppercase tracking-wider">Private</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer min-h-touch">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={visibility === 'public'}
                onChange={(e) => setVisibility(e.target.value)}
                className="sr-only"
                id="visibility-public"
              />
              <div className={`
                w-6 h-6 border-2 border-current rounded-full bg-transparent cursor-pointer
                flex items-center justify-center motion-smooth min-w-touch min-h-touch
                focus-within:ring-4 focus-within:ring-current focus-within:ring-opacity-50
                ${visibility === 'public' ? 'after:content-[""] after:w-3 after:h-3 after:bg-current after:rounded-full' : ''}
              `} />
              <span className="text-base font-semibold uppercase tracking-wider">Public</span>
            </label>
          </div>
        </fieldset>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!isUploadReady || isUploading}
          size="lg"
          className={`w-full sm:w-auto px-8 py-4 text-base ${isArchiveMode ? 'hover:text-archive-bg' : ''}`}
          asChild
        >
          <motion.button
            whileHover={isUploadReady ? { y: -4 } : {}}
            whileTap={isUploadReady ? { scale: 0.95 } : {}}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Preserving...
              </>
            ) : (
              'Preserve Forever'
            )}
          </motion.button>
        </Button>
      </motion.div>
    </motion.div>
  )
}