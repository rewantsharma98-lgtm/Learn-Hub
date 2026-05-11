import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { useVerifyEmailMutation, useResendOtpMutation } from "@/features/api/authApi";
import { ShieldCheck, RotateCcw, ArrowLeft } from "lucide-react";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate  = useNavigate();

  // Pre-fill email if navigated from Login with state
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp,   setOtp]   = useState("");

  const [verifyEmail, { isLoading, isSuccess, data: verifyData, error }] =
    useVerifyEmailMutation();

  const [resendOtp, { isLoading: isResending, isSuccess: resendOk, error: resendError }] =
    useResendOtpMutation();

  // ── Submit OTP ────────────────────────────────────────────────────────────
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !otp) return toast.error("Please fill all fields");
    try {
      const res = await verifyEmail({ email, otp }).unwrap();
      if (!res.success) toast.error(res.message || "Verification failed");
    } catch (err) {
      console.error("Verification error:", err);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  // resendOtp mutation's onQueryStarted in authApi will call sendOtpEmail automatically
  const handleResend = async () => {
    if (!email) return toast.error("Please enter your email first");
    try {
      await resendOtp(email).unwrap();
    } catch (err) {
      console.error("Resend error:", err);
    }
  };

  // ── Side effects ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isSuccess && verifyData?.success) {
      toast.success("Account verified! You can now sign in 🎉");
      navigate("/login");
    }
    if (error) toast.error(error?.data?.message || "Verification failed");
  }, [isSuccess, verifyData, error, navigate]);

  useEffect(() => {
    if (resendOk) toast.success("New OTP sent to your email!");
    if (resendError) toast.error(resendError?.data?.message || "Failed to resend OTP");
  }, [resendOk, resendError]);

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] px-6">
      <div className="bg-card border border-border p-10 rounded-3xl w-full max-w-sm shadow-2xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-14 h-14 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/10">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-white text-2xl font-black tracking-tight mb-2">
            Verify Your Email
          </h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
            Enter the 6-digit code sent to your inbox
          </p>
          {email && (
            <p className="mt-2 text-primary text-xs font-semibold truncate">
              {email}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5 block">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-white text-sm outline-none focus:border-primary transition-all font-medium"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div>
            <label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5 block">
              Verification Code
            </label>
            <input
              type="text"
              placeholder="• • • • • •"
              required
              maxLength={6}
              inputMode="numeric"
              className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-white text-sm outline-none focus:border-primary transition-all font-black tracking-[0.6em] text-center"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              value={otp}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className="w-full bg-white text-black py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg hover:bg-white/90 transition-all mt-4 disabled:opacity-50"
          >
            {isLoading ? "Verifying…" : "Verify Account"}
          </button>
        </form>

        {/* Resend */}
        <button
          onClick={handleResend}
          disabled={isResending}
          className="w-full flex items-center justify-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mt-6 hover:underline disabled:opacity-50 transition-all"
        >
          <RotateCcw size={12} className={isResending ? "animate-spin" : ""} />
          {isResending ? "Sending…" : "Resend OTP"}
        </button>

        {/* Back */}
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center justify-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-5 hover:text-white transition-colors"
        >
          <ArrowLeft size={12} />
          Back to Login
        </button>
      </div>
    </div>
  );
}