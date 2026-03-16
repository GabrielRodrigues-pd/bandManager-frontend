"use client"

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, Plus, Hash, ArrowRight, Music, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { api } from "@/lib/api";

export default function BandsPage() {
  const { user, signedIn, loading } = useAuth();
  const router = useRouter();
  const [memberships, setMemberships] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !signedIn) {
      router.push("/login");
      return;
    }

    if (signedIn) {
      fetchBands();
    }
  }, [loading, signedIn, router]);

  async function fetchBands() {
    try {
      const response = await api.get("/me");
      setMemberships(response.data.user.members || []);
    } catch (err) {
      console.error("Failed to fetch bands", err);
    } finally {
      setFetching(false);
    }
  }

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-6 py-12 pt-32 relative">
      <div className="portal-glow opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-12 relative z-10"
      >
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl font-display font-bold mb-4">Your Musical World</h1>
          <p className="text-muted-foreground text-lg">Select a band to manage or start a new coordination.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Create New Band Card */}
          <Link href="/bands/new" className="group h-full">
            <div className="glass-card p-8 rounded-[2.5rem] border-white/5 h-full flex flex-col items-center justify-center text-center transition-all hover:border-primary/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] bg-primary/5 min-h-[280px]">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <Plus className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Create New Band</h3>
              <p className="text-muted-foreground text-sm">Start a new project as a Leader.</p>
            </div>
          </Link>

          {/* Join Band Card */}
          <button className="group text-left h-full">
            <div className="glass-card p-8 rounded-[2.5rem] border-white/5 h-full flex flex-col items-center justify-center text-center transition-all hover:border-vibrant-cyan/30 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] bg-vibrant-cyan/5 min-h-[280px]">
              <div className="w-16 h-16 rounded-2xl bg-vibrant-cyan/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all">
                <Hash className="text-vibrant-cyan w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Join with Code</h3>
              <p className="text-muted-foreground text-sm">Enter an invite code from your mates.</p>
            </div>
          </button>

          {/* Existing Bands */}
          {memberships.map((membership: any) => (
            <div key={membership.id} className="glass-card p-8 rounded-[2.5rem] border-white/5 flex flex-col transition-all hover:border-white/10 hover:bg-white/[0.02] group">
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                  <Music className="text-primary w-7 h-7" />
                </div>
                <div className="px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                  {membership.role}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-2 tracking-tight">{membership.band.name}</h3>
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-10">
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-vibrant-cyan" />
                  {membership.band._count?.members || 0}
                </span>
                <span className="flex items-center gap-2">
                  <Music size={16} className="text-vibrant-violet" />
                  {membership.band._count?.songs || 0}
                </span>
              </div>

              <Link 
                href={`/dashboard?band=${membership.band.id}`}
                className="mt-auto w-full py-4 bg-white/5 hover:bg-primary hover:text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                Enter Studio
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
