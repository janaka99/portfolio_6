"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Twitter, ArrowUp } from "lucide-react";
import { SOCIAL_MEDIA } from "@/constants";

const NAV_LINKS = ["Skills", "Projects", "Experience", "About", "Contact"];

export default function FooterLP1() {
  const year = new Date().getFullYear();

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-[#050505] overflow-hidden">
      {/* Top divider — glass line */}
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.3) 30%, rgba(236,72,153,0.3) 70%, transparent 100%)",
        }}
      />

      {/* Glow above footer */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-32 w-2/3 rounded-full bg-violet-600/5 blur-[60px]" />

      <div className="container mx-auto px-6 lg:px-8 py-14 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">

          {/* Brand + tagline */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  boxShadow: "0 4px 16px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                J
              </div>
              <div>
                <div className="text-sm font-bold text-foreground group-hover:text-violet-400 transition-colors duration-200">
                  Janaka Chamith
                </div>
                <div className="text-xs text-muted-foreground/40 font-mono">Full-Stack & AI Engineer</div>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground/40 max-w-xs leading-relaxed pl-12">
              Building intelligent products at the intersection of AI and modern engineering.
            </p>
          </div>

          {/* Quick nav */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV_LINKS.map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-xs font-mono text-muted-foreground/50 hover:text-violet-400 transition-colors duration-200 uppercase tracking-wider cursor-pointer"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Socials + back-to-top */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex items-center gap-2">
              {[
                { href: SOCIAL_MEDIA.github, Icon: Github, label: "GitHub" },
                { href: SOCIAL_MEDIA.linkedin, Icon: Linkedin, label: "LinkedIn" },
                { href: SOCIAL_MEDIA.x, Icon: Twitter, label: "X" },
              ].map(({ href, Icon, label }) => (
                <Link key={label} href={href} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-violet-400 transition-colors duration-200 cursor-pointer"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="sr-only">{label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Back to top */}
            <motion.button
              onClick={scrollTop}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/40 hover:text-violet-400 transition-colors duration-200 cursor-pointer uppercase tracking-widest"
            >
              <ArrowUp className="h-3 w-3" />
              Back to top
            </motion.button>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-[11px] font-mono text-muted-foreground/30">
            © {year} Janaka Chamith. All rights reserved.
          </p>
          <p className="text-[11px] font-mono text-muted-foreground/20">
            Built with Next.js · Framer Motion · AI
          </p>
        </div>
      </div>
    </footer>
  );
}
