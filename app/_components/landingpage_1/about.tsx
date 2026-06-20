"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Brain, Rocket, Coffee, MapPin, Clock } from "lucide-react";

/* ---------- Mini 3D Glass Bento Card ---------- */
function BentoCard({
  children,
  className = "",
  accentRgb = "139,92,246",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  accentRgb?: string;
  delay?: number;
}) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, visible: false });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setRotateX(-dy * 8);
    setRotateY(dx * 8);
    setGlare({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      visible: true,
    });
  };

  const onMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlare((g) => ({ ...g, visible: false }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: "900px" }}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="relative overflow-hidden rounded-2xl h-full cursor-default"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.15s ease, box-shadow 0.3s ease",
          transformStyle: "preserve-3d",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid rgba(${accentRgb},0.15)`,
          boxShadow: glare.visible
            ? `0 16px 48px rgba(0,0,0,0.6), 0 4px 16px rgba(${accentRgb},0.12), inset 0 1px 0 rgba(255,255,255,0.1)`
            : `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-8 right-8 h-px"
          style={{ background: `linear-gradient(90deg, transparent, rgba(${accentRgb},0.6), transparent)` }}
        />
        {/* Glare */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-200"
          style={{
            opacity: glare.visible ? 1 : 0,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.09) 0%, transparent 60%)`,
          }}
        />
        {/* Children elevated */}
        <div className="relative h-full" style={{ transform: "translateZ(16px)" }}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Real-time clock ---------- */
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useState(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  });

  const hours = time.getHours().toString().padStart(2, "0");
  const mins = time.getMinutes().toString().padStart(2, "0");
  const secs = time.getSeconds().toString().padStart(2, "0");

  return (
    <span className="font-mono text-2xl font-black text-white tabular-nums">
      {hours}
      <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>:</motion.span>
      {mins}
      <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}>:</motion.span>
      {secs}
    </span>
  );
}

const FUN_FACTS = [
  "I debug with console.log (no shame 🙂)",
  "Coffee → Code → Ship. That's the loop.",
  "Dark mode only. Always.",
  "I love Three.js rabbit holes at 2 AM.",
  "LangGraph convinced me graphs are fun.",
];

export default function AboutLP1() {
  const [factIdx, setFactIdx] = useState(0);

  return (
    <section id="about" className="relative py-32 bg-[#050505] overflow-hidden">
      {/* Ambient */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-violet-900/5 blur-[140px]" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-5">
            <span className="h-px w-8 bg-violet-500/60" />
            <span className="font-mono text-xs text-violet-400/70 uppercase tracking-[0.3em]">About Me</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
            The Human
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Behind the Code.
            </span>
          </h2>
        </motion.div>

        {/* Bento Grid — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* — Bio card (col-span 2) — */}
          <BentoCard accentRgb="139,92,246" delay={0} className="md:col-span-2">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}
                >
                  <Brain className="h-5 w-5 text-violet-400" />
                </div>
                <span className="font-mono text-xs text-violet-400/70 uppercase tracking-widest">Who I Am</span>
              </div>
              <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
                I'm <span className="text-white font-semibold">Janaka Chamith</span>, a Sri Lanka-based Full-Stack & AI Engineer
                with <span className="text-violet-400 font-medium">2+ years of production experience</span> building everything from
                enterprise SaaS platforms to autonomous AI agents.
              </p>
              <p className="text-sm text-muted-foreground/60 leading-relaxed">
                My work lives at the intersection of clean engineering and cutting-edge AI — shipping products that are
                fast, beautiful, and intelligently designed. Currently at{" "}
                <span className="text-emerald-400">Artslab Creatives</span>, leading mobile & AI development.
              </p>
            </div>
          </BentoCard>

          {/* — Location + Clock card — */}
          <BentoCard accentRgb="6,182,212" delay={0.1}>
            <div className="p-8 flex flex-col justify-between h-full min-h-[200px]">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span className="font-mono text-xs text-cyan-400/70 uppercase tracking-wider">Location</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg mb-1">Sri Lanka 🇱🇰</div>
                <div className="text-white/40 text-xs font-mono mb-4">UTC+5:30</div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-white/30" />
                  <LiveClock />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* — Fun fact card — */}
          <BentoCard accentRgb="236,72,153" delay={0.15}>
            <div className="p-8 flex flex-col justify-between h-full min-h-[180px]">
              <div className="flex items-center gap-3 mb-4">
                <Coffee className="h-4 w-4 text-pink-400" />
                <span className="font-mono text-xs text-pink-400/70 uppercase tracking-wider">Fun Fact</span>
              </div>
              <motion.div
                key={factIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-sm text-white/70 leading-relaxed flex-1 flex items-center"
              >
                &ldquo;{FUN_FACTS[factIdx]}&rdquo;
              </motion.div>
              <button
                onClick={() => setFactIdx((i) => (i + 1) % FUN_FACTS.length)}
                className="mt-4 self-start text-[10px] font-mono uppercase tracking-widest text-pink-400/60 hover:text-pink-400 transition-colors duration-200 cursor-pointer"
              >
                Next →
              </button>
            </div>
          </BentoCard>

          {/* — Currently building card (col-span 2) — */}
          <BentoCard accentRgb="245,158,11" delay={0.2} className="md:col-span-2">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)" }}
                >
                  <Rocket className="h-5 w-5 text-amber-400" />
                </div>
                <span className="font-mono text-xs text-amber-400/70 uppercase tracking-widest">Now Building</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Agentic AI support platform", desc: "LangGraph · RAG · Next.js" },
                  { label: "React Native cross-platform app", desc: "iOS · Android · TypeScript" },
                  { label: "This very portfolio", desc: "Next.js · Framer Motion · AI" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4"
                    style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: "#fbbf24", boxShadow: "0 0 6px rgba(245,158,11,0.6)" }}
                      />
                      <span className="text-sm text-white/80 font-medium">{item.label}</span>
                    </div>
                    <span className="text-[11px] font-mono text-white/30">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
