"use client"

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Music, Users, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, signedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !signedIn) {
      router.push("/login");
    }
  }, [loading, signedIn, router]);

  if (loading || !signedIn) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
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
        className="flex flex-col gap-8 relative z-10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold">Welcome, {user?.name.split(' ')[0]}! 🤘</h1>
            <p className="text-muted-foreground mt-2">Ready to rock? Here's what's happening with your bands.</p>
          </div>
          <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl glow-primary hover:bg-primary/90 transition-all flex items-center gap-2">
            <Music size={18} />
            Add New Song
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border-white/5 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-lg bg-vibrant-violet/20 flex items-center justify-center">
              <Users className="text-vibrant-violet w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Your Bands</h3>
            <p className="text-muted-foreground text-sm">You haven't joined any bands yet.</p>
            <button className="text-sm font-bold text-vibrant-violet hover:underline text-left mt-auto">Create or Join a Band</button>
          </div>

          <div className="glass-card p-6 rounded-2xl border-white/5 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-lg bg-vibrant-cyan/20 flex items-center justify-center">
              <Music className="text-vibrant-cyan w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Recent Songs</h3>
            <p className="text-muted-foreground text-sm">Your library is currently empty.</p>
            <button className="text-sm font-bold text-vibrant-cyan hover:underline text-left mt-auto">Browse Library</button>
          </div>

          <div className="glass-card p-6 rounded-2xl border-white/5 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-lg bg-vibrant-pink/20 flex items-center justify-center">
              <Calendar className="text-vibrant-pink w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Next Gig</h3>
            <p className="text-muted-foreground text-sm">No upcoming events scheduled.</p>
            <button className="text-sm font-bold text-vibrant-pink hover:underline text-left mt-auto">Schedule Event</button>
          </div>
        </div>

        <div className="glass-card p-8 rounded-2xl border-white/5 min-h-[300px] flex flex-col items-center justify-center text-center">
          <LayoutDashboard size={48} className="text-muted-foreground/20 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Kickstart Your Journey</h3>
          <p className="text-muted-foreground max-w-md">
            This is your workspace. Once you join a band and add some songs, you'll see your activity feed here.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
