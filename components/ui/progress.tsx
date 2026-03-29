"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

/**
 * Progress bar component (Radix UI).
 * Used on XP bars, level bars, and task completion bars.
 * Pass `value` as a number 0–100.
 */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("bg-secondary relative h-2 w-full overflow-hidden rounded-full", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="bg-primary h-full w-full flex-1 transition-all duration-500"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
