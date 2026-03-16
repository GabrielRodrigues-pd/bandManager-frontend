"use client"

import { useAuth } from "@/components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Music, Plus, Search, Filter, ArrowLeft, ArrowRight, Play, Mic2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import Link from "next/link";

function SongsListContent() {
  const { signedIn, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bandId = searchParams.get("band");
  
  const [songs, setSongs] = useState<any[]>([]);
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
      fetchSongs();
    }
  }, [loading, signedIn, bandId, router]);

  async function fetchSongs() {
    try {
      const response = await api.get(`/bands/${bandId}/songs`);
      setSongs(response.data.songs);
    } catch (err) {
      console.error("Failed to fetch songs", err);
    } finally {
      setFetching(false);
    }
  }

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-5xl font-display font-bold tracking-tight">Song Library</h1>
            <p className="text-muted-foreground text-lg italic">Your repertoire, organized for performance.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href={`/songs/new?band=${bandId}`}
              className="px-8 py-3.5 bg-primary text-white font-black rounded-2xl glow-primary hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xl"
            >
              <Plus size={20} />
              Add Song
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search by title or artist..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
            <Filter size={20} />
            Filters
          </button>
        </div>

        {/* Songs Grid/List */}
        {filteredSongs.length === 0 ? (
          <div className="glass-card p-20 rounded-[3rem] border-white/5 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Music size={40} className="text-primary/50" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Silent Library</h3>
            <p className="text-muted-foreground max-w-sm mb-10 text-lg leading-relaxed">
              No songs found. Start your collection by adding your first masterpiece.
            </p>
            <Link 
                href={`/songs/new?band=${bandId}`}
                className="px-10 py-4 bg-primary text-white font-black rounded-2xl glow-primary hover:scale-105 transition-all shadow-xl"
            >
                Add My First Song
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map((song) => (
              <motion.div
                key={song.id}
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-[2rem] border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Mic2 size={24} className="text-primary/70" />
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Original Key</span>
                        <div className="px-3 py-1 bg-primary/10 rounded-lg text-primary font-bold text-sm">
                            {song.originalKey}
                        </div>
                    </div>
                 </div>

                 <h3 className="text-2xl font-bold mb-1 truncate pr-8 group-hover:text-primary transition-colors">{song.title}</h3>
                 <p className="text-muted-foreground font-medium mb-8 text-lg truncate">{song.artist}</p>

                 <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            Popular
                        </div>
                    </div>
                    <Link 
                        href={`/songs/${song.id}?band=${bandId}`}
                        className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                        <Play size={18} fill="currentColor" />
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

export default function SongsListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SongsListContent />
    </Suspense>
  );
}
