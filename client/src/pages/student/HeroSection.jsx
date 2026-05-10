import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function HeroSection() {
  const navigate = useNavigate();

  // ✅ AUTH STATE (single source of truth)
  const user = useSelector((state) => state.auth.user);

  return (
    <section className="bg-[#1a1a1a] min-h-screen flex flex-col items-center justify-center pt-32 pb-24 px-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      
      <div className="text-center max-w-4xl mx-auto flex flex-col items-center relative z-10">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#2a2a2a] border border-white/5 text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-8">
          The Future of Online Learning
        </div>

        <h1 className="text-white text-5xl md:text-[84px] font-black leading-tight mb-8 tracking-tighter">
          Your Academic Semester Hub
        </h1>

        <p className="text-[#9ca3af] text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
          Access high-quality syllabus-compliant lectures, detailed unit notes, and academic resources for your entire degree. Organized by semesters to help you excel.
        </p>

        {/* ✅ AUTH-AWARE BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-32">

          {/* Always visible */}
          <button
            onClick={() => navigate("/courses")}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-10 py-3.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/10"
          >
            Explore Courses
          </button>

          {/* Conditional button */}
          {user ? (
            <button
              onClick={() => navigate("/my-courses")}
              className="w-full sm:w-auto bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-white/5 px-10 py-3.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
            >
              My Courses
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-white/5 px-10 py-3.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
            >
              Sign In
            </button>
          )}

        </div>
      </div>

      {/* Verification Strip */}
      <div className="max-w-7xl w-full mx-auto mt-20 relative z-10">
        <div className="bg-[#111] border border-white/5 rounded-3xl p-8 flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
          <VerificationItem label="Syllabus Compliant" />
          <VerificationItem label="University Verified" />
          <VerificationItem label="Semester Structured" />
          <VerificationItem label="Downloadable Notes" />
        </div>
      </div>
    </section>
  );
}

function VerificationItem({ label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
      <span className="text-white text-[10px] font-black uppercase tracking-[0.25em]">{label}</span>
    </div>
  );
}