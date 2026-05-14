import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, X, Check, Loader2, Search, Filter, MoreVertical, Globe, Layers, BookOpen } from "lucide-react";
import {
  fetchAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/features/api/adminApi";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="space-y-12 max-w-[1600px]">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-12 h-[1px] bg-primary" />
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em]">Curriculum Index</span>
           </div>
           <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
              Academic <br />
              <span className="opacity-30">Catalog.</span>
           </h1>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-3 px-8 py-5 bg-white text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
        >
          <Plus size={16} /> Initialize New Node
        </button>
      </div>

      {error && (
        <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-[2rem] text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">
          {error}
        </div>
      )}

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center gap-6">
         <div className="flex-1 relative group w-full">
            <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-colors" />
            <input
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="IDENTIFY MODULE..."
               className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white focus:outline-none focus:border-primary/50 transition-all"
            />
         </div>
         <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-5 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white/40">
               <Filter size={14} /> Filter
            </button>
         </div>
      </div>

      {/* Catalog Grid/Table */}
      <div className="bento-inner !p-0 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                     <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Module Signature</th>
                     <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Classification</th>
                     <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Mastery</th>
                     <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Students</th>
                     <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20 text-right">Operations</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.03]">
                  {loading ? (
                     Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                           <td colSpan="5" className="px-10 py-8">
                              <div className="h-12 bg-white/[0.02] rounded-xl w-full" />
                           </td>
                        </tr>
                     ))
                  ) : filtered.map((course) => (
                     <tr key={course._id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-6">
                              <div className="w-20 h-12 rounded-xl overflow-hidden border border-white/5 shrink-0 bg-white/[0.02]">
                                 <img src={course.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                              </div>
                              <div className="min-w-0">
                                 <div className="text-white font-bold tracking-tight text-sm group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/admin/courses/${course._id}`)}>
                                    {course.title}
                                 </div>
                                 <div className="text-white/20 text-[9px] font-bold uppercase tracking-widest mt-1">Ref: {course._id.slice(-8)}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{course.category}</span>
                        </td>
                        <td className="px-10 py-8">
                           <span className={cn(
                              "text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-lg border",
                              course.level === "Advanced" ? "text-primary border-primary/20 bg-primary/5" : "text-white/20 border-white/5 bg-white/[0.02]"
                           )}>
                              {course.level}
                           </span>
                        </td>
                        <td className="px-10 py-8">
                           <span className="text-white/60 font-bold text-xs">{course.totalStudents || 0}</span>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button onClick={() => navigate(`/admin/courses/${course._id}`)} className="p-3 rounded-xl hover:bg-white/[0.05] text-white/20 hover:text-white transition-all">
                                 <Pencil size={14} />
                              </button>
                              <button onClick={() => setDeleting(course)} className="p-3 rounded-xl hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all">
                                 <Trash2 size={14} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
         {(showAdd || editing) && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-3xl">
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="w-full max-w-[600px] bg-background border border-white/[0.05] rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]"
               >
                  <div className="p-10 border-b border-white/[0.05] flex items-center justify-between">
                     <h3 className="text-white text-lg font-bold tracking-tight">
                        {editing ? "Refine Module" : "Initialize Module"}
                     </h3>
                     <button onClick={() => { setShowAdd(false); setEditing(null); }} className="text-white/20 hover:text-white transition-colors">
                        <X size={20} />
                     </button>
                  </div>
                  <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                     <CourseForm form={editing || EMPTY_FORM} setForm={editing ? setEditing : setShowAdd} />
                  </div>
                  <div className="p-10 border-t border-white/[0.05] flex justify-end gap-6 bg-white/[0.01]">
                     <button onClick={() => { setShowAdd(false); setEditing(null); }} className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors">
                        Cancel
                     </button>
                     <button 
                        onClick={() => editing ? handleUpdate(editing) : handleCreate(showAdd)}
                        disabled={saving}
                        className="px-10 py-4 bg-white text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30"
                     >
                        {saving ? "Processing..." : editing ? "Sync Changes" : "Create Node"}
                     </button>
                  </div>
               </motion.div>
            </div>
         )}

         {deleting && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-3xl">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-[400px] bg-background border border-red-500/10 rounded-[3rem] p-10 text-center space-y-8"
               >
                  <div className="w-16 h-16 rounded-[2rem] bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500 mx-auto">
                     <Trash2 size={28} />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-white text-xl font-bold tracking-tight">Terminate Node?</h3>
                     <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        This action is irreversible. All linked metadata and lecture nodes will be purged from the system.
                     </p>
                  </div>
                  <div className="flex gap-4">
                     <button onClick={() => setDeleting(null)} className="flex-1 py-4 text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors">
                        Cancel
                     </button>
                     <button onClick={handleDelete} disabled={saving} className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-30">
                        {saving ? "Purging..." : "Confirm Purge"}
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}

function CourseForm({ form, setForm }) {
  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div className="space-y-8">
       <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1">Module Title</label>
          <input
             value={form.title}
             onChange={(e) => set("title", e.target.value)}
             className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
             placeholder="Quantum Physics Foundations..."
          />
       </div>

       <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1">Level</label>
             <select
                value={form.level}
                onChange={(e) => set("level", e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
             >
                {LEVELS.map(l => <option key={l} className="bg-background">{l}</option>)}
             </select>
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1">Category</label>
             <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
             >
                {CATEGORIES.map(c => <option key={c} className="bg-background">{c}</option>)}
             </select>
          </div>
       </div>

       <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1">Thumbnail Identity (URL)</label>
          <input
             value={form.thumbnail}
             onChange={(e) => set("thumbnail", e.target.value)}
             className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
             placeholder="https://visuals.com/..."
          />
       </div>

       <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1">Brief (Subtitle)</label>
          <textarea
             value={form.subtitle}
             onChange={(e) => set("subtitle", e.target.value)}
             className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all resize-none"
             rows={2}
             placeholder="Short system summary..."
          />
       </div>
    </div>
  );
}