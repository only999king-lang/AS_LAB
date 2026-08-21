import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  { name: "Rahim Sheikh", text: "Display changed in 40 minutes, looks brand new. Best phone shop in Farakka, hands down.", tag: "Display Repair" },
  { name: "Priya Mandal", text: "My phone fell in water and I thought it was gone. Aslam da brought it back the same day!", tag: "Water Damage" },
  { name: "Sourav Ghosh", text: "Genuine earbuds at a fair price. He tested them in front of me before I paid. Very honest.", tag: "Earbuds" },
  { name: "Fatima Bibi", text: "Battery was dying by afternoon. New battery fitted in 20 minutes, now lasts all day.", tag: "Battery Swap" },
  { name: "Arjun Das", text: "Bought a rugged cover and tempered glass — he fitted the glass free, zero bubbles.", tag: "Accessories" },
  { name: "Nasrin Khatun", text: "Charging port was loose for months. Fixed in half an hour at a very reasonable price.", tag: "Port Repair" },
  { name: "Bikash Roy", text: "Bluetooth speaker sounds amazing for the price. He even showed me three options first.", tag: "Speaker" },
  { name: "Mousumi Pal", text: "Other shops said my motherboard was dead. He repaired it under the microscope. Magician!", tag: "Micro-Soldering" },
];

const ReviewCard = ({ r }) => (
  <div
    className="w-[320px] sm:w-[380px] shrink-0 mx-3 bg-[#12141C] border border-[#282C3D] hover:border-[#FFB800] transition-colors duration-300 rounded-2xl p-6"
    data-testid={`review-card-${r.name.toLowerCase().replace(/\s+/g, "-")}`}
  >
    <div className="flex items-center justify-between">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
        ))}
      </div>
      <Quote className="w-5 h-5 text-[#282C3D]" />
    </div>
    <p className="text-sm text-[#F4F5F7]/90 leading-relaxed mt-4 min-h-[60px]">"{r.text}"</p>
    <div className="mt-5 flex items-center justify-between">
      <span className="font-heading font-bold text-sm">{r.name}</span>
      <span className="font-mono2 text-[10px] uppercase tracking-wider text-[#00E5FF] bg-[#1A1D28] border border-[#282C3D] px-2.5 py-1 rounded-full">
        {r.tag}
      </span>
    </div>
  </div>
);

export const Reviews = () => {
  const doubled = [...reviews, ...reviews];
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden" data-testid="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-[#FFB800] mb-3">Word on the Street</p>
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight leading-none" data-testid="reviews-heading">
            Neighbours<br />Talk.
          </h2>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0B0C10] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0B0C10] to-transparent z-10 pointer-events-none" />
        <div className="overflow-hidden" data-testid="reviews-marquee">
          <div className="marquee-track flex w-max py-2" style={{ animationDuration: "65s" }}>
            {doubled.map((r, i) => (
              <ReviewCard key={`${r.name}-${i}`} r={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};