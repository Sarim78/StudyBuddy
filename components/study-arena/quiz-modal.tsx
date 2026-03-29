"use client"

import { useState, useEffect } from "react"
import { HelpCircle, CheckCircle2, XCircle, Trophy, Target, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
}

interface QuizModalProps {
  open: boolean
  onClose: () => void
  onComplete: (passed: boolean) => void
  unitTitle: string
}

// ─── Sample Questions ─────────────────────────────────────────────────────────
// In production, these would be dynamically generated per unit by the AI.

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "What is the main difference between supervised and unsupervised learning?",
    options: [
      "Supervised learning uses labeled data, unsupervised does not",
      "Unsupervised learning is faster than supervised",
      "Supervised learning only works with images",
      "There is no difference",
    ],
    correctIndex: 0,
  },
  {
    question: "Which of the following is NOT a common ML task type?",
    options: ["Classification", "Regression", "Compilation", "Clustering"],
    correctIndex: 2,
  },
  {
    question: "What does the ML pipeline typically include?",
    options: [
      "Only model training",
      "Data collection, preprocessing, training, and evaluation",
      "Just data visualization",
      "Hardware setup only",
    ],
    correctIndex: 1,
  },
]

const PASS_THRESHOLD = 2  // correct answers needed out of 3 to pass

/**
 * QuizModal — a 3-question multiple-choice quiz shown when clicking a quiz task.
 *
 * Flow:
 * 1. User answers each question → immediate feedback shown
 * 2. After last question → results screen (passed / needs review)
 * 3. Passing unlocks the next unit and awards XP
 */
export function QuizModal({ open, onClose, onComplete, unitTitle }: QuizModalProps) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const question = QUIZ_QUESTIONS[currentQ]
  const progressPercent = ((currentQ + 1) / QUIZ_QUESTIONS.length) * 100
  const isCorrect = selectedAnswer === question.correctIndex
  const passed = correctCount >= PASS_THRESHOLD

  // Reset all state each time the modal opens
  useEffect(() => {
    if (open) {
      setCurrentQ(0)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setCorrectCount(0)
      setQuizDone(false)
      setShowConfetti(false)
    }
  }, [open])

  // Handle answer selection — lock answer and show immediate feedback
  const handleSelectAnswer = (index: number) => {
    if (showFeedback) return  // prevent re-selecting after answer is locked
    setSelectedAnswer(index)
    setShowFeedback(true)
    if (index === question.correctIndex) {
      setCorrectCount((prev) => prev + 1)
    }
  }

  // Advance to next question, or finish quiz
  const handleNext = () => {
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setQuizDone(true)
      // Final correct count isn't updated yet — check if this last answer was correct
      const finalCorrect = correctCount + (isCorrect ? 1 : 0)
      if (finalCorrect >= PASS_THRESHOLD) setShowConfetti(true)
    }
  }

  // Called when the user clicks "Continue" or "Try Again Later"
  const handleComplete = () => {
    onComplete(passed)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg overflow-hidden">

        {/* Confetti particles on pass */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ["#22c55e", "#eab308", "#3b82f6", "#ec4899"][Math.floor(Math.random() * 4)],
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
              <HelpCircle className="h-4 w-4 text-accent" />
            </div>
            Quiz: {unitTitle}
          </DialogTitle>
          <DialogDescription>
            Answer at least {PASS_THRESHOLD} out of {QUIZ_QUESTIONS.length} questions correctly to pass and unlock the next unit.
          </DialogDescription>
        </DialogHeader>

        {/* ── Active Quiz ── */}
        {!quizDone ? (
          <div className="space-y-6">

            {/* Progress bar + score */}
            <div>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Question {currentQ + 1} of {QUIZ_QUESTIONS.length}</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  {correctCount} correct
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            {/* Question text */}
            <div className="rounded-xl bg-secondary/50 p-6 border border-border/50">
              <p className="text-base font-medium leading-relaxed">{question.question}</p>
            </div>

            {/* Answer options */}
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={showFeedback}
                  className={cn(
                    "w-full rounded-xl border p-6 text-left text-sm transition-all",
                    !showFeedback && "hover:border-primary/50 hover:bg-secondary/30 cursor-pointer border-border/50",
                    showFeedback && idx === question.correctIndex && "border-primary bg-primary/10",
                    showFeedback && selectedAnswer === idx && idx !== question.correctIndex && "border-destructive bg-destructive/10",
                    showFeedback && selectedAnswer !== idx && idx !== question.correctIndex && "border-border/50 opacity-60"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Letter label (A, B, C, D) */}
                      <div className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                        showFeedback && idx === question.correctIndex && "bg-primary text-primary-foreground",
                        showFeedback && selectedAnswer === idx && idx !== question.correctIndex && "bg-destructive text-destructive-foreground",
                        !showFeedback && "bg-secondary text-muted-foreground"
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span>{option}</span>
                    </div>
                    {/* Correct / wrong icons */}
                    {showFeedback && idx === question.correctIndex && (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    )}
                    {showFeedback && selectedAnswer === idx && idx !== question.correctIndex && (
                      <XCircle className="h-5 w-5 text-destructive shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Feedback banner + next button */}
            {showFeedback && (
              <>
                <div className={cn(
                  "rounded-xl p-4 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2",
                  isCorrect ? "bg-primary/10 border border-primary/30" : "bg-destructive/10 border border-destructive/30"
                )}>
                  {isCorrect ? (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary">Correct!</p>
                        <p className="text-muted-foreground">Great job, keep it up!</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/20">
                        <XCircle className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="font-semibold text-destructive">Not quite</p>
                        <p className="text-muted-foreground">The correct answer is highlighted above.</p>
                      </div>
                    </>
                  )}
                </div>
                <Button onClick={handleNext} className="w-full h-11" size="lg">
                  {currentQ < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "See Results"}
                </Button>
              </>
            )}
          </div>
        ) : (
          // ── Results Screen ──
          <div className="py-8 text-center animate-in fade-in zoom-in-95">
            {passed ? (
              <>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/30">
                  <Trophy className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="mt-6 text-2xl font-bold">Quiz Passed!</h3>
                <p className="mt-2 text-muted-foreground">
                  You got {correctCount} out of {QUIZ_QUESTIONS.length} correct
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-5 py-2.5 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-bold text-lg">+60 XP earned</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Next unit is now unlocked!</p>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
                  <Target className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-2xl font-bold">Keep Practicing</h3>
                <p className="mt-2 text-muted-foreground">
                  You got {correctCount} out of {QUIZ_QUESTIONS.length} correct.
                  <br />Review the material and try again!
                </p>
              </>
            )}
            <Button onClick={handleComplete} className="mt-8 w-full h-11" size="lg">
              {passed ? "Continue" : "Try Again Later"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
