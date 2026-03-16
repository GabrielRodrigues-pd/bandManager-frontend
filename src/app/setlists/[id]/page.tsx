"use client"

import { useAuth } from "@/components/AuthProvider";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Music, ArrowLeft, Play, Calendar, Clock, Mic2, Star, ChevronLeft, ChevronRight, Eye, LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import Link from "next/link";
import { format } from "date-fns";

function SetlistDetailContent() {
  const { signedIn, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const bandId = searchParams.get("band");
  const setlistId = params.id as string;
  
  const [setlist, setSetlist] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [isPerformanceMode, setIsPerformanceMode] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  useEffect(() => {
    if (!loading && !signedIn) {
      router.push("/login");
      return;
    }

    if (signedIn && setlistId) {
      fetchSetlist();
    }
  }, [loading, signedIn, setlistId]);

  async function fetchSetlist() {
    try {
      const response = await api.get(`/setlists/${setlistId}`);
      setSetlist(response.data.setlist);
    } catch (err) {
      console.error("Failed to fetch setlist", err);
    } finally {
      setFetching(false);
    }
  }

  if (loading || fetching || !setlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentSong = setlist.songs[currentSongIndex]?.song;

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${isPerformanceMode ? 'bg-black' : ''}`}>
      {!isPerformanceMode && <div className="portal-glow opacity-10" />}

      <div className="container mx-auto px-6 py-12 pt-32 relative z-10">
        <AnimatePresence mode="wait">
            {!isPerformanceMode ? (
                <motion.div
                    key="standard-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-10"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="flex flex-col gap-4">
                            <Link 
                            href={`/setlists?band=${bandId}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group w-fit"
                            >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Setlists
                            </Link>
                            <h1 className="text-5xl font-display font-bold tracking-tight">{setlist.title}</h1>
                            <div className="flex items-center gap-6 mt-2">
                                {setlist.date && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar size={18} className="text-primary" />
                                        <span className="font-bold">{format(new Date(setlist.date), 'MMMM dd, yyyy')}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Music size={18} className="text-primary" />
                                    <span className="font-bold">{setlist.songs.length} Songs</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsPerformanceMode(true)}
                            className="px-10 py-5 bg-white text-black font-black rounded-2xl glow-white hover:scale-105 transition-all flex items-center gap-3 shadow-2xl"
                        >
                            <Eye size={24} />
                            Start Gig Mode
                        </button>
                    </div>

                    {/* Songs List */}
                    <div className="glass-card p-10 rounded-[3rem] border-white/5">
                        <div className="space-y-4">
                            {setlist.songs.map((item: any, index: number) => (
                                <motion.div 
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] hover:border-primary/20 transition-all group"
                                >
                                    <div className="flex items-center gap-6">
                                        <span className="text-3xl font-black text-muted-foreground/30 min-w-[40px] italic">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <div>
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{item.song.title}</h3>
                                            <p className="text-muted-foreground font-medium">{item.song.artist}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-10">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Key</span>
                                            <span className="text-primary font-black">{item.song.originalKey}</span>
                                        </div>
                                        <Link 
                                            href={`/songs/${item.songId}?band=${bandId}`}
                                            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                        >
                                            <Play size={20} fill="currentColor" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="performance-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="fixed inset-0 z-[100] bg-black p-10 flex flex-col pt-32"
                >
                    {/* Performance Navigation */}
                    <div className="flex items-center justify-between mb-16">
                        <button 
                            onClick={() => setIsPerformanceMode(false)}
                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-500/20 hover:text-red-500 transition-all"
                        >
                            End Gig
                        </button>
                        
                        <div className="flex items-center gap-6 text-2xl font-black">
                            <span className="text-muted-foreground">{currentSongIndex + 1}</span>
                            <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary transition-all duration-300" 
                                    style={{ width: `${((currentSongIndex + 1) / setlist.songs.length) * 100}%` }}
                                />
                            </div>
                            <span className="text-primary">{setlist.songs.length}</span>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setCurrentSongIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentSongIndex === 0}
                                className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button 
                                onClick={() => setCurrentSongIndex(prev => Math.min(setlist.songs.length - 1, prev + 1))}
                                disabled={currentSongIndex === setlist.songs.length - 1}
                                className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center hover:scale-110 transition-all shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] disabled:opacity-20 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </div>
                    </div>

                    {/* Central Performance Content */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                        <motion.div
                            key={currentSong?.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-12"
                        >
                            <div className="space-y-4">
                                <h1 className="text-8xl md:text-[10rem] font-display font-black tracking-tighter leading-none mb-6">
                                    {currentSong?.title}
                                </h1>
                                <p className="text-4xl md:text-5xl text-muted-foreground font-medium uppercase tracking-[0.3em]">
                                    {currentSong?.artist}
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-20 py-10 bg-white/5 rounded-[4rem] border border-white/5 max-w-4xl mx-auto px-20">
                                <div className="flex flex-col items-center">
                                    <span className="text-sm font-black text-muted-foreground uppercase tracking-[0.4em] mb-4">Live Key</span>
                                    <span className="text-9xl font-black text-primary tracking-tighter">{currentSong?.originalKey}</span>
                                </div>
                                <div className="w-px h-40 bg-white/10 hidden md:block" />
                                <div className="flex flex-col items-center">
                                    <span className="text-sm font-black text-muted-foreground uppercase tracking-[0.4em] mb-4">Up Next</span>
                                    <span className="text-4xl font-black text-white/50 italic truncate max-w-[300px]">
                                        {setlist.songs[currentSongIndex + 1]?.song.title || "END OF SHOW"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="py-10 text-center text-muted-foreground font-bold tracking-widest uppercase text-xs">
                        {activeBandName || "BandManager"} | Live Coordinator
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper to get band name from parent context if needed (would need state management update)
const activeBandName = "Os Antigravitacionais";

export default function SetlistDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SetlistDetailContent />
    </Suspense>
  );
}
