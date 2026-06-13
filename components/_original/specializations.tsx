"use client";

import { motion } from "framer-motion";
import { Brain, Code, Rocket, Smartphone, Sparkles, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const specializations = [
  {
    title: "AI Integration",
    description:
      "Seamlessly integrating artificial intelligence into applications to create intelligent, adaptive user experiences that solve real-world problems.",
    icon: <Brain className="h-8 w-8" />,
    color: "from-primary/20 to-transparent",
    iconColor: "text-primary",
    highlights: [
      "Natural Language Processing",
      "Generative AI & LLMs",
      "Retrieval-Augmented Generation",
      "Agentic AI Solutions",
    ],
  },
  {
    title: "Full-Stack Development",
    description:
      "Building scalable, high-performance web applications from front-end to back-end with a focus on modern architecture and seamless UX.",
    icon: <Code className="h-8 w-8" />,
    color: "from-primary/20 to-transparent",
    iconColor: "text-foreground",
    highlights: [
      "User-Centered Architecture",
      "Performance & Scalability",
      "REST APIs & Authentication",
      "Database Optimization",
    ],
  },
  {
    title: "Mobile Applications",
    description:
      "Creating cross-platform mobile experiences that are responsive, performant, and tailored for user engagement on the go.",
    icon: <Smartphone className="h-8 w-8" />,
    color: "from-primary/20 to-transparent",
    iconColor: "text-muted-foreground",
    highlights: [
      "Cross-Platform Experiences",
      "Real-Time Engagement",
      "Mobile Accessibility",
      "User Retention Strategies",
    ],
  },
];

export default function Specializations() {
  return (
    <section
      id="specializations"
      className="py-32 bg-background relative overflow-hidden"
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
            Specializations
          </h2>
          <div className="w-20 h-1 bg-primary mb-6" />
          <p className="text-xl text-muted-foreground max-w-2xl">
            Focused on creating intelligent, interactive experiences at the
            intersection of AI and design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specializations.map((specialization, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="h-full"
            >
              <Card className="h-full bg-card/40 backdrop-blur-md border-border hover:border-primary/50 shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden group cursor-none relative">
                {/* Subtle gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${specialization.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none`}
                />

                <CardHeader className="pb-4 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-4 rounded-xl bg-muted/50 border border-border/50 group-hover:border-primary/30 group-hover:scale-110 transition-all duration-500 ${specialization.iconColor}`}
                    >
                      {specialization.icon}
                    </div>
                    <Sparkles className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <CardTitle className="text-2xl tracking-tight group-hover:text-primary transition-colors">
                    {specialization.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 flex flex-col flex-grow">
                  <p className="text-muted-foreground mb-8 leading-relaxed flex-grow">
                    {specialization.description}
                  </p>
                  <div className="space-y-4 pt-6 border-t border-border/50">
                    {specialization.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-1">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border bg-card/20 p-1">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-50" />
            <div className="relative bg-card/80 backdrop-blur-xl rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                  <Rocket className="h-8 w-8" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">
                    Ready to innovate?
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Let's create something amazing together.
                  </p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-none"
                >
                  Start a Project
                  <Zap className="h-5 w-5 fill-current" />
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
