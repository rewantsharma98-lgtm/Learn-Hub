import { useEffect, useState } from "react";
import {
  Users, BookOpen, TrendingUp, PlayCircle,
  ArrowUpRight, MoreHorizontal, RefreshCw,
} from "lucide-react";
import { fetchDashboardStats } from "@/features/api/adminApi";

// ── Skeleton loader ───────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, bg, loading }) {
  return (
    <div className="bg-card border border-border p-6 rounded-2xl shadow-lg hover:border-primary/20 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={20} />
        </div>
        <span className="flex items-center gap-1 text-green-500 text-[10px] font-black tracking-tighter bg-green-500/5 px-2 py-0.5 rounded-full">
          <ArrowUpRight size={10} /> Live
        </span>
      </div>
      <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">{label}</h3>
      {loading ? (
        <Skeleton className="h-8 w-24 mt-1" />
      ) : (
        <p className="text-white text-2xl font-black">{value}</p>
      )}
    </div>
  );
}

// ── YouTube skeleton ──────────────────────────────────────────────────────────
function YouTubeSkeleton() {
  return (
    <div className="animate-pulse rounded-xl overflow-hidden border border-border bg-[#1a1a1a]">
      <div className="aspect-video bg-white/5 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 opacity-20">
          <PlayCircle size={40} />
          <div className="h-2 w-24 bg-white/20 rounded-full" />
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="h-3 bg-white/10 rounded-full w-3/4" />
        <div className="h-2 bg-white/5 rounded-full w-1/2" />
      </div>
    </div>
  );
}

// ── Enrollment row ────────────────────────────────────────────────────────────
function EnrollmentRow({ enrollment, i }) {
  const name = enrollment?.user?.name || enrollment?.user?.email || `Student ${i + 1}`;
  const course = enrollment?.course?.title || "Unknown Course";
  const thumbnail = enrollment?.course?.thumbnail;
  const time = enrollment?.enrolledAt
    ? new Date(enrollment.enrolledAt).toLocaleDateString()
    : "Recently";

  return (
    <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-black text-[10px] text-white border border-primary/20">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 className="text-white text-sm font-bold truncate">{name}</h4>
          <p className="text-muted-foreground text-[10px] font-medium mt-0.5">
            Enrolled in: <span className="text-primary italic">{course}</span>
          </p>
        </div>
      </div>
      <span className="text-muted-foreground text-[10px] font-medium">{time}</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboardStats();
      if (res.data.success) setData(res.data);
      else setError(res.data.message);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stats = [
    {
      label: "Total Students",
      value: data?.stats?.totalStudents?.toLocaleString() ?? "0",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Active Courses",
      value: data?.stats?.totalCourses?.toLocaleString() ?? "0",
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Lectures",
      value: data?.stats?.totalLectures?.toLocaleString() ?? "0",
      icon: PlayCircle,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Total Enrollments",
      value: data?.stats?.totalEnrollments?.toLocaleString() ?? "0",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  // Build chart bars from enrollmentsByDay
  const chartData = data?.enrollmentsByDay ?? [];
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Platform Overview</p>
          <h1 className="text-white text-3xl font-black tracking-tight">Dashboard</h1>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-white hover:border-primary/30 text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} loading={loading} />
        ))}
      </div>

      {/* Enrollment Chart */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
        <div className="mb-6">
          <h3 className="text-white text-sm font-black uppercase tracking-widest">Total Enrollments</h3>
          <p className="text-muted-foreground text-[10px] font-medium mt-1">
            Last 30 days: {data?.stats?.totalEnrollments ?? 0}
          </p>
        </div>
        {loading ? (
          <div className="flex items-end gap-1 h-40">
            {Array.from({ length: 20 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 rounded-sm" style={{ height: `${Math.random() * 100}%` }} />
            ))}
          </div>
        ) : (
          <div className="flex items-end gap-1 h-40 overflow-x-auto pb-2">
            {chartData.length === 0 ? (
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest w-full text-center py-10">
                No enrollment data yet
              </p>
            ) : (
              chartData.map((day) => (
                <div
                  key={day._id}
                  className="group relative flex-1 min-w-[20px] bg-primary/70 hover:bg-primary rounded-t transition-all cursor-pointer"
                  style={{ height: `${(day.count / maxCount) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border text-white text-[9px] font-black px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10">
                    {day._id}: {day.count}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {chartData.length > 0 && (
          <div className="flex justify-between mt-2 text-[9px] text-muted-foreground font-bold">
            <span>{chartData[0]?._id}</span>
            <span>{chartData[chartData.length - 1]?._id}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enrollments */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-white text-sm font-black uppercase tracking-widest">Recent Enrollments</h3>
            <button className="text-muted-foreground hover:text-white transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-6 flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-2 w-48" />
                    </div>
                  </div>
                ))
              : (data?.recentEnrollments ?? []).map((e, i) => (
                  <EnrollmentRow key={e._id ?? i} enrollment={e} i={i} />
                ))}
          </div>
        </div>

        {/* Top Courses with YouTube skeleton style */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-6 border-b border-border">
            <h3 className="text-white text-sm font-black uppercase tracking-widest">Top Courses</h3>
          </div>
          <div className="flex-1 divide-y divide-border p-4 space-y-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <YouTubeSkeleton key={i} />)
              : (data?.topCourses ?? []).map((course, i) => (
                  <div key={course._id} className="flex flex-col gap-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 rounded-lg bg-[#2a2a2a] border border-border overflow-hidden shrink-0">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            className="w-full h-full object-cover"
                            alt={course.title}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PlayCircle size={16} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-white text-xs font-black uppercase tracking-tight truncate">
                          {course.title}
                        </h4>
                        <p className="text-muted-foreground text-[10px] font-medium mt-1 flex items-center gap-1">
                          <Users size={10} /> {course.totalStudents?.toLocaleString() ?? 0} Students
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-1000"
                        style={{ width: `${Math.min((course.totalStudents / (data?.stats?.totalStudents || 1)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}