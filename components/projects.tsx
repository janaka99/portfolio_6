"use client";

import { useState } from "react";
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

const projects = [
  {
    title: "AI Image Generator",
    description:
      "A web application that uses AI to generate images from text descriptions.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Next.js", "OpenAI API", "Tailwind CSS", "TypeScript"],
    category: "ai",
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    title: "Smart Chatbot Platform",
    description:
      "An intelligent chatbot platform with natural language processing capabilities.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["React", "LangChain", "Node.js", "MongoDB"],
    category: "ai",
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    title: "AI Content Summarizer",
    description:
      "Tool that uses AI to automatically summarize long articles and documents.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Next.js", "Hugging Face", "Tailwind CSS", "FastAPI"],
    category: "ai",
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    title: "E-commerce Dashboard",
    description:
      "A comprehensive dashboard for e-commerce analytics and management.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["React", "Redux", "Chart.js", "Firebase"],
    category: "frontend",
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    title: "Portfolio Template",
    description:
      "A customizable portfolio template for developers and designers.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
    category: "frontend",
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    title: "Recommendation Engine",
    description:
      "AI-powered recommendation system for personalized content delivery.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Python", "TensorFlow", "FastAPI", "React"],
    category: "ai",
    github: "https://github.com",
    demo: "https://demo.com",
  },
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((project) => project.category === activeTab);

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} variants={item} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  github: string;
  demo: string;
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
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          {project.category === "ai" && (
            <div className="absolute top-2 right-2 bg-purple-500 text-white p-1 rounded-md flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span className="text-xs font-medium">AI Project</span>
            </div>
          )}
        </div>
        <CardHeader className="p-4">
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag: any, idx: any) => (
              <Badge key={idx} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-1" /> Code
            </a>
          </Button>
          <Button size="sm" asChild>
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" /> Demo
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
