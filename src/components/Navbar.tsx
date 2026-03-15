"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"

const navLinks = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "About", href: "#" },
]

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
    >
      <div className="glass h-14 rounded-full flex items-center justify-between px-6 border-black/10 dark:border-white/10 shadow-xl dark:shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-xs">BM</span>
          </div>
          <span className="font-bold tracking-tight text-foreground hidden sm:block">BandManager</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button className="text-sm font-bold text-foreground hidden sm:block">Log In</button>
          <button className="px-5 py-2 bg-foreground text-background text-xs font-bold rounded-full hover:opacity-90 transition-opacity">
            Start Free
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
