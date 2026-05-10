import { useState } from "react";
import { Mail, KeyRound } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterUserMutation, useLoginUserMutation } from "@/features/api/authApi";

export default function LoginPage() {
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
        const res = await registerUser({ email, password }).unwrap();

        if (!res.success) {
          setErrorMsg(res.message || "Registration failed");
          return;
        }

        toast.success(res.message || "OTP sent! Check your email.", { id: "auth-toast" });
        navigate("/verify-otp", { state: { email } });

      } else {
        const res = await loginUser({ email, password }).unwrap();

        if (!res.success) {
          if (res.notVerified) {
            navigate("/verify-otp", { state: { email } });
            toast.error("Please verify your email first.", { id: "auth-toast" });
          } else {
            setErrorMsg(res.message || "Invalid email or password");
          }
          return;
        }

        // authApi.onQueryStarted already dispatched userLoggedIn
        toast.success("Welcome back! 🎉", { id: "auth-toast" });
        navigate("/");
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-10 shadow-2xl">
        <div className="mb-10 text-center">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-primary/30 mx-auto mb-4">
            LH
          </div>
          <h1 className="text-white text-3xl font-black tracking-tight mb-2">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
            {isSignup ? "Sign up with OTP verification" : "Sign in to your professional account"}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-white bg-muted/40 border border-border hover:bg-muted/60 transition-all font-bold text-xs uppercase tracking-widest">
            <FaGithub className="w-4 h-4" />
            Continue with GitHub
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-[9px] font-black uppercase tracking-widest">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5 block">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/30 border border-border text-white text-sm outline-none focus:border-primary transition-colors font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/30 border border-border text-white text-sm outline-none focus:border-primary transition-colors font-medium"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-red-400 text-[11px] font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center">
              {errorMsg}
            </p>
          )}

          <button
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-white/90 transition-all mt-4 disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        <button
          onClick={() => { setIsSignup(!isSignup); setErrorMsg(""); }}
          className="w-full text-[10px] font-bold text-muted-foreground mt-8 uppercase tracking-widest hover:text-white transition-colors"
        >
          {isSignup ? "Already have an account? Sign In" : "Don't have an account? Create one"}
        </button>
      </div>
    </div>
  );
}