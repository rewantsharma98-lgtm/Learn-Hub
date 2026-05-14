import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CTASection() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  return (
    <section className="py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="layer-surface rounded-2xl p-12 md:p-20 text-center relative overflow-hidden flex flex-col items-center">
          
          <div className="absolute inset-0 subtle-noise" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40vw] h-[40vw] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight mb-6">
              Start your <br />
              <span className="text-white/40">academic legacy.</span>
            </h2>
            <p className="text-white/50 text-base mb-10 max-w-sm mx-auto">
              Join the elite group of students who have optimized their academic workflow.
            </p>
            
            <button
              onClick={() => navigate(user ? "/my-courses" : "/login")}
              className="h-12 px-8 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors shadow-xl"
            >
              {user ? "Go to Dashboard" : "Create Account"}
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}
