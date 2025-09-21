import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Card Component System
 *
 * Maintains existing design patterns while adding shadcn/ui structure:
 * - Monochrome theme support
 * - Archive mode compatibility
 * - Enhanced hover effects
 * - Responsive design
 * - Accessibility improvements
 */

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base card styling - matches existing memory-card patterns
      "bg-vault-card border border-current rounded-lg motion-luxury relative overflow-hidden",
      // Enhanced shadow and hover effects
      "hover-lift-subtle cursor-pointer",
      // Archive mode support
      "archive-mode:bg-archive-card",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 p-6 pb-4",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-display font-semibold leading-none tracking-tight text-current",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-current/70 leading-relaxed",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-6 pt-2",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-4 border-t border-current/20",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

/**
 * Enhanced Card variants for specific use cases
 */

// Memory Card - specifically for memory vault items
const MemoryCard = React.forwardRef(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      // Existing memory-card specific styles
      "memory-card min-h-[200px]",
      // Enhanced styling with top border indicator
      "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5",
      "before:bg-current before:scale-x-0 before:origin-left before:transition-transform",
      "before:duration-medium before:ease-luxury hover:before:scale-x-100",
      "min-w-0", // Prevent flex shrinking
      className
    )}
    {...props}
  />
))
MemoryCard.displayName = "MemoryCard"

// Elevated Card - for important content
const ElevatedCard = React.forwardRef(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "card-elevated shadow-lg",
      "hover-lift", // Stronger hover effect
      className
    )}
    {...props}
  />
))
ElevatedCard.displayName = "ElevatedCard"

// Status Card - for displaying status information
const StatusCard = React.forwardRef(({ className, status = "default", ...props }, ref) => {
  const statusStyles = {
    success: "border-current bg-current/5",
    warning: "border-current bg-current/5",
    error: "border-current bg-current/5",
    info: "border-current bg-current/5",
    default: "border-current"
  }

  return (
    <Card
      ref={ref}
      className={cn(
        statusStyles[status],
        className
      )}
      {...props}
    />
  )
})
StatusCard.displayName = "StatusCard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  MemoryCard,
  ElevatedCard,
  StatusCard
}