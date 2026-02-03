import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Check if className contains semantic classes that should skip badge defaults
const hasSemanticBadgeClass = (className?: string) => {
  if (!className) return false
  const semanticClasses = [
    'status-badge',
  ]
  return semanticClasses.some(semantic => className.includes(semantic))
}

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-500 text-white",
        warning: "border-transparent bg-yellow-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  // If semantic badge class is present, don't apply badgeVariants at all
  // The semantic class will handle all styling
  const hasSemantic = hasSemanticBadgeClass(className)
  return (
    <div className={cn(!hasSemantic && badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
