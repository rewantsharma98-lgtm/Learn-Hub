import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterUserMutation, useLoginUserMutation } from "@/features/api/authApi";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
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
        navigate("/verify-otp", { state: { email } });
      } else {
        const payload = { email, password };
        if (semester) payload.semester = semester;
        if (department) payload.department = department;

        const res = await loginUser(payload).unwrap();
        if (!res.success) {
          if (res.notVerified) {
            navigate("/verify-otp", { state: { email } });
            toast.error("Verification required.");
          } else {
            setErrorMsg(res.message || "Invalid credentials");
          }
          return;
        }
        toast.success("Authentication successful");
        navigate("/");
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || "Secure handshake failed");
    }
  };

  const handleGithubLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    window.location.href = `${apiUrl}/api/auth/github`;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/[0.03] blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/[0.02] blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] bg-[#0F0F0F] border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
             <Logo className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isSignup ? "Create an account" : "Welcome back"}
          </h1>
          <p className="text-sm text-white/50">
            {isSignup ? "Join the LearnHub academic ecosystem" : "Sign in to your academic dashboard"}
          </p>
        </div>

        <button 
          onClick={handleGithubLogin}
          className="w-full h-12 bg-[#1A1A1A] border border-white/10 rounded-xl text-sm text-white font-medium hover:bg-[#222222] transition-all flex items-center justify-center gap-3 mb-6 group"
        >
          <FaGithub className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Continue with GitHub
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">or use email</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
           {isSignup && (
             <div className="space-y-4 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Current Semester</label>
                 <div className="grid grid-cols-3 gap-2">
                   {["1", "2", "3", "4", "5", "6"].map((sem) => (
                     <button
                       key={sem}
                       type="button"
                       onClick={() => { setSemester(sem); if (["1", "2"].includes(sem)) setDepartment("Common"); }}
                       className={cn(
                         "h-10 rounded-lg text-xs font-bold transition-all border",
                         semester === sem 
                           ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                           : "bg-[#111] text-white/40 border-white/5 hover:border-white/20 hover:text-white/70"
                       )}
                     >
                       Sem {sem}
                     </button>
                   ))}
                 </div>
               </div>

               {semester && !["1", "2"].includes(semester) && (
                 <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
                   <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Department</label>
                   <div className="grid grid-cols-2 gap-2">
                     {["Computer Science", "Civil", "Mechanical", "Electrical"].map((dept) => (
                       <button
                         key={dept}
                         type="button"
                         onClick={() => setDepartment(dept)}
                         className={cn(
                           "h-10 rounded-lg text-[10px] font-bold transition-all border px-2",
                           department === dept 
                             ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                             : "bg-[#111] text-white/40 border-white/5 hover:border-white/20 hover:text-white/70"
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

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email Address</label>
              <div className="relative group">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                 <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 pl-12 pr-4 bg-[#0A0A0A] border border-white/5 rounded-xl text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-white/20 focus:bg-[#111] transition-all"
                    placeholder="identity@academy.edu"
                 />
              </div>
           </div>

           <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Secure Key</label>
                 {!isSignup && (
                   <button 
                     type="button" 
                     onClick={() => navigate("/forgot-password")} 
                     className="text-[10px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest"
                   >
                     Reset?
                   </button>
                 )}
              </div>
              <div className="relative group">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                 <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-12 pl-12 pr-4 bg-[#0A0A0A] border border-white/5 rounded-xl text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-white/20 focus:bg-[#111] transition-all"
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
                    className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center py-2"
                 >
                    {errorMsg}
                 </motion.div>
              )}
           </AnimatePresence>

           <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-white text-black rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
           >
              {isLoading && <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
              {isSignup ? "Initialize Account" : "Access Terminal"}
           </button>
        </form>

        <div className="mt-8 text-center">
           <button
              type="button"
              onClick={() => { setIsSignup(!isSignup); setErrorMsg(""); }}
              className="text-[10px] font-black text-white/30 hover:text-white transition-colors uppercase tracking-widest"
           >
              {isSignup ? "Already registered? Login" : "New student? Create profile"}
           </button>
        </div>
      </motion.div>
    </div>
  );
}