import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const links = [
  { label: "Products", href: "#products", testid: "nav-link-products" },
  { label: "Repairs", href: "#repairs", testid: "nav-link-repairs" },
  { label: "Why Us", href: "#manifesto", testid: "nav-link-manifesto" },
  { label: "Contact", href: "#contact", testid: "nav-link-contact" },
];

export const Nav = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#282C3D]/60 bg-[#0B0C10]/70 backdrop-blur-xl"
      data-testid="main-nav"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#top" data-testid="nav-brand-logo" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-lg bg-[#FFB800] flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <Wrench className="w-5 h-5 text-[#0B0C10]" strokeWidth={2.5} />
          </span>
          <span className="font-heading font-extrabold text-lg tracking-tight uppercase">
            AS<span className="text-[#FFB800]">Labs</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={l.testid}
              className="font-mono2 text-xs uppercase tracking-[0.2em] text-[#8A90A3] hover:text-[#FFB800] transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/admin/login"
            data-testid="nav-admin-link"
            className="font-mono2 text-xs uppercase tracking-[0.2em] text-[#8A90A3]/50 hover:text-[#00E5FF] transition-colors duration-300"
          >
            Admin
          </Link>
        </nav>

        <button
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#F4F5F7]"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-[#282C3D] bg-[#0B0C10] px-6 py-4 flex flex-col gap-4"
          data-testid="nav-mobile-menu"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-mono2 text-sm uppercase tracking-[0.2em] text-[#8A90A3] hover:text-[#FFB800]"
            >
              {l.label}
            </a>
          ))}
          <Link to="/admin/login" className="font-mono2 text-sm uppercase tracking-[0.2em] text-[#8A90A3]/50">
            Admin
          </Link>
        </motion.nav>
      )}
    </motion.header>
  );
};