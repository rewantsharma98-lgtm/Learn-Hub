import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronDown, ChevronRight, Plus, Trash2, Pencil,
  GripVertical, PlayCircle, FileText, Check, X, Loader2, ArrowLeft, Lock,
} from "lucide-react";
import {
  fetchCourseStructure,
  updateCourse,
  addSection, updateSection, deleteSection,
  addLecture, updateLecture, deleteLecture,
  uploadLectureResource
} from "@/features/api/adminApi";

// ── YouTube helpers ───────────────────────────────────────────────────────────
function extractYouTubeId(url = "") {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// ── YouTube Player ────────────────────────────────────────────────────────────
function YouTubePlayer({ url }) {
  const id = extractYouTubeId(url);
  if (!id) return (
    <div className="aspect-video bg-[#111] rounded-xl flex items-center justify-center border border-border">
      <div className="text-center opacity-30">
        <PlayCircle size={40} className="mx-auto mb-2" />
        <p className="text-[10px] font-black uppercase tracking-widest">No video URL set</p>
      </div>
    </div>
  );
  return (
    <div className="aspect-video rounded-xl overflow-hidden border border-border shadow-2xl">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        title="Lecture video"
      />
    </div>
  );
}

// ── YouTube Skeleton ──────────────────────────────────────────────────────────
function YouTubeSkeleton() {
  return (
    <div className="aspect-video bg-[#1a1a1a] rounded-xl overflow-hidden border border-border animate-pulse">
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
          <PlayCircle size={28} className="text-white/10" />
        </div>
        <div className="space-y-2 w-40">
          <div className="h-2 bg-white/5 rounded-full w-full" />
          <div className="h-2 bg-white/5 rounded-full w-2/3 mx-auto" />
        </div>
      </div>
    </div>
  );
}

// ── Inline editable field ─────────────────────────────────────────────────────
function InlineEdit({ value, onSave, className = "" }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  if (!editing) return (
    <span className={`cursor-pointer hover:text-primary transition-colors ${className}`} onClick={() => setEditing(true)}>
      {value}
    </span>
  );

  return (
    <span className="flex items-center gap-2">
      <input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { onSave(val); setEditing(false); } if (e.key === "Escape") setEditing(false); }}
        className="bg-[#111] border border-primary/50 rounded px-2 py-0.5 text-white text-xs font-medium outline-none"
      />
      <button onClick={() => { onSave(val); setEditing(false); }} className="text-green-400 hover:text-green-300"><Check size={12} /></button>
      <button onClick={() => setEditing(false)} className="text-muted-foreground hover:text-white"><X size={12} /></button>
    </span>
  );
}

