import { motion } from "framer-motion";

const chapters = [
  { num: "01", title: "No Fix, No Fee",
    body: "If we can't bring your device back, you don't pay a rupee. Diagnosis is always free, always honest." },
  { num: "02", title: "Parts We'd Use Ourselves",
    body: "Every display, battery and panel on our bench is the same grade we'd put in our own phones. No cheap copies, ever." },
  { num: "03", title: "Your Data Stays Yours",
    body: "Repairs happen in front of you whenever possible. We never touch your photos, chats or passwords." },
  { num: "04", title: "Neighbourhood First",
    body: "Run by Aslam Sk since 2018 — fair prices for neighbours, students and families. That's the whole business plan." },
];

export const Manifesto = () => {
  return (
    <section id="manifesto" className="relative py-24 sm:py-32" data-testid="manifesto-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono2 text-xs uppercase tracking-[0.3em] text-[#FFB800] mb-14"
        >
          04 · The Workshop Manifesto
        </motion.p>

        <div className="space-y-0">
          {chapters.map((c, i) => (
            <motion.div
              key={c.num}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
              className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10 border-t border-[#282C3D] last:border-b items-start"
              data-testid={`manifesto-chapter-${c.num}`}
            >
              <span className="md:col-span-2 font-mono2 text-sm text-[#8A90A3] group-hover:text-[#FFB800] transition-colors duration-300">
                / {c.num}
              </span>
              <h3 className="md:col-span-4 font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight group-hover:text-[#FFB800] transition-colors duration-300">
                {c.title}
              </h3>
              <p className="md:col-span-6 text-sm sm:text-base text-[#8A90A3] leading-relaxed max-w-lg">
                {c.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};