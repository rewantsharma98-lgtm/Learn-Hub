import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetCourseByIdQuery,
  useGetLecturesQuery,
  useUpdateLectureProgressMutation,
  useGetCourseProgressQuery,
} from "@/features/api/courseApi";
import { useSelector } from "react-redux";

import {
  CheckCircle2,
  BookOpen,
  PenTool,
  ArrowLeft,
  Menu,
  X,
  Play,
  Lock,
  FileText,
  Shield,
} from "lucide-react";

import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

function extractYouTubeId(url = "") {
  if (!url) return null;
  const idMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return idMatch ? idMatch[1] : null;
}

// ── Protected Notes Container ─────────────────────────────────────────────────
function ProtectedContent({ children, watermarkText }) {
  const containerRef = useRef(null);

  // Block keyboard shortcuts for copy/print/save/screenshot
  const handleKeyDown = useCallback((e) => {
    const blocked = ["s", "p", "a", "c", "u", "i", "j"];
    if ((e.ctrlKey || e.metaKey) && blocked.includes(e.key.toLowerCase())) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Block PrintScreen
    if (e.key === "PrintScreen") {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [handleKeyDown]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {/* Watermark grid overlay */}
      {watermarkText && (
        <div
          className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
          style={{ borderRadius: "inherit" }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-white/[0.04] text-[10px] font-bold select-none"
              style={{
                top: `${(i % 4) * 25}%`,
                left: `${Math.floor(i / 4) * 33}%`,
                transform: "rotate(-25deg)",
                whiteSpace: "nowrap",
                fontSize: "10px",
              }}
            >
              {watermarkText}
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const { data: courseData, isLoading: courseLoading } =
    useGetCourseByIdQuery(id);

  const { data: lecturesData, isLoading: lecturesLoading } =
    useGetLecturesQuery(id);

  const { data: progressData, refetch: refetchProgress } =
    useGetCourseProgressQuery(id);

  const [updateProgress] = useUpdateLectureProgressMutation();

  const course = courseData?.course;
  const lectures = lecturesData?.lectures || [];
  const progress = progressData?.progress || [];

  const [currentLecture, setCurrentLecture] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [personalNote, setPersonalNote] = useState("");
  const [activeTab, setActiveTab] = useState("notes"); // "notes" | "personal"

  useEffect(() => {
    if (lectures.length > 0 && !currentLecture) {
      setCurrentLecture(lectures[0]);
    }
  }, [lectures, currentLecture]);

  useEffect(() => {
    const lectureProgress = progress.find(
      (p) => p.lecture === currentLecture?._id
    );
    setPersonalNote(lectureProgress?.studentNote || "");
  }, [currentLecture, progress]);

  // ── Find which section the current lecture belongs to ──────────────────────
  const currentSection = course?.sections?.find((sec) =>
    sec.lectures?.some((l) => l._id === currentLecture?._id)
  );

  const isCompleted = (lectureId) =>
    progress.some((p) => p.lecture === lectureId && p.completed);

  const handleMarkAsComplete = async () => {
    if (!currentLecture) return;
    try {
      await updateProgress({
        courseId: id,
        lectureId: currentLecture._id,
        completed: !isCompleted(currentLecture._id),
      }).unwrap();
      refetchProgress();
      toast.success("Progress saved");
    } catch {
      toast.error("Failed to save progress");
    }
  };

  const handleSaveNote = async () => {
    if (!currentLecture) return;
    try {
      await updateProgress({
        courseId: id,
        lectureId: currentLecture._id,
        note: personalNote,
      }).unwrap();
      toast.success("Note saved");
      refetchProgress();
    } catch {
      toast.error("Failed to save note");
    }
  };

  if (courseLoading || lecturesLoading) {
    return (
      <div className="h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-4">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-[11px] font-medium text-white/50">
          Loading workspace...
        </span>
      </div>
    );
  }

  const completedCount = progress.filter((p) => p.completed).length;
  const progressPercent =
    lectures.length > 0
      ? Math.round((completedCount / lectures.length) * 100)
      : 0;

  const watermark = user?.email || user?.name || "LearnHub Student";

  return (
    <div className="h-screen bg-[#0A0A0A] flex flex-col overflow-hidden text-white relative">
      <div className="absolute inset-0 subtle-noise" />

      {/* TOPBAR */}
      <nav className="h-14 border-b border-white/[0.05] bg-[#0A0A0A]/80 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between relative z-50 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/my-courses")}
            className="w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          <span className="text-[11px] md:text-xs font-medium truncate max-w-[140px] sm:max-w-[220px] md:max-w-[400px] text-white/80">
            {course?.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <span className="text-[10px] font-medium text-white/50">
              {progressPercent}% Completed
            </span>
            <div className="w-24 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/5 transition-colors lg:hidden"
          >
            {sidebarOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* MAIN */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {currentLecture ? (
            <div className="max-w-[980px] mx-auto p-3 sm:p-5 md:p-8 space-y-6 sm:space-y-8 relative">
              {currentLecture.isLocked && (
                <div className="absolute inset-0 z-[60] bg-[#0A0A0A]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-white/5 mx-3 sm:mx-5 md:mx-8 my-3 sm:my-5 md:my-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    Lecture Updating
                  </h2>
                  <p className="text-sm text-white/50 max-w-[280px] leading-relaxed">
                    This content is currently being refined by the instructor. Please check back shortly.
                  </p>
                  <div className="mt-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-white/40">
                      Coming Soon
                    </span>
                  </div>
                </div>
              )}

              {/* VIDEO */}
              <div className="space-y-4">
                <div className="aspect-video rounded-xl bg-[#0F0F0F] border border-white/10 overflow-hidden relative shadow-2xl">
                  {extractYouTubeId(currentLecture.videoUrl) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(
                        currentLecture.videoUrl
                      )}?rel=0&modestbranding=1`}
                      className="w-full h-full"
                      allowFullScreen
                      title={currentLecture.title}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/20">
                      <Play className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-[11px] font-medium">
                        Video not available
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold tracking-tight leading-tight">
                      {currentLecture.title}
                    </h2>
                    {currentSection && (
                      <p className="text-[11px] text-white/40 mt-1 font-medium">
                        {currentSection.title}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleMarkAsComplete}
                    className={cn(
                      "h-8 sm:h-9 px-3 sm:px-4 rounded-md text-[11px] sm:text-xs font-medium transition-colors flex items-center gap-2",
                      isCompleted(currentLecture._id)
                        ? "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20"
                        : "bg-white text-black hover:bg-white/90"
                    )}
                  >
                    {isCompleted(currentLecture._id) && (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    {isCompleted(currentLecture._id) ? "Completed" : "Mark complete"}
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 lg:gap-8 pb-12">
                {/* LEFT — lecture description + unit notes */}
                <div className="space-y-6">
                  {currentLecture.description && (
                    <div className="prose prose-invert prose-p:text-white/60 text-[13px] sm:text-sm leading-relaxed max-w-none">
                      <p>{currentLecture.description}</p>
                    </div>
                  )}

                  {/* UNIT NOTES (section-level, protected) */}
                  {currentSection?.notes && (
                    <div className="space-y-3">
                      <div className="h-px bg-white/10" />

                      {/* Tab bar */}
                      <div className="flex items-center gap-1 p-1 bg-[#111] rounded-lg w-fit border border-white/5">
                        <button
                          onClick={() => setActiveTab("notes")}
                          className={cn(
                            "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors",
                            activeTab === "notes"
                              ? "bg-white/10 text-white"
                              : "text-white/40 hover:text-white/60"
                          )}
                        >
                          <FileText className="w-3 h-3 inline mr-1.5" />
                          Unit Notes
                        </button>
                        {currentSection?.pyqUrl && (
                          <button
                            onClick={() => setActiveTab("pyq")}
                            className={cn(
                              "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors",
                              activeTab === "pyq"
                                ? "bg-white/10 text-white"
                                : "text-white/40 hover:text-white/60"
                            )}
                          >
                            <BookOpen className="w-3 h-3 inline mr-1.5" />
                            PYQ Paper
                          </button>
                        )}
                        <button
                          onClick={() => setActiveTab("personal")}
                          className={cn(
                            "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors",
                            activeTab === "personal"
                              ? "bg-white/10 text-white"
                              : "text-white/40 hover:text-white/60"
                          )}
                        >
                          <PenTool className="w-3 h-3 inline mr-1.5" />
                          My Notes
                        </button>
                      </div>

                      {activeTab === "notes" && (
                        <ProtectedContent watermarkText={watermark}>
                          {/* Protected notice */}
                          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 w-fit">
                            <Shield className="w-3 h-3 text-white/30" />
                            <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">
                              View only · Download disabled
                            </span>
                          </div>

                          <div
                            className="prose prose-invert prose-headings:text-white prose-p:text-white/60 max-w-none text-[13px] sm:text-sm bg-[#0F0F0F] border border-white/5 p-4 sm:p-6 rounded-xl"
                            style={{ pointerEvents: "none" }}
                          >
                            <ReactMarkdown>
                              {currentSection.notes}
                            </ReactMarkdown>
                          </div>
                        </ProtectedContent>
                      )}

                      {activeTab === "pyq" && currentSection?.pyqUrl && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 w-fit">
                            <Shield className="w-3 h-3 text-white/30" />
                            <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">
                              View only · Download disabled
                            </span>
                          </div>
                          <div
                            className="w-full rounded-xl overflow-hidden border border-white/5 bg-[#0F0F0F]"
                            style={{ height: "80vh" }}
                            onContextMenu={(e) => e.preventDefault()}
                          >
                            <iframe
                              src={currentSection.pyqUrl}
                              className="w-full h-full"
                              title="Previous Year Question Paper"
                              allow="autoplay"
                              sandbox="allow-scripts allow-same-origin"
                            />
                          </div>
                        </div>
                      )}

                      {activeTab === "personal" && (
                        <div className="bg-[#0F0F0F] border border-white/10 rounded-xl p-4 sm:p-5 space-y-4">
                          <textarea
                            value={personalNote}
                            onChange={(e) => setPersonalNote(e.target.value)}
                            placeholder="Jot down important points..."
                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-md p-3 text-[11px] sm:text-xs text-white/80 placeholder:text-white/30 h-40 resize-none focus:outline-none focus:border-white/30 transition-colors"
                          />
                          <button
                            onClick={handleSaveNote}
                            className="w-full h-8 bg-[#2A2A2A] hover:bg-[#333333] border border-white/5 text-white text-[11px] sm:text-xs font-medium rounded-md transition-colors"
                          >
                            Save notes
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fallback personal notes when no unit notes */}
                  {!currentSection?.notes && (
                    <div className="space-y-4">
                      <div className="h-px bg-white/10" />
                      <div className="bg-[#0F0F0F] border border-white/10 rounded-xl p-4 sm:p-5 space-y-4">
                        <div className="flex items-center gap-2 text-white/80">
                          <PenTool className="w-4 h-4" />
                          <span className="text-xs sm:text-sm font-medium">Personal Notes</span>
                        </div>
                        <textarea
                          value={personalNote}
                          onChange={(e) => setPersonalNote(e.target.value)}
                          placeholder="Jot down important points..."
                          className="w-full bg-[#1A1A1A] border border-white/10 rounded-md p-3 text-[11px] sm:text-xs text-white/80 placeholder:text-white/30 h-36 sm:h-40 resize-none focus:outline-none focus:border-white/30 transition-colors"
                        />
                        <button
                          onClick={handleSaveNote}
                          className="w-full h-8 bg-[#2A2A2A] hover:bg-[#333333] border border-white/5 text-white text-[11px] sm:text-xs font-medium rounded-md transition-colors"
                        >
                          Save notes
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT — lecture info + previous year papers (view only) */}
                <div className="space-y-6">
                  {/* Previous Year Question Papers */}
                  <div className="bg-[#0F0F0F] border border-white/10 rounded-xl p-4 sm:p-5 space-y-3">
                    <span className="text-xs sm:text-sm font-medium text-white/80">
                      Previous Year Question Papers
                    </span>

                    {currentSection?.pyqUrl ? (
                      <>
                        <p className="text-[10px] text-white/40 leading-relaxed">
                          PYQ paper available for this unit. Click below to view.
                        </p>
                        <button
                          onClick={() => {
                            setActiveTab("pyq");
                            // scroll to top of main
                            document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-colors group"
                        >
                          <span className="text-[11px] sm:text-xs font-medium text-white/70">
                            {currentSection.title} — PYQ Paper
                          </span>
                          <BookOpen className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors flex-shrink-0" />
                        </button>
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 w-fit">
                          <Shield className="w-3 h-3 text-white/20" />
                          <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">
                            View only · No download
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                          <span className="text-[11px] sm:text-xs font-medium text-white/30 truncate">
                            Not uploaded yet for this unit
                          </span>
                          <FileText className="w-4 h-4 text-white/10 flex-shrink-0" />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Unit info card */}
                  {currentSection && (
                    <div className="bg-[#0F0F0F] border border-white/10 rounded-xl p-4 sm:p-5 space-y-3">
                      <span className="text-xs font-medium text-white/80">
                        About This Unit
                      </span>
                      <p className="text-[11px] text-white/40 leading-relaxed">
                        {currentSection.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/30">
                          {currentSection.lectures?.length || 0} lectures in this unit
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-4">
              <BookOpen className="w-10 h-10 opacity-50" />
              <span className="text-sm font-medium">
                Select a module to begin
              </span>
            </div>
          )}
        </main>

        {/* SIDEBAR */}
        <aside
          className={cn(
            "fixed lg:relative top-14 lg:top-0 right-0 bottom-0 z-40 bg-[#0F0F0F] border-l border-white/[0.05] transition-transform duration-300 overflow-hidden flex flex-col w-[280px] sm:w-[320px]",
            sidebarOpen
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"
          )}
        >
          <div className="p-4 border-b border-white/[0.05] flex items-center justify-between">
            <span className="text-[11px] font-medium text-white/70">
              Course Modules
            </span>
            <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded">
              {completedCount}/{lectures.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {course?.sections?.map((section, sIdx) => (
              <div key={section._id} className="mb-4">
                <div className="px-3 py-2 text-[9px] sm:text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                  Unit {sIdx + 1}: {section.title}
                </div>

                <div className="space-y-0.5">
                  {section.lectures?.map((lecture, lIdx) => {
                    const active = currentLecture?._id === lecture._id;
                    const completed = isCompleted(lecture._id);
                    const isOneShot = lIdx === 4; // 5th lecture is one-shot

                    return (
                      <button
                        key={lecture._id}
                        onClick={() => {
                          if (lecture.isLocked) return;
                          setCurrentLecture(lecture);
                          setActiveTab("notes");
                          if (window.innerWidth < 1024) {
                            setSidebarOpen(false);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-left",
                          active
                            ? "bg-[#222222] text-white"
                            : "hover:bg-[#1A1A1A] text-white/60",
                          lecture.isLocked && "opacity-40 cursor-not-allowed"
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full flex flex-shrink-0 items-center justify-center border",
                            lecture.isLocked
                              ? "border-white/10 bg-white/5"
                              : completed
                              ? "bg-green-500/20 border-green-500/50 text-green-500"
                              : active
                              ? "border-primary text-primary"
                              : "border-white/20 text-transparent"
                          )}
                        >
                          {lecture.isLocked ? (
                            <Lock className="w-2.5 h-2.5" />
                          ) : completed ? (
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          ) : null}
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] sm:text-xs font-medium line-clamp-2 leading-snug block">
                            {lIdx + 1}. {lecture.title}
                          </span>
                          {isOneShot && (
                            <span className="text-[8px] font-bold text-primary/70 uppercase tracking-widest">
                              ★ One Shot
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}