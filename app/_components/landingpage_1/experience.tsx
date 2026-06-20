"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Building2, Calendar, ChevronRight, Sparkles } from "lucide-react";

const EXPERIENCES = [
  {
    role: "Software Engineer",
    company: "Artslab Creatives",
    period: "Feb 2026 – Present",
    type: "Full-time",
    description:
      "Promoted to lead complex mobile and web development. Spearheading React Native and Flutter applications while driving AI integrations across enterprise platforms.",
    highlights: [
      "Led development & deployment of high-performance React Native mobile app",
      "Building cross-platform Flutter apps for iOS & Android",
      "Architected cross-platform iOS & Android solutions",
      "Integrated advanced LLM features into enterprise workflows",
    ],
    stack: ["React Native", "Flutter", "Dart", "TypeScript", "Next.js", "LLMs"],
    accent: "#10b981",
    accentRgb: "16,185,129",
    current: true,
  },
  {
    role: "Associate Software Engineer",
    company: "Artslab Creatives",
    period: "Jun 2024 – Jan 2026",
    type: "Full-time",
    description:
      "Led end-to-end AI-powered full-stack applications for enterprise clients. Pioneered Python-based LangChain & LangGraph integrations, built RAG chatbots, and shipped 3D web experiences.",
    highlights: [
      "Built AI agents with Python, LangChain & LangGraph for real-world automation",
      "Designed RAG pipelines with vector databases for semantic search",
      "Developed Three.js 3D interactive web experiences",
      "Deployed on AWS & GCP with CI/CD pipelines",
    ],
    stack: ["Python", "LangChain", "LangGraph", "Next.js", "PostgreSQL", "AWS", "GCP", "Vector DB"],
    accent: "#a855f7",
    accentRgb: "168,85,247",
    current: false,
  },
  {
    role: "Freelance Software Engineer",
    company: "Independent",
    period: "2021 – Present",
    type: "Contract",
    description:
      "Full-stack web and mobile projects spanning AI chatbots, Web3 integrations, Flutter apps, and Python-based LLM-powered tools.",
    highlights: [
      "Built & deployed full-stack apps using React, Node.js & Java",
      "Developed cross-platform mobile apps with React Native & Flutter",
      "Integrated Web3 & crypto payment systems with MetaMask",
      "Engineered AI chatbots using Python, RAG & vector databases",
    ],
    stack: ["Java", "Python", "React", "Flutter", "Dart", "Solidity", "GraphQL", "MongoDB"],
    accent: "#06b6d4",
    accentRgb: "6,182,212",
    current: false,
  },
];

function ExpCard({ exp, index }: { exp: (typeof EXPERIENCES)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-8 group"
    >
      {/* Timeline dot with ping */}
      <div className="absolute left-0 top-7 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.12 + 0.3, type: "spring", stiffness: 200 }}
          className="h-3 w-3 rounded-full ring-4 ring-[#050505] z-10"
          style={{
            background: exp.accent,
            boxShadow: `0 0 12px rgba(${exp.accentRgb},0.6)`,
          }}
        />
        {exp.current && (
          <div
            className="absolute h-5 w-5 rounded-full animate-ping opacity-25"
            style={{ background: exp.accent }}
          />
        )}
      </div>

      {/* Glass Card */}
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-500"
        style={{
          background: `rgba(255,255,255,0.03)`,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: `1px solid rgba(${exp.accentRgb},0.18)`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(${exp.accentRgb},0.08), inset 0 1px 0 rgba(255,255,255,0.07)`,
        }}
      >
        {/* Top accent line */}
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(${exp.accentRgb},0.8) 50%, transparent 100%)`,
          }}
        />

        {/* Subtle radial glow fill */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at top left, rgba(${exp.accentRgb},0.06) 0%, transparent 60%)`,
          }}
        />

        <div className="p-7">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-xl font-bold text-foreground tracking-tight">{exp.role}</h3>
                {exp.current && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                    style={{
                      color: "#10b981",
                      background: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.25)",
                    }}
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    Now
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                <span>{exp.company}</span>
                <span className="text-muted-foreground/30">·</span>
                <span
                  className="text-xs rounded-full px-2.5 py-0.5 font-mono"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {exp.type}
                </span>
              </div>
            </div>

            <div
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-mono text-muted-foreground/70 shrink-0"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Calendar className="h-3 w-3" />
              {exp.period}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground/80 leading-relaxed mb-5">{exp.description}</p>

          {/* Highlights */}
          <ul className="space-y-2 mb-6">
            {exp.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" style={{ color: exp.accent }} />
                <span className="text-muted-foreground/80">{h}</span>
              </li>
            ))}
          </ul>

          {/* Stack glass pills */}
          <div
            className="flex flex-wrap gap-1.5 pt-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            {exp.stack.map((s, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors duration-200"
                style={{
                  color: exp.accent,
                  background: `rgba(${exp.accentRgb},0.08)`,
                  border: `1px solid rgba(${exp.accentRgb},0.2)`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExperienceLP1() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="relative py-32 bg-[#050505] overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-1/3 h-[500px] w-[400px] rounded-full bg-violet-900/5 blur-[120px]" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-5">
            <span className="h-px w-8 bg-emerald-500/60" />
            <span className="font-mono text-xs text-emerald-400/70 uppercase tracking-[0.3em]">Career Journey</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
            Experience
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg text-lg leading-relaxed">
            My path through the tech industry — shipping AI-powered products, mobile apps, and 3D web experiences.
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Animated line */}
          <div className="absolute left-[4px] top-0 bottom-0 w-px bg-white/5">
            <motion.div
              className="w-full origin-top rounded-full"
              style={{
                height: lineHeight,
                background: "linear-gradient(to bottom, #10b981, #a855f7, #06b6d4)",
                boxShadow: "0 0 8px rgba(168,85,247,0.4)",
              }}
            />
          </div>

          <div className="space-y-10">
            {EXPERIENCES.map((exp, i) => (
              <ExpCard key={i} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
