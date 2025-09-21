import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Radio, CheckCircle } from 'lucide-react'

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
      className="max-w-4xl mx-auto space-y-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
    >
      {/* Upload Section */}
      <motion.div
        className={`
          bg-vault-card border border-current rounded-lg p-4xl text-center
          mb-3xl motion-luxury cursor-pointer relative overflow-hidden hover-lift
          ${isDragOver ? 'border-solid bg-current text-vault-bg scale-[1.02]' : ''}
          ${isArchiveMode ? 'bg-archive-card text-archive-text' : ''}
          ${isDragOver && isArchiveMode ? 'text-archive-bg' : ''}
          mobile:p-2xl mobile:px-lg mobile:mb-xl
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
          className={`
            w-16 h-16 mx-auto mb-xl bg-transparent border border-current rounded-2xl
            flex items-center justify-center text-2xl motion-luxury relative
            mobile:w-12 mobile:h-12 mobile:text-xl
          `}
          whileHover={{ scale: 1.05, rotate: 2 }}
        >
          <Upload />
        </motion.div>

        <h3 className="font-display text-xl font-bold mb-sm tracking-tight">
          Preserve Memory
        </h3>
        <p className="text-sm font-medium opacity-80 mb-xs tracking-wide">
          Every memory, proofed forever
        </p>
        <small className="text-[11px] font-medium opacity-60 uppercase tracking-widest">
          Images • Videos • Audio • Documents • Text
        </small>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
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
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Selected Files ({selectedFiles.length})
              </h4>
              <div className="space-y-1 text-xs">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="truncate">{file.name}</span>
                    <span className="opacity-70">
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
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <label className="block font-semibold text-base mb-4 tracking-tight">
          Why does this matter?
        </label>
        <textarea
          value={memoryNote}
          onChange={handleNoteChange}
          placeholder="Describe the significance of this memory..."
          maxLength={300}
          required
          className={`
            w-full bg-transparent border-2 border-current/20 rounded-2xl p-6
            text-current resize-vertical min-h-[120px] font-body text-base leading-relaxed
            motion-luxury focus-luxury placeholder:opacity-50
            ${isArchiveMode ? 'border-white/20' : ''}
          `}
        />
        <small className="block mt-3 text-xs opacity-60 text-right uppercase tracking-wider">
          {memoryNote.length}/300 characters
        </small>
      </motion.div>

      {/* Upload Controls */}
      <motion.div
        className="flex gap-6 justify-center items-center mt-3xl mobile:flex-col mobile:gap-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* Visibility Controls */}
        <div className="flex gap-6 mobile:gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={visibility === 'private'}
                onChange={(e) => setVisibility(e.target.value)}
                className="sr-only"
              />
              <div className={`
                w-5 h-5 border-2 border-current rounded-full bg-transparent cursor-pointer
                flex items-center justify-center motion-smooth
                ${visibility === 'private' ? 'after:content-[""] after:w-2 after:h-2 after:bg-current after:rounded-full' : ''}
              `} />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider">Private</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={visibility === 'public'}
                onChange={(e) => setVisibility(e.target.value)}
                className="sr-only"
              />
              <div className={`
                w-5 h-5 border-2 border-current rounded-full bg-transparent cursor-pointer
                flex items-center justify-center motion-smooth
                ${visibility === 'public' ? 'after:content-[""] after:w-2 after:h-2 after:bg-current after:rounded-full' : ''}
              `} />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider">Public</span>
          </label>
        </div>

        {/* Upload Button */}
        <motion.button
          onClick={handleUpload}
          disabled={!isUploadReady || isUploading}
          className={`
            px-6 py-3 border-2 border-current rounded-xl cursor-pointer font-semibold
            text-sm tracking-wider uppercase bg-transparent motion-luxury btn-hover
            relative overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed
            mobile:w-full mobile:text-center
            hover:bg-current hover:text-vault-bg
            ${isArchiveMode ? 'hover:text-archive-bg' : ''}
            before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full
            before:bg-current before:transition-all before:duration-slow before:ease-luxury before:z-[-1]
            hover:before:left-0
          `}
          whileHover={isUploadReady ? { y: -4 } : {}}
          whileTap={isUploadReady ? { scale: 0.95 } : {}}
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Preserving...
            </span>
          ) : (
            'Preserve Forever'
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}