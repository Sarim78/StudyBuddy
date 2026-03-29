"use client"

import { BookOpen, Brain, HelpCircle, Clock, Zap, Check, ChevronRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Task } from "@/lib/study-types"
import { cn } from "@/lib/utils"

interface TaskItemProps {
  task: Task & { completed: boolean }
  disabled?: boolean
  onToggle: (taskId: string) => void
}

// Visual config for each task type — icon, label, and colour scheme
const TASK_TYPE_CONFIG = {
  passive_review: {
    icon: BookOpen,
    label: "Read",
    color: "text-chart-4",
    bgColor: "bg-chart-4/20",
    borderColor: "border-chart-4/30",
  },
  active_recall: {
    icon: Brain,
    label: "Practice",
    color: "text-chart-3",
    bgColor: "bg-chart-3/20",
    borderColor: "border-chart-3/30",
  },
  quiz: {
    icon: HelpCircle,
    label: "Quiz",
    color: "text-accent",
    bgColor: "bg-accent/20",
    borderColor: "border-accent/30",
  },
}

/**
 * TaskItem — a single row inside a UnitCard.
 *
 * - Clicking anywhere on the row toggles completion (or opens quiz modal for quiz tasks)
 * - Completed tasks get a strikethrough label
 * - Quiz tasks show an arrow button to signal they open a modal
 */
export function TaskItem({ task, disabled = false, onToggle }: TaskItemProps) {
  const config = TASK_TYPE_CONFIG[task.type]
  const Icon = config.icon
  const isQuiz = task.type === "quiz"

  return (
    <div
      onClick={() => !disabled && onToggle(task.id)}
      className={cn(
        "group flex items-start gap-3 rounded-xl border p-4 transition-all cursor-pointer",
        // Completed tasks get a subtle green tint
        task.completed
          ? "border-primary/30 bg-primary/5"
          : cn("border-border/50 hover:border-border", isQuiz && "hover:border-accent/50"),
        !task.completed && !disabled && "hover:bg-secondary/30",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {/* Checkbox */}
      <div className="mt-0.5">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          disabled={disabled}
          className={cn(
            "transition-all",
            task.completed && "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          )}
        />
      </div>

      {/* Task content */}
      <div className="flex-1 min-w-0">

        {/* Type badge + done indicator */}
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
            config.bgColor, config.color, config.borderColor
          )}>
            <Icon className="h-3 w-3" />
            {config.label}
          </span>
          {task.completed && (
            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
              <Check className="h-3 w-3" />
              Done
            </span>
          )}
        </div>

        {/* Task label — strikethrough when complete */}
        <p className={cn(
          "text-sm leading-relaxed",
          task.completed && "line-through text-muted-foreground"
        )}>
          {task.label}
        </p>

        {/* Time & XP meta */}
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {task.estimatedMinutes} min
          </span>
          <span className={cn(
            "inline-flex items-center gap-1.5 font-medium",
            task.completed ? "text-primary" : "text-muted-foreground"
          )}>
            <Zap className="h-3.5 w-3.5 text-primary" />
            +{task.xp} XP
          </span>
        </div>
      </div>

      {/* Quiz arrow — signals this opens a modal */}
      {isQuiz && !task.completed && (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 transition-all group-hover:bg-accent/30">
          <ChevronRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" />
        </div>
      )}
    </div>
  )
}
