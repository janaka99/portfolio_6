"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import Image from "next/image";
import { AI_PROJECTS, PROJECTS } from "@/data/projects/projects";

export default function Projects() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section
      id="projects"
      className="py-32 bg-background relative"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-foreground tracking-tight">
            Selected Work
          </h2>
          <div className="w-20 h-1 bg-primary mb-6" />
          <p className="text-xl text-muted-foreground max-w-2xl">
            A showcase of my recent endeavors, AI integrations, and full-stack applications.
          </p>
        </motion.div>

        {/* NEW RECENT PROJECTS PLACEHOLDER */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-3xl font-semibold text-foreground tracking-tight">
              Recent Projects
            </h3>
            <Badge variant="outline" className="border-primary text-primary">New</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Placeholder 1 */}
            <motion.div variants={item}>
              <Card className="overflow-hidden border-border bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-500 h-full flex flex-col group cursor-none">
                <div className="relative h-64 overflow-hidden bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground font-mono text-sm uppercase tracking-widest group-hover:scale-110 transition-transform duration-500">Coming Soon</span>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">Project Alpha</CardTitle>
                  <CardDescription className="text-muted-foreground mb-6 flex-grow">
                    A next-generation application currently in development. Focusing on high performance and seamless user experience.
                  </CardDescription>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-mono text-xs">Next.js</Badge>
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-mono text-xs">AI</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
             {/* Placeholder 2 */}
             <motion.div variants={item}>
              <Card className="overflow-hidden border-border bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-500 h-full flex flex-col group cursor-none">
                <div className="relative h-64 overflow-hidden bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground font-mono text-sm uppercase tracking-widest group-hover:scale-110 transition-transform duration-500">In Progress</span>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">Project Beta</CardTitle>
                  <CardDescription className="text-muted-foreground mb-6 flex-grow">
                    An intelligent dashboard for data analytics and automated insights.
                  </CardDescription>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-mono text-xs">React</Badge>
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-mono text-xs">Python</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* AI PROJECTS */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <div className="mb-10">
            <h3 className="text-3xl font-semibold mb-3 text-foreground tracking-tight flex items-center gap-3">
              AI Agent-Driven <Sparkles className="w-6 h-6 text-primary" />
            </h3>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              Smart applications built using LangChain, OpenAI, Gemini, and Ollama.
              These projects showcase intelligent agents, tool integrations, and automated workflows designed for real-world tasks.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AI_PROJECTS.map((project, index) => (
              <ProjectCard key={index} project={project} variants={item} />
            ))}
          </div>
        </motion.div>

        {/* OTHER PROJECTS */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="mb-10">
            <h3 className="text-3xl font-semibold mb-3 text-foreground tracking-tight">
              Archived Work
            </h3>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              Earlier projects that helped shape my development journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project, index) => (
              <ProjectCard key={index} project={project} variants={item} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface Project {
  title: string;
  desc: string;
  image?: string;
  techstack: string[];
  category?: string;
  git: string;
  link: string | null;
}

function ProjectCard({
  project,
  variants,
}: {
  project: Project;
  variants: any;
}) {
  return (
    <motion.div variants={variants} className="h-full">
      <Card className="overflow-hidden border-border bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-500 h-full flex flex-col group cursor-none">
        {project.image && (
          <div className="relative h-56 overflow-hidden">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              width={500}
              height={500}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
            {project.category === "ai" && (
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground p-1.5 rounded flex items-center gap-1.5 shadow-lg backdrop-blur-md border border-white/10">
                <Sparkles className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">AI Integration</span>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col flex-grow p-6">
          <div className="mb-4">
            <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors tracking-tight">{project.title}</CardTitle>
            <CardDescription className="text-muted-foreground leading-relaxed">{project.desc}</CardDescription>
          </div>
          <div className="flex-grow flex items-end mb-6">
            <div className="flex flex-wrap gap-2">
              {project.techstack.map((tag: any, idx: any) => (
                <Badge key={idx} variant="secondary" className="bg-secondary/50 hover:bg-secondary text-secondary-foreground font-mono text-[10px] uppercase tracking-wider">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-auto pt-4 border-t border-border/50">
            {project.link && (
              <Button size="sm" asChild className="cursor-none flex-1 rounded-none bg-primary text-primary-foreground hover:bg-primary/90">
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" /> Live Demo
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="cursor-none flex-1 rounded-none border-border hover:border-primary hover:text-primary transition-colors"
            >
              <a href={project.git} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" /> Repository
              </a>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
