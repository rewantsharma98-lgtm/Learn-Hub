import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, X, Leaf } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterUserMutation, useLoginUserMutation } from "@/features/api/authApi";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

export default function AuthModal() {
  const { showAuthModal, closeAuthModal, pendingRoute } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");

  const navigate = useNavigate();

  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();
  const isLoading = isRegistering || isLoggingIn;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      if (isSignup) {
        if (!semester || (!["1", "2"].includes(semester) && !department)) {
           setErrorMsg("Please select your semester and department");
           return;
        }
        const res = await registerUser({ email, password, semester, department }).unwrap();
        if (!res.success) {
          setErrorMsg(res.message || "Registration failed");
          return;
        }
        toast.success("Identity profile created. Check email for code.");
        closeAuthModal();
        navigate("/verify-otp", { state: { email } });
      } else {
        const payload = { email, password };
        if (semester) payload.semester = semester;
        if (department) payload.department = department;

        const res = await loginUser(payload).unwrap();
        if (!res.success) {
          if (res.notVerified) {
            closeAuthModal();
            navigate("/verify-otp", { state: { email } });
            toast.error("Verification required.");
          } else {
            setErrorMsg(res.message || "Invalid credentials");
          }
          return;
        }
        toast.success("Authentication successful");
        closeAuthModal();
        navigate(pendingRoute || "/");
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || "Secure handshake failed");
    }
  };

  const handleGithubLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    window.location.href = `${apiUrl}/api/auth/github`;
  };

  if (!showAuthModal) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#0A0A0A]/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal(); }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-[400px] bg-[#0F0F0F] border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        <div className="mb-6 text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
             <Logo className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-1">
            {isSignup ? "Create an account" : "Log in to LearnHub"}
          </h2>
          <p className="text-sm text-white/50">
            {isSignup ? "Enter your email to continue" : "Welcome back"}
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
           {isSignup && (
             <div className="space-y-3 mb-4 animate-in fade-in slide-in-from-top-1">
               <div className="space-y-1.5">
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Semester</label>
               <div className="grid grid-cols-4 gap-2">
                 {["1", "2", "3", "4", "5", "6"].map((sem) => (
                   <button
                     key={sem}
                     type="button"
                     onClick={() => { setSemester(sem); if (["1", "2"].includes(sem)) setDepartment("Common"); }}
                     className={cn(
                       "h-8 rounded-md text-xs font-medium transition-colors border",
                       semester === sem 
                         ? "bg-white text-black border-white" 
                         : "bg-[#111] text-white/60 border-white/10 hover:border-white/30"
                     )}
                   >
                     Sem {sem}
                   </button>
                 ))}
               </div>
             </div>

             {semester && !["1", "2"].includes(semester) && (
               <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Department</label>
                 <div className="grid grid-cols-2 gap-2">
                   {["Computer Science", "Civil", "Mechanical", "Electrical"].map((dept) => (
                     <button
                       key={dept}
                       type="button"
                       onClick={() => setDepartment(dept)}
                       className={cn(
                         "h-8 rounded-md text-[11px] font-medium transition-colors border",
                         department === dept 
                           ? "bg-white text-black border-white" 
                           : "bg-[#111] text-white/60 border-white/10 hover:border-white/30"
                       )}
                     >
                       {dept}
                     </button>
                   ))}
                 </div>
               </div>
             )}
           </div>
           )}

           <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/70">Email</label>
              <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                 <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-10 pl-10 pr-4 bg-[#0A0A0A] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="name@example.com"
                 />
              </div>
           </div>

           <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                 <label className="text-xs font-medium text-white/70">Password</label>
                 {!isSignup && <button type="button" onClick={() => { closeAuthModal(); navigate("/forgot-password"); }} className="text-xs text-primary hover:text-primary-hover transition-colors">Forgot password?</button>}
              </div>
              <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                 <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-10 pl-10 pr-4 bg-[#0A0A0A] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="••••••••"
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
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
           >
              {isLoading && <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
              {isSignup ? "Sign Up" : "Sign In"}
           </button>
        </form>

        <div className="mt-6 text-center">
           <button
              type="button"
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