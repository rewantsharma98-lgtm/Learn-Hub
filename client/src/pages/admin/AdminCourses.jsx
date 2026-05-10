import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, X, Check, Loader2 } from "lucide-react";
import {
  fetchAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/features/api/adminApi";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const CATEGORIES = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Development", "Design", "Business", "Marketing", "Data Science"];

const EMPTY_FORM = {
  title: "",
  description: "",
  subtitle: "",
  thumbnail: "",
  level: "Beginner",
  category: "Development",
  price: 0,
  isFree: true,
  language: "English",
};

function levelColor(level) {
  if (level === "Beginner") return "bg-white text-black";
  if (level === "Intermediate") return "bg-blue-500 text-white";
  return "bg-purple-500 text-white";
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />;
}

// ── Course Form Modal ─────────────────────────────────────────────────────────
function CourseFormModal({ initial, onSave, onClose, saving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-border rounded-3xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-white text-sm font-black uppercase tracking-widest">
            {initial ? "Edit Course" : "New Course"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Title *</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Course title..."
              className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all"
            />
          </div>
          {/* Subtitle */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Subtitle</label>
            <input
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="Short subtitle..."
              className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all"
            />
          </div>
          {/* Description */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Course description..."
              rows={3}
              className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all resize-none"
            />
          </div>
          {/* Thumbnail */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Thumbnail URL</label>
            <input
              value={form.thumbnail}
              onChange={(e) => set("thumbnail", e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all"
            />
          </div>
          {/* Trailer */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Trailer YouTube URL</label>
            <input
              value={form.trailerVideo || ""}
              onChange={(e) => set("trailerVideo", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all"
            />
          </div>
          {/* Level + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Level</label>
              <select
                value={form.level}
                onChange={(e) => set("level", e.target.value)}
                className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all"
              >
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          {/* Price + Free */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Price ($)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", Number(e.target.value))}
                disabled={form.isFree}
                className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-white text-xs font-medium outline-none focus:border-primary/50 transition-all disabled:opacity-30"
              />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => set("isFree", !form.isFree)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.isFree ? "bg-primary" : "bg-muted"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isFree ? "left-5" : "left-0.5"}`} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Free</span>
              </label>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-border flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.title}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            {initial ? "Save Changes" : "Create Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────
function DeleteModal({ course, onConfirm, onClose, saving }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-red-500/20 rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h2 className="text-white text-sm font-black uppercase tracking-widest mb-2">Delete Course</h2>
        <p className="text-muted-foreground text-xs font-medium mb-6">
          Are you sure you want to delete <span className="text-white font-bold">"{course.title}"</span>? This will also delete all sections and lectures.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest border border-border rounded-xl text-muted-foreground hover:text-white transition-all">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : null} Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminCourses();
      if (res.data.success) setCourses(res.data.courses);
      else setError(res.data.message);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      const res = await createCourse(form);
      if (res.data.success) {
        setCourses((prev) => [res.data.course, ...prev]);
        setShowAdd(false);
      }
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      const res = await updateCourse(editing._id, form);
      if (res.data.success) {
        setCourses((prev) => prev.map((c) => c._id === editing._id ? res.data.course : c));
        setEditing(null);
      }
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const res = await deleteCourse(deleting._id);
      if (res.data.success) {
        setCourses((prev) => prev.filter((c) => c._id !== deleting._id));
        setDeleting(null);
      }
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#111111] animate-in fade-in duration-700">
      {showAdd && (
        <CourseFormModal onSave={handleCreate} onClose={() => setShowAdd(false)} saving={saving} />
      )}
      {editing && (
        <CourseFormModal initial={editing} onSave={handleUpdate} onClose={() => setEditing(null)} saving={saving} />
      )}
      {deleting && (
        <DeleteModal course={deleting} onConfirm={handleDelete} onClose={() => setDeleting(null)} saving={saving} />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-white text-4xl font-black tracking-tight uppercase">Course Management</h1>
            <div className="w-16 h-1 bg-primary mt-4 mb-4 rounded-full" />
            <p className="text-muted-foreground text-xs font-black uppercase tracking-widest">
              {courses.length} courses in your catalog
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <Plus size={16} /> New Course
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by course title..."
            className="w-full bg-[#1a1a1a] border border-border/50 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary/50 transition-all"
          />
        </div>

        {/* Table */}
        <div className="bg-[#1a1a1a] rounded-3xl border border-border/50 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-white/[0.02]">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Course Details</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Category</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Level</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Students</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            <Skeleton className="w-20 h-14 rounded-xl" />
                            <div className="space-y-2">
                              <Skeleton className="h-3 w-40" />
                              <Skeleton className="h-2 w-24" />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6"><Skeleton className="h-3 w-20" /></td>
                        <td className="px-8 py-6"><Skeleton className="h-5 w-16 rounded-full" /></td>
                        <td className="px-8 py-6"><Skeleton className="h-5 w-16 rounded-full" /></td>
                        <td className="px-8 py-6"><Skeleton className="h-3 w-12" /></td>
                        <td className="px-8 py-6"><Skeleton className="h-8 w-20 ml-auto" /></td>
                      </tr>
                    ))
                  : filtered.map((course) => (
                      <tr key={course._id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            <div className="relative w-20 h-14 rounded-xl overflow-hidden border border-border/50 shadow-lg shrink-0">
                              <img
                                src={course.thumbnail || "https://placehold.co/600x400/1a1a1a/e05c32?text=COURSE"}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                alt=""
                              />
                            </div>
                            <div className="min-w-0">
                              <p
                                className="text-white text-xs font-black uppercase tracking-tight truncate group-hover:text-primary transition-colors cursor-pointer"
                                onClick={() => navigate(`/admin/courses/${course._id}`)}
                              >
                                {course.title}
                              </p>
                              <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-tighter mt-1">
                                ID: {course._id?.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{course.category}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded shadow-md uppercase tracking-widest ${levelColor(course.level)}`}>
                            {course.level}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${course.status === "Published" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                            {course.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-black text-white/50">{course.totalStudents ?? 0}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => navigate(`/admin/courses/${course._id}`)}
                              className="p-3 rounded-xl bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
                              title="Edit Structure"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleting(course)}
                              className="p-3 rounded-xl bg-muted/50 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-20">
                        <Plus size={48} className="rotate-45" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">No courses found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}