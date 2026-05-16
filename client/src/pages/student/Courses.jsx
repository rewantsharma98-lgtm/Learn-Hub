import { useState, useMemo, useRef, useEffect } from "react";
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
import { useSelector } from "react-redux";

import { useCourses } from "@/context/CourseContext";
import { useGetEnrolledCoursesQuery } from "@/features/api/courseApi";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Courses() {
  const { courses, loading } = useCourses();
  const { data: enrolledData } = useGetEnrolledCoursesQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const enrolledCourses = enrolledData?.courses || [];

  const semesters = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
  ];

  // FEATURED CAROUSEL LOGIC
  const featuredPool = useMemo(() => {
    if (courses.length === 0) return [];
    // Priority subjects for the hero
    const priority = [
      "Applied Physics-II", 
      "Hydraulics", 
      "Computer Network", 
      "Engineering Mathematics-II",
      "Object Oriented Programming (C++)"
    ];
    
    const sorted = [...courses].sort((a, b) => {
      const aIndex = priority.indexOf(a.title);
      const bIndex = priority.indexOf(b.title);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });

    return sorted.slice(0, 5);
  }, [courses]);

  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const featuredCourse = featuredPool[currentFeaturedIndex];

  useEffect(() => {
    if (featuredPool.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredPool.length);
    }, 8000); // Cycle every 8 seconds
    return () => clearInterval(interval);
  }, [featuredPool]);

  const groupedCourses = useMemo(() => {
    const groups = {
      "Civil Engineering": courses.filter(c => c.category === "Civil Engineering"),
      "Computer Science & Technology": courses.filter(c => c.category === "Computer Science & Technology"),
      "General Engineering": courses.filter(c => !["Civil Engineering", "Computer Science & Technology"].includes(c.category))
    };
    return groups;
  }, [courses]);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return courses.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  const recommendedCourses = useMemo(() => {
    if (!user || !user.semester || !user.department) return [];
    return courses.filter(c => {
      const matchSem = c.targetSemester === user.semester || c.category?.includes(`Semester ${user.semester}`);
      const matchDept = c.targetDepartment === user.department || c.targetDepartment === "All" || c.targetDepartment === "Common";
      return matchSem && matchDept && c.title?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [courses, user, searchQuery]);

  const trendingCourses = useMemo(() => {
    // Mix some CST and some Civil courses
    return [...courses].sort(() => 0.5 - Math.random()).slice(0, 8);
  }, [courses]);

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
      {/* HERO SECTION - ANIMATED CAROUSEL */}
      {featuredCourse && !searchQuery && (
        <section className="relative h-[60vh] sm:h-[70vh] md:h-[85vh] w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={featuredCourse._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img 
                src={featuredCourse.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80"} 
                className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 w-full p-5 pb-20 sm:p-10 md:p-16 lg:p-24 space-y-4 sm:space-y-6 max-w-[900px] z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={`info-${featuredCourse._id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
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
                    className="h-9 sm:h-12 md:h-14 px-4 sm:px-8 md:px-10 rounded-lg bg-white text-black font-bold flex items-center gap-2 sm:gap-3 hover:bg-white/90 transition-all transform active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
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
              </motion.div>
            </AnimatePresence>

            {/* Carousel Indicators */}
            <div className="flex gap-2 mt-8">
               {featuredPool.map((_, i) => (
                 <div 
                   key={i}
                   className={cn(
                     "h-1 rounded-full transition-all duration-500",
                     i === currentFeaturedIndex ? "w-8 bg-primary" : "w-2 bg-white/20"
                   )}
                 />
               ))}
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

        {/* SEARCH RESULTS GRID */}
        {searchQuery ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {searchResults.map((course) => (
              <div 
                key={course._id}
                onClick={() => navigate(`/courses/${course._id}`)}
                className="group/card relative aspect-[2/3] cursor-pointer"
              >
                <div className="w-full h-full rounded-md overflow-hidden border border-white/5 bg-white/5 transition-all duration-300 group-hover/card:scale-105 group-hover/card:z-10 shadow-lg">
                  <img 
                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} 
                    className="w-full h-full object-cover"
                    alt={course.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                     <h4 className="text-[10px] font-bold truncate text-white">{course.title}</h4>
                     <p className="text-[8px] text-white/50 uppercase tracking-widest font-black">{course.category?.split(" ")[0]}</p>
                  </div>
                </div>
              </div>
            ))}
            {searchResults.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-white/40">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-16">
            {/* CONTINUE WATCHING */}
            {enrolledCourses.length > 0 && (
              <CourseRow 
                title="Continue Watching" 
                courses={enrolledCourses} 
                navigate={navigate}
                isEnrolled={true}
              />
            )}

            {/* TRENDING / MIXED */}
            {trendingCourses.length > 0 && (
              <CourseRow 
                title="Trending Now" 
                courses={trendingCourses} 
                navigate={navigate}
                highlight={true}
              />
            )}

            {/* RECOMMENDED */}
            {user && user.semester && recommendedCourses.length > 0 && (
              <CourseRow 
                title="Recommended for Your Profile" 
                courses={recommendedCourses} 
                navigate={navigate}
              />
            )}

            {/* DEPARTMENT ROWS */}
            {Object.entries(groupedCourses).map(([dept, deptCourses]) => (
              deptCourses.length > 0 && (
                <CourseRow 
                  key={dept}
                  title={dept} 
                  courses={deptCourses} 
                  navigate={navigate}
                />
              )
            ))}
          </div>
        )}
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
              className="flex-shrink-0 w-[140px] sm:w-[200px] md:w-[260px] aspect-[2/3] cursor-pointer snap-start group/card relative"
            >
              <div className="w-full h-full rounded-md overflow-hidden relative border border-white/5 transition-all duration-500 group-hover/card:scale-110 group-hover/card:z-50 group-hover/card:shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
                <img 
                  src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} 
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover/card:scale-110",
                    course.isLocked && "grayscale-[0.5] contrast-[0.8]"
                  )}
                  alt={course.title}
                />
                
                {/* NETFLIX STYLE OVERLAYS */}
                {course.isLocked && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                           <Clock className="w-5 h-5 text-white/60 animate-pulse" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">Coming Soon</span>
                     </div>
                  </div>
                )}
                <div className="absolute top-2 right-2 z-20">
                   <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-[6px] sm:text-[8px] font-black text-white/90 uppercase tracking-widest">
                      {course.category?.includes("Civil") ? "Civil" : "CST"}
                   </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity duration-300" />
                
                {/* TITLE ON IMAGE (POSTER STYLE) - ONLY ON HOVER */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-y-2 group-hover/card:translate-y-[-48px]">
                   <h4 className="text-[11px] sm:text-xs md:text-sm font-black text-white leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,1)] uppercase tracking-tighter italic">
                      {course.title}
                   </h4>
                </div>

                {/* Progress bar if enrolled */}
                {isEnrolled && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-white/10">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${course.progress || 0}%` }}
                    />
                  </div>
                )}

                {/* EXPANDED INFO ON HOVER */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-y-10 group-hover/card:translate-y-0">
                   <div className="flex items-center gap-2 mb-2">
                      {course.isLocked ? (
                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-white/40 uppercase tracking-widest">
                           Locked
                        </div>
                      ) : (
                        <>
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                            <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-black text-black ml-0.5" />
                          </div>
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        </>
                      )}
                   </div>
                   <div className="flex items-center gap-2 text-[7px] sm:text-[9px] font-bold text-white/50">
                      <span className="text-green-400">98% Match</span>
                      <span>{course.sections?.length || 0} Units</span>
                      <span className="px-1 border border-white/20 rounded-[2px]">{course.level || "Beg"}</span>
                   </div>
                </div>
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
