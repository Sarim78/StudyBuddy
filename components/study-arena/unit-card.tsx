"use client"

import { useState } from "react"
import { Lock, Clock, Zap, CheckCircle2, ChevronDown, ChevronRight, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Unit } from "@/lib/study-types"
import { TaskItem } from "./task-item"
import { cn } from "@/lib/utils"

interface UnitCardProps {
  unit: Unit
  completedTasks: string[]     // IDs of all tasks the user has completed
  onToggleTask: (taskId: string) => void
}

/**
 * UnitCard — collapsible card for a single study unit.
 *
 * States:
 * - Locked    → greyed out, can't expand
 * - Unlocked  → expandable, shows task list
 * - Completed → green border, confetti sparkle, bonus XP badge
 */
export function UnitCard({ unit, completedTasks, onToggleTask }: UnitCardProps) {
  // Start expanded if the unit is unlocked (first unit is always open)
  const [isExpanded, setIsExpanded] = useState(!unit.locked)

  // Derived progress values
  const completedCount = unit.tasks.filter((t) => completedTasks.includes(t.id)).length
  const progressPercent = (completedCount / unit.tasks.length) * 100
  const isCompleted = completedCount === unit.tasks.length
  const totalXP = unit.tasks.reduce((sum, t) => sum + t.xp, 0) + unit.completionBonus

  return (
    <Card className={cn(
      "border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300",
      unit.locked && "opacity-50 grayscale",
      isCompleted && "border-primary/50 bg-primary/5",
      !unit.locked && !isCompleted && "hover:border-border"
    )}>
      <CardHeader className="pb-4">

        {/* Clickable header row — toggles expand/collapse */}
        <button
          onClick={() => !unit.locked && setIsExpanded(!isExpanded)}
          disabled={unit.locked}
          className="flex w-full items-start justify-between text-left group"
        >
          <div className="flex items-start gap-6">

            {/* Unit number / status icon */}
            <div className={cn(
              "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-lg transition-all",
              isCompleted
                ? "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/20"
                : unit.locked
                ? "bg-muted text-muted-foreground"
                : "bg-secondary text-foreground group-hover:bg-secondary/80"
            )}>
              {unit.locked ? (
                <Lock className="h-5 w-5" />
              ) : isCompleted ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                unit.id
              )}
              {/* Sparkle on completed units */}
              {isCompleted && (
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                </div>
              )}
            </div>

            {/* Unit title, description, and meta */}
            <div className="flex-1">
              <h3 className={cn(
                "font-semibold text-base leading-tight transition-colors",
                !unit.locked && "group-hover:text-primary"
              )}>
                {unit.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {unit.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {unit.estimatedMinutes} min
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  {totalXP} XP
                </span>
                {isCompleted && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                    +{unit.completionBonus} XP Bonus
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Task counter + chevron */}
          {!unit.locked && (
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm font-medium text-muted-foreground">
                {completedCount}/{unit.tasks.length}
              </span>
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                isExpanded ? "bg-primary/20" : "bg-secondary"
              )}>
                {isExpanded
                  ? <ChevronDown className="h-4 w-4 text-primary" />
                  : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                }
              </div>
            </div>
          )}
        </button>

        {/* Progress bar (only when unlocked) */}
        {!unit.locked && (
          <div className="mt-6 relative">
            <Progress value={progressPercent} className="h-2" />
            {/* Moving dot on the progress bar */}
            {progressPercent > 0 && progressPercent < 100 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary shadow-lg shadow-primary/50 transition-all duration-500"
                style={{ left: `calc(${progressPercent}% - 6px)` }}
              />
            )}
          </div>
        )}
      </CardHeader>

      {/* Task list — rendered only when expanded and unlocked */}
      {isExpanded && !unit.locked && (
        <CardContent className="space-y-3 pt-0 pb-2">
          {unit.tasks.map((task, index) => (
            <div
              key={task.id}
              className="animate-in fade-in slide-in-from-top-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskItem
                task={{ ...task, completed: completedTasks.includes(task.id) }}
                onToggle={onToggleTask}
              />
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  )
}
