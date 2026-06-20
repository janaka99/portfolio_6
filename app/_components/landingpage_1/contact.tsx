"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Github, Linkedin, Twitter, Mail, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SOCIAL_MEDIA } from "@/constants";

const SOCIALS = [
  { label: "GitHub",      href: SOCIAL_MEDIA.github,    Icon: Github,   handle: "@janaka99",          accentRgb: "255,255,255" },
  { label: "LinkedIn",    href: SOCIAL_MEDIA.linkedin,  Icon: Linkedin, handle: "Janaka Chamith",      accentRgb: "10,102,194"  },
  { label: "X / Twitter", href: SOCIAL_MEDIA.x,         Icon: Twitter,  handle: "@JanakaChamith1",     accentRgb: "255,255,255" },
  { label: "Email",       href: "mailto:hello@janakachamith.dev", Icon: Mail, handle: "hello@janakachamith.dev", accentRgb: "139,92,246" },
];

/* ---------- Glass input ---------- */
function GlassInput({ id, name, type = "text", value, onChange, placeholder, required }: {
  id: string; name: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string; required?: boolean;
}) {
  return (
    <input
      id={id} name={name} type={type} required={required}
      value={value} onChange={onChange} placeholder={placeholder}
      className="w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-white/20 focus:outline-none transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.3)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.border = "1px solid rgba(139,92,246,0.5)";
        e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 3px rgba(139,92,246,0.15), 0 2px 8px rgba(0,0,0,0.3)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
        e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.3)";
      }}
    />
  );
}

function GlassTextarea({ id, name, value, onChange, placeholder, required }: {
  id: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string; required?: boolean;
}) {
  return (
    <textarea
      id={id} name={name} required={required} rows={6}
      value={value} onChange={onChange} placeholder={placeholder}
      className="w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-white/20 focus:outline-none transition-all duration-200 resize-none"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.3)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.border = "1px solid rgba(139,92,246,0.5)";
        e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 3px rgba(139,92,246,0.15), 0 2px 8px rgba(0,0,0,0.3)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
        e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.3)";
      }}
    />
  );
}

export default function ContactLP1() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("sent");
  };

  return (
    <section id="contact" className="relative py-32 bg-[#050505] overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-violet-900/8 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/4 right-0 h-[300px] w-[300px] rounded-full bg-cyan-900/5 blur-[100px]" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="h-px w-8 bg-cyan-500/60" />
            <span className="font-mono text-xs text-cyan-400/70 uppercase tracking-[0.3em]">Let's Talk</span>
            <span className="h-px w-8 bg-cyan-500/60" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9] mb-6">
            Build Something
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Extraordinary.
            </span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg leading-relaxed">
            Whether it's a production AI system, a beautiful product, or just an idea you want to explore — I'm all ears.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Socials column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 flex flex-col gap-3"
          >
            <h3 className="font-mono text-xs text-muted-foreground/50 uppercase tracking-widest mb-1">Find me on</h3>

            {SOCIALS.map(({ label, href, Icon, handle }) => (
              <Link key={label} href={href} target="_blank" rel="noopener noreferrer">
                <motion.div
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="group flex items-center gap-4 rounded-xl p-4 transition-all duration-300 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(139,92,246,0.25)";
                    e.currentTarget.style.background = "rgba(139,92,246,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground group-hover:text-violet-400 transition-colors duration-200 shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-white/30 uppercase tracking-wider mb-0.5">{label}</div>
                    <div className="text-sm text-foreground/80 truncate">{handle}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-white/20 ml-auto shrink-0 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                </motion.div>
              </Link>
            ))}

            {/* Availability glass badge */}
            <div
              className="mt-3 rounded-xl p-4"
              style={{
                background: "rgba(16,185,129,0.05)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(16,185,129,0.2)",
                boxShadow: "inset 0 1px 0 rgba(16,185,129,0.1), 0 0 20px rgba(16,185,129,0.05)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="h-2 w-2 rounded-full bg-emerald-400"
                  style={{ boxShadow: "0 0 8px rgba(52,211,153,0.8)" }}
                />
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Available</span>
              </div>
              <p className="text-sm text-muted-foreground/70 leading-relaxed">
                Open to full-time roles & freelance projects in AI, full-stack and mobile engineering.
              </p>
            </div>
          </motion.div>

          {/* Form glass panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3"
          >
            <div
              className="relative overflow-hidden rounded-2xl p-8"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow:
                  "0 16px 48px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1)",
              }}
            >
              {/* Top shine */}
              <div
                className="absolute top-0 left-10 right-10 h-px rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
              />

              {/* Inner subtle glow */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.04) 0%, transparent 50%)",
                }}
              />

              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 flex flex-col items-center justify-center py-16 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="mb-5"
                    >
                      <CheckCircle className="h-16 w-16 text-emerald-400" style={{ filter: "drop-shadow(0 0 12px rgba(52,211,153,0.5))" }} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">Message Sent!</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      Thanks for reaching out. I'll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="relative z-10 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="lp1-name" className="block font-mono text-[11px] text-white/40 uppercase tracking-wider mb-2">Name</label>
                        <GlassInput id="lp1-name" name="name" required value={form.name} onChange={handleChange} placeholder="Janaka Chamith" />
                      </div>
                      <div>
                        <label htmlFor="lp1-email" className="block font-mono text-[11px] text-white/40 uppercase tracking-wider mb-2">Email</label>
                        <GlassInput id="lp1-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lp1-message" className="block font-mono text-[11px] text-white/40 uppercase tracking-wider mb-2">Message</label>
                      <GlassTextarea id="lp1-message" name="message" required value={form.message} onChange={handleChange} placeholder="Tell me about your project, idea or opportunity..." />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={status === "sending"}
                      whileHover={{ scale: status === "idle" ? 1.02 : 1, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 cursor-pointer disabled:opacity-70"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                        boxShadow: "0 4px 24px rgba(124,58,237,0.4), 0 1px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                      }}
                    >
                      {status === "sending" ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
