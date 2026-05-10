import { useState } from "react";
import { Clock, BookOpen, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourses } from "@/context/CourseContext";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ── skeleton ──────────────────────────────────────────────────────────────────
function CourseCardSkeleton() {
  return (
    <div className="bg-[#222] rounded-[24px] overflow-hidden border border-white/5">
      <Skeleton className="w-full h-[200px] rounded-none bg-muted/30" />
      <div className="p-8 space-y-4">
        <Skeleton className="h-4 w-3/4 bg-muted/30" />
        <Skeleton className="h-3 w-full bg-muted/30" />
        <Skeleton className="h-3 w-5/6 bg-muted/30" />
        <Skeleton className="h-12 w-full mt-4 bg-muted/30 rounded-xl" />
      </div>
    </div>
  );
}

// ── level badge color ─────────────────────────────────────────────────────────
function levelColor(level) {
  if (level === "Beginner")     return "bg-white text-black";
  if (level === "Intermediate") return "bg-blue-500 text-white";
  return "bg-purple-500 text-white";
}

// ── course card ───────────────────────────────────────────────────────────────
function CourseCard({ course }) {
  const navigate   = useNavigate();
  const user       = useSelector((state) => state.auth.user);
  const isEnrolled = false; // will be replaced by real enrollment check

  return (
    <div className="bg-[#222] rounded-[32px] overflow-hidden border border-white/5 flex flex-col hover:border-primary/50 transition-all duration-500 group shadow-2xl relative">
      {/* FREE badge */}
      <div className="absolute top-6 left-6 z-10 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
        SYLLABUS COVERED
      </div>

      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-[16/9]">
        <img
          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#222] via-transparent to-transparent opacity-70" />
      </div>

      {/* Body */}
      <div className="p-10 flex flex-col flex-1">
        {/* Level + Category */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${levelColor(course.level)}`}>
            {course.subtitle || "CORE"}
          </span>
          <span className="text-muted-foreground text-[9px] font-black uppercase tracking-widest">
            {course.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-black text-xl uppercase tracking-tight mb-4 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {course.title}
        </h3>

        {/* Units Count */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <GraduationCap size={16} />
          </div>
          <p className="text-[#9ca3af] text-[10px] font-bold uppercase tracking-widest">
            {course.sections?.length || 0} Units Included
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-auto pt-8 border-t border-white/5">
          <span className="flex items-center gap-2">
            <Clock size={13} className="text-primary" />
            Full Course Access
          </span>
          <span className="flex items-center gap-2">
            <BookOpen size={13} className="text-primary" />
            Notes Ready
          </span>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <button
            onClick={() => navigate(`/courses/${course._id}`)}
            className="w-full py-5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95 hover:bg-primary/90 shadow-xl shadow-primary/20"
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function Courses() {
  const { courses, loading, error } = useCourses();
  const [activeTab, setActiveTab] = useState("Semester 2");

  const CATEGORIES = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Development", "Design", "Business", "Marketing", "Data Science"];
  const semesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"];

  const filteredCourses = courses.filter(course => {
    if (!course.category) return false;
    // Flexible match: "Semester 2", "semester 2", "2", "Sem 2"
    const cat = course.category.toLowerCase().trim();
    const active = activeTab.toLowerCase().trim();
    return cat === active || cat.includes(active.split(" ")[1]);
  });

  return (
    <section className="bg-[#111] min-h-screen py-20 md:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto mb-16 md:mb-20 text-center">
        <p className="text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-4 md:mb-6">Academic Excellence</p>
        <h2 className="text-white text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase mb-6 md:mb-8">
          Semester Hub
        </h2>
        <div className="w-16 md:w-24 h-1 bg-primary mx-auto mb-6 md:mb-8 rounded-full" />
        <p className="text-[#9ca3af] text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed px-4">
          Structured learning paths for your entire degree. Select your semester to access subjects, units, and resources.
        </p>
      </div>

      <div className="max-w-7xl mx-auto mb-16">
        <Tabs defaultValue="Semester 2" onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-12 md:mb-16 overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="bg-[#1a1a1a] border border-white/5 p-1 md:p-2 rounded-xl md:rounded-2xl h-auto flex-nowrap whitespace-nowrap">
              {semesters.map((sem) => (
                <TabsTrigger 
                  key={sem} 
                  value={sem}
                  className="px-4 md:px-8 py-2.5 md:py-4 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all shrink-0"
                >
                  {sem.split(" ")[1]} SEM
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {semesters.map((sem) => (
            <TabsContent key={sem} value={sem} className="mt-0 outline-none">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                  {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
                </div>
              ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="max-w-3xl mx-auto py-20 md:py-32 text-center bg-[#1a1a1a] rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-2xl px-6">
                  <GraduationCap size={48} md:size={60} strokeWidth={1} className="text-primary mx-auto mb-6 md:mb-8 opacity-20" />
                  <p className="text-white font-black text-lg md:text-xl uppercase tracking-widest mb-3 md:mb-4">No Courses Found</p>
                  <p className="text-muted-foreground text-xs md:text-sm font-medium">We couldn't find any courses for {sem}.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold uppercase tracking-widest text-center">
          Failed to load courses. Please try refreshing the page.
        </div>
      )}
    </section>
  );
}