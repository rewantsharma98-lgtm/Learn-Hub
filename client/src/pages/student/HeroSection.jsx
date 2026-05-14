import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
} from "lucide-react";

export default function HeroSection() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  return (
    <section className="relative overflow-hidden bg-background pt-24 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* LEFT CONTENT */}
        <div className="max-w-xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-primary" />

            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/70">
              Polytechnic Learning Platform
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[2.6rem] sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.95] text-white"
          >
            Study smarter.
            <br />
            <span className="text-white/35">
              Learn faster.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-white/50 text-base md:text-lg leading-relaxed max-w-lg"
          >
            LearnHub helps polytechnic students manage lectures,
            notes, assignments and progress in one modern workspace.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mt-10"
          >

            <button
              onClick={() => navigate("/courses")}
              className="h-12 px-6 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
            >
              Explore Courses
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() =>
                navigate(user ? "/my-courses" : "/login")
              }
              className="h-12 px-6 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white text-sm font-medium hover:bg-white/[0.06] transition-all"
            >
              {user ? "Open Dashboard" : "Sign In"}
            </button>

          </motion.div>

        </div>

        {/* RIGHT UI PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative w-full max-w-sm mx-auto lg:max-w-none"
        >

          {/* Glow */}
          <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-40" />

          <div className="relative rounded-[2rem] border border-white/[0.06] bg-[#0B0B0B] overflow-hidden shadow-[0_0_80px_rgba(255,115,0,0.08)]">

            {/* Top Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">

              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/30 font-semibold">
                  LearnHub Workspace
                </p>

                <h3 className="text-2xl font-semibold text-white mt-2 tracking-tight">
                  Applied Physics-II
                </h3>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-primary fill-primary/20" />
              </div>

            </div>

            {/* Main Lecture Card */}
            <div className="p-6">

              <div className="rounded-3xl border border-white/[0.05] bg-[#0F0F0F] p-6">

                <div className="flex items-start justify-between mb-8">

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 font-semibold mb-3">
                      Current Lecture
                    </p>

                    <h4 className="text-3xl font-semibold text-white tracking-tight leading-tight">
                      Wave Motion
                    </h4>

                    <p className="text-white/35 text-sm mt-3">
                      Unit 1 • Lecture 04
                    </p>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-semibold uppercase tracking-widest">
                    Live
                  </div>

                </div>

                {/* Progress */}
                <div className="space-y-3">

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/40">
                      Progress
                    </span>

                    <span className="text-sm font-semibold text-white">
                      72%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full w-[72%] rounded-full bg-primary" />
                  </div>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}