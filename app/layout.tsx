import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// ─── Fonts ───────────────────────────────────────────────────────────────────
// Geist is loaded via next/font (zero layout shift, auto-optimised).
// We assign CSS variables so Tailwind's font-sans / font-mono picks them up.

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

// ─── Page Metadata ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "StudyBuddy — AI-Powered Study Plans",
  description:
    "Transform your study sessions with AI-generated study plans, gamified learning, XP rewards, and progress tracking.",
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {/* Vercel Analytics — remove if not deploying to Vercel */}
        <Analytics />
      </body>
    </html>
  )
}
