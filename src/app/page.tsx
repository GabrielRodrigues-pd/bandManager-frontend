import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-background" />
    </main>
  );
}
