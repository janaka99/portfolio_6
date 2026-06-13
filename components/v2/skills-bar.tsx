"use client";

import { motion } from "framer-motion";
import { Brain, Code, Smartphone, Zap, Sparkles } from "lucide-react";
import TiltCard from "./tilt-card";

const TECH_MARQUEE = [
  "Next.js", "React", "TypeScript", "Node.js", "LangChain", "LangGraph",
  "OpenAI", "Prisma", "PostgreSQL", "MongoDB", "Three.js", "Python",
  "Docker", "AWS", "GCP", "GraphQL", "Tailwind", "Framer Motion",
  "Vercel AI SDK", "RAG", "Vector DB", "React Native",
];

const SPECIALIZATIONS = [
  {
    title: "AI Integration",
    icon: Brain,
    accent: "from-purple-500/20 to-pink-500/10",
    border: "border-purple-500/20 hover:border-purple-500/50",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    glowColor: "shadow-purple-900/20",
    highlights: [
      "LangChain & LangGraph agents",
      "Retrieval-Augmented Generation",
      "LLM tool integrations",
      "Agentic AI systems",
    ],
  },
  {
    title: "Full-Stack Dev",
    icon: Code,
    accent: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/20 hover:border-cyan-500/50",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    glowColor: "shadow-cyan-900/20",
    highlights: [
      "Next.js & React applications",
      "REST APIs & authentication",
      "Database design & optimization",
      "Performance-first architecture",
    ],
  },
  {
    title: "Mobile & Web3",
    icon: Smartphone,
    accent: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/20 hover:border-pink-500/50",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-400",
    glowColor: "shadow-pink-900/20",
    highlights: [
      "React Native cross-platform",
      "Solidity smart contracts",
      "Web3.js & MetaMask integration",
      "Mobile-first design",
    ],
  },
];

function MarqueeTicker() {
  return (
    <div className="relative overflow-hidden py-5 border-y border-border/30">
      {/* Left fade */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {[...TECH_MARQUEE, ...TECH_MARQUEE].map((tech, i) => (
          <span
            key={i}
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground/50 flex items-center gap-2"
          >
            <span className="h-1 w-1 rounded-full bg-purple-500/50" />
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function SkillsBar() {
  return (
    <section id="skills" className="py-28 bg-[#050505] relative overflow-hidden">
      {/* Subtle bg glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/50" />
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">What I Do</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
            Specializations
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg">
            Crafting intelligent, interactive experiences at the intersection of AI and engineering.
          </p>
        </motion.div>

        {/* Tech marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <MarqueeTicker />
        </motion.div>

        {/* 3D Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SPECIALIZATIONS.map((spec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard
                className={`h-full rounded-2xl border ${spec.border} bg-card/30 backdrop-blur-sm shadow-xl ${spec.glowColor} transition-colors duration-300`}
                intensity={8}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${spec.accent} opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500`} />
                <div className="p-7 flex flex-col h-full">
                  {/* Icon + sparkle */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3.5 rounded-xl ${spec.iconBg} border border-white/5`}>
                      <spec.icon className={`h-6 w-6 ${spec.iconColor}`} />
                    </div>
                    <Sparkles className="h-4 w-4 text-muted-foreground/30" />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-5 tracking-tight">
                    {spec.title}
                  </h3>

                  <ul className="space-y-3 mt-auto">
                    {spec.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Zap className={`h-3 w-3 shrink-0 ${spec.iconColor}`} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
