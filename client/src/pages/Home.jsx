import HeroSection from "./student/HeroSection";
import FeaturesSection from "./student/FeaturesSection";
import Testimonials from "./student/Testimonials";
import CTASection from "./student/CTASection";

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      {/* Editorial Noise & Grain is handled in index.css */}
      
      <HeroSection />

      {/* Feature Storytelling */}
      <FeaturesSection />

      {/* Social Proof */}
      <Testimonials />

      {/* Conversion point */}
      <CTASection />
    </main>
  );
}