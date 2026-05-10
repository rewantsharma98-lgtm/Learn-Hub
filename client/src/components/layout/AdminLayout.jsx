import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronRight,
  PlusCircle,
  Users,
  FolderKanban
} from "lucide-react";

const ADMIN_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Courses", icon: BookOpen, href: "/admin/courses" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Projects", icon: FolderKanban, href: "/admin/projects" },
  { label: "Team", icon: Users, href: "/admin/team" },
];

const BOTTOM_NAV = [
  { label: "Settings", icon: Settings, href: "/admin/settings" },
  { label: "Get Help", icon: BookOpen, href: "/admin/help" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const active = (href) => location.pathname === href;

  return (
    <div className="flex min-h-screen bg-[#1a1a1a] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-[#1a1a1a] flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-white text-xs">
              LH
            </div>
            <span className="text-white text-lg font-black tracking-tighter uppercase">
              learn<span className="text-primary italic">hub</span><span className="text-primary">.</span>
            </span>
          </div>

          <button className="w-full flex items-center justify-between px-4 py-2.5 bg-primary rounded-lg text-white font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all mb-8 shadow-lg shadow-primary/20">
            <span className="flex items-center gap-2">
              <PlusCircle size={16} /> Quick Create
            </span>
            <ChevronRight size={14} className="opacity-50" />
          </button>

          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  active(item.href) 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon size={16} className={active(item.href) ? 'text-primary' : 'text-muted-foreground'} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-1">
          {BOTTOM_NAV.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.href)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-border bg-[#1a1a1a]/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
            <LayoutDashboard size={14} />
            <span>Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-white transition-colors">
              <LogOut size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-[10px] border border-primary/20">
              AD
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
