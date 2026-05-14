import { Link } from "react-router-dom";
import Logo from "./ui/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-black/60 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg border border-primary/30 bg-primary/10 flex items-center justify-center">
            <Logo className="w-4 h-4 text-primary" />
          </div>

          <span className="text-white font-semibold tracking-tight text-sm">
            LearnHub
          </span>

          <div className="hidden md:block w-1 h-1 rounded-full bg-white/10" />

          <span className="hidden md:block text-[10px] uppercase tracking-[0.25em] text-white/20 font-semibold">
            Academic OS
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-[11px] font-medium">
          <Link
            to="/courses"
            className="text-white/30 hover:text-white transition-colors"
          >
            Curriculum
          </Link>

          <Link
            to="/my-courses"
            className="text-white/30 hover:text-white transition-colors"
          >
            Dashboard
          </Link>

          <a
            href="#"
            className="text-white/30 hover:text-white transition-colors"
          >
            Privacy
          </a>
        </div>

        {/* Copyright */}
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/15">
          © {new Date().getFullYear()} LearnHub
        </div>
      </div>
    </footer>
  );
}