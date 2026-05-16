import { useEffect, useState } from "react";
import { fetchAdminUsers, fetchAdminCourses, enrollAdminUser, deleteAdminUser, updateAdminUser } from "@/features/api/adminApi";
import { Users, Shield, Loader2, Plus, Check, X, Trash2, Key, BookOpen, Activity, ChevronRight, Search, Pencil } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollModal, setEnrollModal] = useState(null);
  const [editUserModal, setEditUserModal] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({ semester: "", department: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([fetchAdminUsers(), fetchAdminCourses()])
      .then(([uRes, cRes]) => {
        if (uRes.data.success) setUsers(uRes.data.users);
        if (cRes.data.success) setCourses(cRes.data.courses);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async () => {
    if (!selectedCourse) return toast.error("Select a course first");
    setEnrolling(true);
    try {
      const res = await enrollAdminUser({ userId: enrollModal._id, courseId: selectedCourse });
      if (res.data.success) {
        toast.success(res.data.message);
        setEnrollModal(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to enroll user");
    } finally {
      setEnrolling(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await deleteAdminUser(id);
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleUpdateUser = async () => {
    setUpdating(true);
    try {
      const res = await updateAdminUser(editUserModal._id, editForm);
      if (res.data.success) {
        toast.success("User profile updated");
        setUsers(users.map(u => u._id === editUserModal._id ? res.data.user : u));
        setEditUserModal(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 size={32} className="animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <div className="space-y-12 max-w-[1600px]">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-12 h-[1px] bg-primary" />
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em]">Identity Hub</span>
           </div>
           <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
              Team <br />
              <span className="opacity-30">Management.</span>
           </h1>
        </div>
        <div className="flex flex-col items-end gap-2">
           <span className="text-white text-3xl font-bold tracking-tighter">{users.length}</span>
           <span className="text-white/20 text-[9px] font-bold uppercase tracking-[0.3em]">Total Authenticated Identities</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="relative group max-w-2xl">
         <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-colors" />
         <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="FILTER BY IDENTITY..."
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white focus:outline-none focus:border-primary/50 transition-all"
         />
      </div>

      {/* Identity Grid */}
      <div className="bento-inner !p-0 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                     <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Identity Signature</th>
                     <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Academic Profile</th>
                     <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Curriculum Load</th>
                     <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Status</th>
                     <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20 text-right">Protocol</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.03]">
                  {filteredUsers.map((user) => (
                     <tr key={user._id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-primary font-black shadow-2xl">
                                 {user.name?.[0] || user.email?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                 <div className="text-white font-bold tracking-tight text-sm">{user.name || "Anonymous Student"}</div>
                                 <div className="text-white/20 text-[9px] font-bold uppercase tracking-widest mt-1">{user.email}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                                 <BookOpen size={12} className="opacity-50" />
                                 Sem: {user.semester || "N/A"}
                              </div>
                              <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                                 <Activity size={12} className="opacity-50" />
                                 Dept: {user.department || "N/A"}
                              </div>
                              <div className="flex items-center gap-2 text-white/30 text-[9px] font-mono mt-1">
                                 <Key size={10} className="opacity-30" />
                                 {user.plainPassword || "••••••••"}
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex flex-wrap gap-2 max-w-[200px]">
                              {user.enrolledCourses?.length > 0 ? (
                                 user.enrolledCourses.slice(0, 2).map((c, i) => (
                                    <span key={i} className="px-2 py-1 bg-white/[0.03] border border-white/5 rounded-lg text-[8px] font-bold text-white/30 uppercase tracking-widest truncate max-w-[80px]">
                                       {c}
                                    </span>
                                 ))
                              ) : (
                                 <span className="text-[9px] text-white/10 font-bold uppercase tracking-widest italic">Idle</span>
                              )}
                              {user.enrolledCourses?.length > 2 && (
                                 <span className="text-[8px] font-bold text-primary">+{user.enrolledCourses.length - 2}</span>
                              )}
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-3">
                              <div className={cn("w-1.5 h-1.5 rounded-full", user.lastLogin ? "bg-green-500 animate-pulse" : "bg-white/10")} />
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                 {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never Synced"}
                              </span>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              {user.role !== "admin" && (
                                 <>
                                     <button onClick={() => { setEditUserModal(user); setEditForm({ semester: user.semester || "", department: user.department || "" }); }} className="p-3 rounded-xl hover:bg-white/[0.05] text-white/20 hover:text-primary transition-all" title="Edit Profile">
                                        <Pencil size={16} />
                                     </button>
                                     <button onClick={() => setEnrollModal(user)} className="p-3 rounded-xl hover:bg-white/[0.05] text-white/20 hover:text-primary transition-all" title="Initialize Enrollment">
                                        <Plus size={16} />
                                     </button>
                                     <button onClick={() => handleDeleteUser(user._id)} className="p-3 rounded-xl hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all" title="Purge Identity">
                                        <Trash2 size={16} />
                                     </button>
                                 </>
                              )}
                              {user.role === "admin" && (
                                 <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-black uppercase tracking-[0.2em] rounded-lg">Master Admin</span>
                              )}
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Enrollment Modal */}
      <AnimatePresence>
         {enrollModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-3xl">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-[500px] bg-background border border-white/[0.05] rounded-[3rem] overflow-hidden shadow-2xl"
               >
                  <div className="p-10 border-b border-white/[0.05] flex items-center justify-between">
                     <div className="space-y-1">
                        <h3 className="text-white text-xl font-bold tracking-tight">Manual Authorization</h3>
                        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Granting access to {enrollModal.name}</p>
                     </div>
                     <button onClick={() => setEnrollModal(null)} className="text-white/20 hover:text-white transition-colors">
                        <X size={20} />
                     </button>
                  </div>
                  
                  <div className="p-10 space-y-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1">Select Curriculum Node</label>
                        <select
                           value={selectedCourse}
                           onChange={(e) => setSelectedCourse(e.target.value)}
                           className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                        >
                           <option value="" className="bg-background">-- IDENTITY NOT SELECTED --</option>
                           {courses.map(c => (
                              <option key={c._id} value={c._id} className="bg-background">{c.title}</option>
                           ))}
                        </select>
                     </div>

                     <button 
                        onClick={handleEnroll}
                        disabled={enrolling || !selectedCourse}
                        className="w-full py-5 bg-white text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30"
                     >
                        {enrolling ? "Synchronizing..." : "Authorize Access"}
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
         {editUserModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-3xl">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-[500px] bg-background border border-white/[0.05] rounded-[3rem] overflow-hidden shadow-2xl"
               >
                  <div className="p-10 border-b border-white/[0.05] flex items-center justify-between">
                     <div className="space-y-1">
                        <h3 className="text-white text-xl font-bold tracking-tight">Edit Academic Profile</h3>
                        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">{editUserModal.name}</p>
                     </div>
                     <button onClick={() => setEditUserModal(null)} className="text-white/20 hover:text-white transition-colors">
                        <X size={20} />
                     </button>
                  </div>
                  
                  <div className="p-10 space-y-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1">Semester</label>
                        <select
                           value={editForm.semester}
                           onChange={(e) => setEditForm(prev => ({ ...prev, semester: e.target.value }))}
                           className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                        >
                           <option value="" className="bg-background">-- Select Semester --</option>
                           {["1", "2", "3", "4", "5", "6"].map(sem => (
                              <option key={sem} value={sem} className="bg-background">Semester {sem}</option>
                           ))}
                        </select>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1">Department</label>
                        <select
                           value={editForm.department}
                           onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                           className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                        >
                           <option value="" className="bg-background">-- Select Department --</option>
                           <option value="Common" className="bg-background">Common (1st Year)</option>
                           {["Computer Science", "Civil", "Mechanical", "Electrical"].map(dept => (
                              <option key={dept} value={dept} className="bg-background">{dept}</option>
                           ))}
                        </select>
                     </div>

                     <button 
                        onClick={handleUpdateUser}
                        disabled={updating}
                        className="w-full py-5 bg-white text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 mt-4"
                     >
                        {updating ? "Saving..." : "Save Profile"}
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
}

