import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  PlayCircle,
  TrendingUp,
} from "lucide-react";

import { fetchDashboardStats } from "@/features/api/adminApi";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetchDashboardStats();

      if (res.data.success) {
        setData(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Students",
      value: data?.stats?.totalStudents || 0,
      icon: <Users size={18} />,
    },
    {
      title: "Courses",
      value: data?.stats?.totalCourses || 0,
      icon: <BookOpen size={18} />,
    },
    {
      title: "Lectures",
      value: data?.stats?.totalLectures || 0,
      icon: <PlayCircle size={18} />,
    },
    {
      title: "Enrollments",
      value: data?.stats?.totalEnrollments || 0,
      icon: <TrendingUp size={18} />,
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            Admin Dashboard
          </h1>

          <p className="text-sm text-white/50 mt-1">
            Manage students, courses and enrollments.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="h-10 px-4 rounded-lg border border-white/10 text-sm text-white/70 hover:bg-white/5 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-[#111111] border border-white/5 rounded-2xl p-5"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-primary mb-4">
              {item.icon}
            </div>

            <h3 className="text-3xl font-semibold text-white">
              {loading ? "..." : item.value}
            </h3>

            <p className="text-sm text-white/40 mt-1">
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Enrollments */}
        <div className="xl:col-span-2 bg-[#111111] border border-white/5 rounded-2xl">
          
          <div className="p-5 border-b border-white/5">
            <h2 className="text-white font-medium">
              Recent Enrollments
            </h2>
          </div>

          <div className="divide-y divide-white/5">
            {data?.recentEnrollments?.length > 0 ? (
              data.recentEnrollments.map((item, index) => (
                <div
                  key={index}
                  className="p-5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-white font-medium">
                      {item.user?.name || item.user?.email}
                    </p>

                    <p className="text-xs text-white/40 mt-1">
                      Enrolled in {item.course?.title}
                    </p>
                  </div>

                  <span className="text-xs text-white/30">
                    {new Date(item.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-5 text-sm text-white/40">
                No recent enrollments
              </div>
            )}
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
          
          <h2 className="text-white font-medium mb-5">
            Popular Courses
          </h2>

          <div className="space-y-5">
            {data?.topCourses?.map((course, index) => (
              <div key={index}>
                
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-white/70 truncate">
                    {course.title}
                  </p>

                  <span className="text-xs text-white">
                    {course.totalStudents}
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${(course.totalStudents /
                        (data?.stats?.totalStudents || 1)) * 100}%`,
                    }}
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