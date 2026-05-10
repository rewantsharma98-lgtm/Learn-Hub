import { useEffect, useState } from "react";
import { fetchAdminUsers, fetchAdminCourses, enrollAdminUser } from "@/features/api/adminApi";
import { Users, Shield, Loader2, Plus, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollModal, setEnrollModal] = useState(null); // stores user obj
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrolling, setEnrolling] = useState(false);

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

  if (loading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 size={32} className="animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-white text-2xl font-black tracking-tight">Team & Users</h1>
        <p className="text-muted-foreground text-xs font-medium mt-1">
          Manage {users.length} registered students across your platform.
        </p>
      </div>

      <div className="bg-[#1a1a1a] border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-black/20">
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {user.role === "admin" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-[9px] font-black uppercase tracking-widest">
                      <Shield size={10} /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-widest">
                      Student
                    </span>
                  )}
                </td>
                <td className="p-4 text-xs text-muted-foreground font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => { setEnrollModal(user); setSelectedCourse(""); }}
                      className="px-4 py-2 bg-[#111] hover:bg-primary/20 hover:text-primary text-muted-foreground border border-border rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <Plus size={12} className="inline mr-1" /> Grant Course
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground text-xs uppercase tracking-widest font-bold">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Enrollment Modal */}
      {enrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1a1a1a] border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div>
                <h2 className="text-white font-black text-lg">Grant Access</h2>
                <p className="text-xs text-muted-foreground mt-1">Enroll {enrollModal.name} in a course.</p>
              </div>
              <button onClick={() => setEnrollModal(null)} className="text-muted-foreground hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                  Select Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-white text-xs font-medium outline-none focus:border-primary/50"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleEnroll}
                  disabled={enrolling || !selectedCourse}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                >
                  {enrolling ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  Enroll Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
