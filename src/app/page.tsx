import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="relative">
      <Hero />
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-background" />
    </div>
  );
}
