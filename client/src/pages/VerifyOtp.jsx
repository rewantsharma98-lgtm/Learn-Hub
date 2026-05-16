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
        className="w-full max-w-[400px] bg-[#0F0F0F] border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center space-y-4 mb-8">
           <div className="flex justify-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                 <ShieldCheck size={24} />
              </div>
           </div>
           <div className="space-y-1">
              <h1 className="text-white text-xl font-semibold">Verification Required</h1>
              <p className="text-white/50 text-sm">Verify your identity with the security code sent to your academic inbox.</p>
           </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
           <div className="space-y-4">
              <div className="space-y-1.5">
                 <label className="text-xs font-medium text-white/70">Academic Email</label>
                 <div className="relative group">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
                    <input
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                       className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg h-10 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/30 transition-all"
                       placeholder="identity@academy.edu"
                    />
                 </div>
              </div>

              <div className="space-y-1.5">
                 <label className="text-xs font-medium text-white/70">Security Code</label>
                 <div className="relative group">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
                    <input
                       type="text"
                       value={otp}
                       onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                       required
                       maxLength={6}
                       className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg h-12 pl-10 pr-4 text-xl font-bold tracking-[0.5em] text-white focus:outline-none focus:border-white/30 transition-all"
                       placeholder="000000"
                    />
                 </div>
              </div>
           </div>

           <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full bg-white text-black h-10 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 mt-2"
           >
              {isLoading ? "Verifying..." : "Verify Identity"}
           </button>
        </form>

        <div className="flex flex-col gap-4 mt-6 items-center">
           <button
              onClick={handleResend}
              disabled={isResending}
              className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-2"
           >
              <RotateCcw size={14} className={isResending ? "animate-spin" : ""} />
              {isResending ? "Sending..." : "Resend Security Code"}
           </button>

           <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-xs text-white/30 hover:text-white transition-colors"
           >
              <ArrowLeft size={14} /> Back to Home
           </button>
        </div>
      </motion.div>

    </div>
  );
}