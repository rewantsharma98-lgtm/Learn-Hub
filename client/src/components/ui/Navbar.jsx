import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home, BookOpen, UserPen, LogOut, ChevronDown, Menu, X as CloseIcon, Settings
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLogoutUserMutation } from "@/features/api/authApi";

const NAV_LINKS = [
  { label: "Home",    href: "/" },
  { label: "Courses", href: "/courses" },
];

const PROTECTED = ["/my-courses", "/profile"];

export default function Navbar() {
  const navigate  = useNavigate();
  const { openAuthModal } = useAuth();
  const user = useSelector((state) => state.auth.user);

  const [dropdownOpen,   setDropdownOpen]   = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [logoutUser] = useLogoutUserMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNav = (href) => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    if (PROTECTED.includes(href) && !user) {
      openAuthModal(href);
    } else {
      navigate(href);
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    try {
      await logoutUser().unwrap();
    } catch (_) {}
    navigate("/");
  };
  // User display helpers
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";
  const displayName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Account";

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between gap-8">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group transition-transform active:scale-95 shrink-0"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-white text-xs tracking-tighter shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
            LH
          </div>
          <span className="text-white text-lg font-black tracking-tighter uppercase">
            learn<span className="text-primary italic">hub</span><span className="text-primary">.</span>
          </span>
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white hover:bg-muted/50 rounded-md transition-all"
            >
              {link.label}
            </button>
          ))}
          {user && (
            <button
              onClick={() => navigate("/my-courses")}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/5 rounded-md transition-all"
            >
              My Courses
            </button>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            /* ── Authenticated: avatar + dropdown ── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border bg-muted/30 transition-all ${
                  dropdownOpen ? "border-primary ring-2 ring-primary/20" : "border-border/50 hover:border-primary/50"
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-[10px] uppercase">{initials}</span>
                </div>
                <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-white max-w-[80px] truncate">
                  {displayName}
                </span>
                <ChevronDown
                  size={12}
                  className={`text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-primary" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-3 w-60 bg-card border border-border rounded-2xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  {/* User info */}
                  <div className="px-4 py-4 border-b border-border/50 mb-2">
                    <p className="text-white text-xs font-black uppercase tracking-tight truncate">
                      {user.name || displayName}
                    </p>
                    <p className="text-muted-foreground text-[10px] font-medium truncate mt-0.5">{user.email}</p>
                  </div>

                  <DropItem icon={<Home size={14} />}     label="Home"        onClick={() => handleNav("/")} />
                  <DropItem icon={<BookOpen size={14} />}  label="My Courses"  onClick={() => handleNav("/my-courses")} />
                  <DropItem icon={<UserPen size={14} />}   label="Edit Profile" onClick={() => handleNav("/profile")} />
                  <DropItem icon={<Settings size={14} />}  label="Settings"    onClick={() => handleNav("/profile")} />

                  <div className="h-px bg-border/50 my-2 mx-2" />

                  <DropItem icon={<LogOut size={14} />}   label="Logout"      onClick={handleLogout} danger />
                </div>
              )}
            </div>
          ) : (
            /* ── Guest: Get Started button ── */
            <button
              onClick={() => openAuthModal()}
              className="px-6 py-2.5 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all active:scale-95 shadow-lg"
            >
              Get Started
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-white"
          >
            {mobileMenuOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-card border-b border-border p-6 flex flex-col gap-3 animate-in slide-in-from-top duration-200 z-40">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="text-left text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary py-2 transition-colors"
            >
              {link.label}
            </button>
          ))}
          {user ? (
            <>
              <button onClick={() => handleNav("/my-courses")} className="text-left text-[11px] font-black uppercase tracking-[0.2em] text-primary py-2">
                My Courses
              </button>
              <button onClick={handleLogout} className="text-left text-[11px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-red-300 py-2 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => { openAuthModal(); setMobileMenuOpen(false); }}
              className="mt-2 w-full py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              Get Started
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

function DropItem({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-muted-foreground hover:text-white hover:bg-muted"
      }`}
    >
      <span className={danger ? "text-red-400" : "text-primary/70"}>{icon}</span>
      {label}
    </button>
  );
}