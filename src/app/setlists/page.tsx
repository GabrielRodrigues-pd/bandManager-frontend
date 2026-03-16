"use client"

import { useAuth } from "@/components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Calendar, Plus, Search, Filter, ArrowLeft, ArrowRight, Music, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import Link from "next/link";
import { format } from "date-fns";

function SetlistsListContent() {
  const { signedIn, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bandId = searchParams.get("band");
  
  const [setlists, setSetlists] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && !signedIn) {
      router.push("/login");
      return;
    }

    if (!bandId) {
      router.push("/bands");
      return;
    }

    if (signedIn) {
      fetchSetlists();
    }
  }, [loading, signedIn, bandId, router]);

  async function fetchSetlists() {
    try {
      const response = await api.get(`/bands/${bandId}/setlists`);
      setSetlists(response.data.setlists);
    } catch (err) {
      console.error("Failed to fetch setlists", err);
    } finally {
      setFetching(false);
    }
  }

  const filteredSetlists = setlists.filter(setlist => 
    setlist.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 pt-32 relative">
      <div className="portal-glow opacity-20" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-10 relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
             <Link 
              href={`/dashboard?band=${bandId}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group w-fit"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <h1 className="text-5xl font-display font-bold tracking-tight">Setlists & Gigs</h1>
            <p className="text-muted-foreground text-lg italic">Plan your pulse, dominate the stage.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href={`/setlists/new?band=${bandId}`}
              className="px-8 py-3.5 bg-primary text-white font-black rounded-2xl glow-primary hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xl"
            >
              <Plus size={20} />
              New Setlist
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input 
            type="text" 
            placeholder="Search setlists..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Setlists Grid */}
        {filteredSetlists.length === 0 ? (
          <div className="glass-card p-20 rounded-[3rem] border-white/5 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Calendar size={40} className="text-primary/50" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Clear Schedule</h3>
            <p className="text-muted-foreground max-w-sm mb-10 text-lg leading-relaxed">
              No setlists planned yet. Create your first gig roadmap.
            </p>
            <Link 
                href={`/setlists/new?band=${bandId}`}
                className="px-10 py-4 bg-primary text-white font-black rounded-2xl glow-primary hover:scale-105 transition-all shadow-xl"
            >
                Create My First Setlist
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSetlists.map((setlist) => (
              <motion.div
                key={setlist.id}
                whileHover={{ y: -5 }}
                className="glass-card p-8 rounded-[2rem] border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Calendar size={28} className="text-primary/70" />
                    </div>
                    {setlist.date && (
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Performance Date</span>
                            <div className="px-3 py-1 bg-white/5 rounded-lg font-bold text-sm">
                                {format(new Date(setlist.date), 'MMM dd, yyyy')}
                            </div>
                        </div>
                    )}
                 </div>

                 <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{setlist.title}</h3>
                 <p className="text-muted-foreground text-sm line-clamp-2 mb-8 h-10">
                    {setlist.description || "No description provided."}
                 </p>

                 <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                            <Music size={14} className="text-primary" />
                            Dynamic Set
                        </div>
                    </div>
                    <Link 
                        href={`/setlists/${setlist.id}?band=${bandId}`}
                        className="flex items-center gap-2 text-sm font-black text-primary hover:text-primary/80 transition-all group/link"
                    >
                        View Details
                        <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                 </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function SetlistsListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SetlistsListContent />
    </Suspense>
  );
}
