"use client"

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Calendar, Loader2, ArrowRight, ArrowLeft, Music, CheckCircle2, ListFilter, Plus, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function NewSetlistContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bandId = searchParams.get("band");

  const [loading, setLoading] = useState(false);
  const [fetchingSongs, setFetchingSongs] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  
  // Song Selection State
  const [availableSongs, setAvailableSongs] = useState<any[]>([]);
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (bandId) {
      fetchSongs();
    }
  }, [bandId]);

  async function fetchSongs() {
    try {
      const response = await api.get(`/bands/${bandId}/songs`);
      setAvailableSongs(response.data.songs);
    } catch (err) {
      console.error("Failed to fetch songs", err);
    } finally {
      setFetchingSongs(false);
    }
  }

  const filteredSongs = availableSongs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function toggleSong(id: string) {
    setSelectedSongIds(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
     e.preventDefault();
     if (selectedSongIds.length === 0) {
        setError("Please select at least one song for the setlist.");
        return;
     }

     setLoading(true);
     setError("");

     try {
       // 1. Create the setlist
       const response = await api.post(`/bands/${bandId}/setlists`, { 
         title, 
         description, 
         date: date ? new Date(date).toISOString() : undefined 
       });
       
       const setlistId = response.data.id;

       // 2. Add selected songs in order
       for (let i = 0; i < selectedSongIds.length; i++) {
         await api.post(`/setlists/${setlistId}/songs`, {
           songId: selectedSongIds[i],
           position: i + 1
         });
       }
       
       setSuccess(true);
       setTimeout(() => router.push(`/setlists?band=${bandId}`), 1500);
     } catch (err: any) {
       setError(err.response?.data?.message || "Something went wrong. Please try again.");
     } finally {
       setLoading(false);
     }
  }

  return (
    <div className="container mx-auto px-6 py-12 pt-32 relative">
      <div className="portal-glow opacity-20" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto relative z-10"
      >
        <Link 
          href={`/setlists?band=${bandId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Gigs
        </Link>

        <div className="flex flex-col mb-10">
          <h1 className="text-5xl font-display font-bold tracking-tight mb-4">Build Your Roadmap</h1>
          <p className="text-muted-foreground text-lg">Define the flow, choose the songs, own the show.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Metadata */}
            <div className="lg:col-span-1 space-y-8">
                <div className="glass-card p-8 rounded-[2rem] border-white/5 space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground ml-1">Setlist Title</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                            placeholder="Friday Night Show"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground ml-1">Gig Date (Optional)</label>
                        <input 
                            type="date" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground ml-1">Description</label>
                        <textarea 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[120px] text-sm"
                            placeholder="Brief notes about this show..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || selectedSongIds.length === 0}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-2xl transition-all glow-primary flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed text-xl shadow-2xl"
                >
                    {loading ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                        <>
                            Create & Finalize
                            <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
                
                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl">
                        {error}
                    </div>
                )}
            </div>

            {/* Right Column: Song Selection */}
            <div className="lg:col-span-2 flex flex-col gap-6 relative">
                 {success && (
                    <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2.5rem] border border-white/5">
                        <CheckCircle2 size={64} className="text-green-500 mb-4 animate-bounce" />
                        <h3 className="text-3xl font-bold">Setlist Sync Complete!</h3>
                        <p className="text-muted-foreground mt-2">Time to prepare for the gig.</p>
                    </div>
                )}

                <div className="glass-card p-10 rounded-[2.5rem] border-white/5 flex flex-col gap-8">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <Music size={24} className="text-primary" />
                            Select Songs ({selectedSongIds.length})
                        </h3>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input 
                                type="text"
                                placeholder="Search library..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {fetchingSongs ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 size={32} className="text-primary animate-spin" />
                            </div>
                        ) : filteredSongs.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground italic">
                                No songs found in your library.
                            </div>
                        ) : (
                            filteredSongs.map(song => (
                                <div 
                                    key={song.id}
                                    onClick={() => toggleSong(song.id)}
                                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group ${selectedSongIds.includes(song.id) ? 'bg-primary/10 border-primary/50' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedSongIds.includes(song.id) ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground group-hover:bg-white/10'}`}>
                                            <Music size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold">{song.title}</p>
                                            <p className="text-xs text-muted-foreground">{song.artist}</p>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedSongIds.includes(song.id) ? 'bg-primary border-primary' : 'border-white/10'}`}>
                                        {selectedSongIds.includes(song.id) && <CheckCircle2 size={14} className="text-white" />}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function NewSetlistPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <NewSetlistContent />
    </Suspense>
  );
}
