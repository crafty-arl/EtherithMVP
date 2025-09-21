import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Button variants using class-variance-authority
 * Maintains monochrome design system with enhanced accessibility
 */
const buttonVariants = cva(
  // Base styles - maintaining existing design patterns
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-semibold tracking-wide uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-current focus-visible:ring-opacity-50 disabled:pointer-events-none disabled:opacity-60 min-h-touch min-w-touch [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary button - black background, white text (vault mode) / white background, black text (archive mode)
        default: "bg-current text-vault-bg hover:scale-105 hover:shadow-lg active:scale-95 motion-luxury overflow-hidden relative",

        // Secondary button - outlined style
        secondary: "border-2 border-current bg-transparent text-current hover:bg-current hover:text-vault-bg hover:scale-105 active:scale-95 motion-luxury",

        // Ghost button - minimal style for subtle actions
        ghost: "bg-transparent text-current hover:bg-current hover:bg-opacity-10 hover:scale-105 active:scale-95 motion-smooth",

        // Destructive button - uses current color with emphasis
        destructive: "bg-current text-vault-bg hover:opacity-90 hover:scale-105 active:scale-95 motion-luxury",

        // Link button - text-only style
        link: "text-current underline-offset-4 hover:underline hover:scale-105 motion-smooth px-0 min-h-auto min-w-auto"
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2 text-sm min-h-[40px]",
        lg: "px-8 py-4 text-lg min-h-[52px]",
        xl: "px-10 py-5 text-xl min-h-[56px]",
        icon: "size-12 p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button Component
 *
 * Enhanced with:
 * - Full WCAG AA compliance
 * - Monochrome theme support
 * - Responsive touch targets
 * - Smooth animations
 * - Loading states
 * - Archive mode support
 */
const Button = React.forwardRef(({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button"

  // Handle loading state
  const isDisabled = disabled || loading

  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size, className }),
        loading && "btn-loading",
        "relative"
      )}
      ref={ref}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <span className="opacity-0">{children}</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        </>
      ) : (
        children
      )}
    </Comp>
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }