import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  PlusCircle,
  Users,
  HelpCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Courses", icon: BookOpen, href: "/admin/courses" },
  { label: "Students", icon: Users, href: "/admin/team" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
];

const SECONDARY_NAV = [
  { label: "Settings", icon: Settings, href: "/admin/settings" },
  { label: "Support", icon: HelpCircle, href: "/admin/help" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (href) => location.pathname === href;

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0F0F0F] flex flex-col">
        
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <img
              src="/logo.png"
              alt="LearnHub"
              className="w-10 h-10 rounded-xl object-cover"
            />

            <div className="flex flex-col items-start">
              <span className="text-white text-lg font-semibold leading-none">
                LearnHub
              </span>

              <span className="text-white/40 text-[10px] uppercase tracking-widest mt-1">
                Admin Panel
              </span>
            </div>
          </button>
        </div>

        {/* Create Course */}
        <div className="p-6">
          <button
            onClick={() => navigate("/admin/courses/new")}
            className="w-full h-11 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} />
            Add Course
          </button>
        </div>

        {/* Navigation */}
        <div className="px-4 space-y-1">
          {ADMIN_NAV.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-4 h-11 rounded-xl text-sm transition-colors",
                isActive(item.href)
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-auto p-4 border-t border-white/5 space-y-1">
          
          {SECONDARY_NAV.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.href)}
              className="w-full flex items-center gap-3 px-4 h-11 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}

          <button
            className="w-full flex items-center gap-3 px-4 h-11 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen">
        
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md px-8 flex items-center justify-between">
          
          <div>
            <h1 className="text-sm font-medium text-white">
              Admin Dashboard
            </h1>

            <p className="text-xs text-white/40">
              Manage your platform
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-medium">
            AD
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}