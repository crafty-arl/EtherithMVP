import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function EnhancedTextarea({
  value,
  onChange,
  placeholder = "Enter your text...",
  className = "",
  maxLength = 1000,
  minRows = 3,
  maxRows = 10,
  disabled = false,
  showCharCount = true,
  autoFocus = false,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef(null)

  // Auto-resize functionality
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const adjustHeight = () => {
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight)
      const minHeight = lineHeight * minRows
      const maxHeight = lineHeight * maxRows

      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
      textarea.style.height = `${newHeight}px`
    }

    adjustHeight()
  }, [value, minRows, maxRows])

  const handleChange = (e) => {
    const newValue = e.target.value
    if (maxLength && newValue.length > maxLength) return
    onChange?.(e)
  }

  const characterCount = value?.length || 0
  const isNearLimit = characterCount > maxLength * 0.8
  const isAtLimit = characterCount >= maxLength

  return (
    <div className={`relative ${className}`}>
      <motion.textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={`
          w-full px-4 py-3 text-base
          border-2 rounded-2xl
          resize-none overflow-hidden
          transition-all duration-200 ease-out
          outline-none
          ${isFocused
            ? 'border-current shadow-lg shadow-current/10'
            : 'border-current/20 hover:border-current/40'
          }
          ${disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-50'
            : 'bg-transparent'
          }
          placeholder:text-current/50
          leading-relaxed
        `}
        style={{
          minHeight: `${minRows * 1.5}rem`,
          maxHeight: `${maxRows * 1.5}rem`,
        }}
        {...props}
      />

      {/* Character Count */}
      {showCharCount && maxLength && (
        <motion.div
          className={`
            absolute right-3 top-3 text-xs font-medium
            transition-colors duration-200
            ${isAtLimit
              ? 'text-red-500'
              : isNearLimit
                ? 'text-orange-500'
                : 'text-current/60'
            }
          `}
          initial={{ scale: 0 }}
          animate={{ scale: isFocused || characterCount > 0 ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {characterCount}/{maxLength}
        </motion.div>
      )}

      {/* Focus Ring */}
      <motion.div
        className={`
          absolute inset-0 pointer-events-none rounded-2xl
          border-2 border-current
        `}
        initial={{ opacity: 0, scale: 1 }}
        animate={{
          opacity: isFocused ? 0.1 : 0,
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Status Indicator */}
      <motion.div
        className={`
          absolute right-3 bottom-3 w-2 h-2 rounded-full
          transition-all duration-200
          ${disabled
            ? 'bg-gray-400'
            : isFocused
              ? 'bg-current'
              : characterCount > 0
                ? 'bg-green-500'
                : 'bg-transparent'
          }
        `}
        initial={{ scale: 0 }}
        animate={{ scale: characterCount > 0 || isFocused ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />
    </div>
  )
}