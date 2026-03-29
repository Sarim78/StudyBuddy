"use client"

import { Flame, Zap, Trophy } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { UserProgress } from "@/lib/study-types"
import { getXPForNextLevel, getXPForCurrentLevel } from "@/lib/sample-data"
import { cn } from "@/lib/utils"

interface HeaderProps {
  progress: UserProgress
}

/**
 * Header — sticky top bar shown on the study dashboard.
 *
 * Displays:
 * - StudyBuddy logo
 * - Streak counter (glows after 7 days)
 * - Level badge + XP progress bar
 */
export function Header({ progress }: HeaderProps) {
  // Calculate how far into the current level the user is (0–100%)
  const xpCurrentLevel = getXPForCurrentLevel(progress.level)
  const xpNextLevel = getXPForNextLevel(progress.level)
  const levelProgress = ((progress.currentXP - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100

  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between">

          {/* ── Logo ── */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">StudyBuddy</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Learning</p>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="flex items-center gap-4 sm:gap-6">

            {/* Streak — icon glows after 7 days */}
            <div className="flex items-center gap-2 group">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                progress.streak >= 7
                  ? "bg-gradient-to-br from-accent to-accent/70 shadow-lg shadow-accent/20"
                  : "bg-accent/20"
              )}>
                <Flame className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110",
                  progress.streak >= 7 ? "text-accent-foreground" : "text-accent"
                )} />
              </div>
              {/* Full label on desktop, number only on mobile */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{progress.streak} day{progress.streak !== 1 && "s"}</p>
                <p className="text-xs text-muted-foreground">
                  {progress.streak >= 7 ? "On fire! 🔥" : "Keep it up!"}
                </p>
              </div>
              <span className="sm:hidden text-sm font-bold">{progress.streak}</span>
            </div>

            {/* Level + XP progress bar */}
            <div className="flex items-center gap-2 sm:gap-3 group">
              {/* Level badge with number overlay */}
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 transition-all group-hover:bg-primary/30">
                  <Zap className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                </div>
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-lg">
                  {progress.level}
                </div>
              </div>

              {/* XP bar */}
              <div className="w-24 sm:w-32">
                <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                  <span className="font-semibold">Level {progress.level}</span>
                  <span className="text-muted-foreground text-xs">{progress.currentXP} XP</span>
                </div>
                <div className="relative">
                  <Progress value={levelProgress} className="h-2" />
                  {/* Shimmer sweep animation */}
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  )
}
