"use client"

import { Facebook, Instagram, Twitter, Music2, Mail, Github } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-32 md:mt-48 pb-12 overflow-hidden">
      {/* Footer Soundwave Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-primary/10 blur-[60px] rounded-full -z-10" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vibrant-violet to-primary flex items-center justify-center">
                <span className="text-primary-foreground font-black text-xs italic">BM</span>
              </div>
              <span className="font-bold tracking-tighter text-foreground text-xl">BandManager</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The high-performance command center for bands. Organize rehearsals, craft setlists, and sync your musical dreams.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full glass hover:bg-primary/20 transition-colors">
                <Twitter className="w-4 h-4 text-vibrant-cyan" />
              </a>
              <a href="#" className="p-2 rounded-full glass hover:bg-primary/20 transition-colors">
                <Instagram className="w-4 h-4 text-vibrant-pink" />
              </a>
              <a href="#" className="p-2 rounded-full glass hover:bg-primary/20 transition-colors">
                <Facebook className="w-4 h-4 text-vibrant-violet" />
              </a>
              <a href="#" className="p-2 rounded-full glass hover:bg-primary/20 transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Setlist Hub</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Live Sync</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Gig Pulse</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Our Mission</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">Subscribe to get the latest stage tips and updates.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary/50 flex-1"
              />
              <button className="p-2 rounded-full bg-primary hover:scale-105 transition-transform">
                <Mail className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} BandManager. Built for those who play loud.
          </p>
          <div className="flex gap-8 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
