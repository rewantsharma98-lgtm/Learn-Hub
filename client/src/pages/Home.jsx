import HeroSection from "./student/HeroSection";
import CTASection from "./student/CTASection";

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      {/* Editorial Noise & Grain is handled in index.css */}
      
      <HeroSection />

      {/* Conversion point */}
      <CTASection />
    </main>
  );
}