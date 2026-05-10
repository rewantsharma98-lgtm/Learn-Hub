import { useState } from "react";
import { Mail, KeyRound, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterUserMutation, useLoginUserMutation } from "@/features/api/authApi";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
  const { showAuthModal, closeAuthModal, pendingRoute } = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [loginUser,    { isLoading: isLoggingIn   }] = useLoginUserMutation();
  const isLoading = isRegistering || isLoggingIn;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      if (isSignup) {
        // ── Register ──────────────────────────────────────────────
        const res = await registerUser({ email, password }).unwrap();

        if (!res.success) {
          setErrorMsg(res.message || "Registration failed");
          return;
        }

        toast.success(res.message || "OTP sent! Check your email.", { id: "auth-toast" });
        closeAuthModal();
        navigate("/verify-otp", { state: { email } });

      } else {
        // ── Login ─────────────────────────────────────────────────
        const res = await loginUser({ email, password }).unwrap();

        if (!res.success) {
          // Handle soft failures (wrong password, not verified, etc.)
          if (res.notVerified) {
            closeAuthModal();
            navigate("/verify-otp", { state: { email } });
            toast.error("Please verify your email first.", { id: "auth-toast" });
          } else {
            setErrorMsg(res.message || "Invalid email or password");
          }
          return;
        }

        // Success — state is already updated via authApi.onQueryStarted
        toast.success("Welcome back! 🎉", { id: "auth-toast" });
        closeAuthModal();
        navigate(pendingRoute || "/");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMsg(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  if (!showAuthModal) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal(); }}
    >
      <div className="relative w-full max-w-[420px] bg-card border border-border rounded-3xl p-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-400 overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-primary/10 blur-[80px] rounded-full -z-10" />

        {/* Close */}
        <button
          onClick={closeAuthModal}
          className="absolute top-6 right-6 text-muted-foreground hover:text-white p-2 rounded-full hover:bg-muted transition-all"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white text-xs shadow-lg shadow-primary/30 mb-4">
            LH
          </div>
          <h2 className="text-white text-2xl font-black tracking-tight mb-1">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest">
            {isSignup ? "Start your learning journey" : "Sign in to your dashboard"}
          </p>
        </div>

        {/* Social */}
        <div className="mb-6">
          <button 
            type="button"
            onClick={() => {
              const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
              window.location.href = `${apiUrl}/api/auth/github`;
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-muted/40 border border-border rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all"
          >
            <FaGithub size={14} /> Continue with Github
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl text-white text-sm outline-none focus:border-primary transition-colors font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <KeyRound size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl text-white text-sm outline-none focus:border-primary transition-colors font-medium"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-red-400 text-[11px] font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl mt-2"
          >
            {isLoading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3">
          <button
            type="button"
            onClick={() => { setIsSignup(!isSignup); setErrorMsg(""); }}
            className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
          >
            {isSignup ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
          <p className="text-center text-[9px] text-muted-foreground/50 leading-relaxed uppercase tracking-tighter">
            By continuing you agree to our{" "}
            <span className="text-white cursor-pointer hover:underline">Terms</span>
            {" & "}
            <span className="text-white cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}