"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { UserPlus, Eye, EyeOff, Loader2, ArrowRight, User } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/register", {
        name,
        email,
        password,
      });

      // After successful registration, redirect to login
      // We could also auto-login here, but let's keep it simple for now
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="portal-glow" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 rounded-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-vibrant-cyan/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <UserPlus className="text-vibrant-cyan w-6 h-6" />
          </div>
          <h1 className="text-3xl font-display font-bold text-center">Join the Band</h1>
          <p className="text-muted-foreground text-center mt-2">
            Create your account and start managing.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg mb-6 flex items-center animate-in fade-in zoom-in duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block ml-1 text-muted-foreground">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-vibrant-cyan/50 transition-all placeholder:text-muted-foreground/30"
                placeholder="Axl Rose"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block ml-1 text-muted-foreground">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-vibrant-cyan/50 transition-all placeholder:text-muted-foreground/30"
              placeholder="vocalist@band.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block ml-1 text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-vibrant-cyan/50 transition-all placeholder:text-muted-foreground/30"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 ml-1">
              Must be at least 6 characters long.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-vibrant-cyan hover:bg-vibrant-cyan/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-sm text-muted-foreground">
            Already a member?{" "}
            <Link href="/login" className="text-vibrant-cyan font-bold hover:underline">
              Enter the Stage
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
