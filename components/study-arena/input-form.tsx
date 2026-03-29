"use client"

import { useState, useCallback, useEffect } from "react"
import { Upload, FileText, Sparkles, X, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface InputFormProps {
  onGenerate: () => void
  isGenerating?: boolean
}

// Steps shown in the loading animation while AI "processes" the input
const LOADING_STEPS = [
  "Analyzing your content...",
  "Breaking down topics...",
  "Generating study tasks...",
  "Creating quiz questions...",
  "Building your study plan...",
]

// Accepted file types for the upload zone
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]

/**
 * InputForm — landing page form where users paste a syllabus or upload files.
 * Switches to a loading animation while the study plan is being "generated".
 */
export function InputForm({ onGenerate, isGenerating = false }: InputFormProps) {
  const [syllabus, setSyllabus] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)

  // Cycle through loading steps while generating
  // NOTE: Fixed — original code used useState() instead of useEffect() here
  useEffect(() => {
    if (!isGenerating) return
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length)
    }, 500)
    return () => clearInterval(interval)
  }, [isGenerating])

  // ── Drag & Drop Handlers ──────────────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      ACCEPTED_MIME_TYPES.includes(f.type)
    )
    setUploadedFiles((prev) => [...prev, ...files])
  }, [])

  // ── File Input ────────────────────────────────────────────────────────────

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Generate button is enabled only when there's something to process
  const canGenerate = syllabus.trim().length > 0 || uploadedFiles.length > 0

  // ── Loading State ─────────────────────────────────────────────────────────

  if (isGenerating) {
    return (
      <Card className="border-primary/30 bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardContent className="py-16">
          <div className="flex flex-col items-center text-center">

            {/* Spinner */}
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-4 border-primary/20 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary animate-spin" style={{ animationDuration: "3s" }} />
              </div>
              <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-transparent border-t-primary animate-spin" />
            </div>

            <h3 className="mt-8 text-xl font-bold">Generating Your Study Plan</h3>

            {/* Step-by-step checklist animation */}
            <div className="mt-6 space-y-2 w-full max-w-xs">
              {LOADING_STEPS.map((step, i) => (
                <div
                  key={step}
                  className={cn(
                    "flex items-center gap-2 text-sm transition-all duration-300",
                    i < loadingStep && "text-primary",
                    i === loadingStep && "text-foreground",
                    i > loadingStep && "text-muted-foreground/50"
                  )}
                >
                  {i < loadingStep ? (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  ) : i === loadingStep ? (
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-muted shrink-0" />
                  )}
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── Default State ─────────────────────────────────────────────────────────

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          Create Your Study Plan
        </CardTitle>
        <CardDescription className="text-base">
          Paste your syllabus or upload lecture files. StudyBuddy will generate a personalized, gamified study plan.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Syllabus text input */}
        <Textarea
          placeholder={`Paste your syllabus, chapter names, or topics here...\n\nExample:\nChapter 1: Introduction to Machine Learning\n- What is ML?\n- Supervised vs Unsupervised Learning\n\nChapter 2: Linear Regression\n- Gradient Descent`}
          className="min-h-[180px] resize-none bg-input/50 border-border/50 focus:border-primary/50 transition-colors"
          value={syllabus}
          onChange={(e) => setSyllabus(e.target.value)}
        />

        {/* Drag & drop upload zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer",
            isDragging
              ? "border-primary bg-primary/10 scale-[1.02]"
              : "border-border/50 hover:border-primary/50 hover:bg-secondary/30"
          )}
        >
          <div className={cn(
            "mx-auto flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
            isDragging ? "bg-primary/20" : "bg-secondary"
          )}>
            <Upload className={cn("h-6 w-6 transition-colors", isDragging ? "text-primary" : "text-muted-foreground")} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Drag and drop files here, or{" "}
            <label className="cursor-pointer text-primary hover:underline font-medium">
              browse
              <input
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.docx,.txt"
                onChange={handleFileSelect}
              />
            </label>
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground/70">Supports PDF, DOCX, TXT</p>
        </div>

        {/* Uploaded file list */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-secondary/50 border border-border/50 px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="rounded-lg p-2 hover:bg-destructive/20 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Generate button */}
        <Button
          onClick={onGenerate}
          disabled={!canGenerate}
          className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          size="lg"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Study Plan
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Your content is processed securely and never stored
        </p>
      </CardContent>
    </Card>
  )
}
