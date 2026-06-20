"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function NavbarLP1() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section detection
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ${
          scrolled ? "top-3" : "top-4"
        }`}
      >
        <div
          className={`mx-auto max-w-5xl rounded-2xl px-5 py-3 transition-all duration-500`}
        style={scrolled ? {
          background: "rgba(5,5,5,0.7)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
        } : { background: "transparent", border: "1px solid transparent" }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-black text-sm">
                J
              </div>
              <span className="font-black text-foreground tracking-tight text-sm group-hover:text-violet-400 transition-colors duration-200">
                Janaka.dev
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={label} href={href}>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer ${
                      activeSection === href.replace("#", "")
                        ? "text-violet-400"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {activeSection === href.replace("#", "") && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl bg-violet-500/10 border border-violet-500/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </motion.span>
                </Link>
              ))}
            </nav>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-3">
              <Link href="#contact" className="hidden md:inline-flex">
                <motion.span
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold text-white cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                    boxShadow: "0 4px 16px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  Hire Me
                </motion.span>
              </Link>

              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-border/40 bg-white/5 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 rounded-2xl p-5"
            style={{
              background: "rgba(5,5,5,0.85)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <nav className="space-y-1">
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={label} href={href} onClick={() => setMobileOpen(false)}>
                  <div className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    activeSection === href.replace("#", "")
                      ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}>
                    {label}
                  </div>
                </Link>
              ))}
              <Link href="#contact" onClick={() => setMobileOpen(false)}>
                <div className="mt-3 flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-4 py-3 text-sm font-semibold text-white cursor-pointer">
                  Hire Me
                </div>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
