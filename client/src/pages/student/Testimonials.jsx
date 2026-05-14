const TESTIMONIALS = [
  {
    name: "Aarav",
    text: "Finally found a place where I can get proper semester-wise notes. It helped me clear my backlogs easily!"
  },
  {
    name: "Riya",
    text: "The previous year question papers are a lifesaver for end-sem exams. Everything is so well-organized by units."
  },
  {
    name: "Kabir",
    text: "Applied Physics and Maths became much easier with these lecture videos. Best platform for polytechnic students."
  }
];

export default function Testimonials() {
  return (
    <section className="px-4 sm:px-6 py-16 md:py-24">

      <div className="max-w-[1200px] mx-auto">

        <div className="text-center mb-14">

          <p className="text-primary text-[10px] uppercase tracking-[0.3em] font-semibold mb-4">
            Testimonials
          </p>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Loved by students.
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-5">

          {TESTIMONIALS.map((item) => (
            <div
              key={item.name}
              className="rounded-[28px] border border-white/10 bg-[#101010] p-6 sm:p-7"
            >
              <p className="text-white/60 leading-relaxed text-sm sm:text-base">
                "{item.text}"
              </p>

              <div className="mt-6 flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {item.name[0]}
                </div>

                <div>
                  <div className="text-white font-medium text-sm">
                    {item.name}
                  </div>

                  <div className="text-white/30 text-xs">
                    LearnHub Student
                  </div>
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}