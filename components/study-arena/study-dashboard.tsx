"use client"

import { useState, useCallback } from "react"
import { BookOpen, ArrowLeft, Sparkles, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StudyPlan, UserProgress, Unit } from "@/lib/study-types"
import { sampleStudyPlan, sampleUserProgress, calculateLevel } from "@/lib/sample-data"
import { Header } from "./header"
import { UnitCard } from "./unit-card"
import { SidebarStats } from "./sidebar-stats"
import { QuizModal } from "./quiz-modal"

interface StudyDashboardProps {
  onReset: () => void  // called when user clicks "New Plan" to go back to landing
}

/**
 * StudyDashboard — the main study screen after plan generation.
 *
 * Layout:
 * - Header (sticky): logo + streak + XP bar
 * - Left col (2/3): unit cards with tasks
 * - Right col (1/3): sidebar stats (sticky)
 *
 * State managed here:
 * - plan         → the study plan (units, tasks)
 * - progress     → user's XP, level, streak, completed tasks
 * - quizModal    → which quiz is open
 * - XP popup     → "+XX XP" toast shown on task complete
 * - levelUpAnim  → full-screen "Level Up!" overlay
 */
export function StudyDashboard({ onReset }: StudyDashboardProps) {
  const [plan, setPlan] = useState<StudyPlan>(sampleStudyPlan)
  const [progress, setProgress] = useState<UserProgress>(sampleUserProgress)

  // Quiz modal state — null unit means no quiz is open
  const [quizModal, setQuizModal] = useState<{ open: boolean; unit: Unit | null }>({
    open: false,
    unit: null,
  })

  // "+XX XP" floating toast
  const [xpPopup, setXpPopup] = useState<{ show: boolean; xp: number }>({ show: false, xp: 0 })

  // Full-screen level-up overlay
  const [levelUpAnimation, setLevelUpAnimation] = useState(false)

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Show a brief "Level Up!" overlay, then hide it */
  const triggerLevelUp = () => {
    setLevelUpAnimation(true)
    setTimeout(() => setLevelUpAnimation(false), 2000)
  }

  /** Show the floating "+XX XP" toast */
  const triggerXpPopup = (xp: number) => {
    setXpPopup({ show: true, xp })
    setTimeout(() => setXpPopup((p) => ({ ...p, show: false })), 1500)
  }

  // ── Task Toggle ───────────────────────────────────────────────────────────

  /**
   * Handles clicking a task row:
   * - Quiz tasks → open the quiz modal instead of toggling
   * - Other tasks → toggle complete/incomplete and update XP
   */
  const handleToggleTask = useCallback((taskId: string) => {
    const task = plan.units.flatMap((u) => u.tasks).find((t) => t.id === taskId)
    if (!task) return

    // Quiz tasks open the modal — they can't be toggled manually
    if (task.type === "quiz") {
      const unit = plan.units.find((u) => u.tasks.some((t) => t.id === taskId))
      if (unit) setQuizModal({ open: true, unit })
      return
    }

    setProgress((prev) => {
      const completing = !prev.completedTasks.includes(taskId)
      const newCompletedTasks = completing
        ? [...prev.completedTasks, taskId]
        : prev.completedTasks.filter((id) => id !== taskId)

      const newXP = Math.max(0, prev.currentXP + (completing ? task.xp : -task.xp))
      const newLevel = calculateLevel(newXP)
      const newMinutes = completing
        ? prev.totalStudyMinutes + task.estimatedMinutes
        : Math.max(0, prev.totalStudyMinutes - task.estimatedMinutes)

      if (newLevel > prev.level) triggerLevelUp()
      if (completing) triggerXpPopup(task.xp)

      return {
        ...prev,
        completedTasks: newCompletedTasks,
        currentXP: newXP,
        level: newLevel,
        totalStudyMinutes: newMinutes,
      }
    })
  }, [plan])

  // ── Quiz Completion ───────────────────────────────────────────────────────

  /**
   * Called by QuizModal when the user finishes a quiz.
   * If passed: award XP, mark unit complete, unlock next unit.
   */
  const handleQuizComplete = useCallback((passed: boolean) => {
    if (passed && quizModal.unit) {
      const quizTask = quizModal.unit.tasks.find((t) => t.type === "quiz")
      if (quizTask) {
        setProgress((prev) => {
          const newCompleted = [...prev.completedTasks, quizTask.id]
          const newXP = prev.currentXP + quizTask.xp

          // Check if all tasks in the unit are now done → award completion bonus
          const allDone = quizModal.unit!.tasks.every((t) => newCompleted.includes(t.id))
          const bonusXP = allDone && !prev.completedUnits.includes(quizModal.unit!.id)
            ? quizModal.unit!.completionBonus
            : 0
          const newCompletedUnits = allDone
            ? [...prev.completedUnits, quizModal.unit!.id]
            : prev.completedUnits

          const finalXP = newXP + bonusXP
          const newLevel = calculateLevel(finalXP)
          if (newLevel > prev.level) triggerLevelUp()

          return {
            ...prev,
            completedTasks: newCompleted,
            completedUnits: newCompletedUnits,
            currentXP: finalXP,
            level: newLevel,
            totalStudyMinutes: prev.totalStudyMinutes + quizTask.estimatedMinutes,
          }
        })

        // Unlock the next unit in the plan
        const currentIdx = plan.units.findIndex((u) => u.id === quizModal.unit!.id)
        if (currentIdx < plan.units.length - 1) {
          setPlan((prev) => ({
            ...prev,
            units: prev.units.map((u, i) =>
              i === currentIdx + 1 ? { ...u, locked: false } : u
            ),
          }))
        }
      }
    }

    setQuizModal({ open: false, unit: null })
  }, [quizModal.unit, plan.units])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">

      {/* ── Level Up Overlay ── */}
      {levelUpAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="text-center animate-in zoom-in-50 fade-in">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/70 shadow-2xl shadow-primary/30">
              <PartyPopper className="h-12 w-12 text-primary-foreground" />
            </div>
            <h2 className="mt-6 text-3xl font-bold">Level Up!</h2>
            <p className="mt-2 text-xl text-muted-foreground">You reached Level {progress.level}</p>
          </div>
        </div>
      )}

      {/* ── XP Toast ── */}
      {xpPopup.show && (
        <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-lg shadow-primary/30">
            <Sparkles className="h-4 w-4" />
            <span className="font-bold">+{xpPopup.xp} XP</span>
          </div>
        </div>
      )}

      <Header progress={progress} />

      <main className="mx-auto max-w-6xl px-4 py-6">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="mb-4 -ml-2 hover:bg-secondary"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            New Plan
          </Button>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
              <BookOpen className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{plan.subject}</h2>
              <p className="mt-1 text-muted-foreground">
                {plan.units.length} units · {plan.estimatedTotalMinutes} min · {plan.totalXP} XP total
              </p>
            </div>
          </div>
        </div>

        {/* ── Two-Column Layout ── */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Unit cards */}
          <div className="space-y-4 lg:col-span-2">
            {plan.units.map((unit, index) => (
              <div
                key={unit.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <UnitCard
                  unit={unit}
                  completedTasks={progress.completedTasks}
                  onToggleTask={handleToggleTask}
                />
              </div>
            ))}
          </div>

          {/* Sticky sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <SidebarStats plan={plan} progress={progress} />
            </div>
          </div>
        </div>
      </main>

      {/* Quiz modal */}
      <QuizModal
        open={quizModal.open}
        onClose={() => setQuizModal({ open: false, unit: null })}
        onComplete={handleQuizComplete}
        unitTitle={quizModal.unit?.title || ""}
      />
    </div>
  )
}
