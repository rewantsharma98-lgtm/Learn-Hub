
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import { ShieldAlert } from "lucide-react";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { openAuthModal } = useAuth();

  useEffect(() => {
    if (!user) {
      openAuthModal(location.pathname);
      navigate("/", { replace: true });
      return;
    }

    // EXTRA SECURE: Hardcoded email check for admin routes
    const isAuthorizedAdmin = user.role === "admin" && user.email === "rewantsharma56@gmail.com";

    if (adminOnly && !isAuthorizedAdmin) {
      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, adminOnly]);

  if (!user) return null;

  const isAuthorizedAdmin = user.role === "admin" && user.email === "rewantsharma56@gmail.com";

  if (adminOnly && !isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
            <ShieldAlert size={48} className="text-red-500" />
          </div>
          <div className="space-y-4">
            <h2 className="text-white text-3xl font-black uppercase tracking-tighter">Access Denied</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              This area is restricted to authorized administrators only. You will be redirected shortly.
            </p>
          </div>
          <div className="pt-8">
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 animate-[progress_3s_linear_forwards]" />
            </div>
          </div>
        </div>
        <style>{`
          @keyframes progress {
            from { width: 0; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return children;
}

