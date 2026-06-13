"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Building2, Calendar, ChevronRight } from "lucide-react";

const experiences = [
  {
    title: "Software Engineer",
    company: "Artslab Creatives",
    period: "Feb 2026 – Present",
    description:
      "Promoted to Software Engineer to lead complex mobile and web application development. Spearheaded a major cross-platform mobile application using React Native while continuing to drive innovation through AI integrations.",
    achievements: [
      "Led the development and successful deployment of a high-performance React Native mobile application",
      "Architected cross-platform mobile solutions ensuring seamless user experiences on iOS and Android",
      "Mentored junior developers and established best practices for React Native development",
      "Continued integration of advanced LLM features and intelligent workflows into enterprise platforms",
    ],
    skills: ["React Native", "TypeScript", "Mobile App Development", "Next.js", "LLMs", "React"],
    accent: "from-emerald-500 to-teal-500",
    dot: "bg-emerald-500",
  },
  {
    title: "Associate Software Engineer",
    company: "Artslab Creatives",
    period: "June 2024 – Jan 2026",
    description:
      "Leading end-to-end development of full-stack, AI-powered applications for enterprise clients. Spearheading the integration of Large Language Models (LLMs) into web platforms, ensuring robust performance, scalability, and security.",
    achievements: [
      "Integrated Generative AI & LLMs to build next-generation applications",
      "Built RAG chatbots using LLMs and vector databases for real-time intelligent responses",
      "Developed and maintained databases with security and scalability focus",
      "Worked with Three.js to create interactive 3D web experiences",
      "Contributed to RESTful API design and implementation",
      "Engaged in CI/CD, cloud technologies (AWS and GCP)",
    ],
    skills: ["Next.js", "PostgreSQL", "MongoDB", "LLMs", "Vector DB", "Node.js", "AWS", "GCP", "React"],
    accent: "from-purple-500 to-pink-500",
    dot: "bg-purple-500",
  },
  {
    title: "Freelance Software Engineer",
    company: "Independent",
    period: "2021 – Present",
    description:
      "Worked independently on a wide range of full-stack web and mobile projects. Designed and developed smart systems leveraging LLMs, including intelligent route suggestion engines and AI chatbots using RAG techniques and vector databases.",
    achievements: [
      "Built and deployed full-stack apps using React.js and Node.js",
      "Developed cross-platform mobile apps with React Native",
      "Integrated Web3 & crypto payment systems using Web3.js and MetaMask",
      "Engineered LLM-powered route suggestion platforms and AI chatbots",
      "Designed and audited smart contracts for payments and NFT-based access",
    ],
    skills: ["React", "TypeScript", "React Native", "Solidity", "Next.js", "GraphQL", "MongoDB", "MySQL"],
    accent: "from-cyan-500 to-blue-500",
    dot: "bg-cyan-500",
  },
];

function ExperienceCardV2({ exp, index }: { exp: (typeof experiences)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      {/* Card */}
      <div className="relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden hover:border-border/70 transition-all duration-500 hover:shadow-xl hover:shadow-black/20">
        {/* Accent top bar */}
        <div className={`h-0.5 bg-gradient-to-r ${exp.accent}`} />

        {/* Inner glow on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${exp.accent} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none`} />

        <div className="p-7">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
            <div>
              <h3 className="text-xl font-bold text-foreground tracking-tight mb-1.5">
                {exp.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span>{exp.company}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-muted/40 border border-border/40 rounded-full px-3 py-1.5 text-xs text-muted-foreground font-mono shrink-0">
              <Calendar className="h-3 w-3" />
              {exp.period}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {exp.description}
          </p>

          {/* Achievements */}
          <div className="space-y-2 mb-6">
            {exp.achievements.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm">
                <ChevronRight className={`h-4 w-4 shrink-0 mt-0.5 bg-gradient-to-r ${exp.accent} bg-clip-text`}
                  style={{ color: index === 0 ? "#a855f7" : "#06b6d4" }}
                />
                <span className="text-muted-foreground">{a}</span>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 pt-5 border-t border-border/30">
            {exp.skills.map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg border border-border/50 bg-muted/30 font-mono text-[11px] text-muted-foreground uppercase tracking-wider hover:border-border transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExperienceV2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end end"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="py-28 bg-[#050505] relative overflow-hidden">
      {/* Bg gradient */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none" />

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
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Career</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
            Experience
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg">
            My journey through the tech industry, specializing in AI, full-stack, and 3D web.
          </p>
        </motion.div>

        {/* Timeline (desktop: 2-col, mobile: single) */}
        <div ref={containerRef} className="relative">
          {/* Centre line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border/20 -translate-x-1/2">
            <motion.div
              className="w-full bg-gradient-to-b from-purple-500 to-cyan-500 origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="hidden md:block space-y-16">
            {experiences.map((exp, index) => (
              <div key={index} className="relative flex items-center">
                {index % 2 === 0 ? (
                  <>
                    <div className="w-1/2 pr-12">
                      <ExperienceCardV2 exp={exp} index={index} />
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className={`h-5 w-5 rounded-full ${exp.dot} shadow-lg ring-4 ring-background`}
                      />
                    </div>
                    <div className="w-1/2" />
                  </>
                ) : (
                  <>
                    <div className="w-1/2" />
                    <div className="absolute left-1/2 -translate-x-1/2 z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className={`h-5 w-5 rounded-full ${exp.dot} shadow-lg ring-4 ring-background`}
                      />
                    </div>
                    <div className="w-1/2 pl-12">
                      <ExperienceCardV2 exp={exp} index={index} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: single column */}
          <div className="md:hidden space-y-6">
            {experiences.map((exp, index) => (
              <ExperienceCardV2 key={index} exp={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
