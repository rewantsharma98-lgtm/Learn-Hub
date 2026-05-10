import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useVerifyEmailMutation, useResendOtpMutation } from "@/features/api/authApi";

export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const [verifyEmail, { isLoading, isSuccess, error }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending, isSuccess: resendIsSuccess, error: resendError }] = useResendOtpMutation();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !otp) return toast.error("Please fill all fields");
    try {
      await verifyEmail({ email, otp }).unwrap();
    } catch (err) {
      console.error("Verification error:", err);
    }
  };

  const handleResend = async () => {
    if (!email) return toast.error("Please enter your email first");
    try {
      await resendOtp(email).unwrap();
    } catch (err) {
      console.error("Resend error:", err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account verified successfully!");
      navigate("/login");
    }
    if (error) {
      toast.error(error?.data?.message || "Verification failed");
    }
    if (resendIsSuccess) {
      toast.success("New OTP sent to your email!");
    }
    if (resendError) {
      toast.error(resendError?.data?.message || "Failed to resend OTP");
    }
  }, [isSuccess, error, resendIsSuccess, resendError, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="bg-card border border-border p-8 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-white text-2xl font-black tracking-tight mb-2">Verify OTP</h2>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
            Enter the code sent to your email
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5 block">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-white text-sm outline-none focus:border-primary transition-all font-medium"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div>
            <label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5 block">Verification Code</label>
            <input
              type="text"
              placeholder="000000"
              required
              maxLength={6}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-white text-sm outline-none focus:border-primary transition-all font-black tracking-[0.5em] text-center"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-lg text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/10 transition-all mt-4 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <button 
          onClick={handleResend}
          disabled={isResending}
          className="w-full text-center text-primary text-[10px] font-black uppercase tracking-widest mt-6 hover:underline disabled:opacity-50"
        >
          {isResending ? "Sending..." : "Resend OTP"}
        </button>

        <button 
          onClick={() => navigate("/login")}
          className="w-full text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-8 hover:text-white transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}