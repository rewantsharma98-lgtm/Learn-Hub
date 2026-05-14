import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLoggedIn } from "@/features/authSlice";
import { toast } from "sonner";
import { ArrowLeft, User as UserIcon, Lock, Bell, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [saving, setSaving] = useState(false);

  const photoUrl = user?.photoUrl || user?.photo || user?.picture || "";
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  const handleSave = async () => {
    setSaving(true);
    try {
      dispatch(userLoggedIn({ user: { ...user, name, bio } }));
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-24 px-6 lg:px-8 relative">
      <div className="absolute inset-0 subtle-noise" />

      <div className="max-w-[1000px] mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 border-b border-white/[0.05] pb-8">
           <button
             onClick={() => navigate(-1)}
             className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium transition-colors mb-6"
           >
             <ArrowLeft className="w-4 h-4" /> Back to Dashboard
           </button>
           <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">
              Settings
           </h1>
           <p className="text-sm text-white/50">
             Manage your account settings and preferences.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
           
           {/* Sidebar Navigation */}
           <div className="lg:col-span-3 space-y-1">
              <NavTab icon={<UserIcon className="w-4 h-4" />} label="General" active />
              <NavTab icon={<Lock className="w-4 h-4" />} label="Security" />
              <NavTab icon={<Bell className="w-4 h-4" />} label="Notifications" />
           </div>

           {/* Main Content Area */}
           <div className="lg:col-span-9 space-y-8">
              
              <div className="bg-[#0F0F0F] border border-white/10 rounded-xl p-8">
                 <h2 className="text-lg font-medium text-white mb-6">Profile Information</h2>
                 
                 <div className="flex items-center gap-6 mb-8">
                    <div className="h-20 w-20 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-white text-xl font-medium overflow-hidden">
                       {photoUrl ? (
                          <img src={photoUrl} className="w-full h-full object-cover" alt="" />
                       ) : initials}
                    </div>
                    <div>
                       <button className="h-8 px-3 rounded-md bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 text-xs font-medium text-white transition-colors">
                          Change avatar
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                       <label className="text-xs font-medium text-white/70">Full Name</label>
                       <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full h-10 bg-[#0A0A0A] border border-white/10 rounded-md px-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                          placeholder="Your full name"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-medium text-white/70">Email Address</label>
                       <input
                          value={user.email}
                          disabled
                          className="w-full h-10 bg-[#0A0A0A] border border-white/5 rounded-md px-3 text-sm text-white/30 cursor-not-allowed"
                       />
                    </div>
                 </div>

                 <div className="space-y-2 mb-8">
                    <label className="text-xs font-medium text-white/70">Bio</label>
                    <textarea
                       value={bio}
                       onChange={(e) => setBio(e.target.value)}
                       className="w-full bg-[#0A0A0A] border border-white/10 rounded-md p-3 text-sm text-white h-24 resize-none focus:outline-none focus:border-white/30 transition-colors"
                       placeholder="Tell us a little about yourself..."
                    />
                 </div>

                 <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                       <ShieldCheck className="w-4 h-4 text-primary" />
                       Your data is secure
                    </div>
                    <button
                       onClick={handleSave}
                       disabled={saving}
                       className="h-9 px-4 rounded-md bg-white text-black text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                       {saving ? "Saving..." : "Save changes"}
                    </button>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}

function NavTab({ icon, label, active }) {
   return (
      <button className={cn(
         "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left",
         active 
            ? "bg-[#1A1A1A] text-white" 
            : "text-white/50 hover:bg-white/5 hover:text-white"
      )}>
         {icon}
         <span className="text-sm font-medium">{label}</span>
      </button>
   );
}