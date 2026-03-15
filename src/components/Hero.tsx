"use client"

import { motion } from "framer-motion"
import { Music, Users, Calendar, Sparkles } from "lucide-react"

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
      
      {/* Portal/Orb Visual Element */}
      <div className="portal-glow" />
      
      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen Band Management</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]"
          >
            Transform the Way <br />
            <span className="text-violet-glow italic underline decoration-primary/20 decoration-8 underline-offset-8">You Play</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-12 font-medium"
          >
            A high-performance command center for musicians. <br className="hidden md:block" />
            Sync your rehearsals, setlists, and dreams in one deep-sky interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <button className="px-10 py-4 bg-primary text-primary-foreground font-black rounded-full glow-violet hover:scale-105 transition-all duration-300">
              Get Started for Free —&gt;
            </button>
            <button className="px-10 py-4 glass text-foreground font-black rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all border-black/10 dark:border-white/10">
              Request a Demo
            </button>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-32 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl"
          >
            {[
              { icon: Music, label: "Setlist Hub", desc: "Craft seamless transitions" },
              { icon: Users, label: "Live Sync", desc: "Band-wide real-time state" },
              { icon: Calendar, label: "Gig Pulse", desc: "Active tour management" },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl flex flex-col items-center group hover:bg-primary/5 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 transition-all">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">{feature.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
