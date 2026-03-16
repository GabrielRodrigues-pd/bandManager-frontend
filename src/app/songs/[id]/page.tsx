"use client"

import { useAuth } from "@/components/AuthProvider";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Music, ArrowLeft, ArrowRight, Play, Mic2, Star, ChevronLeft, ChevronRight, Settings, Download, Share2, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import Link from "next/link";

function SongDetailContent() {
  const { signedIn, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const bandId = searchParams.get("band");
  const songId = params.id as string;
  
  const [song, setSong] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [targetKey, setTargetKey] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !signedIn) {
      router.push("/login");
      return;
    }

    if (signedIn && songId) {
      fetchSong();
    }
  }, [loading, signedIn, songId, targetKey]);

  async function fetchSong() {
    try {
      const url = targetKey 
        ? `/songs/${songId}?targetKey=${encodeURIComponent(targetKey)}` 
        : `/songs/${songId}`;
      const response = await api.get(url);
      setSong(response.data);
      if (!targetKey) setTargetKey(response.data.originalKey);
    } catch (err) {
      console.error("Failed to fetch song", err);
    } finally {
      setFetching(false);
    }
  }

  const keys = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

  function handleTranspose(direction: "up" | "down") {
    if (!targetKey) return;
    const currentIndex = keys.indexOf(targetKey.replace("m", ""));
    let nextIndex = direction === "up" ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex > 11) nextIndex = 0;
    if (nextIndex < 0) nextIndex = 11;
    
    const isMinor = targetKey.endsWith("m");
    setTargetKey(keys[nextIndex] + (isMinor ? "m" : ""));
  }

  if (loading || fetching || !song) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 pt-32 relative">
      <div className="portal-glow opacity-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-8 relative z-10"
      >
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
            <Link 
              href={`/songs?band=${bandId}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Library
            </Link>
            
            <div className="flex items-center gap-4">
                <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-muted-foreground hover:text-white">
                    <Share2 size={20} />
                </button>
                <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-muted-foreground hover:text-white">
                    <Download size={20} />
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold">
                    <Edit2 size={18} />
                    Edit Song
                </button>
            </div>
        </div>

        {/* Header Section */}
        <div className="glass-card p-10 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-vibrant-violet flex items-center justify-center shadow-2xl transform -rotate-3">
                    <Music size={48} className="text-white" />
                </div>
                <div>
                    <h1 className="text-5xl font-display font-bold tracking-tight mb-2">{song.title}</h1>
                    <p className="text-2xl text-muted-foreground font-medium">{song.artist}</p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 bg-black/40 p-6 rounded-[2rem] border border-white/5 min-w-[240px]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Transpose Key</span>
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => handleTranspose("down")}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
                    >
                        <ChevronLeft size={20} className="group-hover:text-white" />
                    </button>
                    <div className="flex flex-col items-center w-16">
                        <span className="text-4xl font-black text-primary tracking-tighter">{targetKey}</span>
                        {song.transposed && (
                            <span className="text-[10px] text-vibrant-cyan font-bold animate-pulse">TRANSPOSED</span>
                        )}
                    </div>
                    <button 
                        onClick={() => handleTranspose("up")}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
                    >
                        <ChevronRight size={20} className="group-hover:text-white" />
                    </button>
                </div>
                <button 
                    onClick={() => {
                        setTargetKey(song.originalKey);
                    }}
                    disabled={!song.transposed}
                    className="text-xs font-bold text-muted-foreground hover:text-primary disabled:opacity-0 transition-all"
                >
                    Reset to Original ({song.originalKey})
                </button>
            </div>
        </div>

        {/* Song Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
            <div className="lg:col-span-3 glass-card p-12 rounded-[2.5rem] border-white/5 relative bg-white/[0.01]">
                {/* Visual Guidelines */}
                <div className="absolute left-6 top-10 bottom-10 w-px bg-white/5 hidden md:block" />
                
                <pre className="font-mono text-lg whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-primary/30 selection:text-white pl-0 md:pl-10">
                    {/* Fancy formatting for chords in brackets */}
                    {song.content.split('\n').map((line: string, i: number) => {
                        const chordRegex = /\[([^\]]+)\]/g;
                        const parts = line.split(chordRegex);
                        const chords = line.match(chordRegex);
                        
                        if (!chords) return <div key={i} className="min-h-[1.5em]">{line}</div>;

                        return (
                            <div key={i} className="min-h-[2.5em] flex flex-wrap items-end relative py-1">
                                {parts.map((part, pi) => {
                                    // If part is a chord (every other part starting from index 1)
                                    if (pi % 2 === 1) {
                                        return (
                                            <span key={pi} className="text-primary font-black scale-110 px-0.5 bg-primary/5 rounded border-b-2 border-primary/20 mr-1">
                                                {part}
                                            </span>
                                        );
                                    }
                                    return <span key={pi}>{part}</span>;
                                })}
                            </div>
                        );
                    })}
                </pre>
            </div>

            <div className="flex flex-col gap-6">
                <div className="glass-card p-8 rounded-[2rem] border-white/5">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Settings size={18} className="text-primary" />
                        Quick View Settings
                    </h3>
                    <div className="space-y-6">
                         <div>
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-3">Font Size</span>
                            <div className="flex gap-2">
                                {['Small', 'Medium', 'Large'].map(size => (
                                    <button key={size} className="flex-1 py-2 bg-white/5 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all">
                                        {size}
                                    </button>
                                ))}
                            </div>
                         </div>
                         <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-sm font-bold">Auto-Scroll</span>
                            <div className="w-10 h-5 bg-white/10 rounded-full relative p-1 cursor-pointer">
                                <div className="w-3 h-3 bg-muted-foreground rounded-full" />
                            </div>
                         </div>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[2rem] border-white/5 bg-primary/5 flex flex-col items-center justify-center text-center py-12 border-primary/10">
                    <Star size={32} className="text-primary mb-4" />
                    <h4 className="text-lg font-bold mb-2">Favorite this Song</h4>
                    <p className="text-xs text-muted-foreground mb-6">Pinned songs appear first in your coordinator.</p>
                    <button className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all">
                        Add to Favorites
                    </button>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SongDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SongDetailContent />
    </Suspense>
  );
}
