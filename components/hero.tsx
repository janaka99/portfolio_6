"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Twitter, X } from "lucide-react";
import Link from "next/link";
import { SOCIAL_MEDIA } from "@/constants";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY + window.scrollY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-[calc(100svh-96px)] md:min-h-[576px] flex items-center justify-center py-20">
      {/* Interactive spotlight effect */}
      <div
        className="absolute pointer-events-none w-[300px] aspect-square rounded-full top-0 left-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 hover:from-pink-600/5 hover:to-purple-600/5 blur-lg"
        style={{
          //   background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 50%)",
          transform: `translate(${mousePosition.x + 50}px, ${
            mousePosition.y - 300
          }px)`,
          transition: "transform 0.05s ease-out",
        }}
      />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-7xl font-bold bg-clip-text p-3 text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 mb-6">
              Software Engineer
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xl text-muted-foreground mb-8">
              Building full-stack web experiences for 3+ years — now blending
              them with the power of AI.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <a href="#projects">
              <Button size="lg" variant="darkBlue">
                View Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            {/* <Button size="lg" variant="outline">
              Download Resume
            </Button> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center gap-4 mt-8"
          >
            <Link
              href={SOCIAL_MEDIA.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-purple-100"
              >
                <Github className="h-5 w-5 text-purple-500" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            <Link
              href={SOCIAL_MEDIA.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-cyan-100"
              >
                <Linkedin className="h-5 w-5 text-cyan-500" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </Link>
            <Link
              href={SOCIAL_MEDIA.x}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-pink-100"
              >
                <X className="h-6 w-6 text-black" />
                <span className="sr-only">Twitter</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
