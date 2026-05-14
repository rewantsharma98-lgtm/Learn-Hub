import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookMarked,
  CheckCircle2,
  ChevronRight,
  Play,
} from "lucide-react";

import { useLoadUserQuery } from "@/features/api/authApi";
import { useGetEnrolledCoursesQuery } from "@/features/api/courseApi";
import { useNavigate } from "react-router-dom";

export default function MyCourses() {
  const { data: userData } = useLoadUserQuery();
  const { data: enrolledData, isLoading } =
    useGetEnrolledCoursesQuery();

  const navigate = useNavigate();

  const user = userData?.user;
  const enrolledCourses = enrolledData?.courses || [];

  const stats = useMemo(
    () => ({
      total: enrolledCourses.length,
      completed: enrolledCourses.filter(
        (c) => c.progress === 100
      ).length,
    }),
    [enrolledCourses]
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 subtle-noise" />

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-10 md:mb-14">

          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-semibold">
              Student Workspace
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight mt-3 mb-2">
              Welcome back,
              <span className="text-white/50">
                {" "}
                {user?.name?.split(" ")[0] || "Student"}
              </span>
            </h1>

            <p className="text-sm text-white/40 max-w-md">
              Continue learning from where you left off.
            </p>
          </div>

          <button
            onClick={() => navigate("/courses")}
            className="h-10 px-5 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
          >
            Browse Courses
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Minimal Stats */}
        <div className="grid grid-cols-2 gap-4 mb-10 md:mb-14">

          <MinimalCard
            value={stats.total}
            label="Enrolled"
          />

          <MinimalCard
            value={stats.completed}
            label="Completed"
          />

        </div>

        {/* Courses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[260px] rounded-2xl bg-[#0F0F0F] border border-white/5 animate-pulse"
              />
            ))
          ) : enrolledCourses.length > 0 ? (
            enrolledCourses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                onClick={() =>
                  navigate(`/learn/${course._id}`)
                }
                className="group bg-[#0F0F0F] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all cursor-pointer"
              >

                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden bg-[#151515]">

                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt=""
                      className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookMarked className="w-10 h-10 text-white/10" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-black/20 to-transparent" />

                  {/* Play */}
                  <div className="absolute bottom-4 left-4">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Progress badge */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-medium text-white">
                    {course.progress || 0}%
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">

                  <div className="flex items-center justify-between mb-3">

                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-semibold">
                      {course.category || "Module"}
                    </span>

                    {course.progress === 100 && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}

                  </div>

                  <h3 className="text-base font-medium text-white leading-snug mb-5 line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-white/40 mb-2">
                      <span>Progress</span>
                      <span>{course.progress || 0}%</span>
                    </div>

                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-500"
                        style={{
                          width: `${course.progress || 0}%`,
                        }}
                      />
                    </div>
                  </div>

                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-2xl bg-[#0F0F0F]">
              <BookMarked className="w-8 h-8 mx-auto mb-4 text-white/20" />

              <h3 className="text-base font-medium text-white mb-2">
                No courses yet
              </h3>

              <p className="text-sm text-white/40 mb-6">
                Start exploring courses to begin learning.
              </p>

              <button
                onClick={() => navigate("/courses")}
                className="h-10 px-5 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function MinimalCard({ value, label }) {
  return (
    <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-5 md:p-6">
      <div className="text-3xl md:text-4xl font-semibold text-white mb-2">
        {value}
      </div>

      <div className="text-xs uppercase tracking-[0.25em] text-white/30 font-medium">
        {label}
      </div>
    </div>
  );
}