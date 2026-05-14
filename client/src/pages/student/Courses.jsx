import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  BookOpen,
  Search,
  ArrowRight,
  BookMarked,
} from "lucide-react";

import { useCourses } from "@/context/CourseContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Courses() {
  const { courses, loading } = useCourses();

  const [activeTab, setActiveTab] = useState("Semester 2");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const semesters = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesTab = course.category
        ?.toLowerCase()
        .includes(activeTab.split(" ")[1].toLowerCase());

      const matchesSearch = course.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [courses, activeTab, searchQuery]);

  return (
    <section className="min-h-screen bg-[#0A0A0A] pt-24 md:pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 subtle-noise opacity-40" />

      {/* Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/10 blur-[120px]" />

      <div className="max-w-[1200px] mx-auto relative z-10">

        {/* HEADER */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8 md:mb-12">

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-medium">
                Learn Hub Workspace
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-white tracking-tight leading-none">
              Course Library
            </h1>

            <p className="text-sm text-white/40 mt-3 max-w-md leading-relaxed">
              Structured semester-based learning designed for polytechnic students.
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects..."
              className="
                w-full
                h-11
                pl-10
                pr-4
                rounded-xl
                bg-white/[0.03]
                border
                border-white/[0.06]
                text-sm
                text-white
                placeholder:text-white/25
                focus:outline-none
                focus:border-primary/40
                transition-all
              "
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-1">
          {semesters.map((sem) => (
            <button
              key={sem}
              onClick={() => setActiveTab(sem)}
              className={cn(
                "shrink-0 px-4 h-9 rounded-full text-xs font-medium transition-all border",
                activeTab === sem
                  ? "bg-white text-black border-white"
                  : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:text-white"
              )}
            >
              {sem}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">

            <motion.div
              key={activeTab + searchQuery}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3
                gap-4
                md:gap-6
              "
            >

              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="
                      h-[240px]
                      rounded-2xl
                      bg-white/[0.03]
                      border
                      border-white/[0.05]
                      animate-pulse
                    "
                  />
                ))
              ) : filteredCourses.length > 0 ? (

                filteredCourses.map((course, index) => (

                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: index * 0.04,
                    }}
                    onClick={() => navigate(`/courses/${course._id}`)}
                    className="
                      group
                      rounded-2xl
                      overflow-hidden
                      border
                      border-white/[0.06]
                      bg-[#0F0F0F]
                      hover:border-white/[0.12]
                      transition-all
                      cursor-pointer
                    "
                  >

                    {/* IMAGE */}
                    <div className="relative h-40 sm:h-44 overflow-hidden">

                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt=""
                          className="
                            w-full
                            h-full
                            object-cover
                            opacity-70
                            group-hover:scale-105
                            group-hover:opacity-90
                            transition-all
                            duration-500
                          "
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#111]">
                          <BookMarked className="w-8 h-8 text-white/10" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/20 to-transparent" />

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] text-white/70">
                          {course.category}
                        </span>
                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className="p-4 md:p-5">

                      <h3 className="
                        text-base
                        font-semibold
                        text-white
                        leading-snug
                        mb-3
                        group-hover:text-primary
                        transition-colors
                        line-clamp-2
                      ">
                        {course.title}
                      </h3>

                      <p className="
                        text-xs
                        text-white/40
                        leading-relaxed
                        line-clamp-2
                        mb-5
                      ">
                        {course.description ||
                          "Structured learning modules for polytechnic students."}
                      </p>

                      {/* FOOTER */}
                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-4 text-white/35">

                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span className="text-[11px]">
                              {course.sections?.length || 0} Units
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[11px]">
                              Self-paced
                            </span>
                          </div>

                        </div>

                        <div className="
                          w-8
                          h-8
                          rounded-full
                          bg-white
                          text-black
                          flex
                          items-center
                          justify-center
                          opacity-0
                          group-hover:opacity-100
                          transition-all
                        ">
                          <ArrowRight className="w-4 h-4" />
                        </div>

                      </div>

                    </div>

                  </motion.div>
                ))

              ) : (

                <div className="
                  col-span-full
                  rounded-2xl
                  border
                  border-dashed
                  border-white/[0.08]
                  bg-[#0F0F0F]
                  py-20
                  text-center
                ">
                  <Search className="w-5 h-5 mx-auto mb-4 text-white/20" />

                  <h3 className="text-sm font-medium text-white mb-1">
                    No courses found
                  </h3>

                  <p className="text-xs text-white/40">
                    Try changing semester or search query.
                  </p>
                </div>

              )}

            </motion.div>

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}