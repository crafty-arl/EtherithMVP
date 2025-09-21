import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Input Component
 *
 * Enhanced version of existing input patterns with:
 * - WCAG AA compliance
 * - Monochrome theme support
 * - Proper error states
 * - Enhanced focus indicators
 * - Mobile-optimized touch targets
 */
const Input = React.forwardRef(({
  className,
  type = "text",
  error = false,
  success = false,
  ...props
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        // Base input styling - maintains existing patterns
        "input-primary",
        // Enhanced states
        error && "input-error",
        success && "input-success",
        // Ensure proper sizing
        "w-full min-h-touch",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

/**
 * Textarea Component
 */
const Textarea = React.forwardRef(({
  className,
  error = false,
  success = false,
  ...props
}, ref) => {
  return (
    <textarea
      className={cn(
        // Base textarea styling
        "textarea-primary",
        // Enhanced states
        error && "input-error",
        success && "input-success",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

/**
 * Label Component
 */
const Label = React.forwardRef(({
  className,
  required = false,
  ...props
}, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-current leading-relaxed",
        required && "label-required",
        // Ensure proper spacing and accessibility
        "block mb-2",
        className
      )}
      {...props}
    />
  )
})
Label.displayName = "Label"

/**
 * Form Field Component - combines label, input, and error message
 */
const FormField = React.forwardRef(({
  label,
  error,
  success,
  required = false,
  children,
  className,
  ...props
}, ref) => {
  const id = props.id || `field-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={cn("space-y-2", className)} ref={ref}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}

      {React.isValidElement(children)
        ? React.cloneElement(children, {
            id,
            error: !!error,
            success: !!success,
            'aria-invalid': !!error,
            'aria-describedby': error ? `${id}-error` : success ? `${id}-success` : undefined,
            ...children.props
          })
        : children
      }

      {error && (
        <p
          id={`${id}-error`}
          className="text-xs text-current opacity-80 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <span>⚠</span>
          {error}
        </p>
      )}

      {success && !error && (
        <p
          id={`${id}-success`}
          className="text-xs text-current opacity-80 flex items-center gap-1"
        >
          <span>✓</span>
          {success}
        </p>
      )}
    </div>
  )
})
FormField.displayName = "FormField"

/**
 * Enhanced File Input for uploads
 */
const FileInput = React.forwardRef(({
  className,
  accept,
  multiple = false,
  onFileSelect,
  dragOverText = "Drop files here",
  clickText = "Click to select files",
  ...props
}, ref) => {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const inputRef = React.useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (onFileSelect && files.length > 0) {
      onFileSelect(multiple ? files : files[0])
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (onFileSelect && files.length > 0) {
      onFileSelect(multiple ? files : files[0])
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div
      className={cn(
        "relative border-2 border-dashed border-current rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
        "hover:border-current hover:bg-current/5",
        "focus-within:ring-4 focus-within:ring-current focus-within:ring-opacity-20",
        isDragOver && "border-current bg-current/10 scale-102",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="sr-only"
        {...props}
      />

      <div className="space-y-2">
        <div className="text-lg font-medium text-current">
          {isDragOver ? dragOverText : clickText}
        </div>
        {accept && (
          <div className="text-sm text-current/70">
            Accepted formats: {accept}
          </div>
        )}
      </div>
    </div>
  )
})
FileInput.displayName = "FileInput"

export { Input, Textarea, Label, FormField, FileInput }