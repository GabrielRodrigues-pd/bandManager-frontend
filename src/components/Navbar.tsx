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
      className="fixed top-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4"
    >
      <div className="glass h-16 rounded-full flex items-center justify-between px-10 border-white/10 shadow-2xl relative overflow-hidden">
        {/* Subtle Animated border glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-vibrant-violet/20 via-transparent to-vibrant-cyan/20 opacity-50" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vibrant-violet to-primary flex items-center justify-center shadow-lg transform -rotate-6">
            <span className="text-primary-foreground font-black text-sm italic">BM</span>
          </div>
          <span className="font-bold tracking-tighter text-foreground hidden lg:block text-xl">BandManager</span>
        </div>

        <div className="flex items-center gap-10 relative z-10">
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-bold text-muted-foreground hover:text-foreground transition-all hover:scale-105"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6 border-l border-white/10 pl-6 h-8">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-6">
              <button className="text-sm font-bold text-foreground hover:text-primary transition-colors">Log In</button>
              <button className="px-6 py-2.5 bg-foreground text-background text-xs font-black rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                Join Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
