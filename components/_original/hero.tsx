"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Twitter, X } from "lucide-react";
import Link from "next/link";
import { SOCIAL_MEDIA } from "@/constants";
import Scene from "@/components/ui/scene";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, // custom easing for smooth elegance
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* 3D Scene Background */}
      <Scene />

      {/* Main Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto flex flex-col items-center sm:items-start text-center sm:text-left"
        >
          <motion.div variants={itemVariants} className="overflow-hidden">
            <span className="font-mono text-sm md:text-base text-muted-foreground uppercase tracking-widest mb-4 block">
              Janaka Chamith
            </span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="text-[12vw] sm:text-[8vw] md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tighter text-foreground mb-6 mix-blend-difference">
              Software<br />Engineer.
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="max-w-2xl">
            <p className="text-lg md:text-2xl text-muted-foreground font-light mb-10 leading-relaxed mix-blend-difference">
              Building full-stack web experiences for 3+ years — now blending
              them with the power of AI to create intelligent, premium interfaces.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <a href="#projects">
              <Button 
                size="lg" 
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-lg font-medium tracking-wide border border-transparent transition-all hover:scale-105 active:scale-95"
              >
                View Work <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>

            <div className="flex gap-4 items-center">
              <Link href={SOCIAL_MEDIA.github} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-primary/10 border border-transparent hover:border-border transition-all">
                  <Github className="h-5 w-5 text-foreground" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
              <Link href={SOCIAL_MEDIA.linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-primary/10 border border-transparent hover:border-border transition-all">
                  <Linkedin className="h-5 w-5 text-foreground" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </Link>
              <Link href={SOCIAL_MEDIA.x} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-primary/10 border border-transparent hover:border-border transition-all">
                  <X className="h-5 w-5 text-foreground" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle bottom gradient for blending into next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </section>
  );
}
