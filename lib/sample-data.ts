import { StudyPlan, UserProgress } from "./study-types"

// ─── XP & Level Calculations ────────────────────────────────────────────────

/**
 * Returns the total XP needed to reach a given level.
 * Formula: each level requires 200 * level XP from the previous threshold.
 */
export function getXPForCurrentLevel(level: number): number {
  if (level <= 1) return 0
  let total = 0
  for (let i = 1; i < level; i++) {
    total += i * 200
  }
  return total
}

/**
 * Returns the total XP threshold for the NEXT level up.
 */
export function getXPForNextLevel(level: number): number {
  return getXPForCurrentLevel(level) + level * 200
}

/**
 * Calculates what level a given XP total corresponds to.
 * Used whenever XP changes to check if the user levelled up.
 */
export function calculateLevel(xp: number): number {
  let level = 1
  while (xp >= getXPForNextLevel(level)) {
    level++
  }
  return level
}

// ─── Sample Study Plan ───────────────────────────────────────────────────────

/**
 * Demo study plan shown after the user clicks "Generate Study Plan".
 * In production this would be replaced by real AI-generated content.
 */
export const sampleStudyPlan: StudyPlan = {
  subject: "Introduction to Machine Learning",
  estimatedTotalMinutes: 180,
  totalXP: 760,

  units: [
    {
      id: "1",
      title: "ML Fundamentals",
      description: "What machine learning is, why it matters, and where it fits in AI.",
      estimatedMinutes: 45,
      completionBonus: 50,
      locked: false,
      tasks: [
        {
          id: "1-1",
          label: "Read: What is Machine Learning? (Overview + history)",
          type: "passive_review",
          xp: 20,
          estimatedMinutes: 15,
        },
        {
          id: "1-2",
          label: "Practice: Map out Supervised vs Unsupervised vs Reinforcement Learning",
          type: "active_recall",
          xp: 30,
          estimatedMinutes: 20,
        },
        {
          id: "1-3",
          label: "Quiz: ML Fundamentals (unlock next unit)",
          type: "quiz",
          xp: 60,
          estimatedMinutes: 10,
        },
      ],
    },
    {
      id: "2",
      title: "Linear Regression",
      description: "Predicting continuous values — the foundation of supervised learning.",
      estimatedMinutes: 55,
      completionBonus: 60,
      locked: true,
      tasks: [
        {
          id: "2-1",
          label: "Read: Simple & Multiple Linear Regression explained",
          type: "passive_review",
          xp: 20,
          estimatedMinutes: 15,
        },
        {
          id: "2-2",
          label: "Practice: Manually compute a regression line on sample data",
          type: "active_recall",
          xp: 35,
          estimatedMinutes: 25,
        },
        {
          id: "2-3",
          label: "Quiz: Linear Regression (unlock next unit)",
          type: "quiz",
          xp: 60,
          estimatedMinutes: 10,
        },
      ],
    },
    {
      id: "3",
      title: "Gradient Descent & Optimization",
      description: "How models actually learn — iterative weight updates to minimise loss.",
      estimatedMinutes: 50,
      completionBonus: 70,
      locked: true,
      tasks: [
        {
          id: "3-1",
          label: "Read: Gradient Descent — intuition and math",
          type: "passive_review",
          xp: 20,
          estimatedMinutes: 15,
        },
        {
          id: "3-2",
          label: "Practice: Trace gradient descent steps on a loss curve",
          type: "active_recall",
          xp: 40,
          estimatedMinutes: 25,
        },
        {
          id: "3-3",
          label: "Quiz: Gradient Descent (unlock next unit)",
          type: "quiz",
          xp: 60,
          estimatedMinutes: 10,
        },
      ],
    },
    {
      id: "4",
      title: "Model Evaluation",
      description: "Accuracy isn't everything — learn precision, recall, F1, and cross-validation.",
      estimatedMinutes: 40,
      completionBonus: 80,
      locked: true,
      tasks: [
        {
          id: "4-1",
          label: "Read: Metrics — accuracy, precision, recall, F1-score",
          type: "passive_review",
          xp: 20,
          estimatedMinutes: 15,
        },
        {
          id: "4-2",
          label: "Practice: Interpret a confusion matrix from a real dataset",
          type: "active_recall",
          xp: 45,
          estimatedMinutes: 20,
        },
        {
          id: "4-3",
          label: "Quiz: Model Evaluation (complete the course!)",
          type: "quiz",
          xp: 60,
          estimatedMinutes: 10,
        },
      ],
    },
  ],

  sessionMode: {
    minutesAvailable: 30,
    rationale:
      "You have time for one focused task. Start with Unit 1's reading, then attempt the quiz. Short sessions build momentum.",
  },

  streakBonuses: [
    { rule: "Study 3 days in a row", xp: 50 },
    { rule: "Complete a unit in one session", xp: 75 },
    { rule: "Score 100% on a quiz", xp: 100 },
    { rule: "Finish the full course", xp: 200 },
  ],
}

// ─── Sample User Progress ────────────────────────────────────────────────────

/**
 * Starting progress state for a new user session.
 */
export const sampleUserProgress: UserProgress = {
  level: 2,
  currentXP: 240,
  streak: 3,
  totalStudyMinutes: 45,
  completedTasks: [],
  completedUnits: [],
}
