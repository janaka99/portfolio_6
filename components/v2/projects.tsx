"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Sparkles, Code2 } from "lucide-react";
import Image from "next/image";
import { PROJECTS } from "@/data/projects/projects";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  title: string;
  desc: string;
  image?: string;
  techstack: string[];
  git: string;
  link: string | null;
  category?: string;
  imageIncluded?: boolean;
}

// ─── Individual Project Card ──────────────────────────────────────────────────

function ProjectCard({
  project,
  isAI,
  imageIncluded = true,
}: {
  project: Project;
  isAI?: boolean;
  imageIncluded?: boolean;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-900/10 h-full"
    >
      {/* Top glow line on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/0 to-transparent group-hover:via-purple-500/60 transition-all duration-500 z-10" />

      {/* Image */}
      {imageIncluded && (
        <div className="relative h-52 overflow-hidden bg-muted/30 shrink-0">
          {project.image ? (
            <>
              <Image
                src={project.image}
                alt={project.title}
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Code2 className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                <span className="font-mono text-xs text-muted-foreground/40 uppercase tracking-widest">
                  no preview
                </span>
              </div>
              {/* Subtle grid bg */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(168,85,247,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.8) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>
          )}

          {/* AI badge */}
          {isAI && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-purple-500/40 rounded-full px-2.5 py-1">
              <Sparkles className="h-3 w-3 text-purple-400" />
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                AI
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-bold text-foreground mb-2 tracking-tight group-hover:text-purple-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
          {project.desc}
        </p>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techstack.slice(0, 5).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md border border-border/40 bg-muted/30 font-mono text-[10px] text-muted-foreground uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
          {project.techstack.length > 5 && (
            <span className="px-2 py-0.5 rounded-md border border-border/40 bg-muted/30 font-mono text-[10px] text-muted-foreground">
              +{project.techstack.length - 5}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto pt-4 border-t border-border/30">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 h-9 rounded-xl bg-purple-600/90 hover:bg-purple-500 text-white text-xs font-medium transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Demo
            </a>
          )}
          <a
            href={project.git}
            target="_blank"
            rel="noopener noreferrer"
            className={`${project.link ? "" : "flex-1"} flex items-center justify-center gap-2 h-9 px-4 rounded-xl border border-border/60 hover:border-purple-500/50 text-muted-foreground hover:text-foreground text-xs font-medium transition-all`}
          >
            <Github className="h-3.5 w-3.5" />
            {!project.link && "Repository"}
          </a>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Main Projects Section ────────────────────────────────────────────────────
export default function ProjectsV2({ dbProjects }: { dbProjects: Project[] }) {
  const webProjects = PROJECTS as Project[];

  return (
    <section
      id="projects"
      className="py-28 bg-[#050505] relative overflow-hidden"
    >
      {/* Background radial */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Selected Work (AI Projects) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/50" />
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              Portfolio
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
            Selected Work
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg">
            Smart applications built using LangChain, OpenAI, Gemini, and
            Ollama. Showcase of intelligent agents, tool integrations, and
            automated workflows.
          </p>
        </motion.div>

        {/* AI Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {dbProjects.map((project, i) => (
            <ProjectCard key={`ai-${i}`} project={project} isAI={true} />
          ))}
          {dbProjects.length === 0 && (
            <div className="col-span-full py-10 text-center text-muted-foreground font-mono text-sm">
              &gt; No AI projects found.
            </div>
          )}
        </div>

        {/* Archived / Old Projects */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/50" />
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              Archive
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground">
            Archived Work
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg">
            Earlier projects that helped shape my development journey, before AI
            took over.
          </p>
        </motion.div>

        {/* Archived Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {webProjects.map((project, i) => (
            <ProjectCard
              key={`web-${i}`}
              project={project}
              isAI={false}
              imageIncluded={false}
            />
          ))}
          {webProjects.length === 0 && (
            <div className="col-span-full py-10 text-center text-muted-foreground font-mono text-sm">
              &gt; No archived projects found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
