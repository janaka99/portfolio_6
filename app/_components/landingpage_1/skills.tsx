"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const TECH_STACK = [
  { name: "Next.js", icon: "N" },
  { name: "React", icon: "⚛" },
  { name: "TypeScript", icon: "TS" },
  { name: "Node.js", icon: "⬡" },
  { name: "Flutter", icon: "🐦" },
  { name: "Dart", icon: "◆" },
  { name: "Java", icon: "☕" },
  { name: "Python", icon: "🐍" },
  { name: "LangChain", icon: "🔗" },
  { name: "LangGraph", icon: "◈" },
  { name: "OpenAI", icon: "○" },
  { name: "Prisma", icon: "◆" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "MongoDB", icon: "◉" },
  { name: "Three.js", icon: "△" },
  { name: "Docker", icon: "🐳" },
  { name: "AWS", icon: "☁" },
  { name: "Vector DB", icon: "⬡" },
  { name: "RAG", icon: "◈" },
  { name: "Tailwind", icon: "〜" },
  { name: "Framer", icon: "▣" },
  { name: "Solidity", icon: "⬡" },
  { name: "GraphQL", icon: "◈" },
];

const CAPABILITIES = [
  {
    label: "01",
    title: "Agentic AI Systems",
    desc: "Production-grade autonomous agents built with Python, LangChain & LangGraph — RAG pipelines, multi-agent orchestration, and vector database integrations that solve real business problems.",
    accentColor: "rgba(139,92,246,1)",
    glowColor: "rgba(139,92,246,0.2)",
    borderColor: "rgba(139,92,246,0.2)",
    hoverBorderColor: "rgba(139,92,246,0.5)",
    tag: "Python · LangChain · LangGraph",
    tagStyle: { color: "#a78bfa", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" },
    bgGradient: "radial-gradient(ellipse at top left, rgba(139,92,246,0.08) 0%, transparent 60%)",
  },
  {
    label: "02",
    title: "Full-Stack Engineering",
    desc: "Next.js apps with sub-second load times, bulletproof auth, optimized DB schemas and REST + GraphQL APIs at scale.",
    accentColor: "rgba(6,182,212,1)",
    glowColor: "rgba(6,182,212,0.2)",
    borderColor: "rgba(6,182,212,0.2)",
    hoverBorderColor: "rgba(6,182,212,0.5)",
    tag: "Next.js · React · Node",
    tagStyle: { color: "#22d3ee", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)" },
    bgGradient: "radial-gradient(ellipse at top left, rgba(6,182,212,0.08) 0%, transparent 60%)",
  },
  {
    label: "03",
    title: "Mobile & Web3",
    desc: "Cross-platform apps with React Native and Flutter for iOS & Android, plus Solidity smart contracts with Web3.js and MetaMask.",
    accentColor: "rgba(236,72,153,1)",
    glowColor: "rgba(236,72,153,0.2)",
    borderColor: "rgba(236,72,153,0.2)",
    hoverBorderColor: "rgba(236,72,153,0.5)",
    tag: "Flutter · React Native · Web3",
    tagStyle: { color: "#f472b6", background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)" },
    bgGradient: "radial-gradient(ellipse at top left, rgba(236,72,153,0.08) 0%, transparent 60%)",
  },
  {
    label: "04",
    title: "3D & Interactive UI",
    desc: "Immersive interfaces with Three.js, React Three Fiber and Framer Motion — particle systems to physics-based animations.",
    accentColor: "rgba(245,158,11,1)",
    glowColor: "rgba(245,158,11,0.2)",
    borderColor: "rgba(245,158,11,0.2)",
    hoverBorderColor: "rgba(245,158,11,0.5)",
    tag: "Three.js · WebGL · R3F",
    tagStyle: { color: "#fbbf24", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" },
    bgGradient: "radial-gradient(ellipse at top left, rgba(245,158,11,0.08) 0%, transparent 60%)",
  },
];

/* ---------- 3D Tilt Glass Card ---------- */
function CapabilityCard({ cap, index }: { cap: (typeof CAPABILITIES)[0]; index: number }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, visible: false });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setRotateX(-dy * 10);
    setRotateY(dx * 10);
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: "900px" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="relative overflow-hidden rounded-2xl p-8 h-full cursor-default"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.15s ease, box-shadow 0.3s ease",
          transformStyle: "preserve-3d",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${cap.borderColor}`,
          boxShadow: glare.visible
            ? `0 16px 48px rgba(0,0,0,0.6), 0 4px 16px ${cap.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.15)`
            : `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)`,
        }}
      >
        {/* Gradient fill */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: cap.bgGradient }}
        />

        {/* Glare reflection */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-200"
          style={{
            opacity: glare.visible ? 1 : 0,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.1) 0%, transparent 55%)`,
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-6 right-6 h-px rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${cap.accentColor}, transparent)`, opacity: 0.5 }}
        />

        {/* Content — pushed forward with translateZ */}
        <div style={{ transform: "translateZ(24px)", position: "relative" }}>
          <div className="font-mono text-xs text-white/20 tracking-widest mb-6 uppercase">
            {cap.label}
          </div>

          {/* Accent dot */}
          <div
            className="h-2 w-2 rounded-full mb-4 shadow-lg"
            style={{ background: cap.accentColor, boxShadow: `0 0 12px ${cap.accentColor}` }}
          />

          <h3 className="text-2xl font-bold text-foreground tracking-tight mb-3">
            {cap.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            {cap.desc}
          </p>

          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-mono uppercase tracking-wider"
            style={cap.tagStyle}
          >
            {cap.tag}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Marquee({ items, reverse = false }: { items: typeof TECH_STACK; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-4">
      <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-4 whitespace-nowrap"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 35, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((tech, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2.5 px-4 py-2 text-xs font-mono uppercase tracking-wider text-white/40 hover:text-white/70 transition-colors duration-200 cursor-default rounded-full"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span className="text-sm">{tech.icon}</span>
            {tech.name}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function SkillsLP1() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="skills" ref={sectionRef} className="relative py-32 bg-[#050505] overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 left-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-violet-900/6 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-cyan-900/5 blur-[120px]" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-5">
            <span className="h-px w-8 bg-violet-500/60" />
            <span className="font-mono text-xs text-violet-400/70 uppercase tracking-[0.3em]">What I Build</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9] mb-6">
            Core
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Capabilities
            </span>
          </h2>
          <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
            From zero to production — designing, building and deploying at the
            intersection of AI intelligence and modern engineering.
          </p>
        </motion.div>

        {/* 3D Glass Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
          {CAPABILITIES.map((cap, i) => (
            <CapabilityCard key={i} cap={cap} index={i} />
          ))}
        </div>

        {/* Tech marquees */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-3"
        >
          <div className="font-mono text-[10px] text-center text-muted-foreground/40 uppercase tracking-[0.3em] mb-4">
            Tech Stack
          </div>
          <Marquee items={TECH_STACK.slice(0, 10)} />
          <Marquee items={TECH_STACK.slice(10)} reverse />
        </motion.div>
      </div>
    </section>
  );
}
