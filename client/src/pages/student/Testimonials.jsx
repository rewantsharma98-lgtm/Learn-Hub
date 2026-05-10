import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Fullstack Developer",
    content: "The best LMS platform I've ever used. The UI is incredibly smooth and the course content is top-notch. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80"
  },
  {
    name: "Sarah Chen",
    role: "UI/UX Designer",
    content: "I love the dark mode and the overall aesthetic. It's so much more professional than other platforms. Learning here is a joy.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
  },
  {
    name: "Michael Knight",
    role: "Data Scientist",
    content: "The progress tracking and interactive lectures kept me motivated throughout the entire Python bootcamp. Worth every penny.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
  }
];

export default function Testimonials() {
  return (
    <section className="bg-[#1a1a1a] py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">Wall of Love</p>
        <h2 className="text-white text-4xl font-black tracking-tight uppercase">What our students say</h2>
        <div className="w-16 h-1 bg-primary mx-auto mt-6 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="bg-[#222] border border-white/5 p-10 rounded-3xl relative transition-all duration-300 hover:border-primary/20 hover:-translate-y-2 group">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-primary text-primary" />)}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-8 italic">"{t.content}"</p>
            <div className="flex items-center gap-4">
              <img src={t.avatar} className="w-12 h-12 rounded-full border-2 border-primary/20" alt={t.name} />
              <div className="text-left">
                <h4 className="text-white text-xs font-black uppercase tracking-widest">{t.name}</h4>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-tighter mt-1">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
