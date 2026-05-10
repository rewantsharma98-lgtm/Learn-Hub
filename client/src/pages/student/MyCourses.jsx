import { useState } from "react";
import {
  Clock, BookOpen, PlayCircle, CheckCircle,
  AlertCircle, Mail, Shield,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoadUserQuery } from "@/features/api/authApi";
import { useGetEnrolledCoursesQuery } from "@/features/api/courseApi";
import { useNavigate } from "react-router-dom";

// ── helpers ───────────────────────────────────────────────────────────────────
function getInitials(name, email) {
  if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  if (email) return email[0].toUpperCase();
  return "?";
}

// ── skeletons ────────────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex items-center gap-5">
        <Skeleton className="w-16 h-16 rounded-full bg-muted" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40 bg-muted" />
          <Skeleton className="h-3 w-56 bg-muted" />
        </div>
      </div>
    </div>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <Skeleton className="h-44 w-full bg-muted" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4 bg-muted" />
        <Skeleton className="h-3 w-full bg-muted" />
        <Skeleton className="h-10 w-full bg-muted mt-2" />
      </div>
    </div>
  );
}

// ── profile ───────────────────────────────────────────────────────────────────
function ProfileCard({ user, courseStats }) {
  const initials = getInitials(user?.name, user?.email);

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8 flex justify-between flex-wrap gap-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          {initials}
        </div>

        <div>
          <h2 className="text-white font-bold">{user?.name}</h2>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>
      </div>

      <div className="flex gap-6">
        <Stat label="Enrolled" value={courseStats.total} />
        <Stat label="Progress" value={courseStats.inProgress} />
        <Stat label="Completed" value={courseStats.completed} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-white font-bold text-xl">{value}</div>
      <div className="text-muted-foreground text-xs">{label}</div>
    </div>
  );
}

// ── course card ──────────────────────────────────────────────────────────────
function MyCourseCard({ course }) {
  const navigate = useNavigate();

  const status =
    course.progress === 100
      ? "completed"
      : course.progress > 0
      ? "inprogress"
      : "notstarted";

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <img
        src={course.thumbnail}
        className="h-44 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="text-white font-semibold line-clamp-2">
          {course.title}
        </h3>

        <p className="text-muted-foreground text-sm mt-1">
          {course.lessonsCompleted || 0}/{course.totalLessons || 0} lessons
        </p>

        <div className="mt-3 text-xs text-muted-foreground">
          Progress: {course.progress || 0}%
        </div>

        <button
          onClick={() => navigate(`/learn/${course._id}`)}  
          className="w-full mt-4 bg-primary text-white py-2 rounded-md"
        >
          {status === "completed"
            ? "Review Course"
            : status === "inprogress"
            ? "Continue Learning"
            : "Start Course"}
        </button>
      </div>
    </div>
  );
}

// ── empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="text-center py-20 text-muted-foreground">
      <BookOpen className="mx-auto mb-3" />
      <h2 className="text-white font-bold">No courses enrolled</h2>
      <p>Go to explore courses and enroll first</p>
    </div>
  );
}

// ── main ─────────────────────────────────────────────────────────────────────
export default function MyCourses() {
  const { data: userData, isLoading: userLoading } = useLoadUserQuery();
  const { data: enrolledData, isLoading } = useGetEnrolledCoursesQuery();

  const user = userData?.user;

  const enrolledCourses = enrolledData?.courses || [];

  const courseStats = {
    total: enrolledCourses.length,
    inProgress: enrolledCourses.filter((c) => c.progress > 0 && c.progress < 100).length,
    completed: enrolledCourses.filter((c) => c.progress === 100).length,
  };

  return (
    <div className="min-h-screen bg-background p-6">

      {/* PROFILE */}
      {userLoading ? (
        <ProfileSkeleton />
      ) : (
        <ProfileCard user={user} courseStats={courseStats} />
      )}

      {/* COURSES */}
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : enrolledCourses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {enrolledCourses.map((c) => (
            <MyCourseCard key={c._id} course={c} />
          ))}
        </div>
      )}

    </div>
  );
}