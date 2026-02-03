import * as React from "react"

import { cn } from "@/lib/utils"

// Check if className contains semantic classes
const hasSemanticClass = (className?: string) => {
  if (!className) return false
  const semanticClasses = [
    'card-item',
    'card-item-header',
    'card-item-content',
    'dashboard-card',
    'dashboard-card-header',
    'dashboard-card-title',
    'dashboard-card-content',
    'detail-card',
    'detail-card-header',
    'detail-card-content',
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
  const shouldApplyDefaults = !hasSemanticClass(className) && !className?.includes('detail-card-header')
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
  // Apply defaults UNLESS:
  // 1. className contains semantic classes
  // 2. className contains semantic indicators
  // Note: If className is undefined/empty, apply defaults (for regular Cards)
  // CSS will override via selectors like .card-item h3 for semantic contexts
  const shouldApplyDefaults = 
    !hasSemanticClass(className) && 
    !className?.includes('card-item-title') && 
    !className?.includes('detail-page-title') && 
    !className?.includes('page-title') &&
    !className?.includes('dashboard-card-title')
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
  const shouldApplyDefaults = !hasSemanticClass(className) && !className?.includes('detail-section') && !className?.includes('detail-card-content') && !className?.includes('empty-state')
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
