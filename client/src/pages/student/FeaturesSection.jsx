import { 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Users2, 
  Globe2, 
  Cpu,
  GraduationCap,
  Sparkles
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Smart Learning Path",
      desc: "Our AI-driven algorithm suggests the best courses and units based on your academic goals.",
      icon: <Zap className="text-orange-500" />,
      color: "from-orange-500/20 to-transparent"
    },
    {
      title: "Certified Curriculum",
      desc: "Syllabus-compliant modules designed by top-tier academic experts and industry veterans.",
      icon: <ShieldCheck className="text-blue-500" />,
      color: "from-blue-500/20 to-transparent"
    },
    {
      title: "Real-time Analytics",
      desc: "Track your progress with granular detail, from lecture completion to self-assessment scores.",
      icon: <BarChart3 className="text-emerald-500" />,
      color: "from-emerald-500/20 to-transparent"
    },
    {
      title: "Global Community",
      desc: "Connect with thousands of fellow students across 120+ countries for peer-to-peer learning.",
      icon: <Users2 className="text-purple-500" />,
      color: "from-purple-500/20 to-transparent"
    }
  ];

  const stats = [
    { label: "Active Learners", value: "85K+", sub: "Enrolled this semester" },
    { label: "Expert Mentors", value: "450+", sub: "Verified educators" },
    { label: "Success Rate", value: "94%", sub: "Career advancement" },
    { label: "Resources", value: "12K+", sub: "Premium study materials" }
  ];

  return (
    <section className="bg-[#0a0a0a] py-32 px-6 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-primary rounded-full" />
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">The Marshall Edge</span>
            </div>
            <h2 className="text-white text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-[1.1] mb-6 md:mb-8">
              Advanced <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Infrastructure</span> <br/>
              for Modern Education.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg font-medium leading-relaxed max-w-xl">
              We've built more than just a course platform. MarshallLMS is a comprehensive ecosystem designed to optimize every aspect of your academic journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div 
                key={i}
                className="group p-8 bg-[#111] border border-white/5 rounded-[2rem] hover:border-white/10 transition-all hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-white text-sm font-black uppercase tracking-widest mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 md:gap-8 py-10 md:py-16 px-6 md:px-12 bg-[#111] border border-white/5 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden">
           {/* Glass Effect */}
           <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
           
           {stats.map((s, i) => (
             <div key={i} className="text-center space-y-1 md:space-y-2 relative z-10">
               <p className="text-white text-2xl md:text-4xl font-black tracking-tighter uppercase">{s.value}</p>
               <div className="space-y-1">
                 <p className="text-primary text-[9px] font-black uppercase tracking-widest">{s.label}</p>
                 <p className="text-muted-foreground text-[8px] font-bold uppercase opacity-50">{s.sub}</p>
               </div>
             </div>
           ))}
        </div>

      </div>
    </section>
  );
}
