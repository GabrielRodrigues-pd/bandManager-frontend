"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"
import { useAuth } from "./AuthProvider"
import { LayoutDashboard, LogOut, User } from "lucide-react"

const navLinks = [
  { name: "Product", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
]

export default function Navbar() {
  const { signedIn, user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="glass h-16 rounded-full border-white/10 shadow-2xl flex items-center justify-between px-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20" />
            <div className="w-32 h-6 bg-white/5 rounded-md" />
          </div>
          <div className="flex items-center gap-6">
            <div className="w-8 h-8 rounded-full bg-white/5" />
            <div className="w-24 h-8 bg-white/5 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

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
          <Link href="/" className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vibrant-violet to-primary flex items-center justify-center shadow-lg transform -rotate-6">
              <span className="text-primary-foreground font-black text-sm italic">BM</span>
            </div>
            <span className="font-bold tracking-tighter text-foreground hidden lg:block text-xl">BandManager</span>
          </Link>
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
            {signedIn && (
              <Link
                href="/dashboard"
                className="text-sm font-bold text-primary hover:text-primary/80 transition-all flex items-center gap-2"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-6 border-l border-white/10 pl-6 h-8">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-6">
              {signedIn ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                      <User size={14} className="text-primary" />
                    </div>
                    <span className="max-w-[80px] truncate">{(typeof user?.name === 'string' ? user.name : '').split(' ')[0] || 'User'}</span>
                  </div>
                  <button 
                    onClick={signOut}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-foreground hover:text-primary transition-colors">Log In</Link>
                  <Link href="/register" className="px-6 py-2.5 bg-foreground text-background text-xs font-black rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
