import * as React from "react"

import { cn } from "@/lib/utils"

// Check if className contains semantic classes
const hasSemanticClass = (className?: string) => {
  if (!className) return false
  const semanticClasses = [
    'card-item',
    'detail-page-container',
    'page-container',
    'loading-container',
  ]
  return semanticClasses.some(semantic => className.includes(semantic))
}

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const shouldApplyDefaults = !hasSemanticClass(className)
  return (
    <div
      ref={ref}
      className={cn(
        shouldApplyDefaults && "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const shouldApplyDefaults = !hasSemanticClass(className)
  return (
    <div
      ref={ref}
      className={cn(
        shouldApplyDefaults && "flex flex-col space-y-1.5 p-6",
        className
      )}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  // Check if parent Card has semantic class by checking if className has semantic indicator
  const shouldApplyDefaults = !hasSemanticClass(className) && !className?.includes('card-item-title') && !className?.includes('detail-page-title') && !className?.includes('page-title')
  return (
    <h3
      ref={ref}
      className={cn(
        shouldApplyDefaults && "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const shouldApplyDefaults = !hasSemanticClass(className) && !className?.includes('text-muted')
  return (
    <p
      ref={ref}
      className={cn(
        shouldApplyDefaults && "text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const shouldApplyDefaults = !hasSemanticClass(className) && !className?.includes('detail-section') && !className?.includes('empty-state')
  return (
    <div
      ref={ref}
      className={cn(
        shouldApplyDefaults && "p-6 pt-0",
        className
      )}
      {...props}
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const shouldApplyDefaults = !hasSemanticClass(className)
  return (
    <div
      ref={ref}
      className={cn(
        shouldApplyDefaults && "flex items-center p-6 pt-0",
        className
      )}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
