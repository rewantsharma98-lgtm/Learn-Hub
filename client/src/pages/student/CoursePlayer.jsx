import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetCourseByIdQuery,
  useGetLecturesQuery,
  useUpdateLectureProgressMutation,
  useGetCourseProgressQuery,
} from "@/features/api/courseApi";

import { PlayCircle, CheckCircle, ChevronDown, FileText, BookOpen } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

// ─────────────────────────────────────────────
// SAFE YOUTUBE EMBED HELPER
// ─────────────────────────────────────────────
function extractYouTubeId(url = "") {
  if (!url) return null;
  // Handle iframe src matches first
  const iframeMatch = url.match(/src=["'](.*?)["']/);
  const targetUrl = iframeMatch ? iframeMatch[1] : url;

  const match = targetUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

const getSafeEmbedUrl = (videoUrl = "", embedUrl = "") => {
  const id = extractYouTubeId(videoUrl) || extractYouTubeId(embedUrl);
  return id ? `https://www.youtube.com/embed/${id}` : null;
};

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: courseData, isLoading: courseLoading } =
    useGetCourseByIdQuery(id, { refetchOnMountOrArgChange: true });

  const { data: lecturesData, isLoading: lecturesLoading } =
    useGetLecturesQuery(id, { refetchOnMountOrArgChange: true });

  const { data: progressData, refetch: refetchProgress } =
    useGetCourseProgressQuery(id, { refetchOnMountOrArgChange: true });

  const [updateProgress, { isLoading: isUpdating }] =
    useUpdateLectureProgressMutation();

  const course = courseData?.course;
  const lectures = lecturesData?.lectures || [];
  const progress = progressData?.progress || [];

  const [currentLecture, setCurrentLecture] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const currentProgress = progress.find(p => p.lecture === currentLecture?._id);
  const initialNote = currentProgress?.studentNote || "";
  const [personalNote, setPersonalNote] = useState("");

  useEffect(() => {
    setPersonalNote(initialNote);
  }, [currentLecture, initialNote]);

  // Auto-expand section containing current lecture
  useEffect(() => {
    if (currentLecture && course?.sections) {
      const parentSection = course.sections.find(s => 
        s.lectures?.some(l => l._id === currentLecture._id)
      );
      if (parentSection && !expandedSections[parentSection._id]) {
        setExpandedSections(prev => ({ ...prev, [parentSection._id]: true }));
      }
    }
  }, [currentLecture, course?.sections]);

  useEffect(() => {
    if (lectures.length > 0 && !currentLecture) {
      if (progress.length > 0) {
        const sortedProgress = [...progress].sort(
          (a, b) => new Date(b.lastWatched) - new Date(a.lastWatched)
        );
        const lastLectureId = sortedProgress[0].lecture;
        const lastLecture = lectures.find((l) => l._id === lastLectureId);
        if (lastLecture) {
          setCurrentLecture(lastLecture);
          return;
        }
      }
      setCurrentLecture(lectures[0]);
    }
  }, [lectures, progress, currentLecture]);

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
      toast.success(isCompleted(currentLecture._id) ? "Marked as incomplete" : "Lesson completed!");
    } catch {
      toast.error("Failed to update progress");
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
      toast.success("Personal note saved!");
      refetchProgress();
    } catch {
      toast.error("Failed to save note");
    }
  };

  if (courseLoading || lecturesLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const completedCount = progress.filter((p) => p.completed).length;
  const progressPercent = lectures.length > 0 ? Math.round((completedCount / lectures.length) * 100) : 0;

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans relative">
      
      {/* TOP NAV BRANDING */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a] shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
             <PlayCircle size={20} />
          </div>
          <span className="text-sm font-black uppercase tracking-widest text-white/90">MarshallLMS</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 text-muted-foreground hover:text-white"
          >
            <BookOpen size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40">
             <PlayCircle size={16} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-40 w-[300px] sm:w-[380px] bg-[#0d0d0d] border-r border-white/5 flex flex-col shrink-0 transition-transform duration-300
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="p-8 border-b border-white/5 bg-[#111]">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                <PlayCircle size={28} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-black uppercase tracking-tight leading-tight text-white/90 truncate">{course?.title}</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Development</p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Progress</span>
                <span className="text-white/40">{completedCount}/{lectures.length} lessons</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all duration-1000 shadow-[0_0_10px_rgba(249,115,22,0.5)]" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{progressPercent}% complete</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {(course?.sections || []).map((section, sIdx) => (
              <div key={section._id || sIdx} className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <button
                  onClick={() => toggleSection(section._id)}
                  className={`w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors ${expandedSections[section._id] ? "border-b border-white/5" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <ChevronDown 
                      size={16} 
                      className={`text-muted-foreground transition-transform duration-300 ${expandedSections[section._id] ? "" : "-rotate-90"}`} 
                    />
                    <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-tight text-white/90">
                        {sIdx + 1}: {section.title}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">
                        {section.lectures?.length || 0} lessons
                      </p>
                    </div>
                  </div>
                </button>

                {expandedSections[section._id] && (
                  <div className="p-2 space-y-1">
                    {(section.lectures || []).map((lesson, lIdx) => {
                      const active = currentLecture?._id === lesson._id;
                      const completed = isCompleted(lesson._id);

                      return (
                        <button
                          key={lesson._id || lIdx}
                          onClick={() => setCurrentLecture(lesson)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                            active ? "bg-orange-500/10 border border-orange-500/20" : "hover:bg-white/5"
                          }`}
                        >
                          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            active ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : 
                            completed ? "bg-green-500 text-white" : "text-white/20"
                          }`}>
                            {completed ? <CheckCircle size={14} /> : <PlayCircle size={14} />}
                          </div>
                          
                          <div className="text-left min-w-0">
                            <p className={`text-xs font-bold leading-tight truncate ${active ? "text-orange-500" : "text-white/70"}`}>
                              {lIdx + 1}. {lesson.title}
                            </p>
                            <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${
                              active ? "text-orange-500/60" : completed ? "text-green-500/60" : "text-muted-foreground"
                            }`}>
                              {active ? "Currently watching" : completed ? "Completed" : "Lecture"}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar">
          {currentLecture ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 sm:px-8 py-4 sm:py-8">
              {/* VIDEO PLAYER */}
              <div>
                <div className="aspect-video bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-white/5 group">
                  {getSafeEmbedUrl(currentLecture.videoUrl, currentLecture.videoEmbedUrl) ? (
                    <iframe
                      src={getSafeEmbedUrl(currentLecture.videoUrl, currentLecture.videoEmbedUrl)}
                      className="w-full h-full"
                      allowFullScreen
                      title={currentLecture.title}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/20 bg-[#111]">
                      <PlayCircle size={80} strokeWidth={1} className="mb-4 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Cinematic Experience</p>
                    </div>
                  )}
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className="py-8 md:py-12 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 mb-12 border-b border-white/5 pb-12">
                  <div className="min-w-0">
                    <button
                      onClick={handleMarkAsComplete}
                      disabled={isUpdating}
                      className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mb-8 ${
                        isCompleted(currentLecture._id) 
                        ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                        : "bg-white/5 text-white/50 border border-white/10 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {isCompleted(currentLecture._id) ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current/20 border-t-current animate-spin hidden group-disabled:block" />}
                      {isCompleted(currentLecture._id) ? "Mark as Complete" : "Mark as Complete"}
                    </button>

                    <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
                      {currentLecture.title}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                       <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                       <p>{currentLecture.description || "No description provided for this lesson."}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                  <div className="lg:col-span-2 space-y-16">
                    
                    {/* 📄 RESOURCES */}
                    {currentLecture.resources?.length > 0 && (
                      <div className="space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <PlayCircle size={20} />
                          </div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-white/90">Lecture Materials</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {currentLecture.resources.map((res, i) => (
                            <a
                              key={i}
                              href={res.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-5 p-6 bg-[#111] border border-white/5 rounded-2xl hover:border-orange-500/50 hover:shadow-[0_0_30px_-12px_rgba(249,115,22,0.1)] transition-all group"
                            >
                              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-orange-500 transition-colors">
                                <FileText size={24} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white/90 truncate">{res.title}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-1">Download PDF</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 📝 OVERVIEW */}
                    {currentLecture.notes && (
                      <div className="space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <PlayCircle size={20} />
                          </div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-white/90">Detailed Overview</h3>
                        </div>
                        <div className="prose prose-invert max-w-none text-white/50 leading-loose text-sm bg-[#111] p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-white/5 shadow-2xl">
                          <ReactMarkdown>{currentLecture.notes}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ✍️ PRIVATE NOTES */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <PlayCircle size={20} />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-white/90">My Private Notes</h3>
                    </div>
                    
                    <div className="bg-[#111] border border-white/5 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl">
                      <textarea
                        value={personalNote}
                        onChange={(e) => setPersonalNote(e.target.value)}
                        placeholder="Save your thoughts here..."
                        rows={6}
                        className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 md:p-6 text-sm text-white/70 placeholder:text-white/10 resize-none focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                      <button
                        onClick={handleSaveNote}
                        disabled={isUpdating}
                        className="w-full mt-6 py-5 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20"
                      >
                        Sync Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/5 space-y-6">
              <PlayCircle size={150} strokeWidth={0.5} />
              <p className="text-sm font-black uppercase tracking-[0.5em]">MarshallLMS</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}