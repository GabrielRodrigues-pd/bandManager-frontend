"use client";

import { motion } from "framer-motion";
import { Music, Users, Calendar, Sparkles, AudioLines } from "lucide-react";

const FloatingParticle = ({ delay = 0, style = {} }) => (
  <motion.div
    initial={{ y: 0, opacity: 0 }}
    animate={{
      y: [-20, 20, -20],
      opacity: [0.2, 0.8, 0.2],
      scale: [1, 1.5, 1],
    }}
    transition={{
      duration: 5 + Math.random() * 5,
      repeat: Infinity,
      delay,
    }}
    className="musical-particle"
    style={style}
  />
);

const Orb = ({ className = "", color = "bg-primary" }) => (
  <motion.div
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
      rotate: [0, 360],
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      ease: "linear",
    }}
    className={`absolute rounded-full blur-[100px] mix-blend-screen opacity-50 ${color} ${className}`}
  />
);

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-10" />

      {/* Glowing Orbs - Inspired by Zata reference */}
      <Orb
        className="w-[600px] h-[600px] top-[-10%] left-[-10%]"
        color="bg-vibrant-violet"
      />
      <Orb
        className="w-[500px] h-[500px] bottom-[10%] right-[-5%]"
        color="bg-vibrant-cyan"
      />
      <Orb
        className="w-[400px] h-[400px] top-[20%] right-[10%]"
        color="bg-vibrant-pink"
      />

      {/* Central Portal Glow */}
      <div className="portal-glow" />

      {/* Floating Particles (Musical Sparkles) */}
      {Array.from({ length: 20 }).map((_, i) => (
        <FloatingParticle
          key={i}
          delay={Math.random() * 5}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10 py-32 md:py-48">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-vibrant-violet/30 bg-vibrant-violet/10 text-vibrant-violet text-xs font-bold mb-10 backdrop-blur-md glow-primary"
          >
            <AudioLines className="w-4 h-4 animate-pulse" />
            <span>Next-Gen Band Management</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.8] relative"
          >
            <span className="block">Transform the</span>
            <span className="block">
              Way <span className="text-vibrant-glow italic">You Play</span>
            </span>

            {/* Subtle light arc below heading */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-vibrant-cyan to-transparent blur-[2px] opacity-50" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-2xl max-w-2xl mb-16 font-medium tracking-tight leading-relaxed"
          >
            A high-performance command center for bands.{" "}
            <br className="hidden md:block" />
            Sync your rehearsals, setlists, and dreams in a rhythmic interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 mb-20 md:mb-32"
          >
            <button className="px-12 py-5 bg-primary text-primary-foreground font-black rounded-full glow-primary hover:scale-105 transition-all duration-300 shadow-xl border border-white/20">
              Get Started for Free
            </button>
            <button className="px-12 py-5 glass text-foreground font-black rounded-full hover:bg-white/10 dark:hover:bg-black/20 transition-all border-black/10 dark:border-white/10 flex items-center gap-2">
              <Music className="w-5 h-5" />
              Watch Demo
            </button>
          </motion.div>

          {/* Feature Grid with increased spacing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-20 md:mt-32 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-6xl"
          >
            {[
              {
                icon: Music,
                label: "Setlist Hub",
                desc: "Craft seamless transitions",
                color: "text-vibrant-violet",
              },
              {
                icon: Users,
                label: "Live Sync",
                desc: "Band-wide real-time state",
                color: "text-vibrant-cyan",
              },
              {
                icon: Calendar,
                label: "Gig Pulse",
                desc: "Active tour management",
                color: "text-vibrant-pink",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-card p-10 rounded-[2.5rem] flex flex-col items-center group hover:-translate-y-2 transition-all border-white/5 relative overflow-hidden"
              >
                {/* Internal Card Glow */}
                <div
                  className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity ${feature.color.replace("text", "bg")}`}
                />

                <div
                  className={`w-16 h-16 rounded-2xl bg-white/5 dark:bg-black/20 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all`}
                >
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-2xl mb-3 tracking-tight">
                  {feature.label}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-center">
                  {feature.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
