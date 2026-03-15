"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Manual fallback to ensure the class is switched if next-themes is slow/buggy
  React.useEffect(() => {
    if (mounted) {
      const root = window.document.documentElement
      if (resolvedTheme === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }, [resolvedTheme, mounted])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
    console.log(`[ThemeToggle] Switching to: ${nextTheme}`)
    setTheme(nextTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 flex items-center justify-center rounded-full glass hover:bg-primary/10 transition-all duration-300"
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4">
        <Sun className="absolute inset-0 transition-all duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute inset-0 transition-all duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-violet-400" />
      </div>
    </button>
  )
}
