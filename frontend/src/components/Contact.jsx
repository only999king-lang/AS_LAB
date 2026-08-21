import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { api, SHOP } from "@/api";

export const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", message: "", interest: "Repair" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/enquiries", form);
      toast.success("Enquiry sent! Aslam will call you back shortly.");
      setForm({ name: "", phone: "", message: "", interest: "Repair" });
    } catch {
      toast.error("Couldn't send. Please call or WhatsApp us instead.");
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full bg-[#0B0C10] border border-[#282C3D] rounded-xl px-4 py-3 text-sm text-[#F4F5F7] placeholder-[#8A90A3]/60 focus:outline-none focus:border-[#FFB800] transition-colors duration-300";

  return (
    <section id="contact" className="relative py-24 sm:py-32" data-testid="contact-section">
      <div className="orb w-[450px] h-[450px] bg-[#FFB800]/10 bottom-0 -right-40" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-[#FFB800] mb-3">06 · Visit the Lab</p>
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight leading-none" data-testid="contact-heading">
            Walk In.<br />Walk Out Fixed.
          </h2>
          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4" data-testid="contact-phone-row">
              <span className="w-11 h-11 rounded-xl bg-[#12141C] border border-[#282C3D] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#FFB800]" />
              </span>
              <div>
                <p className="font-mono2 text-[10px] uppercase tracking-[0.25em] text-[#8A90A3]">Call Aslam directly</p>
                <a href={SHOP.phoneHref} className="font-heading text-xl font-bold hover:text-[#FFB800] transition-colors" data-testid="contact-phone-link">
                  {SHOP.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4" data-testid="contact-address-row">
              <span className="w-11 h-11 rounded-xl bg-[#12141C] border border-[#282C3D] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#00E5FF]" />
              </span>
              <div>
                <p className="font-mono2 text-[10px] uppercase tracking-[0.25em] text-[#8A90A3]">Find the shop</p>
                <a
                  href={SHOP.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-xl font-bold hover:text-[#00E5FF] transition-colors"
                  data-testid="contact-address-link"
                >
                  {SHOP.address}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4" data-testid="contact-hours-row">
              <span className="w-11 h-11 rounded-xl bg-[#12141C] border border-[#282C3D] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#FFB800]" />
              </span>
              <div>
                <p className="font-mono2 text-[10px] uppercase tracking-[0.25em] text-[#8A90A3]">Open hours</p>
                <p className="font-heading text-xl font-bold">{SHOP.hours}</p>
              </div>
            </div>
          </div>

          <div
            className="mt-10 rounded-2xl overflow-hidden border border-[#282C3D] hover:border-[#FFB800] transition-colors duration-300 shadow-xl"
            data-testid="contact-map-embed"
          >
            <iframe
              title="AS LABS shop location — Ballalpur Brahmattar, Farakka"
              src={SHOP.mapEmbed}
              className="w-full h-64 sm:h-72 grayscale invert-[0.92] contrast-[0.9] opacity-90"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#12141C] border border-[#282C3D] rounded-2xl p-6 sm:p-8 shadow-xl space-y-5"
          data-testid="contact-form"
        >
          <p className="font-mono2 text-xs uppercase tracking-[0.25em] text-[#00E5FF]">Book a repair / Ask about gear</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              required
              data-testid="contact-name-input"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
            />
            <input
              required
              data-testid="contact-phone-input"
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputCls}
            />
          </div>
          <select
            data-testid="contact-interest-select"
            value={form.interest}
            onChange={(e) => setForm({ ...form, interest: e.target.value })}
            className={inputCls}
          >
            {["Repair", "Phone Cover", "Tempered Glass", "Display", "Back Panel", "Earbuds", "Headphones", "Speaker", "Other"].map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <textarea
            required
            rows={4}
            data-testid="contact-message-input"
            placeholder="Tell us what's wrong or what you're looking for…"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`${inputCls} resize-none`}
          />
          <button
            type="submit"
            disabled={sending}
            data-testid="contact-submit-button"
            className="w-full py-4 bg-[#FFB800] text-[#0B0C10] font-heading font-bold uppercase tracking-wide text-sm rounded-full hover:bg-[#E0A200] disabled:opacity-50 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            {sending ? "Sending…" : "Send Enquiry"}
            <Send className="w-4 h-4" />
          </button>
        </motion.form>
      </div>
    </section>
  );
};