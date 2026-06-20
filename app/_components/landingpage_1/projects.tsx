"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface ProjectCardData {
  title: string;
  desc: string;
  image: string;
  techstack: string[];
  git: string;
  link: string | null;
  category: string;
}

const CATEGORIES = ["All", "AI", "Full-Stack", "Mobile", "Web3"];

const FALLBACK_PROJECTS: ProjectCardData[] = [
  {
    title: "Agentic Support Platform",
    desc: "Multi-agent customer support system with RAG, ticket routing, and real-time escalation using LangGraph.",
    image: "",
    techstack: ["Next.js", "LangGraph", "PostgreSQL", "Vector DB"],
    git: "https://github.com/janaka99",
    link: null,
    category: "AI",
  },
  {
    title: "Portfolio OS",
    desc: "Interactive portfolio styled as a dark-theme operating system with 3D scenes powered by React Three Fiber.",
    image: "",
    techstack: ["Next.js", "Three.js", "Framer Motion", "Prisma"],
    git: "https://github.com/janaka99",
    link: "#",
    category: "Full-Stack",
  },
  {
    title: "RAG Document Intelligence",
    desc: "Upload PDFs, ask questions. Semantic chunking with Astra DB vector search and streaming LLM responses.",
    image: "",
    techstack: ["Python", "LangChain", "Astra DB", "OpenAI"],
    git: "https://github.com/janaka99",
    link: null,
    category: "AI",
  },
];

const CAT_STYLES: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  AI:           { color: "#a78bfa", bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.25)", glow: "rgba(139,92,246,0.3)" },
  "Full-Stack": { color: "#22d3ee", bg: "rgba(6,182,212,0.1)",   border: "rgba(6,182,212,0.25)",  glow: "rgba(6,182,212,0.3)"  },
  Mobile:       { color: "#f472b6", bg: "rgba(236,72,153,0.1)",  border: "rgba(236,72,153,0.25)", glow: "rgba(236,72,153,0.3)" },
  Web3:         { color: "#fbbf24", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)", glow: "rgba(245,158,11,0.3)" },
};
const DEFAULT_CAT_STYLE = { color: "#a1a1aa", bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.1)", glow: "rgba(255,255,255,0.1)" };

/* ---------- 3D Glass Project Card ---------- */
function ProjectCard({ project, index }: { project: ProjectCardData; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const catStyle = CAT_STYLES[project.category] ?? DEFAULT_CAT_STYLE;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setRotateX(-dy * 7);
    setRotateY(dx * 7);
    setGlare({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };
  const onMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.96 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      layout
      style={{ perspective: "900px" }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="relative overflow-hidden rounded-2xl cursor-pointer h-full"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.15s ease, box-shadow 0.3s ease",
          transformStyle: "preserve-3d",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${hovered ? catStyle.border : "rgba(255,255,255,0.08)"}`,
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.7), 0 4px 20px ${catStyle.glow}, inset 0 1px 0 rgba(255,255,255,0.12)`
            : "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Glare */}
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-200"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          }}
        />

        {/* Image area */}
        <div
          className="relative h-52 overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Gradient placeholder */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    radial-gradient(ellipse at 30% 50%, ${catStyle.glow} 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.2) 0%, transparent 50%)
                  `,
                }}
              />
              {/* Subtle grid on image */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <span className="font-black text-7xl select-none" style={{ color: `${catStyle.color}10` }}>
                {project.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}

          {/* Hover action overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center gap-4 z-10"
            style={{ background: "rgba(5,5,5,0.75)", backdropFilter: "blur(8px)" }}
          >
            {project.link && (
              <Link href={project.link} target="_blank" rel="noopener noreferrer">
                <motion.div
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-black cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.95)" }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Live Demo
                </motion.div>
              </Link>
            )}
            {project.git && (
              <Link href={project.git} target="_blank" rel="noopener noreferrer">
                <motion.div
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Github className="h-3.5 w-3.5" />
                  Code
                </motion.div>
              </Link>
            )}
          </motion.div>

          {/* Category badge */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider"
              style={{
                color: catStyle.color,
                background: catStyle.bg,
                border: `1px solid ${catStyle.border}`,
                backdropFilter: "blur(8px)",
              }}
            >
              {project.category}
            </span>
          </div>
        </div>

        {/* Card body (elevated with translateZ) */}
        <div className="p-6" style={{ transform: "translateZ(16px)" }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-lg font-bold text-foreground tracking-tight leading-snug">
              {project.title}
            </h3>
            <motion.div animate={{ x: hovered ? 3 : 0, y: hovered ? -3 : 0 }} transition={{ duration: 0.2 }}>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground/30 shrink-0" />
            </motion.div>
          </div>

          <p className="text-sm text-muted-foreground/80 leading-relaxed mb-5">{project.desc}</p>

          <div className="flex flex-wrap gap-1.5">
            {project.techstack.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-white/40 rounded-md"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {tech}
              </span>
            ))}
            {project.techstack.length > 4 && (
              <span className="px-2 py-0.5 font-mono text-[10px] text-white/30 rounded-md" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                +{project.techstack.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsLP1({ dbProjects }: { dbProjects: ProjectCardData[] }) {
  const projects = dbProjects.length > 0 ? dbProjects : FALLBACK_PROJECTS;
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-32 bg-[#050505] overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[700px] bg-violet-900/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-5">
            <span className="h-px w-8 bg-pink-500/60" />
            <span className="font-mono text-xs text-pink-400/70 uppercase tracking-[0.3em]">Selected Work</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
              Projects
              <br />
              <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">That Ship.</span>
            </h2>

            {/* Glass filter pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setActiveCategory(cat)}
                  className="rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer"
                  style={
                    activeCategory === cat
                      ? {
                          color: "#a78bfa",
                          background: "rgba(139,92,246,0.12)",
                          border: "1px solid rgba(139,92,246,0.4)",
                          backdropFilter: "blur(8px)",
                          boxShadow: "0 0 12px rgba(139,92,246,0.2)",
                        }
                      : {
                          color: "rgba(161,161,170,0.7)",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          backdropFilter: "blur(8px)",
                        }
                  }
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-muted-foreground/50 font-mono text-sm"
          >
            No projects in this category yet.
          </motion.div>
        )}
      </div>
    </section>
  );
}
