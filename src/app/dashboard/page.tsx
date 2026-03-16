"use client"

import { useAuth } from "@/components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { LayoutDashboard, Music, Users, Calendar, ArrowRight, Plus, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import Link from "next/link";

function DashboardContent() {
  const { user, signedIn, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bandId = searchParams.get("band");
  
  const [activeBand, setActiveBand] = useState<any>(null);
  const [fetchingBand, setFetchingBand] = useState(true);

  useEffect(() => {
    if (!loading && !signedIn) {
      router.push("/login");
      return;
    }

    if (signedIn && user) {
      const memberships = user.members || [];
      
      if (memberships.length === 0) {
        router.push("/bands");
        return;
      }

      const selected = bandId 
        ? memberships.find((m: any) => m.band.id === bandId)
        : memberships[0];

      if (!selected) {
        router.push("/bands");
        return;
      }

      setActiveBand(selected.band);
      setFetchingBand(false);
    }
  }, [loading, signedIn, user, bandId, router]);

  if (loading || fetchingBand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 pt-32 relative">
      <div className="portal-glow opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-10 relative z-10"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                 Active Studio
               </span>
               <Link href="/bands" className="text-xs text-muted-foreground hover:text-primary transition-colors">Change Band</Link>
            </div>
            <h1 className="text-5xl font-display font-bold tracking-tight">{activeBand.name}</h1>
            <p className="text-muted-foreground mt-3 text-lg">Current Coordination Hub. Ready to hit the stage?</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              <Settings size={18} />
              Band Settings
            </button>
            <button className="px-8 py-3.5 bg-primary text-white font-black rounded-2xl glow-primary hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xl">
              <Plus size={20} />
              New Setlist
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-[2rem] border-white/5 flex flex-col gap-6 group hover:border-vibrant-violet/20 transition-all">
            <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-vibrant-violet/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="text-vibrant-violet w-6 h-6" />
                </div>
                <span className="text-3xl font-black">{activeBand._count?.members || 0}</span>
            </div>
            <div>
                <h3 className="text-xl font-bold mb-1">Band Members</h3>
                <p className="text-muted-foreground text-sm">Syncing in real-time</p>
            </div>
            <button className="text-sm font-bold text-vibrant-violet hover:underline text-left mt-2 flex items-center gap-1 group/btn">
                Manage Members
                <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="glass-card p-8 rounded-[2rem] border-white/5 flex flex-col gap-6 group hover:border-vibrant-cyan/20 transition-all">
            <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-vibrant-cyan/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Music className="text-vibrant-cyan w-6 h-6" />
                </div>
                <span className="text-3xl font-black">{activeBand._count?.songs || 0}</span>
            </div>
            <div>
                <h3 className="text-xl font-bold mb-1">Song Library</h3>
                <p className="text-muted-foreground text-sm">Your artistic repertoire</p>
            </div>
            <button className="text-sm font-bold text-vibrant-cyan hover:underline text-left mt-2 flex items-center gap-1 group/btn">
                Open Repertoire
                <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="glass-card p-8 rounded-[2rem] border-white/5 flex flex-col gap-6 group hover:border-vibrant-pink/20 transition-all">
            <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-vibrant-pink/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="text-vibrant-pink w-6 h-6" />
                </div>
                <span className="text-3xl font-black">0</span>
            </div>
            <div>
                <h3 className="text-xl font-bold mb-1">Upcoming Gigs</h3>
                <p className="text-muted-foreground text-sm">Scheduled performances</p>
            </div>
            <button className="text-sm font-bold text-vibrant-pink hover:underline text-left mt-2 flex items-center gap-1 group/btn">
                View Schedule
                <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-card p-10 rounded-[2.5rem] border-white/5 min-h-[400px] flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
                
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-bold tracking-tight">Recent Activity</h3>
                    <button className="text-sm font-bold text-muted-foreground hover:text-white transition-colors">See All</button>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <LayoutDashboard size={32} className="text-muted-foreground/30" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">No ripples yet</h4>
                    <p className="text-muted-foreground max-w-xs">
                        Start by adding a song or creating your first setlist. Your band's heartbeat will show up here.
                    </p>
                    <button className="mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all border border-white/5">
                        Add Your First Song
                    </button>
                </div>
            </div>

            <div className="glass-card p-10 rounded-[2.5rem] border-white/5 flex flex-col">
                <h3 className="text-2xl font-bold mb-8 tracking-tight">Active Setlist</h3>
                
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-black/20 rounded-3xl border border-white/5">
                    <Music size={40} className="text-muted-foreground/20 mb-4" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        No active setlist for tonight. Time to prepare the next show!
                    </p>
                    <button className="mt-6 text-primary font-bold hover:underline text-sm">Create Setlist</button>
                </div>
                
                <div className="mt-10">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Quick Links</h4>
                    <div className="flex flex-col gap-2">
                        {['Metronome', 'Tuner', 'Files'].map((link) => (
                            <button key={link} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all group">
                                <span className="font-bold">{link}</span>
                                <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
