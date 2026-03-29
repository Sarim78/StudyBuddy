/**
 * study-types.ts
 * All shared TypeScript types for StudyBuddy.
 * Import these wherever you need typed data structures.
 */

// The three kinds of tasks a unit can have
export type TaskType = "passive_review" | "active_recall" | "quiz"

// A single study task inside a unit
export interface Task {
  id: string
  label: string           // e.g. "Read Chapter 1: What is ML?"
  type: TaskType
  xp: number             // XP awarded on completion
  estimatedMinutes: number
  completed?: boolean    // set dynamically at runtime
}

// A unit groups related tasks under one topic
export interface Unit {
  id: string
  title: string
  description: string
  tasks: Task[]
  estimatedMinutes: number
  completionBonus: number  // bonus XP for finishing all tasks in the unit
  locked: boolean          // locked units require passing the previous quiz
}

// Describes the recommended study session for today
export interface SessionMode {
  minutesAvailable: number
  rationale: string
}

// Bonus XP rules shown in the sidebar
export interface StreakBonus {
  rule: string
  xp: number
}

// The full study plan generated for a subject
export interface StudyPlan {
  subject: string
  units: Unit[]
  estimatedTotalMinutes: number
  totalXP: number
  sessionMode: SessionMode
  streakBonuses: StreakBonus[]
}

// The user's live progress state
export interface UserProgress {
  level: number
  currentXP: number
  streak: number              // days in a row the user has studied
  totalStudyMinutes: number
  completedTasks: string[]    // array of task IDs
  completedUnits: string[]    // array of unit IDs
}
