import { useParams, useNavigate } from "react-router-dom";
import { useCourses } from "@/context/CourseContext";
import { CheckCircle, Clock, BookOpen, LayoutDashboard, FileText } from "lucide-react";
import ProtectedAction from "@/components/ProtectedAction";
import { useEnrollInCourseMutation, useGetEnrolledCoursesQuery } from "@/features/api/courseApi";
import { toast } from "sonner";

export default function CourseDetails() {
  const { id } = useParams();
  const { courses } = useCourses();
  const navigate = useNavigate();

  const [enrollInCourse, { isLoading: isEnrolling }] = useEnrollInCourseMutation();
  const { data: enrolledData } = useGetEnrolledCoursesQuery();
  
  const isEnrolled = enrolledData?.courses?.some(c => String(c._id) === id);

  const course = courses.find((c) => String(c._id) === id);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white p-6">
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
            <BookOpen size={40} className="text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Course Loading</h2>
            <p className="text-muted-foreground text-xs uppercase font-bold tracking-[0.2em]">Synchronizing with Semester Hub...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (isEnrolled) {
      navigate(`/learn/${id}`);
      return;
    }
    try {
      await enrollInCourse(id).unwrap();
      toast.success("Enrolled successfully!");
      navigate(`/learn/${id}`);
    } catch (err) {
      toast.error(err?.data?.message || "Enrollment failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">

      {/* HERO & CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <img
              src={course.thumbnail}
              className="w-full h-auto aspect-video object-cover rounded-xl border border-border shadow-lg"
              alt={course.title}
            />

            <div className="pt-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{course.title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">{course.description}</p>
            </div>
            
            <div className="flex gap-4">
               <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-sm font-semibold text-sm">
                 {course.level}
               </span>
               <span className="bg-muted px-4 py-1.5 rounded-sm text-white font-medium text-sm">
                 {course.category}
               </span>
               <span className="bg-muted px-4 py-1.5 rounded-sm text-white font-medium text-sm">
                 {course.hours} hours
               </span>
            </div>
          </div>

          {/* RIGHT SIDEBAR: Pricing & Details */}
          <div className="bg-card p-6 rounded-xl border border-border sticky top-24 shadow-md">
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-medium text-white">Price</span>
              <span className="text-3xl font-bold text-primary">FREE</span>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-white mb-5 text-sm">What you'll get:</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                   <div className="mt-0.5 bg-muted p-2 rounded-md border border-border">
                     <Clock size={16} className="text-primary" />
                   </div>
                   <div>
                     <p className="text-white text-sm font-medium">Course Duration</p>
                     <p className="text-muted-foreground text-xs mt-0.5">{course.hours} hours</p>
                   </div>
                </li>
                <li className="flex items-start gap-4">
                   <div className="mt-0.5 bg-muted p-2 rounded-md border border-border">
                     <BookOpen size={16} className="text-primary" />
                   </div>
                   <div>
                     <p className="text-white text-sm font-medium">Difficulty Level</p>
                     <p className="text-muted-foreground text-xs mt-0.5">{course.level}</p>
                   </div>
                </li>
                <li className="flex items-start gap-4">
                   <div className="mt-0.5 bg-muted p-2 rounded-md border border-border">
                     <LayoutDashboard size={16} className="text-primary" />
                   </div>
                   <div>
                     <p className="text-white text-sm font-medium">Category</p>
                     <p className="text-muted-foreground text-xs mt-0.5">{course.category}</p>
                   </div>
                </li>
                <li className="flex items-start gap-4">
                   <div className="mt-0.5 bg-muted p-2 rounded-md border border-border">
                     <FileText size={16} className="text-primary" />
                   </div>
                   <div>
                     <p className="text-white text-sm font-medium">Total Lessons</p>
                     <p className="text-muted-foreground text-xs mt-0.5">{course.lectures?.length || 0} lessons</p>
                   </div>
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-white mb-4 text-sm">This course includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle size={16} className="text-green-500 shrink-0" />
                  Full lifetime access
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle size={16} className="text-green-500 shrink-0" />
                  Access on mobile and desktop
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle size={16} className="text-green-500 shrink-0" />
                  Certificate of completion
                </li>
              </ul>
            </div>

            <ProtectedAction>
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full py-3.5 bg-primary hover:bg-[#c94f28] text-white rounded-md font-semibold transition-colors duration-200 disabled:opacity-50"
              >
                {isEnrolling ? "Enrolling..." : isEnrolled ? "Go to Course" : "Enroll Now!"}
              </button>
            </ProtectedAction>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}