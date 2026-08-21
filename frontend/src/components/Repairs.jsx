import { motion } from "framer-motion";
import { Smartphone, BatteryCharging, Droplets, Plug, Volume2, Cpu } from "lucide-react";
import { waLink } from "@/api";

const services = [
  { icon: Smartphone, name: "Screen / Display Replacement", price: "from ₹999", time: "30–60 min",
    desc: "Cracked, blank or touch-dead screens swapped with OEM-grade panels." },
  { icon: BatteryCharging, name: "Battery Replacement", price: "from ₹599", time: "20–30 min",
    desc: "Original-capacity batteries with health calibration & warranty." },
  { icon: Droplets, name: "Water Damage Recovery", price: "from ₹799", time: "Same day",
    desc: "Ultrasonic bath + board-level corrosion treatment. No fix, no fee." },
  { icon: Plug, name: "Charging Port Repair", price: "from ₹399", time: "30 min",
    desc: "Loose, bent or dead charging ports rebuilt with reinforced flex." },
  { icon: Volume2, name: "Speaker / Mic Fix", price: "from ₹349", time: "30 min",
    desc: "Muffled audio, dead earpiece or mic issues sorted on the spot." },
  { icon: Cpu, name: "Board-Level Micro-Soldering", price: "quote on bench", time: "1–2 days",
    desc: "IC replacement, backlight circuits & data recovery under the microscope." },
];

export const Repairs = () => {
  return (
    <section id="repairs" className="relative py-24 sm:py-32 bg-[#0E1016]" data-testid="repairs-section">
      <div className="orb w-[400px] h-[400px] bg-[#00E5FF]/8 top-20 left-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-[#00E5FF] mb-3">03 · The Repair Bench</p>
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight leading-none" data-testid="repairs-heading">
            Fixed Price.<br />Fixed Fast.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="bg-[#12141C] border border-[#282C3D] hover:border-[#00E5FF] transition-colors duration-300 rounded-2xl p-6 relative overflow-hidden group shadow-xl"
              data-testid={`repair-card-${i}`}
            >
              <div className="flex items-start justify-between">
                <span className="w-12 h-12 rounded-xl bg-[#1A1D28] border border-[#282C3D] flex items-center justify-center group-hover:border-[#FFB800] transition-colors duration-300">
                  <s.icon className="w-6 h-6 text-[#FFB800]" />
                </span>
                <span className="font-mono2 text-[10px] uppercase tracking-wider text-[#8A90A3]">{s.time}</span>
              </div>
              <h3 className="font-heading text-xl font-bold tracking-tight mt-5">{s.name}</h3>
              <p className="text-sm text-[#8A90A3] mt-2 leading-relaxed">{s.desc}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-mono2 text-sm font-bold text-[#00E5FF]" data-testid={`repair-price-${i}`}>{s.price}</span>
                <a
                  href={waLink(`Hi Aslam! I need: ${s.name}. What's the exact quote?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`repair-quote-${i}`}
                  className="font-mono2 text-xs uppercase tracking-wider text-[#8A90A3] group-hover:text-[#FFB800] transition-colors duration-300 underline underline-offset-4 decoration-[#282C3D]"
                >
                  Quote Me
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};