import Courses from "./student/Courses";
import HeroSection from "./student/HeroSection";
import FeaturesSection from "./student/FeaturesSection";
import Testimonials from "./student/Testimonials";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Courses />
      <FeaturesSection />
      <Testimonials />
      
    </main>
  );
}