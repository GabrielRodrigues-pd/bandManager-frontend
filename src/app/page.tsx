import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-background" />
      
      <Footer />
    </main>
  );
}
