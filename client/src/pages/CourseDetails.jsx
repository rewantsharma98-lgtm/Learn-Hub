import { useParams, useNavigate } from "react-router-dom";
import { useCourses } from "@/context/CourseContext";

import {
  ArrowLeft,
  Play,
  Clock,
  BookOpen,
  ShieldCheck,
  Layers,
  ChevronRight,
} from "lucide-react";

import ProtectedAction from "@/components/ProtectedAction";

import {
  useEnrollInCourseMutation,
  useGetEnrolledCoursesQuery,
} from "@/features/api/courseApi";

import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function CourseDetails() {
  const { id } = useParams();

  const { courses } = useCourses();

  const navigate = useNavigate();

  const [enrollInCourse, { isLoading: isEnrolling }] =
    useEnrollInCourseMutation();

  const { data: enrolledData } = useGetEnrolledCoursesQuery();

  const isEnrolled = enrolledData?.courses?.some(
    (c) => String(c._id) === id
  );

  const course = courses.find((c) => String(c._id) === id);
  const user = useSelector((state) => state.auth.user);

  const canEnroll = () => {
    if (!course || !user) return false;
    if (user.role === "admin") return true;

    const userSem = String(user.semester).toLowerCase().replace(/[^0-9a-z]/g, "");
    const courseSem = String(course.targetSemester).toLowerCase().replace(/[^0-9a-z]/g, "");

    const matchSem = course.targetSemester === "All" || 
                     userSem === courseSem || 
                     course.category?.toLowerCase().includes(userSem);
    
    const matchDept = course.targetDepartment === "All" || 
                      course.targetDepartment === "Common" || 
                      course.targetDepartment === user.department;
                      
    return matchSem && matchDept;
  };

  const isAllowed = canEnroll();

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs text-white/40">
            Loading course...
          </span>
        </div>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (isEnrolled) {
      navigate(`/learn/${id}`);
      return;
    }

    if (!isAllowed) {
       toast.error("You are not eligible to enroll in this course based on your semester and department.");
       return;
    }

    try {
      await enrollInCourse(id).unwrap();

      toast.success("Successfully enrolled");

      navigate(`/learn/${id}`);
    } catch (err) {
      toast.error(err?.data?.message || "Enrollment failed");
    }
  };

  return (
    <section className="min-h-screen bg-[#0A0A0A] pt-20 md:pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 subtle-noise opacity-40" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px]" />

      <div className="max-w-[1200px] mx-auto relative z-10">

        {/* BACK */}
        <button
          onClick={() => navigate("/courses")}
          className="
            flex
            items-center
            gap-2
            text-white/40
            hover:text-white
            transition-colors
            text-xs
            mb-8
          "
        >
          <ArrowLeft className="w-4 h-4" />
          Back to courses
        </button>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">

          {/* LEFT */}
          <div>

            {/* HERO IMAGE */}
            <div className="
              relative
              aspect-video
              rounded-3xl
              overflow-hidden
              border
              border-white/[0.06]
              bg-[#111]
              mb-8
            ">

              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt=""
                  className="
                    w-full
                    h-full
                    object-cover
                    opacity-70
                  "
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-white/10" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5">

                <div className="flex items-center gap-2 mb-4">

                  <span className="
                    px-3
                    py-1
                    rounded-full
                    bg-black/40
                    backdrop-blur-md
                    border
                    border-white/10
                    text-[10px]
                    text-white/70
                  ">
                    {course.category || "Course"}
                  </span>

                  <span className="text-[11px] text-white/50">
                    Polytechnic Program
                  </span>

                </div>

                <h1 className="
                  text-2xl
                  sm:text-3xl
                  md:text-5xl
                  font-semibold
                  leading-tight
                  tracking-tight
                  text-white
                  max-w-3xl
                ">
                  {course.title}
                </h1>

              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="mb-10">

              <p className="
                text-sm
                md:text-[15px]
                leading-7
                text-white/55
                max-w-3xl
              ">
                {course.description ||
                  "Structured learning experience designed for polytechnic students with practical curriculum, semester modules, and guided learning."}
              </p>

            </div>

            {/* MOBILE ACTION CARD */}
            <div className="lg:hidden mb-10">

              <div className="
                rounded-2xl
                border
                border-white/[0.06]
                bg-[#0F0F0F]
                p-5
              ">

                <ProtectedAction>
                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling || (!isEnrolled && !isAllowed)}
                    className="
                      w-full
                      h-11
                      rounded-xl
                      bg-white
                      text-black
                      text-sm
                      font-medium
                      hover:bg-white/90
                      transition-colors
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    {isEnrolling
                      ? "Processing..."
                      : isEnrolled
                      ? "Continue Learning"
                      : !isAllowed
                      ? "Restricted Access"
                      : "Enroll Now"}
                  </button>
                </ProtectedAction>

              </div>

            </div>

            {/* CURRICULUM */}
            <div>

              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Curriculum
                  </h2>

                  <p className="text-sm text-white/40 mt-1">
                    Semester modules and learning units
                  </p>
                </div>

                <div className="
                  hidden
                  sm:flex
                  items-center
                  gap-2
                  text-xs
                  text-white/40
                ">
                  <Layers className="w-4 h-4" />
                  {course.sections?.length || 0} Sections
                </div>

              </div>

              <div className="
                rounded-2xl
                overflow-hidden
                border
                border-white/[0.06]
                bg-[#0F0F0F]
              ">

                {course.sections?.map((section, idx) => (
                  <div
                    key={idx}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      px-4
                      md:px-6
                      py-5
                      border-b
                      border-white/[0.04]
                      hover:bg-white/[0.02]
                      transition-colors
                    "
                  >

                    <div className="flex items-center gap-4">

                      <div className="
                        w-9
                        h-9
                        rounded-xl
                        bg-white/[0.03]
                        border
                        border-white/[0.06]
                        flex
                        items-center
                        justify-center
                        text-xs
                        text-white/40
                      ">
                        {idx + 1}
                      </div>

                      <div>

                        <h3 className="
                          text-sm
                          md:text-[15px]
                          font-medium
                          text-white
                        ">
                          {section.title}
                        </h3>

                        <p className="text-xs text-white/35 mt-1">
                          {section.lectures?.length || 0} lectures
                        </p>

                      </div>

                    </div>

                    <ChevronRight className="w-4 h-4 text-white/20" />

                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden lg:block">

            <div className="
              sticky
              top-24
              rounded-3xl
              border
              border-white/[0.06]
              bg-[#0F0F0F]
              overflow-hidden
            ">

              {/* PREVIEW */}
              <div className="
                aspect-video
                relative
                border-b
                border-white/[0.05]
              ">

                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt=""
                    className="
                      w-full
                      h-full
                      object-cover
                      opacity-70
                    "
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white/10" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/30" />

                <div className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                ">

                  <div className="
                    w-14
                    h-14
                    rounded-full
                    bg-white/10
                    backdrop-blur-xl
                    border
                    border-white/20
                    flex
                    items-center
                    justify-center
                  ">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>

                </div>

              </div>

              {/* CONTENT */}
              <div className="p-6">

                <ProtectedAction>
                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling || (!isEnrolled && !isAllowed)}
                    className="
                      w-full
                      h-11
                      rounded-xl
                      bg-white
                      text-black
                      text-sm
                      font-medium
                      hover:bg-white/90
                      transition-colors
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    {isEnrolling
                      ? "Processing..."
                      : isEnrolled
                      ? "Continue Learning"
                      : !isAllowed
                      ? "Restricted Access"
                      : "Enroll Now"}
                  </button>
                </ProtectedAction>

                {/* FEATURES */}
                <div className="mt-8 space-y-4">

                  <div className="flex items-center gap-3 text-sm text-white/55">
                    <Clock className="w-4 h-4 text-white/30" />
                    Self-paced learning
                  </div>

                  <div className="flex items-center gap-3 text-sm text-white/55">
                    <Layers className="w-4 h-4 text-white/30" />
                    {course.sections?.length || 0} curriculum sections
                  </div>

                  <div className="flex items-center gap-3 text-sm text-white/55">
                    <ShieldCheck className="w-4 h-4 text-white/30" />
                    Lifetime access
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}