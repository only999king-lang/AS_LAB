import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Zap, ShieldCheck, Timer } from "lucide-react";
import { SHOP, waLink } from "@/api";

const lines = ["DEAD PHONE?", "WE RESURRECT", "EVERY PIXEL."];

const stats = [
  { icon: Timer, label: "30-min express fixes" },
  { icon: ShieldCheck, label: "90-day repair warranty" },
  { icon: Zap, label: "5000+ devices revived" },
];

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);

  return (
    <section ref={ref} id="top" className="relative min-h-screen flex items-center overflow-hidden pt-16" data-testid="hero-section">
      <div className="orb w-[500px] h-[500px] bg-[#FFB800]/15 -top-40 -left-40" />
      <div className="orb w-[400px] h-[400px] bg-[#00E5FF]/10 bottom-0 right-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-20">
        <motion.div style={{ y: textY }} className="lg:col-span-7 relative z-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-mono2 text-xs uppercase tracking-[0.3em] text-[#FFB800] mb-6"
            data-testid="hero-eyebrow"
          >
            Aslam's Repair Lab · Est. 2018
          </motion.p>

          <h1 className="font-heading font-extrabold uppercase tracking-tight leading-[0.95] text-4xl sm:text-6xl lg:text-7xl" data-testid="hero-heading">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.25 + i * 0.14, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  {i === 1 ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-[#00E5FF]">{line}</span>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="mt-6 text-sm sm:text-base text-[#8A90A3] max-w-md leading-relaxed"
            data-testid="hero-subtext"
          >
            Micro-soldering precision, OEM-grade displays, and a wall of premium
            gear — covers, glass, earbuds, headphones & speakers. Walk in broken,
            walk out brand new.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a
              href={waLink("Hi Aslam! My phone needs a repair. Can you help?")}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-quick-quote-button"
              className="group px-7 py-3.5 bg-[#FFB800] text-[#0B0C10] font-heading font-bold uppercase tracking-wide text-sm rounded-full hover:bg-[#E0A200] transition-colors duration-300 flex items-center gap-2"
            >
              Get Instant Quote
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>
            <a
              href="#products"
              data-testid="hero-browse-gear-button"
              className="px-7 py-3.5 border border-[#282C3D] text-[#F4F5F7] font-heading font-bold uppercase tracking-wide text-sm rounded-full hover:border-[#00E5FF] hover:text-[#00E5FF] transition-colors duration-300"
            >
              Browse Gear
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-12 flex flex-wrap gap-x-8 gap-y-3"
            data-testid="hero-stats"
          >
            {stats.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[#8A90A3]">
                <Icon className="w-4 h-4 text-[#FFB800]" />
                <span className="font-mono2 text-xs uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative"
        >
          <motion.div style={{ y: imgY }} className="relative">
            <div className="clip-frame relative overflow-hidden rounded-2xl border border-[#282C3D] shadow-2xl shadow-[#FFB800]/5">
              <img
                src="https://images.pexels.com/photos/6755092/pexels-photo-6755092.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Technician micro-soldering a phone motherboard"
                className="w-full h-[420px] sm:h-[520px] object-cover"
                data-testid="hero-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/80 via-transparent to-transparent" />
              <div className="scan-pulse absolute left-0 right-0 top-1/3 h-px bg-[#00E5FF]/70 shadow-[0_0_20px_#00E5FF]" />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-[#12141C] border border-[#FFB800]/40 rounded-xl px-5 py-3 backdrop-blur-md" data-testid="hero-live-badge">
              <p className="font-mono2 text-[10px] uppercase tracking-[0.25em] text-[#00E5FF]">Bench 01 · Live</p>
              <p className="font-heading font-bold text-sm mt-1">Display swap in progress</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#8A90A3]"
      >
        <ArrowDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
};