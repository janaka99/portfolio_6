"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Archive } from "lucide-react";
import Link from "next/link";
import { AI_PROJECTS, PROJECTS } from "@/data/projects/projects";

/* ---------- Merged archived project type ---------- */
interface ArchivedProject {
  title: string;
  name: string;
  desc: string;
  git: string;
  link: string | null;
  techstack: string[];
  badge?: string;
}

const ALL_ARCHIVED: ArchivedProject[] = [
  // AI project from old data
  // {
  //   name: "Concise AI",
  //   title: "AI PDF Summarizer",
  //   desc: "Summarize PDFs using Gemini & Vercel AI SDK. Upload, ask, get instant intelligent summaries.",
  //   link: "https://conciseai-one.vercel.app/",
  //   git: "https://github.com/janaka99/AI-PDF-summarizer",
  //   techstack: ["Next.js", "Gemini", "Vercel AI SDK", "Clerk", "Upload Thing"],
  //   badge: "AI",
  // },
  // Static projects from PROJECTS
  ...PROJECTS.map((p) => ({
    name: p.name ?? "",
    title: p.title,
    desc: p.desc,
    link: (p as { link?: string | null }).link ?? null,
    git: p.git,
    techstack: p.techstack,
  })),
];

/* ---------- Tag color helper ---------- */
const TAG_COLOR: Record<string, { color: string; bg: string; border: string }> =
  {
    AI: {
      color: "#a78bfa",
      bg: "rgba(139,92,246,0.1)",
      border: "rgba(139,92,246,0.25)",
    },
    "Next.js": {
      color: "#22d3ee",
      bg: "rgba(6,182,212,0.08)",
      border: "rgba(6,182,212,0.2)",
    },
    React: {
      color: "#61dafb",
      bg: "rgba(97,218,251,0.08)",
      border: "rgba(97,218,251,0.2)",
    },
    Solidity: {
      color: "#fbbf24",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
    },
  };
const defaultTag = {
  color: "rgba(255,255,255,0.4)",
  bg: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.1)",
};

/* ---------- 3D Glass Archive Card ---------- */
function ArchiveCard({
  project,
  index,
}: {
  project: ArchivedProject;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setRotateX(-dy * 7);
    setRotateY(dx * 7);
    setGlare({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: "900px" }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setRotateX(0);
        setRotateY(0);
      }}
    >
      <div
        className="relative overflow-hidden rounded-2xl h-full flex flex-col cursor-default"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.15s ease, box-shadow 0.3s ease",
          transformStyle: "preserve-3d",
          background: "rgba(255,255,255,0.025)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: hovered
            ? "1px solid rgba(139,92,246,0.25)"
            : "1px solid rgba(255,255,255,0.07)",
          boxShadow: hovered
            ? "0 16px 48px rgba(0,0,0,0.6), 0 4px 16px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.1)"
            : "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Top accent */}
        <div
          className="absolute top-0 left-6 right-6 h-px transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)",
            opacity: hovered ? 1 : 0.3,
          }}
        />

        {/* Glare */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-200"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.07) 0%, transparent 55%)`,
          }}
        />

        {/* Content elevated */}
        <div
          className="relative flex flex-col h-full p-6"
          style={{ transform: "translateZ(14px)" }}
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              {project.badge && (
                <span
                  className="inline-block mb-2 rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                  style={TAG_COLOR.AI}
                >
                  {project.badge}
                </span>
              )}
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">
                {project.name}
              </div>
              <h3 className="text-base font-bold text-foreground leading-snug">
                {project.title}
              </h3>
            </div>
            {/* Link icons */}
            <div className="flex items-center gap-1.5 shrink-0 mt-1">
              {project.link && (
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, y: -1 }}
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-white/30 hover:text-violet-400 transition-colors duration-200 cursor-pointer"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </motion.div>
                </Link>
              )}
              <Link
                href={project.git}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.15, y: -1 }}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-white/30 hover:text-violet-400 transition-colors duration-200 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Github className="h-3 w-3" />
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground/60 leading-relaxed mb-5 flex-1">
            {project.desc}
          </p>

          {/* Tech tags */}
          <div
            className="flex flex-wrap gap-1.5 pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            {project.techstack.map((tech, i) => {
              const style = TAG_COLOR[tech] ?? defaultTag;
              return (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md font-mono text-[9px] uppercase tracking-wider"
                  style={{
                    color: style.color,
                    background: style.bg,
                    border: `1px solid ${style.border}`,
                  }}
                >
                  {tech}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ArchivedLP1() {
  const [expanded, setExpanded] = useState(false);
  const VISIBLE = 6;
  const shown = expanded ? ALL_ARCHIVED : ALL_ARCHIVED.slice(0, VISIBLE);

  return (
    <section
      id="archived"
      className="relative py-32 bg-[#050505] overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/2 right-0 h-[500px] w-[400px] -translate-y-1/2 rounded-full bg-amber-900/4 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-0 h-[400px] w-[300px] -translate-y-1/2 rounded-full bg-violet-900/4 blur-[100px]" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <div className="flex items-center gap-4 mb-5">
            <span className="h-px w-8 bg-amber-500/60" />
            <span className="font-mono text-xs text-amber-400/70 uppercase tracking-[0.3em]">
              Earlier Work
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
                Archived
                <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                  Work.
                </span>
              </h2>
              <p className="text-muted-foreground mt-4 max-w-lg text-lg leading-relaxed">
                Earlier projects that shaped the engineer I am today — from
                e-commerce shops to AI integrations.
              </p>
            </div>

            {/* Stats badge */}
            <div
              className="inline-flex items-center gap-3 rounded-2xl px-5 py-3 shrink-0"
              style={{
                background: "rgba(245,158,11,0.06)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(245,158,11,0.18)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              <Archive className="h-4 w-4 text-amber-400" />
              <div>
                <div className="text-lg font-black text-white">
                  {ALL_ARCHIVED.length}
                </div>
                <div className="text-[10px] font-mono text-amber-400/60 uppercase tracking-wider">
                  Projects
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Horizontal rule */}
        <div
          className="h-px w-full mb-12"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)",
          }}
        />

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map((project, i) => (
            <ArchiveCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* Show more / less */}
        {ALL_ARCHIVED.length > VISIBLE && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-mono uppercase tracking-wider text-white/60 hover:text-white transition-all duration-200 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {expanded
                ? "Show Less ↑"
                : `Show All ${ALL_ARCHIVED.length} Projects ↓`}
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
