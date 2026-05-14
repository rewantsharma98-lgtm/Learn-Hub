import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { useVerifyEmailMutation, useResendOtpMutation } from "@/features/api/authApi";
import { ShieldCheck, RotateCcw, ArrowLeft, Mail, KeyRound, Fingerprint, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate  = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp,   setOtp]   = useState("");


  const [verifyEmail, { isLoading, isSuccess, data: verifyData, error }] =
    useVerifyEmailMutation();

  const [resendOtp, { isLoading: isResending, isSuccess: resendOk, error: resendError }] =
    useResendOtpMutation();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !otp) return toast.error("Credentials required");
    try {
      await verifyEmail({ email, otp }).unwrap();
    } catch (_) {}
  };

  const handleResend = async () => {
    if (!email) return toast.error("Identity required");
    try {
      await resendOtp(email).unwrap();
    } catch (_) {}
  };

  useEffect(() => {
    if (isSuccess && verifyData?.success) {
      toast.success("Identity verified. Access granted.");
      navigate("/login");
    }
    if (error) toast.error(error?.data?.message || "Verification failed");
  }, [isSuccess, verifyData, error, navigate]);

  useEffect(() => {
    if (resendOk) toast.success("New security code transmitted.");
    if (resendError) toast.error(resendError?.data?.message || "Transmission failed");
  }, [resendOk, resendError]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 noise-bg opacity-[0.02]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[160px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] space-y-12 relative z-10"
      >
        <div className="text-center space-y-6">
           <div className="flex justify-center">
              <div className="w-16 h-16 rounded-[2rem] bg-white/[0.02] border border-white/10 flex items-center justify-center text-primary relative group">
                 <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Fingerprint size={32} className="relative z-10" />
              </div>
           </div>
           <div className="space-y-2">
              <h1 className="text-white text-4xl font-bold tracking-tighter">Zero-Trust Access.</h1>
              <p className="text-white/30 text-sm max-w-[300px] mx-auto">Verify your identity with the security code sent to your academic inbox.</p>
           </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-8">
           <div className="space-y-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1">Email Node</label>
                 <div className="relative group">
                    <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-colors" />
                    <input
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                       className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-sm text-white/80 focus:outline-none focus:border-primary/50 focus:bg-white/[0.04] transition-all"
                       placeholder="identity@academy.edu"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1">Security Code</label>
                 <div className="relative group">
                    <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-colors" />
                    <input
                       type="text"
                       value={otp}
                       onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                       required
                       maxLength={6}
                       className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-2xl font-black text-white tracking-[0.8em] focus:outline-none focus:border-primary/50 focus:bg-white/[0.04] transition-all"
                       placeholder="000000"
                    />
                 </div>
              </div>
           </div>

           <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full bg-white text-black py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl disabled:opacity-30 disabled:hover:scale-100"
           >
              {isLoading ? "Authenticating..." : "Establish Connection"}
           </button>
        </form>

        <div className="flex flex-col gap-6 items-center">
           <button
              onClick={handleResend}
              disabled={isResending}
              className="text-[9px] font-bold text-white/20 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2"
           >
              <RotateCcw size={14} className={isResending ? "animate-spin" : ""} />
              {isResending ? "Transmitting..." : "Resend Security Code"}
           </button>

           <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-[9px] font-bold text-white/10 uppercase tracking-widest hover:text-white transition-colors"
           >
              <ArrowLeft size={14} /> Back to Hub
           </button>
        </div>
      </motion.div>

    </div>
  );
}