import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterUserMutation, useLoginUserMutation } from "@/features/api/authApi";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();
  const isLoading = isRegistering || isLoggingIn;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      if (isSignup) {
        const res = await registerUser({ email, password }).unwrap();
        if (!res.success) {
          setErrorMsg(res.message || "Registration failed");
          return;
        }
        toast.success(res.message || "OTP sent! Check your email.");
        navigate("/verify-otp", { state: { email } });
      } else {
        const res = await loginUser({ email, password }).unwrap();
        if (!res.success) {
          if (res.notVerified) {
            navigate("/verify-otp", { state: { email } });
            toast.error("Please verify your email first.");
          } else {
            setErrorMsg(res.message || "Invalid email or password");
          }
          return;
        }
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  const handleGithubLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    window.location.href = `${apiUrl}/api/auth/github`;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 subtle-noise" />
      
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[360px] relative z-10"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white mb-2">
            {isSignup ? "Create an account" : "Log in to LearnHub"}
          </h1>
          <p className="text-sm text-white/50">
            {isSignup ? "Enter your email below to create your account" : "Welcome back! Please enter your details."}
          </p>
        </div>

        <button 
          onClick={handleGithubLogin}
          className="w-full h-10 bg-[#1A1A1A] border border-white/10 rounded-lg text-sm text-white font-medium hover:bg-[#222222] transition-colors flex items-center justify-center gap-2 mb-6"
        >
          <FaGithub className="w-4 h-4" />
          Continue with GitHub
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/30 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/70">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-[#0A0A0A] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-white/70">Password</label>
              {!isSignup && <button type="button" onClick={() => navigate("/forgot-password")} className="text-xs text-primary hover:text-primary-hover transition-colors">Forgot password?</button>}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-[#0A0A0A] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                required
              />
            </div>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-400 text-xs font-medium text-center"
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            disabled={isLoading}
            className="w-full h-10 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            {isLoading && <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsSignup(!isSignup); setErrorMsg(""); }}
            className="text-xs text-white/50 hover:text-white transition-colors"
          >
            {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}