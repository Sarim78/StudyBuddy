"use client"

import { useState } from "react"
import { InputForm } from "@/components/study-arena/input-form"
import { StudyDashboard } from "@/components/study-arena/study-dashboard"
import { Trophy, Zap, Target, Flame, BookOpen, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Feature Cards ────────────────────────────────────────────────────────────
// Displayed on the landing page to explain the value proposition.

const FEATURES = [
  {
    icon: Zap,
    label: "Earn XP",
    desc: "Complete tasks to level up",
    hoverBorder: "hover:border-primary/50",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
  {
    icon: Flame,
    label: "Build Streaks",
    desc: "Stay consistent, earn bonuses",
    hoverBorder: "hover:border-accent/50",
    iconBg: "bg-accent/20",
    iconColor: "text-accent",
  },
  {
    icon: Target,
    label: "Take Quizzes",
    desc: "Test your knowledge",
    hoverBorder: "hover:border-chart-3/50",
    iconBg: "bg-chart-3/20",
    iconColor: "text-chart-3",
  },
  {
    icon: Trophy,
    label: "Level Up",
    desc: "Track your progress",
    hoverBorder: "hover:border-chart-4/50",
    iconBg: "bg-chart-4/20",
    iconColor: "text-chart-4",
  },
]

// ─── How It Works Steps ───────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Upload Content",
    desc: "Paste your syllabus or upload lecture files",
    icon: BookOpen,
  },
  {
    step: "2",
    title: "AI Generates Plan",
    desc: "Our AI breaks down topics into bite-sized tasks",
    icon: Sparkles,
  },
  {
    step: "3",
    title: "Learn & Level Up",
    desc: "Complete tasks, take quizzes, earn XP",
    icon: Trophy,
  },
]

// ─── Page Component ───────────────────────────────────────────────────────────

export default function HomePage() {
  // Controls whether to show the landing page or the study dashboard
  const [showDashboard, setShowDashboard] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Simulates AI generation (replace with real API call in production)
  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setShowDashboard(true)
    }, 2500)
  }

  // After generation, render the full study dashboard
  if (showDashboard) {
    return <StudyDashboard onReset={() => setShowDashboard(false)} />
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">

      {/* ── Ambient Background Blobs ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* ── Top Navigation ── */}
      <nav className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">StudyBuddy</span>
          </div>

          {/* Badge pills */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-primary" />
              AI-Powered
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-accent" />
              Gamified
            </span>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <div className="mx-auto max-w-5xl px-4 pt-16 pb-8 text-center">

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered Study Planning</span>
          <ArrowRight className="h-3 w-3" />
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <span className="text-balance">Master Any Subject</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Level Up Your Learning
          </span>
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-balance leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          Upload your syllabus or lecture notes. StudyBuddy creates a personalized
          study plan with XP rewards, streaks, and interactive quizzes.
        </p>

        {/* Feature cards */}
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {FEATURES.map((feature) => (
            <div
              key={feature.label}
              className={cn(
                "group relative rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm",
                "transition-all hover:border-border hover:bg-card hover:scale-[1.02]",
                feature.hoverBorder
              )}
            >
              <div className={cn("mx-auto flex h-11 w-11 items-center justify-center rounded-lg transition-transform group-hover:scale-110", feature.iconBg)}>
                <feature.icon className={cn("h-5 w-5", feature.iconColor)} />
              </div>
              <h3 className="mt-3 font-semibold">{feature.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Input / Generate Section ── */}
      <div className="mx-auto max-w-2xl px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
        <InputForm onGenerate={handleGenerate} isGenerating={isGenerating} />
      </div>

      {/* ── How It Works ── */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold mb-8">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map((item, i) => (
            <div key={item.step} className="relative">
              {/* Connector line between steps (desktop only) */}
              {i < 2 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-border to-transparent" />
              )}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary border border-border">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="mt-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 py-6 text-center text-sm text-muted-foreground">
        <p>StudyBuddy — Transform your learning with AI-powered study plans</p>
      </footer>
    </div>
  )
}
