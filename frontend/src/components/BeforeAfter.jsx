import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";

const BEFORE_IMG = "https://images.unsplash.com/photo-1746005514011-ea00280f3b6e?crop=entropy&cs=srgb&fm=jpg&q=85&w=940";
const AFTER_IMG = "https://images.pexels.com/photos/6755056/pexels-photo-6755056.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export const BeforeAfter = () => {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);

  const update = useCallback((clientX) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    update(e.clientX);
  };
  const onPointerMove = (e) => dragging.current && update(e.clientX);
  const stop = () => (dragging.current = false);

  return (
    <section className="relative py-24 sm:py-32 bg-[#0E1016]" data-testid="before-after-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-[#00E5FF] mb-3">05 · Proof of Work</p>
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight" data-testid="before-after-heading">
            Drag to See the Magic
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          ref={ref}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stop}
          onPointerLeave={stop}
          className="relative h-[320px] sm:h-[460px] rounded-2xl overflow-hidden border border-[#282C3D] cursor-ew-resize select-none touch-none shadow-2xl"
          data-testid="before-after-slider"
        >
          <img src={AFTER_IMG} alt="After repair" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
            <img
              src={BEFORE_IMG}
              alt="Before repair"
              draggable={false}
              className="absolute inset-0 h-full object-cover grayscale contrast-125"
              style={{ width: ref.current?.getBoundingClientRect().width || "100%" }}
            />
          </div>
          <div className="absolute top-0 bottom-0 w-0.5 bg-[#FFB800] shadow-[0_0_16px_#FFB800]" style={{ left: `${pos}%` }}>
            <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#FFB800] flex items-center justify-center">
              <MoveHorizontal className="w-5 h-5 text-[#0B0C10]" />
            </span>
          </div>
          <span className="absolute top-4 left-4 font-mono2 text-[10px] uppercase tracking-[0.25em] bg-[#0B0C10]/70 backdrop-blur px-3 py-1.5 rounded-full border border-[#282C3D]">Before</span>
          <span className="absolute top-4 right-4 font-mono2 text-[10px] uppercase tracking-[0.25em] bg-[#FFB800] text-[#0B0C10] font-bold px-3 py-1.5 rounded-full">After</span>
        </motion.div>
      </div>
    </section>
  );
};