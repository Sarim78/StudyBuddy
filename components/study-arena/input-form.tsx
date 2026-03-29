"use client"

import { useState, useCallback, useEffect } from "react"
import { Upload, FileText, X, Loader2 } from "lucide-react"
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
  "Reading your input…",
  "Building your plan…",
  "Preparing your dashboard…",
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
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="py-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
            <h3 className="mt-6 text-lg font-semibold">Generating plan</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {LOADING_STEPS[loadingStep]}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── Default State ─────────────────────────────────────────────────────────

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">Generate a study plan</CardTitle>
        <CardDescription className="text-base">
          Paste topics or upload files.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Option A */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Option A
          </p>
          <p className="text-xs text-muted-foreground">Paste text</p>
        </div>

        {/* Syllabus text input */}
        <Textarea
          placeholder="Paste your syllabus, chapter list, or topics…"
          className="min-h-[176px] resize-none bg-input/50 border-border/50 focus:border-primary/50"
          value={syllabus}
          onChange={(e) => setSyllabus(e.target.value)}
        />

        {/* OR divider (keeps inputs close while clarifying choice) */}
        <div className="flex items-center gap-4 py-1">
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-xs font-medium text-muted-foreground uppercase">or</span>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        {/* Option B */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Option B
          </p>
          <p className="text-xs text-muted-foreground">Upload files</p>
        </div>

        {/* Drag & drop upload zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border/50 hover:border-primary/50 hover:bg-secondary/30"
          )}
        >
          <div className={cn(
            "mx-auto flex h-12 w-12 items-center justify-center rounded-xl",
            isDragging ? "bg-primary/20" : "bg-secondary"
          )}>
            <Upload className={cn("h-6 w-6 transition-colors", isDragging ? "text-primary" : "text-muted-foreground")} />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Drop files here, or{" "}
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
          <p className="mt-2 text-xs text-muted-foreground/70">Supports PDF, DOCX, TXT</p>
        </div>

        {/* Uploaded file list */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-secondary/50 border border-border/50 px-4 py-3"
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
          className="w-full h-12 text-base font-semibold"
          size="lg"
          style={{ marginTop: 24 }}
        >
          Generate plan
        </Button>
      </CardContent>
    </Card>
  )
}
