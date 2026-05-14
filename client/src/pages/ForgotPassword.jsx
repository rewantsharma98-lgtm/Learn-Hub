import { useState } from "react";
import { Mail, Lock, KeyRound, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSendResetOtpMutation, useResetPasswordMutation } from "@/features/api/authApi";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const [sendResetOtp, { isLoading: isSending }] = useSendResetOtpMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await sendResetOtp(email).unwrap();
      if (res.success) {
        toast.success("Password reset code sent!");
        setOtpSent(true);
      } else {
        setErrorMsg(res.message || "Failed to send code.");
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || err?.message || "Error sending code.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await resetPassword({ email, otp, newPassword }).unwrap();
      if (res.success) {
        toast.success("Password successfully reset! Please login.");
        navigate("/login");
      } else {
        setErrorMsg(res.message || "Failed to reset password.");
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || err?.message || "Error resetting password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 subtle-noise" />
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[360px] relative z-10"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-white/50">
            {otpSent ? "Enter the code sent to your email and a new password." : "Enter your email to receive a password reset code."}
          </p>
        </div>

        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-400 text-xs font-medium text-center mb-4"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
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
            <button
              disabled={isSending || !email}
              className="w-full h-10 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {isSending ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/70">Reset Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="w-full h-10 pl-10 pr-4 bg-[#0A0A0A] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors tracking-widest font-mono"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/70">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-[#0A0A0A] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                  required
                />
              </div>
            </div>
            <button
              disabled={isResetting || otp.length < 6 || !newPassword}
              className="w-full h-10 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-2 w-full text-xs text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
