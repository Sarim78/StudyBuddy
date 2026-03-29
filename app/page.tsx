"use client"

import Image from "next/image"
import { useState } from "react"
import { InputForm } from "@/components/study-arena/input-form"
import { StudyDashboard } from "@/components/study-arena/study-dashboard"
import { Trophy, FileText, Wand2, CheckCircle2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── Feature Cards ────────────────────────────────────────────────────────────
// Displayed on the landing page to explain the value proposition.

const FEATURES = [
  {
    icon: BookOpen,
    label: "Turn any syllabus into tasks",
    desc: "A clear checklist you can finish",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
  },
  {
    icon: CheckCircle2,
    label: "Study in short sessions",
    desc: "Focused work you can fit into your day",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
  },
  {
    icon: Trophy,
    label: "See progress at a glance",
    desc: "XP, streaks, and what’s next",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
  },
]

const HOW_IT_WORKS = [
  {
    icon: FileText,
    title: "Add your material",
    desc: "Paste a syllabus or upload notes.",
  },
  {
    icon: Wand2,
    title: "Get a plan",
    desc: "A week-by-week checklist, ready to execute.",
  },
  {
    icon: CheckCircle2,
    title: "Work the list",
    desc: "Check off tasks and track progress.",
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
    <div className="min-h-screen bg-background">

      {/* ── Top Navigation ── */}
      <nav className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-6 lg:px-16 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden bg-card">
              <Image
                src="/StudyLogo.png"
                alt="StudyBuddy logo"
                width={36}
                height={36}
                className="h-9 w-9 object-cover"
                priority
              />
            </div>
            <span className="text-lg font-bold tracking-tight">StudyBuddy</span>
          </div>

          <Button asChild size="sm">
            <a href="#plan">Start studying</a>
          </Button>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-16 text-center">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Overview
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Turn your syllabus into a weekly study plan
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] text-sm text-muted-foreground leading-relaxed">
            Paste topics or upload notes. Get a clear checklist with quizzes and progress tracking.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <a href="#plan">Start studying</a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#how">See how it works</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-border/40 bg-card/30 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-16">
          <div className="text-center">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Features
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Everything you need to stay on track
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-sm text-muted-foreground leading-relaxed">
              Paste topics or upload notes. Get a clear checklist with quizzes and progress tracking.
            </p>
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-3 text-left">
            {FEATURES.map((feature) => (
              <div
                key={feature.label}
                className="rounded-xl border border-border/50 bg-card/60 p-6"
              >
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg", feature.iconBg)}>
                  <feature.icon className={cn("h-5 w-5", feature.iconColor)} />
                </div>
                <h3 className="mt-4 font-semibold">{feature.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="border-t border-border/40 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-16">
          <div className="text-center">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              How it works
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">How it works</h2>
            <p className="mx-auto mt-4 max-w-[520px] text-sm text-muted-foreground leading-relaxed">
              Three steps from raw material to a plan you can follow.
            </p>
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={step.title} className="relative">
                {/* Connector (desktop) */}
                {idx < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[calc(100%+12px)] w-6 h-px bg-border/50" />
                )}
                <div className="rounded-xl border border-border/50 bg-card/60 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
                      <step.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Step {idx + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Generate a study plan ── */}
      <section className="border-t border-border/40 bg-card/30 py-16 md:py-24">
        <div id="plan" className="mx-auto max-w-2xl px-6">
          <div className="text-center">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Get started
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Generate a study plan</h2>
            <p className="mx-auto mt-4 max-w-[520px] text-sm text-muted-foreground leading-relaxed">
              Paste topics or upload files.
            </p>
          </div>
          <div className="mt-12">
            <InputForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12">
        <div className="mx-auto max-w-5xl px-6 lg:px-16 flex items-center justify-between text-sm text-muted-foreground">
          <span>StudyBuddy</span>
          <a className="hover:text-foreground transition-colors" href="#plan">Start studying</a>
        </div>
      </footer>
    </div>
  )
}
