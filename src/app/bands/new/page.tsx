"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Music, Loader2, ArrowRight, ArrowLeft, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";

export default function NewBandPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  const { user } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/bands", { name });
      router.push("/bands");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-32 pb-12 relative overflow-hidden">
      <div className="portal-glow" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-10 rounded-[2.5rem] relative z-10"
      >
        <Link 
          href="/bands"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Selection
        </Link>

        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 glow-primary">
            <Plus className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-bold text-center tracking-tight">Birth a Project</h1>
          <p className="text-muted-foreground text-center mt-3 leading-relaxed">
            Give your new coordination a name and start syncing.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl mb-8 animate-in fade-in zoom-in duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-bold mb-2 block ml-1 text-muted-foreground">
              Band Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30 text-lg font-medium"
              placeholder="e.g. The Moon Junkies"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4.5 rounded-2xl transition-all glow-primary flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed text-lg shadow-xl"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Initialize Band
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center border-t border-white/5 pt-8">
          <p className="text-sm text-muted-foreground">
            You will automatically become the <span className="text-primary font-bold">Leader</span> of this band.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
