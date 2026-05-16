import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  BookOpen,
  Search,
  ChevronRight,
  ChevronLeft,
  Play,
  Info,
  Plus,
  Check,
} from "lucide-react";

import { useCourses } from "@/context/CourseContext";
import { useGetEnrolledCoursesQuery } from "@/features/api/courseApi";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Courses() {
  const { courses, loading } = useCourses();
  const { data: enrolledData } = useGetEnrolledCoursesQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const enrolledCourses = enrolledData?.courses || [];

  const semesters = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
  ];

  // Featured Course for Hero
  const featuredCourse = useMemo(() => {
    if (courses.length > 0) {
      return courses.find(c => c.category === "Semester 2") || courses[0];
    }
    return null;
  }, [courses]);

  const groupedCourses = useMemo(() => {
    const groups = {};
    semesters.forEach(sem => {
      groups[sem] = courses.filter(c => 
        c.category?.toLowerCase().includes(sem.toLowerCase()) &&
        c.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    return groups;
  }, [courses, searchQuery]);

  if (loading) {
    return (
      <div className="h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-[11px] font-medium text-white/40 uppercase tracking-widest">Initializing Library</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-20 overflow-x-hidden">
      {/* HERO SECTION */}
      {featuredCourse && !searchQuery && (
        <section className="relative h-[60vh] sm:h-[70vh] md:h-[85vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={featuredCourse.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80"} 
              className="w-full h-full object-cover opacity-60"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 w-full p-5 pb-20 sm:p-10 md:p-16 lg:p-24 space-y-4 sm:space-y-6 max-w-[900px] z-10">
            <div className="flex items-center gap-2 mb-1 sm:mb-4">
               <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-primary" />
               <span className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/50 font-bold">Featured Selection</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] drop-shadow-2xl max-w-[95%]">
              {featuredCourse.title}
            </h1>

            <p className="text-[11px] sm:text-sm md:text-lg text-white/60 line-clamp-2 sm:line-clamp-3 max-w-xl font-medium leading-relaxed drop-shadow-md mt-2 md:mt-4">
              {featuredCourse.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4 sm:pt-8">
              <button 
                onClick={() => navigate(`/courses/${featuredCourse._id}`)}
                className="h-9 sm:h-12 md:h-14 px-4 sm:px-8 md:px-10 rounded-lg bg-white text-black font-bold flex items-center gap-2 sm:gap-3 hover:bg-white/90 transition-all transform active:scale-95"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
                <span className="text-[11px] sm:text-sm md:text-base">Play</span>
              </button>

              <button 
                onClick={() => navigate(`/courses/${featuredCourse._id}`)}
                className="h-9 sm:h-12 md:h-14 px-4 sm:px-8 md:px-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold flex items-center gap-2 sm:gap-3 hover:bg-white/20 transition-all"
              >
                <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[11px] sm:text-sm md:text-base">Details</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SEARCH & CONTENT */}
      <div className={cn(
        "px-4 md:px-12 transition-all duration-500",
        searchQuery ? "pt-28 sm:pt-32" : "mt-8 sm:mt-[-60px] md:mt-[-100px] relative z-20"
      )}>
        
        {/* TOPBAR / SEARCH */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
           <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
             {searchQuery ? `Results for "${searchQuery}"` : "Browse Catalogue"}
           </h2>

           <div className="relative group w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 group-focus-within:text-white transition-colors" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="h-9 sm:h-10 pl-9 pr-4 rounded-full bg-white/5 border border-white/10 w-full sm:w-[200px] md:w-[280px] text-xs sm:text-sm focus:outline-none focus:sm:w-[350px] focus:bg-white/10 transition-all duration-300"
              />
           </div>
        </div>

        {/* CONTENT ROWS */}
        <div className="space-y-10 sm:space-y-16">
          {/* CONTINUE WATCHING */}
          {enrolledCourses.length > 0 && !searchQuery && (
            <CourseRow 
              title="Continue Watching" 
              courses={enrolledCourses} 
              navigate={navigate}
              isEnrolled={true}
            />
          )}

          {/* SEMESTER ROWS */}
          {semesters.map(sem => (
            groupedCourses[sem].length > 0 && (
              <CourseRow 
                key={sem}
                title={sem} 
                courses={groupedCourses[sem]} 
                navigate={navigate}
              />
            )
          ))}

          {/* NO RESULTS */}
          {Object.values(groupedCourses).every(g => g.length === 0) && (
             <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-white/20" />
                </div>
                <p className="text-white/40 font-medium text-sm">No courses found matching your search.</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-primary underline underline-offset-4 opacity-60 hover:opacity-100 transition-opacity"
                >
                  Clear search
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CourseRow({ title, courses, navigate, isEnrolled = false }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 group/row relative">
      <h3 className="text-base sm:text-xl font-bold tracking-tight px-1 flex items-center gap-2">
        {title}
        <ChevronRight className="w-4 h-4 text-white/30" />
      </h3>

      <div className="relative">
        {/* NAV BUTTONS (Hidden on mobile) */}
        <button 
          onClick={() => scroll("left")}
          className="absolute left-[-20px] md:left-[-48px] top-0 bottom-0 w-10 md:w-12 z-40 bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-black/80"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 px-1"
        >
          {courses.map((course) => (
            <div 
              key={course._id}
              onClick={() => navigate(isEnrolled ? `/learn/${course._id}` : `/courses/${course._id}`)}
              className="flex-shrink-0 w-[160px] sm:w-[240px] md:w-[320px] aspect-video netflix-card cursor-pointer snap-start"
            >
              <div className="w-full h-full rounded-sm sm:rounded-md overflow-hidden relative border border-white/5">
                <img 
                  src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} 
                  className="w-full h-full object-cover"
                  alt={course.title}
                />
                
                {/* Progress bar if enrolled */}
                {isEnrolled && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-white/10">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${course.progress || 0}%` }}
                    />
                  </div>
                )}

                {/* OVERLAY ON HOVER */}
                <div className="absolute inset-0 bg-black/75 opacity-0 md:hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3 sm:p-5 space-y-2">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-black text-black ml-0.5" />
                      </div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white/40 flex items-center justify-center hover:border-white transition-colors">
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                   </div>
                   <div className="space-y-0.5">
                     <h4 className="text-[10px] sm:text-xs md:text-sm font-black text-white leading-tight line-clamp-1">{course.title}</h4>
                     <div className="flex items-center gap-2 text-[8px] sm:text-[10px] font-bold text-white/50">
                        <span className="text-green-400">98% Match</span>
                        <span>{course.sections?.length || 0} Units</span>
                     </div>
                   </div>
                </div>
              </div>
              
              {/* Fallback title for mobile/no-hover */}
              <div className="mt-2 block md:hidden">
                <h4 className="text-[10px] font-medium truncate text-white/70">{course.title}</h4>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll("right")}
          className="absolute right-[-20px] md:right-[-48px] top-0 bottom-0 w-10 md:w-12 z-40 bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-black/80"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
