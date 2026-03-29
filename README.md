# 🎓 StudyBuddy: AI-Powered Study Plans

> Transform your study sessions with AI-generated study plans, gamified learning, XP rewards, and progress tracking.

> 🏆 Built as a hackathon project

<div align="center">

### 🌐 [Live Demo → studybuddybeta.vercel.app](https://studybuddybeta.vercel.app/)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-studybuddybeta.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://studybuddybeta.vercel.app/)

</div>

---

## 🚀 What It Does

StudyBuddy takes your syllabus or lecture notes and generates a **personalized, gamified study plan** in seconds:

- **AI Breaks Down Your Content** → Units, tasks, and quizzes are auto-generated from your input
- **Earn XP & Level Up** → Every task completed awards XP; accumulate enough to level up
- **Build Streaks** → Study daily to maintain streaks and earn bonus XP
- **Take Quizzes** → Pass unit quizzes to unlock the next topic
- **Track Progress** → Live sidebar shows your level, streak, time studied, and course completion

---

## 🛠 Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Framework  | Next.js 15 (App Router)                 |
| Language   | TypeScript                              |
| Styling    | Tailwind CSS v4                         |
| UI         | shadcn/ui (Radix UI primitives)         |
| Icons      | Lucide React                            |
| Fonts      | Geist (via next/font)                   |
| Deployment | Vercel                                  |

---

## 📁 Project Structure

```
StudyBuddy/
├── app/
│   ├── globals.css         # Design tokens (colours, animations)
│   ├── layout.tsx          # Root layout + fonts + metadata
│   └── page.tsx            # Landing page
│
├── components/
│   ├── study-arena/
│   │   ├── header.tsx          # Sticky nav with level + streak
│   │   ├── input-form.tsx      # Syllabus input + file upload
│   │   ├── study-dashboard.tsx # Main study screen (state lives here)
│   │   ├── unit-card.tsx       # Collapsible unit with tasks
│   │   ├── task-item.tsx       # Individual study task row
│   │   ├── sidebar-stats.tsx   # XP, streak, progress sidebar
│   │   └── quiz-modal.tsx      # Multiple-choice quiz dialog
│   └── ui/                     # Base UI components (shadcn/ui)
│
└── lib/
    ├── utils.ts            # cn() class merging helper
    ├── study-types.ts      # TypeScript types for all data structures
    └── sample-data.ts      # Demo study plan + XP level calculations
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Sarim78/studybuddy.git
cd studybuddy

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in your browser
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🔧 Setup Instructions

### Dependencies

All dependencies are installed automatically via `npm install`. Key packages:

| Package | Purpose |
|---------|---------|
| `next` | React framework (App Router) |
| `tailwindcss` + `@tailwindcss/postcss` | Styling |
| `lucide-react` | Icons |
| `@radix-ui/*` | Accessible UI primitives |
| `class-variance-authority` | Component variants |
| `clsx` + `tailwind-merge` | Class name utilities |

---

## 🎯 Hackathon Demo Flow

1. **Landing page** — paste in a topic or click Generate with sample content
2. **Loading screen** — watch the AI "analyze" steps tick by
3. **Study dashboard** — check off tasks, see XP animate in the header
4. **Take a quiz** — click any quiz task to open the modal
5. **Pass the quiz** — watch the next unit unlock and the level-up overlay fire

---

## 🔮 Future Roadmap

- [ ] Real AI integration (Claude API) for dynamic study plan generation
- [ ] Persistent user accounts + progress storage
- [ ] Mobile app (React Native)
- [ ] Multiplayer study rooms / leaderboards
- [ ] Spaced repetition scheduling

---

## 👥 Team

| Name | Role |
|------|------|
| Sarim Siddiqui | Developer |
| Anas Jamal | Developer |

---

*Built for the hackathon: StudyBuddy team 🚀*
