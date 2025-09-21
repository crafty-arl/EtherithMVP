import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function for merging Tailwind CSS classes
 * This is the standard shadcn/ui utility that intelligently merges conflicting classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Generate class variance authority (cva) compatible variants
 * Maintains monochrome theme compatibility
 */
export function createVariants(base, variants = {}) {
  return {
    base,
    variants,
    defaultVariants: {}
  }
}

/**
 * Archive mode utility - checks if element should use dark theme
 */
export function isArchiveMode() {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('archive-mode') ||
         document.body.classList.contains('archive-mode')
}

/**
 * Focus management utility for accessibility
 */
export function focusElement(selector, delay = 0) {
  if (typeof document === 'undefined') return

  const focus = () => {
    const element = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector

    if (element && typeof element.focus === 'function') {
      element.focus()
    }
  }

  if (delay > 0) {
    setTimeout(focus, delay)
  } else {
    focus()
  }
}

/**
 * Safe area utility for mobile devices
 */
export function getSafeAreaInsets() {
  if (typeof window === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 }

  const style = getComputedStyle(document.documentElement)

  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
    right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0')
  }
}