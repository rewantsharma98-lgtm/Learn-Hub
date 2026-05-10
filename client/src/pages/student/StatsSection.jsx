import { Users, BookOpen, Star, Globe } from "lucide-react";

export default function StatsSection() {
  return (
    <section className="bg-[#1a1a1a] py-24 px-6 border-y border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        <StatItem icon={<Users className="text-primary" />} value="50k+" label="Active Students" />
        <StatItem icon={<BookOpen className="text-primary" />} value="200+" label="Total Courses" />
        <StatItem icon={<Star className="text-primary" />} value="4.9/5" label="Average Rating" />
        <StatItem icon={<Globe className="text-primary" />} value="120+" label="Countries" />
      </div>
    </section>
  );
}

function StatItem({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
      <div className="p-4 bg-primary/10 rounded-2xl mb-2">
        {icon}
      </div>
      <h3 className="text-white text-3xl md:text-4xl font-black tracking-tight">{value}</h3>
      <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
}
