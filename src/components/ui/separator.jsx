import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

/**
 * Separator Component
 *
 * Accessible separator with monochrome theme support
 * Maintains visual hierarchy while supporting both orientations
 */
const Separator = React.forwardRef(({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-current/20",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

/**
 * Enhanced Separator variants
 */

// Dotted separator for subtle division
const DottedSeparator = React.forwardRef(({
  className,
  orientation = "horizontal",
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-current/30",
      orientation === "horizontal"
        ? "border-t border-dotted w-full h-0"
        : "border-l border-dotted h-full w-0",
      className
    )}
    role="separator"
    aria-orientation={orientation}
    {...props}
  />
))
DottedSeparator.displayName = "DottedSeparator"

// Gradient separator for more visual impact
const GradientSeparator = React.forwardRef(({
  className,
  orientation = "horizontal",
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-gradient-to-r from-transparent via-current to-transparent opacity-20",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px] bg-gradient-to-b",
      className
    )}
    role="separator"
    aria-orientation={orientation}
    {...props}
  />
))
GradientSeparator.displayName = "GradientSeparator"

// Section separator with text
const SectionSeparator = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex items-center justify-center my-6",
      className
    )}
    role="separator"
    {...props}
  >
    <Separator className="absolute inset-0" />
    {children && (
      <div className="relative bg-vault-bg px-4 text-sm font-medium text-current/70 archive-mode:bg-archive-bg">
        {children}
      </div>
    )}
  </div>
))
SectionSeparator.displayName = "SectionSeparator"

export { Separator, DottedSeparator, GradientSeparator, SectionSeparator }