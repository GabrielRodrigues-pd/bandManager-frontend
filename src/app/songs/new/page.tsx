"use client"

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Music, Loader2, ArrowRight, ArrowLeft, Plus, Globe, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function NewSongContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bandId = searchParams.get("band");

  const [mode, setMode] = useState<"manual" | "import">("import");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Manual Form State
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [originalKey, setOriginalKey] = useState("");
  const [content, setContent] = useState("");

  // Import State
  const [url, setUrl] = useState("");
  const [rawText, setRawText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
     e.preventDefault();
     setLoading(true);
     setError("");
     setSuccess(false);

     try {
       if (mode === "manual") {
         await api.post("/songs", { title, artist, originalKey, content, bandId });
       } else {
         await api.post("/songs/import", { url, rawText, bandId });
       }
       
       setSuccess(true);
       setTimeout(() => router.push(`/songs?band=${bandId}`), 1500);
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
        className="max-w-3xl mx-auto relative z-10"
      >
        <Link 
          href={`/songs?band=${bandId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Library
        </Link>

        <div className="flex flex-col mb-10">
          <h1 className="text-5xl font-display font-bold tracking-tight mb-4">Add to Repertoire</h1>
          <p className="text-muted-foreground text-lg">Manual entry or intelligent import? Your choice.</p>
        </div>

        {/* Mode Selector */}
        <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl mb-10 w-fit">
            <button 
                onClick={() => setMode("import")}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${mode === "import" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
            >
                <Globe size={18} />
                Intelligent Import
            </button>
            <button 
                onClick={() => setMode("manual")}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${mode === "manual" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
            >
                <FileText size={18} />
                Manual Entry
            </button>
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden">
            {success && (
                <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-500">
                    <CheckCircle2 size={64} className="text-green-500 mb-4 animate-bounce" />
                    <h3 className="text-3xl font-bold">Song Syncing!</h3>
                    <p className="text-muted-foreground mt-2">Redirecting to your library...</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <AnimatePresence mode="wait">
                    {mode === "import" ? (
                        <motion.div 
                            key="import"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-muted-foreground ml-1">Cifra Club / Ultimate Guitar URL</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={20} />
                                    <input 
                                        type="url" 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-lg"
                                        placeholder="https://www.cifraclub.com.br/banda/musica/"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/10"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#0a0a0a] px-4 text-muted-foreground font-black tracking-widest">OR PASTE TEXT</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-muted-foreground ml-1">Raw Lyrics & Chords</label>
                                <textarea 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[300px] font-mono text-sm leading-relaxed"
                                    placeholder="[C] Lyric [G] line..."
                                    value={rawText}
                                    onChange={(e) => setRawText(e.target.value)}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="manual"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-muted-foreground ml-1">Song Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 px-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-lg"
                                        placeholder="Space Oddity"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-muted-foreground ml-1">Artist</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 px-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-lg"
                                        placeholder="David Bowie"
                                        value={artist}
                                        onChange={(e) => setArtist(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-muted-foreground ml-1">Original Key</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-40 bg-white/5 border border-white/10 rounded-2xl py-4.5 px-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-black text-center text-xl uppercase tracking-tighter"
                                    placeholder="C#m"
                                    value={originalKey}
                                    onChange={(e) => setOriginalKey(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-muted-foreground ml-1">Content (Markdown with Chords)</label>
                                <textarea 
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[300px] font-mono text-sm leading-relaxed"
                                    placeholder="[Verse 1]\n[G] Ground Control to [C] Major Tom..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-5 rounded-2xl mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-2xl transition-all glow-primary flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed text-xl shadow-2xl"
                >
                    {loading ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                        <>
                            Add to Library
                            <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function NewSongPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <NewSongContent />
    </Suspense>
  );
}
