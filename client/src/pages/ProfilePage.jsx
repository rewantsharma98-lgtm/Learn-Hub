import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Camera, ArrowLeft } from "lucide-react";
import { userLoggedIn } from "@/features/authSlice";
import { toast } from "sonner";

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
      // 🔁 When backend is ready, replace this with your API call:
      // await updateProfile({ name, bio }).unwrap();
      // For now update Redux directly
      dispatch(userLoggedIn({ user: { ...user, name, bio } }));
      toast.success("Profile updated!");
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
    <div className="min-h-screen bg-background px-6 py-16">
      <div className="max-w-xl mx-auto">

        {/* back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-white text-xs font-black uppercase tracking-widest mb-10 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <h1 className="text-white text-3xl font-black tracking-tight mb-10">Edit Profile</h1>

        {/* avatar */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative">
            <div className="h-28 w-28 rounded-full ring-4 ring-primary/20 overflow-hidden bg-primary flex items-center justify-center shadow-2xl">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-white text-3xl font-black uppercase">{initials}</span>
              )}
            </div>
            {/* camera icon */}
            <button className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center border-4 border-background hover:bg-primary/90 transition-all shadow-lg">
              <Camera size={14} className="text-white" />
            </button>
          </div>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-4">
            Profile photo synced from Google
          </p>
        </div>

        {/* form */}
        <div className="bg-card rounded-2xl border border-border p-8 space-y-6 shadow-xl">

          {/* email — read only */}
          <div>
            <label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2 block">Email Address</label>
            <input
              value={user.email || ""}
              readOnly
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-muted-foreground text-sm outline-none cursor-not-allowed font-medium"
            />
            <p className="text-muted-foreground/40 text-[9px] font-bold uppercase mt-2 tracking-tighter">Email address cannot be changed</p>
          </div>

          {/* name */}
          <div>
            <label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2 block">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-primary transition-all font-medium"
            />
          </div>

          {/* bio */}
          <div>
            <label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2 block">Personal Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself..."
              rows={4}
              className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-primary transition-all resize-none font-medium leading-relaxed"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3.5 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-primary/10 mt-4"
          >
            {saving ? "Saving Changes..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}