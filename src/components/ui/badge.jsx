import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Badge variants maintaining monochrome design system
 */
const badgeVariants = cva(
  // Base badge styling - maintains existing status-badge patterns
  "inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border-2 transition-all duration-200 min-h-touch focus:outline-none focus-visible:ring-4 focus-visible:ring-current focus-visible:ring-opacity-50",
  {
    variants: {
      variant: {
        // Default badge - uses current color
        default: "border-current bg-transparent text-current hover:bg-current hover:bg-opacity-10",

        // Status variants with icons
        success: "border-current bg-transparent text-current before:content-['✓'] before:mr-1 before:font-bold hover:bg-current hover:bg-opacity-10",

        warning: "border-current bg-transparent text-current before:content-['⚠'] before:mr-1 before:font-bold hover:bg-current hover:bg-opacity-10",

        error: "border-current bg-transparent text-current before:content-['✗'] before:mr-1 before:font-bold hover:bg-current hover:bg-opacity-10",

        info: "border-current bg-transparent text-current before:content-['i'] before:mr-1 before:font-bold before:border before:border-current before:rounded-full before:w-3 before:h-3 before:text-[10px] before:flex before:items-center before:justify-center hover:bg-current hover:bg-opacity-10",

        // Filled variant
        filled: "border-current bg-current text-vault-bg hover:opacity-90",

        // Subtle variant - more muted
        subtle: "border-current/50 bg-current/5 text-current/80 hover:bg-current/10",

        // Outline only
        outline: "border-current bg-transparent text-current hover:bg-current hover:text-vault-bg"
      },
      size: {
        sm: "px-2 py-1 text-xs min-h-[32px]",
        default: "px-3 py-2 text-xs min-h-touch",
        lg: "px-4 py-3 text-sm min-h-[48px]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

/**
 * Badge Component
 *
 * Enhanced status indicators with:
 * - Icon support via variants
 * - WCAG compliant touch targets
 * - Monochrome theme consistency
 * - Archive mode support
 * - Interactive states for clickable badges
 */
const Badge = React.forwardRef(({
  className,
  variant,
  size,
  interactive = false,
  children,
  ...props
}, ref) => {
  const Component = interactive ? "button" : "div"

  return (
    <Component
      className={cn(
        badgeVariants({ variant, size }),
        interactive && "cursor-pointer hover:scale-105 active:scale-95",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Component>
  )
})
Badge.displayName = "Badge"

/**
 * Status Badge - specifically for memory status indicators
 */
const StatusBadge = React.forwardRef(({
  status,
  children,
  className,
  ...props
}, ref) => {
  const statusVariants = {
    uploading: "default",
    uploaded: "success",
    pinned: "success",
    moderated: "success",
    error: "error",
    rejected: "error",
    pending: "warning",
    processing: "warning"
  }

  const variant = statusVariants[status] || "default"

  return (
    <Badge
      ref={ref}
      variant={variant}
      className={cn(
        // Add loading animation for uploading status
        status === "uploading" && "animate-pulse",
        className
      )}
      {...props}
    >
      {children || status}
    </Badge>
  )
})
StatusBadge.displayName = "StatusBadge"

/**
 * Type Badge - for file type indicators
 */
const TypeBadge = React.forwardRef(({
  type,
  className,
  ...props
}, ref) => {
  return (
    <Badge
      ref={ref}
      variant="subtle"
      size="sm"
      className={cn(
        "font-mono lowercase",
        className
      )}
      {...props}
    >
      {type}
    </Badge>
  )
})
TypeBadge.displayName = "TypeBadge"

/**
 * Visibility Badge - for public/private indicators
 */
const VisibilityBadge = React.forwardRef(({
  visibility,
  className,
  ...props
}, ref) => {
  const variant = visibility === "public" ? "info" : "subtle"

  return (
    <Badge
      ref={ref}
      variant={variant}
      size="sm"
      className={className}
      {...props}
    >
      {visibility}
    </Badge>
  )
})
VisibilityBadge.displayName = "VisibilityBadge"

export { Badge, StatusBadge, TypeBadge, VisibilityBadge, badgeVariants }