// ── Lecture Panel ─────────────────────────────────────────────────────────────
function LecturePanel({ lecture, sectionId, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: lecture.title,
    description: lecture.description || "",
    videoUrl: lecture.videoUrl || "",
    notes: lecture.notes || "",
    duration: lecture.duration || "",
    isPreviewFree: lecture.isPreviewFree || false,
    isLocked: lecture.isLocked || false,
  });
  const [saving, setSaving] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await updateLecture(lecture._id, form);
      if (res.data.success) onUpdate(res.data.lecture);
    } finally { setSaving(false); }
  };

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-[#111]">
      {/* Row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical size={14} className="text-muted-foreground/30 shrink-0" />
        <FileText size={14} className="text-muted-foreground shrink-0" />
        <span className="text-white text-xs font-bold flex-1 truncate">{lecture.title}</span>
        {lecture.isPreviewFree && (
          <span className="text-[9px] font-black px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full uppercase tracking-widest">Free</span>
        )}
        {lecture.isLocked && (
          <span className="text-[9px] font-black px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full uppercase tracking-widest flex items-center gap-1"><Lock size={10} /> Locked</span>
        )}
        <button onClick={() => setOpen((o) => !o)} className="text-muted-foreground hover:text-white transition-colors p-1">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <button onClick={() => onDelete(lecture._id)} className="text-muted-foreground hover:text-red-500 transition-colors p-1">
          <Trash2 size={12} />
        </button>
      </div>

      {/* Expanded editor */}
      {open && (
        <div className="border-t border-border/50 p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Lecture Title</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full bg-[#1a1a1a] border border-border rounded-xl px-4 py-2.5 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">YouTube Video URL</label>
            <input
              value={form.videoUrl}
              onChange={(e) => { set("videoUrl", e.target.value); setVideoLoading(true); }}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-[#1a1a1a] border border-border rounded-xl px-4 py-2.5 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* Video Preview */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Video Preview</label>
            {form.videoUrl && extractYouTubeId(form.videoUrl) ? (
              <div className="relative">
                {videoLoading && (
                  <div className="absolute inset-0 z-10">
                    <YouTubeSkeleton />
                  </div>
                )}
                <YouTubePlayer url={form.videoUrl} />
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(form.videoUrl)}`}
                  onLoad={() => setVideoLoading(false)}
                  className="hidden"
                  title="preload"
                />
              </div>
            ) : (
              <YouTubeSkeleton />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className="w-full bg-[#1a1a1a] border border-border rounded-xl px-4 py-2.5 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">
              Lecture Notes (Markdown supported)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={5}
              placeholder="# Notes&#10;&#10;Write your lecture notes here..."
              className="w-full bg-[#1a1a1a] border border-border rounded-xl px-4 py-2.5 text-white text-xs font-mono outline-none focus:border-primary/50 transition-all resize-y"
            />
          </div>

          {/* Duration + Free Preview */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Duration (min)</label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
                className="w-full bg-[#1a1a1a] border border-border rounded-xl px-4 py-2.5 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <div className="flex items-end pb-1 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => set("isPreviewFree", !form.isPreviewFree)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.isPreviewFree ? "bg-primary" : "bg-muted"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isPreviewFree ? "left-5" : "left-0.5"}`} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Free Preview</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => set("isLocked", !form.isLocked)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.isLocked ? "bg-red-500" : "bg-muted"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isLocked ? "left-5" : "left-0.5"}`} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Locked</span>
              </label>
            </div>
          </div>

          {/* Resources / PDF Upload */}
          <div className="border-t border-border/30 pt-4">
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-3">Lecture Resources (PDFs)</label>
            <div className="space-y-3">
              {(lecture.resources || []).map((res, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-border">
                  <FileText size={14} className="text-primary" />
                  <span className="text-[10px] font-bold text-white/80 flex-1 truncate">{res.title}</span>
                  <a href={res.fileUrl} target="_blank" rel="noreferrer" className="text-[9px] font-black uppercase text-primary hover:underline">View</a>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id={`file-upload-${lecture._id}`}
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setSaving(true);
                    const formData = new FormData();
                    formData.append("file", file);
                    try {
                      const res = await uploadLectureResource(lecture._id, formData);
                      if (res.data.success) {
                        onUpdate(res.data.lecture);
                      }
                    } finally { setSaving(false); }
                  }}
                />
                <button
                  onClick={() => document.getElementById(`file-upload-${lecture._id}`).click()}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border border-dashed border-border"
                >
                  <Plus size={12} /> Add PDF Resource
                </button>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end border-t border-border/30 pt-4">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              Save Lecture Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Section Block ─────────────────────────────────────────────────────────────
function SectionBlock({ section, courseId, onSectionUpdate, onSectionDelete }) {
  const [open, setOpen] = useState(true);
  const [lectures, setLectures] = useState(section.lectures || []);
  const [addingLecture, setAddingLecture] = useState(false);
  const [newLectureTitle, setNewLectureTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [unitNotes, setUnitNotes] = useState(section.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [pyqUrl, setPyqUrl] = useState(section.pyqUrl || "");
  const [savingPyq, setSavingPyq] = useState(false);

  const handleSaveUnitNotes = async () => {
    setSavingNotes(true);
    try {
      await updateSection(section._id, { notes: unitNotes });
      onSectionUpdate({ ...section, notes: unitNotes });
    } finally { setSavingNotes(false); }
  };

  const handleSavePyq = async () => {
    setSavingPyq(true);
    try {
      await updateSection(section._id, { pyqUrl });
      onSectionUpdate({ ...section, pyqUrl });
    } finally { setSavingPyq(false); }
  };

  const handleAddLecture = async () => {
    if (!newLectureTitle.trim()) return;
    setSaving(true);
    try {
      const res = await addLecture(section._id, { title: newLectureTitle });
      if (res.data.success) {
        setLectures((prev) => [...prev, res.data.lecture]);
        setNewLectureTitle("");
        setAddingLecture(false);
      }
    } finally { setSaving(false); }
  };

  const handleDeleteLecture = async (lectureId) => {
    await deleteLecture(lectureId);
    setLectures((prev) => prev.filter((l) => l._id !== lectureId));
  };

  const handleUpdateLecture = (updated) => {
    setLectures((prev) => prev.map((l) => l._id === updated._id ? updated : l));
  };

  return (
    <div className="bg-[#1a1a1a] border border-border/50 rounded-2xl overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/30">
        <GripVertical size={16} className="text-muted-foreground/30 shrink-0" />
        <button onClick={() => setOpen((o) => !o)} className="text-muted-foreground hover:text-white transition-colors">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        <span className="text-white text-sm font-black flex-1">
          <InlineEdit
            value={section.title}
            onSave={(val) => { updateSection(section._id, { title: val }); onSectionUpdate({ ...section, title: val }); }}
          />
        </span>
        <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
          {lectures.length} Lecture{lectures.length !== 1 ? "s" : ""}
        </span>
        <button
          onClick={() => onSectionDelete(section._id)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Lectures */}
      {open && (
        <div className="p-4 space-y-2">
          {lectures.map((lecture) => (
            <LecturePanel
              key={lecture._id}
              lecture={lecture}
              sectionId={section._id}
              onUpdate={handleUpdateLecture}
              onDelete={handleDeleteLecture}
            />
          ))}

          {/* Add Lecture */}
          {addingLecture ? (
            <div className="flex items-center gap-2 p-3 bg-[#111] border border-primary/30 rounded-xl">
              <FileText size={14} className="text-muted-foreground shrink-0" />
              <input
                autoFocus
                value={newLectureTitle}
                onChange={(e) => setNewLectureTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddLecture(); if (e.key === "Escape") setAddingLecture(false); }}
                placeholder="Lecture title..."
                className="flex-1 bg-transparent text-white text-xs font-medium outline-none placeholder:text-muted-foreground/40"
              />
              <button onClick={handleAddLecture} disabled={saving} className="text-green-400 hover:text-green-300 p-1 disabled:opacity-50">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              </button>
              <button onClick={() => setAddingLecture(false)} className="text-muted-foreground hover:text-white p-1"><X size={12} /></button>
            </div>
          ) : (
            <button
              onClick={() => setAddingLecture(true)}
              className="w-full py-3 flex items-center justify-center gap-2 text-muted-foreground hover:text-white text-[10px] font-black uppercase tracking-widest border border-dashed border-border/30 hover:border-primary/30 rounded-xl transition-all"
            >
              <Plus size={12} /> Add Lecture
            </button>
          )}

          {/* Unit Notes PDF URL */}
          <div className="border-t border-border/30 pt-4 mt-4 space-y-3">
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                Unit Notes (PDF) — Google Drive Embed URL
              </label>
              <p className="text-[9px] text-muted-foreground/50 mb-2">
                Upload your PDF to Google Drive → Share → Copy link → change <code className="text-primary">/view</code> to <code className="text-primary">/preview</code> and paste below.
              </p>
            </div>
            <input
              value={unitNotes}
              onChange={(e) => setUnitNotes(e.target.value)}
              placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/preview"
              className="w-full bg-[#111] border border-border rounded-xl px-4 py-2.5 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all"
            />
            {unitNotes && unitNotes.includes("http") && (
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border/50 bg-[#111]">
                <iframe
                  src={unitNotes}
                  className="w-full h-full"
                  title="Notes Preview"
                  allow="autoplay; encrypted-media"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                />
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleSaveUnitNotes}
                disabled={savingNotes}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
              >
                {savingNotes ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                Save Unit Notes Link
              </button>
            </div>
          </div>

          {/* PYQ PDF URL */}
          <div className="border-t border-border/30 pt-4 mt-2 space-y-3">
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                Previous Year Question Paper (PYQ) — Google Drive Embed URL
              </label>
              <p className="text-[9px] text-muted-foreground/50 mb-2">
                Upload your PDF to Google Drive → Share → Copy link → change <code className="text-primary">/view</code> to <code className="text-primary">/preview</code> and paste below.
              </p>
              <p className="text-[9px] text-white/30 font-mono mb-2">
                Format: https://drive.google.com/file/d/FILE_ID/preview
              </p>
            </div>
            <input
              value={pyqUrl}
              onChange={(e) => setPyqUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/preview"
              className="w-full bg-[#111] border border-border rounded-xl px-4 py-2.5 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all"
            />
            {pyqUrl && (
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border/50 bg-[#111]">
                <iframe
                  src={pyqUrl}
                  className="w-full h-full"
                  title="PYQ Preview"
                  allow="autoplay; encrypted-media"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                />
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleSavePyq}
                disabled={savingPyq}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 border border-border"
              >
                {savingPyq ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                Save PYQ Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main EditCourse Page ──────────────────────────────────────────────────────
export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("structure"); // "info" | "structure"
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCourseStructure(id);
        if (res.data.success) {
          setCourse(res.data.course);
          setSections(res.data.course.sections || []);
        }
      } finally { setLoading(false); }
    })();
  }, [id]);

  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return;
    setSaving(true);
    try {
      const res = await addSection(id, { title: newSectionTitle });
      if (res.data.success) {
        setSections((prev) => [...prev, { ...res.data.section, lectures: [] }]);
        setNewSectionTitle("");
        setAddingSection(false);
      }
    } finally { setSaving(false); }
  };

  const handleDeleteSection = async (sectionId) => {
    await deleteSection(sectionId);
    setSections((prev) => prev.filter((s) => s._id !== sectionId));
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-white/5 rounded-xl w-64" />
      <div className="h-12 bg-white/5 rounded-2xl" />
      {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
    </div>
  );

  if (!course) return (
    <div className="text-center py-20 text-muted-foreground font-black uppercase tracking-widest text-xs">
      Course not found
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/admin/courses")} className="p-2 rounded-xl border border-border text-muted-foreground hover:text-white transition-all">
          <ArrowLeft size={16} />
        </button>
        <div>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Edit Course</p>
          <h1 className="text-white text-2xl font-black tracking-tight">{course.title}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {["info", "structure"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 -mb-px ${
              tab === t ? "border-primary text-white" : "border-transparent text-muted-foreground hover:text-white"
            }`}
          >
            {t === "info" ? "Basic Info" : "Course Structure"}
          </button>
        ))}
      </div>

      {tab === "info" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 max-w-2xl">
          <p className="text-muted-foreground text-xs font-medium">
            Basic course info. Click <span className="text-white font-bold">Save Changes</span> when done.
          </p>
          {/* Quick info fields - title, description, thumbnail, status */}
          {["title", "subtitle", "description", "thumbnail", "trailerVideo"].map((field) => (
            <div key={field}>
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">{field}</label>
              {field === "description" ? (
                <textarea
                  defaultValue={course[field] || ""}
                  id={`field-${field}`}
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-border rounded-xl px-4 py-2.5 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all resize-none"
                />
              ) : (
                <input
                  id={`field-${field}`}
                  defaultValue={course[field] || ""}
                  className="w-full bg-[#1a1a1a] border border-border rounded-xl px-4 py-2.5 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all"
                />
              )}
            </div>
          ))}
          {/* Status toggle */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Status</label>
            <select
              id="field-status"
              defaultValue={course.status}
              className="bg-[#1a1a1a] border border-border rounded-xl px-4 py-2.5 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all w-full"
            >
              <option>Draft</option>
              <option>Published</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Target Semester</label>
              <select
                id="field-targetSemester"
                defaultValue={course.targetSemester || "All"}
                className="bg-[#1a1a1a] border border-border rounded-xl px-4 py-2.5 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all w-full"
              >
                <option value="All">All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Target Department</label>
              <select
                id="field-targetDepartment"
                defaultValue={course.targetDepartment || "All"}
                className="bg-[#1a1a1a] border border-border rounded-xl px-4 py-2.5 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all w-full"
              >
                <option value="All">All Departments</option>
                <option value="Common">Common (1st Year)</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Civil">Civil</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
              </select>
            </div>
          </div>
          <button
            onClick={async () => {
              setSaving(true);
              const fields = ["title", "subtitle", "description", "thumbnail", "trailerVideo", "status", "targetSemester", "targetDepartment"];
              const payload = {};
              fields.forEach((f) => {
                const el = document.getElementById(`field-${f}`);
                if (el) payload[f] = el.value;
              });
              await updateCourse(id, payload);
              setSaving(false);
            }}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            Save Changes
          </button>
        </div>
      )}

      {tab === "structure" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-sm font-black uppercase tracking-widest">Course Structure</h2>
              <p className="text-muted-foreground text-[10px] font-medium mt-1">
                {sections.length} Section{sections.length !== 1 ? "s" : ""} · Click a lecture to edit its video and notes
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-3">
            {sections.map((section) => (
              <SectionBlock
                key={section._id}
                section={section}
                courseId={id}
                onSectionUpdate={(updated) => setSections((prev) => prev.map((s) => s._id === updated._id ? updated : s))}
                onSectionDelete={handleDeleteSection}
              />
            ))}
          </div>

          {/* Add Section */}
          {addingSection ? (
            <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] border border-primary/30 rounded-2xl">
              <input
                autoFocus
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddSection(); if (e.key === "Escape") setAddingSection(false); }}
                placeholder="Section title (e.g. Unit 1: Introduction)..."
                className="flex-1 bg-transparent text-white text-sm font-medium outline-none placeholder:text-muted-foreground/40"
              />
              <button onClick={handleAddSection} disabled={saving} className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              </button>
              <button onClick={() => setAddingSection(false)} className="p-2 rounded-lg text-muted-foreground hover:text-white transition-all">
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingSection(true)}
              className="w-full py-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-white text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-border/30 hover:border-primary/30 rounded-2xl transition-all"
            >
              <Plus size={14} /> New Section / Unit
            </button>
          )}
        </div>
      )}
    </div>
  );
}