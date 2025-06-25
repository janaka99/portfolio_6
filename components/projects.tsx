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
import Container from "./layouts/container";
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
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-b from-background via-background/95 to-background"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-custom-dark-blue">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Showcasing my expertise in AI integration and full-stack development
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <p className="text-2xl font-semibold mb-3">
            AI Agent-Driven Projects
          </p>
          <p className="text-gray-600 max-w-3xl mb-10">
            Smart applications built using <strong>LangChain</strong>,{" "}
            <strong>OpenAI</strong>, <strong>Gemini</strong>,{" "}
            <strong>Ollama</strong>, and other powerful <strong>LLMs</strong>.
            These projects showcase <strong>intelligent agents</strong>,{" "}
            <strong>tool integrations</strong>, and{" "}
            <strong>automated workflows</strong> designed for real-world tasks.
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {AI_PROJECTS.map((project, index) => (
            <ProjectCard key={index} project={project} variants={item} />
          ))}
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-20"
        >
          <p className="text-2xl font-semibold mb-3">Other projects</p>
          <p className="text-gray-600 max-w-3xl mb-10">
            Some other projects. I have done in the past.
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {PROJECTS.map((project, index) => (
            <ProjectCard key={index} project={project} variants={item} />
          ))}
        </motion.div>
      </Container>
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
    <motion.div variants={variants}>
      <Card className="overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {project.image && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              width={500}
              height={500}
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
            {project.category === "ai" && (
              <div className="absolute top-2 right-2 bg-purple-500 text-white p-1 rounded-md flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span className="text-xs font-medium">AI Project</span>
              </div>
            )}
          </div>
        )}
        <div className="">
          <CardHeader className="p-4">
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.desc}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex-grow">
            <div className="flex flex-wrap gap-2">
              {project.techstack.map((tag: any, idx: any) => (
                <Badge key={idx} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex gap-2 justify-between">
            <Button size="sm" asChild className="cursor-pointer">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-1" /> Demo
                </a>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="cursor-pointer"
            >
              <a href={project.git} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-1" /> Code
              </a>
            </Button>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}
