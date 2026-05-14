import {
  PlayCircle,
  BookOpen,
  Brain,
  Trophy,
} from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Unit-wise Prep",
    desc: "Organized lectures, hand-written notes and previous papers."
  },
  {
    icon: Brain,
    title: "PYQ Database",
    desc: "Access last 5 years question papers for every subject."
  },
  {
    icon: Trophy,
    title: "Backlog Buster",
    desc: "Stay consistent and clear all subjects in first attempt."
  }
];

export default function FeaturesSection() {
  return (
    <section className="px-4 sm:px-6 py-16 md:py-24">

      <div className="max-w-[1250px] mx-auto">

        <div className="max-w-2xl mb-14">

          <p className="text-primary text-[10px] uppercase tracking-[0.3em] font-semibold mb-4">
            Features
          </p>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1]">
            Everything you need
            <span className="text-white/30">
              {" "}to clear your Diploma.
            </span>
          </h2>

        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-center">

          {/* LEFT */}
          <div className="rounded-[30px] border border-white/10 bg-[#0F0F0F] p-5 sm:p-8">

            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                Learning Dashboard
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#161616] p-5">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Applied Mathematics
                  </h3>

                  <p className="text-white/40 text-sm mt-1">
                    Semester 1
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <PlayCircle className="text-primary" size={18} />
                </div>
              </div>

              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="w-[70%] h-full bg-primary rounded-full" />
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-4">

            {FEATURES.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-[#101010] p-6"
              >
                <item.icon className="w-5 h-5 text-primary mb-5" />

                <h3 className="text-white font-semibold mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-white/40 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>

        </div>
      </div>
    </section>
  );
}