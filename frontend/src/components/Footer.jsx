import { motion } from "framer-motion";
import { Phone, MessageCircle, Wrench } from "lucide-react";
import { SHOP, waLink } from "@/api";

export const Footer = () => {
  return (
    <>
      <footer className="border-t border-[#282C3D] bg-[#0E1016] py-12" data-testid="site-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#FFB800] flex items-center justify-center">
              <Wrench className="w-4 h-4 text-[#0B0C10]" strokeWidth={2.5} />
            </span>
            <span className="font-heading font-extrabold uppercase tracking-tight">
              AS<span className="text-[#FFB800]">Labs</span>
            </span>
          </div>
          <p className="font-mono2 text-xs text-[#8A90A3] text-center">
            © {new Date().getFullYear()} AS LABS · Run by {SHOP.owner} · Repair done right.
          </p>
          <p className="font-mono2 text-[10px] uppercase tracking-[0.25em] text-[#8A90A3]/60">
            Precision · Honesty · Warranty
          </p>
        </div>
      </footer>

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-3"
        data-testid="floating-contact-dock"
      >
        <a
          href={SHOP.phoneHref}
          data-testid="call-cta-dock"
          aria-label="Call the shop"
          className="w-14 h-14 rounded-full bg-[#12141C] border border-[#00E5FF]/50 flex items-center justify-center hover:bg-[#00E5FF] group transition-colors duration-300 shadow-lg shadow-black/40"
        >
          <Phone className="w-6 h-6 text-[#00E5FF] group-hover:text-[#0B0C10] transition-colors duration-300" />
        </a>
        <a
          href={waLink("Hi Aslam! I'm visiting from your website.")}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="whatsapp-cta-dock"
          aria-label="WhatsApp the shop"
          className="w-14 h-14 rounded-full bg-[#10B981] flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#10B981]/30"
        >
          <MessageCircle className="w-6 h-6 text-[#0B0C10]" />
        </a>
      </motion.div>
    </>
  );
};