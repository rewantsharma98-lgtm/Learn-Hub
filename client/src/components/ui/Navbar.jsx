import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Leaf,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Courses", href: "/courses" },
  { label: "My Learning", href: "/my-courses" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openAuthModal } = useAuth();

  const user = useSelector((state) => state.auth.user);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const [logoutUser] = useLogoutUserMutation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);

    try {
      await logoutUser().unwrap();
    } catch (_) {}

    navigate("/");
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/[0.05]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-[1200px] mx-auto h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Logo className="w-5 h-5 text-white" />
            </div>

            <span className="text-white font-semibold tracking-tight text-sm sm:text-base">
              LearnHub
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.href)}
                className={cn(
                  "text-sm transition-colors",
                  location.pathname === link.href
                    ? "text-white"
                    : "text-white/50 hover:text-white"
                )}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* User */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setDropdownOpen(!dropdownOpen)
                  }
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-xs font-medium text-white">
                    {user.name?.[0] ||
                      user.email?.[0]?.toUpperCase()}
                  </div>

                  <ChevronDown className="w-3 h-3 text-white/40 hidden sm:block" />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 8,
                        scale: 0.98,
                      }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-[#111111] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl"
                    >
                      <div className="px-4 py-3 border-b border-white/[0.05]">
                        <p className="text-sm text-white truncate">
                          {user.name || "Student"}
                        </p>

                        <p className="text-[11px] text-white/40 truncate">
                          {user.email}
                        </p>
                      </div>

                      <DropdownItem
                        icon={<User className="w-4 h-4" />}
                        label="Profile"
                        onClick={() => {
                          navigate("/profile");
                          setDropdownOpen(false);
                        }}
                      />

                      <DropdownItem
                        icon={
                          <LayoutDashboard className="w-4 h-4" />
                        }
                        label="Dashboard"
                        onClick={() => {
                          navigate("/my-courses");
                          setDropdownOpen(false);
                        }}
                      />

                      {user.role === "admin" && (
                        <DropdownItem
                          icon={<Logo className="w-4 h-4 text-white/70" />}
                          label="Admin Console"
                          onClick={() => {
                            navigate("/admin");
                            setDropdownOpen(false);
                          }}
                        />
                      )}

                      <div className="h-px bg-white/[0.05]" />

                      <DropdownItem
                        icon={<LogOut className="w-4 h-4" />}
                        label="Logout"
                        danger
                        onClick={handleLogout}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/5 text-white"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 left-0 right-0 z-40 bg-[#0A0A0A] border-b border-white/[0.05] md:hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    navigate(link.href);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-sm text-white/80 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DropdownItem({
  icon,
  label,
  onClick,
  danger,
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors",
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-white/70 hover:text-white hover:bg-white/[0.04]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}