"use client"

import { Flame, Target, Clock, Trophy, Zap, Gift, TrendingUp, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { StudyPlan, UserProgress } from "@/lib/study-types"
import { getXPForNextLevel, getXPForCurrentLevel } from "@/lib/sample-data"
import { cn } from "@/lib/utils"

interface SidebarStatsProps {
  plan: StudyPlan
  progress: UserProgress
}

/**
 * SidebarStats — sticky right-hand panel on the study dashboard.
 *
 * Three cards:
 * 1. Your Progress — level bar, streak, minutes studied, overall completion
 * 2. Focus Session  — today's recommended session length and rationale
 * 3. Bonus XP Goals — streak/challenge bonuses to motivate the user
 */
export function SidebarStats({ plan, progress }: SidebarStatsProps) {
  // Level progress percentage
  const xpCurrentLevel = getXPForCurrentLevel(progress.level)
  const xpNextLevel = getXPForNextLevel(progress.level)
  const levelProgress = ((progress.currentXP - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100

  // Overall course completion percentage
  const totalTasks = plan.units.reduce((sum, u) => sum + u.tasks.length, 0)
  const completedTasks = progress.completedTasks.length
  const overallProgress = (completedTasks / totalTasks) * 100

  return (
    <div className="space-y-4">

      {/* ── Card 1: Your Progress ── */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* XP level bar */}
          <div className="relative">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Level {progress.level}</span>
              <span className="font-bold text-primary">{progress.currentXP} XP</span>
            </div>
            <div className="relative">
              <Progress value={levelProgress} className="h-3" />
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{xpNextLevel - progress.currentXP}</span> XP to Level {progress.level + 1}
            </p>
          </div>

          {/* Streak + study minutes */}
          <div className="grid grid-cols-2 gap-3">
            <div className={cn(
              "rounded-xl p-4 text-center transition-all",
              progress.streak >= 7
                ? "bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30"
                : "bg-accent/10"
            )}>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                <Flame className={cn("h-5 w-5 text-accent", progress.streak >= 7 && "animate-pulse")} />
              </div>
              <p className="mt-2 text-2xl font-bold">{progress.streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-2 text-2xl font-bold">{progress.totalStudyMinutes}</p>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </div>
          </div>

          {/* Overall course progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Course Progress</span>
              <span className="font-medium">{completedTasks}/{totalTasks}</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-primary" />
              {Math.round(overallProgress)}% complete
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Card 2: Focus Session ── */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden relative">
        {/* Decorative blur blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <CardHeader className="pb-2 relative">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20">
              <Target className="h-4 w-4 text-primary" />
            </div>
            Focus Session
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-sm text-muted-foreground">
            Got <span className="font-semibold text-foreground">{plan.sessionMode.minutesAvailable} minutes</span>?
          </p>
          <p className="mt-2 text-sm leading-relaxed">{plan.sessionMode.rationale}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary">
            <Zap className="h-3 w-3" />
            +120 XP potential
          </div>
        </CardContent>
      </Card>

      {/* ── Card 3: Bonus XP Goals ── */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20">
              <Gift className="h-4 w-4 text-accent" />
            </div>
            Bonus XP Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {plan.streakBonuses.map((bonus, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between text-sm p-2 rounded-lg bg-secondary/50 border border-border/50"
              >
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent/70" />
                  <span className="text-muted-foreground">{bonus.rule}</span>
                </div>
                <span className="font-bold text-accent">+{bonus.xp}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

    </div>
  )
}
